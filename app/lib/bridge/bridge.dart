import 'dart:async';
import 'dart:convert';

import 'plugin.dart';

/// Between assets/bridge.js and the native plugins: every call the site makes
/// arrives here as {plugin, method, args} and leaves as {ok, value} or
/// {ok:false, message, code?}.
///
/// With [holdUntilListened], an event is held until the page has registered a
/// listener for it (bridge.js calls `__listen` from addListener): StoreKit
/// re-delivers unfinished purchases at launch, long before the site listens.
class Bridge {
  Bridge(List<NativePlugin> plugins, {this.holdUntilListened = false})
      : _plugins = {for (final p in plugins) p.name: p} {
    for (final p in plugins) {
      p.events.listen((e) => _raise(p.name, e.$1, e.$2));
    }
  }

  final bool holdUntilListened;
  final Map<String, NativePlugin> _plugins;
  final _events = StreamController<(String, String, Object?)>.broadcast();
  final _listened = <String>{};
  final _held = <String, List<Object?>>{};

  void _raise(String plugin, String event, Object? data) {
    final k = '$plugin/$event';
    if (holdUntilListened && !_listened.contains(k)) {
      final list = _held.putIfAbsent(k, () => []);
      list.add(data);
      if (list.length > 50) list.removeAt(0);
      return;
    }
    _events.add((plugin, event, data));
  }

  void _listen(String plugin, String event) {
    final k = '$plugin/$event';
    _listened.add(k);
    for (final d in _held.remove(k) ?? const []) {
      _events.add((plugin, event, d));
    }
  }

  /// A new page has no listeners: hold events again until it registers.
  void pageChanged() => _listened.clear();

  /// (plugin, event, data) for every event any plugin raises.
  Stream<(String, String, Object?)> get events => _events.stream;

  Future<Map<String, Object?>> handle(Object? raw) async {
    final msg = raw is Map ? raw : const {};
    final name = '${msg['plugin']}';
    final method = '${msg['method']}';
    final a = msg['args'];
    final args = a is Map ? a.map((k, v) => MapEntry('$k', v as Object?)) : <String, Object?>{};
    final p = _plugins[name];
    if (method == '__listen') {
      if (p != null) _listen(name, '${args['event']}');
      return {'ok': true, 'value': null};
    }
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
