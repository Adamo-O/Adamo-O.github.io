# 008 — Revert plan 006, carry a keep-list forward

- **Status**: DONE (2026-09-11), uncommitted on `main`
- **Severity**: HIGH (reverses an entire uncommitted redesign)
- **Category**: Design direction; revert

## Why

Plan 006's redesign ("from cards on paper to ruled paper") was never committed. On review,
Adamo rejected its visual direction wholesale: monospace `.meta` on 96 elements, bracket
links, ruled/compact rows in place of cards, loss of the icon skill chips, a shortened
non-full-height hero, and a hero tagline narrowed to mobile agents. His words: "feels a ton
more templatey than before."

Diagnosis: **no commit was responsible.** `HEAD` had none of it — two commits on 2026-09-08
added PP Supply Mono (`22baab2`) and removed it again (`4d4bf08`); the third, uncommitted
reintroduction was plan 006. Same for the layout: `HEAD` already had today's section order,
and what changed was the card→rule material.

Because the batch collectively *was* 006's direction, selective per-file reverts were
rejected in favour of reverting to `HEAD` and re-applying a short keep-list.

## Backups taken before reverting (the batch existed nowhere else)

| Artifact | Location |
|---|---|
| `git stash` entry | `stash@{0}` — "plan-006 batch backup 2026-09-11" |
| Binary-safe patch | `scratchpad/plan-006-batch-tracked.patch` (87,823 lines) |
| Untracked files | `scratchpad/untracked/` (7 files) |
| Cleaned CrossCast media | `scratchpad/media-clean/` |
| Graph component | `scratchpad/ExplorationGraph.removed.tsx` |
| Mono `.meta` variant | `scratchpad/globals.mono-variant.css` |

A first patch attempt used plain `git diff` and silently omitted binary deltas; the cleaned
CrossCast media are binary working-tree edits, so it was redone with `--binary`. Scratchpad
copies are session-scoped — **move anything worth keeping into the repo or `~` before this
session ends.**

## Reverted (back to `HEAD`)

Monospace `.meta`; `.link-bracket` and its four consumers; ruled rows in
`Project`/`Experience`/`PublicationRow` (cards restored, `PublicationRow.astro` deleted in
favour of HEAD's `PublicationCard`); `Section.astro` width cap and padding; the hero
(tagline, structure, full-height `#about`); skill chips restored via `Skill.astro` +
`skillIcons.ts`; `PhoneFrame.astro`, `theme-song-stats.json` and the stats workflow dropped
(no consumer at HEAD).

`impactStats` was verified present at `HEAD` in the schema and both components, so the
SoftGolf and Theme Song figures survived the revert untouched — this was a precondition.

## Keep-list re-applied on top

1. **CrossCast P0.** `HEAD` still carried `video: /media/cross-cast.webm`, whose visible
   frames are partisan political tweets, and the *cleaned* re-recorded media existed only as
   working-tree binary edits. A blind `git checkout .` would have reinstated the original.
   Cleaned media restored and the `video:` line removed.
2. **Findings correction.** `venue: Findings of AACL-IJCNLP 2026`, plus `Accepted to` (not
   `at`) in the hero's `statusPhrase`.
3. **Publication links.** All four papers had `links: {}` at `HEAD` — nothing in Research was
   clickable. OpenReview links restored for tag-nav (plus the ARR secondary), lupi-gcd,
   one-image-is-enough and prefgui. `HEAD`'s schema already supported them.
4. **Hero additions**, ported onto `HEAD`'s structure and spacing: portrait, the pinned
   publication's acceptance card, and a LinkedIn/GitHub/Email icon row. Research CTA dropped
   (duplicates the mobile tab bar and sidebar).
5. **Graph stays gone.** `ExplorationGraph` usage, the inert `data-graph-avoid` hooks and the
   stale CSS comment all removed.
6. **devicon pinned and deferred.** `HEAD` loaded `devicon@latest` — unversioned and
   render-blocking, ~813 KB — and the restored skill chips depend on it. Now pinned to
   `v2.16.0`, `media="print"`/`onload` with a `<noscript>` fallback and a `preconnect`.

## Verified

`npm run build` + `verify:dist` clean. 62 skill chips render with devicon icons. Hero at
1440×900 and 375×812: full-height `#about`, portrait, "Hi, I'm Adamo Orsini." with the
broader tagline, CV + icon row, acceptance card, Now pill — all above the fold on mobile.
`HEAD`'s `MOBILE_ITEMS` includes CV, so CV has a persistent mobile path independent of the
hero button.

**Not verified:** real-device rendering; light mode after the revert; `/cv`.

## Monogram removal — done 2026-09-11

The "AO" mark appeared in three places and in every one sat **directly beside the full
name** (mobile header, sidebar `LabPass`, CV masthead), so it was never doing the
substitution duty a monogram exists for. A monogram is an organizational device — it stands
in for an entity with no face — and is a design-portfolio convention rather than an academic
one, so it was contributing to the "templatey" read.

- **Mobile header: removed outright.** Pure redundancy, and the header has no collapsed
  state where the name disappears.
- **Sidebar: now compact-only.** `.sidebar-identity-mark` is `display: none` at `lg`, and
  `display: flex` under `html.sidebar-compact`. This matters: the sidebar auto-collapses
  between 1024–1279px (and is user-toggleable, persisted in `localStorage`), and in that
  state `.sidebar-copy` collapses to zero width — the mark is then the *only* identity
  element. Removing it outright would have left an empty 44px home link. Verified both
  states in the browser.
- **CV masthead: kept.** A mark in a document masthead is letterhead, a different and
  defensible use, and that page is a print artifact.

## Open

- Nothing blocking.
- Plan 007's WS2/WS3 (`featured` variant, `/aacl`) are untouched and still open. WS1 is
  superseded by keep-list item 4.
