import 'dart:async';
import 'dart:convert';

import 'plugin.dart';

/// Between assets/bridge.js and the native plugins: every call the site makes
/// arrives here as {plugin, method, args} and leaves as {ok, value} or
/// {ok:false, message, code?}.
class Bridge {
  Bridge(List<NativePlugin> plugins) : _plugins = {for (final p in plugins) p.name: p} {
    for (final p in plugins) {
      p.events.listen((e) => _events.add((p.name, e.$1, e.$2)));
    }
  }

  final Map<String, NativePlugin> _plugins;
  final _events = StreamController<(String, String, Object?)>.broadcast();

  /// (plugin, event, data) for every event any plugin raises.
  Stream<(String, String, Object?)> get events => _events.stream;

  Future<Map<String, Object?>> handle(Object? raw) async {
    final msg = raw is Map ? raw : const {};
    final name = '${msg['plugin']}';
    final method = '${msg['method']}';
    final a = msg['args'];
    final args = a is Map ? a.map((k, v) => MapEntry('$k', v as Object?)) : <String, Object?>{};
    final p = _plugins[name];
    if (p == null) return {'ok': false, 'message': 'plugin $name is not in this app'};
    try {
      return {'ok': true, 'value': await p.call(method, args)};
    } on PluginError catch (e) {
      return {'ok': false, 'message': e.message, if (e.code != null) 'code': e.code};
    } catch (e) {
      return {'ok': false, 'message': '$e'};
    }
  }
}

/// The line that hands one event to the site's listeners.
String emitScript(String plugin, String event, Object? data) =>
    'window.__nabuEmit(${jsonEncode(plugin)},${jsonEncode(event)},${jsonEncode(data)});';
