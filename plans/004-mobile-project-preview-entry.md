# 004 — Animate project previews on mobile entry

- **Status**: DONE
- **Severity**: MEDIUM
- **Category**: Scroll-triggered motion; interaction parity
- **Estimated scope**: 1 file, about 45 lines

## Problem

The CommunityGrid two-screen preview reacts through `article:hover`, which on touch devices usually means a tap. It therefore stays visually inert when the card naturally scrolls into view.

## Target

Keep hover behavior for fine pointers. For coarse/no-hover pointers, observe each multi-screen preview and add a card state when at least half of the stage is visible. The state should reuse the existing restrained transforms, moving the two screens a few pixels toward upright over `var(--dur-slow)` and `var(--ease-out)`. Remove the state after it leaves the viewport so it can respond again on a later visit.

Skip the observer entirely under `prefers-reduced-motion: reduce`; the existing reduced-motion style must leave the screens static and readable.

## Boundaries

- Do not autoplay the motion on desktop or replace desktop hover behavior.
- Do not use scroll event handlers, parallax, continuous scroll-linked transforms, or a new library.
- Do not change the preview images, crop, card height, or screen geometry.

## Verification

- At 390 x 844 with touch/coarse-pointer emulation, scroll CommunityGrid from below the fold into the viewport without tapping; confirm the screen stack settles once visible.
- Scroll it out and back; confirm the state retargets without a jump.
- Confirm desktop hover still works and mobile taps are no longer required.
- Confirm reduced motion has no transition.
- Run `npm run check`, `npm run build`, and `git diff --check`.

## Execution result — 2026-09-08

Implemented in isolated-worktree commit `41d9ec9` and integrated into `main` as `ab42431`. A Chromium CDP check at 393 x 852 with five touch points verified `(hover: none)` and `(pointer: coarse)`, then observed CommunityGrid switching from inactive off-screen to active at 50% visibility and back to inactive after exit. Desktop hover remains isolated to fine pointers, and reduced motion leaves the screens static. Build, Astro diagnostics, dist verification, browser error checks, and `git diff --check` passed.
