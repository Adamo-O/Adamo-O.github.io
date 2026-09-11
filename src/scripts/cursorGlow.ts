/**
 * A soft accent orb that trails the cursor behind the page content.
 *
 * Desktop only, and deliberately cheap: the orb is one fixed element moved with
 * `transform` (compositor-accelerated) rather than by animating a gradient's
 * position, which would repaint a full-viewport layer every frame. One rAF runs
 * only while the orb is still easing toward the pointer, then stops.
 *
 * Skipped entirely when: the pointer is coarse or hover is unavailable (touch),
 * the viewport is under 1024px, or the user prefers reduced motion. Nothing is
 * inserted into the DOM in those cases.
 */
const EASE = 0.085; // per-frame approach factor
const SETTLE = 0.4; // px; below this the loop parks itself

export function initCursorGlow(): void {
  if (typeof window === "undefined") return;

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const wide = window.matchMedia("(min-width: 1024px)");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  let orb: HTMLElement | null = null;
  let raf = 0;
  let tx = 0;
  let ty = 0;
  let x = 0;
  let y = 0;
  let seeded = false;

  const enabled = () => fine.matches && wide.matches && !still.matches;

  const render = () => {
    raf = 0;
    if (!orb) return;
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    orb.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (Math.abs(tx - x) > SETTLE || Math.abs(ty - y) > SETTLE) {
      raf = requestAnimationFrame(render);
    }
  };

  const onMove = (event: PointerEvent) => {
    if (!orb) return;
    tx = event.clientX;
    ty = event.clientY;
    if (!seeded) {
      // First move: jump rather than sweep in from the corner.
      seeded = true;
      x = tx;
      y = ty;
      orb.style.opacity = "1";
    }
    if (!raf) raf = requestAnimationFrame(render);
  };

  const mount = () => {
    if (orb) return;
    orb = document.createElement("div");
    orb.className = "cursor-glow";
    orb.setAttribute("aria-hidden", "true");
    document.body.appendChild(orb);
    window.addEventListener("pointermove", onMove, { passive: true });
  };

  const unmount = () => {
    if (!orb) return;
    window.removeEventListener("pointermove", onMove);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    seeded = false;
    orb.remove();
    orb = null;
  };

  const sync = () => (enabled() ? mount() : unmount());

  sync();
  fine.addEventListener("change", sync);
  wide.addEventListener("change", sync);
  still.addEventListener("change", sync);

  // No point easing toward a pointer nobody is moving.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
}

initCursorGlow();
