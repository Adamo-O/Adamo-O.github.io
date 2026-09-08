# 005 — Retune the Additional roles disclosure

- **Status**: READY
- **Severity**: LOW
- **Category**: Timing; disclosure continuity
- **Estimated scope**: 2 files, about 20 lines

## Problem

The Additional roles disclosure reaches its full height in 220ms. For the amount of content being revealed, especially on mobile, opening feels abrupt. Closing is less problematic and should remain quicker.

## Target

Keep the native `details` element and existing intrinsic-size implementation. Retune opening to roughly 360ms for block size, 260ms for opacity, and 320ms for the small vertical settle, all with `var(--ease-out)`. Give the `[open]` state shorter transition durations so closing completes in about 240–260ms. Match the chevron to the asymmetry: about 340ms on opening and 220ms on closing.

## Boundaries

- Do not animate child cards individually.
- Do not add a spring, bounce, scale, delay cascade, or JavaScript height measurement.
- Preserve native keyboard, focus, and reduced-motion behavior.

## Verification

- Open and close with pointer and Enter; confirm the panel remains interruptible and focus stays on the summary.
- Rapidly reverse both directions; confirm the current state retargets without snapping.
- Confirm opening reads as more gradual than closing and reduced motion is effectively instant.
- Run `npm run check`, `npm run build`, and `git diff --check`.

