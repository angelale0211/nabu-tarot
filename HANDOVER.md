# Nabu Tarot — handover notes

Written at the end of a long session that shipped **v155 → v162**. Give this to
a fresh session so it starts with what took hours to learn here.

---

## 1. The project in one paragraph

Nabu Tarot is a bilingual (Vietnamese / English) tarot PWA. It is a **static
app with no server**: `src/*.js` and `src/shell.html` are concatenated by
`build.py` into a single `index.html`, which is committed to the repo and served
by GitHub Pages at **https://nabutarot.com**. Accounts, messages, bookings, the
love system and weddings all run on **Firebase (Auth + Firestore)** directly
from the browser. There is one Cloudflare Worker (`worker/`) that answers AI
questions so the API key never reaches the browser.

- **Repo**: `C:\Users\angel\nabu-tarot` — GitHub `angelale0211/nabu-tarot`
- **Live**: https://nabutarot.com (the `CNAME` file claims the domain)
- **Owner**: works in Vietnamese; writes plainly; wants short sentences and
  bullet points, not paragraphs of explanation.

## 2. Commands

```bash
python build.py                              # src/ -> index.html + privacy.html
PYTHONIOENCODING=utf-8 python test/run.py    # ~550 headless checks in Edge
```

Bumping a version means **two** edits, then a rebuild:

- `src/main.js` — `window.APP_VERSION = 'v162'`
- `sw.js` — `const CACHE = 'nabu-tarot-v162'`

Without the `sw.js` bump, nobody's phone sees the new version.

## 3. The test suite — fixed, with one known stall

It used to stall before its first check and report nothing at all. Three things
were wrong; two are fixed.

- **Fixed: the runner guessed how long the suite would take.** It gave the
  browser a budget of pretend time (`--virtual-time-budget`) and read the page
  once that ran out. Pretend time stands still while the browser is waiting on
  the real network, so one slow request held the whole run open until it was
  killed — reporting nothing, after several minutes.
  **The page now posts its results back** to the runner as it goes, and the run
  ends when the suite says it has ended. A run that dies half way prints the
  checks it managed and names the one it stopped after. The pretend clock is
  still used (the checks wait 30ms for a redraw and mean it), it is simply no
  longer what ends the run.
- **Fixed: a stale check.** The wedding test still expected the old one-press
  start, from before v162 made it two keys. It threw on a null, and because the
  whole suite is one `try`/`catch`, that one line killed the remaining 40% of
  the run. It now walks the two-key flow.
- **Fixed earlier:** 629 leftover browser profiles in `%TEMP%`; the mock db
  reading every `where()` as `array-contains`.

**Still open — one stall, precisely located.** The suite reaches **431 of ~440**
checks and stops inside `answerAs()` in `test/test.html`, on the first
`#wedyes` click of the four-vow walk-through. Ruled out already: `WEDMUSIC`
(the same call fires on an earlier check that passes) and the 20-second
heartbeat (guarded by `!beat`, cleared in two places). The next thing to try is
whether mock-db listeners accumulate across repeated room entries — `answerAs`
enters the room four times — which would grind the page to a halt in real time
while the pretend clock is paused. Everything else passes.

```bash
python build.py
PYTHONIOENCODING=utf-8 python test/run.py     # 432 checks, ~7 min
```

The run takes about seven minutes because it waits out that stall (90 seconds
of silence) before reporting. Fix the stall and it will be quick again.

## 4. Traps that cost hours this session — do not repeat them

**Never write patch scripts through a bash heredoc.** The Bash tool eats
backslashes: `\\uD83D` becomes a literal lone surrogate, `\\n` becomes a real
newline. This corrupted patches repeatedly. **Write the patch script to a file
with the Write tool, then run it.**

**Encode before you open.** This truncated `src/strings.js` and `src/wedding.js`
to zero bytes twice:

```python
open(p, 'wb').write(s.encode('utf-8'))     # WRONG: open() truncates, then encode throws
data = s.encode('utf-8'); open(p, 'wb').write(data)   # RIGHT
```

Both files were recovered with `git checkout --`, but everything uncommitted was
lost. **Commit before large patch runs.**

**A patch script that fails half way has still applied its earlier edits.** If
you re-run it, those edits apply twice. This session put duplicate keys into
`strings.js` that way (harmless in JS — last wins — but confusing). Make patch
scripts assert `s.count(anchor) == 1`.

**Duplicate string keys silently override.** A new `adminAccess:` key quietly
replaced the existing admin banner on the course page. Before adding a key,
`grep -c "yourKey:" src/strings.js` — it should be 0.

**`strings.js` has two large objects, Vietnamese first, then English.** The
patch anchor used all session was `meInboxHint:`, which exists once in each.
Emoji in Vietnamese strings can be written literally; in English strings the
file convention is `\uD83D\uDC8D`-style escapes.

**CSS specificity**: `#main p { text-align: justify }` is an ID selector and
beats any class rule. Centring inside a card needs the shared
`#main .lovecard p, #main .wedcard p, … { text-align: center }` rule.

**`confirm()` is skipped outright by some phone webviews.** Anything
irreversible must ask on the page itself (see `#lvsure`, `#acsure`, `#alsure`).

## 5. What shipped this session (v155 → v162)

| Version | What |
|---|---|
| v156 | Revoke a user's access; unlocking says what and until when |
| v157 | Wedding payment confirmable; moving the hour became a request Nabu approves; comment feed keeps the reader's place |
| v158 | Every wedding Nabu holds on one card; invitation links survive a stranger's sign-up; LICENSE, copyright notice, `_headers`, `.well-known/assetlinks.json` |
| v159 | A refused write says the rules are unpublished rather than showing raw Firebase English |
| v160 | The room says who is standing in it; arrival notices |
| v161 | The room closes itself, announces it, counts down, sends everyone home |
| v162 | Payments tab; storage-full fix; two-key ceremony start; private couple chat; married-once; wedding off the price list |

### Things worth knowing about those

- **Access revocation beats the merge.** `pullProfile()` merges cloud access
  into local keeping the *later* date, so clearing access in the console does
  nothing. A revocation is a stamped instruction (`revoked: {at, why}`) applied
  once per device, recorded in `nabu-revoked-at`. The rules stop the person
  themselves from deleting that field.
- **A wedding almost never has an order row.** The room is created by the
  *request* (that is what holds the hour), so the paying screen takes the
  "message Nabu" branch and writes no order. That is why "confirm payment" could
  not be found. Nabu now marks the **room** paid, order or no order.
- **`paid` lives on the wedding room, not on a phone**, because one payment
  covers both partners.
- **localStorage silently failing** was the cause of the notification bug: a
  full phone made every write throw, the error was swallowed, and the screen
  redrew from an older stored list. `store.set` now returns a boolean, frees its
  own caches (`STORE_SPARE`), retries once, and toasts `T().storeFull`.
- **Live streams are now subscribed through `sub()`** in `renderWedding`. They
  used to be a single unbroken run of `stop.push(...)`, so one throwing callback
  skipped every subscription after it — including the thread — and the room
  rendered "you need a thread first" for a couple who had one.

## 6. What the owner still has to do (nothing here is code)

1. **Republish `firestore.rules` whenever it changes.** It has `flags/` and
   `errors/` blocks now that older published copies lack. A "Missing or
   insufficient permissions" toast almost always means this, not a bug.
2. **Google Play.** The app exists in the Console as `app.nabutarot.twa` and a
   closed-testing release has been submitted once (rejected for the Financial
   features declaration - untick "Rewards, points..."; the coin system is a
   shop discount, not a financial product). Still needed: 12 opted-in testers
   for 14 days; the content rating updated to say block and report exist
   (they do since v166); and after the first successful upload, the SHA-256
   from Setup > App integrity pasted into `.well-known/assetlinks.json`.
3. **Play Billing, if it is ever wanted.** Built and dormant - see
   `PLAN-PLAY-BILLING.md`, Phase 0. Needs eight in-app products, a service
   account as a Worker secret, and a billing-enabled AAB. The owner has since
   decided the website comes first and Play can wait; nothing switches on
   until Phase 0 exists.
4. **Cloudflare Worker secrets.** `CLOUDFLARE_API_TOKEN` is a repo secret and
   `worker.yml` deploys on push. `FIREBASE_PROJECT_ID` in `wrangler.toml` is
   still empty, so the AI endpoint still answers without a sign-in; set it to
   `nabutarot` to require one.

## 7. Outstanding work

- **Close the money leaks** - `PLAN-PLAY-BILLING.md` Phase 2. Rules let a
  signed-in person write their own `access`; codes are not bound to an
  account. Fix: `access`/`revoked` admin-only, code redemption through a
  Worker `/redeem` endpoint that records `by: uid` and refuses reuse. This is
  the highest-value remaining change and does not depend on Play.
- **Orders**: `PLAN-ORDERS-AND-ACCESS.md` items 4-8 (codes show who redeemed
  them, money summary on the Pay tab). Items 1-3 are done.
- **Love system: refuse a thread with someone already tied** (`loveTakenLead`
  / `loveTakenHint` exist in `strings.js`; the check is not built).
- **Both partners requesting different wedding times**; `WED.create` should
  refuse to overwrite an existing room.
- CSP header in `_headers`; Firestore rules tests in CI; feed pagination.

## 7a. What shipped after v162 (this session, v163 -> v171)

| Version | What |
|---|---|
| v163 | Pay-tab fixes (button slid under the finger; confirmed orders vanished); "Nhắn cho họ" on every order; errors -> Firestore + admin tab; Worker verifies Firebase tokens, rate-limits, caches; `worker.yml`, `health.yml`; hosting moved to Cloudflare Pages |
| v164 | Signing out clears profile/access; sign-in section forced open when signed out |
| v165 | Installed app hides the courses list (Play reviewers) |
| v166-167 | Report and block on wedding-room messages -> `flags/`; unblock list on Me; Reports tab |
| v168 | Play Billing built, dormant (`billing.js`, `worker/src/play.ts`) |
| v169-171 | Desktop layout: left rail, 1040px column, two-column home, wider grids, readable prose |

Also: the test suite reports as it goes (see section 3) and is green at 562;
scheduled Actions slowed to stay under the private-repo minute cap.

## 8. Architecture notes a new session will want

- **Build order matters** — see the `SCRIPTS` list at the top of `build.py`.
  Data files before `core.js`; screens before `main.js`.
- **Globals**: `store` (localStorage), `ACCESS` (what is unlocked), `ALERTS`
  (the notification bell), `BE` (Firebase), `LOVE` / `LOVEDB` (the red thread),
  `WED` (weddings), `PROFILE`, `CONFIG`, `COURSES`, `T()` (strings for the
  current language), `L(obj)` (picks `.vi` / `.en`), `lang`.
- **`ACCESS` is client-trusted.** `ACCESS.has()` reads localStorage. Binding an
  unlock to an account (as the payments tab now does) stops *sharing*; it does
  not stop *tampering*. Say so honestly if the owner asks.
- **Admin dashboard tabs** (`src/admin.js`): posts, acts, schedule, bookings,
  **pay**, inbox, codes, sale. Bookings is the calendar; **pay** is money.
- **The bell** (`src/alerts.js`) is per-device and computed from streams the app
  already watches — no new collection, no push. It cannot wake a closed app.
- **Firestore collections**: `users`, `threads/{uid}/messages`, `bookings`,
  `people`, `handles`, `bonds/{a__b}` (+ `gifts`, `diary`), `requests`,
  `weddings/{wid}` (+ `guests`, `gifts`, `says`, `talk`), `wedasks`, `taken`,
  `content`, `codes`.

## 9. How the owner likes to work

- Wants speed and visible progress. Do not disappear into a long silent
  investigation — say what is happening.
- Dislikes long explanatory paragraphs. Bullet points, one fact each.
- Has said explicitly: **never shut down, restart or sleep the PC.**
- Will not use Google Pay or Apple Pay — "I do not want to pay them the
  commission". Payment is bank transfer, arranged in the in-app chat.
- Tests on a real phone and reports what he sees; take those reports literally,
  they have been accurate every time this session.
