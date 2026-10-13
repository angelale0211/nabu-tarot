import 'dart:async';
import 'dart:io';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;

import 'plugin.dart';

/// The site's notifications (reminders, a hungry pet, a new message while the
/// app is open) as the phone's own, behind window.Notification
/// (assets/app_common.js). Also shows a push that arrives while the app is in
/// front on Android, where the system would otherwise show nothing.
class NotifyPlugin implements NativePlugin {
  NotifyPlugin({required this.onOpen});

  /// Opens a site route ('play/pet') when a notification is tapped.
  final void Function(String route) onOpen;

  final _n = FlutterLocalNotificationsPlugin();
  bool _ready = false;
  var _id = 0;

  static const _channel = AndroidNotificationDetails(
    'nabu',
    'Nabu Tarot',
    channelDescription: 'Reminders and messages from Nabu',
    importance: Importance.high,
    priority: Priority.high,
    icon: 'ic_stat_nabu',
  );
  static const _details = NotificationDetails(android: _channel, iOS: DarwinNotificationDetails());

  @override
  String get name => 'Notify';

  @override
  Stream<(String, Object?)> get events => const Stream.empty();

  Future<void> init() async {
    if (_ready) return;
    tzdata.initializeTimeZones();
    await _n.initialize(
      settings: const InitializationSettings(
        android: AndroidInitializationSettings('ic_stat_nabu'),
        // Asked only when the site asks (a reminder switched on), never at launch.
        iOS: DarwinInitializationSettings(requestAlertPermission: false, requestBadgePermission: false, requestSoundPermission: false),
      ),
      onDidReceiveNotificationResponse: (r) {
        final route = routeOfHash(r.payload);
        if (route != null) onOpen(route);
      },
    );
    _ready = true;
  }

  /// What the web's Notification.permission says: granted, denied or default.
  Future<String> _permission() async {
    await init();
    if (Platform.isAndroid) {
      final a = _n.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
      return (await a?.areNotificationsEnabled() ?? false) ? 'granted' : 'default';
    }
    final i = _n.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>();
    final p = await i?.checkPermissions();
    return p?.isEnabled == true ? 'granted' : 'default';
  }

  Future<String> _request() async {
    await init();
    bool? ok;
    if (Platform.isAndroid) {
      ok = await _n.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.requestNotificationsPermission();
    } else {
      ok = await _n.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()?.requestPermissions(alert: true, badge: true, sound: true);
    }
    return ok == true ? 'granted' : 'denied';
  }

  /// Shows one notification now; [hash] is the site route it opens ('#/play/pet').
  Future<void> show(String title, String body, {String hash = ''}) async {
    await init();
    _id = _id % 9999 + 1; // 1-9999: below the reminder groups
    await _n.show(id: _id, title: title, body: body, notificationDetails: _details, payload: hash);
  }

  /// Each kind of reminder owns a block of notification ids, so one kind is
  /// replaced without touching the other and nothing needs to be stored.
  static const groups = {'booking': 20000, 'pet': 21000};
  static const groupSize = 1000;

  /// Puts [items] ({at: ms since epoch, title, body, hash}) in place of every
  /// reminder of [group] still waiting: they arrive even when the app is closed.
  Future<int> replace(String group, List<Object?> items) async {
    final base = groups[group];
    if (base == null) throw PluginError('no reminder group $group');
    await init();
    for (final r in await _n.pendingNotificationRequests()) {
      if (r.id >= base && r.id < base + groupSize) await _n.cancel(id: r.id);
    }
    final now = DateTime.now().millisecondsSinceEpoch;
    var n = 0;
    for (final it in items.whereType<Map>()) {
      final at = it['at'];
      if (at is! num || at <= now + 30000 || n >= groupSize) continue;
      await _n.zonedSchedule(
        id: base + n,
        scheduledDate: tz.TZDateTime.fromMillisecondsSinceEpoch(tz.UTC, at.toInt()),
        notificationDetails: _details,
        // Inexact: Play reserves exact alarms for alarm-clock and calendar apps.
        androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
        title: '${it['title'] ?? ''}',
        body: '${it['body'] ?? ''}',
        payload: '${it['hash'] ?? ''}',
      );
      n++;
    }
    return n;
  }

  @override
  Future<Object?> call(String method, Map<String, Object?> args) async {
    switch (method) {
      case 'replace':
        return replace('${args['group']}', (args['items'] as List?) ?? const []);
      case 'permission':
        return _permission();
      case 'request':
        return _request();
      case 'show':
        await show('${args['title'] ?? ''}', '${args['body'] ?? ''}', hash: '${args['hash'] ?? ''}');
        return null;
      default:
        throw PluginError('Notify.$method is not in this app');
    }
  }
}

/// '#/play/pet' -> 'play/pet'; anything that is not one of the site's own routes -> null.
String? routeOfHash(String? hash) {
  if (hash == null) return null;
  final r = hash.startsWith('#/') ? hash.substring(2) : hash;
  if (r.isEmpty || r.contains('..')) return null;
  return RegExp(r'^[a-z0-9][a-z0-9/_?=&.-]*$').hasMatch(r) ? r : null;
}
