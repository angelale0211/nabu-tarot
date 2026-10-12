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
          // The site keeps itself clear of the status and gesture bars
          // (env(safe-area-inset-*)), on Android's web view as on the iPhone.
          body: SafeArea(
            top: false,
            bottom: false,
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
