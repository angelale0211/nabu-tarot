import 'dart:async';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

import '../shell/web_shell.dart';
import 'push.dart';

/// [Messaging] through firebase_messaging.
class FcmMessaging implements Messaging {
  final _fm = FirebaseMessaging.instance;

  @override
  Future<bool> requestPermission() async {
    final s = await _fm.requestPermission(alert: true, badge: true, sound: true);
    return s.authorizationStatus == AuthorizationStatus.authorized ||
        s.authorizationStatus == AuthorizationStatus.provisional;
  }

  /// FCM has no token until APNs has given the phone one, which can take a
  /// moment after permission is granted.
  @override
  Future<String?> token() async {
    for (var i = 0; i < 10 && await _fm.getAPNSToken() == null; i++) {
      await Future<void>.delayed(const Duration(milliseconds: 500));
    }
    try {
      return await _fm.getToken();
    } catch (_) {
      return null;
    }
  }

  @override
  Stream<String> get tokenRefresh => _fm.onTokenRefresh;

  @override
  Stream<String> get opened =>
      FirebaseMessaging.onMessageOpenedApp.map((m) => routeOf(m.data)).where((r) => r != null).cast<String>();

  @override
  Future<String?> initialRoute() async {
    final m = await _fm.getInitialMessage();
    return m == null ? null : routeOf(m.data);
  }

  @override
  Future<void> deleteToken() => _fm.deleteToken();
}

/// [SitePage] through the web view: who is signed in and the worker call are
/// asked of the site itself (BE, CONFIG and lang in src/), so the app holds
/// no address and no credentials of its own.
class ShellSitePage implements SitePage {
  ShellSitePage(this.shell, {this.opener});
  final GlobalKey<WebShellState> shell;

  /// Opens a route through the app's tabs (so a native route shows its tab).
  final void Function(String route)? opener;

  InAppWebViewController? get _c => shell.currentState?.controller;

  @override
  bool get loaded => shell.currentState?.loaded ?? false;

  @override
  Future<void> go(String route) async {
    if (opener != null) {
      opener!(route);
    } else {
      await shell.currentState?.go(route);
    }
  }

  Future<Object?> _run(String body, [Map<String, Object?> args = const {}]) async {
    final c = _c;
    if (c == null) return null;
    final r = await c.callAsyncJavaScript(functionBody: body, arguments: args);
    return r?.error == null ? r?.value : null;
  }

  @override
  Future<String?> signedInUid() async {
    final v = await _run('''
      const until = Date.now() + 6000;
      while (Date.now() < until) {
        if (typeof BE !== 'undefined' && BE.user) return BE.user.uid;
        await new Promise((r) => setTimeout(r, 400));
      }
      return null;''');
    return v is String && v.isNotEmpty ? v : null;
  }

  @override
  Future<bool> register(String token) async {
    final v = await _run('''
      if (typeof CONFIG === 'undefined' || !CONFIG.aiEndpoint || typeof BE === 'undefined' || !BE.user) return false;
      const idTok = await BE.token();
      const r = await fetch(CONFIG.aiEndpoint.replace(/\\/\$/, '') + '/push-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + idTok },
        body: JSON.stringify({ token: token, lang: typeof lang !== 'undefined' ? lang : 'vi', platform: 'ios' })
      });
      return r.ok;''', {'token': token});
    return v == true;
  }
}
