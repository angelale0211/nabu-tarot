# The sign-in window: what I did, and what I need from you

2026-09-08, afternoon. For the window that owns build, suite and commit.
Short version: **the `#/signin` page is finished in `src/`, it is already
inside your builds, and I need one number back from you.**

---

## 1. What you actually have to do

**Nothing, to include my work.** `build.py` compiles every file in `SCRIPTS`,
and `signin.js` is in that list. Your build at 13:17:25 already had it, fixed
version and all. Confirm rather than rebuild for my sake:

```bash
grep -c renderSignin index.html                   # 2
grep -c 'The beat is added to whatever' index.html # 1 = has my fix
```

**One thing I want back: the pass/fail count.** I never ran the suite — you
held port 8765 every time I looked, so I stood down rather than race you.
There are **17 new sign-in checks** in `test/test.html`. If any failed, paste
the lines and I will fix them. That is the only thing outstanding on my side.

**Do not "fix" the stagger.** See §4.

---

## 2. What was built

A page of its own at `#/signin`, replacing the sign-in card that used to sit on
the Me tab. It was §2 of `WEBSITE-SESSION.md`, agreed with the owner and not
started; it is now built and unreleased.

| Thing | Where |
|---|---|
| The page | `src/signin.js`, new file, **still untracked** |
| CSS | `.signin`, `.orline`, `.srise`, `@keyframes srise` in `src/shell.html` |
| Strings | `signinLead`, `signinOr`, `signinLater`, in all three languages. **The Vietnamese `signinLead` is the owner's own wording, verbatim, one line with emoji - do not retranslate or tidy it.** EN and DE mirror it. |
| Route | `ROUTES.signin = { nav: 'me', render: renderSignin }` |
| Checks | 17 in `test/test.html` |

The page: logo, heading, lead line, Google and Facebook, an "or" rule, email
and password, then the way to a new account and a lost password, and a quiet
link out to `#/home`. `#amode` turns it into the create-account form in place —
it swaps the heading, the submit label and the autocomplete hint, and hides
"forgot password", which means nothing for an account that does not exist yet.

**The `next` hint.** `signinHref(next)` builds the link; with no argument it
points back at the screen the visitor is standing on. `signinNext(params)`
reads it back and **only honours a path inside the app** — anything else, and
anything pointing at `/signin` itself, falls back to `#/me`. The return uses
`redirect()`, so the sign-in page does not sit in the back stack.

**No second auth path.** Same `BE.signIn` / `BE.signInEmail` / `BE.resetPassword`
as before. `src/backend.js` is untouched by me.

---

## 3. Where I am in files you are also editing

This is the part worth your attention. My gate changes live in ten files, four
of which you rewrote this afternoon (`core.js`, `learn.js`, `admin.js`,
`pick.js`). I re-checked at 13:27 and all of it survived, but if you rebase,
revert or hand-merge anything, check this first:

```bash
grep -rn "signinHref" src/*.js      # 13 lines: 12 call sites + the definition
grep -rn 'href="#/me"' src/*.js     # no sign-in gate may appear here
```

Everything that used to send somebody to `#/me` now sends them to `#/signin`
with a return address: the gate card in `needAccountHTML` (second card of the
day, coin, tree, diary), the companion, both love screens, the wedding door,
the admin sign-in, booking, contact and the two unlock paths.

I have **not** touched `backend.js`, `codes.js`, `strings.js` beyond my three
keys, `build.py`, `worker/`, or `firestore.rules`.

---

## 4. Two things I learned the hard way — please do not undo them

**The stagger helper used to eat classes.** It was written as

```js
html.replace(/^<(\w+)/, '<$1 class="srise" ...')
```

which writes a **second** `class` attribute. The parser keeps one, so every
block that already had a class silently lost it: `.lead`, `.hlogo`,
`.providers`, `.orline`, `.links`, `.later`, and worst of all the submit
button's `btn primary block`. It now merges into the existing class instead.

The reason this matters beyond the fix: **a text search of `index.html` said it
was fine.** The discarded `class="lead"` is still sitting there in the markup.
Only a query against the *parsed DOM* showed the class was gone. If you check
markup by grepping the built page, you can be fooled the same way.

**`.srise` blocks read `opacity: 0` forever under the suite's clock, and that is
not a bug.** With `--virtual-time-budget` the animation is registered and
`playState` is `running`, but its clock never advances. I forced every animation
to `finish()` and all blocks went to full opacity, so the keyframes are right
and a real browser fades the page in normally. **Do not write a check that
measures opacity on `.srise`, and do not remove the `backwards` fill to make
one pass.** Geometry is unaffected — `getBoundingClientRect` is correct — so
the existing overflow sweeps are fine.

---

## 5. Verified on a desk

Measured in an iframe against a real build, not by eye:

| Width | Column | Centred beside the 96px rail | Overflow |
|---|---|---|---|
| 900 | 420px | within 1px | none |
| 1024 | 420px | within 1px | none |
| 1280 | 420px | within 1px | none |
| 1536 | 420px | within 1px | none |
| 390 | 339px | no rail | none |

The gate round trip works on a desk too: `#/play/coin` signed out offers
`#/signin?next=%2Fplay%2Fcoin`.

**Later the same afternoon, from the owner's screenshot on a desk:** type a size up
everywhere in `.signin` (h1 32px, lead 19px, buttons 54px on a desk), and the
page is now **vertically centred between header and footer on any screen**:
`body[data-route="signin"] main{flex:1;display:flex;align-items:center}` rides
the flex column the body already is. Paddings are symmetric so the centre is
exact. The form is ~850px tall, so on a 1080-high screen it centres with about
18px to spare and on anything shorter it scrolls, which is right.

**And later still, from an ultrawide screenshot:** the landing page (`#/hello`) now
centres the same way (`body[data-route="hello"] main{flex:1;...}`), and both
welcome pages scale up at `min-width:1600px` and `min-width:2200px` - the landing
column, header and footer widen to 1240 / 1400px on those routes only, and the
type and buttons go up two steps. Those two blocks sit **after** the 900px
sign-in block on purpose: same specificity, the wider screen has to win. Measured
at 3440x1440, 2560x1440, 2560x920, 1920x1080, 1366x768, 390 and 320: horizontal
centre exact, vertical within 8px (the back bar), nothing overflowing.

The probe is not in the repo. It lives in my scratch directory and served on
port **8791**, never 8765, so it never touched your runs.

---

## 6. Release, as I understand it

Not mine to do, and I have not. For the record, what I believe still stands
between us and v177 going live:

1. Your suite passing, and the 17 sign-in checks with it.
2. All three windows at a stopping point. At 13:27 five app source files were
   newer than the build, so it was stale again.
3. One rebuild, one commit. `src/signin.js` is **untracked** — `git add` it or
   it will not go.
4. **The owner republishing `firestore.rules` and setting the two worker
   secrets.** Until then v177's money-leak fix is only half in force: the client
   stops the sharing, but anyone can still write their own `access` from a
   browser console. Shipping without it looks like a fix and is not one.

Versions are already correct and consistent: `v177` in both `src/main.js` and
`sw.js`.

The owner asked that nothing be released until every session is done.

---

## 7. Coordination, honestly

You took port 8765 three times inside twenty minutes, each time within seconds
of it coming free. That is fine — you own the loop — but it means:

- **Check `netstat` for `127.0.0.1:8765` immediately before you build**, not a
  minute before. Rebuilding `index.html` underneath a running suite corrupts
  that run. Your own build at 13:24:11 landed while your server from 13:22 was
  still up.
- A new data file does nothing until it is in `SCRIPTS` in `build.py`.
  `src/tarot-de.js` sat on disk inert for several minutes for exactly this
  reason, and a rebuild gives no warning.

Fuller notes are in §6 of `WEBSITE-SESSION.md`, which I rewrote for three
windows rather than two.


---

## 8. v179 went out from this window - read this before your next commit

**15:45.** The owner asked for the landing page republished with their own
copy, and it is live as `1c2712d` / v179. I did it **without touching your
working files**: a clean worktree of v178 plus `src/strings.js`, `src/hello.js`
and the version bump, built and run through the suite there on port 8766
(585/585), committed there, then `main` moved to that commit and pushed.

What that means for you:

- Your tree's `HEAD` is now v179. Your edits to `src/shell.html`, `src/core.js`,
  `test/test.html`, `test/layout_probe.js` and your own `index.html` build are
  **exactly as you left them** - still dirty, still yours.
- Two more went out the same way afterwards: **v180** (the free line under the
  landing button removed) and **v181** (the eight tour steps and the booking
  how-to in the owner's words, `src/home.js`, `src/book.js`, `src/config.js`).
  `src/main.js` and `sw.js` in the tree say the latest. **Your next release is
  v182.** Bump both, or `health.yml` will fail.
- Your `index.html` was built before v179 and does not carry the new landing
  copy. Rebuild before you commit, or the commit would put the old headline back.
- I reset the index (`git reset`, working tree untouched) so nothing is staged
  from before the move. Stage what you mean to commit as usual.

The landing strings are the owner's words verbatim (`helloHead`, `helloGo`,
`helloFree`, six `helloXxxH/P`). `helloLearn*`, `helloPlay*`, `helloTalk*` and
`helloMore*` are gone; nothing referenced them.
