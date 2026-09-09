# Nabu Tarot: brief for the next session

Rewritten 2026-09-09, after **v191** went live on the `play-billing` branch
(not yet merged to `main` — that merge is the owner's call, not this
session's).

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read NEXT-SESSION.md"**.

**Google Play Billing is code-complete.** The client and worker sides are
built, tested and committed. What is left is Google-Console configuration
only the owner can do, plus four known follow-ups. Part 1 is the project.
Part 2 is the billing state and what is left. Part 3 is what the session
before you changed. Part 4 is the owner's standing rules and the layout
facts. Read Part 2 before touching anything.

---

## Before you merge anything into `main`: read this

**`main` is at v196.** It moved six releases on 2026-09-09, from a second window,
while the Play Billing work was going on in the `play-billing` branch:

| | |
|---|---|
| v191 | German reads justified, exactly as VI/EN do; centred blocks centre again |
| v192 | A free turn is spent by the person, not the handset (`turns` on the account) |
| v193 | The coin will not flip until a question is written |
| v194 | An amount named in a sentence is named in the reader's own currency |
| v195 | A wedding is `1 wedding`, not `12 months` |
| v196 | The German wedding terms say "Die Gebühr wird nicht erstattet." |

Those touched `src/shell.html`, `src/core.js`, `src/pick.js`, `src/backend.js`,
`src/services.js`, `src/strings.js`, `src/book.js`, `src/learn.js`,
`src/wedding.js`, `src/admin.js`, `src/main.js` and `test/test.html`. The
`play-billing` branch was cut before all of them and carries none.

**So a merge is not enough.** The whole app is one committed `index.html` built
by `build.py`. If you merge and commit a bundle built from a tree that predates
these, every one of them silently disappears from the live site, and nothing in
git will look wrong. This exact failure already happened once, on 2026-09-08.

After merging, in this order:

1. `python build.py` - rebuild from the merged sources, do not reuse a bundle.
2. `PYTHONIOENCODING=utf-8 python test/run.py` - **630 checks** at v196. A lower
   number means checks were lost in the merge, not that the suite got smaller.
3. Grep the built `index.html` for a string from **both** sides. From this side:
   `turnsMerge` (v192), `termText` (v195), `Die Gebühr wird nicht erstattet` (v196).
4. Bump `APP_VERSION` in `src/main.js` **and** `CACHE` in `sw.js` together.
5. After pushing, fetch the live page and check the same strings are really there.
   Pages can take several minutes; v196 outlasted a twenty-attempt poll before
   it appeared.

**Still open, and nobody is working on it:** the free-turn limit is stored on
the account but the account's owner may still write that field, so it is not
tamper-proof. The fix is to forbid `turns` in `firestore.rules` the way `access`
already is, and to spend a turn through a worker endpoint using the `fsGet` /
`fsPatch` helpers this branch built. It was left until Play Billing lands
because it touches the same files.

---

## Part 1. The project in six lines

- Trilingual (vi / en / de) tarot PWA. Repo `C:\Users\angel\nabu-tarot`, branch `main`. Live at https://nabutarot.com, deployed from GitHub `main` in about a minute.
- Vanilla JS, no framework. `python build.py` joins `src/*.js` and `src/shell.html` into the committed `index.html`. UI strings live in `src/strings.js` under `T()`.
- Suite: `PYTHONIOENCODING=utf-8 python test/run.py`. About 6 minutes, **622 checks, all passing at v191**. A second window uses `NABU_PORT=8766`.
- **A release is: bump `APP_VERSION` in `src/main.js` AND `CACHE` in `sw.js` to the same new number, `python build.py`, run the suite, one commit, push.** Both markers, every time. A past session shipped four releases without bumping either and left the app reporting a stale version; do not repeat it.
- One Cloudflare Worker, `nabu-ai`, at `https://nabu-ai.0211nhatanh.workers.dev`, reached through `CONFIG.aiEndpoint`. Deployed by `.github/workflows/worker.yml` on every push touching `worker/`.
- The Android app is a **Trusted Web Activity** (`app.nabutarot.twa`): it opens the live site full screen. Content changes need no new bundle. Only the wrapper itself does.

---

## Part 2. Google Play Billing — where it stands after v191

### What now exists

Both sides of the catalogue agree: `src/play-catalog.js` on the client and
`worker/src/catalog.ts` on the worker list the same eight products with the
same ids. Nothing is trusted from the phone — it hands the worker the token
Play gave it, and the worker is the **only writer of entitlements**:

- The worker verifies every purchase directly with Google (product, app,
  token, state) before writing anything.
- A **token-keyed ledger** (`purchases/{sha256(token)}`, written by
  `claimPurchase`) is claimed before access is granted, so the same token can
  never be spent twice by two different accounts.
- `/rtdn` receives Google's Real-time Developer Notifications (a signed
  Pub/Sub push) and re-asks Google for the token's current truth rather than
  trusting the notification's own claim — a duplicate, a late arrival or an
  out-of-order push all land on the same answer.
- A **cron reconciles every 6 hours** (`10 */6 * * *` in `worker/wrangler.toml`,
  `reconcileSubs` in `worker/src/reconcile.ts`): it re-reads every live
  subscription purchase row and rewrites the account from Google's actual
  state, as a safety net for any missed RTDN and a repair for a lost
  `users/{uid}.subs` row. The same scheduled tick also sweeps voided
  one-time purchases (`sweepRefunds`).
- The client has an **in-app store** (`class="store"` in the built page), a
  **plans card**, and Play is the *only* payment method inside the Android
  app. The **website is untouched**: bank transfer and codes only, no Play
  UI rendered there (`BILL.can()` is false outside the installed app).
- Readings with Nabu are still never sold through Play, on any platform: an
  hour of a person's time is not a digital good.

### The four Play subscription product ids, confirmed against Google

| Key | Play product id | Base plan length |
|---|---|---|
| `manifest` | `manifest_sub` | 12 months |
| `plus` | `plus_sub` | 12 months |
| `pro6` | `pro_sub` | 6 months (this is "Pro", the 6-month product) |
| `pro` | `pro12_sub` | 12 months |

Each of these four products has **exactly one active base plan**, and that is
load-bearing: the TWA bridge (`android-browser-helper`) always launches a
subscription's **first offer** and has no way to choose among several base
plans. **Never add a second active base plan to any of these products, and
never attach a free trial or promotional offer to one** — the code path that
*displays* a price and the code path that *charges* the buyer pick their own
offer independently, so a second offer can silently make those two paths
disagree about what the buyer is getting or paying.

The four one-time products are unchanged in shape: `tarot`, `lenormand`,
`playing`, `wedding` — each a one-time Play product, no subscription.

### What the owner still has to do

Nothing above needs more code. What is left is Google/Firebase console work
only the owner can do:

1. **Verify `firestore.rules` in the Firebase rules playground, then publish
   it.** Until this is published, a signed-in person can still write their
   own `access`/`subs` from a browser console — this is the single biggest
   open hole and has nothing to do with Play.
2. **Create the Pub/Sub topic and push subscription for Real-time Developer
   Notifications**, and point Play at it (topic `play-rtdn`, push
   subscription to `https://nabu-ai.0211nhatanh.workers.dev/rtdn` with
   authentication enabled, service account
   `nabu-worker@nabutarot.iam.gserviceaccount.com`, audience the same `/rtdn`
   URL). Without this, entitlement changes only ever reach the account
   through the 6-hourly reconcile, not immediately.
3. **Add licence testers** (Play Console → Setup → Licence testing) — the
   only way to buy without spending real money.
4. **Upload the existing versionCode 2 AAB** to internal testing. Nothing new
   needs building for this; the billing bridge this plan uses is already in
   that bundle.
5. **Check the payments profile is verified** (Play Console → Setup →
   Payments profile). Until it says *Verified*, test purchases work but no
   money is ever paid out.

Say this plainly to the owner: **until step 1 (the rules) is published, a
signed-in person can still write their own access from a browser console.**
That is true today, independent of anything else on this list.

### Known follow-ups, and why each was deferred

(a) **Retire expired `subs` rows and record provenance on non-Play grants.**
Today, `recompute` in `worker/src/entitle.ts` lets a Play subscription row
that names a key win outright over a non-Play grant for that same key — so a
customer who holds *both* a website code and a Play subscription for the
same access key silently **loses the longer of the two**: even a
far-in-the-future code-granted date is shortened down to whatever Play's row
says, because there is no field recording that the code grant did not come
from Play. This cannot hurt anyone until Play sales actually begin, since no
customer has a Play row yet — but it **must land before the first
subscription is sold**, not after.

(b) **Optimistic concurrency** (`currentDocument.updateTime` compare-and-set)
on the Firestore writes the worker makes. This closes three concurrency
findings that are currently parked/accepted rather than fixed — two
concurrent writers (say, a `/billing` call and a `/rtdn` push landing at the
same moment) can each read-then-write without noticing the other's change.

(c) **`reconcile`'s Firestore query uses `limit: 500` with no cursor** —
`worker/src/reconcile.ts`, the `structuredQuery` in `reconcileSubs`. Once
there are meaningfully more than about 300 active subscription rows, some
will silently stop being reconciled every 6 hours (RTDN still covers them
individually). Revisit before the subscriber count gets near there.

(d) **Website pricing in USD/EUR** for the English and German interfaces is
still blocked: the four one-time products' prices are not returned by the
Play API in a form the worker can currently surface to the website (which
never talks to Play at all — it is bank-transfer only). This needs its own
pricing source before it can ship.

### Not fixed, on purpose

`ACCESS.has()` (`src/core.js`) reads local storage, so somebody willing to
edit their own browser can switch a course on. Closing that means the lesson
text not being in the downloaded page at all, served from the worker only to
accounts that hold it — a different app. Leave it unless the owner asks.

### What has NOT been tested

Be plain about this with the owner: **nothing in this feature has been
tested on a real phone, and no real purchase — test or otherwise — has ever
been made.** Everything above is verified by the 622-check browser suite and
the 50-check worker suite (both mocked), plus a clean `tsc --noEmit`. The
first real signal will come from a licence tester on a real device, once the
owner's checklist above is done.

### Rollback

Every piece degrades on its own: remove the worker secret and `/billing`
answers `not configured`; the client's store hides itself when
`BILL.can()` is false (any device outside the installed, verified TWA); the
rules can be republished from git. No step takes more than an hour to walk
back.

---

## Part 3. What the session before you changed

### v191 (2026-09-09) — Google Play Billing, released on `play-billing`

Version bump, build and full suite only — the billing implementation itself
was written and reviewed in earlier sessions on this branch (see Part 2 for
the current state of that work). This release:

- Bumped `APP_VERSION`/`CACHE` to `v191` and rebuilt (`index.html`, `1` hit
  for `v191`, `1` hit for `class="store"`, `0` remaining `VI-OWNER:` markers
  in `src/strings.js` — the release gate that every customer-facing string is
  owner-approved).
- Ran the full suite clean: **622 checks, 622 passed, 0 failed**. Worker
  suite **50/50**, `npm run typecheck` clean.
- Committed on `play-billing`. **Not pushed, not merged to `main`.** The
  merge — which is what actually deploys the live site — is the owner's
  decision, not a release step this session took.
- v190 (German localisation pass) had already shipped and merged before
  this; do not confuse the two numbers.

### v190 and earlier (2026-09-08 → 09) — five releases ending at v190

Full detail in **`HANDOFF-GERMAN-PASS.md`**; this is what you need to know so
nothing surprises you.

- **The whole localization review was applied.** German now covers the 540 course Q&A, all 78 card insights (`src/insight-de.js`, a new file registered in `build.py`), the 26 guides, spreads, lessons, quizzes, and `STR.de` with no English fallback. All three `STR` blocks hold exactly 1609 keys.
- **The privacy policy was factually wrong and is corrected.** It said Nabu AI used Google Gemini. It does not: `CONFIG.geminiKey` is empty, so questions go to the Cloudflare Worker, which answers with Anthropic Claude. `PLAY-DATA-SAFETY.md` (new, repo root) carries the matching Play Console Data safety answers — **read it before you touch that form as part of the billing work**.
- **Polls and wish posts have German**, and `loadActs()` now fills any missing locale text from `activities.json` / `activities-stock.json` at load, because the published list comes from Firestore and that copy can be older than a translation.
- **Both composers take German** — post title and body in `admin.js`; activity title, intro, poll options and pile messages in `play.js`.
- **A German-only layout pass** at the end of `src/shell.html`, every rule behind `html[lang="de"]`: ragged right instead of justified, hyphenation, tile labels that break inside a word, and a data-table label column that wraps. Vietnamese and English are untouched. The thirteen long design names in `src/looks.js` carry **soft hyphens** at their seams, because the measuring browser has no German hyphenation dictionary.
- **Seven checks in `test/test.html` were updated** — six asserted old copy or the old German→English fallback, and one asserted a hardcoded results date that had arrived.

Still open from that work: the install/distribution copy is deliberately
unchanged while Play closed testing has too few testers (review §17), and the
owner has not yet read the German prose with a native eye.

---

## Part 4. The owner's standing rules

- Layout matters on **Android and iPhone equally, and on the PC**, on every page. Never call a layout concern "iPhone only" or "phones".
- **Vietnamese copy is the owner's and is used verbatim.** When a Vietnamese line is needed, ask for it rather than translating. English and German are written to match.
- Plain short sentences. One idea per sentence. Everyday tarot words.
- The owner reads **screenshots of the live page**, not the source. When they say "still not fixed", check nabutarot.com, not `src/` — and remember the service worker, which is why `CACHE` must be bumped.
- **Never build, commit or release while another session is working** on this repo. Several windows share one built `index.html`.
- `index.html` must only ever come from `python build.py`. The build pins the inline script by SHA-256 in the CSP; hand-editing it blocks the script and gives a blank page.

### What holds the layout in place

- **Phone:** the suite renders eight busy screens at 320, 360 and 390px in headless Chromium and fails on anything leaving the screen, any tap target under 40px, any line over 85 characters. **Safari (iPhone) is measured by nothing.** After a layout change ships, ask the owner for a one-minute look on each phone.
- **Desk:** `ONE_COL` in `src/core.js` lists the routes that take the single-column shape on a wide window. A new one-thing screen must be added there.
- **The probe:** `python test/layout_probe.py --lang de --routes home me play --widths 390 320 --shots all` renders and flags geometry, and writes screenshots to `test/_probe/`. It reports; it does not judge. `--lang` is how German is measured.

### Still open on alignment

- **Prose pushed left on a desk.** Most pages cap paragraphs at `62ch`/`75ch` inside a 1040px column with no `margin:auto`, so the right third sits empty. The lesson page was fixed by hand; the rest were not. One rule could fix it but touches every page — get the owner's yes, then show them three or four pages on a PC.
- **Signed-out `#/welcome`** shows a raw permission error on Continue.

### Other things owed, not requested

In priority order, also in memory as `nabu-onboarding-stage2`:
1. Checks for three late onboarding fixes (second account on one phone, deletion removing `handles/` and `people/`, Google/Facebook sign-up landing on `#/welcome`).
2. Delete the love system's own username step (`drawHandle` in `src/love.js`), unreachable since v186.
3. A guest branch on `#/welcome`.
4. `claimHandle` strands the old handle reservation on a rename from a second phone.
5. `claimFrom` still has the suffix-collapse defect the welcome screen fixed for itself.

---

## Scratch

`_patch/` is untracked scratch from the localization session: the patch
scripts, the audit tools (`de_audit.py`, `parity.py`, `ask_verify.py`,
`jscheck.py`) and a pre-change backup of every file touched. The audit tools
are worth keeping; the rest can go once the owner has reviewed the German.
