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

  test('events raised before the site listens are held, then delivered on __listen', () async {
    final p = FakePlugin('Store', (m, a) async => null);
    final b = Bridge([p], holdUntilListened: true);
    final got = <String>[];
    b.events.listen((e) => got.add('${e.$2}:${(e.$3 as Map)['transactionId']}'));
    p.emit('transactionUpdated', {'transactionId': '1'});
    p.emit('transactionUpdated', {'transactionId': '2'});
    await Future<void>.delayed(Duration.zero);
    expect(got, isEmpty);
    expect(await b.handle({'plugin': 'Store', 'method': '__listen', 'args': {'event': 'transactionUpdated'}}), {'ok': true, 'value': null});
    await Future<void>.delayed(Duration.zero);
    expect(got, ['transactionUpdated:1', 'transactionUpdated:2']);
    p.emit('transactionUpdated', {'transactionId': '3'});
    await Future<void>.delayed(Duration.zero);
    expect(got.last, 'transactionUpdated:3');
  });

  test('a new page forgets its listeners: events are held again until it listens', () async {
    final p = FakePlugin('Store', (m, a) async => null);
    final b = Bridge([p], holdUntilListened: true);
    final got = <Object?>[];
    b.events.listen((e) => got.add(e.$3));
    await b.handle({'plugin': 'Store', 'method': '__listen', 'args': {'event': 'ev'}});
    b.pageChanged();
    p.emit('ev', 1);
    await Future<void>.delayed(Duration.zero);
    expect(got, isEmpty);
    await b.handle({'plugin': 'Store', 'method': '__listen', 'args': {'event': 'ev'}});
    await Future<void>.delayed(Duration.zero);
    expect(got, [1]);
  });

  test('the JS line that delivers an event is safe JSON', () {
    expect(emitScript('Echo', 'ev', {'a': "it's"}), 'window.__nabuEmit("Echo","ev",{"a":"it\'s"});');
  });
}
