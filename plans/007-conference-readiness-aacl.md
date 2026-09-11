# 007 — Conference readiness for AACL-IJCNLP 2026

- **Status**: PLAN
- **Severity**: MEDIUM (WS0 is HIGH — the live site is a generation behind the working tree,
  and carries a venue claim that may overstate a Findings paper as main-conference)
- **Category**: Information architecture; conference landing page; shipping
- **Estimated scope**: 4 files changed, 1 new page, 1 commit batch
- **Conference**: AACL-IJCNLP 2026, 6–10 November 2026 (~8 weeks from 2026-09-10)

## Context — the critique that prompted this was stale

An external agent reviewed https://adamoorsini.com/ and reported a "Featured Project /
Featured Experience" structure, a hero listing "human avatars and side-project web
development", and a "feel free to reach out if you have a project in mind!" line.

None of that is on the live site. Verified 2026-09-10 by reading the deployed page and
`git show HEAD:src/pages/index.astro`. The live structure is already
About → Research → Projects → Experience → Education → Awards → Contact, the Research
section is second, and TAG-Nav/AACL is its first row. Plan 006 (WS0–WS6) delivered that.

The working tree is a further generation ahead again: hero claim `I build agents that
learn to navigate mobile apps.`, the pinned-paper row, the exploration graph. Page height
12,300px → 6,263px at 1440; Research (1,443px) is now the largest section, ahead of
Projects (1,292px).

So the critique's headline asks are done. Three things genuinely survive, and they are
what this plan covers.

## Measured facts this plan relies on

| Fact | Value | Source |
|---|---|---|
| Working tree builds | `npm run build` + `verify:dist` pass | run 2026-09-10 |
| Page height at 1440 | 6,263px | `scrollHeight`, dev server |
| Hero block height at 375 | Now line bottom 734pt; bottom tab bar top 755pt | direct DOM measure 2026-09-10 |
| **Hero mobile slack** | **21pt** (an earlier ≈70pt figure was estimated off a scaled screenshot and was wrong) | direct DOM measure |
| Hero eyebrow after the Findings edit | still one line at 375px, no wrap | direct DOM measure |
| Hero social links today | none — Scholar/LinkedIn/GitHub live in sidebar, Contact, Footer | `Hero.astro` |
| Sidebar at <1280 | not rendered | `Sidebar.astro` is `lg:` only |
| Scroll to first LinkedIn on mobile | ≈5,722px (Contact section `offsetTop`) | measured |
| `featured` variant's only effects | `skillLimit` 5→4, `h3` `text-title`→`text-lg` | `Experience.astro:73-74,131` |
| `impactStats` coupling to `featured` | **none** — independent field, renders unconditionally | `Experience.astro:76,140` |
| Pages that exist | `index`, `cv`, `404` | `src/pages/` |
| Uncommitted files on `main` | ~50 | `git status` |

---

## WS0 — Ship the batch (do this first)

Nothing below matters if the deployed site stays behind. Plan 006's WS0–WS6 are complete
and passing but uncommitted on `main`, alongside untracked files
(`.github/workflows/refresh-theme-song-stats.yml`, `src/assets/brand/portrait.jpg`,
`src/components/hero/ExplorationGraph.tsx`, `src/components/PhoneFrame.astro`,
`src/data/theme-song-stats.json`, `src/assets/projects/theme-song-bot.png`).

1. Decide how to land it: one commit, or split by workstream. Note commits `ce3d636` /
   `fe448de` were made mid-session by another process — reconcile before committing.
2. Deploy and confirm the live hero shows the new claim and the pinned AACL row.
3. Outstanding content TODOs carried from 006: a `contribution:` line on `lupi-gcd.md`
   (tag-nav and one-image-is-enough have theirs), and running the Theme Song stats
   workflow once after it is pushed.
4. **Venue accuracy — the Findings correction.** See below.
5. **Verify the primary OpenReview link.** See below.

Items 4 and 5 are content corrections in `src/content/publications/tag-nav.md`. They ride
along with this batch because they are wrong on the live site *now*, and the site is about
to be handed to exactly the audience that notices.

### WS0.4 — `venue` must say Findings — **DONE 2026-09-10**

Confirmed by Adamo and implemented. `tag-nav.md` now reads
`venue: Findings of AACL-IJCNLP 2026`, and `Hero.astro`'s `statusPhrase` accepted case was
reworded `Accepted at` → `Accepted to` so the eyebrow renders "Accepted to Findings of
AACL-IJCNLP 2026". Two stale doc comments in `Hero.astro` were updated to match. Verified
in `dist/`: the homepage hero, the Research row, and `/cv` all carry the Findings string,
with no bare "AACL-IJCNLP 2026" left in either page; the eyebrow still fits one line at
375px. Build and `verify:dist` clean.

Original analysis follows.

Added 2026-09-10. `tag-nav.md` currently has `venue: AACL-IJCNLP 2026` with
`status: accepted`, so the hero renders **"Accepted at AACL-IJCNLP 2026"**. The paper was
accepted to **Findings**, not the main conference (source: the camera-ready session's
memory note, `tag-nav-aacl-camera-ready`, recording acceptance on 2026-09-07 as a Findings
paper, submission #606).

**Adamo confirms this before the edit lands** — it is second-hand from another session and
has not been checked against OpenReview here. If confirmed:

- Change one field: `venue: Findings of AACL-IJCNLP 2026`. `venue` is rendered verbatim in
  all three places it appears (`PublicationRow.astro:92`, `Hero.astro` `statusPhrase`,
  `cv.astro:240`), so the single edit propagates everywhere. No component changes needed.
- **But check the hero copy.** `statusPhrase` builds `Accepted at ${venue}`, which becomes
  the clumsy "Accepted at Findings of AACL-IJCNLP 2026". `PublicationRow` is fine — it
  prints the venue next to a separate `Accepted` badge. Options for the hero, Adamo's
  choice: reword the `accepted` case to `Accepted to ${venue}`, drop the prefix and let the
  venue stand alone, or leave it. This is the only component-level decision in WS0.
- Note the hero's eyebrow branch keys on `venue.includes(String(year))`; "Findings of
  AACL-IJCNLP 2026" still contains "2026", so the branch is unchanged and the year is not
  double-printed. Verify rather than assume.

Overstating a Findings paper as a main-conference paper is the worst error this site could
carry into a poster hall. Treat it as the highest-priority content fix in the batch.

### WS0.5 — Confirm which OpenReview forum the primary link points at — **DEFERRED**

Adamo's call 2026-09-10: leave the links as they are and swap straight to the camera-ready
/ ACL Anthology link once it exists, rather than auditing the two OpenReview IDs now. The
`VjBWmU05B3` vs `2EOBkw4eGQ` question is therefore still open but no longer blocks WS0 —
it is superseded by the October link swap. Residual risk: if the primary currently points
at the review thread, that is what visitors get until the swap.

Original analysis follows.

Added 2026-09-10. `tag-nav.md` has `links.openreview: VjBWmU05B3` as primary and
`links.secondary` labelled "Reviews (ARR)" pointing at `2EOBkw4eGQ`. The camera-ready
memory note instead calls `2EOBkw4eGQ` the forum for submission #606. One of these is the
ARR forum and one is the AACL commitment; they cannot both be right.

- Adamo opens both and confirms which is which. No agent guesses this.
- The primary link is what a QR visitor lands on from `/aacl`, so it must resolve to the
  AACL-facing forum, not the review thread.
- Swap the two (and the `secondary.label`) if they are reversed.
- **Successor:** once the camera-ready is published, the primary link should become the
  **ACL Anthology** entry — the canonical citation and a better public destination than
  OpenReview. Track that as an October task alongside the WS3 fill-in schedule.

**Do not start WS1–WS3 until WS0 is deployed**, so each subsequent change is verified
against a live baseline rather than a local-only one.

---

## WS1 — Hero CTA + profile links — **DONE 2026-09-11**

Implemented in `src/components/hero/Hero.astro` only; no other file touched. The spec below
was revised twice mid-implementation by Adamo; this section records the landed state.

### Landed state

Hero bottom is now a single **CV** button, then an **icon row: LinkedIn · GitHub · Email**.

- **Research button dropped.** It duplicated the persistent mobile bottom tab bar and the
  desktop sidebar, and its target sits one scroll below. (A claim made while proposing this
  — that dropping it frees ~64px — was **wrong**: both buttons shared one flex row, so the
  saving was horizontal only. Vertical headroom was unchanged. The redundancy argument
  stands on its own.)
- **CV kept, and promoted to `variant="default"`.** It is the only reachable path to `/cv`
  below `md`: of five `/cv` links in the DOM at 375px, the sidebar's and the header pill
  row's are both hidden by breakpoint, leaving the hero button (y=481) and the Contact
  section's "View CV" at **y≈8,224**.
- **Google Scholar dropped from the hero** (Adamo, 2026-09-11). It remains in the sidebar
  and the Contact section; `profile.links.scholar` is untouched.
- **Icon-only row**, replacing an earlier bracketed-mono `[LinkedIn] [GitHub] [Email]`
  version. Icons became defensible *only once Scholar left* — the original objection was
  that Google Scholar has no universally-read glyph, which no longer applies to these
  three. Each link carries `aria-label` + `title`, so the accessible name survives.

### Verified at the landed state

| Check | Result |
|---|---|
| 375×812 — Now line above the tab bar | **5px headroom** |
| Tap targets | all three 44×44 |
| Accessible names | LinkedIn / GitHub / Email present via `aria-label` |
| `npm run build` + `verify:dist` | clean |

The icon row initially cost 8px more than the text row it replaced (headroom went to
**−3px**, the Now line clipping under the tab bar) until its mobile negative margin was
matched to the text row's `-my-4`. Mobile tightening from the first pass is retained:
hero column `gap-5 md:gap-7`, and the Latest block at `pt-4 md:pt-5`.

### Known tradeoff, not resolved

On desktop the sidebar's own icon row (GitHub / LinkedIn / Scholar / Mail, bottom-left) is
visible at the same time as the hero's, so the same glyphs appear twice on one screen. Mild,
and the two serve different reading positions, but it is the cost of icons over text and
Adamo may want to revisit it.

**Revert path:** the bracketed-mono text variant is preserved at
`scratchpad/Hero.text-variant.astro` (session scratchpad) — swapping back is one file copy
plus re-adding the `FlaskConical` import only if the Research button is also wanted back.

### Still true, and load-bearing

**5px of headroom at 375×812 is very tight.** Anything added to the hero, or any
lengthening of `profile.now.text`, pushes the Now line under the bottom tab bar.
Re-measure in the DOM after any hero change. At 360×740 the Now line and part of the paper
title already fall below the fold — accepted, since the name, claim, lead, link row and
acceptance line all remain visible.

**Not verified:** real-device rendering, and viewports shorter than 740px.

### Original specification follows


Files: `src/components/hero/Hero.astro`, possibly `src/data/profile.ts` (no new fields
expected — `profile.links` already has all four).

### Problem

On a phone the sidebar does not render, so a visitor scanning a QR code must scroll
~5,700px to Contact before finding LinkedIn or Scholar. That is the real gap the critique
found, and the only one still open.

### Target

A quiet mono link row directly under the existing `[Research] [CV]` buttons, above the
"Latest" rule. Hero reads top to bottom: eyebrow → claim → lead → two buttons → link row
→ rule → pinned paper → Now line.

- Use the existing bracketed "trace" voice already used by the paper's `[PDF] [arXiv]
  [Code]` row, not four more buttons. Two real buttons keep primacy; the profiles are a
  secondary register.
- `max-md:min-h-11` on every link, matching the `latestLinks` precedent.
- Scholar is included. A thin profile is unremarkable for a first-year PhD; at AACL the
  absence of the link is more conspicuous than its contents. Render it conditionally on
  `profile.links.scholar` as the sidebar already does.
- Email uses `profile.academicEmail`. Note the mobile header already carries a persistent
  mail icon, so this row's Email entry is a convenience, not the only path.

### Constraint — the mobile fold is the binding budget

Measured directly on 2026-09-10: at 375×812 the Now line's bottom sits at 734pt and the
bottom tab bar's top at 755pt. **There are 21pt of slack, not the ≈70pt this plan first
claimed** — that earlier number was estimated off a scaled screenshot and was wrong.

A 44pt tap-target row plus its gap needs roughly 68pt. So the row **cannot** be added
without reclaiming space; treat tightening as part of WS1, not a contingency. Candidates,
cheapest first: the hero's `gap-6 md:gap-7` rhythm, the `pt-5` above the Latest rule, and
the `max-md:-my-3` trick already used by `latestLinks` to let a 44pt tap target occupy
less than 44pt of layout height — that last one is the established pattern here and is
probably the whole answer.

**Acceptance: the claim, link row, pinned paper title, and Now line must all sit above
755pt at 375×812.** Measure it in the DOM; do not eyeball a screenshot.

### Boundaries

- Do not add icons to the link row; the bracketed mono form is the established voice.
- Do not touch the Contact section, Footer, or Sidebar — the links stay there too.
- Check the row against `data-graph-avoid`: the exploration graph avoids hero content, so
  the new row needs to be inside the avoid region or the graph will draw through it.

---

## WS2 — Drop the `featured` experience variant

Files: `src/components/Experience.astro`, `src/pages/index.astro`.

### Problem

One experience row renders with a larger title and a fifth skill chip purely because of
`highlight: true`. It is the last remnant of the "featured experience" idea.

### Target — uniform ruled rows

`Experience.astro`:
- Remove `"featured"` from the `variant` union (leaving `"row" | "compact"`).
- Delete `const featured = variant === "featured"`.
- `skillLimit` becomes the constant `4`.
- `h3` class list drops the ternary; always `text-lg`.

`index.astro`:
- Delete `featuredExperiences` and `standardExperiences`; pass `primaryExperiences`
  straight into `groupByEmployer`.
- Drop the `variant={experience.data.highlight ? "featured" : "row"}` prop.

### Explicitly preserved

**`impactStats` is untouched.** It is an independent frontmatter field
(`content.config.ts:112`) and `impactLine` renders whenever the array is non-empty,
regardless of variant. SoftGolf's four figures (100+ tournaments, 700+ registrations,
1,100+ scores, $60K+ processed) and Theme Song Welcome Bot's three (1,599 profiles,
240 servers, 1,538 themes) all keep rendering exactly as they do now. Verify this
visually rather than assuming it.

### Projects need no change

`Project.astro` has no featured branch — every project already renders as a uniform ruled
row. The `selectedProjects` (top 3) / `additionalProjects` (archive disclosure) split is a
*length* control, not a featured treatment, and it is what holds Projects to 1,292px
instead of letting it re-outweigh Research. It stays. `highlight` survives in the schema
as a selection signal for projects and as the pinned-paper signal for publications.

### Flagged consequence — Adamo's call

`sortContent` orders by end date desc, then start date desc. SoftGolf is currently first
only because `highlight` pinned it. Without the pin, Teaching Assistant (Sep 2025 –
Present) sorts above SoftGolf CTO (Jan 2024 – Present).

- **Recommendation: let the date order stand.** For a conference audience, leading with
  the Concordia academic role is defensible, and SoftGolf still carries the most visual
  weight in the section via its four-figure stat line.
- If Adamo prefers SoftGolf first, add `order` support to the experience sort in
  `index.astro` (mirroring the projects' `byOrderThenDate`) and set `order: 1` on
  `SoftGolf.md`. That pins position without restoring any visual distinction.

---

## WS3 — `/aacl` conference landing page

Files: new `src/pages/aacl.astro`; possibly `scripts/verify-dist.mjs` and the sitemap
config.

### Target

A one-screen page the poster QR points at, so a visitor reaches the paper in zero taps.
Source everything from `src/content/publications/tag-nav.md` — no hand-copied strings.

Contents, in order:
1. Title, full author list, `AACL-IJCNLP 2026`, accepted status.
2. The `tag-nav.png` figure with its existing caption.
3. Lead line, then the full abstract. Resolved 2026-09-10:
   - **Lead**: the existing `summary` from `tag-nav.md` ("Builds reusable, task-agnostic
     destination memory from autonomous app exploration to improve navigation by mobile
     GUI agents."). A QR visitor has just spoken to Adamo at the poster; they want
     orientation in one sentence before depth.
   - **Below it**: the real abstract, verbatim from the paper. **Content TODO for Adamo.**
     Add an optional `abstract` field to the publications schema; the page renders the
     block only when it is present, so `/aacl` ships before the text is pasted in.
   - The abstract is never drafted, paraphrased or summarised by an agent — it is paper
     prose, and it must match what a reader sees on OpenReview.
4. Links: OpenReview (`VjBWmU05B3`), the ARR reviews secondary link, PDF, and code when it
   exists.
5. Poster PDF. **Asset TODO** — reserve `public/files/`, render the link conditionally so
   the page ships before the poster does.
6. Session details, conditional. See "Fill-in schedule" below.
7. A short "I'm Adamo, here's the rest of my work" line back to `/`, with the same
   Scholar/LinkedIn/GitHub/Email row from WS1.

### Boundaries

- Not in `NAV_ITEMS`, `MOBILE_ITEMS`, or the sidebar. It is a QR destination, not a
  section of the site.
- Reuse `Layout.astro` and the existing figure-plate styling; do not invent a new visual
  system for one page.
- `npm run verify:dist` checks route/anchor/sitemap coherence — confirm the new route
  satisfies it rather than assuming.
- Design for the phone first: this page will be read almost exclusively on one, standing
  up, in a poster hall.

### Fill-in schedule — build now, populate as information arrives

The page is built with every time-sensitive element conditional, so it deploys immediately
and never shows an empty slot. Nothing below blocks WS3.

| Slot | Source | Expected | Blocks ship? |
|---|---|---|---|
| Title, authors, venue, figure, links | `tag-nav.md` | have it now | — |
| Lead line | `tag-nav.md` `summary` | have it now | — |
| Full abstract | camera-ready, **not** the June submission — see note below | ~Sept 30 | no |
| Poster session + day/time block | AACL program | ~Oct, with the program | no |
| Board / stand number | AACL program | ~Oct, with the program | no |
| Poster PDF | Adamo | late Oct | no |

**Paper source, located 2026-09-10:** the canonical PDF is
`~/school/AGENTS/TAG-Nav-paper/assets/pdf/TAG-NAV-Final.pdf` (19pp, 13,086 words, built
2026-06-19). Seven local copies exist across `~/Downloads` and `~/school/AGENTS/`; all are
the same document (differing checksums are re-exports with fresh PDF timestamps, identical
extracted text). Every copy is still the anonymised submission — there is no camera-ready
yet. Its 230-word abstract was extracted verbatim and is usable as a placeholder, but the
camera-ready pass de-anonymises, switches the template to `[final]` and adds the required
Limitations section, so **take the final abstract from the camera-ready, not from this
PDF.**

The session line is the highest-value late addition: it is what helps someone who scans
the QR, has no time to talk, and wants to find Adamo later in the hall. Render it as a
single dated line near the top once known.

### Timeline

~8 weeks of runway, so all four workstreams fit comfortably. Suggested shape: WS0 this
week (it is already blocking the live site), WS1–WS3 across September, then a content
pass in October as the program and poster land, leaving early November clear.

---

## WS4 — Verification (run for WS1–WS3, not once at the end)

- `npm run build` and `npm run verify:dist` clean.
- 375×812 and 1440×900, light and dark.
- **375×812 fold check**: name, claim, link row, pinned paper, and Now line all above the
  bottom tab bar. This is the WS1 acceptance test.
- Every hero link ≥44pt tap height.
- SoftGolf and Theme Song stat lines still present after WS2.
- `/aacl` reachable, figure loads, OpenReview link resolves.
- Page height at 1440 has not regressed past ~6,300px.
- `git diff --check`.

---

## Explicitly not doing

- Rewriting the hero copy. The working tree's claim and lead are already research-first
  and better than what the critique proposed.
- Reordering or renaming sections. Already correct.
- Removing the Projects archive, the Awards section, or the older project history. It is
  collapsed behind disclosures and costs a visitor nothing.
- A broader redesign before the conference. The critique's own conclusion applies: the
  information hierarchy was the problem, and it has already been fixed.
