import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/push/push.dart';

class FakeMessaging implements Messaging {
  bool allow = true;
  String? tok = 'tok-1';
  int asked = 0, deleted = 0;
  String? initial;
  final refresh = StreamController<String>.broadcast();
  final taps = StreamController<String>.broadcast();

  @override
  Future<bool> requestPermission() async {
    asked++;
    return allow;
  }

  @override
  Future<String?> token() async => tok;
  @override
  Stream<String> get tokenRefresh => refresh.stream;
  @override
  Stream<String> get opened => taps.stream;
  @override
  Future<String?> initialRoute() async => initial;
  @override
  Future<void> deleteToken() async => deleted++;
}

class FakePage implements SitePage {
  @override
  bool loaded = false;
  String? uid;
  final went = <String>[];
  final registered = <String>[];

  @override
  Future<void> go(String route) async => went.add(route);

  @override
  Future<String?> signedInUid() async => uid;

  @override
  Future<bool> register(String token) async {
    registered.add(token);
    return true;
  }
}

Future<void> settle() => Future<void>.delayed(Duration.zero);

void main() {
  late FakeMessaging m;
  late FakePage page;
  late StreamController<bool> signedIn;
  late Push push;
  setUp(() async {
    m = FakeMessaging();
    page = FakePage();
    signedIn = StreamController<bool>.broadcast();
    push = Push(m, page);
    await push.start(signedIn.stream);
  });

  test('a notification tapped before the site has loaded opens its route after onLoadStop', () async {
    m.taps.add('me/bookings');
    await settle();
    expect(page.went, isEmpty);
    page.loaded = true;
    await push.pageLoaded();
    expect(page.went, ['me/bookings']);
  });

  test('a notification that launched the app opens its route once the site has loaded', () async {
    m.initial = 'pick';
    final p2 = Push(m, page);
    await p2.start(signedIn.stream);
    page.loaded = true;
    await p2.pageLoaded();
    expect(page.went, ['pick']);
  });

  test('a tap while the site is showing goes there at once', () async {
    page.loaded = true;
    await push.pageLoaded();
    m.taps.add('me/inbox');
    await settle();
    expect(page.went, ['me/inbox']);
  });

  test('nobody signed in: no permission sheet, nothing registered', () async {
    page.loaded = true;
    await push.pageLoaded();
    expect(m.asked, 0);
    expect(page.registered, isEmpty);
  });

  test('signed in: permission asked, the token registered once per person', () async {
    page.loaded = true;
    page.uid = 'u1';
    await push.pageLoaded();
    await push.pageLoaded();
    expect(m.asked, 1);
    expect(page.registered, ['tok-1']);
  });

  test('permission refused: nothing registered and not asked again this session', () async {
    m.allow = false;
    page.loaded = true;
    page.uid = 'u1';
    await push.pageLoaded();
    await push.pageLoaded();
    expect(page.registered, isEmpty);
    expect(m.asked, 1);
  });

  test('another person signs in: their account gets the token too', () async {
    page.loaded = true;
    page.uid = 'u1';
    await push.pageLoaded();
    page.uid = 'u2';
    signedIn.add(true);
    await settle();
    await settle();
    expect(page.registered, ['tok-1', 'tok-1']);
  });

  test('signing out deletes the phone token, so the last person\'s news stops', () async {
    page.loaded = true;
    page.uid = 'u1';
    await push.pageLoaded();
    page.uid = null;
    signedIn.add(false);
    await settle();
    expect(m.deleted, 1);
  });

  test('a refreshed token is registered for whoever is signed in', () async {
    page.loaded = true;
    page.uid = 'u1';
    await push.pageLoaded();
    m.refresh.add('tok-2');
    await settle();
    await settle();
    expect(page.registered, ['tok-1', 'tok-2']);
  });

  test('an empty or odd route from a notification is ignored', () {
    expect(routeOf({'route': 'me/bookings'}), 'me/bookings');
    expect(routeOf({'route': ''}), isNull);
    expect(routeOf({}), isNull);
    expect(routeOf({'route': 'javascript:alert(1)'}), isNull);
    expect(routeOf({'route': '../../x'}), isNull);
  });
}
