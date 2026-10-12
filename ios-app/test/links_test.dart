import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/shell/links.dart';

void main() {
  test('site stays inside, everything else goes out', () {
    expect(isExternal(Uri.parse('https://nabutarot.com/#/pick')), false);
    expect(isExternal(Uri.parse('https://www.nabutarot.com/terms.html')), false);
    expect(isExternal(Uri.parse('https://instagram.com/nabutarot')), true);
    expect(isExternal(Uri.parse('https://ig.me/m/nabutarot')), true);
    expect(isExternal(Uri.parse('mailto:x@y.z')), true);
    expect(isExternal(Uri.parse('https://nabutarot-com.firebaseapp.com/__/auth/handler')), false);
  });

  test('a look-alike host is not the site', () {
    expect(isExternal(Uri.parse('https://nabutarot.com.evil.example/')), true);
    expect(isExternal(Uri.parse('https://evilnabutarot.com/')), true);
  });

  test('about:blank and in-page frames stay inside', () {
    expect(isExternal(Uri.parse('about:blank')), false);
  });
}
