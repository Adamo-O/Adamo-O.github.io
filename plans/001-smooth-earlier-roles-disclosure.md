# 001 — Smooth the Earlier roles disclosure

- **Status**: TODO
- **Commit**: bfab677
- **Severity**: LOW
- **Category**: Missed opportunities; easing and duration
- **Estimated scope**: 2 files, about 35 lines

## Problem

The low-frequency “Earlier roles” disclosure teleports its content between fully hidden and fully visible. Only the plus icon rotates, so the page-height change feels abrupt even though the control itself signals state.

```astro
<!-- src/pages/index.astro:167-179 — current -->
<details class="group rounded border border-line bg-surface/60">
  <summary class="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-sm font-semibold text-fg marker:hidden">
    Earlier roles
    <span class="meta transition-transform duration-fast group-open:rotate-45" aria-hidden="true">+</span>
  </summary>
  <div class="grid gap-4 border-t border-line p-4 md:p-5">
    {earlierExperiences.map((experience) => (
      <Experience frontmatter={experience.data} compact>
        <experience.Content />
      </Experience>
    ))}
  </div>
</details>
```

## Target

Keep the native `details`/`summary` semantics. Enhance browsers that support `::details-content` and intrinsic-size interpolation with an interruptible 220ms disclosure transition. The content should begin at zero block size, `opacity: 0`, and `translateY(-4px)`, then settle to intrinsic block size, full opacity, and no translation. Use the strong UI entrance curve from the animation audit.

```css
/* target tokens */
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}

@supports selector(details::details-content) {
  :root {
    interpolate-size: allow-keywords;
  }

  .earlier-roles::details-content {
    block-size: 0;
    overflow-y: clip;
    opacity: 0;
    transform: translateY(-4px);
    transition:
      content-visibility 220ms allow-discrete,
      block-size 220ms var(--ease-out),
      opacity 160ms var(--ease-out),
      transform 220ms var(--ease-out);
  }

  .earlier-roles[open]::details-content {
    block-size: auto;
    opacity: 1;
    transform: translateY(0);
  }
}
```

The `block-size` transition is a deliberate, bounded exception to the transform/opacity-only performance rule: the accordion must move the following page content, it is opened rarely, and it contains only a few static cards. Do not animate any descendant cards individually.

## Repo conventions to follow

- Shared motion tokens live in `src/styles/globals.css:29-32`. Add `--ease-out` beside `--ease`; do not replace the existing token globally.
- Reduced motion is already centralized at `src/styles/globals.css:306-321` and reduces every transition to `0.01ms`; do not add a second reduced-motion system.
- The current disclosure lives entirely in `src/pages/index.astro:167-179`. Add the semantic class `earlier-roles` to the existing `details` and replace the plus icon’s `duration-fast` with `duration-[200ms] ease-[var(--ease-in-out)]` only if an `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` token is added beside `--ease-out`.

## Steps

1. In `src/styles/globals.css`, add `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` and `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` beside the existing duration/easing tokens.
2. In `src/pages/index.astro`, add `earlier-roles` to the current `details` class list.
3. In the same file, change the plus icon transition to exactly `transition-transform duration-[200ms] ease-[var(--ease-in-out)] group-open:rotate-45`.
4. In `src/styles/globals.css`, add the `@supports selector(details::details-content)` block from Target after the base link styles and before desktop-sidebar rules. Keep the native instant disclosure as the fallback when the selector is unsupported.

## Boundaries

- Do NOT replace `details`/`summary` with custom button state or JavaScript.
- Do NOT add a motion dependency, keyframes, staggered card entrances, scale, blur, or bounce.
- Do NOT change experience content, ordering, card layout, colors, spacing, or borders as part of this plan.
- Do NOT modify the site-wide reduced-motion block.
- If the current markup no longer matches the excerpt from commit `bfab677`, STOP and report instead of improvising.

## Verification

- **Mechanical**: run `npm run check` and `npm run build`; both must exit 0 with no Astro or TypeScript diagnostics. Run `git diff --check`; it must emit nothing.
- **Feel check**: open the homepage at desktop width, scroll to Experience, and toggle “Earlier roles” repeatedly. Confirm:
  - content expands from the summary edge and settles without bounce;
  - the plus rotates continuously rather than snapping;
  - rapid open/close reversals retarget from the current visual state;
  - surrounding sections move over 220ms rather than teleporting;
  - no child card has its own entrance delay.
- In browser DevTools, set animation playback to 10% and confirm there is no overshoot or double exposure.
- Emulate `prefers-reduced-motion: reduce` and confirm the disclosure still works while the transitions complete effectively instantly through the existing global rule.
- **Done when**: native keyboard interaction still works, the disclosure is smooth in a supporting browser, unsupported browsers retain the native instant behavior, and all mechanical checks pass.
