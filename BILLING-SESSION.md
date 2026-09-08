# Google Play Billing — brief for a fresh session

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read BILLING-SESSION.md"**.

Read `HANDOVER.md` too for the traps that will otherwise cost you an hour, and
`PLAN-PLAY-BILLING.md` for the full risk analysis. This file is the short version.

---

## The state in one paragraph

Billing is **written and shipped, and switched off**. Shipped in v168, dormant
because it needs configuration that only the owner can create in Google's
consoles. Nothing is half-finished in the code: with the configuration absent
the endpoint answers `not configured` and the app shows its code box, exactly as
before. Nothing here can be tested on this machine - Play Billing only works
through a published Play track, so the first real test is a licence-tester
account on a real Android phone.

## What is already built

| File | What it does |
|---|---|
| `worker/src/play.ts` | Signs a service-account JWT with WebCrypto, swaps it for an OAuth token, asks Google whether a purchase token is real, refuses cancelled / pending / already-consumed, writes the access through the Firestore REST API, then acknowledges **and** consumes |
| `worker/src/index.ts` → `/billing` | Requires a Firebase sign-in, rate limited, maps `pro`/`pro6` to also open `plus` |
| `src/billing.js` | The Digital Goods API client. `BILL.can()` is false anywhere but the installed Android app, so the website is untouched |
| `src/learn.js` | Inside the app: Play's own price and a Buy button when Play answers; the code box otherwise |
| `worker/wrangler.toml` | `FIREBASE_PROJECT_ID` and `ANDROID_PACKAGE`, both empty on purpose |

Order of operations in the worker matters and is deliberate: **the access is
written before the purchase is acknowledged**. An acknowledged purchase Google
will not refund, that the buyer never received, is the worst outcome available.

## What has to exist before any of it runs (the owner's work)

1. **Payments profile** — Play Console → Setup → Payments profile.
2. **Eight in-app products**, Monetise → Products → In-app products, each a
   **consumable** managed product, IDs exactly:
   `tarot` `lenormand` `playing` `manifest` `plus` `pro6` `pro` `wedding`
   (300k, 300k, 300k, 75k, 79k, 149k, 249k, 30k đồng respectively).
   Consumable because every one of them runs out — six months or twelve — and
   is then bought again.
3. **A service account** — Google Cloud → IAM → Service accounts → JSON key.
   Link it in Play Console → Setup → API access with *View financial data* and
   *Manage orders*; in Firebase give it *Cloud Datastore User*.
4. **Worker secrets** — `npx wrangler secret put PLAY_SERVICE_ACCOUNT` (the whole
   JSON), and in `wrangler.toml` set `FIREBASE_PROJECT_ID = "nabutarot"` and
   `ANDROID_PACKAGE = "app.nabutarot.twa"`. **There is no Node on this machine**;
   either the owner runs this elsewhere or it goes through `worker.yml` in CI.
5. **A billing-enabled AAB** from PWABuilder (there is a checkbox), uploaded to a
   testing track. The current AAB has no billing library in it.
6. **Licence testers** — Play Console → Setup → Licence testing. The only way to
   buy without real money.

## Then, in this order

1. Deploy the worker with the secret set. `/billing` should stop saying
   `not configured`.
2. Upload the billing AAB to **internal testing** (instant, no review).
3. Install it. **The app must open with no browser bar** — billing needs a
   verified TWA. If the bar is there, `assetlinks.json` has the wrong
   fingerprint: copy the SHA-256 from Setup → App integrity.
4. Open a course page: Play's price should show, with a Buy button.
5. Buy with the test card. Check the course opens, `users/{uid}.access` has the
   date in the Firebase console, and the worker log says `granted`.
6. Buy again — it should be offered again (consumed) and the date should extend
   rather than reset.
7. Refund it from the Console and confirm nothing revokes it yet — that is
   Phase 4, below, and is not built.

Budget a week of elapsed time. Most of it is waiting for uploads to propagate.

## What is deliberately not built yet

**Phase 2 — close the money leaks.** This matters more than billing does.
`firestore.rules` currently lets a signed-in person write their own `access`
field, so anyone who opens a browser console can grant themselves every course;
and a code is not bound to the account that redeemed it, so one code works for
everybody it is passed to. Billing satisfies Google's policy either way, but it
protects no revenue until this is done. The work: `access` and `revoked` become
admin-only in the rules, and code redemption moves to a worker `/redeem`
endpoint that records `by: uid` and refuses a code already used by somebody
else. It does not depend on Play at all and can be done first.

**Phase 4 — refunds.** A buyer can refund within 48 hours and keep the access
the worker granted. Nothing tells the worker. Needs a daily job calling
`purchases.voidedpurchases.list` and removing what it finds, plus a
`purchases/{token}` document per grant so a voided token maps back to whose
access to take away. That document is also the sales ledger the Pay tab wants.

**Not fixable at all**: `ACCESS.has()` reads localStorage, so somebody willing
to edit their own browser storage can switch a course on regardless. Closing
that means the lessons not being in the downloaded bundle, which is a different
app. Say so plainly if the owner asks.

## The commission, for the record

15% on the first $1M a year, 30% above; subscriptions 15% from the start. On a
249.000đ course that is roughly 37.000đ. The owner knows and has chosen to
proceed. Readings are **not** sold through Play and never should be — an hour of
a person's time is a real-world service and is exempt.
