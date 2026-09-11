/**
 * Restrained halftone field for the hero (canvas 2D, no deps, no framework).
 *
 * A dot lattice whose radii are modulated by a slow concentric wave, plus a
 * local swell under the pointer. Deliberately quiet: the reference effects run
 * white-on-black at full contrast, this runs one accent hue at ~0.2 alpha and is
 * masked so it never sits under the copy at strength.
 *
 * - Dark mode only. In light mode nothing is drawn and no rAF runs; the page
 *   keeps its plain wash + grain. Re-checked on the `themechange` CustomEvent.
 * - All dots share one colour, so each frame builds ONE Path2D and fills once
 *   rather than issuing ~1,700 separate fill calls.
 * - Pauses fully (no rAF) when off-screen or the tab is hidden.
 * - prefers-reduced-motion: one static frame, never animates.
 * - (hover: none) / coarse pointer: wave only, no pointer influence.
 */
const CELL = 24; // px between dot centres
const R_MIN = 0.45;
const R_MAX = 1.55;
const WAVELENGTH = 96; // px per wave crest
const SPEED = 0.0011; // radians per ms
const INFLUENCE = 165; // px; pointer falloff radius
const CURSOR_GAIN = 1.35; // px added to radius at the pointer
const ALPHA = 0.2;
const ORIGIN = { x: 0.74, y: 0.3 }; // wave centre, as a fraction of the canvas

export function initHalftoneField(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let visible = true;
  let accent = "52 79 151";
  let mx = -9999;
  let my = -9999;
  let start = performance.now();

  const isDark = () => document.documentElement.classList.contains("dark");

  const readAccent = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--c-accent").trim();
    if (v) accent = v;
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(0, Math.round(rect.width));
    h = Math.max(0, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (now: number) => {
    raf = 0;
    if (!w || !h || !isDark()) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    const t = (now - start) * SPEED;
    const ox = w * ORIGIN.x;
    const oy = h * ORIGIN.y;
    const usePointer = fine.matches && mx > -9000;

    ctx.clearRect(0, 0, w, h);
    const path = new Path2D();

    for (let y = CELL / 2; y < h; y += CELL) {
      for (let x = CELL / 2; x < w; x += CELL) {
        const dx = x - ox;
        const dy = y - oy;
        const d = Math.sqrt(dx * dx + dy * dy);
        // (sin + 1) / 2 keeps the wave in 0..1 so radii never invert.
        const pulse = (Math.sin(d / WAVELENGTH - t) + 1) * 0.5;
        let r = R_MIN + pulse * (R_MAX - R_MIN);

        if (usePointer) {
          const px = x - mx;
          const py = y - my;
          const pd = Math.sqrt(px * px + py * py);
          if (pd < INFLUENCE) {
            const k = 1 - pd / INFLUENCE;
            r += CURSOR_GAIN * k * k;
          }
        }

        path.moveTo(x + r, y);
        path.arc(x, y, r, 0, Math.PI * 2);
      }
    }

    ctx.fillStyle = `rgb(${accent} / ${ALPHA})`;
    ctx.fill(path);

    if (!still.matches && visible && !document.hidden && isDark()) {
      raf = requestAnimationFrame(draw);
    }
  };

  const kick = () => {
    if (raf || !visible || document.hidden) return;
    if (!isDark()) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    raf = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  resize();
  readAccent();

  new ResizeObserver(() => {
    resize();
    stop();
    kick();
  }).observe(canvas);

  new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      visible ? kick() : stop();
    },
    { rootMargin: "120px" },
  ).observe(canvas);

  if (fine.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const rect = canvas.getBoundingClientRect();
        mx = event.clientX - rect.left;
        my = event.clientY - rect.top;
        kick();
      },
      { passive: true },
    );
  }

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : kick()));

  kick();
  document.addEventListener("themechange", () => {
    readAccent();
    stop();
    start = performance.now();
    kick();
  });
}

document.querySelectorAll<HTMLCanvasElement>("canvas[data-halftone]").forEach(initHalftoneField);
