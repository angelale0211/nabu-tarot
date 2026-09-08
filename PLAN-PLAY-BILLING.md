# Selling through Google Play — the plan, the risks, and what protects the money

Written 2026-09-08. The code for the first phase is already in the repo
(`worker/src/play.ts`, `src/billing.js`); nothing is switched on until the
configuration in Phase 0 exists.

---

## What changes, in one paragraph

Inside the installed Android app, the eight digital things — four courses and
four unlocks — are bought through Google Play. Play takes 15%. On the website
nothing changes: the same courses are bought by bank transfer, arranged by
message, with no commission. Readings with Nabu are never sold through Play,
anywhere: an hour of a person's time is not a digital good, and Google's rule
does not apply to it.

The phone is never trusted about what it bought. It hands the worker the token
Play gives it; the worker asks Google whether that token is real, for that
product, for this app, and unused; and then the worker writes the access on the
account itself.

---

## Where the money leaks today, before any of this

This is the honest starting point, and three of the four are older than Play
Billing.

| Leak | How | Size |
|---|---|---|
| **1. Self-granting** | `firestore.rules` line 32 lets a signed-in person write their own `access`. Anyone who can open a browser console can give themselves every course. | Whole catalogue, any technical user |
| **2. Code sharing** | A code is checked on the phone and never bound to an account. One buyer, unlimited friends. | Whole catalogue, any social user |
| **3. Local tampering** | `ACCESS.has()` reads localStorage. Editing it switches a course on. | Whole catalogue, technical user; also survives fix 1 |
| **4. Refund-and-keep** | Not yet possible — but once Play is live, a buyer can get a Play refund and keep the access the worker already granted. | One purchase at a time |

Play Billing on its own fixes **none** of these. It satisfies Google. The rest
of this plan is what actually protects the money.

---

## Phase 0 — things only Nabu can do (nothing else can start without them)

1. **Merchant profile.** Play Console → Setup → Payments profile. Google will
   not sell anything without knowing where to send the money. Check the payout
   country is one Google pays out to; if the account was made from Germany
   that is fine, and Vietnam is also supported.
2. **Eight in-app products**, Play Console → Monetise → Products → In-app
   products. IDs must be exactly: `tarot`, `lenormand`, `playing`, `manifest`,
   `plus`, `pro6`, `pro`, `wedding`. Type: **consumable** managed product (they
   run out after 6 or 12 months and are bought again, which is how the codes
   have always worked). Set the prices in VND.
3. **A service account.** Google Cloud Console → IAM → Service accounts →
   create → make a JSON key. Then Play Console → Setup → API access → link it →
   grant **View financial data** and **Manage orders**. In Firebase, the same
   account needs the **Cloud Datastore User** role on the project (it writes
   `users/{uid}.access`).
4. **Worker secrets**, from a PC with Node, or by handing me the JSON path:
   `npx wrangler secret put PLAY_SERVICE_ACCOUNT` (paste the whole JSON),
   and in `wrangler.toml` set `FIREBASE_PROJECT_ID = "nabutarot"` and
   `ANDROID_PACKAGE = "app.nabutarot.twa"`.
5. **A new AAB** from PWABuilder with **Play Billing** ticked in the Android
   options. Upload it to the testing track. The old AAB has no billing library
   in it and `BILL.can()` will simply stay false.
6. **Licence testers.** Play Console → Setup → Licence testing → add the tester
   Gmail addresses. Licence testers buy with test cards; no real money moves.
   This is the only way to test any of it.

Until step 4 is done, the `/billing` endpoint answers `not configured` and the
app falls back to the code box. Deploying the code early is safe.

---

## Phase 1 — the purchase path (built, not yet switched on)

What is in the repo now:

- `worker/src/play.ts` — signs a service-account JWT, swaps it for a token,
  checks the purchase with `purchases.products.get`, refuses cancelled,
  pending and already-consumed tokens, writes the access through the
  Firestore REST API, then acknowledges and consumes.
- `worker/src/index.ts` `/billing` — requires a Firebase sign-in, rate limited,
  maps `pro` and `pro6` to also open `plus`.
- `src/billing.js` — Digital Goods API, absent on the web by design.
- `src/learn.js` — inside the app, Play's own price and a Buy button when Play
  answers; the code box otherwise; on the web, unchanged.

**Risks in this phase, and what is done about each:**

| Risk | Mitigation |
|---|---|
| A forged or replayed token | Every token is checked with Google; `consumptionState == 1` is refused |
| Acknowledged but not granted (Google keeps the money, buyer gets nothing) | Access is written **first**; acknowledge runs after, in `waitUntil` |
| Granted but not acknowledged (Google refunds after 3 days, buyer keeps access) | Acknowledge failures are logged; Phase 4 reconciles |
| Worker abused as a free grant endpoint | Only accepts a token; a token is worth nothing without a matching Play purchase |
| Service-account key leaks | Lives only in a Worker secret; never in the repo, never in chat; rotate from Cloud Console if in doubt |
| App shows a bank-transfer price next to a Play price ("steering") | Inside the app no VND price, no order button and no bank-transfer text for digital goods — already in place since v165 |
| Sale discounts don't apply to Play prices | Correct: Play prices are set in the Console. Play has its own promo tools; the app's `SALE` stays a web-only thing |
| Buyer expects auto-renewal | Wording says "6 tháng" / "12 tháng"; consumables do not renew. If renewals matter later, switch to subscriptions (also 15%) |

---

## Phase 2 — close the leaks (the part that protects the money)

**The worker has never been deployed.** Found on 2026-09-08: both `worker.yml`
runs failed at the typecheck step, so `nabu-ai` does not exist in Cloudflare and
`CONFIG.aiEndpoint` has always been empty. The cause was one line of
`worker/src/index.ts`, where `"\n\n"` had become a real line break inside a
string - the bash-heredoc trap in `HANDOVER.md` §3. Fixed. Anything that
depends on the worker (Play billing, `/redeem`, booking mail, bug-report mail)
was dead in the water until this, which is why it is written down here.

**Built 2026-09-08 (v177).** What shipped, against the list below: the rules
(1), `/redeem` in `worker/src/codes.ts` with the book made private (2), the
phone as a cache of the account (3), the dashboard unchanged (4). Two things
follow from it that Nabu has to do:

- **Republish `firestore.rules`** - until then the old leak stays open.
- **Set `PLAY_SERVICE_ACCOUNT` and `FIREBASE_PROJECT_ID` on the worker, and
  `CONFIG.aiEndpoint` in the app** (Phase 0, items 3 and 4). Codes go through
  the worker now; until it is configured, typing a code says "cannot be
  checked right now" and opens nothing. Orders paid in the app are unaffected:
  the dashboard writes access as admin, as before.
- **Re-add outstanding codes.** The book is keyed differently now (a plain
  SHA-256; Workers refuse the 250,000-round PBKDF2 the old book used). A code
  handed out before v177 and not yet redeemed is marked in the Codes tab and
  works again once pasted into "codes handed out before".

This is the change I asked about twice as "should the cloud become the source
of truth". Play Billing makes the answer yes.

1. **Rules:** `users/{uid}.access` and `revoked` become writable by Nabu only.
   The owner keeps every other field. The service account is not bound by
   rules at all, so the worker's writes keep working.
2. **Codes move to the worker.** `verifyCode` stays on the phone for the
   lookup, but the *grant* goes through a new `/redeem` endpoint that checks
   the hash against the published book server-side, records `by: uid` and
   `usedAt` on the entry, refuses a code already used by a different account,
   and writes the access. This is item 4–5 of `PLAN-ORDERS-AND-ACCESS.md`, and
   it is what finally makes a code single-use.
3. **`ACCESS.grant()` becomes internal.** Nothing on the phone grants access
   any more; it only caches what the account says. `pullProfile` stops
   "keeping the later date" and takes the cloud copy as true, which is also
   what makes per-course revocation possible.
4. **Nabu's dashboard** goes on writing access the way it does now — as an
   admin, which the rules still allow.

What this does **not** fix: leak 3, local tampering. The lessons are inside
the downloaded bundle, so somebody editing their own browser can still show
them. Closing that means the course text not being in `index.html` at all,
served from the worker only to accounts that hold it. That is a real change to
the shape of the app, worth doing only if the leak turns out to matter in
practice. Most people are not going to open a debugger to save 300.000đ.

---

## Phase 3 — testing, in order

Nothing here can be tested on this PC or in the 562-check suite. Each step is a
real phone and a licence-tester account.

1. Upload the billing AAB to the **internal testing** track (instant, no review).
2. Install it. Confirm the app opens with no browser bar. Billing requires a
   verified TWA; if `assetlinks.json` is wrong, billing will not even appear.
3. Open a course page. Confirm Play's price shows and the Buy button exists.
4. Buy with the test card. Confirm the course opens, `users/{uid}.access`
   shows the date in the Firebase console, and the worker log shows `granted`.
5. Try to buy again. Confirm Play offers it again (consumed) and the date
   extends rather than resets.
6. Refund it from the Play Console order page. Confirm Phase 4 revokes it.
7. Sign in on a second phone. Confirm the course is open there too.

Expect a round or two of fixes. Budget a week of elapsed time, mostly waiting
for uploads to propagate.

---

## Phase 4 — refunds

Google lets a buyer refund within 48 hours, and Nabu can refund from the
Console at any time. Neither tells the worker.

A scheduled GitHub Action (or a Worker cron) once a day calls
`purchases.voidedpurchases.list` for the last week and, for each voided token
whose grant is recorded, removes that course from the account. Small, and it is
the only thing that closes leak 4.

Keep a `purchases/{token}` document per grant — uid, sku, at — so a voided
token can be mapped back to whose access to remove. That document is also the
sales ledger the Pay tab has wanted.

---

## Rollback

Every piece degrades to the old behaviour on its own:

- Remove the Worker secret → `/billing` says `not configured` → app shows the
  code box.
- Old AAB, or web → `BILL.can()` is false → nothing changes.
- Phase 2 rules can be republished from git at any time.

There is no step that cannot be walked back within an hour.

---

## Order of work

| # | What | Who | Blocks |
|---|------|-----|--------|
| 1 | Phase 0, items 1–3 and 5–6 | Nabu | everything |
| 2 | Worker secret + config, deploy | me, once given the key path | 3 |
| 3 | Internal-track test of one purchase | both | 4 |
| 4 | Phase 2: rules + `/redeem` + single-use codes | me | — |
| 5 | Phase 4: voided-purchase reconciliation + ledger | me | — |
| 6 | Closed test with billing AAB, then production | Nabu | — |

Phase 2 can be built while Phase 0 is being set up; it does not depend on Play.
