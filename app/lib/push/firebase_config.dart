import 'package:firebase_core/firebase_core.dart';

/// Firebase for the app, from the values ios/scripts/firebase_ids.sh copies
/// out of GoogleService-Info.plist at build time (--dart-define-from-file).
/// Null when any is missing: the app then runs without notifications.
FirebaseOptions? firebaseOptionsFrom(Map<String, String> v) {
  final key = v['FB_API_KEY'] ?? '', app = v['FB_APP_ID'] ?? '', sender = v['FB_SENDER_ID'] ?? '', project = v['FB_PROJECT_ID'] ?? '';
  if ([key, app, sender, project].any((s) => s.isEmpty)) return null;
  return FirebaseOptions(
    apiKey: key,
    appId: app,
    messagingSenderId: sender,
    projectId: project,
    iosBundleId: 'app.nabutarot.ios',
  );
}

FirebaseOptions? firebaseOptions() => firebaseOptionsFrom(const {
      'FB_API_KEY': String.fromEnvironment('FB_API_KEY'),
      'FB_APP_ID': String.fromEnvironment('FB_APP_ID'),
      'FB_SENDER_ID': String.fromEnvironment('FB_SENDER_ID'),
      'FB_PROJECT_ID': String.fromEnvironment('FB_PROJECT_ID'),
    });
