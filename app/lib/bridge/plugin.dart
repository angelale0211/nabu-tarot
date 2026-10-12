/// One native capability the site can call by name, the way it called a
/// Capacitor plugin: `window.Capacitor.Plugins.<name>.<method>(args)`.
abstract class NativePlugin {
  String get name;

  /// Answers one call. Throw [PluginError] (or anything) to reject the
  /// site's promise; the message is what the site reads.
  Future<Object?> call(String method, Map<String, Object?> args);

  /// What the plugin tells the site unasked: (event name, data), delivered to
  /// listeners the site registered with addListener(event, cb).
  Stream<(String, Object?)> get events;
}

/// A refusal the site should see in these words, with an optional code.
class PluginError implements Exception {
  const PluginError(this.message, {this.code});
  final String message;
  final String? code;

  @override
  String toString() => message;
}
