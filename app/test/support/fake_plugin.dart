import 'dart:async';

import 'package:nabu_tarot/bridge/plugin.dart';

/// A plugin whose every method is answered by one function, for bridge tests.
class FakePlugin implements NativePlugin {
  FakePlugin(this.name, this.answer);

  @override
  final String name;
  final Future<Object?> Function(String method, Map<String, Object?> args) answer;
  final _events = StreamController<(String, Object?)>.broadcast();

  void emit(String event, Object? data) => _events.add((event, data));

  @override
  Future<Object?> call(String method, Map<String, Object?> args) => answer(method, args);

  @override
  Stream<(String, Object?)> get events => _events.stream;
}
