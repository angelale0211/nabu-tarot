# Google Play Billing, end to end: one-time courses, subscriptions, the wedding

Design, 2026-09-08. Plan: `docs/superpowers/plans/2026-09-08-play-billing-subscriptions.md`.
Nothing in this document has been built. Supersedes the "eight consumable
products" design in `PLAN-PLAY-BILLING-UNBLOCK.md` §3 Phase B.

## 1. Goal and scope

Inside the Android app (`app.nabutarot.twa`) every digital thing is bought
through Google Play and unlocked by the worker, with no human step: four
one-time products, four subscription offerings, and the wedding. Readings
stay outside Play. The website keeps its bank-transfer, order and code flow
unchanged.

Out of scope: the Android wrapper (no rebuild needed, §3), Play Integrity,
moving lessons off the client, the website's payment flow, any migration of
old one-time products (there are no customers).

## 2. Verified facts this design rests on

Checked on disk or in source on 2026-09-08. Anything not listed here was not
checked.

| Fact | How |
|---|---|
| Source at `0854038` is v189; the working tree has ~40 uncommitted files from another window (a German pass: `strings.js`, `test/test.html`, `billing.js` …) | `git status`, `git diff` |
| `src/billing.js` sends `COURSES` ids as `sku` and posts `{sku, token}` to `/billing`; `worker/src/play.ts` verifies with `purchases/products/…` only; `index.ts` grants `MONTHS[sku]` and `ALSO = {pro:[plus], pro6:[plus]}` | read |
| `pro6` is granted as access key `pro6`, but every Pro gate reads `proOn() = ACCESS.has('pro')` (16 sites in `pet.js`), so a Pro-6-month buyer gets no Pro today | grep |
| `pullProfile()` takes the cloud `access` as truth (cloud can shorten access) | `backend.js:121-128` |
| `purchases/{sha256(token)}` ledger exists, claimed before grant, `state: claimed/granted/voided`; daily voided sweep | `refunds.ts` |
| Firestore rules: `access`/`revoked` admin-only; `purchases` no client writes; `weddings` update keys include `wantMs, moveAsk`; admin may write `paid, paidAt, startMs, moved, wantMs, moveAsk` | `firestore.rules:38-53, 104, 344-353` |
| The AAB (`nabu-tarot-keys\pkg-billing-pkg-2026-09-08\Nabu Tarot.aab`, versionCode 2) bundles Play Billing Library with `ProductDetails`, `subscriptionOfferDetails`, `replacementMode`, and the android-browser-helper bridge whose method data parses **`sku`, `oldSku`, `purchaseToken`, `replacementMode`, `prorationMode`, `priceChangeConfirmation` only** | dex string scan; `MethodData.java` on GitHub |
| That bridge launches a subscription with **`offerDetails.get(0)`** — the first offer of the product; nothing from the web can pick a base plan. `getDetails` returns one `ItemDetails` per product (price = recurring phase of that first offer, plus `subscriptionPeriod`, `freeTrialPeriod`, `type`). `listPurchases()` returns `{itemId, purchaseToken}` | `PlayBillingWrapper.java`, `ItemDetails.java`, `GetDetailsCall.java` |
| Bridge supports plan replacement via `oldSku` + `purchaseToken` (+ `replacementMode`) | `PlayBillingWrapper.java` |

Consequence: **each subscription offering must be its own Play subscription
product with a single base plan.** Pro 6 months and Pro 12 months are two
products. A product with two base plans can only ever sell its first one
from this app.

## 3. Decisions and inputs

Decisions taken:

- **D-catalogue.** Play IDs and internal access keys are separate. Internal
  keys stay exactly as the app uses them today (`tarot lenormand playing
  manifest plus pro wedding`; `pro6` retires as an access key — both Pro
  plans write `pro` + `plus`). One catalogue file on each side maps Play
  `sku` → internal `key` → `opens[]`.
- **D-twa.** `isTWA()` decides "Play only". If Play does not answer inside the
  app, the screen says so and offers Retry; it never shows the website flow.
- **D-signin.** Buying requires a Nabu sign-in first (unchanged); the worker
  binds the purchase to that account.
- **D-truth.** The worker writes `users/{uid}.access` (dates, as today) and a
  new `users/{uid}.subs` (status per subscription). The phone only reads
  them. Play-managed keys (`manifest plus pro`) are recomputed from `subs`
  on every event; course keys are untouched by that recompute.
- **D-wedding-room.** A wedding purchase pays a *room*, not the account.
  Room first (unpaid), then pay; the worker marks that room paid and binds
  the token to that `wid`. `isPaid(w)` reads `w.paid` only.
- **D-nomove.** A wedding hour cannot be changed. All move code goes.
- **D-coins.** Coins and level vouchers apply to readings only. The Pro-gated
  15%/20% vouchers are removed. Plus's faster coin earning stays (it is a
  companion perk, not a discount).
- **D-wrapper.** No wrapper rebuild: the bridge in versionCode 2 already does
  everything needed.

Inputs still needed (the plan marks where each lands):

- **B1 — the subscription product IDs.** One table: offering → Play
  subscription product ID → base plan ID, for Manifestation 12m, Plus 12m,
  Pro 6m, Pro 12m. Not assumed. Task 0 tries to read them from Play with the
  service account; if that call is refused, the owner supplies the table.
- **B2 — Pro as two products.** If Pro was created as one product with two
  base plans, a second subscription product must be created (Console). §2.
- **B3 — Vietnamese copy** for ~30 new customer lines (store, statuses,
  wedding terms, coin explanation). English and German are drafted in the
  plan; Vietnamese is the owner's, verbatim, before release.
- **D1 — wedding cancelled before the hour:** "counts as used" (the room is
  deleted, the purchase stays spent) or "free cancel" (would need the ledger
  row re-pointed to a new room; not designed here). The plan implements
  "counts as used" behind one function and one terms line; the owner decides
  separately.

## 4. Catalogue

```
key        sku (Play)         kind    opens            months
tarot      tarot              inapp   [tarot]          6
lenormand  lenormand          inapp   [lenormand]      6
playing    playing            inapp   [playing]        6
wedding    wedding            inapp   []  (pays a room) –
manifest   <B1>               subs    [manifest]       12
plus       <B1>               subs    [plus]           12
pro6       <B1>               subs    [pro, plus]      6
pro        <B1>               subs    [pro, plus]      12
```

Legacy one-time `manifest plus pro6 pro` are not in the catalogue: the app
never lists them and the worker answers `unknown product` to their tokens.

Files: `src/play-catalog.js` (new, before `learn.js` in `build.py`),
`worker/src/catalog.ts` (new). A test asserts the two agree.

## 5. Entitlement model

`users/{uid}`:
- `access: { <key>: 'YYYY-MM-DD' }` — unchanged shape. Courses: worker
  `grantUntil` (later date wins). Play-managed keys: overwritten by recompute.
- `subs: { <key>: { sku, plan, state, until, autoRenew, tok, opens, grant } }`
  — one row per subscription *key* (`manifest`, `plus`, `pro6`, `pro`),
  `state` is Google's `subscriptionState` string, `until` = expiry date,
  `tok` = sha256 of the purchase token, `grant` = whether it opens access
  now. Written only by the worker. Read by the Me tab for status.

`purchases/{sha256(token)}` (ledger, worker-only):
`{ uid, sku, kind, ids, at, state, until?, wid?, plan?, expiry?, linked?,
voidedAt?, took? }`. Claimed with `currentDocument.exists=false` before any
grant. Same `uid` re-claiming is allowed (retry, restore); a different `uid`
is refused. For a wedding the row also carries `wid`; a re-claim with a
different `wid` is refused.

`weddings/{wid}`: `paid, paidAt, paidBy, purchase` written by the worker
(service account) or by Nabu's dashboard (web orders, as today).

Google state → access (pure `subAccess`):

| `subscriptionState` | access |
|---|---|
| ACTIVE, CANCELED, IN_GRACE_PERIOD (and expiry in the future) | granted until expiry |
| ON_HOLD, PAUSED, EXPIRED, PENDING, PENDING_PURCHASE_CANCELED, other | none |

Idempotency: a course token granted once stores `until` on its ledger row;
a retry re-applies that same `until` (no extension). A subscription token is
stable across renewals; every event re-reads Google and rewrites the same
`subs[key]` row, so duplicates and reordering are harmless.

## 6. Worker

- `POST /billing` `{ sku, token, wid? }`, Firebase-authenticated, rate-limited.
  Routes on `catalog.kind`:
  - `inapp` course: `checkPurchase` → `pending` ⇒ **202 `{pending:true}`**;
    claim → grant (idempotent `until`) → `markGranted(until)` →
    `waitUntil(acknowledge+consume)`.
  - `inapp` wedding: requires `wid`; claim carries `wid`; `payRoom` checks
    `uid ∈ weddings/{wid}.uids` and PATCHes `paid,paidAt,paidBy,purchase`;
    only after that succeeds: `markGranted`, `waitUntil(acknowledge+consume)`.
    A failed room write leaves the row `claimed`, unconsumed; the same
    account retries and gets through.
  - `subs`: `checkSubscription` (`purchases.subscriptionsv2.get`) → product
    must equal `sku`; `PENDING` ⇒ 202; claim → `applySubscription` (writes
    `subs[key]`, recomputes Play-managed `access`) → ledger state = Google
    state → if unacknowledged and granting, `waitUntil(acknowledgeSub)`.
    Subscriptions are never consumed.
  - Responds `{ ok, opened, access, subs }` on 200.
- `POST /rtdn` — Pub/Sub push. Verifies the Google OIDC token (JWKS
  `https://www.googleapis.com/oauth2/v3/certs`, `iss` accounts.google.com,
  `aud` = `RTDN_AUDIENCE`, `email` = `RTDN_PUSH_EMAIL`). Decodes
  `message.data`. Ignores other packages and `testNotification`. For a
  `subscriptionNotification`: ledger row by token → re-fetch Google → apply
  (never trusts `notificationType`). For `voidedPurchaseNotification` /
  one-time `CANCELED`: remove what the row opened, or un-pay the room. Always
  204 after a valid token so Pub/Sub does not redeliver forever.
- `scheduled` every 6 hours: voided sweep (exists) + `reconcileSubs` (every
  ledger row of kind `subs` not `EXPIRED` → re-fetch → apply).
- `auth.ts`: signature/expiry check extracted into `verifyJwt(raw, jwksUrl)`;
  `whoIsAsking` keeps its Firebase checks; new `verifyGoogleJwt(raw, aud)`.
- New `fs.ts`: Firestore REST get/patch with a generic encoder, used by the
  new code (existing hand-built calls stay).
- Config: vars `RTDN_AUDIENCE`, `RTDN_PUSH_EMAIL`; crons `["10 */6 * * *"]`.
  Secrets: `PLAY_SERVICE_ACCOUNT` only (exists). Nothing in the repo.

## 7. Client

- `src/billing.js` rewritten around the catalogue: awaitable `start()`,
  `retry()`, `detailsOf/priceOf/periodOf(key)`, `buy(key, {oldKey, wid})`,
  `verify(sku, token, extra)`, a local pending list, `restore()`
  (`listPurchases()` + pending list → `verify` each → `pullProfile`), and
  `sync()` called after start, after sign-in, after a purchase, and from the
  Restore button. Plan switch: `buy('pro', {oldKey:'pro6'})` finds the old
  token in `listPurchases()` and sends `oldSku` + `purchaseToken`.
- `src/store.js` (new): the in-app store rendered by `#/unlock` when
  `isTWA()`; one row per catalogue item with Play's price and period,
  "renews automatically every N months", status for held items (Active ·
  Ends on … · Payment problem · Expired), Manage
  (`https://play.google.com/store/account/subscriptions?sku=<sku>&package=app.nabutarot.twa`),
  Restore purchases, Retry when Play is silent. Also `myPlansHTML()` for the
  Me tab. No basket, no send, no code, no đồng price, no reward panel.
- Screens in TWA: course paywall (Buy or Retry; no code box), Me tab (plans
  card + Restore; no code box), coin/tree/pick limits (Buy Plus), Looks
  (unchanged link → store), wedding pay (Buy wedding).
- `backend.js`: `pullProfile` also stores `subs`; `core.js` gets `SUBS.get()`.
- Web (`!isTWA()`): unchanged, except coins (§9).

## 8. Wedding

Flow: engaged couple → plan screen (hour + terms checkbox) → **room created
unpaid** → `#/wedding/pay` → app: `BILL.buy('wedding', {wid})`; web: order +
transfer panel (as today) → room `paid`. Terms (3 lines): begin within 15
minutes; nobody begins → room closes, wedding used; the hour cannot be
changed and cancelling counts as used — a new wedding means paying again.
Removed: `WED_MOVE_MS` (renamed `WED_LATE_MS` for the last-hour rule),
`moved/asking/wantMs/canMove/askMove/answerMove`, the move panel, the
no-show room's move button, the admin "wants a new hour" line, strings
`wedMove*`/`wedMoved*`, rules keys `wantMs moveAsk moved startMs`(admin).
`isPaid(w) = !!(w && w.paid)`. `ACCESS.has('wedding')` is no longer read.

## 9. Coins and vouchers

`VOUCHERS = [{lv:3,pct:5},{lv:5,pct:10}]`, no `pro` flag. Reward panel and
voucher/coin lines removed from `#/unlock` and the course paywall on the web;
kept on `#/book`. `services.js` Pro `includes` lose "Voucher giảm 15% và
20%". `luckIntro/luckHint/luckWorth/luckNextTier/luckTopTier/luckOffer` say
"for a reading" (B3).

## 10. Firestore rules

- `users`: `touchesPaid()` also names `subs`.
- `weddings`: owner update keys `['state','step','vows','doneAt','bouquet','guestCount','ready']`;
  admin keys `['paid','paidAt']`. `paidBy, purchase` are worker-written.
- `purchases`: unchanged (no client writes).

## 11. Testing

- Suite (`test/test.html`, Chromium): a `playMode(on)` stub installs a fake
  `getDigitalGoodsService` (`getDetails`, `listPurchases`), a fake
  `PaymentRequest`, and a `/billing` stub with an in-memory Play (purchase
  states, subscription states) that writes the fake `users` doc. Checks:
  store rows and prices; buy course; retry does not extend; buy subscription
  → status and Manage link; CANCELED keeps access; ON_HOLD removes it;
  pending → waiting → opens on restore; restore from `listPurchases`; a
  **sweep of every route with `nabu-twa` set** failing on any code input,
  transfer text, order button or pay panel; wedding: no move UI, three
  terms, `isPaid` reads the room, TWA pay shows Buy; vouchers 2 tiers, no
  panel on unlock/paywall, panel still on `#/book`; web unchanged.
- Worker (`node --import tsx --test worker/test/*.test.ts`, run in
  `worker.yml`): catalogue integrity; `subAccess` state matrix; `recompute`;
  RTDN decode + rejected token; `/billing` handler with mocked Google and
  Firestore: course grant + idempotent retry, wedding `wid` mismatch refused,
  subscription writes `subs`, another uid refused.
- Device (owner, licence tester): listed in the plan's appendix.

## 12. Release and operations

One release, v190, after the other window has committed. Worker deploys from
CI on push. Rules republished by the owner (three clicks, given in the plan).
No new upload to Play. Console actions that remain are listed in the plan
with the note of what was and was not checked from here.
