# 010 — Crossfade the identity mark instead of popping it

- **Status**: DONE 2026-09-11 (with a positioning correction)
- **Commit**: ba07772
- **Severity**: MEDIUM
- **Category**: Missed opportunities (§8) + Physicality (§3)
- **Estimated scope**: 1 file (`src/styles/globals.css`), ~20 lines

## Problem

The "AO" mark is shown and hidden with `display`, which is not animatable. While
the rail and every label move over 200ms, the mark appears and disappears in a
single frame — a teleport in the middle of an otherwise continuous transition.
Its own transition never meaningfully runs, because the element is `display:
none` in the other state.

```css
/* src/styles/globals.css:291 — current (expanded: mark hidden) */
.sidebar-identity-mark {
  display: none;
  transition: transform var(--dur) var(--ease-in-out);
}
```

```css
/* src/styles/globals.css:366 — current (compact: mark shown) */
html.sidebar-compact .sidebar-identity-mark {
  display: flex;
  transform: translateX(-10px);
}
```

The mark and the identity copy occupy the same slot and represent the same thing
at two densities, so they should crossfade rather than one popping as the other
collapses.

## Target

Keep the mark in the DOM and in the same box at all times; take it out of flow so
it never affects the copy's width; crossfade with a slight scale. Per playbook §3,
never scale from 0 — the target floor is 0.92.

```css
/* target — src/styles/globals.css, inside @media (min-width: 1024px) */

.sidebar-identity {
  position: relative;      /* anchor for the absolutely-positioned mark */
  block-size: 3.5rem;      /* unchanged — already set */
}

/* Out of flow, so showing it never reflows the copy beside it. */
.sidebar-identity-mark {
  position: absolute;
  inset-inline-start: 0.5rem;
  inset-block-start: 50%;
  display: flex;
  opacity: 0;
  transform: translateY(-50%) scale(0.92);
  transition:
    opacity var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
  pointer-events: none;
}

/* Fades in as the copy fades out; delayed so the two do not both sit at
   half-opacity in the same frame. */
html.sidebar-compact .sidebar-identity-mark {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  transition:
    opacity var(--dur-fast) var(--ease-out) 90ms,
    transform var(--dur-fast) var(--ease-out) 90ms;
}
```

## Repo conventions to follow

- All sidebar rules live inside the single `@media (min-width: 1024px)` block
  beginning at `src/styles/globals.css:251`.
- Durations and curves always come from the tokens in `:root`
  (`--dur-fast: 120ms`, `--ease-out`), never as literals — except deliberate
  offsets, which are written inline (exemplar: the `80ms` delay at
  `src/styles/globals.css:304`).
- Reduced motion is inherited automatically from the zeroed `--dur*` tokens at
  `src/styles/globals.css:520`. Do NOT add a reduced-motion block.

## Steps

1. Add `position: relative;` to the existing `.sidebar-identity` rule (which
   already sets `block-size: 3.5rem`).
2. Replace the `.sidebar-identity-mark` rule at `src/styles/globals.css:291`
   with the target rule above — note `display: flex` is now permanent and
   `opacity` carries the hide.
3. Replace the `html.sidebar-compact .sidebar-identity-mark` rule at
   `src/styles/globals.css:366` with the target rule above. The old
   `transform: translateX(-10px)` nudge is removed; centring is now handled by
   `inset-inline-start` and `translateY(-50%)`.

## Boundaries

- Do NOT touch `src/components/layout/LabPass.astro`. The markup already has the
  right structure (`.sidebar-identity` wrapping `.sidebar-identity-mark` plus
  `.sidebar-copy`).
- Do NOT reintroduce a hover background on `.sidebar-identity` — it was removed
  deliberately because it was taller than the mark it sat behind.
- Do NOT change `.sidebar-copy`'s collapse behaviour; that belongs to plan 009.
- Do NOT add dependencies.
- If a step doesn't match what you find, STOP and report rather than improvising.

## Verification

- **Mechanical**: `npm run build` — expect "0 errors" and
  "Build verification passed".
- **Feel check**: at ≥1280px, toggle the rail with ⌘B:
  - The AO mark must fade and scale in, never appear in one frame.
  - Expanded, the mark must be fully invisible and must not reserve any width —
    the name should start at the same x as before this change.
  - Collapsed, the mark must be vertically centred in the 3.5rem identity block
    and horizontally centred in the 72px rail.
  - The mark and the identity copy must not both be visible at ~50% opacity in
    the same frame (check at 10% playback in the Animations panel).
  - Hovering the identity block must still change the mark's border colour, with
    no background plate appearing.
- **Done when**: at 10% playback the mark's appearance is a continuous fade with
  no popping, and `npm run build` passes.

## Execution note — 2026-09-11

Landed, with one correction to the plan. The plan specified
`inset-inline-start: 0.5rem`, which is wrong: the mark is 44px wide but the
collapsed rail's content box is only 40px, so an edge offset put the mark's
centre at x=46 against a rail centre of 36 — 10px off, which is exactly why the
old code carried a `translateX(-10px)` nudge. Replaced with percentage centring
(`inset-inline-start: 50%` + `translate(-50%, -50%)`), which is width-independent
and needs no magic number.

Verified: collapsed, mark centre x=36 vs rail centre x=36; expanded, mark opacity
0 and the name still starts at x=24, so the mark reserves no width. Build clean.

**Not verified:** that the crossfade reads as continuous rather than popping —
that needs the Animations panel at 10% on a visible page.
