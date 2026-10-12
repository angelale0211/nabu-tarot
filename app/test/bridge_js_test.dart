import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

/// The shim runs inside WKWebView, so here only its shape is checked; the
/// TestFlight build exercises it for real. When node is on the machine the
/// shim is also executed once against a fake callHandler.
void main() {
  final js = File('assets/bridge.js').readAsStringSync();

  test('shim declares the platform, the two plugins and the event entry', () {
    expect(js, contains("getPlatform: function () { return 'ios'; }"));
    for (final n in ['NativePurchases', 'FirebaseAuthentication']) {
      expect(js, contains("'$n'"));
    }
    expect(js, contains('window.__nabuEmit'));
    expect(js, contains("callHandler('nabu'"));
  });

  test('shim behaves like Capacitor when run', () async {
    final node = await Process.run('node', ['--version']).then((r) => r.exitCode == 0).catchError((_) => false);
    if (!node) {
      markTestSkipped('node not installed');
      return;
    }
    final r = await Process.run('node', ['test/support/bridge_js_check.js', 'assets/bridge.js']);
    expect(r.exitCode, 0, reason: '${r.stdout}\n${r.stderr}');
    expect(r.stdout, contains('bridge ok'));
  });

  test('the Android overlay gives the site Play Billing and native Google sign-in', () async {
    final node = await Process.run('node', ['--version']).then((r) => r.exitCode == 0).catchError((_) => false);
    if (!node) {
      markTestSkipped('node not installed');
      return;
    }
    final r = await Process.run('node', ['test/support/android_bridge_check.js', 'assets/android_bridge.js']);
    expect(r.exitCode, 0, reason: '${r.stdout} ${r.stderr}');
    expect(r.stdout, contains('android bridge ok'));
  });
}
