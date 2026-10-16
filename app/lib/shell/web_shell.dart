import 'dart:collection';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:url_launcher/url_launcher.dart';

import '../bridge/app_plugin.dart';
import 'links.dart';
import 'offline_page.dart';

/// The user agent the web view sends: on the iPhone, Mobile Safari's plus the
/// token src/core.js iosShell() looks for; on Android the web view's own, so
/// the site never mistakes the Android app for the iPhone one.
String userAgentFor({required bool android}) => android ? '' : kUserAgent;

/// Mobile Safari's own user agent plus the token the site looks for
/// (src/core.js iosShell()): the site's phone layout and its iPhone-app
/// branches both switch on from this.
const kUserAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 '
    '(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 NabuTarotiOS/1.0';

const kSite = 'https://nabutarot.com/';

/// The site's address for one of its own routes ('pick', 'me/bookings').
String siteUrl(String route) => route.isEmpty ? kSite : '$kSite#/$route';

/// The site's own pages that live at an address of their own, and the
/// screen of the app that shows the same text.
const _pageRoutes = {'/privacy.html': 'privacy', '/terms.html': 'terms'};

/// The site route a link names, or null for anything else:
///  - nabutarot://pick (the home-screen widget)
///  - https://nabutarot.com/#/post/2026-10-11-a6lz (a link shared from the
///    site, opened in the app instead of a browser); the bare site is ''.
///  - https://nabutarot.com/privacy.html (the store listings link it): the
///    app's own privacy screen, not the home screen.
String? routeOfLink(Uri u) {
  if (u.scheme == 'https' && isSiteOrigin(u)) {
    final f = u.fragment;
    final page = _pageRoutes[u.path.toLowerCase()];
    if (page != null && (f.isEmpty || f == '/')) return page;
    if (f.isEmpty || f == '/') return '';
    final r = f.startsWith('/') ? f.substring(1) : f;
    return !r.contains('..') && RegExp(r'^[a-z0-9][a-zA-Z0-9/_?=&.%-]*$').hasMatch(r) ? r : '';
  }
  if (u.scheme != 'nabutarot') return null;
  final r = [u.host, ...u.pathSegments].where((s) => s.isNotEmpty).join('/');
  return RegExp(r'^[a-z0-9][a-z0-9/_-]*$').hasMatch(r) && !r.contains('..') ? r : null;
}

/// The pink the site paints its first frame with, so nothing flashes white.
const kGround = Color(0xFFFBEEF2);

class WebShell extends StatefulWidget {
  const WebShell({super.key, this.initialRoute, this.scripts = const [], this.onCreated, this.onStarted, this.onLoaded});

  /// The route to open first (the app was launched from a link or a notification).
  final String? initialRoute;

  /// Scripts the site needs before its own script runs (the bridge).
  final List<UserScript> scripts;
  final void Function(InAppWebViewController c)? onCreated;
  /// A new page (not a hash change) started loading.
  final void Function(InAppWebViewController c)? onStarted;
  final void Function(InAppWebViewController c)? onLoaded;

  @override
  State<WebShell> createState() => WebShellState();
}

class WebShellState extends State<WebShell> {
  InAppWebViewController? controller;
  bool offline = false;
  bool loaded = false;

  /// A new web view each time Android ends the old one's page process: a web
  /// view whose renderer is gone cannot be used again, only replaced.
  int _generation = 0;

  /// Where the page was, so a replaced web view opens there again.
  String? _lastUrl;

  /// Open one of the site's routes. Before the first page has finished
  /// loading the whole address is loaded instead of changing the hash.
  Future<void> go(String route) async {
    final c = controller;
    if (c == null) return;
    if (loaded) {
      await c.evaluateJavascript(source: 'location.hash = ${_js('#/$route')};');
    } else {
      await c.loadUrl(urlRequest: URLRequest(url: WebUri(siteUrl(route))));
    }
  }

  static String _js(String s) => "'${s.replaceAll(r'\', r'\\').replaceAll("'", r"\'")}'";

  Future<void> _retry() async {
    setState(() => offline = false);
    await controller?.loadUrl(urlRequest: URLRequest(url: WebUri(kSite)));
  }

  @override
  Widget build(BuildContext context) {
    // No pull-to-refresh: an app does not reload itself under a finger (the
    // site has its own refresh where one makes sense). No zoom, no link
    // previews or long-press menus, no keyboard accessory bar: an app's look.
    return ValueListenableBuilder<Color>(
      valueListenable: ground,
      builder: (context, bg, _) => Scaffold(
      backgroundColor: bg,
      body: Stack(children: [
        InAppWebView(
          key: ValueKey(_generation),
          initialUrlRequest: URLRequest(url: WebUri(_generation > 0 && _lastUrl != null ? _lastUrl! : siteUrl(widget.initialRoute ?? ''))),
          initialUserScripts: UnmodifiableListView(widget.scripts),
          initialSettings: InAppWebViewSettings(
            userAgent: userAgentFor(android: Platform.isAndroid),
            useShouldOverrideUrlLoading: true,
            allowsBackForwardNavigationGestures: true,
            mediaPlaybackRequiresUserGesture: false,
            allowsInlineMediaPlayback: true,
            supportMultipleWindows: false,
            javaScriptCanOpenWindowsAutomatically: true,
            transparentBackground: true,
            disallowOverScroll: false,
            supportZoom: false,
            builtInZoomControls: false,
            displayZoomControls: false,
            horizontalScrollBarEnabled: false,
            allowsLinkPreview: false,
            disableLongPressContextMenuOnLinks: true,
            disableInputAccessoryView: true,
          ),
          onWebViewCreated: (c) {
            controller = c;
            widget.onCreated?.call(c);
          },
          shouldOverrideUrlLoading: (c, action) async {
            final u = action.request.url;
            if (u == null || !opensOutside(u, mainFrame: action.isForMainFrame)) return NavigationActionPolicy.ALLOW;
            try {
              await launchUrl(u, mode: LaunchMode.externalApplication);
            } catch (_) {/* no app for that address: stay on the site */}
            return NavigationActionPolicy.CANCEL;
          },
          onLoadStart: (c, url) {
            loaded = false;
            widget.onStarted?.call(c);
          },
          onUpdateVisitedHistory: (c, url, _) {
            if (url != null && isSiteOrigin(url)) _lastUrl = url.toString();
          },
          onLoadStop: (c, url) {
            if (url != null && isSiteOrigin(url)) _lastUrl = url.toString();
            if (offline) return;
            loaded = true;
            widget.onLoaded?.call(c);
          },
          // The phone may end the page's process while the app sits in the
          // background; it comes back by itself instead of a blank screen.
          // On Android that web view is finished and a new one takes its
          // place, on the page it was showing; the iPhone's reloads.
          onRenderProcessGone: (c, detail) {
            if (!mounted) return;
            setState(() {
              loaded = false;
              controller = null;
              _generation++;
            });
          },
          onWebContentProcessDidTerminate: (c) => c.reload(),
          onReceivedError: (c, request, error) {
            if (request.isForMainFrame != true) return;
            if (error.type == WebResourceErrorType.CANCELLED) return;
            setState(() => offline = true);
          },
        ),
        if (offline) OfflinePage(onRetry: _retry),
      ]),
    ),
    );
  }
}
