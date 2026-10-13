import 'dart:async';

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

import '../shell/web_shell.dart';
import 'plugin.dart';

/// The colour the site paints its page with, as the app needs it: the ground
/// behind the page (seen when it bounces) and dark or light status-bar icons.
final ground = ValueNotifier<Color>(kGround);

/// Whether the app must keep the page clear of the status and navigation bars
/// itself (Android). A current web view tells the page where the bars are
/// (env(safe-area-inset-*)) and the site pads itself; an older one says 0, and
/// then the app pads instead - never both, or the gap would be doubled. The
/// app asks the page after every load (lib/shell/host.dart _watchInsets).
final padForBars = ValueNotifier<bool>(false);

/// What the page measures: env(safe-area-inset-top/bottom) in CSS px.
const kInsetsProbe = '''(function () {
  var b = document.body; if (!b) return [0, 0];
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;visibility:hidden;pointer-events:none;'
    + 'padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)';
  b.appendChild(d);
  var cs = getComputedStyle(d), r = [parseFloat(cs.paddingTop) || 0, parseFloat(cs.paddingBottom) || 0];
  b.removeChild(d);
  return r;
})()''';

/// The page's measured insets (CSS px): it pads itself when either is above 0.
bool pageNeedsAppPadding(num top, num bottom) => top <= 0 && bottom <= 0;

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
