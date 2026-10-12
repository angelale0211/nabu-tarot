import 'package:app_links/app_links.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'bridge/bridge.dart';
import 'bridge/firebase_authentication_plugin.dart';
import 'bridge/native_purchases_plugin.dart';
import 'bridge/plugin.dart';
import 'push/adapters.dart';
import 'push/firebase_config.dart';
import 'push/push.dart';
import 'shell/host.dart';
import 'shell/web_shell.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
  final shell = GlobalKey<WebShellState>();
  final auth = FirebaseAuthenticationPlugin(apple: SystemAppleSignIn(), google: SystemGoogleSignIn());
  final purchases = NativePurchasesPlugin(ChannelStoreKit());

  // Notifications only when the build carried the Firebase settings.
  Push? push;
  final opts = firebaseOptions();
  if (opts != null) {
    try {
      await Firebase.initializeApp(options: opts);
      await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(alert: true, badge: true, sound: true);
      push = Push(FcmMessaging(), ShellSitePage(shell));
      await push.start(auth.signedIn);
    } catch (_) {
      push = null; // the app works without them
    }
  }
  // nabutarot:// links (the home-screen widget): the first one picks the
  // page the app opens on, later ones move the site there.
  final links = AppLinks();
  Uri? first;
  try {
    first = await links.getInitialLink();
  } catch (_) {}
  links.uriLinkStream.listen((u) {
    final r = routeOfLink(u);
    if (r != null) shell.currentState?.go(r);
  });
  runApp(NabuApp(plugins: [auth, purchases], shell: shell, push: push, initialRoute: first == null ? null : routeOfLink(first)));
}

class NabuApp extends StatefulWidget {
  const NabuApp({super.key, required this.plugins, required this.shell, this.push, this.initialRoute});
  final List<NativePlugin> plugins;
  final String? initialRoute;
  final GlobalKey<WebShellState> shell;
  final Push? push;

  @override
  State<NabuApp> createState() => _NabuAppState();
}

class _NabuAppState extends State<NabuApp> {
  late final Bridge bridge = Bridge(widget.plugins, holdUntilListened: true);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nabu Tarot',
      debugShowCheckedModeBanner: false,
      home: NabuHost(bridge: bridge, shellKey: widget.shell, initialRoute: widget.initialRoute, onLoaded: () => widget.push?.pageLoaded()),
    );
  }
}
