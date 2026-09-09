# Nabu Tarot: brief for the next session

Rewritten 2026-09-09, after **v198 shipped and is live**. Google Play Billing
is **merged into `main`, pushed, and live at nabutarot.com** as v198 (commit
`84ca0fe`, plus `7c11ae1` adding Firebase CLI config). Both `APP_VERSION` in
`src/main.js` and `CACHE` in `sw.js` say v198. If anything below still talks
about a `play-billing` branch waiting on a merge, that description is stale —
the merge already happened.

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read NEXT-SESSION.md"**.

**Google Play Billing is code-complete and live.** The client and worker
sides are built, tested, merged and deployed. What is left is entirely
Google Console configuration and testing only the owner can do — see Part 2.
Part 1 is the project. Part 2 is the billing state and what is left. Part 3
is what the session before you changed. Part 4 is the owner's standing rules
and the layout facts. Read Part 2 before touching anything.

---

## Merge history: `main` (v190 → v197) merged with the billing work → v198

**Done.** `main` moved from v190 to v197 in a second window while the Play
Billing work was going on in its own branch. The merge into `main` was done
in **two passes**: five source conflicts were resolved so both sides
survived, and `index.html` was **rebuilt from the merged sources** rather
than carried over from either side.

Verified live on nabutarot.com after the merge — present from the other
window's six releases: `turnsMerge`, `turnsLocal`, `termText`, `askedQ`,
`wedFeeText`. Present from the billing work: the in-app `store`,
`pro12_sub`, `PLAY_SUB_SKUS`, `manifest_sub`, `stuckKey`. Both sides survived
the rebuild.

**One deliberate copy replacement, not a lost merge.** The other window's
v196 added the German wedding-terms sentence "Die Gebühr wird nicht
erstattet." The owner then approved a whole new terms block, so that exact
sentence is now gone — replaced by the approved wording, "Die
Hochzeitsgebühr ist nicht erstattungsfähig." Same promise, newer wording. If
someone greps for the v196 sentence and doesn't find it, this is why.

**Any future merge must do the same: rebuild, don't carry over.** The whole
app is one committed `index.html` built by `build.py`. If you merge and
commit a bundle built from a tree that predates the other side's releases,
every one of those releases silently disappears from the live site, and
nothing in git will look wrong. This exact failure already happened once, on
2026-09-08.

After merging, in this order:

1. `python build.py` - rebuild from the merged sources, do not reuse a bundle.
2. `PYTHONIOENCODING=utf-8 python test/run.py` - confirm the combined check
   count. A lower number than expected means checks were lost in the merge,
   not that the suite got smaller.
3. Grep the built `index.html` for a string from **both** sides.
4. Bump `APP_VERSION` in `src/main.js` **and** `CACHE` in `sw.js` together.
5. After pushing, fetch the live page and check the same strings are really
   there. Pages can take several minutes to serve a new build, so "not there
   yet" is not "broken".

**Still open, and nobody is working on it — this is the other window's
item, left intact:** the free-turn limit is stored on the account but the
account's owner may still write that field, so it is not tamper-proof. The
fix is to forbid `turns` in `firestore.rules` the way `access` already is,
and to spend a turn through a worker endpoint using the `fsGet` / `fsPatch`
helpers that branch built.

---

## Part 1. The project in six lines

- Trilingual (vi / en / de) tarot PWA. Repo `C:\Users\angel\nabu-tarot`, branch `main`. Live at https://nabutarot.com, deployed from GitHub `main` in about a minute.
- Vanilla JS, no framework. `python build.py` joins `src/*.js` and `src/shell.html` into the committed `index.html`. UI strings live in `src/strings.js` under `T()`.
- Suite: `PYTHONIOENCODING=utf-8 python test/run.py`. **650 checks, all passing at v198.** Worker suite **60/60**, `npm run typecheck` clean. A second window uses `NABU_PORT=8766`.
- **A release is: bump `APP_VERSION` in `src/main.js` AND `CACHE` in `sw.js` to the same new number, `python build.py`, run the suite, one commit, push.** Both markers, every time. Never hand-edit `index.html` — it only ever comes from `build.py`, which pins the inline script by SHA-256 in the CSP; hand-editing blocks the script and gives a blank page.
- One Cloudflare Worker, `nabu-ai`, at `https://nabu-ai.0211nhatanh.workers.dev`, reached through `CONFIG.aiEndpoint`. Deployed by `.github/workflows/worker.yml` on every push touching `worker/`.
- The Android app is a **Trusted Web Activity** (`app.nabutarot.twa`): it opens the live site full screen. Content changes need no new bundle. Only the wrapper itself does.

---

## Part 2. Google Play Billing — live as v198, what's left is console work

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
  trusting the notification's own claim.
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

### `firestore.rules` has been published — verify one thing on the live site

The owner has **published `firestore.rules`**. This was the single biggest
open security item on this project and it is now closed. `firebase.json`
and `.firebaserc` now exist in the repo, so publishing a future change is
just `npx firebase-tools login` once, then
`npx firebase-tools deploy --only firestore:rules` — no more pasting 27kB
into a console editor.

**Nobody has yet confirmed that a wedding room can still be created since
publishing.** The rules forbid a client setting `paid` on document create,
and if that clause is written wrong, no couple could book a wedding. Worth
checking on the live site early in the next session.

### Google Play state — read from the API, do not re-derive it

- Four subscription products, each with exactly **one** active base plan:
  `manifest_sub` (manifest-12m, P1Y), `plus_sub` (plus-12m, P1Y), `pro_sub`
  (pro-6m, P6M — this is "Pro 6 months"), `pro12_sub` (pro-annual, P1Y — this
  is "Pro 12 months").
- Four one-time products exist and are active: `tarot`, `lenormand`,
  `playing`, `wedding`. The Play API will **not** list these (the old
  endpoint is retired, the new one 404s for this app), so their US/EUR
  prices must be read by hand from Play Console.
- Regional subscription prices already read: manifest ₫75,000 / $2.89 /
  €2.99 · plus ₫79,000 / $2.99 / €3.09 · pro 6m ₫149,000 / $5.49 / €5.99 ·
  pro 12m ₫249,000 / $9.49 / €9.99. Google has priced 11 regions.
- **versionCode 2 is already uploaded and released to the internal testing
  track** (status `completed`, name "2 (1.0.1)"). versionCode 1 is on
  alpha. There is nothing to upload — a session that tries this will hit
  "Version code 2 has already been used", which means it's already there,
  not that something failed.
- **Never add a second active base plan to any subscription product, and
  never attach a free trial or promotional offer.** The TWA bridge
  (`android-browser-helper`) always launches a subscription's **first**
  offer and cannot choose a base plan; the code that displays a price and
  the code that charges pick their offer independently. This was verified
  by disassembling the shipped bundle.

### What the owner still has to do, in this order

1. **Licence testing** — Play Console, **account level** (not inside the
   app): Settings → Licence testing → add each tester's Gmail →
   RESPOND_NORMALLY. There are 12 testers. Without this, a purchase charges
   real money. The owner could not find this screen on a phone; it's
   account-level, which is why.
2. **Internal testing → Testers** — add the same Gmail addresses, share the
   "Join on the web" link.
3. **Make a real test purchase.** Nothing in this system has ever touched
   real Google Play. All 650 checks are stubs. A licence-tester purchase is
   the first genuine proof this works.
4. **Real-time Developer Notifications** — Pub/Sub topic `play-rtdn` → push
   subscription → point Play at it. Not urgent: the 6-hourly reconcile
   covers the gap in the meantime.
5. **Payments profile verification** — only needed before real money moves.

**A blocker on testing:** the owner uses an iPhone. Play Billing exists only
inside the Android app, so none of the purchase flow can be tested from
their own device. They need an Android phone or an emulator with Google
Play services.

### Store listing

Three screenshots were converted from iOS to Play spec (1080×1920, iOS
status bar removed) and are at
`C:\Users\angel\OneDrive\Desktop\play-screenshots\`. They are all Vietnamese
and all show free features — the red thread, the companion, the message
tree. English and German versions, and at least one screenshot showing
something that is actually for sale, are still wanted.

### Developer account note

The Play listing shows the owner's full legal name because it's a personal
developer account, and Google displays the verified individual's name.
Changing it to a brand needs an organisation account (registered business +
D-U-N-S), which is a support request, not a setting. Worth settling before
there are paying customers.

### Known follow-ups, and why each was deferred

(a) **Provenance on non-Play grants — done for the website path, not the
dashboard.** `users/{uid}.granted` now holds what the website (bank
transfer, then a redemption code) gave for a Play-managed key, separately
from `users/{uid}.subs` (what Play's own rows say). `recompute` takes the
**later** of the two, so Play can still shorten its own contribution to
nothing (a refund) without ever eating a code grant, and a code grant can no
longer be silently shortened to whatever a Play row says. Two things remain
open:

- **An admin grant made from the dashboard**, for an access key that a live
  Play subscription row already names, is still lost at the next recompute
  — the dashboard path was never fixed to write `granted` the way the
  website redemption-code path was.
- **Customers already wiped by the old behaviour** have nothing left for
  any capture to recover, and need re-issuing by hand.

(b) **Optimistic concurrency** (`currentDocument.updateTime` compare-and-set)
on the Firestore writes the worker makes. This closes three concurrency
findings that are currently parked/accepted rather than fixed — two
concurrent writers (say, a `/billing` call and an `/rtdn` push landing at the
same moment) can each read-then-write without noticing the other's change.

(c) **`reconcileSubs` pages at `limit: 500` with no cursor** —
`worker/src/reconcile.ts`. Once there are meaningfully more than about 300
active subscription rows, some will silently stop being reconciled every 6
hours (RTDN still covers them individually). Revisit before the subscriber
count gets near there.

(d) **Website pricing.** The owner chose to show the local price only — USD
on the English interface, EUR on the German one. This is blocked on the
four one-time products' US/EUR prices, which must be read by hand from Play
Console (the subscription prices are already known — see above).

### Not fixed, on purpose

`ACCESS.has()` (`src/core.js`) reads local storage, so somebody willing to
edit their own browser can switch a course on. Closing that means the lesson
text not being in the downloaded page at all, served from the worker only to
accounts that hold it — a different app. Leave it unless the owner asks.

### What has NOT been tested

Be plain about this with the owner: **nothing in this feature has been
tested on a real phone, and no real purchase — test or otherwise — has ever
been made.** Everything above is verified by the 650-check browser suite and
the 60-check worker suite (both mocked/stubbed), plus a clean
`tsc --noEmit`. The first real signal will come from a licence tester on a
real Android device, once the owner's checklist above is done.

### Rollback

Every piece degrades on its own: remove the worker secret and `/billing`
answers `not configured`; the client's store hides itself when
`BILL.can()` is false (any device outside the installed, verified TWA);
`firestore.rules` is already published from git and any future change
redeploys with `npx firebase-tools deploy --only firestore:rules`. No step
takes more than an hour to walk back.

---

## Part 3. What the session before you changed

### v198 (2026-09-09) — Play Billing merged onto main, pushed, live

- **The merge.** `main` had moved from v190 to v197 (six-plus releases, a
  second window) while the Play Billing work was being built on its own
  branch. The merge into `main` happened in two passes; five source
  conflicts were resolved so both sides survived, and `index.html` was
  rebuilt from the merged sources rather than carried over from either
  side. Verified live afterward: strings/functions from both sides (see
  "Merge history" above for the specific names checked).
- **Version bump.** `APP_VERSION`/`CACHE` bumped to `v198` and rebuilt.
- Ran the full suite clean: **650 checks passing**. Worker suite **60/60**,
  typecheck clean.
- Committed to `main` as `84ca0fe`, then pushed. Confirmed live at
  nabutarot.com.
- **Firebase CLI config added** in a follow-up commit, `7c11ae1`:
  `firebase.json` and `.firebaserc`, so `firestore.rules` publishing no
  longer requires pasting into the console — `npx firebase-tools login`
  once, then `npx firebase-tools deploy --only firestore:rules`.
- **The owner published `firestore.rules`** — see Part 2's section on this;
  it's the biggest security item on the project and it's now done, but the
  wedding-room-creation path deserves a live check.

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
