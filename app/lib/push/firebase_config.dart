import 'dart:io';

import 'package:firebase_core/firebase_core.dart';

/// Firebase for the app, from build-time defines (--dart-define-from-file):
/// the iPhone's come from GoogleService-Info.plist (ios/scripts/firebase_ids.sh),
/// Android's from google-services.json (tool/android_defines.py).
/// Null when any is missing: the app then runs without notifications.
FirebaseOptions? firebaseOptionsFrom(Map<String, String> v, {bool android = false}) {
  final key = (android ? v['FB_ANDROID_API_KEY'] : v['FB_API_KEY']) ?? '';
  final app = (android ? v['FB_ANDROID_APP_ID'] : v['FB_APP_ID']) ?? '';
  final sender = v['FB_SENDER_ID'] ?? '', project = v['FB_PROJECT_ID'] ?? '';
  if ([key, app, sender, project].any((s) => s.isEmpty)) return null;
  return FirebaseOptions(
    apiKey: key,
    appId: app,
    messagingSenderId: sender,
    projectId: project,
    iosBundleId: android ? null : 'app.nabutarot.ios',
  );
}

FirebaseOptions? firebaseOptions() => firebaseOptionsFrom(const {
      'FB_API_KEY': String.fromEnvironment('FB_API_KEY'),
      'FB_APP_ID': String.fromEnvironment('FB_APP_ID'),
      'FB_SENDER_ID': String.fromEnvironment('FB_SENDER_ID'),
      'FB_PROJECT_ID': String.fromEnvironment('FB_PROJECT_ID'),
      'FB_ANDROID_API_KEY': String.fromEnvironment('FB_ANDROID_API_KEY'),
      'FB_ANDROID_APP_ID': String.fromEnvironment('FB_ANDROID_APP_ID'),
    }, android: Platform.isAndroid);
