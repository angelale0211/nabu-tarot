import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'bridge/bridge.dart';
import 'bridge/firebase_authentication_plugin.dart';
import 'bridge/native_purchases_plugin.dart';
import 'bridge/plugin.dart';
import 'shell/host.dart';
import 'shell/web_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
  final auth = FirebaseAuthenticationPlugin(apple: SystemAppleSignIn(), google: SystemGoogleSignIn());
  final purchases = NativePurchasesPlugin(ChannelStoreKit());
  runApp(NabuApp(plugins: [auth, purchases]));
}

class NabuApp extends StatefulWidget {
  const NabuApp({super.key, required this.plugins});
  final List<NativePlugin> plugins;

  @override
  State<NabuApp> createState() => _NabuAppState();
}

class _NabuAppState extends State<NabuApp> {
  late final Bridge bridge = Bridge(widget.plugins, holdUntilListened: true);
  final shell = GlobalKey<WebShellState>();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nabu Tarot',
      debugShowCheckedModeBanner: false,
      home: NabuHost(bridge: bridge, shellKey: shell),
    );
  }
}
