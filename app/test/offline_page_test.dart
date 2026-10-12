import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/shell/offline_page.dart';

void main() {
  test('offline wording follows the phone, Vietnamese when unknown', () {
    expect(offlineLang('de_DE'), 'de');
    expect(offlineLang('en-US'), 'en');
    expect(offlineLang('vi_VN'), 'vi');
    expect(offlineLang('fr_FR'), 'vi');
  });

  testWidgets('offline page has a retry button that retries', (t) async {
    var tapped = 0;
    await t.pumpWidget(MaterialApp(home: OfflinePage(onRetry: () => tapped++)));
    await t.tap(find.byType(FilledButton));
    expect(tapped, 1);
  });
}
