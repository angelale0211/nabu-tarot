# Three testers say buying does not work — what is known, and how to find out

Written 2026-09-09 after Play Billing was proved working end to end on the
owner's emulator, and three testers then reported it failing. This is a
diagnostic brief, not a fix. Read section 1 before touching anything: two of
the four causes found today were invisible from the source, and the tools in
section 4 are what made them visible.

---

## 0. What the site is doing right now (verified, not assumed)

    permissions-policy: geolocation=(), camera=(), payment=(self)   ← correct
    live page          APP_VERSION = 'v209'
    live sw.js         nabu-tarot-v209                              ← markers agree
    POST /billing      {"error":"signin"} HTTP 401                  ← worker alive, auth first

**The website and the worker are healthy.** Do not start by looking at them.
Whatever the testers are hitting is on their device or in their Play account.

---

## 1. The two symptoms mean different things. Get which one from each tester.

### "Không nhận được phản hồi từ Google Play" / "no response from Google Play"

This is `S.stNotReady`, rendered by `storeNotReadyHTML()` in `src/store.js`.
It appears when **`BILL.can()` is false**, which means `BILL.service` is null
(`src/billing.js`). There are exactly three ways that happens, all inside
`BILL.start()`:

1. `window.getDigitalGoodsService` does not exist
2. `getDigitalGoodsService()` threw
3. `getDetails()` threw

Note what it is NOT: if `getDetails()` returns an **empty list**, nothing
throws, `service` stays set, `can()` is true, and the store renders rows with
no prices. A different screen. So this message always means the API was
unreachable, never "the products are misconfigured".

### "Nothing happens when I press buy"

Different path entirely. The store rendered, so `BILL.can()` was true. Look at
the click handler in `bindStore()` (`src/store.js`). Ask the tester whether
Google's payment sheet appeared:

- **Sheet did not appear** — `BILL.buy()` threw before `PaymentRequest`.
  Likely `noproduct` (that sku missing from `BILL.details`) or `signin`.
- **Sheet appeared, then an error** — read the message. `stFailed` is the
  catch-all and hides the real reason; `offline` now shows the pending
  wording instead (v203), because it means Play HAS charged.

---

## 2. Ranked causes for these three reports

### (a) RULED OUT — it is NOT an old build

**Checked and disproved 2026-09-09.** A tester's App info screen reads
`Version: 1.0.1`, which is versionCode **2** — the build that carries
`com.android.vending.BILLING` and `PaymentActivity`. (versionCode 1 is version
name `1.0.0.0`.)

So the testers already have the right app, and telling them to update does
nothing. This was my leading theory and it was wrong; it is left here only so
nobody spends time on it again. Go to (b), (c) and (d).

The reasoning that made it attractive is still worth keeping, though, because
it is true and will matter at the next wrapper release: promoting a track does
NOT update apps already installed, and closed-testing apps cannot be found by
Play Store search — only through
`https://play.google.com/apps/testing/app.nabutarot.twa`.

### (a-old) The original theory, kept for its checks — the tester runs versionCode 1

**Three identical reports is evidence FOR this, not against it.** All three
testers got the app from the same track on the same day, so they all have the
same build. One cause, three people, one symptom.

Read from the Play Developer API today:

    alpha       completed   versionCodes=["2"]   ← only since this afternoon
    internal    completed   versionCodes=["2"]

Alpha served **versionCode 1** from 2026-09-08 until it was promoted this
afternoon. The owner's own emulator was never affected because it installs
from **internal** testing, which has had versionCode 2 all along. That is the
whole difference between "it works for me" and "it fails for all three of
them".

versionCode 1 has **no Play Billing in the wrapper at all**: no
`com.android.vending.BILLING` permission, no `PaymentActivity`. Inside it
`window.getDigitalGoodsService` simply does not exist, and the app can only
say "no response from Google Play". This matches the symptom exactly.

Closed testing – Alpha was on versionCode 1 until it was promoted to 2 earlier
today. **A tester who installed before that, and has not updated, is still on
1.** Play does not force an update.

**CONFIRMED 2026-09-09.** A tester reported versionCode **1**. The owner had
already promoted alpha to versionCode 2 — both facts are true at once, because
**promoting a track does not update apps that are already installed.** Play
offers the update; it does not force it. Every tester who installed before this
afternoon is still on a build with no billing in it until they tap Update.

No code change is needed for this. The testers need to update.

**Check:** ask each tester to open the Play listing and look for an Update
button. Or, with the phone on USB:

    adb shell dumpsys package app.nabutarot.twa | grep -E "versionCode|vending.BILLING"

versionCode must be 2 and `com.android.vending.BILLING: granted=true` must be
present.

### (b) The tester is not in the licence-testing list

Licence testing is **account level**: Play Console → Settings → Licence
testing, not inside the app. A tester on the track but not on that list can
install and browse but their purchases behave as real money, and test cards do
not appear. Confirm all twelve are listed, not just the ones on the track.

### (c) A stale service worker on that phone

`sw.js` is network-first for navigations, so an online phone gets the fresh
page. A phone that was offline, or one whose service worker never updated, can
still be serving a cached page from before `payment=(self)` was fixed — and
that page's header blocks the Digital Goods API. **Check:** ask them to force
close the app and reopen it with a good connection, or clear the app's storage.

### (d) Not the installed app at all

Play Billing exists only inside the installed TWA. A tester who opened
nabutarot.com in Chrome instead of opening the app gets this message and is
right to. Confirm they tapped the Nabu icon on the home screen.

---

## 3. What was already fixed today. Do not re-chase these.

| | |
|---|---|
| `_headers` had `payment=()`, which blocked the Digital Goods API for everybody | fixed, `payment=(self)`, live |
| CI deploy step `exit 0` — green runs that deployed nothing for two days | fixed, fails loudly now |
| wrangler needed Node 22, CI pinned Node 20, so the worker never deployed | fixed, `node-version: '22'` |
| `PLAY_SERVICE_ACCOUNT` present but unusable, so every purchase answered `check failed` | fixed, secret rotated |
| `offline` reported to the buyer as "purchase not successful" when Play HAD charged | fixed in v203 |

All four of the first group were invisible in the source. Three of them
reported success while doing nothing.

---

## 4. The toolkit that actually found these

Reading the code did not find any of the four. These did. Everything here is
read-only except where noted.

**Talk to the running app** (emulator or USB phone, developer options on):

    ADB=~/AppData/Local/Android/Sdk/platform-tools/adb.exe
    $ADB forward tcp:9222 localabstract:chrome_devtools_remote
    curl -s http://localhost:9222/json          # find the nabutarot page target

Then over the DevTools websocket, `Runtime.evaluate` these. This is the single
most useful thing in this document:

    typeof window.getDigitalGoodsService        // "undefined" = cause (a) or (d)
    BILL.ready + ' ' + BILL.can()
    await window.getDigitalGoodsService('https://play.google.com/billing')
      // throws NotAllowedError "Payment permissions policy not granted" = cause (c)
    BILL.pendingList().length                   // paid but unverified tokens
    (await BILL.service.listPurchases()).map(p => p.itemId)   // what Play says they own

**Ask the live worker which products it knows**, with a real ID token from the
page and a dummy purchase token. `unknown product` means the worker is stale;
`play 400` means it reached Google, which is correct for a dummy token.

**Ask Google directly**, as the worker does, using the service account at
`nabu-tarot-keys/nabutarot-34a47cfd88b7.json` and scope
`https://www.googleapis.com/auth/androidpublisher`:

    GET /androidpublisher/v3/applications/app.nabutarot.twa/purchases/subscriptionsv2/tokens/{token}

**Read the worker's own logs.** Observability → Logs is now ON for the
`nabu-ai` worker and declared in `worker/wrangler.toml`, so a refused purchase
records its real exception instead of only the generic `check failed` the
phone sees.

---

## 5. Two hazards in the working tree right now

**Version markers disagree.** `sw.js` says `nabu-tarot-v210` while
`src/main.js` and `index.html` say `v209`. Committing that ships a service
worker that never matches its page, which pins phones to a stale version
silently. Reconcile before any build.

**Two stashes hold uncommitted work from more than one session:**

    stash@{0}  src/backend.js  src/book.js  src/main.js  src/store.js  src/strings.js
    stash@{1}  src/billing.js

`stash@{0}` contains, among other things, an unfinished fix making
`BE.takenSlots()` return `null` rather than `{}` when the calendar cannot be
read — without it every booking hour shows as free on a slow connection.
Restore deliberately; do not assume either stash is disposable.

---

## 6. What is not a bug

Play returns **EUR for the four one-time products and VND for the four
subscriptions** to the same Vietnamese account. `BILL.priceOf()` displays
`price.currency` exactly as Play sends it, which is the only safe thing it can
do — the displayed price must match what is charged. The emulator this was
seen on reports SIM country **us** while the account's billing country is
**VN**, so it is not a trustworthy place to judge regional pricing. Confirm on
a real Vietnamese phone before treating it as a fault, and if it persists it is
a Play Console price-table matter, not an app one.
