# Nabu Tarot — the 16 layers, what exists, what is missing

A plan, not a change. Nothing here has been built. Each layer from the
"vibe coding in a real SaaS" list, checked against the repo on 2026-09-07.

Legend: **Have** = already there and working. **Gap** = missing or weak.
**Do** = the concrete piece of work, sized S / M / L.

---

## 0. The picture first

Nabu Tarot is a static PWA (GitHub Pages) + Firebase (Auth, Firestore, Storage)
+ one Cloudflare Worker (`worker/`) for AI answers and two email jobs. There is
no backend of Nabu's own to scale, so several layers in the list collapse into
"configure the service correctly" rather than "write a server".

Rough score today: **9 of 16 layers are in decent shape.** The real gaps are
**security of paid access, rate limiting, error tracking, monitoring, and the
test suite that currently will not run.**

---

## 1. System design — Have

- One-paragraph design in `HANDOVER.md` §1 and §8; collections listed; globals named.
- **Gap**: no diagram of what talks to what (browser → Firestore, browser →
  Worker → Gemini/Claude/Resend, Actions → repo JSON).
- **Do (S)**: one page `docs/ARCHITECTURE.md` with a mermaid diagram and the
  trust boundaries marked (what the browser is trusted with, what it is not).

## 2. System architecture — Have, with one honest weakness

- Build order in `build.py` is documented; screens are modules; `sub()` for
  streams; `store` wraps localStorage.
- **Gap**: `ACCESS` is client-trusted (`HANDOVER.md` §8). Anyone can grant
  themselves a course by editing localStorage. Binding to the account stops
  sharing, not tampering.
- **Do (M)**: move the *source of truth* for access to Firestore
  `users/{uid}.access`, written only by admin (rules already have `isAdmin()`).
  `ACCESS.has()` becomes a cache of that document, refreshed on sign-in and on
  each cold start. The offline case keeps the cached copy for 7 days.
- Depends on: layer 6 (rules republished).

## 3. Frontend — Have

- Bilingual, offline-first, installs on iOS/Android, ~60 screens.
- **Gap**: desktop renders as a 600 px phone column at 1440 px (`HANDOVER.md` §7).
- **Do (M)**: a `@media (min-width: 900px)` layer — two-column home (feed left,
  today/luck right), admin dashboard full width, cards grid 4-up. Keep the
  phone layout untouched below 900 px.

## 4. APIs & backend logic — Have, thin

- Worker `worker/src/index.ts`: `POST /` (ask AI), report email, booking email.
  Model fallback chain, prompt caching on the Claude path, CORS pinned to
  `nabutarot.com`.
- **Gap**: the Worker does not know *who* is calling. CORS is not auth — `curl`
  ignores it. Anyone can burn the AI budget.
- **Do (M)**: browser sends the Firebase ID token (`Authorization: Bearer`);
  Worker verifies it against Google's JWKS (cache keys in memory), rejects
  anonymous, and reads `uid` for layer 10. ~40 lines, no new dependency.

## 5. Databases & storage — Have

- Firestore collections mapped (`HANDOVER.md` §8); `storage.rules` present.
- **Gap**: no backup. A bad admin action or a rules mistake is unrecoverable.
- **Do (S)**: enable Firestore scheduled exports to a GCS bucket (daily, 30-day
  retention). Console-only, no code. Note it in `HANDOVER.md` §6.
- **Do (S)**: a `scripts/export-firestore.py` that pulls a JSON snapshot with
  the admin SDK, for the owner to run before big changes.

## 6. Auth & permissions — Have, blocked on one manual step

- Firebase Auth, 347-line `firestore.rules` with `isAdmin()` (email-verified,
  allowlisted), `isOwner()`, field-length guards.
- **Gap**: rules are **not republished** (`HANDOVER.md` §6.1). Several shipped
  features refuse writes until they are. This is the single highest-value
  10-minute task on this list and it is the owner's, not code.
- **Gap**: no rules tests. A rules edit is verified on a phone, by feel.
- **Do (M)**: `test/rules/` using `@firebase/rules-unit-testing` against the
  emulator — one test per `allow` line that matters (about 25: revoke,
  `paid`, `talk`, `ready`, `people` owner-only, admin gates). Add to CI.

## 7. Hosting & cloud — Have, move planned

- GitHub Pages + `CNAME`; Cloudflare Pages move fully planned in
  `MOVING-TO-CLOUDFLARE.md`; `_headers` and `assetlinks.json` already in place.
- **Do (S, owner)**: execute the move. Gains: private repo, real
  `Cache-Control` and security headers (GitHub Pages ignores `_headers`),
  Cloudflare in front for layers 10 and 11.

## 8. CI/CD & version control — Have

- `test.yml` on push/PR: builds, asserts `index.html` matches `src/`, runs the
  suite in headless Chrome. Three scheduled sync jobs.
- **Gap**: nothing deploys the Worker. `wrangler deploy` is by hand.
- **Gap**: the version bump is two hand edits that are easy to forget one of.
- **Do (S)**: `worker.yml` — on push to `worker/**`, `wrangler deploy` with
  `CLOUDFLARE_API_TOKEN` as a repo secret.
- **Do (S)**: `build.py` reads the version from **one** place (`VERSION` file)
  and writes both `main.js` and `sw.js`; CI fails if they disagree.

## 9. Security — Partly

- Headers set (nosniff, frame, referrer, permissions-policy) — live only after
  layer 7. Firebase web key in the bundle is public by design; fine.
- Course codes: `courseSecret` is gone from `src/`; `README.md` still describes
  it. Codes now live in `codes.json` / Firestore `codes`.
- **Gap**: no `Content-Security-Policy`. One injected script in a post body
  would run with the user's Firebase session.
- **Gap**: `README.md` is stale on how codes work.
- **Do (M)**: CSP in `_headers`: `default-src 'self'; script-src 'self'
  https://www.gstatic.com; connect-src 'self' https://*.googleapis.com
  https://*.firebaseio.com https://nabu-ai.*.workers.dev; img-src 'self' data:
  https:; style-src 'self' 'unsafe-inline'`. Test every screen — this will
  break something the first time, that is the point.
- **Do (S)**: fix the README paragraph on codes.

## 10. Rate limiting — Gap (none)

- The Worker forwards Anthropic's 429 as `busy`; it never limits on its own.
- **Do (M)**: per-`uid` (from layer 4) limit in the Worker using Cloudflare
  KV or the Rate Limiting binding: e.g. 30 AI questions / day for paid,
  5 / day for free, 1 / minute burst. Return `{error:"limit", resetAt}` and
  show `T().aiLimit` with the time. Also limit the two email endpoints
  by IP (10 / hour) — they cost Resend quota.
- **Do (S)**: Cloudflare WAF rate rule on `nabutarot.com` after layer 7
  (free tier allows one rule): 100 req / 10 s per IP.

## 11. Caching & CDN — Have (after the move)

- `sw.js` precache + network-first for HTML/JSON, cache-first for assets.
  `_headers` no-caches the SW and JSON, caches PNGs a week.
- **Gap**: the AI Worker recomputes identical questions (daily card meaning
  for the same card and focus is asked hundreds of times).
- **Do (S)**: Worker caches by `sha256(lang+kind+question+context)` in KV for
  24 h when `history` is empty. Cuts AI spend for the common case.

## 12. Error tracking & logs — Gap (last-error only)

- `report.js` keeps `window.__lastError`; `core.js` keeps the last 3 in
  `OOPS`. Nothing leaves the phone unless the user opens `#/report`.
- Worker: `catch {}` swallows everything; no `console.log` reaches anyone.
- **Do (M)**: browser — on `error` / `unhandledrejection`, write a doc to
  Firestore `errors/{auto}` with `{version, screen, message, stack.slice(0,
  800), ua, uid?, at}`; rules allow create-only, 2 KB cap, no read except
  admin. Throttle: max 5 per session, dedupe by message.
- **Do (S)**: Worker — `console.error` with a structured object on every
  non-200; enable Workers Logs (free tier keeps 3 days) or tail via
  `wrangler tail`.
- **Do (S)**: an **Errors** tab in `#/admin` reading `errors` ordered by `at`,
  grouped by message, with version and screen. That is Nabu's Sentry.

## 13. Monitoring & alerts — Gap (none)

- The bell is per-device and for users; nothing tells Nabu the site is down.
- **Do (S)**: Cloudflare Health Check (or UptimeRobot free) on
  `https://nabutarot.com/` and the Worker URL, emailing Nabu on failure.
- **Do (S)**: a scheduled Action `health.yml` every 6 h: fetches `index.html`,
  asserts `APP_VERSION` matches `main`, asserts `#main` renders in headless
  Chrome, POSTs a tiny question to the Worker. Fails loudly by email.
- **Do (S)**: Firebase budget alert at the console (Firestore reads and
  Workers AI both have free tiers that end quietly).

## 14. Testing — Have on paper, broken in practice

- ~550 checks in `test/`; CI runs them in Chrome; local Edge run **stalls
  before the first check** (`HANDOVER.md` §3).
- Unknown: whether CI is green right now — `gh` is not on this machine. First
  thing to check.
- **Do (M)**: fix the stall. Order: (1) look at the last CI run — if CI is
  green the problem is local-only and low priority; (2) per-check progress
  line in `test/test.html` and find the dying check; (3) smaller
  `--virtual-time-budget`; (4) bisect by commenting blocks.
- **Do (M)**: rules tests (layer 6) and a Worker test (`vitest` +
  `unstable_dev`) for the auth and limit paths.

## 15. Scaling — Mostly free

- Static + Firestore + Workers all scale without Nabu doing anything.
- Real limits: Firestore free tier (50 k reads / day) and the AI budget.
- **Do (S)**: measure. Firestore usage tab once a week for a month; if the
  feed is the read hog, paginate it (`limit(20)` + cursor) — it is the one
  query that grows with content.

## 16. And more — the product gaps already on the list

- Refuse a love thread with someone already tied (`HANDOVER.md` §7).
- Both partners requesting different wedding times; `WED.create` must not
  overwrite an existing room.
- Google Play listing (creating it early starts the 14-day tester clock).

---

## Suggested order

Ranked by value ÷ effort. Owner-only tasks first because they unblock code.

| # | Task | Layer | Size | Who |
|---|------|-------|------|-----|
| 1 | Republish `firestore.rules`; verify admin email | 6 | 10 min | owner |
| 2 | Check whether CI is green; fix the local stall | 14 | M | code |
| 3 | Worker verifies Firebase ID token | 4 | M | code |
| 4 | Per-uid rate limit + email endpoint limit | 10 | M | code |
| 5 | Client errors → Firestore `errors` + admin Errors tab | 12 | M | code |
| 6 | Uptime check + `health.yml` + budget alert | 13 | S | code + owner |
| 7 | Worker KV cache for repeat questions | 11 | S | code |
| 8 | `worker.yml` deploy + single-source version | 8 | S | code |
| 9 | Firestore daily export | 5 | S | owner |
| 10 | Cloudflare Pages move | 7 | S | owner |
| 11 | CSP header, tested on every screen | 9 | M | code |
| 12 | Access source of truth in Firestore | 2 | M | code |
| 13 | Rules tests in CI | 6/14 | M | code |
| 14 | Desktop layout | 3 | M | code |
| 15 | `docs/ARCHITECTURE.md`; fix README on codes | 1/9 | S | code |
| 16 | Feed pagination when reads say so | 15 | S | code |

Tasks 3 → 4 → 7 are one Worker change and ship together. Tasks 5 and 6 can
be one session. Everything from 11 down is comfortable to defer.

## What this plan does not do

- No new servers, no Node backend, no Docker. The stack stays static +
  Firebase + Worker; that is the right size for one practitioner's client app.
- No Google Pay / Apple Pay. Payment stays bank transfer in chat.
- Nothing is executed until told to.
