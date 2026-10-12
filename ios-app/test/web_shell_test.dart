import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/shell/web_shell.dart';

void main() {
  test('user agent carries the shell token', () {
    expect(RegExp(r'\bNabuTarotiOS\b').hasMatch(kUserAgent), true);
    expect(kUserAgent, contains('iPhone'));
    expect(kUserAgent, contains('Mobile/15E148 Safari'));
  });

  test('a route becomes the site address with that hash', () {
    expect(siteUrl('pick'), 'https://nabutarot.com/#/pick');
    expect(siteUrl('me/bookings'), 'https://nabutarot.com/#/me/bookings');
    expect(siteUrl(''), 'https://nabutarot.com/');
  });
}
