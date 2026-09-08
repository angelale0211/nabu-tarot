# Play Billing: from "Upload a new APK" to a product somebody can buy

Written 2026-09-08 in the shape of the security-audit skill (recon, hunt,
adversarial validation, report, checklist, independent verification), on top
of `PLAN-PLAY-BILLING.md`, which still holds the risk analysis. This is the
plan only. Nothing in it has been executed.

---

> **Executed 2026-09-08.** Everything that does not need the Play Console
> is done and verified; results in `PLAN-PLAY-BILLING-FINDINGS.md`. What is
> left is listed there, and the App signing key fingerprint is the one thing
> that will stop a test purchase working.

## 0. What the screenshot is saying

Play Console > Monetise > One-time products says: *"To add one-time products,
you need to add the BILLING permission to your APK."* Play will not let a
product be created until **some uploaded bundle, on any track, declares
`com.android.vending.BILLING`**. That is the whole blocker. It is a packaging
gap, not a code gap: the buy button, the worker that checks a purchase with
Google, the refund sweep and the code redemption are all built and deployed.

---

## 1. Recon: what is true today (each line was checked this session)

| Fact | How it was checked |
|---|---|
| `src/billing.js` (Digital Goods API client), `worker/src/play.ts` (verify, grant, acknowledge, consume), `/billing`, `/redeem`, nightly refund sweep at 03:10 VN: **built and deployed** | read the source; `worker.yml` runs are green; `CONFIG.aiEndpoint` points at `nabu-ai.0211nhatanh.workers.dev` |
| The worker's `PLAY_SERVICE_ACCOUNT` and `FIREBASE_PROJECT_ID` are set | `POST /redeem` without a sign-in answers `signin`, not `not configured` |
| Service-account key on disk: `nabu-worker@nabutarot.iam.gserviceaccount.com`, in `C:\Users\angel\nabu-tarot-keys\` (outside the repo) | read the JSON header only |
| **Bundle 1** (2026-09-05, `nabu-tarot-keys\pkg\`): key alias `nabutarot`, fingerprint **B3:BF:80:B1...**, launch URL `angelale0211.github.io/nabu-tarot/`, a host that now answers **404** | unzipped the AAB, read `base/resources.pb`; curl on the old host |
| **Bundle 2** (2026-09-08 02:18, `Downloads\Nabu Tarot - Google Play package\`): key alias `my-key-alias`, fingerprint **B7:56:6A:FA...**, launch URL `nabutarot.com`; almost certainly the one in closed testing | same method; it is the only bundle that points at the live site |
| **Neither bundle contains `com.android.vending.BILLING`** or any billing class | grepped every file inside both AABs and the dex |
| The Play package has `DelegationService` and `TrustedWebActivityService` (the plumbing billing needs) but no `PlayBilling` classes | dex strings |
| `https://nabutarot.com/.well-known/assetlinks.json` is live, `application/json`, and lists **only B3:BF:80:B1**, the key of the bundle that points at the dead host | curl |
| PWABuilder's cloud builder still runs and takes `"features": {"playBilling": {"enabled": true}}` | `pwabuilder-cloudapk.azurewebsites.net` answers 200; option confirmed in the `pwabuilder-google-play` README |
| Inside the app, prices and bank-transfer text are already hidden (`isTWA()`); readings are not sold through Play | `learn.js`, `me.js` |
| `firestore.rules` v177 (only Nabu and the worker may write `access`) may not be republished yet | `HANDOVER.md` section 8 says so; cannot be checked from here |

---

## 2. Trust boundaries and what the hunt found

Attacker roles considered: a buyer with a debugger, a buyer who shares, a
buyer who refunds and keeps, a stranger posting to the worker, a rival app
spoofing the package, and a leaked key. What already holds: the phone is never
trusted (the worker asks Google about every token), a token cannot be forged,
`consumptionState` stops a token being used twice, access is written before
acknowledgement, the service account lives only in a Worker secret, and the
nightly sweep takes back refunded courses.

Findings that survived the adversarial pass:

| # | Severity | Finding | Fix |
|---|---|---|---|
| F1 | **P1, blocks everything** | No uploaded bundle declares BILLING, so Play refuses products and the Digital Goods API never exists inside the app | Build a billing-enabled bundle (Phase A) and upload it (Phase B) |
| F2 | **P1, silent** | `assetlinks.json` names the wrong key. The bundle in Play is signed with B7:56 (or, with Play App Signing on, with Google's own key). An unverified TWA shows a browser bar **and** `getDigitalGoodsService` throws, so `BILL.can()` stays false forever and nobody would know why | Put every relevant fingerprint in the array: the **App signing key** and the **Upload key** from Play Console > Setup > App integrity, plus B7:56 (Phase C). Verify with Google's Digital Asset Links checker, not by eye |
| F3 | P2, money | **Double submit.** `/billing` checks `consumptionState`, grants, then consumes in `waitUntil`. Two requests carrying the same token from two accounts inside that window both pass the check and both get the course: one payment, two grants. The ledger write is a PATCH (upsert) after the grant, so it does not stop it | Claim first: create `purchases/{sha256(token)}` with the Firestore precondition `currentDocument.exists=false` **before** `grant()`; a second caller fails the create and gets `402 already used`. Mark the doc `granted` after. About 30 lines in `refunds.ts` and `index.ts` (Phase D) |
| F4 | P2, verify | The client names the SKU. Google's `purchases.products.get` is believed to refuse a token presented under a different product id, which is what stops a 30k `wedding` token opening the 249k `pro`. Believed, not proven | Not a code change. It is test 18 in Phase E: swap the SKU on a real test token and require a refusal. If Google accepts it, add a `productId` comparison in `checkPurchase` |
| F5 | P2, process | Two signing keystores exist, one of them only in `Downloads`, passwords in plain text next to each. The wrong key makes Play reject the upload; a lost key ends the app | Copy the Downloads package into `nabu-tarot-keys\pkg-2026-09-08\`; back the whole folder up off this PC; never commit it |
| F6 | P2, revenue | Until the v177 rules are published, a signed-in person can still write their own `access` from a browser console. Play does not care; the money does | Owner republishes `firestore.rules` (2 minutes). Independent of Play |
| F7 | P3, policy | The eight products run out after 6 or 12 months and are bought again, so they must be **consumable** one-time products, not subscriptions; the app's copy already says "6 tháng / 12 tháng" | Choose the right type when creating them (Phase B) |

Left alone on purpose: `ACCESS.has()` reads localStorage, so somebody willing
to edit their own browser can switch a course on for themselves. Closing it
means the lessons not being in the downloaded page. Not worth a different app.
"Protected with Play" (Play Integrity) is optional hardening for later; it is
not a condition for selling.

---

## 3. The plan, in order

### Phase A: build the billing bundle (me, about 20 min)

1. **Decision gate, owner answers first:** in Play Console > Setup > App
   integrity, which SHA-256 is shown as the *Upload key certificate*?
   - starts `B7:56`: sign with the keystore in `Downloads\Nabu Tarot - Google Play package\` (alias `my-key-alias`)
   - starts `B3:BF`: sign with `nabu-tarot-keys\pkg\signing.keystore` (alias `nabutarot`)

   Also read the *App signing key certificate* SHA-256 (needed in Phase C) and
   the highest version code already uploaded (Test and release > any track).
2. POST to `pwabuilder-cloudapk.azurewebsites.net/generateAppPackage` with the
   settings of bundle 2 (host `nabutarot.com`, start URL `/index.html#/home`,
   manifest `https://nabutarot.com/manifest.webmanifest`), plus
   `features.playBilling.enabled = true`, `signingMode = "mine"` with that
   keystore, `appVersionCode` = highest uploaded + 1, `appVersion` bumped.
   Request kept in `nabu-tarot-keys\req-billing.json`; output in
   `nabu-tarot-keys\pkg-billing\`.
3. **Verify before anything is uploaded** (the dynamic-confirmation rule):
   unzip the AAB and require `com.android.vending.BILLING` in the manifest,
   billing classes in the dex, every URL inside it on `nabutarot.com`, and the
   fingerprint in the returned `assetlinks.json` equal to the key chosen in
   step 1. If any check fails, nothing leaves this PC.

### Phase B: Play Console (owner, about 25 min of clicks, then waiting)

4. Test and release > **Internal testing** > upload the new AAB > roll out.
   Internal testing needs no review. Processing takes minutes to an hour.
5. Monetise > Products > One-time products: the "Upload a new APK" notice
   goes away once step 4 has processed. Create the **eight products, consumable,
   IDs exactly** `tarot` `lenormand` `playing` `manifest` `plus` `pro6` `pro`
   `wedding`; prices in VND: 300k 300k 300k 75k 79k 149k 249k 30k. Activate each.
6. Setup > Payments profile, if not already complete (Play sells nothing without it).
7. Setup > **Licence testing**: add the tester Gmail addresses (test cards, no real money).
8. Setup > API access: confirm `nabu-worker@nabutarot.iam.gserviceaccount.com`
   is linked with *View financial data* and *Manage orders*. Without it the
   worker's purchase check answers 401/403 and every purchase is refused.
9. Republish `firestore.rules` (F6). Two minutes, independent of the rest.

### Phase C: asset links (me, about 10 min, needs step 1's fingerprints)

10. `.well-known/assetlinks.json` (and the `well-known/` copy) list the App
    signing key, the Upload key and B7:56. One commit, one push, no rebuild of
    `index.html` needed.
11. Verify live: curl the file, then ask Google's checker
    `digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://nabutarot.com&relation=delegate_permission/common.handle_all_urls`
    and require every fingerprint in the answer.

### Phase D: worker hardening (me, about 30 to 40 min, can run in parallel with B)

12. F3: claim-before-grant in `worker/src/refunds.ts` and `index.ts`; a refused
    second submit logs `refused: already used`. Typecheck and deploy through
    `worker.yml` (no Node here). Confirm `/billing` still answers `signin` when
    unsigned and `unknown product` for a bad SKU.

### Phase E: the test that counts (owner's phone, me watching logs, about 30 min)

13. Install from the internal-testing link. **No browser bar** means F2 is
    fixed. A bar means the fingerprints are wrong; stop here.
14. Course page shows Play's own price and a Buy button (`BILL.can()` true).
15. Buy with the test card. Course opens; `users/{uid}.access` shows the date;
    worker log says `granted`.
16. Buy again: offered again (consumed), date extends.
17. Replay: send the same token from a **second account** (I do it from the log).
    Answer must be `already used`. The same account sending it twice is
    expected to succeed and to open nothing twice.
18. F4: send a real token under a different SKU. Must be refused.
19. Refund from the Console. Next morning after 03:10 VN the course is gone
    from the account and `purchases/{id}` says `voided`.
20. Second phone, same account: course open there too.

### Phase F: report and release

21. Results written to `PLAN-PLAY-BILLING-FINDINGS.md` with each finding
    marked fixed, verified or open, the way `PLAN-LAYOUT-FINDINGS.md` was.
22. Promote the same bundle to closed testing. The 12 testers x 14 days rule
    still gates production and is unchanged by any of this.

---

## 4. Rollback

Every step degrades on its own: remove the products or the secret and the app
shows the code box; old bundle or the website and `BILL.can()` is false; the
assetlinks file can be reverted from git in one push.

## 5. Time

| Who | Active time | Notes |
|---|---|---|
| Me | about 1.5 hours | A 20 min, C 10 min, D 30 to 40 min, E and F 20 min |
| Owner | about 40 minutes | steps 1, 4 to 9 and the phone test |
| Elapsed | one working day | Play processes the upload in minutes to an hour; the first test purchase is possible the same day; the refund check lands the next morning |

## 6. Wait for the owner before executing

Step 1 (which key, which fingerprints, which version code) is the only thing
that has to come from the Console before a build can start. Everything in
Phase D can start without it.
