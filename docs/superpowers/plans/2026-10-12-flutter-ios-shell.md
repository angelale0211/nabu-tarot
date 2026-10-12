# Flutter iOS Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Nabu Tarot iPhone app as a Flutter shell around nabutarot.com, built and uploaded to TestFlight from Codemagic without a Mac, with native features a reviewer can see (push notifications, a home-screen widget), while `src/` stays unchanged.

**Architecture:** One full-screen `InAppWebView` loads `https://nabutarot.com/` with the user agent token `NabuTarotiOS`. A JavaScript shim injected at document start recreates the `window.Capacitor` surface the web layer already uses (`getPlatform`, `isPluginAvailable`, `registerPlugin`, `Plugins.NativePurchases`, `Plugins.FirebaseAuthentication`); every call becomes a `callHandler('nabu', {plugin, method, args})` round-trip into Dart, which dispatches to StoreKit 2 (Swift, via a MethodChannel), Sign in with Apple / Google Sign-In, and resolves the JS promise. Push, the widget and deep links are new native features; their server side is new code in the Cloudflare worker, not in `src/`.

**Tech Stack:** Flutter 3.47 stable (installed at `C:\Users\angel\develop\flutter`), `flutter_inappwebview`, `sign_in_with_apple`, `google_sign_in`, `firebase_core` + `firebase_messaging`, `home_widget`, Swift StoreKit 2 bridge, Codemagic (`codemagic.yaml`, Mac mini M2, App Store Connect key named `codemagic`), Cloudflare worker (TypeScript) for push registration and sending.

**Spec:** This plan is its own spec. The decisions below come from the owner's session of 2026-10-12 and from reading `src/core.js:674-690`, `src/backend.js:60-162`, `src/billing-apple.js`, `worker/src/apple.ts`, `worker/src/index.ts`.

## Why this and not something else

- **Google Play is not in this plan.** The TWA `app.nabutarot.twa` passed closed-testing review (HANDOVER.md §8). What gates launch is 12 testers opted in through the opt-in link, installed from the Play Store, for 14 continuous days. Play Console receives no in-app activity from any app; nothing in code can change that count. Owner checklist: Testing → Closed testing → Testers shows the opted-in number; each tester's Play account must be on the list; sideloaded `nabu-tarot.apk` installs do not count; the App signing SHA-256 still has to go into `.well-known/assetlinks.json` (HANDOVER §8 item 3).
- **App Store rejected the Capacitor shell under 4.3(b)** (saturated category, template-like). An appeal with the "Spiritual Lifestyle" area is pending. This plan does not try to look native; it adds things that are native, and writes the review note to match.
- **The Capacitor shell is reused as a contract, not as code.** Its project is only on the MacBook. Re-creating its two plugin surfaces in Flutter is a few hundred lines and keeps `src/` untouched; rebuilding the shell in Capacitor would need the MacBook, which the owner wants to avoid.

## Global Constraints

- `src/` is not modified by any task. Anything the shell needs from the site is read through the existing contract.
- Bundle identifier `app.nabutarot.ios`, display name `Nabu Tarot`, Flutter project folder `ios-app/` in this repository, Dart package name `nabu_tarot`.
- Branch `feature/ios-flutter` cut from `origin/main` in a worktree (`superpowers:using-git-worktrees`); never from `feature/web-checkout`.
- User agent must contain the token `NabuTarotiOS` (word-bounded) and otherwise look like Mobile Safari on iPhone, so the site's mobile CSS and `iosShell()` both fire.
- Shim contract (names are verbatim from `src/backend.js` and `src/billing-apple.js`; a task that implements one must satisfy the fields listed):
  - `FirebaseAuthentication.signInWithApple({skipNativeAuth:true})` → `{credential:{idToken, nonce, authorizationCode}}`
  - `FirebaseAuthentication.signInWithGoogle({skipNativeAuth:true})` → `{credential:{idToken, accessToken}}`
  - `FirebaseAuthentication.signOut()` → `{}`
  - A sheet the person closed rejects with an `Error` whose `message` matches `/cancel|error 1001/i` and has no `code` starting with `auth/`.
  - `NativePurchases.getProducts({productIdentifiers:[...]})` → `{products:[{identifier, priceString}]}`
  - `NativePurchases.purchaseProduct({productIdentifier, productType:'inapp'|'subs', quantity:1, appAccountToken, autoAcknowledgePurchases:false})` → `{transactionId:string, productIdentifier, appAccountToken}`; the transaction is left unfinished.
  - `NativePurchases.getPurchases()` → the array shape iterated at `src/billing-apple.js:238-246` (each row `{transactionId, productIdentifier, appAccountToken}`).
  - `NativePurchases.addListener('transactionUpdated', cb)` → `cb({transactionId, productIdentifier})` for every update from StoreKit's `Transaction.updates`.
  - Whatever further method `src/billing-apple.js` calls to finish a transaction after `settle()` succeeds (Task 4 Step 1 lists it) must be provided with the same name and effect.
- External links (`instagram.com`, `ig.me`, `facebook.com`, `mailto:`, `tel:`, bank/payment hosts, anything not `nabutarot.com`) open in Safari, never inside the WebView.
- Secrets never enter the repo: Firebase `GoogleService-Info.plist` and the APNs key are Codemagic environment variables (group `nabu_ios`), decoded at build time.
- Worker changes are additive (`worker/src/push.ts`, two routes, one cron step) and ship through the worker's existing deploy.

## Review Focus

1. **No network at cold start** → the shell shows its own offline page with a retry button, never a blank white WebView. (Task 1 test.)
2. **A `mailto:`, `instagram.com` or bank link tapped inside the site** → opens in Safari / Mail; the WebView stays on the site. (Task 1 test.)
3. **Sign-in sheet closed by the person** → the site shows its "cancelled" wording, not an error toast; no `auth/` code leaks through the shim. (Task 3 test.)
4. **Purchase completed but the worker is unreachable** → the transaction stays unfinished and is re-delivered on next launch via `transactionUpdated`; nothing is finished without the worker's answer. (Task 4 test and device check.)
5. **Push or widget tap while the app is closed** → the app opens on the right `#/route` after the site has loaded, not before. (Task 5 and Task 6 tests.)

---

### Task 1: Flutter shell, Codemagic build, first TestFlight upload

**Files:**
- Create: `ios-app/` (via `flutter create --org app.nabutarot --project-name nabu_tarot --platforms ios ios-app`)
- Create: `ios-app/lib/main.dart`, `ios-app/lib/shell/web_shell.dart`, `ios-app/lib/shell/offline_page.dart`, `ios-app/lib/shell/links.dart`
- Create: `ios-app/assets/offline.html`
- Create: `codemagic.yaml` (repository root)
- Modify: `.gitignore` (add `ios-app/ios/Pods/`, `ios-app/ios/Runner/GoogleService-Info.plist`)
- Test: `ios-app/test/links_test.dart`, `ios-app/test/web_shell_test.dart`

**Interfaces:**
- Produces: `const String kUserAgent` (contains `NabuTarotiOS`), `bool isExternal(Uri)` in `links.dart`, `class WebShell extends StatefulWidget` exposing `InAppWebViewController? controller` and `Future<void> go(String route)` (loads `https://nabutarot.com/#/<route>`).

- [ ] **Step 1: Write `links_test.dart`**

```dart
test('site stays inside, everything else goes out', () {
  expect(isExternal(Uri.parse('https://nabutarot.com/#/pick')), false);
  expect(isExternal(Uri.parse('https://www.nabutarot.com/terms.html')), false);
  expect(isExternal(Uri.parse('https://instagram.com/nabutarot')), true);
  expect(isExternal(Uri.parse('https://ig.me/m/nabutarot')), true);
  expect(isExternal(Uri.parse('mailto:x@y.z')), true);
  expect(isExternal(Uri.parse('https://nabutarot-com.firebaseapp.com/__/auth/handler')), false);
});
```

- [ ] **Step 2: Run it, expect FAIL "isExternal is not defined"**

Run: `cd ios-app && flutter test test/links_test.dart`

- [ ] **Step 3: Implement `bool isExternal(Uri u)` in `links.dart`**

Allowed hosts: `nabutarot.com`, `www.nabutarot.com`, `nabutarot-com.firebaseapp.com`, `*.firebaseapp.com`, `*.googleapis.com`, `accounts.google.com`, `appleid.apple.com`. Everything else, and any non-http(s) scheme, is external.

- [ ] **Step 4: Run it, expect PASS**

- [ ] **Step 5: Write `web_shell_test.dart`**

```dart
test('user agent carries the shell token', () {
  expect(RegExp(r'\bNabuTarotiOS\b').hasMatch(kUserAgent), true);
  expect(kUserAgent, contains('iPhone'));
  expect(kUserAgent, contains('Mobile/15E148 Safari'));
});
```

- [ ] **Step 6: Run it, expect FAIL; implement `kUserAgent` in `web_shell.dart`; run, expect PASS**

Value: `Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 NabuTarotiOS/1.0`.

- [ ] **Step 7: Implement `WebShell`**

`flutter_inappwebview` `InAppWebView` filling a `Scaffold` with `backgroundColor: Color(0xFFFBEEF2)` (the site's pink, same as the Android splash) and `SafeArea(top: false, bottom: false)` so the site's own `env(safe-area-inset-*)` padding works. Settings: `userAgent: kUserAgent`, `allowsBackForwardNavigationGestures: true`, `mediaPlaybackRequiresUserGesture: false`. `shouldOverrideUrlLoading` → `isExternal` ⇒ `url_launcher` `launchUrl(..., mode: externalApplication)` and `CANCEL`. `onReceivedError` on the main frame ⇒ `setState(offline = true)` and show `OfflinePage(onRetry: reload)`. `go(route)` evaluates `location.hash = '#/' + route` when loaded, else loads the full URL.

- [ ] **Step 8: Implement `OfflinePage`**

A Flutter widget (not HTML): the round badge from `icon-180.png` copied into `ios-app/assets/`, the sentence in the three languages picked by `Platform.localeName` (vi default): "Không có kết nối. Thử lại?" / "No connection. Try again?" / "Keine Verbindung. Noch einmal?", and one button.

- [ ] **Step 9: `main.dart`**

`runApp(const NabuApp())` → `MaterialApp(home: WebShell())`, status bar style dark-on-light, portrait only (`SystemChrome.setPreferredOrientations`).

- [ ] **Step 10: iOS project settings**

In `ios-app/ios/Runner/Info.plist`: `CFBundleDisplayName` = `Nabu Tarot`, `UIViewControllerBasedStatusBarAppearance` = true, `LSApplicationQueriesSchemes` = `[instagram, mailto, tel]`, `ITSAppUsesNonExemptEncryption` = false. Bundle id `app.nabutarot.ios` in `project.pbxproj` (all three configurations). App icon: run `python make_icons.py` with `NABU_IOS=ios-app/ios` and copy `icon-1024.png` into the asset catalog as the single 1024 icon. Launch screen: pink background, badge centred (the storyboard `make_icons.py` already writes).

- [ ] **Step 11: `codemagic.yaml`**

```yaml
workflows:
  ios-testflight:
    name: iOS TestFlight
    instance_type: mac_mini_m2
    max_build_duration: 60
    working_directory: ios-app
    integrations:
      app_store_connect: codemagic
    environment:
      flutter: 3.47.7
      xcode: latest
      groups: [nabu_ios]
      ios_signing:
        distribution_type: app_store
        bundle_identifier: app.nabutarot.ios
    triggering:
      events: [push]
      branch_patterns:
        - pattern: feature/ios-flutter
        - pattern: main
    scripts:
      - name: Firebase config
        script: echo "$GOOGLE_SERVICE_INFO_PLIST" | base64 --decode > ios/Runner/GoogleService-Info.plist
      - flutter pub get
      - flutter test
      - xcode-project use-profiles
      - flutter build ipa --release --export-options-plist=/Users/builder/export_options.plist --build-number=$BUILD_NUMBER
    artifacts: [build/ios/ipa/*.ipa]
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

`GOOGLE_SERVICE_INFO_PLIST` is added to Codemagic group `nabu_ios` by the owner (base64 of the plist downloaded from Firebase console → project settings → iOS app `app.nabutarot.ios`). Until it exists, the Firebase config step writes an empty file and Task 6 is the first task that needs the real one.

- [ ] **Step 12: Verify locally what Windows can verify**

Run: `cd ios-app && flutter analyze && flutter test`
Expected: `No issues found!` and all tests pass.

- [ ] **Step 13: Commit and push; wait for the Codemagic build**

```bash
git add ios-app codemagic.yaml .gitignore
git commit -m "iOS: Flutter shell around nabutarot.com, built on Codemagic"
git push -u origin feature/ios-flutter
```
Expected: Codemagic build green, a build appears in App Store Connect → TestFlight. The owner installs it on an iPhone through the TestFlight app: the site opens, Instagram links leave the app, airplane mode shows the offline page.

---

### Task 2: Capacitor-compatible bridge shim

**Files:**
- Create: `ios-app/assets/bridge.js`, `ios-app/lib/bridge/bridge.dart`, `ios-app/lib/bridge/plugin.dart`
- Modify: `ios-app/lib/shell/web_shell.dart` (inject shim, register handler)
- Test: `ios-app/test/bridge_test.dart`, `ios-app/test/bridge_js_test.dart`

**Interfaces:**
- Produces: `abstract class NativePlugin { String get name; Future<Object?> call(String method, Map<String, Object?> args); Stream<(String event, Object? data)> get events; }`, `class Bridge { Bridge(List<NativePlugin>); Future<Map<String,Object?>> handle(Map<String,Object?> msg); }` where `msg = {plugin, method, args}` and the result is `{ok:true, value}` or `{ok:false, message}`.
- Produces in JS: `window.Capacitor` with `getPlatform() === 'ios'`, `isPluginAvailable(name)`, `registerPlugin(name)` and `Plugins.<name>` objects whose every method returns a Promise; `addListener(event, cb)` is served by Dart calling `window.__nabuEmit(plugin, event, data)`.

- [ ] **Step 1: Write `bridge_test.dart`**

```dart
test('routes to the named plugin and wraps the answer', () async {
  final b = Bridge([FakePlugin('Echo', (m, a) async => {'m': m, ...a})]);
  expect(await b.handle({'plugin':'Echo','method':'ping','args':{'x':1}}), {'ok':true,'value':{'m':'ping','x':1}});
});
test('an unknown plugin or a throwing method becomes ok:false with the message', () async {
  final b = Bridge([FakePlugin('Echo', (m, a) async => throw Exception('error 1001'))]);
  expect((await b.handle({'plugin':'Nope','method':'x','args':{}}))['ok'], false);
  expect((await b.handle({'plugin':'Echo','method':'x','args':{}}))['message'], contains('error 1001'));
});
```

- [ ] **Step 2: Run, expect FAIL; implement `Bridge` and `NativePlugin`; run, expect PASS**

- [ ] **Step 3: Write `bridge_js_test.dart`** (Dart test that loads `assets/bridge.js` as a string and checks the shape without a browser)

```dart
test('shim declares the two plugins and the platform', () {
  final js = File('assets/bridge.js').readAsStringSync();
  expect(js, contains("getPlatform:function(){return 'ios'}"));
  for (final n in ['NativePurchases','FirebaseAuthentication']) expect(js, contains("'$n'"));
  expect(js, contains('window.__nabuEmit'));
});
```

- [ ] **Step 4: Write `bridge.js`**

Builds `window.Capacitor` from a list `['NativePurchases','FirebaseAuthentication']`. Each plugin is a `Proxy` whose property `method` returns `(args) => window.flutter_inappwebview.callHandler('nabu', {plugin, method, args: args || {}}).then(r => r.ok ? r.value : Promise.reject(Object.assign(new Error(r.message), r.code ? {code: r.code} : {})))`; `addListener(event, cb)` stores `cb` in `listeners[plugin][event]` and returns `{remove(){}}`; `window.__nabuEmit(plugin, event, data)` calls them. Also define `window.Capacitor.getPlatform`, `isPluginAvailable`, `registerPlugin` (returns `Plugins[name]`). Must be injected at **document start** (`UserScript` with `injectionTime: AT_DOCUMENT_START`) because `src/core.js` tests `window.Capacitor` while the page's single script runs.

- [ ] **Step 5: Wire into `WebShell`**

`initialUserScripts: [UserScript(source: bridgeJs, injectionTime: AT_DOCUMENT_START)]`; `onWebViewCreated` → `controller.addJavaScriptHandler(handlerName: 'nabu', callback: (a) => bridge.handle(a.first))`; subscribe every plugin's `events` and forward with `controller.evaluateJavascript(source: "window.__nabuEmit(${jsonEncode(plugin)},${jsonEncode(event)},${jsonEncode(data)})")`.

- [ ] **Step 6: Run `flutter analyze && flutter test`, expect clean; commit**

```bash
git commit -am "iOS: Capacitor-compatible bridge between the site and Dart"
```

---

### Task 3: Sign in with Apple and Google through the bridge

**Files:**
- Create: `ios-app/lib/bridge/firebase_authentication_plugin.dart`
- Modify: `ios-app/lib/main.dart` (register plugin), `ios-app/ios/Runner/Runner.entitlements` (`com.apple.developer.applesignin`), `ios-app/ios/Runner/Info.plist` (Google reversed client id URL scheme, `GIDClientID`)
- Test: `ios-app/test/firebase_authentication_plugin_test.dart`

**Interfaces:**
- Consumes: `NativePlugin` from Task 2.
- Produces: `class FirebaseAuthenticationPlugin implements NativePlugin` with `name = 'FirebaseAuthentication'`; constructor takes `AppleSignIn apple` and `GoogleSignInLike google` (two tiny interfaces around `sign_in_with_apple` and `google_sign_in`, so tests can fake them). Also `Stream<bool> get signedIn`: `true` after a successful `signInWithApple`/`signInWithGoogle`, `false` after `signOut` (Task 5 listens to it).

- [ ] **Step 1: Write the test**

```dart
test('apple answer carries idToken, nonce and authorizationCode', () async {
  final p = FirebaseAuthenticationPlugin(apple: FakeApple(idToken:'t', code:'c'), google: FakeGoogle());
  final r = await p.call('signInWithApple', {'skipNativeAuth': true}) as Map;
  expect(r['credential']['idToken'], 't');
  expect(r['credential']['authorizationCode'], 'c');
  expect((r['credential']['nonce'] as String).length, greaterThanOrEqualTo(32));
});
test('google answer carries idToken and accessToken', () async { /* same shape */ });
test('a closed sheet is reported in the words the site expects', () async {
  final p = FirebaseAuthenticationPlugin(apple: FakeApple(cancel: true), google: FakeGoogle());
  await expectLater(p.call('signInWithApple', {}), throwsA(predicate((e) => RegExp(r'cancel|error 1001', caseSensitive: false).hasMatch('$e'))));
});
```

- [ ] **Step 2: Run, expect FAIL; implement; run, expect PASS**

`signInWithApple`: generate a 32-byte random raw nonce, pass its SHA-256 to `SignInWithApple.getAppleIDCredential(scopes: [email, fullName], nonce: sha)`, return `{credential: {idToken, nonce: raw, authorizationCode}}`. `SignInWithAppleAuthorizationException` with `code == canceled` ⇒ throw `Exception('The user canceled the sign-in flow (error 1001)')`. `signInWithGoogle`: `GoogleSignIn.signIn()` null ⇒ same cancel exception; else `{credential: {idToken, accessToken}}` from `authentication`. `signOut`: both providers, return `{}`.

- [ ] **Step 3: Owner-side configuration (listed so the build does not fail silently)**

Apple Developer → Identifiers → `app.nabutarot.ios` → Sign in with Apple enabled (it already is for the Capacitor shell). Firebase console → Authentication → Apple and Google providers are already on (the site uses them). Google iOS client id: Firebase project settings → iOS app → `GoogleService-Info.plist` `CLIENT_ID` / `REVERSED_CLIENT_ID` → `GIDClientID` and the URL scheme in `Info.plist`; because the plist is a build-time secret, read both values at build time with `/usr/libexec/PlistBuddy` in a `codemagic.yaml` script step and write them into `Info.plist`.

- [ ] **Step 4: `flutter analyze && flutter test`, commit, push, TestFlight check**

On the device: Profile → sign in with Apple → the native sheet appears → the site shows the signed-in profile. Cancel the sheet → the site's "cancelled" wording, no red toast.

---

### Task 4: StoreKit 2 purchases through the bridge

**Files:**
- Create: `ios-app/ios/Runner/StoreKitBridge.swift` (MethodChannel `nabu/purchases`, StoreKit 2, iOS 15+)
- Create: `ios-app/lib/bridge/native_purchases_plugin.dart`
- Modify: `ios-app/ios/Runner/AppDelegate.swift` (register channel), `ios-app/lib/main.dart`, `Runner.entitlements` (In-App Purchase)
- Test: `ios-app/test/native_purchases_plugin_test.dart`

**Interfaces:**
- Consumes: `NativePlugin`.
- Produces: `class NativePurchasesPlugin implements NativePlugin` with `name = 'NativePurchases'`, backed by `abstract class StoreKit { Future<List<Map>> products(List<String> ids); Future<Map> purchase(String id, String appAccountToken); Future<List<Map>> currentTransactions(); Future<void> finish(String transactionId); Stream<Map> get updates; }` so tests fake the channel.
- Swift channel methods: `products(ids:[String])` → `[{identifier, priceString, displayName}]`; `purchase(id:String, token:String)` → `{transactionId:String, productIdentifier, appAccountToken}`, **not finished**; `current()` → `Transaction.currentEntitlements` + `Transaction.unfinished` as the same rows; `finish(transactionId)`; an `EventChannel nabu/purchases/updates` fed by `Transaction.updates`.

- [ ] **Step 1: List the full contract**

Read `src/billing-apple.js` in full and write down, in this task's notes, every `P.<method>(` and every field read from its answers (known so far: `getProducts`, `purchaseProduct`, `getPurchases`, `addListener('transactionUpdated')`, fields `identifier`, `priceString`, `transactionId`, `productIdentifier`, `appAccountToken`). Add any finishing method it calls after `settle()` to the Dart plugin and the Swift channel with the same name.

- [ ] **Step 2: Write the Dart tests**

```dart
test('getProducts maps to {products:[{identifier, priceString}]}', ...);
test('purchaseProduct passes appAccountToken through and returns the transaction unfinished', () async {
  final sk = FakeStoreKit(); final p = NativePurchasesPlugin(sk);
  final r = await p.call('purchaseProduct', {'productIdentifier':'tarot','productType':'inapp','quantity':1,'appAccountToken':'11111111-2222-5333-8444-555555555555','autoAcknowledgePurchases':false}) as Map;
  expect(r['transactionId'], isA<String>());
  expect(sk.finished, isEmpty);
});
test('a StoreKit update is emitted as transactionUpdated', () async { /* sk.updates.add({...}); expect events stream to yield ('transactionUpdated', {...}) */ });
test('getPurchases returns rows with transactionId, productIdentifier, appAccountToken', ...);
```

- [ ] **Step 3: Run, expect FAIL; implement the Dart plugin; run, expect PASS**

- [ ] **Step 4: Write `StoreKitBridge.swift`**

`Product.products(for:)`; `product.purchase(options: [.appAccountToken(UUID(uuidString: token)!)])`; on `.success(.verified(tx))` answer the row and do **not** call `tx.finish()`; `.userCancelled` ⇒ `FlutterError(code: "cancelled", message: "The user cancelled (error 1001)")`; `.pending` ⇒ `FlutterError(code: "pending")`. `Transaction.updates` task started at app launch, each verified transaction sent to the event sink. `transactionId` is `String(tx.id)`.

- [ ] **Step 5: `flutter analyze && flutter test`; commit; push; TestFlight check with a sandbox tester**

On the device, signed in: Learn → Tarot course → Buy → the StoreKit sheet with the App Store price (products must be live in App Store Connect; they are, from the Capacitor submission). After buying, the course opens; force-quit and relaunch → no second grant, no stuck sheet. Airplane mode after the sheet closes → the course does not open; back online, relaunch → it opens (the unfinished transaction is re-delivered).

---

### Task 5: Push notifications (register, send from the worker)

**Files:**
- Create: `ios-app/lib/push/push.dart`, `worker/src/push.ts`
- Modify: `ios-app/lib/main.dart` (`Firebase.initializeApp`, `Push.start(bridge)`), `ios-app/ios/Runner/Runner.entitlements` (`aps-environment`), `Info.plist` (`UIBackgroundModes: [remote-notification]`), `worker/src/index.ts` (two routes, cron step), `worker/wrangler.toml` (nothing new: reuses `PLAY_SERVICE_ACCOUNT`, needs scope `https://www.googleapis.com/auth/firebase.messaging`)
- Test: `worker/test/push.test.ts` (same runner as the worker's existing tests), `ios-app/test/push_test.dart`

**Interfaces:**
- Worker route `POST /push-register` (Firebase ID token in `Authorization` like the other signed-in routes): body `{token, lang, platform:'ios'}` → stored at Firestore `pushtokens/{uid}` as `{tokens:{[token]:{lang, platform, at}}}`; `POST /push-unregister` `{token}`.
- `sendPush(env, uid, {title, body, route})` in `push.ts`: FCM HTTP v1 `projects/{FIREBASE_PROJECT_ID}/messages:send` with `apns.payload.aps.sound = default` and `data.route`; a token FCM reports `UNREGISTERED` is deleted.
- Senders: `bookings.ts` when Nabu confirms a booking (`route: 'me/bookings'`), the inbox reply path when Nabu answers a thread (`route: 'me/inbox'`), and the daily cron at 07:00 Asia/Ho_Chi_Minh with the lunar date line and `route: 'pick'` (title/body in the token's `lang`, three fixed strings in `push.ts`).
- Dart: `Push.start(Bridge)` asks permission after the site has loaded and the person is signed in (observed through the shim: the site calls `FirebaseAuthentication` only when signed in, so the plugin exposes `Stream<bool> signedIn`); on token ⇒ `POST /push-register` with the ID token obtained by evaluating `BE.token()` in the WebView; a tapped notification ⇒ `WebShell.go(data.route)` once `onLoadStop` has fired.

- [ ] **Step 1: Worker test**

```ts
test('register stores the token under the uid and unregister removes it', ...);
test('sendPush drops a token FCM reports UNREGISTERED', ...);  // fetch stubbed
```

- [ ] **Step 2: Run, expect FAIL; implement `push.ts` and the routes; run, expect PASS**

- [ ] **Step 3: Dart test**

```dart
test('a notification tapped before the site has loaded is delivered after onLoadStop', ...);
```

- [ ] **Step 4: Implement `push.dart`; `flutter analyze && flutter test`; commit**

- [ ] **Step 5: Owner-side**

Apple Developer → Keys → APNs key (.p8) → Firebase console → Cloud Messaging → upload for `app.nabutarot.ios`. Add Push Notifications capability to the App ID. Redeploy the worker. TestFlight check: sign in → permission sheet → confirm a booking from `#/admin` on another device → the iPhone gets the notification → tap → the app opens on Bookings.

---

### Task 6: Home-screen widget "Today"

**Files:**
- Create: `ios-app/lib/lunar/lunar.dart` (port of the date functions in `src/lunar.js` that the home screen uses: Gregorian → Vietnamese lunar day/month/year, can-chi year, moon phase), `ios-app/lib/widget/today_widget.dart`, `ios-app/ios/TodayWidget/` (WidgetKit extension in Swift, small and medium sizes)
- Modify: `ios-app/lib/main.dart` (refresh widget data on launch and on `onLoadStop`), `codemagic.yaml` (nothing: extension builds with the app; its bundle id `app.nabutarot.ios.today` must exist in the dev portal, Codemagic creates its profile)
- Test: `ios-app/test/lunar_test.dart` with a 24-row table generated once from `src/lunar.js` via `node -e` (file `ios-app/test/lunar_table.json`, committed)

**Interfaces:**
- Produces: `LunarDate lunarOf(DateTime d)` with `day, month, year, leap, canChi, moonPhaseName(lang)`; `Future<void> TodayWidget.refresh(lang)` writes `{gregorian, lunar, moon, cta}` via `home_widget` for the Swift view; widget tap ⇒ deep link `nabutarot://pick`, handled in `main.dart` through `home_widget`'s launch URI ⇒ `WebShell.go('pick')` after load.

- [ ] **Step 1: Generate the table**

Run from the repo root: `node -e "..."` evaluating `src/lunar.js` for 24 dates (Tết 2025/2026/2027, leap-month dates, 1 Jan, today) and writing `ios-app/test/lunar_table.json`.

- [ ] **Step 2: Write `lunar_test.dart`** asserting every row; run, expect FAIL; port; run, expect PASS

- [ ] **Step 3: Swift widget view**

Pink ground, the badge, two lines (Gregorian / lunar + moon), one caption `cta` ("Rút bài hôm nay" / "Draw today's card" / "Heute eine Karte ziehen"). Timeline: refresh at midnight local.

- [ ] **Step 4: `flutter analyze && flutter test`; commit; TestFlight check**

Add the widget on the home screen → correct lunar date (compare with the app's home screen) → tap → the app opens on Draw.

---

### Task 7: App Store submission against 4.3(b)

**Files:**
- Create: `docs/app-store/review-notes-2026.md` (the review note), `docs/app-store/screenshots/` (6.7" and 6.1" sets taken on the TestFlight build: Home with widget mention, Draw, a course lesson, Booking with Nabu, Profile with Apple sign-in, the notification)
- Modify: `ios-app/pubspec.yaml` version `1.1.0+<build>`

- [ ] **Step 1: Review note**

Facts only, in this order: what Nabu Tarot is (one Vietnamese reader's own readings, bookings with her, courses she wrote, Vietnamese lunar calendar), what is native in this build (Sign in with Apple, StoreKit purchases, push notifications, home-screen widget, offline page), the demo account (`reviewer@nabutarot.com`, password in App Store Connect only), and how to reach the Spiritual Lifestyle area. No claims about technology the app does not use.

- [ ] **Step 2: Submit from App Store Connect** (owner): select the TestFlight build, paste the note, answer the IAP and sign-in questions, submit. If the pending appeal has been answered in the meantime, reply on that thread with the new build number instead of opening a new submission.

---

## Phase 0, outside this plan: Google Play testers (owner, no code)

1. Play Console → Testing → Closed testing → Testers: read the opted-in count.
2. Each of the 12: their Play account on the list → opt-in link → "Become a tester" → **Install from the Play Store** (not the APK) → keep installed.
3. Day 15 after the count reaches 12: "Apply for production access" appears; answer the questionnaire.
4. Paste the App signing SHA-256 (Setup → App integrity) into `.well-known/assetlinks.json`, build, push (HANDOVER §8 item 3), so the installed app can show the Buy button.
