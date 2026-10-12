import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../bridge/bridge.dart';
import '../shell/host.dart';
import '../shell/web_shell.dart';
import 'cards_screen.dart';
import 'deck.dart';
import 'draw_screen.dart';
import 'look.dart';
import 'lunar.dart';
import 'today_screen.dart';
import 'today_store.dart';

enum Back { web, today, exit }

/// What the back button does: step back through the site on a web tab, then
/// go to Today, and only from Today leave the app.
Back decideBack({required int tab, required bool webCanGoBack}) {
  if (tab >= 3 && webCanGoBack) return Back.web;
  return tab == 0 ? Back.exit : Back.today;
}

/// The tab that holds one of the site's routes.
int tabForRoute(String route) {
  final top = route.split('/').first;
  if (top == 'pick') return 1;
  if (top == 'me' || top == 'book') return 4;
  if (top.isEmpty) return 0;
  return 3;
}

/// The site's language if it is one of its three, else the phone's, else Vietnamese.
String appLang(String? site, {String? device}) {
  const ok = ['vi', 'en', 'de'];
  if (site != null && ok.contains(site)) return site;
  if (site != null) return 'vi';
  final d = (device ?? '').split(RegExp('[_-]')).first.toLowerCase();
  return ok.contains(d) ? d : 'vi';
}

/// The app: three screens drawn natively (Today, Draw, Cards) and two that
/// are the site (Learn, Profile), behind one native tab bar.
class NabuHome extends StatefulWidget {
  const NabuHome({
    super.key,
    required this.deck,
    required this.lunar,
    required this.store,
    required this.bridge,
    required this.shell,
    required this.shimAsset,
    this.initialRoute,
    this.onSiteLoaded,
  });
  final Deck deck;
  final Lunar lunar;
  final TodayStore store;
  final Bridge bridge;
  final GlobalKey<WebShellState> shell;
  final String shimAsset;
  final String? initialRoute;
  final VoidCallback? onSiteLoaded;

  @override
  State<NabuHome> createState() => NabuHomeState();
}

class NabuHomeState extends State<NabuHome> {
  late int tab = tabForRoute(widget.initialRoute ?? '');
  late String lang = appLang(null, device: Platform.localeName);
  int _drawKey = 0;

  /// Opens a route: native ones switch tab, the site's load in the web view.
  void open(String route) {
    final t = tabForRoute(route);
    setState(() => tab = t);
    if (t >= 3) widget.shell.currentState?.go(route);
  }

  Future<void> _siteLoaded() async {
    final c = widget.shell.currentState?.controller;
    final v = await c?.evaluateJavascript(source: "typeof lang !== 'undefined' ? lang : null");
    if (v is String && mounted) setState(() => lang = appLang(v));
    widget.onSiteLoaded?.call();
  }

  void _select(int i) {
    setState(() {
      if (i == 1 && tab != 1) _drawKey++;
      tab = i;
    });
    if (i == 3) widget.shell.currentState?.go('learn');
    if (i == 4) widget.shell.currentState?.go('me');
    if (i < 3) _siteLoaded();
  }

  Future<void> _back() async {
    final c = widget.shell.currentState?.controller;
    final can = tab >= 3 && c != null && await c.canGoBack();
    switch (decideBack(tab: tab, webCanGoBack: can)) {
      case Back.web:
        await c!.goBack();
      case Back.today:
        setState(() => tab = 0);
      case Back.exit:
        await SystemNavigator.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final d = widget.deck, l = lang;
    final cardsLabel = {'vi': 'Lá bài', 'en': 'Cards', 'de': 'Karten'}[l] ?? 'Lá bài';
    final todayLabel = {'vi': 'Hôm nay', 'en': 'Today', 'de': 'Heute'}[l] ?? 'Hôm nay';
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) _back();
      },
      child: Scaffold(
        backgroundColor: Look.ground,
        body: SafeArea(
          bottom: false,
          child: IndexedStack(index: tab < 3 ? 0 : 1, children: [
            // The native screens, rebuilt when shown so they follow today and the language.
            Builder(builder: (_) {
              switch (tab) {
                case 1:
                  return DrawScreen(
                    key: ValueKey('draw$_drawKey$l'),
                    deck: d,
                    lang: l,
                    store: widget.store,
                    onLearn: () => open('learn/tarot'),
                  );
                case 2:
                  return CardsScreen(key: ValueKey('cards$l'), deck: d, lang: l);
                default:
                  return TodayScreen(
                    key: ValueKey('today$l${widget.store.drawnToday}'),
                    deck: d,
                    lunar: widget.lunar,
                    lang: l,
                    store: widget.store,
                    onDraw: () => _select(1),
                    onOpen: open,
                  );
              }
            }),
            // The site, kept alive across tabs so it does not reload.
            NabuHost(
              bridge: widget.bridge,
              shellKey: widget.shell,
              shimAsset: widget.shimAsset,
              initialRoute: tabForRoute(widget.initialRoute ?? '') >= 3 ? widget.initialRoute : 'learn',
              onLoaded: _siteLoaded,
            ),
          ]),
        ),
        bottomNavigationBar: NavigationBar(
          backgroundColor: Look.surface,
          indicatorColor: Look.gold.withValues(alpha: 0.45),
          selectedIndex: tab,
          onDestinationSelected: _select,
          destinations: [
            NavigationDestination(icon: const Icon(Icons.wb_sunny_outlined), label: todayLabel),
            NavigationDestination(icon: const Icon(Icons.style_outlined), label: d.navName(l, 'pick')),
            NavigationDestination(icon: const Icon(Icons.auto_stories_outlined), label: cardsLabel),
            NavigationDestination(icon: const Icon(Icons.school_outlined), label: d.navName(l, 'learn')),
            NavigationDestination(icon: const Icon(Icons.person_outline), label: d.navName(l, 'me')),
          ],
        ),
      ),
    );
  }
}
