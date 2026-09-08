# Nabu Tarot — layout audit: the phone app vs the desktop website

Written 2026-09-08. **Executed the same day**; what the run found and what
was done about it is in `PLAN-LAYOUT-FINDINGS.md`. Nothing is committed or
released. Companion to PLAN-16-LAYERS.md.

## 0. The problem, and what I could already confirm

The owner's screenshot (nabutarot.com on a PC, the Fool page) shows every block
pinned to the left, prose running the whole width, and the page reading as
unbalanced. Their reference picture is a centred stack of clearly labelled,
equal-width bands. That is the target look for long text pages on a desk.

I rendered the site with WebKit at 1280px and 390px before writing this plan.
What the desktop render of a Lenormand card page shows:

- The hero is 112px of card art plus a name, sitting top-left in a 976px row.
  Everything right of the name is empty.
- The "next card" button stands alone at the right edge because `.cardnav` is a
  two-cell grid and the first card has no "previous".
- Prose inside `.ins` runs about 110 characters per line. The 75ch cap added in
  v169-171 covers `.card p`, `.acc .in p`, `.post .body p` and `.lesson p`, but
  not `.ins p`, which is what every card, Lenormand, playing-card, sign and
  guide page uses.
- The "Cặp lá" list and the keyword chips sit left in a card that is far wider
  than they are.

The phone render of the same pages is fine: one column, 18px gutters, nothing
overflowing. So this is mostly a desktop problem, and the fix must live only in
the `@media (min-width:900px)` blocks so the phone app does not change.

Both platforms are one HTML file. The Android app is a Trusted Web Activity
(Chrome rendering nabutarot.com), and iPhone users get Safari's engine. So:

| What the owner calls it | What renders it | How the audit reproduces it |
|---|---|---|
| "the app" | Android Chrome (TWA) / iOS Safari (PWA) | Chromium (Edge) and WebKit at 360, 390, 430px |
| "the website" | a desktop browser | Chromium (Edge) at 1024, 1280, 1536px, WebKit at 1280px |

## 1. Ground rules, borrowed from three skills

From the Cloudflare **security-audit** skill (the method, not the subject):
recon first, then several hunters in parallel each owning one slice, then a
separate agent whose only job is to disprove each finding, then a report with
a severity that needs both likelihood and impact, then structured output, then
independent verification. Its anti-patterns apply here word for word: do not
list everything that deviates from a checklist, do not report "potential"
problems without a screenshot, do not pad the report with trivia, and say what
the layout does well.

From Anthropic's **webapp-testing** skill: drive the real page with Playwright,
wait for the app to settle before measuring, take a screenshot first and read
the DOM second, and keep helper scripts as black boxes so the agents' context
stays clean.

From Anthropic's **frontend-design** skill: decide the desktop layout as a
plan with a wireframe before touching CSS, keep line lengths under 80
characters, let structure carry information (a label above a band should mean
something), and do not reach for the generic card-kit look where every block
is an identical rounded rectangle. That last point is exactly what the owner
is reacting to on the card page.

A **finding** in this audit is: one route, one width, one engine, one element,
one measured number, one screenshot. Anything less is a note, not a finding.

## 2. Phase 1 — recon: what has to be looked at

### 2.1 Screen inventory

22 top-level routes plus the Learn sub-routes. Grouped into six families so
six hunters can run at once. "Sample" means the audit renders those and treats
them as representative of the family; a fix is then checked across the family.

| Family | Routes to render | Sample |
|---|---|---|
| A. Learn — reading pages | `learn/card/<id>`, `learn/len/<n>`, `learn/pc/<id>`, `learn/sign/<key>`, `learn/guide/<id>`, `learn/lesson/<course>/<n>`, `learn/spread/<id>`, `learn/angel/<id>` | 3 tarot cards (a Major, a numbered Minor, a court card), 2 Lenormand, 1 playing card, 2 signs, 3 guides (one flow guide, one plain, one with visuals), 2 lessons, 2 spreads, 1 angel |
| B. Learn — hubs and tools | `learn`, `learn/tarot`, `learn/lenormand`, `learn/playing` (each with `?tab=`), `learn/astro`, `learn/fortune/<tool>`, `learn/manifest`, `learn/numbers`, `learn/quiz/<course>/<n>`, `unlock` | every hub, every fortune tool, one quiz mid-way, the unlock shop with two items in the basket |
| C. Home and feed | `home` (first visit with tour, returning), `news`, `post/<id>`, `hello`, `install`, `alerts` | home in both states, one long post with an image, hello |
| D. Pick and play | `pick` (deck, after a pick, shared link `?card=`), `play`, `play/coin`, `play/tree`, `pet`, `love`, `wedding`, `looks`, `rewards` | deck before and after a pick, coin after a flip, tree after a shake, each other screen once |
| E. Money and contact | `prices`, `book` (each of the 5 steps, with items in the basket), `contact` (with a prefilled draft), `report`, `privacy`, `me` (signed out) | all |
| F. Admin | `admin` with `?tab=` each tab | rendered with the `nabu-admin` localStorage hint so the dashboard draws without Firebase |

### 2.2 The state matrix each route is rendered in

- Widths: 360, 390, 430 (phone); 768 (tablet, the phone layout stretched);
  1024 (rail on, single column); 1280 and 1536 (rail plus two-column home).
- Engines: Chromium via the installed Edge (Android app and Windows desktop)
  and WebKit (iPhone and Mac Safari). Playwright already has WebKit on this
  PC; Edge is launched through Playwright's `channel='msedge'`.
- Language: vi first (the owner's audience), en second, de spot-checked.
- Theme: light for the geometry pass; dark and pink only for the contrast pass.
- Signed out, with a seeded profile (name, birthday, interests) and seeded
  course access so paid pages render fully.

Count: roughly 60 routes x 7 widths x 2 engines x vi = 840 renders. Playwright
does one in about a second, so the whole matrix is a few minutes per run.

## 3. Phase 2 — hunt: the scanner and the six hunters

### 3.1 The scanner (`test/layout_probe.py`)

One Python + Playwright script, built from the old `wk.py` and `over.js`,
that serves the repo on :8799, renders a route at a width, waits for
`#main > *` plus 1.5s, screenshots it full-page, and returns a JSON list of
measured problems. It measures, it does not judge:

| Check | What it measures | Flags when |
|---|---|---|
| overflow | `scrollWidth` vs viewport, every element's right edge | anything past the viewport edge (the old `over.js`) |
| clipped | elements with `overflow:hidden` whose `scrollWidth` > `clientWidth`, and `text-overflow:ellipsis` that is actually cutting | text is being cut |
| line length | for every `p`, `li`, `.a`, `.scene`: width divided by 0.48 x font-size, giving characters per line | more than 85 on desk, more than 45 on phone |
| orphan | for every direct child of `#main` and of `.detail`/`.guide`/`.sec`: the box width vs the width its content actually occupies (union of descendants' rects) | content fills less than 55% of the block on desk (the hero row, the lone "next" button) |
| void | the vertical gap between consecutive blocks | more than 90px of nothing |
| lonely grid cell | grids (`.cardnav`, `.two`, `.row3`, `.tiles`) with fewer children than columns | a single child in a multi-column grid |
| tap target | buttons and links on phone widths | the box is under 40px tall or under 40px wide |
| tiny text | computed font-size on phone widths | under 12px |
| pixel-locked | static grep of `shell.html` for `px` widths and `grid-template-columns` with px tracks outside any media query | listed once, for the hunters to judge, not a finding on its own |
| contrast (dark/pink pass only) | text colour vs its painted background for every text node | below 4.5:1 body, 3:1 large text |

Output per render: `test/_probe/<engine>_<width>_<route>.png` and one JSON
record per flag with route, width, engine, selector, the number, and the
screenshot path. A summary table at the end sorted by route.

### 3.2 The six hunters

Six agents, one per family, launched in one message so they run at the same
time. Each gets: this plan's recon table for its family, the exact routes to
render, the probe's `--help`, and the rules below. Each hunter:

1. Runs the probe over its family at all seven widths in both engines.
2. Opens every desk screenshot and every 390px screenshot and looks, because
   the probe cannot see "this reads as unbalanced". The owner's screenshot
   would trip the orphan and line-length checks, but a hunter still has to
   say which of the two is the real cause.
3. Writes findings in the fixed format (section 3.3), one per root cause, not
   one per page: "`.ins p` has no line cap" is one finding that lists all the
   routes it appears on.
4. Also reports anything it notices outside its family. Boundaries are for
   scheduling, not for ignoring bugs.

### 3.3 What counts as a finding, and how severe

| Severity | Meaning | Examples |
|---|---|---|
| P1 | someone cannot read it or cannot tap it | text clipped, horizontal scroll, a button under 40px on a phone, a label hidden under another element |
| P2 | it reads as broken or unbalanced (the owner's complaint) | orphaned hero, prose over 85ch on a desk, a lone grid cell, a 150px void, sections of visibly different widths on one page |
| P3 | polish | gutters that differ between neighbouring blocks, mixed corner radii on one page, an eyebrow that means nothing |

Rules every hunter applies before reporting:

- The finding names the route, the width, the engine, the CSS selector, the
  measured value, and a screenshot path. No screenshot, no finding.
- It states which platform it belongs to: phone only, desk only, or both. A
  desk-only finding must be fixed inside `@media (min-width:900px)` so the app
  is untouched; a phone-only finding must be fixed outside it.
- "By design" is checked first. The fan of cards, the rings, the animal wheel,
  the pet stage and the tree are drawn in pixels on purpose and sit centred; a
  short row of chips under a heading is fine. The v169-171 comments in
  `shell.html` say what was left alone and why.
- If a rule already handles it at another width (the 380px grid fallbacks, the
  75ch cap on `.card p`), the finding is "the cap does not reach X", not "no
  cap".
- Ten P3s do not make a report. Three P2s with the routes they cover do.

## 4. Phase 3 — validate: try to disprove every finding

One validator agent per family (or per finding for the big ones). It gets the
finding, re-renders the route itself, and returns either CONFIRMED with its own
screenshot and number, or REJECTED with the reason (by design; already handled
at that width; probe artefact such as a font not loaded in headless WebKit; a
measurement taken before the page settled). Duplicates across families are
merged here. Anything that only reproduces in one engine is kept but marked
engine-specific, because the v46 iOS report never reproduced in headless
browsers and was still real.

## 5. Phase 4 and 5 — report and structured output

`PLAN-LAYOUT-FINDINGS.md` in the repo:

- one paragraph of honest summary (the phone layout is in good shape; the desk
  layout is one rule set applied to many different kinds of page),
- a table: severity, title, platform, routes affected, root cause selector,
- each finding with its screenshot, the number, and the proposed fix,
- a "left alone on purpose" section,
- a "what already works" section.

`test/_probe/findings.json`: one object per finding with `id`, `severity`,
`platform`, `routes[]`, `widths[]`, `engines[]`, `selector`, `measure`,
`screenshot`, `root_cause`, `fix`, `status` (open, fixed, wontfix). This is
what a later run diffs against, the way the security skill reads prior runs.

## 6. The fix direction (decided now, executed later, after the report)

This is the design plan the frontend-design skill asks for before code. It
will be adjusted by what the hunters find, but the shape is already clear from
the renders.

### 6.1 Long reading pages on a desk (family A, plus `post`, `privacy`)

**Decided 2026-09-08 by the owner: Option A, with the Nabu AI box under the card.**
Previewed on the real Fool page (scratchpad `preview.py`, artifact "The Fool,
Three Ways"). Option B is kept below only as the record of what was rejected.

Option A: a sticky hero rail beside a reading column.

```
| rail |  ← Lenormand                                                  |
|      |  +-----------+   +--------------------------------------+     |
|      |  |  card art |   | Trên lá bài                          |     |
|      |  |  1. Kỵ Mã |   | Từ khóa tích cực   [chips]           |     |
|      |  |  Rider    |   | Từ khóa tiêu cực   [chips]           |     |
|      |  |  tags     |   | Nghĩa chính  (prose, 68ch)           |     |
|      |  |  ← prev   |   | Tình cảm / Công việc / ...           |     |
|      |  |  next →   |   | Cặp lá                               |     |
|      |  |  Nabu AI  |   | Các câu hỏi thường gặp               |     |
|      |  |  (sticky) |   | buttons                              |     |
|      |  +-----------+   +--------------------------------------+     |
```

- `body[data-route="learn"] .detail` at 900px+ becomes
  `grid-template-columns:300px minmax(0,680px)`, centred with
  `justify-content:center`. The hero, the first `.cardnav` and the `.ai`
  panel are wrapped in a `.rail` (a small change in `cardBodyHTML`,
  `lenBodyHTML` and the playing-card/sign/guide builders, or done once in
  `route()` after render) that takes column 1, `position:sticky;top:78px`,
  `max-height:calc(100vh - 90px);overflow:auto` so a short window scrolls the
  rail on its own. Everything else flows in column 2.
- The AI box in the rail: `.rail .ai` left-aligned text, suggestion chips
  wrap instead of scrolling sideways, the chat bar stacks the textarea over a
  full-width "Hỏi" button. `.ai-chat` keeps its own scroll. The second
  `.cardnav` at the foot is hidden on a desk because the rail already has it.
- On a phone nothing moves: the `.rail` wrapper has no rules below 900px, so
  its children lay out exactly as today.
- The reading column is capped at about 680px and the pair is centred in the
  1040px wrap, so the page has a spine instead of a left edge.
- `.ins p, .ins .scene, .ins .qa .a` get the same 70ch cap the other prose
  already has, and the cap is measured in the column, not the wrap.
- `.cardnav` with one child spans both cells, so a first or last card never
  shows a stranded button.
- The hero art grows on a desk (112px was sized for a hand): about 180px.
- Section labels (`.ins h3`) stay, because they carry information; the bands
  under them are what the owner's reference picture shows. What changes is
  that the bands stop being 976px wide with 300px of text in them.

Option B (rejected 2026-09-08), the literal reading of the reference picture: one centred 680px
column, hero centred above the name, every section a full-width band. Simpler
CSS, but it leaves a third of a wide window empty on both sides and the card
art competes with the heading. The owner saw both on the real page and chose A.

### 6.2 Pages with no hero (families B, C, E)

Cap the content of text-only pages (`prices`, `contact`, `report`, `privacy`,
`unlock`, `me`, `alerts`, `install`, `news`) to a 720px centred column via
`body[data-route=...]`, and let real grids (`.tiles`, `.pricesec`, `.hgrid`)
keep the full 1040px. Home already does this with its two columns.

### 6.3 Rules for the code

- Desktop rules only inside `@media (min-width:900px)` and scoped by
  `body[data-route]`, so a phone never sees them.
- No new utility class reuse (the v74-78 theme trap); every new element gets
  its own selector and is checked in dark and pink.
- Every change is one root cause, one commit, one before/after pair of
  screenshots in the commit message.

## 7. Phase 6 — verify after the fix

- Re-run the probe over the whole matrix; the findings.json diff must show
  every fixed item gone and nothing new.
- Re-read the desk screenshots of the sample routes side by side with the
  "before" set.
- `PYTHONIOENCODING=utf-8 python test/run.py` stays at 567 passing.
- Add to `run.py` a small layout section (about 10 checks): no horizontal
  overflow at 390 and 1280 on the sample routes, no `p` over 85ch at 1280, no
  lone `.cardnav` child, hero rail sticky on `learn/len/1` at 1280.
- Bump `CACHE` in `sw.js`, rebuild, push, then check nabutarot.com on the
  owner's PC and phone, because a stale service worker is the usual reason a
  fixed page "still" looks wrong.

## 8. Order and effort

1. Build the probe and run it over family A only, to calibrate the thresholds
   against the owner's screenshot before trusting it on everything. Half an
   hour.
2. Full recon run, six hunters in parallel, validators, report. One session.
3. Owner reads the report. The layout choice (Option A with the AI box under the card) is already made.
4. Fix in the order P1, then P2 by number of routes covered, then P3 if any
   are worth it. One or two sessions.
5. Verify, ship, and keep `findings.json` so the next run diffs against it.

## 9. What this plan does not do

- It does not change any wording. The plain-Vietnamese rules stay as they are.
- It does not touch the phone layout unless a hunter finds a phone bug.
- It does not restyle the site. Palette, fonts and the three themes stay; only
  where things sit on a wide window changes.
- It does not audit security. The security-audit skill is now installed and
  can be run separately against `worker/` and the Firestore rules, which is a
  different job with a different report.
