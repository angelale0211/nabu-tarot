# Nabu Tarot: brief for the next session

Rewritten 2026-09-09, after **v190** went live.

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read NEXT-SESSION.md"**.

**The task is Google Play Billing**, end to end: the bundle, the backend, the
Play Console settings, and the change to how access works. Part 1 is the
project. Part 2 is that task. Part 3 is what the session before you changed.
Part 4 is the owner's standing rules and the layout facts. Read Part 2 before
touching anything.

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
- Suite: `PYTHONIOENCODING=utf-8 python test/run.py`. About 6 minutes, **604 checks, all passing at v190**. A second window uses `NABU_PORT=8766`.
- **A release is: bump `APP_VERSION` in `src/main.js` AND `CACHE` in `sw.js` to the same new number, `python build.py`, run the suite, one commit, push.** Both markers, every time. The session before you shipped four releases without bumping either and left the app reporting a stale version; do not repeat it.
- One Cloudflare Worker, `nabu-ai`, at `https://nabu-ai.0211nhatanh.workers.dev`, reached through `CONFIG.aiEndpoint`. Deployed by `.github/workflows/worker.yml` on every push touching `worker/`.
- The Android app is a **Trusted Web Activity** (`app.nabutarot.twa`): it opens the live site full screen. Content changes need no new bundle. Only the wrapper itself does.

---

## Part 2. Your task — Google Play Billing

### What this is

Inside the Android app, the digital things — the four courses and the four
unlocks, plus the wedding — are bought through Google Play, which takes 15%.
On the website nothing changes: the same things are bought by bank transfer
and unlocked by a code. **Readings with Nabu are never sold through Play**, on
any platform: an hour of a person's time is not a digital good and Google's
rule does not cover it.

The phone is never trusted about what it bought. It hands the worker the token
Play gave it; the worker asks Google whether that token is real, for that
product, for this app, and unused; then the worker writes the access onto the
account.

### Read these first, in this order

| File | What it is |
|---|---|
| `PLAN-PLAY-BILLING.md` | The risk analysis and the four phases. Still the best statement of *why* each piece exists |
| `PLAN-PLAY-BILLING-FINDINGS.md` | What was built and **proved**, and what is left. Every line was checked against a real artefact |
| `PLAN-PLAY-BILLING-UNBLOCK.md` | How the packaging blocker was diagnosed and cleared |
| `docs/superpowers/specs/2026-09-08-play-billing-subscriptions-design.md` | The newer design. **Supersedes the "eight consumable products" plan.** Subscriptions for the recurring things |
| `docs/superpowers/plans/2026-09-08-play-billing-subscriptions.md` | The plan that goes with it |
| `PLAN-ORDERS-AND-ACCESS.md` | How orders, codes and access fit together |

⚠ **The `docs/superpowers/` files are untracked.** They are not in git and a
careless `git clean` destroys them. Commit them early.

### What is already built and deployed

Do not rebuild any of this. Read it first.

- `src/billing.js` — the Digital Goods API client. Absent on the web by design; `BILL.can()` is false outside the app.
- `worker/src/play.ts` — signs a service-account JWT, checks the purchase with Google, refuses cancelled / pending / already-consumed tokens, writes access through the Firestore REST API, then acknowledges and consumes.
- `worker/src/index.ts` `/billing` — requires a Firebase sign-in, rate limited, maps `pro` and `pro6` to also open `plus`.
- `worker/src/refunds.ts` — a purchase is claimed in `purchases/{sha256(token)}` **before** any access is written, so the same token cannot be spent twice by two accounts. A daily cron sweeps Play's voided-purchases list and removes the access.
- `worker/src/codes.ts` `/redeem` — codes are claimed on the worker, bound to an account, single use.
- `firestore.rules` — `access` and `revoked` are admin-only; `purchases` takes no client writes.

### What is verified, and what is only believed

Verified on 2026-09-08 against real artefacts:

- A **billing-enabled AAB exists**: `C:\Users\angel\nabu-tarot-keys\pkg-billing-pkg-2026-09-08\Nabu Tarot.aab`, versionCode 2, upload key `B7:56`, `com.android.vending.BILLING` in the manifest, every URL inside pointing at `nabutarot.com`.
- **Asset links are correct**: Google's Digital Asset Links service returns four verified keys for `app.nabutarot.twa` (deployment, hybrid classical, and both upload keys). Billing does not appear at all if this is wrong.
- The **Play Developer API is enabled** on the Cloud project.
- Play Billing forces **minSdkVersion 23**. Android 5 can no longer install. Unavoidable.

Believed but **not proved**, and worth proving with the first real token:

- That Google refuses a token presented under a different product id.
- The replay test should be run as the same token from **two different accounts**; the second must be refused. The same account twice is expected to succeed and must not open anything twice.

### Blocked on the owner — nothing works until these are done

These are Play Console and Firebase jobs. You cannot do them.

1. **Invite the service account.** `nabu-worker@nabutarot.iam.gserviceaccount.com` under Play Console → Users and permissions, with *View app information*, *View financial data*, *Manage orders*. Until then every purchase check answers `The caller does not have permission` and every buyer gets `check failed` **after paying**. This is the single biggest blocker.
2. **Upload the AAB** above to the internal testing track. Version code 1 is taken; this is code 2.
3. **Payments profile**, or Google sells nothing.
4. **Create the products** — see the design decision below before creating any.
5. **Licence testers** (Play Console → Setup → Licence testing). The only way to test without real money.
6. **Republish `firestore.rules`.** Until this is done a signed-in person can still write their own access from a browser console. Nothing to do with Play, and the bigger hole of the two.

### The design decision waiting for you

The old plan said eight **consumable** one-time products. The newer design says
one-time products for the courses and **subscriptions** for the recurring ones,
and it found a hard constraint:

> The android-browser-helper bridge inside the TWA launches a subscription with
> `offerDetails.get(0)` — the *first* offer of the product. Nothing from the web
> can pick a base plan.

So **each offering must be its own Play product with a single base plan**. Pro
6 months and Pro 12 months are two separate products, not two plans of one.
Get this wrong in the Console and it cannot be fixed from the app.

Confirm with the owner which shape they want before any product is created,
because products are hard to change once they have buyers.

### A live bug to fix before `pro6` is ever sold

`worker/src/index.ts` grants `pro6` the access keys `['pro6', 'plus']`. But
every Pro gate reads `proOn()`, which is `ACCESS.has('pro')` — `src/looks.js:15`
— and `ACCESS.has()` (`src/core.js:165`) is a plain lookup with no aliasing.

**So somebody who buys "Nabu Pro · 6 tháng" gets Plus and none of the companion
features Pro is sold for.** This is true on the Play path and the `/redeem`
code path alike. Verified in the current source on 2026-09-09. Decide whether
`pro6` should grant `pro`, or `proOn()` should accept either, and fix it before
that product can be bought.

### Not fixed, on purpose

`ACCESS.has()` reads local storage, so somebody willing to edit their own
browser can switch a course on. Closing that means the lesson text not being in
the downloaded page at all, served from the worker only to accounts that hold
it. That is a different app. Leave it unless the owner asks.

### How to test — none of it on this PC

Nothing here can be tested locally or in the 604-check suite. Each step needs a
real phone and a licence-tester account.

1. Internal testing track (instant, no review).
2. Install; the app must open with no browser bar, or billing will not appear.
3. Open a course page; Play's own price and a Buy button must show.
4. Buy with the test card. The course opens, `users/{uid}.access` shows the date in the Firebase console, the worker log says `granted`.
5. Buy again: the date extends rather than resets.
6. Refund from the Console; the daily sweep must revoke it.
7. Sign in on a second phone; the course is open there too.

Budget about a week of elapsed time, most of it waiting for uploads.

### Rollback

Every piece degrades on its own: remove the worker secret and `/billing`
answers `not configured` and the app shows the code box; an old AAB or the web
leaves `BILL.can()` false; the rules can be republished from git. No step takes
more than an hour to walk back.

---

## Part 3. What the session before you changed (2026-09-08 → 09)

Five releases, ending at **v190**. Full detail in **`HANDOFF-GERMAN-PASS.md`**;
this is what you need to know so nothing surprises you.

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
