import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../bridge/app_plugin.dart';
import '../bridge/bridge.dart';
import 'host.dart';
import 'web_shell.dart';

enum Back { web, exit }

/// The back button steps back through the site's pages, and leaves the app
/// only from the first one.
Back decideBack({required bool webCanGoBack}) =>
    webCanGoBack ? Back.web : Back.exit;

/// The app's one screen: nabutarot.com exactly as the site draws it (its own
/// tab bar, buttons and activities), in the app's own web view, with the
/// native layers underneath - sign-in, the store, notifications, the offline
/// screen and the back button.
class AppPage extends StatelessWidget {
  const AppPage({
    super.key,
    required this.bridge,
    required this.shell,
    required this.shimAsset,
    this.initialRoute,
    this.onSiteLoaded,
  });
  final Bridge bridge;
  final GlobalKey<WebShellState> shell;
  final String shimAsset;
  final String? initialRoute;
  final VoidCallback? onSiteLoaded;

  Future<void> _back() async {
    final c = shell.currentState?.controller;
    final can = c != null && await c.canGoBack();
    switch (decideBack(webCanGoBack: can)) {
      case Back.web:
        await c!.goBack();
      case Back.exit:
        await SystemNavigator.pop();
    }
  }

  @override
  Widget build(BuildContext context) => PopScope(
    canPop: false,
    onPopInvokedWithResult: (didPop, _) {
      if (!didPop) _back();
    },
    child: ValueListenableBuilder<Color>(
      valueListenable: ground,
      builder: (context, bg, child) => Scaffold(
        backgroundColor: bg,
        // The app is edge to edge and the site keeps itself clear of the
        // bars (env(safe-area-inset-*)). An older Android web view reports
        // no insets; the page says so (assets/app_common.js) and then the
        // app keeps it between the bars instead (padForBars).
        body: ValueListenableBuilder<bool>(
          valueListenable: padForBars,
          builder: (context, pad, child) => SafeArea(
            top: Platform.isAndroid && pad,
            bottom: Platform.isAndroid && pad,
            child: child!,
          ),
          child: NabuHost(
            bridge: bridge,
            shellKey: shell,
            shimAsset: shimAsset,
            initialRoute: initialRoute,
            onLoaded: () => onSiteLoaded?.call(),
          ),
        ),
      ),
    ),
  );
}
