# Nabu Tarot: brief for the next session

Written 2026-09-08, late evening, after v189 went live.

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read NEXT-SESSION.md"**.

This file has two halves. The first is what today's session did and where it
left things. The second is the text and layout alignment work: the rules the
owner cares about, what was measured, and what is still open.

---

## Part 1. This session

### The project in five lines
- Trilingual (vi / en / de) tarot PWA. Repo `C:\Users\angel\nabu-tarot`, branch `main`. Live at https://nabutarot.com, deployed from GitHub `main` in about a minute.
- Vanilla JS. `python build.py` joins `src/*.js` and `src/shell.html` into the committed `index.html`. Strings live in `src/strings.js` under `T()`.
- Suite: `PYTHONIOENCODING=utf-8 python test/run.py`. About 6 minutes. 604 checks at v189. A second window uses `NABU_PORT=8766`.
- Release = set `APP_VERSION` in `src/main.js` and `CACHE` in `sw.js` to the same number, build, run the suite, one commit, push. Then check the live page for a string only the new release has.
- One Cloudflare Worker, `nabu-ai`, at `https://nabu-ai.0211nhatanh.workers.dev`. Deployed by `.github/workflows/worker.yml` on every push that touches `worker/`.

### What is live now (v189)

**Money protection (worker + Firestore rules).**
- A person can no longer grant themselves `access` by writing their own user document. Rules: `touchesPaid()` and `emptyAccess()` inside `match /users/{uid}` in `firestore.rules`. The published rules are the ones in the repo.
- Codes are claimed on the worker (`/redeem`), bound to the account (`by`, `usedAt`), and the code book is private. Hashing is plain SHA-256 of salt + newline + tidied code, because Cloudflare refuses PBKDF2 above 100,000 iterations.
- Google Play purchases are verified on the worker (`/billing`) and recorded in `purchases/{sha256(token)}`. A daily cron (`10 20 * * *` UTC) sweeps Play's voided-purchases list and removes the access. Code: `worker/src/refunds.ts`.
- Worker secrets and vars: `PLAY_SERVICE_ACCOUNT` (Cloudflare dashboard secret), `FIREBASE_PROJECT_ID = nabutarot`, `ANDROID_PACKAGE = app.nabutarot.twa`. Service account `nabu-worker@nabutarot.iam.gserviceaccount.com`, key file at `C:\Users\angel\nabu-tarot-keys\` (outside the repo, never print its contents).
- The app calls the worker through `CONFIG.aiEndpoint` in `src/config.js`.

**Registration in one go (v186).**
- After creating an account the person lands on `#/welcome`: language, display name, username (`@handle`, the same one the Red Thread uses), birthday, interests. One screen, asked once.
- Then the eight-step tour, then home. The Me tab shows a summary with a "Sửa hồ sơ" link back to `#/welcome` instead of asking again.
- Language is stored on the account and follows the person to any device.
- Files: `src/welcome.js` (new), `src/backend.js` (`pullProfile`, `pushProfile`, `signOut`, `deleteAccount`), `src/core.js` (route gate, `applyAccountLang`), `src/me.js`, `src/signin.js`, `src/home.js` (`bindTour`), `src/strings.js` (`wel*` keys).
- Spec and plan: `docs/superpowers/specs/2026-09-08-registration-onboarding-design.md`, `docs/superpowers/plans/2026-09-08-registration-onboarding.md`.

**Owner's wording (v187, v188, v189).** All Vietnamese below is the owner's, verbatim. Never retranslate it.
- Guest card on the Me tab, `S.meIntro`: "Tên và ngày sinh giúp Nabu mang đến những nội dung phù hợp và gần gũi hơn với bạn."
- Tour step 8, `TOUR[7]` in `src/home.js`: "Nhập tên và ngày sinh để Nabu cá nhân hóa trải nghiệm dành riêng cho bạn. Đăng nhập để lưu lại hồ sơ nhé! ✨"
- Title above the tour in the sign-up flow, `S.welTourTitle`: "Bạn làm được những gì với Nabu?" (en "What you can do with Nabu", de "Was du mit Nabu machen kannst"). Only on `#/welcome`, not on the home page tour.
- Booking: "hẹn giờ với Nabu" (en "book a time with Nabu").
- Homepage introduction post replaced in three languages (Firestore `content/posts` and `posts.json`).

**Small fixes (v189).**
- Booking: choosing a preset-topic package no longer scrolls the page down to the topic picker. The basket still flags a missing topic and Send still points to it. `src/book.js`, the `syncCart(false)` call after `book.items.push`.
- The Nabu AI box was removed from the Me tab only. It stays under a drawn card, in lessons, on sign pages and in the numbers tool.

### Stage 2, owed but not requested yet
In priority order. Also in memory as `nabu-onboarding-stage2`.
1. Direct checks for three late fixes: a second account on one phone starts with no username; deleting an account removes `handles/` and `people/`; a Google or Facebook sign-up lands on `#/welcome`.
2. Delete the love system's own username step (`drawHandle` in `src/love.js`, strings `loveStepOne`, `loveClaim`, `loveNameLabel`) and rewrite the checks that drive `#lvname` and `#lvsave`. Unreachable for anyone registered after v186.
3. A guest branch on `#/welcome`. A typed URL while signed out shows a raw permission error on Continue. The responsive loop in the suite measures that form signed out, so the checks change with it.
4. `claimHandle` in `src/love.js` releases the old handle from device-local storage; a rename from a second phone strands the old reservation.
5. `claimFrom` in `src/love.js` still has the suffix-collapse defect the welcome screen fixed for itself.

### Other windows and their files
Today several windows worked on this repo at once. Files they own: `src/signin.js`, `src/pet.js`, `worker/src/refunds.ts` (edited after I wrote it), Play Billing docs (`PLAN-PLAY-BILLING-UNBLOCK.md`, `PLAN-PLAY-BILLING-FINDINGS.md`). Read `HANDOFF-2026-09-08.md` and `SESSION-SIGNIN-HANDOFF.md` for their side.

---

## Part 2. Text and layout alignment

### The owner's rules
- Layout matters on **Android and iPhone equally, and on the PC**, on every page. Never call a layout concern "iPhone only" or "phones". Say "Android and iPhone".
- Vietnamese copy is the owner's and is used verbatim. When a Vietnamese line is needed, ask the owner for it rather than translating. English and German are written to match.
- Plain short sentences. One idea per sentence. Everyday tarot words.
- The owner reads screenshots of the live page, not the source. When they say "still not fixed", check nabutarot.com, not `src/`.

### What holds the layout in place today
- **Phone:** the suite's responsive loop renders eight busy screens at 320, 360 and 390px in headless Chromium and fails on anything that leaves the screen, any tap target under 40px, and any running text over 85 characters a line. `#/welcome` is one of the eight. This is an Android-engine check. **Safari (iPhone) is not measured by any test.** Date inputs are the control Safari sizes differently; the welcome screen's date box uses `width:100%; box-sizing:border-box` and no `min-height` for that reason. After a layout change ships, ask the owner for a one-minute look on each phone.
- **Desk:** `ONE_COL` in `src/core.js` lists the routes that take the single-column shape on a wide window (`me`, `book`, `love`, `welcome` and others). A new one-thing screen must be added there or it spreads across 1040px. The lesson page has its own desk rules in the `/* ---- a lesson on a desk ---- */` block near the end of `src/shell.html`. Card, sign and guide pages get a rail (`railify()` in `src/core.js`) that holds the picture, the arrows and the AI box beside the reading.
- **The probe:** `python test/layout_probe.py --all --engine both` renders sixty routes at seven widths in Chromium and WebKit and flags geometry (overflow, tap size, line length, tiny text). It reports, it does not judge. Method in `PLAN-LAYOUT-AUDIT.md`, results and the list of things deliberately left alone in `PLAN-LAYOUT-FINDINGS.md`.
- **Welcome screen shape:** `.welcard` in `src/shell.html`, `max-width:520px; margin:0 auto`, chips wrap, every control at least 50px tall on a phone. The tour title `.tourtitle` matches that 520px width.

### What is still open on alignment
- **Prose pushed left on a desk.** Most pages cap paragraphs at `max-width:62ch` or `75ch` inside a 1040px column with no `margin:auto`, so the words sit left and the right third of the card is empty. That is what the owner photographed on the Fool page and later on `#/learn/tarot`. The lesson page was fixed by hand (§12 of `SESSION-SIGNIN-HANDOFF.md`). The rest were not. One rule could centre or widen them, but it touches every page, so the owner should say yes first and then look at three or four pages on a PC.
- **Learn tiles.** Every tile now has the pink edge. If the edge should again mean "matches your interests", revert the last rule in the lesson-desk CSS block.
- **Signed-out `#/welcome`.** See Stage 2 item 3 above. The form is measured signed out today, so the layout is fine; the behaviour is not.

### Traps that cost time today
- Bash heredocs turn `\n` into a real newline and mangle Vietnamese. Write scripts to a file and run them, or use the Edit tool. In Python, `assert s.count(anchor) == 1` before every replace.
- The Windows console is cp1252. Set `PYTHONIOENCODING=utf-8` before printing Vietnamese.
- Adding a CSS property to the front of a long rule proves nothing until the built page is read back. Two fixes today were silently overridden by a later property in the same rule.
- The plan's `min-height:44px` on the welcome date box overrode the app's 50px control height. The global rule wins by being absent, not by being repeated.
- A commit's `index.html` can predate its own source. Grep the committed file or the live page for a string only the new feature has before calling a release done.

### Standing instructions
- Do not build, commit `index.html`, or release while another window is editing or running the suite. Hold releases until every window says it is finished.
- Design and planning on Fable, implementation subagents on Opus.
- Never print the contents of the service-account key.
- Never shut down, restart or sleep this PC.

### Where to read more
`HANDOVER.md`, `HANDOFF-2026-09-08.md`, `SESSION-SIGNIN-HANDOFF.md`, `PLAN-LAYOUT-AUDIT.md`, `PLAN-LAYOUT-FINDINGS.md`, `PLAN-PLAY-BILLING.md`, `docs/ARCHITECTURE.md`, `GERMAN-GLOSSARY.md`.
