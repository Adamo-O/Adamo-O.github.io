import { useEffect, useRef } from "react";

/**
 * Ambient particle flow field for the hero (canvas 2D, no deps).
 *
 * - Value-noise flow field on a 24 px lattice, evolving over time.
 * - Pointer push/pull (alternating by particle parity) read from the
 *   canvas's PARENT so hero text stays clickable/selectable.
 * - Pauses fully (no rAF) when off-screen or the tab is hidden.
 * - prefers-reduced-motion: renders one static frame, never animates.
 * - (hover: none): fewer particles, slower drift, no pointer influence.
 * - Colours come from CSS variables (`--c-accent` by default) and are
 *   re-read on the `themechange` CustomEvent dispatched on `document`.
 */
export interface ParticleFieldProps {
  /** Particles per 10 000 css px². Default 0.9. */
  density?: number;
  /** Hard cap on particle count. Default 180. */
  maxParticles?: number;
  /** Pointer influence radius in css px. Default 140. */
  influenceRadius?: number;
  /** Base px/frame at 60 fps. Default 0.35. */
  speed?: number;
  /** CSS custom property holding an "r g b" triplet. Default '--c-accent'. */
  colorVar?: string;
  /** Stroke alpha. Auto: 0.35 light / 0.5 dark. */
  alpha?: number;
  className?: string;
}

const STRIDE = 6; // x, y, vx, vy, px, py
const CELL = 24; // flow-field lattice size in css px
const FADE = 0.18; // per-frame trail fade
const STATIC_STEPS = 90; // steps simulated for the reduced-motion frame
const MIN_DT = 12; // ms; skip frames faster than this (120 Hz displays)
const FALLBACK_ACCENT = "52 79 151"; // #344f97, matches --c-accent light

// Deterministic lattice hash -> [0, 1)
function hash3(ix: number, iy: number, it: number): number {
  let h = (ix * 374761393 + iy * 668265263 + it * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

// Trilinear value noise in (x, y, t) space -> [0, 1)
function noise3(x: number, y: number, t: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const t0 = Math.floor(t);
  const fx = smooth(x - x0);
  const fy = smooth(y - y0);
  const ft = smooth(t - t0);
  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
  const n = (dx: number, dy: number, dt: number) => hash3(x0 + dx, y0 + dy, t0 + dt);
  const a = lerp(lerp(n(0, 0, 0), n(1, 0, 0), fx), lerp(n(0, 1, 0), n(1, 1, 0), fx), fy);
  const b = lerp(lerp(n(0, 0, 1), n(1, 0, 1), fx), lerp(n(0, 1, 1), n(1, 1, 1), fx), fy);
  return lerp(a, b, ft);
}

/**
 * The element the canvas fills and whose pointer events we read. Astro wraps
 * islands in <astro-island style="display:contents">, so `parentElement` is
 * not the positioned hero box; `offsetParent` is (the canvas is absolute).
 */
function resolveHost(canvas: HTMLCanvasElement): HTMLElement | null {
  const op = canvas.offsetParent;
  if (op instanceof HTMLElement && op !== document.body) return op;
  let el = canvas.parentElement;
  while (el && getComputedStyle(el).display === "contents") el = el.parentElement;
  return el;
}

function readVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ParticleField({
  density = 0.9,
  maxParticles = 180,
  influenceRadius = 140,
  speed = 0.35,
  colorVar = "--c-accent",
  alpha,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas ? resolveHost(canvas) : null;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // ---- media queries -------------------------------------------------
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNoHover = window.matchMedia("(hover: none)");
    let reduced = mqReduce.matches;
    const touch = mqNoHover.matches;

    const effDensity = touch ? density * 0.6 : density;
    const effSpeed = touch ? speed * 0.7 : speed;
    const timeStep = touch ? 0.0028 : 0.004;
    const pointerEnabled = !touch;

    // ---- state ---------------------------------------------------------
    let w = 0;
    let h = 0;
    let dpr = 1;
    let count = 0;
    let particles = new Float32Array(0);
    let time = Math.random() * 1000;
    let stroke = `rgb(${FALLBACK_ACCENT} / 0.35)`;
    let raf = 0;
    let lastTs = 0;
    let visible = true;
    let pointerX = -1;
    let pointerY = -1;
    let pointerActive = false;
    let resizeTimer = 0;
    let disposed = false;

    // ---- colour --------------------------------------------------------
    const refreshColors = () => {
      const accent = readVar(colorVar) || FALLBACK_ACCENT;
      const isDark = document.documentElement.classList.contains("dark");
      const a = alpha ?? (isDark ? 0.5 : 0.35);
      stroke = `rgb(${accent} / ${a})`;
    };

    // ---- geometry ------------------------------------------------------
    const seed = () => {
      const target = Math.min(maxParticles, Math.round((w * h * effDensity) / 10_000));
      count = w > 0 && h > 0 ? Math.max(0, target) : 0;
      particles = new Float32Array(count * STRIDE);
      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        const x = Math.random() * w;
        const y = Math.random() * h;
        const ang = Math.random() * Math.PI * 2;
        particles[o] = x;
        particles[o + 1] = y;
        particles[o + 2] = Math.cos(ang) * effSpeed;
        particles[o + 3] = Math.sin(ang) * effSpeed;
        particles[o + 4] = x;
        particles[o + 5] = y;
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = Math.max(0, Math.round(rect.width));
      h = Math.max(0, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      seed();
    };

    // ---- simulation ----------------------------------------------------
    const step = (dtScale: number, usePointer: boolean) => {
      time += timeStep * dtScale;
      const r = influenceRadius;
      const r2 = r * r;
      const maxV = effSpeed * 3;
      const lerpK = 0.08 * dtScale;
      const pushK = effSpeed * 0.6 * dtScale;
      const px = pointerX;
      const py = pointerY;
      const pointerOn = usePointer && pointerActive;

      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        let x = particles[o];
        let y = particles[o + 1];
        let vx = particles[o + 2];
        let vy = particles[o + 3];

        // flow-field target direction
        const ang = noise3(x / CELL, y / CELL, time) * Math.PI * 2;
        vx += (Math.cos(ang) * effSpeed - vx) * lerpK;
        vy += (Math.sin(ang) * effSpeed - vy) * lerpK;

        // radial pointer push (even) / pull (odd), quadratic falloff
        if (pointerOn) {
          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const fall = 1 - d / r;
            const f = fall * fall * pushK * (i & 1 ? -1 : 1);
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }

        // clamp speed
        const v2 = vx * vx + vy * vy;
        if (v2 > maxV * maxV) {
          const s = maxV / Math.sqrt(v2);
          vx *= s;
          vy *= s;
        }

        particles[o + 4] = x;
        particles[o + 5] = y;
        x += vx * dtScale;
        y += vy * dtScale;

        // wrap; reset prev so no line is drawn across the canvas
        let wrapped = false;
        if (x < 0) { x += w; wrapped = true; }
        else if (x >= w) { x -= w; wrapped = true; }
        if (y < 0) { y += h; wrapped = true; }
        else if (y >= h) { y -= h; wrapped = true; }
        if (wrapped) {
          particles[o + 4] = x;
          particles[o + 5] = y;
        }

        particles[o] = x;
        particles[o + 1] = y;
        particles[o + 2] = vx;
        particles[o + 3] = vy;
      }
    };

    const draw = () => {
      // Fade existing trails toward transparent (keeps the page's grid paper
      // visible behind the canvas instead of accumulating an opaque bg fill).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      ctx.strokeStyle = stroke;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        ctx.moveTo(particles[o + 4], particles[o + 5]);
        ctx.lineTo(particles[o], particles[o + 1]);
      }
      ctx.stroke();
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < STATIC_STEPS; i++) {
        step(1, false);
        draw();
      }
    };

    // ---- loop control --------------------------------------------------
    const frame = (ts: number) => {
      raf = 0;
      if (disposed || reduced || !visible || document.hidden) return;
      const dt = lastTs ? ts - lastTs : 16.7;
      if (dt < MIN_DT) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastTs = ts;
      const dtScale = Math.min(dt / 16.7, 2);
      step(dtScale, pointerEnabled);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const syncLoop = () => {
      const shouldRun = !disposed && !reduced && visible && !document.hidden;
      if (shouldRun && !raf) {
        lastTs = 0;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        pointerActive = false;
      }
    };

    // ---- listeners -----------------------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerEnabled || reduced) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
    };
    const onVisibility = () => syncLoop();
    const onTheme = () => refreshColors();
    const onReduceChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      if (reduced) {
        syncLoop();
        renderStatic();
      } else {
        syncLoop();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((en) => en.isIntersecting);
        syncLoop();
      },
      { threshold: 0 },
    );
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed) return;
        resize();
        if (reduced) renderStatic();
      }, 150);
    });

    // ---- mount ---------------------------------------------------------
    refreshColors();
    resize();
    if (reduced) renderStatic();

    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("themechange", onTheme);
    mqReduce.addEventListener("change", onReduceChange);
    io.observe(canvas);
    ro.observe(parent);
    syncLoop();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.clearTimeout(resizeTimer);
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("themechange", onTheme);
      mqReduce.removeEventListener("change", onReduceChange);
      io.disconnect();
      ro.disconnect();
    };
  }, [density, maxParticles, influenceRadius, speed, colorVar, alpha]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`.trim()}
    />
  );
}
