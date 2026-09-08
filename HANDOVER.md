# Nabu Tarot — handover notes

Give this to a fresh session so it starts with what took hours to learn.
Written after the session that shipped **v163 → v176**.

---

## 1. The project in one paragraph

Nabu Tarot is a trilingual (Vietnamese / English / German) tarot PWA. It is a
**static app with no server**: `src/*.js` and `src/shell.html` are concatenated
by `build.py` into a single `index.html`, committed to the repo and served by
**Cloudflare Pages** at **https://nabutarot.com**. Accounts, messages, bookings,
the love system and weddings run on **Firebase (Auth + Firestore)** straight from
the browser. One **Cloudflare Worker** (`worker/`) answers AI questions, checks
Play purchases and sends mail, so no key ever reaches a browser.

- **Repo**: `C:\Users\angel\nabu-tarot` — GitHub `angelale0211/nabu-tarot` (private)
- **Live**: https://nabutarot.com
- **Owner**: works in Vietnamese; wants short sentences and bullet points, speed,
  and visible progress. Take bug reports literally - they have been accurate
  every time.

## 2. Commands

```bash
python build.py                              # src/ -> index.html + privacy.html
PYTHONIOENCODING=utf-8 python test/run.py    # 567 checks in headless Edge, ~6 min
```

A release is **two edits plus a rebuild**:

- `src/main.js` — `window.APP_VERSION = 'v176'`
- `sw.js` — `const CACHE = 'nabu-tarot-v176'`

Without the `sw.js` bump nobody's phone sees the new version. `health.yml`
checks the two agree.

**There is no Node on this machine.** The worker cannot be typechecked or
deployed locally; `worker.yml` does both in CI. `npm`, `npx` and any React /
Tailwind / shadcn instruction are impossible here - the app is vanilla JS with
no build step beyond concatenation. Say so plainly when asked; the effect can
almost always be rebuilt in the app's own CSS.

## 3. Traps that have each cost real time

**Encode before you open.** `io.open(p,'wb').write(s.encode())` opens the file -
emptying it - and only then encodes. A bad character truncates the file to zero.
It happened to `src/admin.js` in this session.

```python
data = s.encode('utf-8')                 # encode first
with io.open(p, 'wb') as fh: fh.write(data)
```

**Bash heredocs eat backslashes.** `\\uD83D` arrives as a lone surrogate and
`\n` becomes a real newline, so anchors silently fail to match. For anything
with escapes, emoji or Vietnamese, use the Write tool or the Edit tool.

**Assert your anchors.** `assert s.count(old) == 1` before every replace. Half
of the failed patches in this session were an anchor that matched twice or zero
times.

**Setting the hash to where it already is fires nothing.** `go('#/x')` when the
route is already `#/x` does not re-render. Navigate away and back.

**`#main p { text-align: justify }` is an ID selector** and beats any class rule.
To centre text inside a block, add it to the `#main .thing p` list near the top
of `shell.html`.

**`confirm()` is skipped outright by some phone webviews.** Anything
irreversible asks on the page itself (`#lvsure`, `#acsure`, `#alsure`,
`data-sure` on the money button).

**`LANGS` drives data, not just wording.** Adding `'de'` made thirteen
language-keyed tables answer `undefined` and the whole app rendered blank.
`src/main.js` now points each one at its English half for German; translating a
table means filling it in and deleting its line there. The language pill also
**cycles** rather than toggles - anything that pressed it twice to get back has
to loop until the pill reads `EN`.

**A JavaScript error anywhere gives a blank app, not a broken screen.** The
suite catches it immediately (`#main` empty). To see the actual error:

```bash
msedge --headless=new --enable-logging=stderr --v=0 --dump-dom "http://127.0.0.1:PORT/index.html#/home" 2>&1 >/dev/null | grep -i uncaught
```

**Kill only your own test browsers.** Matching `msedge.exe` kills the owner's
browser too. Filter on the profile path (`nabu-edge-*`).

**Stale servers squat on port 8765.** A killed `run.py` leaves its server
listening; on Windows the next run binds anyway and the browser talks to the old
one, which reports nothing. Kill leftover python servers before a run.

## 4. The test suite

567 checks, all passing. `test/run.py` serves the repo and opens
`test/test.html`, which drives the built `index.html` in an iframe with a
stand-in for Firestore. **The page posts results back as it goes**, so a run
that dies half way prints what it managed and names the check it stopped after.
The pretend clock (`--virtual-time-budget`) is still used - the checks wait 30ms
for a redraw and mean it - but it is no longer what ends the run.

Checks are written signed-out by default. Anything that keeps something (coin,
message tree, diary, a companion) now needs an account, so those blocks sign in
and **must sign out again afterwards** or later guest checks quietly change
meaning.

## 5. What shipped in this session (v163 → v176)

| Version | What |
|---|---|
| v163 | Pay-tab fixes; **Nhắn cho họ** on orders; errors -> Firestore + tab; worker verifies Firebase tokens, rate-limits, caches; `worker.yml`, `health.yml`; hosting moved to Cloudflare |
| v164 | Signing out clears the account off the device; sign-in section forced open |
| v165 | The installed app hides the course list (Play reviewers) |
| v166-167 | Report and block in wedding rooms -> `flags/`; unblock list; Reports tab |
| v168 | Play Billing built and dormant (`billing.js`, `worker/src/play.ts`) |
| v169-171 | Desktop: left rail, 1040px column, two-column home, readable prose |
| v172 | Back from an order returns to the orders; forecast in the right column |
| v173 | One card a day free; coin and tree every three days |
| v174 | Pro's automatic 15% off readings removed; a row that stopped short |
| v175 | Landing page for strangers; sparkles on the wordmark; tour as steps |
| v176 | Sign-in gates; prices in $/€; landing wording; sliding button; **German stage 1** |

## 6. German (stage 1 of 5)

`STR.de` in `strings.js` began as a copy of `STR.en` and is being translated in
place, so German **works at every point** and improves batch by batch. About 36
of ~1,290 strings are German so far; everything else falls back to English.

Terminology agreed with the owner: **Große Arkana**, **Kelche · Stäbe ·
Schwerter · Münzen**, **Bube · Ritter · Königin · König**, **Der Gehängte**,
**Mäßigkeit**, **Das Gericht**, **Karte ziehen**, **Legung**. Lenormand keeps its
German originals (*Der Reiter, Der Klee, Das Schiff*).

Remaining stages: card names and keywords (~8k words), the insight texts (~25k),
guides and lessons (~40k), `kb-questions.js` (~64k). **A German speaker should
read stage 1 before it is advertised** - the terminology is right, the everyday
phrasing needs a native ear.

## 7. Prices

`MONEY` in `src/services.js` holds one rate per language. Vietnamese is dong;
English and German convert and add a flat amount - **+1 under 30.000đ, +2 above**
- then round **up** to the next half. The small tiers get less because two euros
on a ten-thousand-dong question flattens the bottom of the ladder.

Known and accepted by the owner: in a basket with two items each line carries
its own surcharge while the total carries one, so the total reads about €2 low.

## 8. What the owner still has to do

1. **Republish `firestore.rules`** whenever it changes. `flags/` and `errors/`
   are newer than the published copy. "Missing or insufficient permissions"
   almost always means this.
2. **Google Play**: `app.nabutarot.twa` exists; a closed-testing release passed
   review. Still needed: **12 opted-in testers for 14 days** (currently 0 - this
   is the only thing gating launch), the content rating updated to say block and
   report exist, and after the first upload the SHA-256 from Setup > App
   integrity pasted into `.well-known/assetlinks.json`.
3. **Play Billing** - built, dormant. `PLAN-PLAY-BILLING.md` Phase 0: eight
   in-app products, a service account as a worker secret, a billing-enabled AAB.

## 9. Outstanding work

- **Close the money leaks** — `PLAN-PLAY-BILLING.md` Phase 2. Rules let a
  signed-in person write their own `access`; codes are not bound to an account.
  Highest-value remaining change, and it does not depend on Play.
- **German stages 2–5.**
- **A `#/signin` page** replacing the sign-in card on the Me tab, agreed with the
  owner, not started.
- **Orders**: `PLAN-ORDERS-AND-ACCESS.md` items 4–8 (codes record who redeemed
  them, money summary).
- Love system: refuse a thread with someone already tied. Wedding: two partners
  asking for different times. CSP header. Firestore rules tests. Feed pagination.

## 10. Architecture notes

- **Build order matters** — `SCRIPTS` at the top of `build.py`. Data before
  `core.js`; screens before `main.js`.
- **Globals**: `store`, `ACCESS`, `ALERTS`, `BE`, `LOVE`/`LOVEDB`, `WED`,
  `MOD` (block/report), `BILL` (Play Billing), `PROFILE`, `CONFIG`, `COURSES`,
  `T()`, `L(obj)`, `lang`, `signedIn()`.
- **`ACCESS` is client-trusted.** `ACCESS.has()` reads localStorage. Binding an
  unlock to an account stops sharing, not tampering. Say so honestly.
- **`isTWA()`** separates the installed app from the website - used to keep
  prices and the course list out of what Play reviews.
- **Firestore**: `users`, `threads/{uid}/messages`, `bookings`, `people`,
  `handles`, `bonds/{a__b}`, `requests`, `weddings/{wid}`, `wedasks`, `taken`,
  `content`, `codes`, `errors`, `flags`, `reports`.
- More detail in `docs/ARCHITECTURE.md`.
