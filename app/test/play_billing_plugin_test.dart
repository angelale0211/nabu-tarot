import 'package:flutter_test/flutter_test.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:nabu_tarot/bridge/play_billing_plugin.dart';
import 'package:nabu_tarot/bridge/plugin.dart';

class FakePlay implements PlayStore {
  List<String>? asked;
  (String, String?, String?)? bought;
  Object? buyError;
  final consumed = <String>[];
  List<Map<String, Object?>> held = [
    {'itemId': 'plus', 'purchaseToken': 'tok-old'},
  ];

  @override
  Future<List<Map<String, Object?>>> details(List<String> ids) async {
    asked = ids;
    return [
      {'itemId': 'tarot', 'title': 'Tarot', 'description': '', 'price': {'currency': 'VND', 'value': '199000'}},
      {'itemId': 'plus', 'title': 'Plus', 'description': '', 'price': {'currency': 'VND', 'value': '99000'}, 'subscriptionPeriod': 'P1Y'},
    ];
  }

  @override
  Future<List<Map<String, Object?>>> purchases() async => held;

  @override
  Future<Map<String, Object?>> buy(String sku, {String? oldSku, String? oldToken}) async {
    if (buyError != null) throw buyError!;
    bought = (sku, oldSku, oldToken);
    return {'itemId': sku, 'purchaseToken': 'tok-new'};
  }

  @override
  Future<void> consume(String token) async => consumed.add(token);
}

void main() {
  late FakePlay play;
  late PlayBillingPlugin p;
  setUp(() {
    play = FakePlay();
    p = PlayBillingPlugin(play);
  });

  test('getDetails prices the asked items in the Digital Goods shape', () async {
    final r = await p.call('getDetails', {'itemIds': ['tarot', 'plus']}) as List;
    expect(play.asked, ['tarot', 'plus']);
    expect((r.first as Map)['price'], {'currency': 'VND', 'value': '199000'});
    expect((r.last as Map)['subscriptionPeriod'], 'P1Y');
  });

  test('listPurchases answers itemId and purchaseToken', () async {
    expect(await p.call('listPurchases', {}), [
      {'itemId': 'plus', 'purchaseToken': 'tok-old'},
    ]);
  });

  test('buy hands back the Play purchase token, and passes a plan change on', () async {
    final r = await p.call('buy', {'sku': 'pro', 'oldSku': 'plus', 'oldToken': 'tok-old'}) as Map;
    expect(play.bought, ('pro', 'plus', 'tok-old'));
    expect(r, {'itemId': 'pro', 'purchaseToken': 'tok-new'});
  });

  test('a buy without a sku is refused before Play is asked', () async {
    await expectLater(p.call('buy', {}), throwsA(isA<PluginError>()));
    expect(play.bought, isNull);
  });

  test('a closed sheet comes back with the code cancelled', () async {
    play.buyError = const PluginError('cancelled', code: 'cancelled');
    await expectLater(p.call('buy', {'sku': 'tarot'}), throwsA(predicate((e) => e is PluginError && e.code == 'cancelled')));
  });

  test('consume uses exactly that token', () async {
    await p.call('consume', {'purchaseToken': 'tok-w'});
    expect(play.consumed, ['tok-w']);
    await expectLater(p.call('consume', {}), throwsA(isA<PluginError>()));
  });

  test('digital goods price strings: a whole-number price keeps no decimals', () {
    expect(priceValue(199000.0), '199000');
    expect(priceValue(4.99), '4.99');
  });

  test('a closed or refused Play sheet answers the purchase on show, though Play names no product', () {
    // in_app_purchase_android sends a cancel or a refusal as one row with productID ''.
    expect(isAnswerTo('', PurchaseStatus.canceled, 'tarot'), isTrue);
    expect(isAnswerTo('', PurchaseStatus.error, 'tarot'), isTrue);
    expect(isAnswerTo('tarot', PurchaseStatus.purchased, 'tarot'), isTrue);
    // Another product's row (a renewal, a pending one settling) is not this purchase's answer.
    expect(isAnswerTo('plus', PurchaseStatus.purchased, 'tarot'), isFalse);
    expect(isAnswerTo('', PurchaseStatus.purchased, 'tarot'), isFalse);
  });
}
