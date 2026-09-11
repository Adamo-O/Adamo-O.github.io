# 009 — Stop the sidebar labels being crushed during collapse/expand

- **Status**: DONE 2026-09-11 (mask step abandoned — see note)
- **Commit**: ba07772
- **Severity**: HIGH
- **Category**: Performance (§5) + Easing & duration (§2)
- **Estimated scope**: 1 file (`src/styles/globals.css`), ~40 lines

## Problem

Two defects compound into the visible "text gets crushed" effect when the rail
collapses or expands.

**1. A layout property is animated.** The grid track itself is transitioned, so
every frame re-lays-out the whole page: the main column's width changes, and all
body text in every section reflows 60×/second.

```css
/* src/styles/globals.css:253 — current */
.sidebar-shell {
  grid-template-columns: 220px minmax(0, 1fr);
  transition: grid-template-columns var(--dur) var(--ease-in-out);
}
```

**2. The label fade is timed into the clipping window.** Labels are
`white-space: nowrap` inside `overflow: hidden`, so as the track narrows the text
is hard-clipped at the container edge. The fade-in is delayed 80ms against a
200ms track animation, so labels become visible at 80ms — when the column is only
~55% open — and are painted mid-word against a hard clip edge for the remaining
120ms.

```css
/* src/styles/globals.css:302 — current (expanded state) */
.sidebar-copy,
.sidebar-nav-label,
.sidebar-source,
.sidebar-social-item {
  opacity: 1;
  visibility: visible;
  transition:
    opacity var(--dur-fast) var(--ease-out) 80ms,
    visibility 0s linear 0s;
}
```

**Honest scope limit:** collapsing a sidebar inherently changes the content
area's width, so *some* reflow is unavoidable in this layout. This plan does not
claim to make the animation layout-free. It (a) removes the perceived crush, and
(b) contains the reflow so it costs less.

## Target

```css
/* target — src/styles/globals.css */

/* Panel curve: the playbook's iOS-like drawer easing, which reads better for a
   sliding panel than the strong ease-in-out used for on-screen morphs. */
:root {
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}

.sidebar-shell {
  grid-template-columns: 220px minmax(0, 1fr);
  transition: grid-template-columns var(--dur) var(--ease-drawer);
}

/* Contain the reflow: the rail's internals must not cascade, and sections below
   the fold must not re-lay-out while the track animates. */
.sidebar {
  contain: layout style;
}

/* Soften the clip edge into a fade so text never hard-cuts mid-word. */
.sidebar-nav-label,
.sidebar-copy {
  -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 14px), transparent 100%);
  mask-image: linear-gradient(90deg, #000 calc(100% - 14px), transparent 100%);
}

/* Expanding: hold the labels back until the track has essentially settled
   (200ms), then fade in over 120ms. Total 320ms, inside the 200–500ms drawer
   budget. Labels are never painted while the container is mid-clip. */
.sidebar-copy,
.sidebar-nav-label,
.sidebar-source,
.sidebar-social-item {
  opacity: 1;
  visibility: visible;
  transition:
    opacity var(--dur-fast) var(--ease-out) var(--dur),
    visibility 0s linear 0s;
}

/* Collapsing: labels leave first and fast, so the track closes over empty space
   rather than over shrinking text. Asymmetric by design (playbook §4). */
html.sidebar-compact .sidebar-copy,
html.sidebar-compact .sidebar-nav-label,
html.sidebar-compact .sidebar-source,
html.sidebar-compact .sidebar-social-item {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 90ms var(--ease-out),
    visibility 0s linear 90ms;
}
```

## Repo conventions to follow

- Motion tokens live at the top of `src/styles/globals.css` in `:root`
  (`--dur-fast: 120ms; --dur: 200ms; --dur-slow: 320ms;` and `--ease`,
  `--ease-out`, `--ease-in-out`). Add `--ease-drawer` beside them, at
  `src/styles/globals.css:55`.
- All sidebar rules live inside the single `@media (min-width: 1024px)` block
  starting at `src/styles/globals.css:251`. Keep them there.
- Reduced motion is handled globally by zeroing `--dur*` at
  `src/styles/globals.css:520`. Because every duration and delay above is
  expressed with those tokens, reduced motion is inherited automatically — do
  NOT add a separate reduced-motion block.
- Exemplar of the established comment style for a non-obvious motion decision:
  `src/styles/globals.css:64` ("nowrap at ALL widths, not just when compact…").

## Steps

1. In `:root` at `src/styles/globals.css:55`, add
   `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);` after `--ease-in-out`.
2. At `src/styles/globals.css:255`, change the `.sidebar-shell` transition easing
   from `var(--ease-in-out)` to `var(--ease-drawer)`. Leave the duration at
   `var(--dur)`.
3. Add `contain: layout style;` to the existing `.sidebar` rule (the one that
   currently sets `position: sticky; z-index: 20;`).
4. Add the mask-image pair to `.sidebar-nav-label, .sidebar-copy` inside the same
   media block. Include BOTH `-webkit-mask-image` and `mask-image`.
5. At `src/styles/globals.css:302`, change the expanded-state opacity delay from
   the literal `80ms` to `var(--dur)`.
6. In the `html.sidebar-compact` fade-out rule, change the opacity duration from
   `var(--dur-fast)` to `90ms` and the visibility delay to `90ms`.

## Boundaries

- Do NOT touch `src/components/layout/Sidebar.astro`, `NavPills.astro` or
  `LabPass.astro` — this plan is CSS-only.
- Do NOT change markup or class names.
- Do NOT remove `white-space: nowrap` from `.sidebar-copy` / `.sidebar-nav-label`;
  it prevents a separate reflow bug (identity text wrapping mid-transition).
- Do NOT add dependencies.
- Do NOT convert the grid-track animation to transforms — that requires a layout
  re-architecture and is explicitly out of scope here.
- If a step doesn't match what you find, STOP and report rather than improvising.

## Verification

- **Mechanical**: `npm run build` — expect "0 errors" and
  "Build verification passed".
- **Feel check**: open the site at ≥1280px and toggle with ⌘B and the rail button:
  - Expanding: labels must NOT appear until the rail has stopped widening. No
    partially-clipped word should ever be visible.
  - Collapsing: labels must be gone before the rail finishes narrowing.
  - The right edge of any label that does clip should fade out, not hard-cut.
  - Spam ⌘B rapidly: the animation must retarget from its current position, never
    restart from zero (CSS transitions do this; confirm it visually).
  - DevTools → Animations panel at 10% speed: confirm the label fade begins only
    after the track animation ends on expand.
  - DevTools → Rendering → "Emulate prefers-reduced-motion: reduce": the toggle
    should become instant with no movement.
- **Done when**: no clipped text is visible at any point in either direction at
  10% playback speed, and `npm run build` passes.

## Execution note — 2026-09-11

Steps 1, 2, 3, 5 and 6 landed as written. **Step 4 (the clip-edge mask) was
implemented, observed to be wrong, and reverted.** `.sidebar-nav-label` and
`.sidebar-copy` are sized to their own text, so a trailing `mask-image` fade ate
real glyphs at rest — "Research" rendered as "Researc" with the tail faded. The
mask was only ever insurance against text being painted mid-clip, and step 5's
retiming (fade-in delayed a full `--dur`, fade-out cut to 90ms) already
guarantees that, so the mask was dropped rather than patched with padding.

Verified: `--ease-drawer` resolves to `cubic-bezier(0.32, 0.72, 0, 1)` and is on
the track; label transition computes to `opacity 0.12s ... 0.2s`; `.sidebar`
carries `contain: layout style`. Build clean.

**Not verified:** the timeline itself. The Browser pane stays hidden during
development, so `document.hidden` is true and transitions do not run there —
opacity sampled 1 at every timestep because the state had already snapped. The
10%-playback feel check in the Verification section above still needs a human.
