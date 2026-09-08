# One registration that asks everything once

Design, 2026-09-08. Agreed with the owner in conversation; nothing built yet.

---

## The problem, in the owner's words

The Me tab asks the same person for the same things twice. There is a card
telling them to register, and directly underneath it a profile form they can
fill in without registering at all. Then, if they open the red thread, they are
asked for a *username* as well — a third name, for the same person.

None of it needs to be separate. Somebody who creates an account should be
asked, once, for everything the app will ever need, and never asked again.

## What was decided

Four decisions, each chosen by the owner:

| Question | Decision |
|---|---|
| What does a guest who never registers see? | A short card on the Me tab: name and birthday only. It carries over into registration, so nothing is asked twice. |
| How is the username chosen? | Suggested from the display name as they type, and editable. Always lands on something free. |
| Where does the language live? | On the account, so it follows the person to a new phone. The header button still works and updates the account. |
| Where does the questionnaire live? | Its own screen, reached after the account exists — not inside the sign-in page. |

The last one matters most. It keeps `src/signin.js` untouched, which another
window built the same afternoon, and it fixes the four existing accounts that
have no username, because they meet the same screen on their next visit.

**A constraint that forced this shape:** `firestore.rules` only lets a signed-in
person read `handles/{handle}`. So no username can be checked as free before the
account exists. The questionnaire therefore *cannot* come before registration.

## The flow

A new person:

1. **Sign in page** — email and password, exactly as today. Account created.
2. **Welcome screen** (`#/welcome`) — language, display name, username, birthday,
   interests. One button.
3. **The tour** — the eight steps already written in `src/home.js`, shown full
   screen rather than as a card.
4. **Home**, greeted by name, with the tour already marked seen.

A guest who never registers keeps today's behaviour exactly: the tour appears as
a card on the home screen, and the Me tab holds their name and birthday on the
device.

## The welcome screen

One column, five questions, one button. In order:

1. **Language** — three buttons, the current one already selected. First,
   because everything below it should be readable before it is answered.
2. **Display name** — a text box, up to 24 characters.
3. **Username** — fills itself in from the name as they type (accents folded,
   lowercased, non-letters dropped: `Mai Anh` → `maianh`). Once the person edits
   it by hand, it stops following the name. Shown with a leading `@`.
4. **Birthday** — a date box, optional, with one line saying it is what gives
   them their sign and their forecast.
5. **Interests** — the chips from `INTERESTS`, optional.

Pressing the button writes everything, then **the same screen becomes the
tour** — no new address. This is deliberate: a separate address for the tour
would let the back button land somebody on a questionnaire they have already
answered. Somebody who closes the app during the tour has a `handle` by then,
so they are not sent back here; they meet the tour on the home screen as any
other first-time visitor does.

**Reachable again.** `#/welcome` is a real address, and the app sends a
signed-in person there whenever their account has no `handle`. Somebody who
closes the app halfway is asked again rather than left broken.

## Data

Two new fields on `users/{uid}`:

| Field | Meaning |
|---|---|
| `handle` | the username, also the key in `handles/` |
| `lang` | `vi`, `en` or `de` |

`people/{uid}` and `handles/{handle}` are written by the welcome screen instead
of by the love system. **Same shape, same fields, same rules.**

**No `firestore.rules` change is needed.** Everything the welcome screen writes
is already permitted by the rules published on 2026-09-08: `handles` create
requires `uid == request.auth.uid`, `people/{uid}` requires `isOwner(uid)` with
short fields, and adding `handle` and `lang` to `users/{uid}` touches neither
`access` nor `revoked`, so it passes `touchesPaid()`.

**Nothing is migrated.** Eight accounts exist; four have a username. The other
four meet the welcome screen on their next visit.

## Code

| File | Change |
|---|---|
| `src/welcome.js` | **new.** The questionnaire, `ROUTES.welcome`, and the redirect rule for an account with no `handle`. |
| `src/signin.js` | one line: after a successful *create*, go to `#/welcome`. |
| `src/home.js` | the tour becomes callable as a full screen, not only a home-screen card. `tourDone` is set the same way either way. |
| `src/me.js` | signed in → a summary with an edit link. Guest → name and birthday only. |
| `src/love.js` | the username step goes. The page opens at "find someone". No handle → `#/welcome`. |
| `src/core.js` | on sign-in, the account's `lang` is applied to the device. The header button keeps working for everybody, and additionally writes back to the account **only while signed in** — a guest's choice stays on the phone, as it does today. |
| `src/strings.js` | the new lines, in three languages. |
| `test/test.html` | new checks; the existing love checks updated where they drive `#lvname` / `#lvsave`. |
| `test/layout_probe.js` | `#/welcome` and the full-screen tour added to the screens it walks. |

**Build order.** `welcome.js` goes into `SCRIPTS` in `build.py` after `home.js`
(it uses the tour) and before `main.js`.

## Layout, as a testable promise

The owner tests on Android, on iPhone and on a PC, and cares about this more
than about any other part of the work. So it is checked rather than eyeballed.

Both new screens are added to `test/layout_probe.js`, which already enforces:

- nothing wider than the screen at 320, 360 and 390 pixels, and on desktop
- every button and input at least 40 by 40 pixels
- no line longer than 52 characters on a phone, 85 on a desk
- no block stranded at under 55% of its container's width

Design rules that follow from it:

- one column, top to bottom, on every width
- full width on a phone, capped and centred on a desk, matching the 1040px
  column used since v169
- the interest chips wrap; they never scroll sideways
- the date box is never forced narrow — it is the control most likely to break
  layout, because Safari and Chrome size it differently
- the button is full width and never sits beside anything

## What could go wrong

| Case | What happens |
|---|---|
| App closed during the welcome screen | Account exists with no `handle`; the screen appears again next visit. |
| Username taken between suggestion and save | A number is appended, as `love.js` does today. |
| Person already has a username | It is shown and not re-claimed. |
| Firestore refuses a write | The message says the rules are not published, matching the existing behaviour in `love.js`. |
| Signed in on a second phone | The account's `lang` is applied on sign-in. |

## Testing

New checks, in `test/test.html`:

- a guest sees name and birthday only, and no username box
- creating an account lands on `#/welcome`, not back on the Me tab
- the username follows the name, then stops once edited by hand
- a taken username gets a number
- finishing the welcome screen writes `users`, `people` and `handles`, then
  shows the tour, then home
- an account with no `handle` is sent to `#/welcome`
- the love page has no username step and opens at "find someone"
- the language chosen is saved to the account and applied on the next sign-in

Existing love checks that drive `#lvname` and `#lvsave` are rewritten against
the welcome screen.

## What the owner has to supply

The new screen needs wording, and the owner writes the Vietnamese. English and
German are mirrored from it. The lines needed:

1. A title for the welcome screen.
2. One line under it, saying this is asked once and can be changed later.
3. A label for the username, and one line saying it is how friends find them.
4. One line under the birthday saying what it unlocks.
5. The button.

**Settled with the owner, 2026-09-08.** Their wording, verbatim — do not
retranslate or tidy it. English and German mirror it.

| Where | Vietnamese |
|---|---|
| Title | `Chào bạn! ✨` |
| Under the title | `Chỉ vài câu thôi — bạn có thể đổi lại bất cứ lúc nào.` |
| Display name label | `Tên hiển thị` (the existing `displayName` string) |
| Username label | `Tên riêng của bạn` (the existing `loveHandle` string) |
| Under the username | `Bạn bè có thể tìm bạn bằng tên này.` |
| Under the birthday | `Ngày sinh giúp Nabu xác định cung và chọn dự đoán phù hợp với bạn.` |
| Button | `Tiếp tục` |

Two decisions worth keeping written down, because both are easy to get wrong
later:

**The username is not called `Tên hiển thị`.** The owner first proposed it, on
the good reasoning that "username" sounds like a login credential. But
`Tên hiển thị` is already the display-name field, in both `displayName` and
`loveYourName`, so the screen would have carried two fields with one name.
The owner had already solved this in the love system: the handle is
`Tên riêng của bạn`, hinted as `Đây là tên để người ấy tìm ra bạn`. That
wording is reused rather than invented.

**The button is `Tiếp tục`, not `Xong` or `Hoàn tất`.** The tour follows this
screen, so nothing is finished when it is pressed. If the tour is ever removed
from this flow, the button becomes `Hoàn tất`.

## Not in this work

- The eighth tour step still tells people to enter their name and birthday,
  which they will have done two screens earlier. It should be reworded to point
  at the profile instead. Small, and worth doing in the same pass.
- Interests move to registration, so a guest no longer picks them. The "you
  might like this" row on the home screen shows a general selection for guests.
  Accepted knowingly.
- Nothing here changes payments, courses, codes or the worker.
