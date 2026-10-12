import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/bridge/app_plugin.dart';
import 'package:nabu_tarot/bridge/firebase_authentication_plugin.dart';
import 'package:nabu_tarot/bridge/notify_plugin.dart';

void main() {
  test('only a sheet closed after it was seen is a person cancelling', () {
    expect(isPersonCancel(true, const Duration(seconds: 3)), isTrue);
    // Android answers "canceled" at once when the app is not set up with Google.
    expect(isPersonCancel(true, const Duration(milliseconds: 300)), isFalse);
    expect(isPersonCancel(false, const Duration(seconds: 3)), isFalse);
  });

  test('a tapped notification opens only one of the site routes', () {
    expect(routeOfHash('#/play/pet'), 'play/pet');
    expect(routeOfHash('#/me'), 'me');
    expect(routeOfHash('me/bookings'), 'me/bookings');
    expect(routeOfHash(''), isNull);
    expect(routeOfHash(null), isNull);
    expect(routeOfHash('#/../x'), isNull);
    expect(routeOfHash('javascript:alert(1)'), isNull);
    expect(routeOfHash('https://evil.example'), isNull);
  });

  test('the status bar follows the page: light icons on a dark page, dark on a light one', () {
    final pink = cssColor('rgb(251, 238, 242)')!;
    final night = cssColor('rgba(26, 20, 38, 1)')!;
    expect(pink, const Color(0xFFFBEEF2));
    expect(barsFor(pink), SystemUiOverlayStyle.dark);
    expect(barsFor(night), SystemUiOverlayStyle.light);
    expect(cssColor('transparent'), isNull);
  });
}
