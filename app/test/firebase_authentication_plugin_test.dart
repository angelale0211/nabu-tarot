import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/bridge/firebase_authentication_plugin.dart';

class FakeApple implements AppleSignIn {
  FakeApple({this.idToken = 't', this.code = 'c', this.cancel = false});
  final String idToken, code;
  final bool cancel;
  String? askedWithNonce;

  @override
  Future<AppleProof> signIn({required String hashedNonce}) async {
    askedWithNonce = hashedNonce;
    if (cancel) throw const SignInCancelled();
    return AppleProof(idToken: idToken, authorizationCode: code);
  }
}

class FakeGoogle implements GoogleSignInLike {
  FakeGoogle({this.cancel = false});
  final bool cancel;
  int signedOut = 0;

  @override
  Future<String> signIn() async {
    if (cancel) throw const SignInCancelled();
    return 'gid';
  }

  @override
  Future<void> signOut() async => signedOut++;
}

final cancelWords = RegExp(r'cancel|error 1001', caseSensitive: false);

void main() {
  test('apple answer carries idToken, the raw nonce and authorizationCode', () async {
    final apple = FakeApple();
    final p = FirebaseAuthenticationPlugin(apple: apple, google: FakeGoogle());
    final r = await p.call('signInWithApple', {'skipNativeAuth': true}) as Map;
    final c = r['credential'] as Map;
    expect(c['idToken'], 't');
    expect(c['authorizationCode'], 'c');
    final raw = c['nonce'] as String;
    expect(raw.length, greaterThanOrEqualTo(32));
    // Apple was asked with the hash of the nonce the site receives raw.
    expect(apple.askedWithNonce, sha256.convert(utf8.encode(raw)).toString());
  });

  test('every apple sign-in uses a fresh nonce', () async {
    final p = FirebaseAuthenticationPlugin(apple: FakeApple(), google: FakeGoogle());
    final a = ((await p.call('signInWithApple', {}) as Map)['credential'] as Map)['nonce'];
    final b = ((await p.call('signInWithApple', {}) as Map)['credential'] as Map)['nonce'];
    expect(a, isNot(b));
  });

  test('google answer carries idToken', () async {
    final p = FirebaseAuthenticationPlugin(apple: FakeApple(), google: FakeGoogle());
    final r = await p.call('signInWithGoogle', {'skipNativeAuth': true}) as Map;
    expect((r['credential'] as Map)['idToken'], 'gid');
  });

  test('a closed sheet is reported in the words the site expects, without an auth/ code', () async {
    for (final p in [
      FirebaseAuthenticationPlugin(apple: FakeApple(cancel: true), google: FakeGoogle()),
      FirebaseAuthenticationPlugin(apple: FakeApple(), google: FakeGoogle(cancel: true)),
    ]) {
      for (final m in ['signInWithApple', 'signInWithGoogle']) {
        try {
          await p.call(m, {});
          if ((m == 'signInWithApple') == (p.apple as FakeApple).cancel) fail('$m should have been refused');
        } catch (e) {
          expect(cancelWords.hasMatch('$e'), true, reason: '$e');
          expect('$e'.contains('auth/'), false);
        }
      }
    }
  });

  test('signOut forgets google and answers {}', () async {
    final g = FakeGoogle();
    final p = FirebaseAuthenticationPlugin(apple: FakeApple(), google: g);
    expect(await p.call('signOut', {}), <String, Object?>{});
    expect(g.signedOut, 1);
  });

  test('signedIn follows sign-in and sign-out', () async {
    final p = FirebaseAuthenticationPlugin(apple: FakeApple(), google: FakeGoogle());
    final seen = <bool>[];
    p.signedIn.listen(seen.add);
    await p.call('signInWithApple', {});
    await p.call('signOut', {});
    await Future<void>.delayed(Duration.zero);
    expect(seen, [true, false]);
  });

  test('an unknown method is refused by name', () async {
    final p = FirebaseAuthenticationPlugin(apple: FakeApple(), google: FakeGoogle());
    await expectLater(p.call('linkWithFacebook', {}), throwsA(predicate((e) => '$e'.contains('linkWithFacebook'))));
  });

  test("Google needs the site's web client id on Android; none given means none passed", () {
    expect(serverClientIdFrom(''), isNull);
    expect(serverClientIdFrom('609592701892-abc.apps.googleusercontent.com'), '609592701892-abc.apps.googleusercontent.com');
  });
}
