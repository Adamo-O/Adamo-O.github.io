# 002 — Stabilize sidebar collapse motion

- **Status**: DONE
- **Commit**: 28714cd
- **Severity**: HIGH
- **Category**: Physicality and origin; performance; interruptibility
- **Estimated scope**: 2 files, about 70 lines

## Problem

The desktop sidebar changes alignment, padding, display, and flex direction in the same frame that its grid column begins shrinking. The navigation icons therefore jump to the center of the still-wide 220 px rail before travelling back to their final x-position in the 72 px rail. A Chromium frame sample at 1440 x 900 confirmed the first navigation icon moves from x=36 to x=110 in one frame, then returns through x=87, 68, 56, and 48 before settling at x=36. The collapse control similarly jumps from x=185 to x=110 before moving left.

```css
/* src/styles/globals.css:217-248 — current */
.sidebar-shell {
  grid-template-columns: 220px minmax(0, 1fr);
  transition: grid-template-columns var(--dur) var(--ease);
}

.sidebar {
  transition: padding var(--dur) var(--ease);
}

html.sidebar-compact .sidebar-shell {
  grid-template-columns: 72px minmax(0, 1fr);
}

html.sidebar-compact .sidebar {
  padding-inline: 0.75rem;
}

html.sidebar-compact .sidebar-identity,
html.sidebar-compact .sidebar-nav-link {
  justify-content: center;
  padding-inline: 0.5rem;
}
```

```css
/* src/styles/globals.css:277-301 — current */
html.sidebar-compact .sidebar-copy,
html.sidebar-compact .sidebar-nav-label,
html.sidebar-compact .sidebar-source {
  display: none;
}

html.sidebar-compact .sidebar-utilities {
  flex-direction: column;
  justify-content: center;
}

html.sidebar-compact .sidebar-social-item {
  display: none;
}

html.sidebar-compact .sidebar-collapse-icon { display: none; }
html.sidebar-compact .sidebar-expand-icon { display: block; }
```

## Target

Keep the navigation icons at the same x-coordinate throughout the transition. The 44 px identity mark begins 10 px to the right of that lane in the expanded layout, so move it smoothly into compact alignment with `transform: translateX(-10px)` over the same 200ms `--ease-in-out` curve. Animate the 220 px to 72 px grid-column morph over exactly 200ms with the existing `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` token. Do not change sidebar padding or link alignment between states.

Labels and identity copy must remain in layout with `min-inline-size: 0` and `overflow: hidden`; apply `white-space: nowrap` only to the navigation labels and source label so the expanded identity copy retains its existing line wrapping. Compact mode changes only `opacity`, `visibility`, and `pointer-events`. Fade out over 120ms using `var(--ease-out)` with no delay. On expansion, make the content visible immediately but delay its 120ms fade-in by 80ms so text does not appear inside the still-narrow rail.

Make the utility area a fixed 76 px-high positioning context. Keep social icons in normal flow. Position the theme control and sidebar control absolutely against the bottom-right corner:

- sidebar control: `right: 0; bottom: 0`
- theme control in expanded mode: `right: 0; bottom: 0; transform: translateX(-40px)`
- theme control in compact mode: `transform: translateY(-40px)`

This lets the collapse control follow the rail's moving right edge continuously. The theme control moves diagonally into the compact vertical stack with an interruptible transform transition. Both use exactly `transform 200ms var(--ease-in-out)`.

Crossfade the `PanelLeftClose` and `PanelLeftOpen` glyphs in place over 160ms with `var(--ease-out)`. Both glyphs occupy the same absolute center. The outgoing glyph moves from `opacity: 1; transform: rotate(0)` to `opacity: 0; transform: rotate(12deg)`. The incoming glyph moves from `opacity: 0; transform: rotate(-12deg)` to `opacity: 1; transform: rotate(0)`.

## Repo conventions to follow

- Motion tokens already live in `src/styles/globals.css:42-49`; use `--dur: 200ms`, `--dur-fast: 120ms`, `--ease-out`, and `--ease-in-out`. Add no new tokens.
- The site-wide `prefers-reduced-motion` rule in `src/styles/globals.css` already reduces all transition durations to `0.01ms`; do not add a second reduced-motion system.
- Sidebar state remains the `html.sidebar-compact` class managed by `src/components/layout/Sidebar.astro:93-117` and persisted in `localStorage`. Do not change this state model.
- Existing tooltip behavior for compact navigation links in `src/styles/globals.css:250-275` remains unchanged.

## Steps

1. In `src/components/layout/Sidebar.astro`, add `relative h-[4.75rem]` to `.sidebar-utilities`. Remove `ml-auto` from the theme-control list item and add the class `sidebar-theme-item`. Add `sidebar-toggle-item` to the sidebar-control list item. Remove `hidden` from `PanelLeftOpen`; both panel glyphs must be present for the crossfade.
2. In `src/styles/globals.css`, change `.sidebar-shell` to `transition: grid-template-columns var(--dur) var(--ease-in-out)`. Delete the `.sidebar` padding transition and the compact padding override.
3. Delete the compact `justify-content` and `padding-inline` override for `.sidebar-identity` and `.sidebar-nav-link`. The expanded geometry is the permanent icon lane.
4. Give `.sidebar-copy`, `.sidebar-nav-label`, `.sidebar-source`, and `.sidebar-social-item` the target fade behavior. Keep them rendered; delete every compact `display: none`. Ensure `.sidebar-copy` and `.sidebar-nav-label` can shrink without moving their preceding icon. Set compact navigation links to `gap: 0` only after confirming this does not change the icon's left edge. Transition `.sidebar-identity-mark` with `transform var(--dur) var(--ease-in-out)` and apply `translateX(-10px)` only in compact mode so it ends centered on the icon lane.
5. Add the absolute positioning and transform rules from Target for `.sidebar-theme-item` and `.sidebar-toggle-item`. In compact mode, hide overflow on `.sidebar-utilities` so invisible social rows cannot protrude.
6. Replace the display swap for `.sidebar-collapse-icon` and `.sidebar-expand-icon` with the 160ms opacity and rotation crossfade from Target. Center both glyphs absolutely inside the existing 36 px button.

## Boundaries

- Do NOT change the expanded width of 220 px or compact width of 72 px.
- Do NOT animate padding, margin, width, left, right, top, or bottom. The only moving child properties are `transform` and `opacity`; the existing grid-column transition is the deliberate layout exception.
- Do NOT add Framer Motion, another dependency, keyframes, springs, blur, bounce, or scale.
- Do NOT change navigation labels, icons, scroll-spy behavior, tooltips, colors, borders, or sidebar persistence.
- Do NOT modify mobile navigation or any breakpoint below 1024 px.
- If the source no longer matches commit `28714cd`, STOP and report the drift instead of improvising.

## Verification

- **Mechanical**: run `npm run check`, `npm run build`, and `git diff --check`; all must exit 0 with no Astro or TypeScript diagnostics.
- **Feel check**: at 1440 x 900, repeatedly collapse and expand the sidebar, including reversing it before 200ms completes. Confirm:
  - the first navigation icon remains centered at x=36 for every sampled frame;
  - the identity mark glides exactly 10 px left into compact alignment without jumping;
  - the sidebar control follows the rail edge continuously and never teleports to the old rail center;
  - labels fade only after there is enough width and never overlap the main content;
  - the theme control moves smoothly into and out of the vertical compact stack;
  - the panel glyphs crossfade in one fixed button without a layout shift.
- Sample `getBoundingClientRect()` on every `requestAnimationFrame` during collapse. The nav icon's center must remain within 1 px of its initial x-coordinate. The sidebar control must follow one monotonic path from the expanded rail edge to the compact rail edge, with no initial teleport toward the old rail center. Do not impose a per-frame distance cap: the required strong 200ms ease-in-out curve is intentionally fastest near its midpoint.
- Emulate `prefers-reduced-motion: reduce`; confirm the state changes effectively instantly, all controls remain usable, and there is no intermediate displaced icon frame.
- **Done when**: rapid reversals remain continuous, normal and reduced-motion checks pass, navigation retains keyboard/focus behavior, and the mechanical checks pass.

## Execution result — 2026-09-08

Implemented in isolated-worktree commits `17ce1b5` and `ba07e33`, then integrated into `main` as `437c672` and `e55bbb6`. Frame sampling at 1440 x 900 showed the navigation icon centered at x=36 for every collapse and rapid-reversal frame. The identity mark moved monotonically from x=46 to x=36, and the sidebar control followed the rail edge from x=185 to x=37 without the former x=110 teleport. Rapid reversal retargeted from the current position, Enter preserved focus and updated `aria-expanded`, and reduced-motion forced all relevant transitions to `0.00001s`. `npm run check`, `npm run build`, `git diff --check`, page-content checks, overlay checks, and browser error checks all passed.
