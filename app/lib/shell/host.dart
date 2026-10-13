import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import '../bridge/app_plugin.dart';
import '../bridge/bridge.dart';
import 'links.dart';
import 'web_shell.dart';

/// The site with the bridge in it: assets/bridge.js injected before the
/// site's script, calls answered by [bridge], plugin events handed back.
class NabuHost extends StatefulWidget {
  const NabuHost({super.key, required this.bridge, this.shellKey, this.initialRoute, this.onLoaded, this.shimAsset = 'assets/bridge.js'});
  final Bridge bridge;

  /// The overlay injected before the site's script: assets/bridge.js on the
  /// iPhone, assets/android_bridge.js on Android.
  final String shimAsset;
  final String? initialRoute;
  final GlobalKey<WebShellState>? shellKey;
  final void Function()? onLoaded;

  @override
  State<NabuHost> createState() => _NabuHostState();
}

class _NabuHostState extends State<NabuHost> {
  late final Future<String> _shim = rootBundle.loadString(widget.shimAsset);
  late final Future<String> _common = rootBundle.loadString('assets/app_common.js');
  String _shimSrc = '', _commonSrc = '';
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

  /// An older web view may run the start-of-page scripts late, or not at all;
  /// then they are run now, so the site never takes the app for a browser.
  Future<void> _ensureShims(InAppWebViewController c) async {
    if (!isSiteOrigin(await c.getUrl())) return;
    final has = await c.evaluateJavascript(source: '!!(window.__nabuApp && (window.__nabuAndroid || (window.Capacitor && window.Capacitor.__nabu)))');
    if (has == true) return;
    await c.evaluateJavascript(source: _shimSrc);
    await c.evaluateJavascript(source: _commonSrc);
  }

  /// Asks the page, after every load, whether the web view tells it where the
  /// system bars are (Android). A current web view does, and the site keeps
  /// itself clear of them; an older one says 0, and then the app keeps the page
  /// between the bars (padForBars) - never both. A slow phone may tell the web
  /// view late, so it is asked several times; "none" counts only once the page
  /// has been up a few seconds.
  int _insetRun = 0;
  void _watchInsets(InAppWebViewController c) {
    if (!Platform.isAndroid) return;
    final run = ++_insetRun;
    for (final s in const [1, 3, 6, 10, 20, 40]) {
      Future<void>.delayed(Duration(seconds: s), () async {
        if (run != _insetRun || !mounted) return;
        try {
          final v = await c.evaluateJavascript(source: kInsetsProbe);
          if (v is! List || v.length < 2) return;
          final top = v[0] is num ? v[0] as num : 0, bottom = v[1] is num ? v[1] as num : 0;
          final needs = pageNeedsAppPadding(top, bottom);
          if (needs && s < 6) return;
          padForBars.value = needs;
        } catch (_) {/* the page is changing; the next load asks again */}
      });
    }
  }

  @override
  void dispose() {
    _events?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: Future.wait([_shim, _common]),
      builder: (context, s) {
        if (!s.hasData) return const ColoredBox(color: kGround);
        _shimSrc = s.data![0];
        _commonSrc = s.data![1];
        return WebShell(
          key: widget.shellKey,
          initialRoute: widget.initialRoute,
          scripts: [
            UserScript(source: _shimSrc, injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START, forMainFrameOnly: true),
            UserScript(source: _commonSrc, injectionTime: UserScriptInjectionTime.AT_DOCUMENT_START, forMainFrameOnly: true),
          ],
          onCreated: _created,
          onStarted: (_) => widget.bridge.pageChanged(),
          onLoaded: (c) async {
            await _ensureShims(c);
            widget.onLoaded?.call();
            _watchInsets(c);
          },
        );
      },
    );
  }
}
