# Play Billing: what was built, what was proved, what is left

2026-09-08. Companion to `PLAN-PLAY-BILLING-UNBLOCK.md`, written after
executing every phase of it that does not need the Play Console. Each claim
below was checked against the real artefact or the live service, not inferred.

---

## The one-line answer

The bundle that was blocking everything now exists. Two of them, in fact, one
per signing key, both carrying `com.android.vending.BILLING`, both pointing at
`nabutarot.com`. Play will let products be created as soon as one is uploaded.

---

## Done and verified

| # | What | Proof |
|---|---|---|
| F1 | **Billing-enabled bundles built.** `nabu-tarot-keys\pkg-billing-pkg\` (key `nabutarot`, B3:BF) and `nabu-tarot-keys\pkg-billing-pkg-2026-09-08\` (key `my-key-alias`, B7:56). Version code 2, version name 1.0.1 | unzipped both: `com.android.vending.BILLING` in the manifest, `PlayBilling` and `billingclient` in the dex, every URL inside on `nabutarot.com`, and the returned `assetlinks.json` fingerprint equal to the keystore used |
| F2 | **Closed.** Asset links now name the two keys Google signs releases with (`E0:A4` deployment, `51:B4` hybrid classical, read out of the certificate bundle downloaded from Play app signing) plus both upload keys (`B7:56` current, `B3:BF` old). Play App Signing is on, confirmed by "Releases signed by Play", so the deployment key was the missing piece | Google's Digital Asset Links service returns **four** verified keys for `app.nabutarot.twa` with no error; certificates kept in ``nabu-tarot-keys\play-certs\`` |
| ~~F2 (part)~~ | ~~Asset links name both upload keys.~~ `.well-known/assetlinks.json` and the `well-known/` copy | live on the domain, and Google's own Digital Asset Links service returns two verified statements for `app.nabutarot.twa` with no error |
| F3 | **Double-submit closed.** A purchase token is now claimed in `purchases/{sha256(token)}` with the condition that the document must not already exist, **before** any access is written. A second account sending the same token is refused with `already used`; the same account sending it again is let through, because a buyer whose phone lost the answer has still paid | `worker/src/refunds.ts` `claimPurchase` / `markGranted`, wired in `worker/src/index.ts`; typechecked and deployed by `worker.yml` (run on `019c9b0`, success); the live worker still answers `signin` unsigned |
| F5 | **Keystores backed up.** The Downloads package copied to `nabu-tarot-keys\pkg-2026-09-08\`; both build outputs sit beside it. Nothing key-shaped is in git | `.gitignore` unchanged, `git status` clean after each commit |
| — | **The downloadable app was broken.** `nabu-tarot.apk`, offered on the install screen, pointed at `angelale0211.github.io/nabu-tarot/`, which now answers 404. Replaced with the new build, signed with the same key so it upgrades in place | old APK: `github.io` inside, no billing; new APK: `nabutarot.com`, billing present, same signing key |

Two things were learnt building it, both of which would cost an hour to
rediscover:

- The package service wants the keystore as a **data URI**, not bare base64.
  Anything else is rejected as "must be a base64 encoded string".
- Play Billing forces **minSdkVersion 23**. Without it the build fails outright.
  Android 5 phones can no longer install the app. That is unavoidable, and it
  is a fraction of a percent of devices.

---

## Left, and why

| # | What | Who |
|---|---|---|
| **F8b** | **The service account is not linked to the app in Play Console.** With the interface now on, the same call answers `The caller does not have permission`. Until `nabu-worker@nabutarot.iam.gserviceaccount.com` is invited under Play Console > Users and permissions (or Setup > API access) with *View app information*, *View financial data* and *Manage orders*, the worker cannot check a purchase and every buyer gets `check failed` | owner |
| ~~F8~~ | ~~The Play Developer API is switched off in the Google Cloud project, and the worker cannot check a single purchase without it.** Asking it anything answers *"Google Play Android Developer API has not been used in project 609592701892 before or it is disabled"*. Every purchase would have come back `check failed`, after the buyer had paid. Found by calling the API with the worker's own service account. Enabled by the owner on 2026-09-08 and confirmed working. Superseded by F8b.~~ | done |
| F1 (upload) | Upload ``nabu-tarot-keys\pkg-billing-pkg-2026-09-08\Nabu Tarot.aab`` to internal testing. The Console names B7:56 as the upload key, so that is the matching bundle. Version code 2, and version code 1 is the only one taken | owner |
| — | The eight consumable products, payments profile, licence testers, API access for `nabu-worker@nabutarot.iam.gserviceaccount.com` | owner, plan Phase B |
| F6 | Republish `firestore.rules`. Until then a signed-in person can still write their own access from a browser console. Nothing to do with Play; it is the bigger revenue hole of the two | owner, 2 minutes |
| F4 | Whether Google refuses a token presented under a different product id is still believed, not proved. It needs one real test token | Phase E, test 18 |
| F7 | Products must be **consumable** one-time products | owner, when creating them |

The replay test in the plan (test 17) now reads differently and should be run
as: send the same token twice **from two different accounts**. The second must
be refused. The same account sending it twice is expected to succeed, and does
not open anything twice.

---

## Not fixed, on purpose

`ACCESS.has()` reads local storage, so somebody willing to edit their own
browser can switch a course on for themselves. Closing that means the lessons
not being in the downloaded page at all. It is a different app, and not worth
it while nobody is doing it.

## What could not be done from here, and why

The **App signing key fingerprint has no API**, so the owner had to fetch it.
The page has moved: Protected with Play > Play Store protection > Protect app
signing key > **Manage Play app signing**. Its *Download certificates* link
gives a zip of three DER certificates (deployment, hybrid classical, hybrid
post-quantum) and the fingerprints can be computed from those rather than
copied by hand. Done 2026-09-08.

One **previous app signing key** exists, from 7 Sep 2026, with a 0% install
base. It is deliberately not listed: nothing is installed with it.

Enabling the Play Developer API was attempted with the service account and
refused: `Permission denied to enable service`. Only a person with owner or
service-usage rights on the Cloud project can switch it on. **The owner did
so on 2026-09-08 and it is now Enabled**, confirmed by the error changing from
"has not been used in project" to "the caller does not have permission".

## Worth knowing

The package service logs the signing options it is sent, passwords included.
Those passwords were generated by that same service in the first place, so
nothing new left this PC, but it is a reason not to reuse them anywhere else.
