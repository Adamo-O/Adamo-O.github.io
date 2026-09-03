/**
 * Scroll-spy: one IntersectionObserver over the elements targeted by nav
 * hashes (normally `section[id]`) sets
 * `aria-current="true"` on every `[data-nav-link][href="#id"]`.
 * Safe to call from several components; it initialises once per page.
 */
let initialised = false;

export function initScrollSpy(): void {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"),
  );
  if (links.length === 0) return;

  const targets = new Set(
    links
      .map((l) => l.getAttribute("href") ?? "")
      .filter((h) => h.startsWith("#"))
      .map((h) => h.slice(1)),
  );
  const sections = Array.from(targets)
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
    .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  if (sections.length === 0) return;

  const setActive = (id: string) => {
    for (const link of links) {
      const isActive = link.getAttribute("href") === `#${id}`;
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  };

  // Track which sections currently intersect the "reading band" and pick
  // the topmost one so a short section is not skipped between two tall ones.
  const visible = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (entry.isIntersecting) visible.set(id, entry.boundingClientRect.top);
        else visible.delete(id);
      }
      if (visible.size === 0) return;
      const [topId] = Array.from(visible.entries()).sort((a, b) => a[1] - b[1])[0];
      setActive(topId);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((s) => observer.observe(s));

  // Initial state: honour the hash, else the first section.
  const hash = location.hash.slice(1);
  setActive(targets.has(hash) ? hash : sections[0].id);
}

initScrollSpy();
