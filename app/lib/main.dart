import 'dart:io';

import 'package:app_links/app_links.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import 'bridge/app_plugin.dart';
import 'bridge/bridge.dart';
import 'bridge/firebase_authentication_plugin.dart';
import 'bridge/native_purchases_plugin.dart';
import 'bridge/notify_plugin.dart';
import 'bridge/play_billing_plugin.dart';
import 'bridge/plugin.dart';
import 'bridge/share_plugin.dart';
import 'push/adapters.dart';
import 'push/firebase_config.dart';
import 'push/push.dart';
import 'shell/app_page.dart';
import 'shell/web_shell.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Only the side-by-side check build (never a store build) can be inspected from a computer.
  if (const bool.fromEnvironment('NABU_CHECK')) await InAppWebViewController.setWebContentsDebuggingEnabled(true);
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  SystemChrome.setSystemUIOverlayStyle(barsFor(kGround));

  final shell = GlobalKey<WebShellState>();
  void open(String route) => shell.currentState?.go(route);

  // The phone's own sign-in and store, behind the site's existing calls;
  // its notifications, share sheet (Android's web view has none) and status bar.
  final auth = FirebaseAuthenticationPlugin(apple: SystemAppleSignIn(), google: SystemGoogleSignIn());
  final notify = NotifyPlugin(onOpen: open);
  final List<NativePlugin> plugins = Platform.isAndroid
      ? [auth, PlayBillingPlugin(GooglePlayStore()), notify, SharePlugin(), AppPlugin()]
      : [auth, NativePurchasesPlugin(ChannelStoreKit()), notify, AppPlugin()];
  try {
    await notify.init();
  } catch (_) {/* the app works without them */}
  final shim = Platform.isAndroid ? 'assets/android_bridge.js' : 'assets/bridge.js';

  // Notifications only when the build carried the Firebase settings.
  Push? push;
  final opts = firebaseOptions();
  if (opts != null) {
    try {
      await Firebase.initializeApp(options: opts);
      await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(alert: true, badge: true, sound: true);
      push = Push(FcmMessaging(), ShellSitePage(shell, opener: open));
      // On Android a push that arrives while the app is open shows nothing by
      // itself; the iPhone shows it (the presentation options above).
      if (Platform.isAndroid) {
        FirebaseMessaging.onMessage.listen((m) {
          final n = m.notification;
          if (n == null) return;
          final r = routeOf(m.data);
          notify.show(n.title ?? 'Nabu Tarot', n.body ?? '', hash: r == null ? '' : '#/$r').catchError((_) {});
        });
      }
      await push.start(auth.signedIn);
    } catch (_) {
      push = null; // the app works without them
    }
  }

  // nabutarot:// links (the iPhone widget): the first picks where the app
  // opens, later ones move it there.
  final links = AppLinks();
  Uri? first;
  try {
    first = await links.getInitialLink();
  } catch (_) {}
  links.uriLinkStream.listen((u) {
    final r = routeOfLink(u);
    if (r != null) open(r);
  });

  runApp(MaterialApp(
    title: 'Nabu Tarot',
    debugShowCheckedModeBanner: false,
    home: AppPage(
      bridge: Bridge(plugins, holdUntilListened: true),
      shell: shell,
      shimAsset: shim,
      initialRoute: first == null ? null : routeOfLink(first),
      onSiteLoaded: () => push?.pageLoaded(),
    ),
  ));
}
