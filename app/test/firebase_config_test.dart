import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/push/firebase_config.dart';

void main() {
  test('all four values make Firebase options for the app', () {
    final o = firebaseOptionsFrom({'FB_API_KEY': 'k', 'FB_APP_ID': '1:2:ios:3', 'FB_SENDER_ID': '2', 'FB_PROJECT_ID': 'nabutarot'})!;
    expect(o.apiKey, 'k');
    expect(o.appId, '1:2:ios:3');
    expect(o.messagingSenderId, '2');
    expect(o.projectId, 'nabutarot');
    expect(o.iosBundleId, 'app.nabutarot.ios');
  });

  test('a build without the Firebase file has no options, so notifications stay off', () {
    expect(firebaseOptionsFrom({}), isNull);
    expect(firebaseOptionsFrom({'FB_API_KEY': 'k', 'FB_APP_ID': '', 'FB_SENDER_ID': '2', 'FB_PROJECT_ID': 'p'}), isNull);
  });

  test('Android uses its own Firebase app id and key', () {
    final v = {'FB_API_KEY': 'ios-k', 'FB_APP_ID': '1:2:ios:3', 'FB_SENDER_ID': '2', 'FB_PROJECT_ID': 'nabutarot',
      'FB_ANDROID_API_KEY': 'and-k', 'FB_ANDROID_APP_ID': '1:2:android:4'};
    final o = firebaseOptionsFrom(v, android: true)!;
    expect(o.appId, '1:2:android:4');
    expect(o.apiKey, 'and-k');
    expect(firebaseOptionsFrom(v)!.appId, '1:2:ios:3');
    expect(firebaseOptionsFrom({'FB_API_KEY': 'k', 'FB_APP_ID': 'a', 'FB_SENDER_ID': '2', 'FB_PROJECT_ID': 'p'}, android: true), isNull);
  });
}
