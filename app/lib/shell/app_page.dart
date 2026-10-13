import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../bridge/bridge.dart';
import 'host.dart';
import 'web_shell.dart';

enum Back { web, exit }

/// The back button steps back through the site's pages, and leaves the app
/// only from the first one.
Back decideBack({required bool webCanGoBack}) => webCanGoBack ? Back.web : Back.exit;

/// The app's one screen: nabutarot.com exactly as the site draws it (its own
/// tab bar, buttons and activities), in the app's own web view, with the
/// native layers underneath - sign-in, the store, notifications, the offline
/// screen and the back button.
class AppPage extends StatelessWidget {
  const AppPage({super.key, required this.bridge, required this.shell, required this.shimAsset, this.initialRoute, this.onSiteLoaded});
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
        child: Scaffold(
          backgroundColor: kGround,
          // The app is edge to edge. On the iPhone the site keeps itself clear
          // of the bars (env(safe-area-inset-*)); Android's web view does not
          // report them reliably, so there the app keeps the page between the
          // bars, and the ground behind them is the page's own colour.
          body: SafeArea(
            top: Platform.isAndroid,
            bottom: Platform.isAndroid,
            child: NabuHost(
              bridge: bridge,
              shellKey: shell,
              shimAsset: shimAsset,
              initialRoute: initialRoute,
              onLoaded: () => onSiteLoaded?.call(),
            ),
          ),
        ),
      );
}
