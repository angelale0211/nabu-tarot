import 'dart:async';

/// Firebase Cloud Messaging, as much of it as the app uses.
abstract class Messaging {
  /// Shows the system sheet the first time; true if notifications are allowed.
  Future<bool> requestPermission();
  Future<String?> token();
  Stream<String> get tokenRefresh;

  /// Routes of notifications tapped while the app was running.
  Stream<String> get opened;

  /// The route of the notification that launched the app, if one did.
  Future<String?> initialRoute();
  Future<void> deleteToken();
}

/// The site, as push needs it.
abstract class SitePage {
  bool get loaded;
  Future<void> go(String route);

  /// The signed-in account's uid, or null (waits briefly for Firebase to
  /// restore a session after a page load).
  Future<String?> signedInUid();

  /// Files this phone's token with the worker under the signed-in account.
  Future<bool> register(String token);
}

/// A route the site can open, or null. Only the site's own hash routes.
String? routeOf(Map<String, Object?> data) {
  final r = data['route'];
  if (r is! String || r.isEmpty || r.contains('..')) return null;
  return RegExp(r'^[a-z0-9][a-z0-9/_-]*$').hasMatch(r) ? r : null;
}

/// Notifications for the signed-in person: permission is asked only once
/// somebody is signed in, the token is filed under their account, a tapped
/// notification opens its screen once the site is showing, and signing out
/// deletes the token so the next person on the phone gets nothing of theirs.
class Push {
  Push(this.messaging, this.page);
  final Messaging messaging;
  final SitePage page;

  String? _pendingRoute;
  String? _registeredFor; // "uid|token"
  bool _refused = false;
  bool _allowed = false;
  String? _fresh; // a token FCM handed over by refresh
  Future<void> _queue = Future.value();

  Future<void> start(Stream<bool> signedIn) async {
    _pendingRoute = await messaging.initialRoute();
    messaging.opened.listen(_open);
    messaging.tokenRefresh.listen((t) {
      _fresh = t;
      _serial(_check);
    });
    signedIn.listen((on) => _serial(on ? _check : _signedOut));
  }

  /// Call on every finished page load.
  Future<void> pageLoaded() async {
    final r = _pendingRoute;
    _pendingRoute = null;
    if (r != null) await page.go(r);
    await _serial(_check);
  }

  void _open(String route) {
    if (page.loaded) {
      page.go(route);
    } else {
      _pendingRoute = route;
    }
  }

  Future<void> _serial(Future<void> Function() f) => _queue = _queue.then((_) => f()).catchError((_) {});

  Future<void> _check() async {
    if (_refused || !page.loaded) return;
    final uid = await page.signedInUid();
    if (uid == null) return;
    if (!_allowed) {
      if (!await messaging.requestPermission()) {
        _refused = true;
        return;
      }
      _allowed = true;
    }
    final t = _fresh ?? await messaging.token();
    if (t == null || _registeredFor == '$uid|$t') return;
    if (await page.register(t)) _registeredFor = '$uid|$t';
  }

  Future<void> _signedOut() async {
    _registeredFor = null;
    _fresh = null;
    await messaging.deleteToken();
  }
}
