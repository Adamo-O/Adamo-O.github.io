# 003 — Reveal theme changes from the toggle

- **Status**: READY
- **Severity**: MEDIUM
- **Category**: State transition; accessibility; progressive enhancement
- **Estimated scope**: 2 files, about 70 lines

## Problem

The theme toggle currently swaps all color tokens in one frame. The control is clear, but the page gives no spatial feedback connecting the click to the result.

## Target

Use the native View Transition API when available to reveal the new theme as an expanding circle centered on the clicked toggle. Calculate the radius to the farthest viewport corner, animate `clip-path` on `::view-transition-new(root)` for about 420ms with `var(--ease-out)`, and keep the old page underneath. Preserve the existing local-storage, accessible-label, and `themechange` behavior.

The enhancement must be interrupt-safe: ignore another toggle activation while a reveal is active, clean up its temporary root class in `finally`, and fall back to the current immediate swap when View Transitions are unavailable, animation setup fails, or reduced motion is requested.

## Boundaries

- Do not add a dependency, canvas layer, global crossfade, blur, bounce, or scale.
- Do not animate individual color properties across the page.
- Do not delay the fallback theme update.
- Do not change the toggle's visual design or persistence model.

## Verification

- Toggle light to dark and dark to light from every rendered theme control.
- Confirm the reveal begins at the activated control and reaches every viewport corner without exposing an unpainted region.
- Confirm a rapid second activation cannot overlap transitions.
- Confirm unsupported/reduced-motion paths update instantly and still dispatch `themechange`.
- Run `npm run check`, `npm run build`, and `git diff --check`.

