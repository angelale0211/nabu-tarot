import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

/// Top-level keys of a plist (those indented by exactly one tab).
List<String> topKeys(String plist) =>
    RegExp(r'^\t<key>([^<]+)</key>', multiLine: true).allMatches(plist).map((m) => m.group(1)!).toList();

void main() {
  test('Info.plist names each top-level key once', () {
    final keys = topKeys(File('ios/Runner/Info.plist').readAsStringSync());
    final seen = <String>{};
    final twice = keys.where((k) => !seen.add(k)).toList();
    expect(twice, isEmpty);
  });

  test('Info.plist keeps what the app needs', () {
    final keys = topKeys(File('ios/Runner/Info.plist').readAsStringSync());
    for (final k in ['CFBundleURLTypes', 'ITSAppUsesNonExemptEncryption', 'LSApplicationQueriesSchemes', 'UIBackgroundModes']) {
      expect(keys, contains(k));
    }
  });
}
