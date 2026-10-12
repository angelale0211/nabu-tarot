import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import '../bridge/bridge.dart';
import 'links.dart';
import 'web_shell.dart';

/// The site with the bridge in it: assets/bridge.js injected before the
/// site's script, calls answered by [bridge], plugin events handed back.
class NabuHost extends StatefulWidget {
  const NabuHost({super.key, required this.bridge, this.shellKey, this.initialRoute, this.onLoaded});
  final Bridge bridge;
  final String? initialRoute;
  final GlobalKey<WebShellState>? shellKey;
  final void Function()? onLoaded;

  @override
  State<NabuHost> createState() => _NabuHostState();
}

class _NabuHostState extends State<NabuHost> {
  late final Future<String> _shim = rootBundle.loadString('assets/bridge.js');
  StreamSubscription<(String, String, Object?)>? _events;

  void _created(InAppWebViewController c) {
    // Only nabutarot.com may use sign-in and purchases, whatever else loads.
    c.addJavaScriptHandler(handlerName: 'nabu', callback: (a) async {
      if (!isSiteOrigin(await c.getUrl())) return {'ok': false, 'message': 'not available on this page'};
      return widget.bridge.handle(a.isEmpty ? null : a.first);
    });
    _events?.cancel();
    _events = widget.bridge.events.listen((e) async {
      if (isSiteOrigin(await c.getUrl())) await c.evaluateJavascript(source: emitScript(e.$1, e.$2, e.$3));
    });
  }

  @override
  void dispose() {
    _events?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: _shim,
      builder: (context, s) {
        if (!s.hasData) return const ColoredBox(color: kGround);
        return WebShell(
          key: widget.shellKey,
          initialRoute: widget.initialRoute,
          scripts: [
            UserScript(source: s.data!, injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START, forMainFrameOnly: true),
          ],
          onCreated: _created,
          onStarted: (_) => widget.bridge.pageChanged(),
          onLoaded: (_) => widget.onLoaded?.call(),
        );
      },
    );
  }
}
