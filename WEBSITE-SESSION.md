# The website: landing page, sign-in, theme — brief for a fresh session

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read WEBSITE-SESSION.md"**. Read `HANDOVER.md` too — it holds the traps.

---

## 0. The house rules, before anything is written

- **Vanilla JS. No npm, no Node, no React, no Tailwind, no TypeScript on this
  machine.** Every 21st.dev / shadcn component the owner has shown was rebuilt
  as plain CSS in `src/shell.html`. Do the same; say so plainly if asked to
  `npm install` anything.
- `python build.py` concatenates `src/*.js` + `src/shell.html` into `index.html`,
  which is committed. A release is **two edits plus a rebuild**:
  `window.APP_VERSION` in `src/main.js` and `const CACHE` in `sw.js`.
- `PYTHONIOENCODING=utf-8 python test/run.py` — 567 checks, ~6 minutes.
  Kill leftover python servers first; a stale one squats on port 8765 and the
  run reports nothing.
- **`#main p { text-align: justify }` is an ID selector** and beats any class.
  To centre text in a block, add the block to the `#main .thing p` list near the
  top of `shell.html`.
- Three audiences, three shapes, and they must not be confused:
  - `isTWA() || isStandalone()` — the installed Play app. No prices, no course
    list, no landing page.
  - `@media (min-width:900px)` — a desk. Left rail, 1040px column.
  - everything else — a phone browser.

---

## 1. The landing page (built, live)

**File**: [src/hello.js](src/hello.js) — 64 lines, the whole thing.
**Strings**: `hello*` in [src/strings.js](src/strings.js) (`helloHead`, `helloLead`,
`helloGo`, `helloFree`, and six `helloXxxH` / `helloXxxP` pairs).
**CSS**: `.hello-hero`, `.hlogo`, `.hgrid`, `.hcard`, `.hic` in `src/shell.html`.

### Who sees it — this is the whole rule

```
location.hash present      -> no   (a bookmark or shared link knows where it is going)
isTWA() || isStandalone()  -> no   (the installed app is not a stranger)
store 'nabu-hello' set     -> no   (been here before)
otherwise                  -> yes  (nabutarot.com, typed, first time)
```

`helloFirst()` is called once from `boot()`, before the first route is drawn.
Going in sets `nabu-hello` and jumps to `#/home`, so **it shows once, ever**.

**This is why "the landing page never shows" is not a bug.** To see it again:
open a private window, or clear `nabu-hello` from localStorage, or open
`https://nabutarot.com` with **no `#` at all**.

### What is on it

A logo, one headline, one lead paragraph, **one** button (the owner asked for
one, not two), a free-of-charge line, then six cards: draw a card, lunar
calendar, horoscope, learn, activities, message Nabu. Deliberately **no
prices** — a stranger deciding whether to look does not need a price list, and
the installed app is not supposed to show one. The old "most of the app is
free" block was removed at the owner's request; `helloMoreH` / `helloMoreP`
still sit unused in `strings.js` and can be deleted.

### The button effect (from the 21st.dev "get started" component)

`.slidebtn` in `shell.html` (~line 1944). The label fades while a chevron panel
on the right grows across the whole button on hover. A phone has no hover, so
there it is simply a button with an arrow — the effect is a reward for a
pointer, never the only way to read it. `prefers-reduced-motion` turns it off.

---

## 2. The sign-in page (BUILT, not yet released)

**File**: [src/signin.js](src/signin.js). **CSS**: `.signin`, `.orline`, `.srise`
in `src/shell.html`, just above the sliding-button block. **Strings**:
`signinLead`, `signinOr`, `signinLater` in all three languages.

`#/signin` is a page of its own: the logo, one heading, the lead line, the
Google and Facebook buttons, an "or" rule, then email and password, then the
way to an account and to a lost password, and a quiet link out to `#/home`.
The same page makes an account - `#amode` swaps the heading, the submit label
and the autocomplete hint, and hides "forgot password", which has no meaning
for an account that does not exist yet.

**The `next` hint.** `signinHref(next)` builds the link; with no argument it
points back at the screen the visitor is standing on. `signinNext(params)`
reads it back and **only honours a path inside the app** - anything else, and
anything pointing at `/signin` itself, falls back to `#/me`. Coming back uses
`redirect()`, so the sign-in page does not sit in the back stack.

Everything that used to send people to `#/me` now sends them here: the gate
card in `needAccountHTML` (the second card of the day, the coin, the tree, the
diary), the companion, the two love screens, the wedding door, the admin
sign-in, and the four `#/me?next=` redirects in `book.js`, `contact.js`,
`learn.js` and `play.js`. The Me tab keeps a `.needin` card as the door to it.

`bindAuth()` in `me.js` is now an empty function kept only so nothing that
calls it breaks. `BE` is still the only auth path.

The stagger is `.srise` plus `--i` per block, one keyframe, switched off under
`prefers-reduced-motion` - the page is complete and usable the moment it is
drawn, so losing the animation costs nothing.

### Checked on a desk

Measured in an iframe at 900, 1024, 1280 and 1536, and at 390 for a phone. The
column is **420px, centred to the pixel in the space right of the 96px rail**
at every desk width; nothing overflows the window or the column; the phone is
unchanged at 339px inside the usual 18px gutters; and the gate still hands over
`#/signin?next=%2Fplay%2Fcoin` on a desk.

**A bug the first, shallower check missed.** The stagger helper was written as

```js
html.replace(/^<(\w+)/, '<$1 class="srise" ...')
```

which writes a **second** `class` attribute. The parser keeps one, so every
block that already had a class silently lost it: `.lead`, `.hlogo`,
`.providers`, `.orline`, `.links`, `.later`, and worst of all the submit
button's `btn primary block`. It looked right in a text search of the HTML -
the string `class="lead"` was still in there - and only a query against the
**parsed DOM** showed it gone. `rise()` now merges into the existing class
instead. Lesson: check the parsed DOM, not the markup text.

**A harness artefact, not a bug.** Under `--virtual-time-budget` the animation
is registered and `playState` is `running`, but its clock never advances, so
`.srise` blocks read `opacity: 0` forever. Forcing every animation to `finish()`
brings all of them to full opacity, so the keyframes are right. In a real
browser the page fades in normally. Do not "fix" this by measuring opacity in
the suite.

**Still to do**: `python build.py`, the suite, and a release. Not done here on
purpose - see §6.

**The build in the repo is stale for this page.** `index.html` was built at
13:00 and carries the sign-in page with the **old, class-clobbering** helper.
The fix landed in `src/signin.js` immediately afterwards. Rebuild before the
suite, or the page will look unstyled.

## 3. The theme and template, as it stands

**The wordmark sparkle** (`shell.html` ~line 1903). `sparklesHTML(9)` in
`core.js` builds nine absolutely-positioned `.spk` stars over `#brand .lockup`,
each with its own delay, duration and scale, animating scale-and-rotate through
`@keyframes spk`. Gold and pink, the app's own two accents. **Header only** —
the same lockup appears in the footer and under the welcome note, and a name
that glitters in three places is a fairground.

**The tour, as steps** ([src/home.js:42](src/home.js#L42)). Eight steps, a
progress bar (`.tourbar`), the emoji in a round well (`.tourwell`) so unrelated
icons read as one series, back / forward always in the same place, and a skip.
Once done it shrinks to `.tourmini`, a one-line bar that can reopen it. This is
the carousel the owner asked for, in the app's own idiom.

**Desktop** (`@media (min-width:900px)`, `shell.html` ~line 1819). The bottom
tab bar becomes a **96px left rail**; the column is 1040px; home is two columns
with the forecast on the right; prose is set for reading. There is a second
900px block near line 1964 for the card fan and the deck-back strip — the fan
gets bigger slots there, because the owner reported the customiser dwarfing the
cards.

**A trap that has already bitten**: a rule like `.course{max-width:640px}`
written for the course page also caps every `.course` row elsewhere. When you
add a desktop rule, grep the class first.

---

## 4. Languages, so the new page does not break them

Three: `vi`, `en`, `de`. The pill **cycles** (vi→EN→DE→VI); it shows the *next*
language, not the current one. `LANGS` drives **data**, not just wording — a
table that has no `de` used to blank the whole app. `src/main.js` now runs
`deDefaults()`, which walks the language tables (top-keyed like `KW.en` and
record-keyed like `ZODIAC.aries.en` and `TOUR[0].en`) and fills German in from
English wherever it is missing. **Any new page must take its text from
`T()` / `S.xxx`, never from a hard-coded string**, or it will be English in all
three languages.

German is stage 1 of 5: about 80 of ~1,290 interface strings translated so far,
everything else falls back to English. Terminology agreed with the owner:
*Große Arkana, Kelche · Stäbe · Schwerter · Münzen, Bube · Ritter · Königin ·
König, Der Gehängte, Mäßigkeit, Das Gericht, Karte ziehen, Legung*.

---

## 5. Prices — do not mix them up

One row per language in [src/services.js:143](src/services.js#L143), and nothing
else in the app prints a currency symbol:

| Language | Symbol | Rate | Surcharge |
|---|---|---|---|
| Vietnamese | đ | 1 — the original price, untouched | none |
| English | **$** | 25.500 | +1 under 30.000đ, +2 above, rounded up to the half |
| German | **€** | 27.500 | +1 under 30.000đ, +2 above, rounded up to the half |

A package may override its own foreign price with `abroad: { en: n, de: n }`.
The yes/no question in Tarot and Lenormand uses it: **$1 / €1**, while
Vietnamese stays 10.000đ and 15.000đ.

Known and accepted by the owner: in a basket with two items each line carries
its own surcharge while the total carries one, so the total reads about €2 low.

The **landing page shows no prices at all** and should stay that way.

---

## 6. Warning: three windows, and who owns the build

Three sessions were in this repo at once on 2026-09-08:

| Window | Working on | Files |
|---|---|---|
| codes / money leak | redemption through the worker | `src/codes.js`, `src/backend.js`, `worker/`, `firestore.rules` |
| German | stage 2, the card names | `src/strings.js`, `src/tarot-de.js`, `build.py` |
| this one | the sign-in page | `src/signin.js`, `.signin` CSS, the gate call sites |

`index.html` is a **build artefact committed to the repo**. If two windows run
`build.py`, the last one wins and can bury the other's work.

**One window owns build, suite and commit.** On the day that was the codes
window, which ran a tight build-test loop — it took port 8765 three times
inside twenty minutes, each time within seconds of the port coming free. Do not
race it. Two things follow:

- **Check `netstat` for `127.0.0.1:8765` immediately before building**, not a
  minute before. A run can start in the gap between deciding and doing, and
  rebuilding `index.html` underneath a running suite corrupts that run.
- **You do not need to run it yourself.** `build.py` compiles every file in
  `SCRIPTS`, so once your source is on disk the next window's build picks it up
  and their suite exercises it. Confirm that rather than duplicating six
  minutes of work: `grep -c renderSignin index.html`.

**A new data file must be added to `SCRIPTS` in `build.py` or it is never
read.** `src/tarot-de.js` sat on disk for several minutes doing nothing for
exactly this reason. A rebuild will not warn you; the strings are simply absent.

**Verify your edits survived.** Sessions overlap in the same files. Every
sign-in call site here lives in a file another window was also rewriting, so
after any quiet period, re-check: `grep -rn "signinHref" src/*.js` should list
thirteen lines — twelve call sites plus the definition — and
`grep -rn 'href="#/me"' src/*.js` should show no sign-in gate.
