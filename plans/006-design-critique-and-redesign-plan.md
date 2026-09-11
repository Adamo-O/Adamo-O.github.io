# 006 — Design critique and redesign plan (2026-09-09)

Status: IMPLEMENTED (WS0–WS6, uncommitted on `main`, 2026-09-09). WS7 = option (a), no change
needed. Final review: build + detector clean, page 12,300 → 6,201px at 1440, 8 type sizes, one
column, 2 box-shadows. Outstanding for Adamo: `contribution` lines per paper, a cleaner Theme
Song screenshot, push + run the stats workflow once, and decide how to land the batch (see the
note on the external commits ce3d636/fe448de made mid-session by another process).

Evidence base: live site https://adamoorsini.com/ captured at 1440/1024/820/390, light and dark;
Impeccable critique run (design-review agent, detector agent, reference-research agent); lead
reviewer's own pass. Screenshots and raw agent reports live in the session scratchpad; the
persisted critique is in `.impeccable/critique/`.

---

## 1. Verdict in three lines

- The site is tidy, tokenised and well-engineered, but it reads as a polished developer-portfolio
  template. Only three things are unmistakably authored: the vertical rails, the TAG-Nav figure card,
  and the theme-toggle circle reveal.
- The first viewport contains no research claim, no paper, no face. The accepted first-author paper
  is 900px below the fold; a Discord bot with stat tiles is the first project; 11 award cards end
  the content. Nielsen score 20/32 (Acceptable).
- One blocker: the CrossCast project autoplays a demo video whose visible frames are partisan
  political tweets. Fix that before anything else.

## 2. Measured facts the plan relies on

| Fact | Value | Source |
|---|---|---|
| Page height at 1440 / 390 | 12,300px / 14,976px | agent B |
| Section share at 1440 | Research 20%, **Projects 40%**, Experience 12%, Awards 8% | agent A |
| Cards / pills / shadows | 35 `<article>`, 161 `rounded*`, 28 box-shadows | agent B |
| Rail vs h1 size | 81px rail, 56px h1; project h3 30px > publication h3 24px | agent B |
| Column widths | Research 832px (`max-w-[52rem]`), all other sections 1063px | agent A/B |
| Distinct font sizes | 13 (11–81px); 11px used on 66 elements | agent B |
| Contrast failures | only `.v-heading` dark mode 2.92:1 (needs 3:1) | agent B |
| Touch targets < 44px at 390 | 32 of 41 interactive elements | agent B |
| Dark-mode pure-white boxes | 14 (3 figure frames, 2 phone frames, 9 logo tiles) | agent B |
| Third-party weight | devicon CSS + ttf ≈ 813 KB wire, render-blocking, `@latest` unpinned | agent B |
| Video posters | 650 KB of PNG for 4 posters (webp equivalents are 14–23 KB) | agent B |
| Publication links | all four `links: {}` — nothing in Research is clickable | verified |
| PP Supply Mono | shipped in `src/assets/fonts`, never referenced | verified |
| Detector (`detect.mjs`) | 0 findings on source; in-page: 25 thin-border+wide-shadow, 19 line-length, 9 nested-cards | agent B |
| Rail collision | at 1440x900 "PROJECTS" tail abuts "EXPERIENCE" head (reads "CTSEXPERIENCE") | lead reviewer |

## 3. Design direction (the world we are moving toward)

Keep: warm paper / ink palette, single navy accent, PP Neue Montreal, the vertical rails as the
signature, the sticky sidebar at ≥1280, dark mode, the CV page as-is.

Change the material: from **cards on paper** to **ruled paper**. Hairline rules (`border-line`)
become the structure; borders+shadows are reserved for genuinely interactive or framed objects
(a phone frame, a figure plate). Reference moves (see refs digest): Cartesia year-gutter rows,
Yang Song venue/award badge + bracketed links, Beyer one-line contribution, Distill title:meta ≈ 1.7,
Webflow ruled experience table, Karpathy one-logo-per-period, Rauno "Email / Copied".

Add the research vocabulary as *form*, not words: the projects section adopts a single phone-frame
motif, the hero canvas becomes an app-exploration graph (D10, reopened and approved 2026-09-09), and PP Supply Mono becomes the "trace" voice for dates, venues, counts
and rail superscripts (`RESEARCH⁴`).

Motion budget (from refs): hover 100–160ms; everything else ≤ 200ms; enter from `translateY(8px)`
+ opacity with `cubic-bezier(0.23,1,0.32,1)`; one reveal per section on first entry only; nothing
animates on high-frequency actions (nav, row hover); loops pause off-screen; reduced-motion keeps
opacity fades and drops transforms.

---

## 4. Workstreams (execute in this order)

Each workstream is self-contained. Subagent contract: read this file and only the files listed;
do not touch other workstreams' files; run `npm run build` and `node ~/.claude/skills/impeccable/scripts/detect.mjs --json src`
before reporting; capture 1440 + 390 screenshots with `agent-browser` and attach paths; report
what was verified and what was not.

### WS0 — Hygiene and blockers  — DONE 2026-09-09 (uncommitted; devicon drop deferred to WS3)

Files: `src/content/projects/CrossCast.md`, `src/components/home/PublicationCard.astro`,
`src/layouts/Layout.astro`, `src/styles/globals.css`, `src/pages/index.astro`,
`src/components/Project.astro`, `src/components/Experience.astro`, `src/components/home/EducationItem.astro`,
`src/components/layout/LabPass.astro`, `src/components/layout/nav.ts`, `src/components/layout/Sidebar.astro`,
`src/components/layout/MobileHeader.astro`, `src/components/hero/Hero.astro`, `src/data/profile.ts`.

1. **P0** CrossCast: remove the `video:` line so the card falls back to the poster, or replace
   `public/media/cross-cast.{webm,mp4}` with a re-recorded neutral demo. Done 2026-09-09: trimmed
   clean loop on disk, clean poster, `video:` removed.
   Add a visible pause control or `controls` to any remaining autoplay video (WCAG 2.2.2).
2. Author list spacing: `PublicationCard.astro` renders `A , B , C`. Emit `{index < n-1 ? ", " : ""}`
   inside the same expression as the span so no whitespace text node precedes the comma.
3. Reduced motion: `Layout.astro` puts `class="scroll-smooth"` on `<html>`; the reduce block in
   `globals.css` (`html { scroll-behavior: auto }`) loses on specificity. Move smooth scrolling into
   `globals.css` under `@media (prefers-reduced-motion: no-preference)` and drop the class.
4. `#contact` has two `<h2>` (Section's sr-only + the visible headline). Demote the visible one to
   `<p>` with the same classes.
5. `Project.astro` impactStats branch hard-codes alt `"… running in Discord"`; use
   `${title} preview` or a new optional `imgAlt` field.
6. devicon: pin the version, load with `media="print" onload="this.media='all'"` (non-blocking),
   or drop it entirely in WS3 (chips are being removed). Prefer drop.
7. Font: add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for
   `PPNeueMontreal-Variable.woff2`; remove the unused italic `@font-face`.
8. Video posters: `Project.astro`/`ProjectArchiveItem.astro` use `poster={img.src}` (raw PNG,
   650 KB total). Pass the optimised `<Image>` output via `getImage()` so posters are webp.
9. Dates: `EducationItem.astro` → `Jan 2026 – Expected May 2029`. Use an en dash in every range
   (`sortContent` parses the frontmatter, not the rendered string, so only the render changes).
10. `LabPass.astro`: affiliations `Concordia · Mila` (no wrap at 220px); `text-wrap: balance` on name.
11. Consistency: every "CV" control goes to `/cv` (PDF and Print live there); every email uses
    `profile.academicEmail`. Remove the personal email from `Sidebar.astro`/`MobileHeader.astro`.
12. Mobile nav (D9 confirmed): `MOBILE_ITEMS` = About, Research, Projects, Experience, Contact;
    CV stays reachable from the mobile header.
13. Dark mode: logo tiles and figure/phone frames must not be `rgb(255,255,255)`. Logo tile →
    `bg-white/90 dark:bg-white/85` only around logos that need it, otherwise `bg-surface`;
    figure plate → `bg-surface dark:bg-white/92 dark:ring-1 dark:ring-white/10`.
14. `.dark .v-heading` alpha 0.6 → 0.72 (clears 3:1).
15. Touch targets: `Button` size `sm` → `h-9 min-h-[44px]` on `max-md`; archive links and employer
    links get `py-2` / `min-h-11` on `max-md`.
16. Rail collision: give `.rail-heading` `pointer-events-none` plus a fade mask on the last 2rem
    of each section, or add `padding-bottom: 4rem` to the rail wrapper so a sticky rail releases
    before the next section's rail starts. Verify at 1440x900 across the Projects→Experience boundary.
17. `Footer.astro` "Updated" and `cv.astro` "Last updated": derive both from one field
    (`profile.now.updated`).

Acceptance: build passes; no `A ,` on the page; `matchMedia('(prefers-reduced-motion: reduce)')`
run yields `scroll-behavior: auto`; zero `rgb(255,255,255)` backgrounds in dark mode outside images;
no request to `cdn.jsdelivr.net` (if dropped); all 390px interactive elements ≥ 44px tall.

### WS1 — Hero: research first  — DONE 2026-09-09 (uncommitted)

Notes from implementation: ExplorationGraph.tsx erases reserved text rects each frame and
filters edges against them (pixel check 0 in-rect at 1440/1024/390); mobile renders 6–10 nodes
or nothing; PP Supply Mono has no GSUB table so its slashed zero cannot be turned off (accepted);
mobile graph still crowds the button row slightly — candidate for WS6 polish (reserve the
button row with more padding or hide the graph below 480px).

Files: `src/components/hero/Hero.astro`, `src/components/hero/NowPill.astro`, `src/data/profile.ts`,
`src/pages/index.astro` (`#about` section only), new `src/components/hero/ExplorationGraph.tsx` (D10 = yes); retire `ParticleField.tsx` after the graph ships.

1. Height: `#about` `min-h-svh` → `min-h-[72svh]` on desktop, natural height on mobile with
   `pt-10`. The Research rail must be visible at 1440x900 without scrolling.
2. Copy (D2 answered 2026-09-09: agents claim only; world models stated as something he is
   learning, not a result; no "grinding"). Draft for final approval, facts unchanged:
   - h1 (claim): `I build agents that learn to navigate mobile apps.`
   - lead: `PhD student at Concordia University and Mila. I study how GUI agents understand
     interfaces and plan actions, and I'm exploring how world models could help them plan.`
   - mono eyebrow above the h1: `Adamo Orsini · PhD, Concordia & Mila · Montréal`
   - "Now" line (replaces the pill): `Sep 2026 — running first world-model experiments ·
     shipping SoftGolf's mobile app`
   `profile.heroLines[1]` ("I study how agents… build reusable models of interactive
   environments") stays as the Research section intro; it already reads as a study
   statement rather than a claim.
3. "Latest" row under the CTAs: the acceptance announcement, rendered as one ruled row in the
   mono voice: `Sep 2026 · Accepted at AACL-IJCNLP 2026` eyebrow, then the TAG-Nav title as a
   link, then `[PDF] [Code]` once WS2 provides links. This is the news and the first paper on
   screen. Source it from the `highlight: true` publication so it updates itself when the next
   paper lands (no hand-written announcement).
4. Portrait: yes, but small. A 96px (md) / 72px (mobile) portrait, square with `rounded-sm`
   to match the monogram tile, sitting at the left of the claim, plus the same image in
   `LabPass` (sidebar) via its existing `portrait` prop. Professors recognise faces from
   conferences; a hero-sized photo would tip the page toward "personal brand". D3 (2026-09-09): Adamo
   shared five candidates. Recommended: the blue plaid blazer selfie against the grey wall
   (neutral background, sharp, professional, reads at 96px). Runner-up: the vineyard portrait
   (striped shirt, cloudy sky) if he wants the current long-hair look and a warmer tone.
   Crop square, face centred, eyes at ~40% from the top, export 800×800 JPEG q85 to
   `src/assets/brand/portrait.jpg`. Avoid the restaurant, Park Güell and party shots: busy
   backgrounds and blown highlights collapse at thumbnail size.
   What the fold contains after WS1, top to bottom: mono eyebrow (name · PhD · affiliations ·
   city), claim h1, one-sentence lead, Research + CV buttons, the "Latest" acceptance row, and
   the dated "Now" line. Nothing else. No stats, no chips, no second figure.
5. Background (D10, reopened): on 2026-09-03 Adamo chose the particle
   flow field and explicitly declined an agent-navigation-graph hero. Both reviewers and the
   reference research independently recommend the graph because it is the one background that
   says "GUI agents". Superseded 2026-09-09: Adamo reopened it (see D10 below).
   Adamo reopened this on 2026-09-09 ("could be cool since it's related to the research"; the
   static rings top-right "don't give much"). Three concepts, in order of recommendation:

   **(a) App-exploration graph** — `ExplorationGraph.tsx`. 20–28 nodes drawn as tiny phone
   rectangles (9:19, 14–22px wide, 1px stroke `accent/0.35`, 2px radius) with 2–3 hairline
   "UI rows" inside so they read as screens, not boxes. Edges = 1px lines with a 3px arrowhead,
   laid out by a light force simulation seeded from a fixed adjacency (deterministic per load,
   no jitter). Every ~4s an explorer path lights up hop by hop (node fill `accent/0.9`, edge
   drawn tip-to-tail at 320ms/hop, `cubic-bezier(0.23,1,0.32,1)`), then fades over 1.2s; the
   visited node keeps a faint "destination record" dot so the graph fills with memory over
   time (the TAG-Nav idea, literally). Pointer pulls nearby nodes 6–10px with the existing
   push/pull plumbing; nothing else reacts to the pointer. Runs only while in view; static
   frame under reduced motion; colours from `--c-accent`. Density scales with viewport
   (~1 node per 60k px²), max 28. Mobile: 10–12 nodes, no pointer.

   **(b) Trace ticker** — typographic instead of graphic. A slow vertical column of mono
   agent-action lines (`observe s₁₂ · tap "Orders" · scroll ↓ · observe s₁₃ · match G ✓`)
   at `fg/0.18`, 1 line per 2.4s, behind the right half of the hero. Cheapest (pure CSS
   `animation-timeline` or a 20-line script), very on-topic, but easier to misread as
   decoration. Works well as a *companion* to (a) on ≥ 1280.

   **(c) World-model rollout strip** — a horizontal strip of 6–8 frames, "observed" on the
   left fading into "predicted" on the right, with a scrubber. This is a figure, not a
   background; it belongs in the Research section next to the first world-model result, not
   in the hero. Park it until there is a result to show.

   Decision **D10 = (a)**, with (b) as an optional layer if (a) alone feels sparse at 1440.
   Remove the concentric rings and the dot-grid mask from `body` in `globals.css` in the same
   change; keep the grain and one soft radial gradient.
6. Buttons: keep `Research` (primary, `#research`) and `CV` (`/cv`). Add `:active { transform: scale(.97) }`
   160ms.

Acceptance: at 1440x900 the viewport shows claim, latest paper row, and the top of the Research
rail; at 390 the h1 top sits ≤ 140px below the header; canvas rAF is 0 when scrolled away.

### WS2 — Research section: rows, not cards  — DONE 2026-09-09 (uncommitted)

Notes: rows render `summary` (muted) until a `contribution` line exists, then the contribution
replaces it; `award` field available; rail shows `RESEARCH³` (PrefGUI hidden). Contribution
lines still to be written by Adamo.

Files: `src/components/home/PublicationCard.astro` (rewrite as `PublicationRow.astro`),
`src/content.config.ts` (publications schema), `src/content/publications/*.md`, `src/pages/index.astro`.

1. Layout: ruled list. Left gutter (`10rem` on md) in mono: year, venue, status badge. Right:
   serif-free title at 24px/700 (largest title on the page), authors 14px with self in `text-fg font-semibold`,
   one-line contribution (`contribution` field, e.g. "First author. Built the exploration
   framework and the destination-record retrieval."), bracketed link row `[PDF] [arXiv] [Code] [OpenReview]`.
   Figure sits on a flat plate (`bg-surface`, no border, `object-contain`, never cropped) below
   the text at full column width for `highlight` papers only; other papers get a 160px thumbnail
   at right on md.
2. Schema: add `contribution: z.string().max(140).optional()`, `award?: string` (e.g. "Oral").
   Drop `thumbnailFrame` crop behaviour.
3. Content (D4/D5 answered 2026-09-09): OpenReview links are now in the four publication
   frontmatters (`links.openreview`; TAG-Nav also carries the ARR review thread as
   `links.secondary`). Still needed from Adamo: one-line `contribution` per paper, and PDF/code
   links when public. PrefGUI is `hidden: true` everywhere (D5, 2026-09-09).
4. Rail superscript: `VerticalHeading` gets an optional `count` prop rendered as a mono
   superscript (`RESEARCH⁴`). Wire from `index.astro`.
5. Group by year with the year printed once per group in the gutter.

Acceptance: zero `<article>` cards in `#research`; TAG-Nav figure fully visible (no crop);
every publication has ≥ 1 link; section height ≤ 1,600px at 1440.

### WS3 — Projects: fewer, ordered, one motif  — DONE 2026-09-09 (uncommitted)

Notes: devicon and Skill chips removed site-wide; `statsSource: theme-song` reads
`src/data/theme-song-stats.json`; `.github/workflows/refresh-theme-song-stats.yml` is inert until
Adamo adds `TOPGG_TOKEN` (and optionally `THEME_SONG_STATS_URL` pointing at a Railway endpoint
returning `{profiles, introThemes}`). Bot media is still the GIF ("bingus" server); a cleaner
in-server screenshot is Adamo's call. Projects intro sentence is still filler — WS6 copy pass.

Files: `src/content.config.ts` (projects schema), `src/content/projects/*.md`, `src/components/Project.astro`,
`src/components/home/ProjectArchiveItem.astro`, `src/components/Skill.astro`, `src/pages/index.astro`.

1. Schema: add `order: z.number()` for highlighted projects; `index.astro` sorts `selectedProjects`
   by `order` then date; cap at 3. Order (D6 answered 2026-09-09): **CommunityGrid, Theme Song
   Welcome Bot, Handle**. CrossCast moves to the archive (a 24-hour hackathon build reads as
   less than a production bot with 240 servers and 1,599 profiles; it also carries the
   content risk). The bot was never the problem; its presentation was: the "bingus" Discord
   screenshot and landing-page stat tiles. New presentation: a real in-server screenshot or
   the existing GIF inside the 16:10 plate, one mono stats line under the summary
   (`240 servers · 1,599 profiles · 1,538 intro themes · updated Sep 2026`), and the
   "Production, since 2021" eyebrow.
   Stats (Adamo, 2026-09-09): the bot is idle most of the time (it plays for ~10s when a
   user joins a voice channel), so a live "playing now" counter would usually read 0. Show
   server and user counts only. Implementation: a GitHub Actions cron (daily) calls Top.gg
   `GET /bots/903352344941588480/stats` (needs `TOPGG_TOKEN` secret) for the server count and
   a small authenticated endpoint on the Railway service for the saved-profile and
   intro-theme counts, writes `src/data/theme-song-stats.json` with an `updated` date,
   commits, and Pages redeploys. The card renders `240 servers · 1,599 profiles · updated Sep 2026`
   from that file; no client JS, numbers never more than a day old. If the Top.gg token is
   not set, the action leaves the file untouched and the last committed numbers stay.
2. Featured card → featured row: media at left (phone frame for mobile products, 16:10 plate for
   web), text at right: eyebrow (mono: category · dates), title 24px, two-sentence summary,
   `Built with` as one comma-separated line in `.meta` (no chips, no devicon), links as
   bracketed text links. Stat tiles become one mono line under the summary (`240 servers · 1,599 profiles`).
3. Archive: wrap "Earlier projects & experiments" in the existing `<details class="earlier-roles">`
   pattern, rendered as a compact ruled list (56px thumbnail, title, one line, mono date, links).
4. Phone-frame motif: extract `.project-screen`/`.project-screen-stage` into `PhoneFrame.astro`
   (one frame, optional second offset frame) and reuse it in WS1's hero graph nodes' styling and
   the ExplorationGraph legend so the site rhymes.
5. Delete `Skill.astro` and `src/lib/skillIcons.ts` once nothing imports them; remove devicon.

Acceptance: `#projects` ≤ 2,200px at 1440 with the archive closed; no `rounded-pill` skill chips
on the page; no third-party icon font loaded.

### WS4 — Experience, education, awards: ruled table, compact honours  — DONE 2026-09-09 (uncommitted)

Notes: combined height 2,141px at 1440 (target 2,000; accepted). Honours shows the four most
recent by date; `contentClass="md:py-10"` on these three sections is a rhythm deviation for WS5
to normalise.

Files: `src/components/Experience.astro`, `src/components/home/EducationItem.astro`,
`src/components/home/AwardItem.astro`, `src/content/awards.json`, `src/pages/index.astro`.

1. Experience → ruled table: heavy rule between employers, thin rule between roles. Row: logo
   (one per employer, 40px, on `bg-surface`), employer + role, one-paragraph description (Karpathy
   period paragraph, no chips), mono dates right-aligned with `tabular-nums`. SoftGolf keeps its
   four impact figures as a single mono line. "Additional roles" disclosure stays.
2. Education → same table style (degree, institution, mono dates, one line of notes). Drop the
   dot-timeline pseudo-element.
3. Awards → "Honours": a ruled list, mono date gutter, title, issuer; first four (Doctoral
   Fellowship, Jang-Hwan Kwon, NSERC CGS-M, Mirego/ConUHacks) visible, the rest inside a
   `<details>` "More honours". "Participant, Genetec Challenge" removed from `awards.json`
   on 2026-09-09 (D7). D8 = (a): Education and Awards stay on the homepage in compact form.

Acceptance: zero box-shadows in these three sections; combined height ≤ 2,000px at 1440.

### WS5 — Layout and type system  — DONE 2026-09-09 (uncommitted)

Notes: 8 font sizes (12/14/15/18/22/24/32/display); one 960px column at 1440; 2 box-shadows
(phone frames); rails 0.64 light (3.17:1) / 0.72 dark; page height 12,300 → 6,256px at 1440.
Left for WS6: MobileNav 11px labels, skip-link 16px.

Files: `src/styles/globals.css`, `tailwind.config.mjs`, `src/components/layout/Section.astro`,
`src/components/layout/VerticalHeading.astro`.

1. One measure: `Section.astro` content column gets `max-w-[60rem]` by default; text blocks
   inside use `max-w-[42rem]` (~72 cpl at 15px). Remove the per-section `max-w-[52rem]`.
2. Type scale: collapse 13 sizes to 8: 12 (meta/mono), 14, 15 (body), 18, 24 (titles),
   32 (section-level), display clamp, rail clamp. Kill 11px everywhere (min 12px).
3. Mono voice: register `font-mono` = PP Supply Mono; `.meta` switches to mono 12px/500
   `tabular-nums` uppercase-off; used for dates, venues, counts, rail superscripts, the hero eyebrow.
4. Rails: `.v-heading` alpha 0.7 → 0.55 light / 0.72 dark so the rail no longer outranks the h1;
   add `text-wrap: balance` to h1/h2, `text-pretty` to `p`.
5. Remove `shadow-card` from static content; keep it only for `PhoneFrame` and the figure plate.
6. Atmosphere: keep grain + one radial gradient; delete the concentric-ring gradient and the
   dot-grid mask (WS1 owns the hero canvas). Verify `background-attachment: fixed` fallback on
   iOS (it is ignored there; make sure the gradient still looks intentional when it scrolls).

Acceptance: `detect.mjs` in-page run reports 0 `thin-border-wide-shadow`, 0 `nested-cards`;
no 11px text; one content width across sections.

### WS6 — Motion and micro-interactions  — DONE 2026-09-09 (uncommitted; Sonnet agent)

Notes: scroll-driven section/row reveal is CSS-only (`animation-timeline: view()`), so
`document.getAnimations()` reports ~26 live timelines at rest by spec — not a leak. Full-page
headless screenshots show unrevealed sections blank for the same reason; per-section scrolled
screenshots in `tmp/verify/final/` confirm everything renders. Copy-email button, sliding nav
indicator, 640ms theme reveal from the clicked toggle, LiveStatus code deleted.

Files: `src/styles/globals.css`, `src/components/layout/Section.astro`, `src/pages/index.astro`
(contact), `src/components/layout/NavPills.astro`.

1. Section entry: CSS `animation-timeline: view(); animation-range: entry 0% entry 35%` fade+8px
   rise on each section's first child group, `animation-fill-mode: both`, wrapped in
   `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`;
   no JS fallback (progressive enhancement). Stagger publication rows 40ms via `--i`.
2. Rows: hover = background wash `accent-soft/40` 120ms, no transform. Bracketed links: underline
   grows from 0 to 100% width, 160ms.
3. Contact: "Email me" becomes a copy-to-clipboard button with inline `Copied` state (Rauno),
   `mailto` remains as a secondary link. `:active scale(.97)`.
4. Nav: keep scroll-spy; add the 1px accent bar sliding between items (`view-transition-name`
   or a transformed pseudo-element, 200ms) — the only nav motion.
5. Theme toggle reveal: keep, retune. Adamo reports it does not feel like it originates from
   the button and the timing is abrupt. In `ThemeToggle.astro`: (i) compute the origin from
   the toggle that was actually clicked *after* layout (there are two toggles; in compact
   sidebar mode the utilities row is transformed, so read `getBoundingClientRect()` inside the
   `startViewTransition` callback, not before); (ii) duration 420 → 640ms, easing
   `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out reads as a wave, ease-out snaps);
   (iii) animate the old layer too — `::view-transition-old(root)` gets the inverse clip
   (`circle(100%) → circle(0)` is not needed; instead keep old at full and fade it
   `opacity 1 → 0` over the last 30%) so there is no hard edge at the circle boundary;
   (iv) add a 2px soft edge by animating `clip-path: circle(r at x y)` on a wrapper with
   `filter: blur(1px)` only on the boundary via a second pseudo, or accept a hard edge and
   skip; (v) `prefers-reduced-motion` keeps the instant switch. Verify in a headed browser
   from both toggles and in compact mode. Sidebar collapse stays.
6. Kill: image `group-hover:scale` transforms (4), card border-color hovers on non-interactive cards.

Acceptance: `document.getAnimations()` returns 0 at rest; every transition ≤ 320ms; reduced
motion disables all transforms.

### WS7 — Information architecture (decision-gated)

D8 answered 2026-09-09: **(a)**. Options kept for the record:
(a) Keep 7 anchors + CV, but Education and Awards become compact (WS4).
(b) Homepage = About, Research, Projects, Experience, Contact; Education + Awards only on `/cv`;
    sidebar drops to 5 + CV, fixing the >4-choices nav.
(c) Rails become the navigation at ≥ 1280 (clickable, scroll-spied), sidebar removed, content
    regains 220px of measure. Largest change, most distinctive.

---

## 5. Verification protocol (every workstream)

1. `npm run build` (runs `astro check` and `verify-dist`).
2. `node ~/.claude/skills/impeccable/scripts/detect.mjs --json src` → 0 findings.
3. `agent-browser` screenshots: 1440x900 light+dark fold and full page, 390x844 fold and full
   page; save under `tmp/verify/<ws>/` and list paths in the report.
4. Contrast: text-muted/bg, meta, rails in both themes ≥ 4.5:1 (3:1 for ≥ 24px bold).
5. Touch targets at 390: no interactive element < 44px tall.
6. `git diff --stat` in the report; no files outside the workstream's list.

## 6. Decisions needed from Adamo before implementation

| # | Decision | Default in this plan |
|---|---|---|
| D1 | CrossCast: drop the video or re-record it | **in progress**: trimmed 36–49.5s clean loop + clean poster; `video:` removed from frontmatter for now |
| D2 | Hero claim sentence and eyebrow wording | **answered**: agents claim only, world models as learning; final wording in WS1.2 awaiting a yes |
| D3 | Portrait photo | **answered**: candidates shared; recommend the blazer selfie; chosen: the level-headed blazer selfie (second of the two full-res); Adamo crops square to `src/assets/brand/portrait.jpg` |
| D4 | Publication links + one-line contributions | **links added** to frontmatter; contribution lines still needed |
| D5 | PrefGUI (withdrawn) | **done**: `hidden: true` everywhere |
| D6 | Featured project order and cap of 3 | **answered**: CommunityGrid, Theme Song Bot, Handle; CrossCast to archive; daily build-time server + user counts, no live counter |
| D7 | Awards: drop "Participant" entry; show 4 + disclosure | **done**: entry removed from `awards.json` |
| D8 | IA option a / b / c (WS7) | **answered**: a |
| D9 | Mobile tab bar: swap CV for Contact | **answered**: yes |
| D10 | Hero background | **answered**: build the app-exploration graph (concept a); rings and dot grid removed |
