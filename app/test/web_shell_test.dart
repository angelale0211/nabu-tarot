import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/shell/web_shell.dart';

void main() {
  test('user agent carries the shell token', () {
    expect(RegExp(r'\bNabuTarotiOS\b').hasMatch(kUserAgent), true);
    expect(kUserAgent, contains('iPhone'));
    expect(kUserAgent, contains('Mobile/15E148 Safari'));
  });

  test("Android sends the web view's own user agent, never the iPhone token", () {
    expect(userAgentFor(android: true), isNot(contains('NabuTarotiOS')));
    expect(userAgentFor(android: false), contains('NabuTarotiOS'));
  });

  test('the widget link nabutarot://pick opens Draw; anything else is ignored', () {
    expect(routeOfLink(Uri.parse('nabutarot://pick')), 'pick');
    expect(routeOfLink(Uri.parse('nabutarot://me/bookings')), 'me/bookings');
    expect(routeOfLink(Uri.parse('nabutarot://')), isNull);
    expect(routeOfLink(Uri.parse('https://evil.example/pick')), isNull);
    // A link to the site opens the app on that page; the bare site opens home.
    expect(routeOfLink(Uri.parse('https://nabutarot.com/#/post/2026-10-11-a6lz')), 'post/2026-10-11-a6lz');
    expect(routeOfLink(Uri.parse('https://www.nabutarot.com/#/learn?tab=tarot')), 'learn?tab=tarot');
    expect(routeOfLink(Uri.parse('https://nabutarot.com/')), '');
    expect(routeOfLink(Uri.parse('https://nabutarot.com/#/../x')), '');
    expect(routeOfLink(Uri.parse('http://nabutarot.com/#/pick')), isNull);
    expect(routeOfLink(Uri.parse('nabutarot://pick?x=javascript:1')), 'pick');
  });

  test('a route becomes the site address with that hash', () {
    expect(siteUrl('pick'), 'https://nabutarot.com/#/pick');
    expect(siteUrl('me/bookings'), 'https://nabutarot.com/#/me/bookings');
    expect(siteUrl(''), 'https://nabutarot.com/');
  });
}
