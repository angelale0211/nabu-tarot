import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

import 'plugin.dart';

/// The person closed the sheet.
class SignInCancelled implements Exception {
  const SignInCancelled();
}

class AppleProof {
  const AppleProof({required this.idToken, required this.authorizationCode});
  final String? idToken;
  final String authorizationCode;
}

abstract class AppleSignIn {
  Future<AppleProof> signIn({required String hashedNonce});
}

abstract class GoogleSignInLike {
  /// The Google ID token for the account the person picked.
  Future<String> signIn();
  Future<void> signOut();
}

/// What the Capacitor FirebaseAuthentication plugin did for src/backend.js:
/// shows Apple's or Google's own sheet and hands the proof to the site, which
/// signs in to Firebase with it (skipNativeAuth - there is no second, native
/// Firebase session). The answers have exactly the shape backend.js reads.
class FirebaseAuthenticationPlugin implements NativePlugin {
  FirebaseAuthenticationPlugin({required this.apple, required this.google});

  final AppleSignIn apple;
  final GoogleSignInLike google;
  final _signedIn = StreamController<bool>.broadcast();
  final _rand = Random.secure();

  /// true after a successful sign-in sheet, false after signOut.
  Stream<bool> get signedIn => _signedIn.stream;

  @override
  String get name => 'FirebaseAuthentication';

  @override
  Stream<(String, Object?)> get events => const Stream.empty();

  /// Said the way backend.js recognises a closed sheet (/cancel|error 1001/).
  static const _cancelled = PluginError('The user canceled the sign-in flow (error 1001)');

  @override
  Future<Object?> call(String method, Map<String, Object?> args) async {
    try {
      switch (method) {
        case 'signInWithApple':
          final raw = _nonce();
          final p = await apple.signIn(hashedNonce: sha256.convert(utf8.encode(raw)).toString());
          _signedIn.add(true);
          return {
            'credential': {'idToken': p.idToken, 'nonce': raw, 'authorizationCode': p.authorizationCode},
          };
        case 'signInWithGoogle':
          final idToken = await google.signIn();
          _signedIn.add(true);
          return {
            'credential': {'idToken': idToken, 'accessToken': null},
          };
        case 'signOut':
          try {
            await google.signOut();
          } catch (_) {/* nobody was signed in to Google */}
          _signedIn.add(false);
          return <String, Object?>{};
        default:
          throw PluginError('FirebaseAuthentication.$method is not in this app');
      }
    } on SignInCancelled {
      throw _cancelled;
    }
  }

  String _nonce() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._';
    return List.generate(32, (_) => chars[_rand.nextInt(chars.length)]).join();
  }
}

/// Apple's sheet through sign_in_with_apple.
class SystemAppleSignIn implements AppleSignIn {
  @override
  Future<AppleProof> signIn({required String hashedNonce}) async {
    try {
      final c = await SignInWithApple.getAppleIDCredential(
        scopes: [AppleIDAuthorizationScopes.email, AppleIDAuthorizationScopes.fullName],
        nonce: hashedNonce,
      );
      return AppleProof(idToken: c.identityToken, authorizationCode: c.authorizationCode);
    } on SignInWithAppleAuthorizationException catch (e) {
      if (e.code == AuthorizationErrorCode.canceled) throw const SignInCancelled();
      rethrow;
    }
  }
}

/// The site's Google web client id (Firebase -> Authentication -> Google ->
/// Web SDK configuration), given at build time as GOOGLE_WEB_CLIENT_ID. On
/// Android, Google hands out an ID token Firebase accepts only for it.
String? serverClientIdFrom(String v) => v.isEmpty ? null : v;

/// Google's sheet through google_sign_in 7. The client id comes from
/// GoogleService-Info.plist (CLIENT_ID), written into Info.plist at build time.
class SystemGoogleSignIn implements GoogleSignInLike {
  bool _ready = false;

  Future<void> _init() async {
    if (_ready) return;
    await GoogleSignIn.instance.initialize(serverClientId: serverClientIdFrom(const String.fromEnvironment('GOOGLE_WEB_CLIENT_ID')));
    _ready = true;
  }

  @override
  Future<String> signIn() async {
    await _init();
    try {
      final a = await GoogleSignIn.instance.authenticate();
      final t = a.authentication.idToken;
      if (t == null) throw const PluginError('Google gave no ID token');
      return t;
    } on GoogleSignInException catch (e) {
      if (e.code == GoogleSignInExceptionCode.canceled) throw const SignInCancelled();
      rethrow;
    }
  }

  @override
  Future<void> signOut() async {
    await _init();
    await GoogleSignIn.instance.signOut();
  }
}
