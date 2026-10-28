# Ending Google Play test-purchase access

This release refuses **all Google-identified test purchases**, including new ones.
It does not block people merely because they installed a testing-track build.
Real purchases, Google promotional purchases, Apple purchases and separately
recorded code/admin grants remain eligible for access.

Google is the authority: `purchaseType: 0` for products, or a `testPurchase`
object for subscriptions. Client flags, email addresses and API errors are never
used to classify a purchase. An old test subscription cannot replace a newer
paid subscription for the same product.

## Rollout

1. In the signed-in Play Console, remove former testers from **License testing**
   and, if their build access should end, from the relevant testing track's
   tester list/Google Group. These are separate settings. Neither clears the
   application's existing Firebase grants by itself.
2. With the existing worker service-account secret supplied through the environment,
   run `npm run audit:play-tests` from `worker/`. Supply `PLAY_SERVICE_ACCOUNT`,
   `FIREBASE_PROJECT_ID`, and optionally `ANDROID_PACKAGE`. Do not paste secrets
   into source, shell arguments or support messages. This command defaults to a
   read-only audit and prints counts without account IDs or purchase tokens.
3. Review the counts. `complete` means the ledger scan finished; `failed` means
   some entries could not be checked/cleaned. A failed or incomplete run exits
   nonzero. Resolve those entries before claiming every old grant is gone.
4. Deploy the tested worker and web release. The worker's six-hour job applies
   the cleanup automatically; `npm run audit:play-tests -- --apply` can apply it
   immediately using the same credentials. Deployment enables both rejection of
   new test purchases and scheduled cleanup of existing test purchases.
5. Refresh/relaunch the Android app and verify an old test-only account sees the
   lock, while a genuine paying account retains access. Check `play-test-access`
   job logs. A restored test token is rejected without purchase retries and the
   client refreshes its account profile.

Consumed test courses are found in the server purchase ledger, even when Google
no longer lists them in Restore Purchases. Cleanup records its classification
before removing access and marks completion only after successful writes. It
preserves other recorded purchase sources and unrelated content; it neither
refunds charges nor deletes user accounts. A truncated purchase-history query
fails safely instead of assuming there are no surviving purchases.

## Limits requiring account review

- Free codes, manual unlocks and administrator access are not Google test purchases.
  Identify those specific grants before revoking them; some codes represent real
  bank-transfer purchases. This change intentionally does not erase them.
- Missing ledger tokens, expired/unavailable Google evidence, or legacy grants
  whose origin was never recorded cannot be conclusively classified by this audit.
  Preservation of manual purchases depends on their existing `granted` record.
- The audit scans up to 10,000 ledger rows per run. An incomplete result needs
  investigation; it must not be treated as successful cleanup.
- Already downloaded content and offline client caches cannot be remotely erased.
  Current lesson content ships in the client bundle; these changes enforce the
  app's entitlement gates, not confidential server-side content delivery.

Google references:
- https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.products
- https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2
- https://developer.android.com/google/play/billing/test
