import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/bridge/native_purchases_plugin.dart';
import 'package:nabu_tarot/bridge/plugin.dart';

Map<String, Object?> tx(String id, String sku, [String token = '']) =>
    {'transactionId': id, 'productIdentifier': sku, 'appAccountToken': token};

class FakeStoreKit implements StoreKit {
  final finished = <String>[];
  final updatesCtl = StreamController<Map<String, Object?>>.broadcast();
  List<String>? askedIds;
  (String, String)? bought;
  Object? purchaseError;
  List<Map<String, Object?>> held = [];
  int managed = 0;

  @override
  Future<List<Map<String, Object?>>> products(List<String> ids) async {
    askedIds = ids;
    return [
      for (final i in ids.where((i) => i != 'missing')) {'identifier': i, 'priceString': '199.000 ₫', 'displayName': i},
    ];
  }

  @override
  Future<String> storefront() async => 'VNM';

  @override
  Future<Map<String, Object?>> purchase(String id, String appAccountToken) async {
    if (purchaseError != null) throw purchaseError!;
    bought = (id, appAccountToken);
    return tx('2000000123', id, appAccountToken.toUpperCase());
  }

  @override
  Future<List<Map<String, Object?>>> current() async => held;

  @override
  Future<void> finish(String transactionId) async => finished.add(transactionId);

  @override
  Future<void> manage() async => managed++;

  @override
  Stream<Map<String, Object?>> get updates => updatesCtl.stream;
}

void main() {
  late FakeStoreKit sk;
  late NativePurchasesPlugin p;
  setUp(() {
    sk = FakeStoreKit();
    p = NativePurchasesPlugin(sk);
  });

  test('getProducts asks StoreKit for the ids and answers {products:[{identifier, priceString}]}', () async {
    final r = await p.call('getProducts', {'productIdentifiers': ['tarot', 'missing']}) as Map;
    expect(sk.askedIds, ['tarot', 'missing']);
    final products = r['products'] as List;
    expect(products.length, 1);
    expect((products.single as Map)['identifier'], 'tarot');
    expect((products.single as Map)['priceString'], '199.000 ₫');
  });

  test('getStorefront answers {countryCode}', () async {
    expect(await p.call('getStorefront', {}), {'countryCode': 'VNM'});
  });

  test('purchaseProduct passes appAccountToken through and leaves the transaction unfinished', () async {
    final r = await p.call('purchaseProduct', {
      'productIdentifier': 'tarot',
      'productType': 'inapp',
      'quantity': 1,
      'appAccountToken': '11111111-2222-5333-8444-555555555555',
      'autoAcknowledgePurchases': false,
    }) as Map;
    expect(sk.bought, ('tarot', '11111111-2222-5333-8444-555555555555'));
    expect(r['transactionId'], '2000000123');
    expect(r['productIdentifier'], 'tarot');
    expect(sk.finished, isEmpty);
  });

  test('a cancelled sheet and Ask to Buy reach the site in words it recognises', () async {
    sk.purchaseError = const PluginError('The user cancelled the purchase', code: 'cancelled');
    await expectLater(p.call('purchaseProduct', {'productIdentifier': 'tarot', 'appAccountToken': 'x'}),
        throwsA(predicate((e) => RegExp('cancel', caseSensitive: false).hasMatch('$e'))));
    sk.purchaseError = const PluginError('Purchase pending approval', code: 'pending');
    await expectLater(p.call('purchaseProduct', {'productIdentifier': 'tarot', 'appAccountToken': 'x'}),
        throwsA(predicate((e) => RegExp('pending', caseSensitive: false).hasMatch('$e'))));
  });

  test('a purchase without a product id is refused before StoreKit is asked', () async {
    await expectLater(p.call('purchaseProduct', {}), throwsA(isA<PluginError>()));
    expect(sk.bought, isNull);
  });

  test('getPurchases answers {purchases:[...]} with id, product and token', () async {
    sk.held = [tx('1', 'plus', 'AAAA'), tx('2', 'tarot')];
    final r = await p.call('getPurchases', {'onlyCurrentEntitlements': true}) as Map;
    final list = r['purchases'] as List;
    expect(list.length, 2);
    expect(list.first, {'transactionId': '1', 'productIdentifier': 'plus', 'appAccountToken': 'AAAA'});
  });

  test('acknowledgePurchase finishes exactly that transaction', () async {
    await p.call('acknowledgePurchase', {'purchaseToken': '2000000123'});
    expect(sk.finished, ['2000000123']);
  });

  test('acknowledgePurchase without a token finishes nothing', () async {
    await expectLater(p.call('acknowledgePurchase', {}), throwsA(isA<PluginError>()));
    expect(sk.finished, isEmpty);
  });

  test('manageSubscriptions opens the App Store page', () async {
    await p.call('manageSubscriptions', {});
    expect(sk.managed, 1);
  });

  test('a StoreKit update is raised as transactionUpdated, unfinished', () async {
    final got = <(String, Object?)>[];
    p.events.listen(got.add);
    sk.updatesCtl.add(tx('9', 'pro', 'BBBB'));
    await Future<void>.delayed(Duration.zero);
    expect(got.single.$1, 'transactionUpdated');
    expect((got.single.$2 as Map)['transactionId'], '9');
    expect(sk.finished, isEmpty);
  });
}
