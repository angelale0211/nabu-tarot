# Nabu Tarot: brief for the next session

Rewritten 2026-09-09, after **v197** on the `play-billing` branch (commit
`95720ca`). **Nothing has been pushed and nothing merged to `main`** — that
merge is the owner's call, not a session's.

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read NEXT-SESSION.md"**.

**Google Play Billing is code-complete.** The client and worker sides are
built, tested and committed. What is left is Google-Console configuration
only the owner can do, plus four known follow-ups. Part 1 is the project.
Part 2 is the billing state and what is left. Part 3 is what the session
before you changed. Part 4 is the owner's standing rules and the layout
facts. Read Part 2 before touching anything.

---

## Merge history: `main` (v190 → v196) into `play-billing`

**Done.** `main` moved six releases on 2026-09-09, from a second window, while
the Play Billing work was going on in the `play-billing` branch:

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
`play-billing` branch was cut before all of them and carried none of them on
its own.

**The merge was done in commit `95720ca`** (a real merge, not a fast-forward).
Five source conflicts were resolved so both sides survive: `sw.js`/`src/main.js`
(version marker plus both sides' `NABU` exports), `src/strings.js` ×3 (the
owner's newly approved wedding-terms wording replaces both branches' older
text, VI/EN/DE), `src/services.js` (main's `{save}` currency placeholder kept,
this branch's retired Pro-voucher lines dropped), and `src/learn.js` (both
sides had added a price block; kept this branch's store-bound button, adopted
main's `termText()` inside it). `index.html` was **rebuilt from the merged
sources**, not carried over from either side.

**Any future merge must do the same.** The whole app is one committed
`index.html` built by `build.py`. If you merge and commit a bundle built from a
tree that predates the other side's releases, every one of those releases
silently disappears from the live site, and nothing in git will look wrong.
This exact failure already happened once, on 2026-09-08.

After merging, in this order:

1. `python build.py` - rebuild from the merged sources, do not reuse a bundle.
2. `PYTHONIOENCODING=utf-8 python test/run.py` - confirm the combined check
   count. A lower number than expected means checks were lost in the merge,
   not that the suite got smaller.
3. Grep the built `index.html` for a string from **both** sides.
4. Bump `APP_VERSION` in `src/main.js` **and** `CACHE` in `sw.js` together.
5. After pushing, fetch the live page and check the same strings are really
   there. Pages can take several minutes to serve a new build, so "not there
   yet" is not "broken" — v196 outlasted a twenty-attempt poll before it
   appeared.

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
- Suite: `PYTHONIOENCODING=utf-8 python test/run.py`. About 6 minutes, **648 checks, all passing at v197** (main's 630 plus this branch's 18). A second window uses `NABU_PORT=8766`.
- **A release is: bump `APP_VERSION` in `src/main.js` AND `CACHE` in `sw.js` to the same new number, `python build.py`, run the suite, one commit, push.** Both markers, every time. A past session shipped four releases without bumping either and left the app reporting a stale version; do not repeat it.
- One Cloudflare Worker, `nabu-ai`, at `https://nabu-ai.0211nhatanh.workers.dev`, reached through `CONFIG.aiEndpoint`. Deployed by `.github/workflows/worker.yml` on every push touching `worker/`.
- The Android app is a **Trusted Web Activity** (`app.nabutarot.twa`): it opens the live site full screen. Content changes need no new bundle. Only the wrapper itself does.

---

## Part 2. Google Play Billing — where it stands after v197

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

(a) **Provenance on non-Play grants — done for the code path.** `users/{uid}.granted`
now holds what the website (bank transfer, then a redemption code) and the
dashboard gave for a Play-managed key, separately from `users/{uid}.subs`
(what Play's own rows say). `recompute` takes the **later** of the two, so
Play can still shorten its own contribution to nothing (a refund) without
ever eating a code grant, and a code grant can no longer be silently
shortened to whatever a Play row says. Before this fix, a customer who paid
by bank transfer and then held any Play subscription lost the bank-transfer
grant at the next subscription event — and the 6-hourly reconcile repeated
the wipe. `/redeem` now writes `granted` alongside `access` whenever a code
opens a Play-managed key; existing customers were caught without a migration
by capturing, at write time, any key a new Play row names that no existing
row already named. Two things remain open from this:

- **An admin grant made from the dashboard** for a key a live Play
  subscription row already names is still lost at the next recompute — the
  capture only fires for a key no *existing* row already names. Closing this
  needs the dashboard to write `granted` too, the same way `/redeem` does.
- **Any customer already wiped by the old behaviour** has nothing left for
  the capture to recover — `access` records no provenance, so there is no way
  to tell after the fact that a shortened date used to be a code grant. These
  need re-issuing by hand.

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
been made.** Everything above is verified by the 648-check browser suite and
the 60-check worker suite (both mocked), plus a clean `tsc --noEmit`. The
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

### v197 (2026-09-09) — merge onto main's six releases, plus a provenance fix, on `play-billing`

Three things happened after the v191 release stamp that this section used to
describe:

- **The `granted` field fix.** `users/{uid}.granted` now records what the
  website (bank transfer, then a redemption code) and the dashboard gave for
  a Play-managed key, kept separate from what Play's own subscription rows
  say. `recompute` in `worker/src/entitle.ts` takes the **later** of the two.
  Before this, a customer who bought Pro by bank transfer lost it silently
  the moment any Play subscription event touched their account, and the
  6-hourly reconcile repeated the loss. `firestore.rules` now guards
  `granted` the same way it guards `access`/`subs`. Ten new worker tests
  (50 → 60).
- **The merge.** `main` had moved from v190 to v196 (six releases, a second
  window) while this branch was being built. That merge is commit `95720ca`
  — a real merge, not a fast-forward, with five source conflicts resolved so
  both sides survive (see "Merge history" above for the detail). `index.html`
  was rebuilt from the merged sources, not carried over from either side.
- **Version bump.** `APP_VERSION`/`CACHE` bumped to `v197` and rebuilt.
- Ran the full suite clean: **648 checks, 648 passed, 0 failed** (main's 630
  plus this branch's 18). Worker suite **60/60**, `npm run typecheck` clean.
- Committed on `play-billing` as `95720ca`. **Not pushed, not merged to
  `main`.** The merge of `play-billing` *into* `main` — which is what
  actually deploys the live site — is still the owner's decision, not a
  release step this session took.
- v190 (German localisation pass) and v191–v196 (the second window's six
  releases) had already shipped and merged into `main` before this; do not
  confuse those numbers with this branch's own release.

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
