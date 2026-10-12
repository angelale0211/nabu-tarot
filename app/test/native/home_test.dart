import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/shell/app_page.dart';

void main() {
  test('back steps back through the site, and leaves the app only from its first page', () {
    expect(decideBack(webCanGoBack: true), Back.web);
    expect(decideBack(webCanGoBack: false), Back.exit);
  });
}
