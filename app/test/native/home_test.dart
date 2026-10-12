import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/native/home.dart';

void main() {
  test('back on a web tab steps back through the site first', () {
    expect(decideBack(tab: 3, webCanGoBack: true), Back.web);
    expect(decideBack(tab: 4, webCanGoBack: true), Back.web);
  });
  test('back on any other tab goes to Today; on Today it leaves the app', () {
    expect(decideBack(tab: 3, webCanGoBack: false), Back.today);
    expect(decideBack(tab: 2, webCanGoBack: true), Back.today);
    expect(decideBack(tab: 0, webCanGoBack: true), Back.exit);
  });
  test('the site\'s routes land on the tab that holds them', () {
    expect(tabForRoute('learn'), 3);
    expect(tabForRoute('learn/tarot'), 3);
    expect(tabForRoute('play'), 3);
    expect(tabForRoute('me'), 4);
    expect(tabForRoute('me/bookings'), 4);
    expect(tabForRoute('book'), 4);
    expect(tabForRoute('pick'), 1);
    expect(tabForRoute(''), 0);
  });
  test('the language the site speaks is the one the app speaks', () {
    expect(appLang('de'), 'de');
    expect(appLang('vi'), 'vi');
    expect(appLang('fr'), 'vi');
    expect(appLang(null, device: 'en_US'), 'en');
    expect(appLang(null, device: 'ja_JP'), 'vi');
  });
}
