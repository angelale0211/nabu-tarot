# Google Play Billing — brief for a fresh session

Open a new Claude Code window in `C:\Users\angel\nabu-tarot` and say:
**"read BILLING-SESSION.md"**.

Read `HANDOVER.md` too for the traps that will otherwise cost you an hour, and
`docs/superpowers/specs/2026-09-08-play-billing-subscriptions-design.md` for
the full design. This file is the short version. For the fuller current
picture — the owner's remaining checklist and the known follow-ups — see
`NEXT-SESSION.md` Part 2.

---

## The state in one paragraph

As of **v191** (released on branch `play-billing`, not yet merged to `main`),
billing is **code-complete on both sides and covered by the automated
suites, and still switched off in practice** — not because anything is
missing in the code, but because it needs configuration only the owner can
create in Google's and Firebase's consoles (see `NEXT-SESSION.md` Part 2 for
the exact checklist). Nothing here has been tested on a real phone, and no
real purchase — test or otherwise — has ever been made: the 622-check
browser suite and the 50-check worker suite are both mocked. The first real
signal will come from a licence tester on a real device, once the owner's
console checklist is done.

## The catalogue — four one-time products, four subscriptions

| Key | Play product id | Kind | Length |
|---|---|---|---|
| `tarot` | `tarot` | one-time (in-app product) | opens the Tarot course |
| `lenormand` | `lenormand` | one-time (in-app product) | opens the Lenormand course |
| `playing` | `playing` | one-time (in-app product) | opens the Playing-cards course |
| `wedding` | `wedding` | one-time (in-app product) | pays for one named wedding room |
| `manifest` | `manifest_sub` | subscription | 12 months |
| `plus` | `plus_sub` | subscription | 12 months |
| `pro6` | `pro_sub` | subscription | 6 months — this is "Nabu Pro · 6 tháng" |
| `pro` | `pro12_sub` | subscription | 12 months — "Nabu Pro · 12 tháng" |

**Pro is two separate subscription products** (`pro_sub` for 6 months,
`pro12_sub` for 12 months), not one product with two base plans — every
subscription product here has exactly one active base plan. That is
load-bearing: the TWA bridge (`android-browser-helper`) always launches a
subscription's **first offer**, so a second base plan on one product is
unreachable from the app, and a promotional/trial offer would let the price
shown and the price charged disagree. Both `src/play-catalog.js` (client)
and `worker/src/catalog.ts` (worker) list the same eight ids —
`PLAY_SUB_SKUS` in each file is the single place the four subscription ids
are named, and a test asserts the two files agree.

Readings with Nabu are **never** sold through Play, on any platform: an hour
of a person's time is not a digital good and Google's rule does not cover
it.

## What is already built

| File | What it does |
|---|---|
| `worker/src/play.ts` | Signs a service-account JWT with WebCrypto, swaps it for an OAuth token, asks Google whether a purchase token is real, refuses cancelled / pending / already-consumed, writes the access through the Firestore REST API, then acknowledges **and** consumes |
| `worker/src/index.ts` → `/billing` | Requires a Firebase sign-in, rate limited, maps `pro`/`pro6` to also open `plus` |
| `worker/src/rtdn.ts` → `/rtdn` | Receives Google's Real-time Developer Notifications through a signed Pub/Sub push. Never trusts the notification's own claim about what changed — it re-asks Google for the token's current truth and applies that, so a duplicate, late, or out-of-order push all land on the same answer. Always answers `204` once the caller is verified as Google, so Pub/Sub does not retry forever on an unrelated error |
| `worker/src/reconcile.ts` → `reconcileSubs`, run from the `scheduled` handler in `index.ts` | Every 6 hours (`10 */6 * * *` in `wrangler.toml`), re-reads every live subscription purchase row and rewrites the account from Google's actual state — the safety net for a missed RTDN and the repair for a lost `users/{uid}.subs` row. The same tick also sweeps voided one-time purchases (`sweepRefunds` in `worker/src/refunds.ts`) |
| `worker/src/refunds.ts` | A purchase is claimed in `purchases/{sha256(token)}` **before** any access is written, so the same token cannot be spent twice by two accounts. Also exports `removeAccessFor`, used by both the refund sweep and `/rtdn` |
| `src/billing.js` | The Digital Goods API client. `BILL.can()` is false anywhere but the installed, verified Android app, so the website is untouched |
| `worker/src/codes.ts` → `/redeem` | Codes are claimed on the worker, bound to an account, single use |
| `firestore.rules` | `access`, `revoked` and `subs` are admin-only; `purchases` takes no client writes — **not live until the owner republishes it in the Firebase console** |
| `worker/wrangler.toml` | `FIREBASE_PROJECT_ID`, `ANDROID_PACKAGE`, `RTDN_AUDIENCE`, `RTDN_PUSH_EMAIL` |

Order of operations in the worker matters and is deliberate: **the access is
written before the purchase is acknowledged**. An acknowledged purchase Google
will not refund, that the buyer never received, is the worst outcome available.

## What has to exist before any of it runs (the owner's work)

The full numbered checklist lives in `NEXT-SESSION.md` Part 2. In short:

1. **Verify and publish `firestore.rules`** in the Firebase rules
   playground. Until this is done, a signed-in person can still write their
   own access from a browser console.
2. **Create the Pub/Sub topic and push subscription** for Real-time
   Developer Notifications and point Play at `/rtdn`.
3. **Add licence testers** (Play Console → Setup → Licence testing) — the
   only way to buy without real money.
4. **Upload the existing versionCode 2 AAB** to internal testing — nothing
   new needs building.
5. **Check the payments profile is verified**, or no money is ever paid out.

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
7. Refund it from the Console and confirm the access is revoked — either at
   once through `/rtdn`, or within 6 hours through the reconcile/refund-sweep
   cron. Both are built and covered by the worker suite; neither has been
   exercised against a real refund yet.

Budget a week of elapsed time. Most of it is waiting for uploads to propagate.

## Known follow-ups (not blockers, but real)

These are tracked in full in `NEXT-SESSION.md` Part 2; short version:

- **Retire expired `subs` rows and record provenance on non-Play grants.** A
  Play subscription row that names a key wins outright over a non-Play grant
  for that key, so a customer holding both a website code and a Play
  subscription for the same key silently **loses the longer of the two** —
  even a far-future code date gets shortened to Play's. Harmless until Play
  sales begin (no customer has a Play row yet), but must land before the
  first subscription is sold.
- **Optimistic concurrency** (`currentDocument.updateTime` compare-and-set)
  on the worker's Firestore writes — closes three concurrency findings
  currently accepted rather than fixed.
- **`reconcileSubs`'s Firestore query has `limit: 500` and no cursor** —
  revisit before the subscriber count gets near there.
- **Website pricing in USD/EUR** is still blocked on the four one-time
  products' prices, which the Play API does not return to a channel that
  never talks to Play (the website is bank-transfer only).

**Not fixable at all**: `ACCESS.has()` reads localStorage, so somebody willing
to edit their own browser storage can switch a course on regardless. Closing
that means the lessons not being in the downloaded bundle, which is a different
app. Say so plainly if the owner asks.

## The commission, for the record

15% on the first $1M a year, 30% above; subscriptions 15% from the start. On a
249.000đ course that is roughly 37.000đ. The owner knows and has chosen to
proceed. Readings are **not** sold through Play and never should be — an hour of
a person's time is a real-world service and is exempt.
