import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/bridge/bridge.dart';
import 'package:nabu_tarot/bridge/plugin.dart';

import 'support/fake_plugin.dart';

void main() {
  test('routes to the named plugin and wraps the answer', () async {
    final b = Bridge([FakePlugin('Echo', (m, a) async => {'m': m, ...a})]);
    expect(await b.handle({'plugin': 'Echo', 'method': 'ping', 'args': {'x': 1}}), {
      'ok': true,
      'value': {'m': 'ping', 'x': 1},
    });
  });

  test('an unknown plugin becomes ok:false', () async {
    final b = Bridge([FakePlugin('Echo', (m, a) async => null)]);
    final r = await b.handle({'plugin': 'Nope', 'method': 'x', 'args': {}});
    expect(r['ok'], false);
    expect(r['message'], contains('Nope'));
  });

  test('a throwing method becomes ok:false with its message', () async {
    final b = Bridge([FakePlugin('Echo', (m, a) async => throw Exception('error 1001'))]);
    final r = await b.handle({'plugin': 'Echo', 'method': 'x', 'args': {}});
    expect(r['ok'], false);
    expect(r['message'], contains('error 1001'));
    expect(r.containsKey('code'), false);
  });

  test('a PluginError keeps its own message and code', () async {
    final b = Bridge([FakePlugin('Echo', (m, a) async => throw const PluginError('Pending approval', code: 'pending'))]);
    final r = await b.handle({'plugin': 'Echo', 'method': 'x', 'args': {}});
    expect(r, {'ok': false, 'message': 'Pending approval', 'code': 'pending'});
  });

  test('missing or malformed args are treated as empty', () async {
    Map<String, Object?>? seen;
    final b = Bridge([FakePlugin('Echo', (m, a) async { seen = a; return null; })]);
    await b.handle({'plugin': 'Echo', 'method': 'x'});
    expect(seen, <String, Object?>{});
    await b.handle({'plugin': 'Echo', 'method': 'x', 'args': 'nonsense'});
    expect(seen, <String, Object?>{});
  });

  test('plugin events arrive tagged with the plugin name', () async {
    final p = FakePlugin('Echo', (m, a) async => null);
    final b = Bridge([p]);
    final got = <(String, String, Object?)>[];
    b.events.listen(got.add);
    p.emit('transactionUpdated', {'transactionId': '7'});
    await Future<void>.delayed(Duration.zero);
    expect(got.length, 1);
    expect(got.single.$1, 'Echo');
    expect(got.single.$2, 'transactionUpdated');
    expect(got.single.$3, {'transactionId': '7'});
  });

  test('the JS line that delivers an event is safe JSON', () {
    expect(emitScript('Echo', 'ev', {'a': "it's"}), 'window.__nabuEmit("Echo","ev",{"a":"it\'s"});');
  });
}
