# Orders, payment, unlocking and taking access back

What you described, what is actually in the code, and what to change.

---

## The short version

**Confirming payment already unlocks the course. You should not be generating
codes for anybody who ordered inside the app.**

`BE.markPaid()` in `src/backend.js` does exactly what you asked for: it marks
the order paid and writes the courses onto the buyer's own account. The Pay tab
already calls it. The comment above that button even says *"so there is no code
for anybody to pass around"*.

So why has it not worked for you? Almost certainly this:

> **`firestore.rules` has never been republished.** Writing
> `users/{uid}.access` from Nabu's account is a write the published rules do
> not allow yet. The write is refused, the toast says *"Missing or insufficient
> permissions"*, and there is nothing to show for it - so you fall back to
> making a code by hand.

That is the ten-minute task at the top of the other plan, and it unblocks most
of this. Everything below is what to build **after** it.

---

## Problem by problem

### 1. "Do I still have to generate a key manually?"

**No - and you should stop.** Codes exist for one case only: somebody who paid
without an account (cash, or a bank transfer from someone who never signed in).
For an order placed in the app, confirming payment is the whole job.

**To do:** once the rules are published, test one real order end to end.
Then reword the Codes tab so it says what it is for, instead of looking like
the normal way to sell a course.

### 2. "Somebody orders but never messages me, so I cannot find them"

The order already knows who they are. `createUnlockOrder()` writes `uid`,
`email` and `name` onto every order. Nothing is missing from the data - the
dashboard just does not *do* anything with it.

**To do:** on every order row in the Pay tab, add

- the buyer's name and email, shown plainly
- a **Message them** button that opens their thread (`#/admin?tab=inbox`
  already renders exactly that thread by uid, so this is a link, not a feature)
- a **What they hold** line, and the revoke button, right there

Right now revoking is only reachable by opening somebody's thread in the Inbox
tab - which is useless for exactly the people you are describing, the ones who
never wrote to you.

### 3. "I cancelled a code and they can still use everything"

This is a real bug, and the worst one here.

`revokeCode(hash)` in `src/codes.js` deletes the code **from the book**. That
stops the code being redeemed *again*. It does nothing whatsoever to somebody
who already redeemed it - their access was written to their own device and
their own account the moment they typed it, and nothing ever re-checks the book.

There is a working way to take access back, `BE.revokeAccess(uid, why)`, which
writes `access: {}` plus a `revoked` stamp that beats the merge on their phone.
It is just not connected to the button you pressed.

**To do:**

- The Codes tab cancel button must say what it really does: *"this stops the
  code being used again; it does not take anything back from whoever already
  used it."*
- Next to it, when the code has been redeemed, offer **"take their access back
  too"**, which calls `revokeAccess` on the account that redeemed it.
- Add the same revoke button to the order row (problem 2).

### 4. "The Codes tab does not show who owns a code"

True: the published codebook stores only `{ c: course, u: until, at }`. There
is no owner because nothing writes one.

**To do:** when a code is redeemed, record it. Add to the book entry:

```
{ c, u, at, by: <uid>, byName, byEmail, usedAt }
```

Then the Codes tab shows, per code: unused / used by whom / when. That is also
what makes "take their access back too" possible in problem 3.

### 5. "One person buys a key and shares it with everyone"

Once problem 4 is done this becomes easy, because the book knows who used it.

**To do:** make redeeming single-use. On redeem:

- if the entry has no `by`, claim it: write `by = my uid`
- if it has a `by` and it is not me, refuse with *"this code has already been
  used by another account"*
- if it is me, allow it (same person, new phone - which must keep working)

Together with problem 1, sharing mostly stops mattering: people who order in
the app never get a code to share in the first place.

**Say this honestly:** `ACCESS.has()` reads localStorage, so somebody willing
to edit their own browser storage can still switch a course on. Binding codes
to accounts stops *sharing*; it does not stop *tampering*. Truly stopping it
would mean the lessons not being in the downloaded bundle at all, which is a
much bigger change and not worth it at this size.

### 6. "Keep track of orders, payments, and the total I earned"

**To do:** a summary at the top of the Pay tab:

- this month, and all time: number of orders paid, and the total in đồng
- what is still owed (confirmed but not paid)
- the list below stays as it is

All of it can be counted from `bookings` on the phone. No new collection.

---

## The one thing that needs a decision

`pullProfile()` merges cloud access into local **keeping the later date**. So
Nabu can add access and extend it, but cannot shorten it. Taking access away
only works through the separate `revoked` stamp, which is all-or-nothing: it
clears *everything* that person holds.

That is fine for "this person broke the rules". It cannot do "they bought Tarot
and Lenormand, take back only Lenormand".

**Two ways:**

- **Leave it.** Revoking stays all-or-nothing. Simple, already works.
- **Make the cloud the truth.** `users/{uid}.access` becomes what is true, and
  the phone's copy is only a cache for being offline. Then you can take back
  one course, change a date, anything. It costs care: a code redeemed while
  offline must not be wiped by a stale cloud copy before it has been pushed up.

I would do the second, but only after everything above is working, and as its
own change with its own tests.

---

## Order of work

| # | What | Who | Size |
|---|------|-----|------|
| 1 | Republish `firestore.rules` | you, 10 min | - |
| 2 | Test one real order: confirm payment, check it unlocks | you + me | S |
| 3 | Order rows show buyer, **Message them**, what they hold, revoke | me | M |
| 4 | Codes record who redeemed them; Codes tab shows it | me | M |
| 5 | Codes become single-use, bound to the first account | me | S |
| 6 | Codes tab cancel tells the truth, and offers to revoke too | me | S |
| 7 | Money summary at the top of the Pay tab | me | S |
| 8 | Reword the Codes tab: for people without an account only | me | S |
| 9 | Cloud becomes the truth for access (the decision above) | me | M |
