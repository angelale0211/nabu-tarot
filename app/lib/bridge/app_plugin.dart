import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import '../shell/web_shell.dart';
import 'plugin.dart';

/// The colour the site paints its page with, as the app needs it: the ground
/// behind the page (seen when it bounces) and dark or light status-bar icons.
final ground = ValueNotifier<Color>(kGround);

/// 'rgb(251, 238, 242)' / 'rgba(…)' -> a Color, or null.
Color? cssColor(String s) {
  final m = RegExp(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)').firstMatch(s);
  if (m == null) return null;
  int c(int i) => int.parse(m.group(i)!).clamp(0, 255);
  return Color.fromARGB(255, c(1), c(2), c(3));
}

/// The bars' icons over the page's ground: light on a dark page, dark on a
/// light one. No bar colours: the app is edge to edge (MainActivity), the bars
/// are see-through, and setting their colour is deprecated from Android 15.
SystemUiOverlayStyle barsFor(Color c) {
  final dark = c.computeLuminance() < 0.4;
  final icons = dark ? Brightness.light : Brightness.dark;
  return SystemUiOverlayStyle(
    systemNavigationBarContrastEnforced: false,
    statusBarIconBrightness: icons,
    systemNavigationBarIconBrightness: icons,
    // iPhone: the bar's own brightness, the opposite way round.
    statusBarBrightness: dark ? Brightness.dark : Brightness.light,
  );
}

class AppPlugin implements NativePlugin {
  @override
  String get name => 'App';

  @override
  Stream<(String, Object?)> get events => const Stream.empty();

  @override
  Future<Object?> call(String method, Map<String, Object?> args) async {
    if (method != 'ground') throw PluginError('App.$method is not in this app');
    final c = cssColor('${args['color'] ?? ''}');
    if (c == null) return null;
    ground.value = c;
    SystemChrome.setSystemUIOverlayStyle(barsFor(c));
    return null;
  }
}
