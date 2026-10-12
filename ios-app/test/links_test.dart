import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/shell/links.dart';

void main() {
  test('site stays inside, everything else goes out', () {
    expect(isExternal(Uri.parse('https://nabutarot.com/#/pick')), false);
    expect(isExternal(Uri.parse('https://www.nabutarot.com/terms.html')), false);
    expect(isExternal(Uri.parse('https://instagram.com/nabutarot')), true);
    expect(isExternal(Uri.parse('https://ig.me/m/nabutarot')), true);
    expect(isExternal(Uri.parse('mailto:x@y.z')), true);
    // Sign-in is native in the app: no other site needs to load inside it.
    expect(isExternal(Uri.parse('https://evil.firebaseapp.com/')), true);
    expect(isExternal(Uri.parse('https://storage.googleapis.com/x/page.html')), true);
  });

  test('a look-alike host is not the site', () {
    expect(isExternal(Uri.parse('https://nabutarot.com.evil.example/')), true);
    expect(isExternal(Uri.parse('https://evilnabutarot.com/')), true);
  });

  test('only nabutarot.com may call the native bridge', () {
    expect(isSiteOrigin(Uri.parse('https://nabutarot.com/#/pick')), true);
    expect(isSiteOrigin(Uri.parse('https://www.nabutarot.com/terms.html')), true);
    expect(isSiteOrigin(Uri.parse('http://nabutarot.com/')), false);
    expect(isSiteOrigin(Uri.parse('https://evil.firebaseapp.com/')), false);
    expect(isSiteOrigin(Uri.parse('about:blank')), false);
    expect(isSiteOrigin(null), false);
  });

  test('frames inside the site load where they are; only whole pages may leave', () {
    final fb = Uri.parse('https://nabutarot.firebaseapp.com/__/auth/iframe');
    expect(opensOutside(fb, mainFrame: false), false);
    expect(opensOutside(fb, mainFrame: true), true);
    expect(opensOutside(Uri.parse('https://instagram.com/nabutarot'), mainFrame: true), true);
    expect(opensOutside(Uri.parse('https://nabutarot.com/#/me'), mainFrame: true), false);
  });

  test('about:blank and in-page frames stay inside', () {
    expect(isExternal(Uri.parse('about:blank')), false);
  });
}
