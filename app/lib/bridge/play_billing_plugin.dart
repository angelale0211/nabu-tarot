import 'dart:async';

import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:in_app_purchase_android/billing_client_wrappers.dart';
import 'package:in_app_purchase_android/in_app_purchase_android.dart';

import 'plugin.dart';

/// Google Play Billing, as the Android overlay (assets/android_bridge.js)
/// needs it for the site's Digital Goods API.
abstract class PlayStore {
  /// [{itemId, title, description, price: {currency, value}, subscriptionPeriod?}]
  Future<List<Map<String, Object?>>> details(List<String> ids);

  /// What this Play account holds: [{itemId, purchaseToken}].
  Future<List<Map<String, Object?>>> purchases();

  /// Shows Play's sheet. Resolves {itemId, purchaseToken}; a closed sheet
  /// throws PluginError(code: 'cancelled'). Nothing is acknowledged here: the
  /// worker acknowledges a purchase once it has checked it (worker/src/play.ts).
  Future<Map<String, Object?>> buy(String sku, {String? oldSku, String? oldToken});
  Future<void> consume(String token);
}

/// "199000" for a whole price, "4.99" otherwise: what Digital Goods sends.
String priceValue(double v) => v == v.roundToDouble() ? v.toStringAsFixed(0) : v.toString();

class PlayBillingPlugin implements NativePlugin {
  PlayBillingPlugin(this.store);
  final PlayStore store;

  @override
  String get name => 'PlayBilling';

  @override
  Stream<(String, Object?)> get events => const Stream.empty();

  @override
  Future<Object?> call(String method, Map<String, Object?> args) async {
    switch (method) {
      case 'getDetails':
        return store.details([for (final i in (args['itemIds'] as List? ?? const [])) '$i']);
      case 'listPurchases':
        return store.purchases();
      case 'buy':
        final sku = args['sku'];
        if (sku is! String || sku.isEmpty) throw const PluginError('no sku');
        return store.buy(sku, oldSku: args['oldSku'] as String?, oldToken: args['oldToken'] as String?);
      case 'consume':
        final t = args['purchaseToken'];
        if (t is! String || t.isEmpty) throw const PluginError('no purchaseToken');
        await store.consume(t);
        return null;
      default:
        throw PluginError('PlayBilling.$method is not in this app');
    }
  }
}

/// What the first payment of an offer (or a base plan) costs, in micros.
int firstPaymentMicros(GooglePlayProductDetails pd) {
  final o = pd.productDetails.subscriptionOfferDetails;
  final i = pd.subscriptionIndex;
  if (o == null || i == null || i >= o.length || o[i].pricingPhases.isEmpty) return 1 << 62;
  return o[i].pricingPhases.first.priceAmountMicros;
}

/// The offer whose first payment is the lowest, if it is lower than the plan's own.
ProductDetails bestOffer(ProductDetails base, List<GooglePlayProductDetails> offers) {
  if (base is! GooglePlayProductDetails || offers.isEmpty) return base;
  var best = base;
  for (final o in offers) {
    if (firstPaymentMicros(o) < firstPaymentMicros(best)) best = o;
  }
  return best;
}

/// [PlayStore] through in_app_purchase.
class GooglePlayStore implements PlayStore {
  GooglePlayStore() {
    _sub = _iap.purchaseStream.listen(_onPurchases);
  }

  final _iap = InAppPurchase.instance;
  late final StreamSubscription<List<PurchaseDetails>> _sub;
  final _products = <String, ProductDetails>{};

  /// A subscription's offers (a free trial, an introductory price). Play lists
  /// only the offers this account may still take.
  final _offers = <String, List<GooglePlayProductDetails>>{};
  Completer<Map<String, Object?>>? _buying;
  String? _buyingSku;

  InAppPurchaseAndroidPlatformAddition get _android => _iap.getPlatformAddition<InAppPurchaseAndroidPlatformAddition>();

  void dispose() => _sub.cancel();

  void _onPurchases(List<PurchaseDetails> list) {
    for (final p in list) {
      final c = _buying;
      if (c == null || c.isCompleted || p.productID != _buyingSku) continue;
      switch (p.status) {
        case PurchaseStatus.purchased:
        case PurchaseStatus.restored:
          c.complete({'itemId': p.productID, 'purchaseToken': p.verificationData.serverVerificationData});
        case PurchaseStatus.canceled:
          c.completeError(const PluginError('cancelled', code: 'cancelled'));
        case PurchaseStatus.error:
          final e = p.error;
          final cancelled = e != null && (e.code == 'BillingResponse.userCanceled' || e.message.contains('userCanceled'));
          c.completeError(PluginError(e?.message ?? 'Play refused the purchase', code: cancelled ? 'cancelled' : 'error'));
        case PurchaseStatus.pending:
          // Not refused, not done: the sheet is free again for another purchase, and the site
          // (assets/android_bridge.js) says the purchase is waiting; a restore picks it up later.
          c.complete({'itemId': p.productID, 'pending': true});
      }
    }
  }

  @override
  Future<List<Map<String, Object?>>> details(List<String> ids) async {
    if (!await _iap.isAvailable()) throw const PluginError('Google Play is not available', code: 'unavailable');
    final r = await _iap.queryProductDetails(ids.toSet());
    final out = <String, Map<String, Object?>>{};
    for (final pd in r.productDetails) {
      // A subscription comes once per offer; the first base plan (no offer id)
      // speaks for it, and its offers are kept for the purchase.
      if (pd is GooglePlayProductDetails && pd.subscriptionIndex != null) {
        final offer = pd.productDetails.subscriptionOfferDetails![pd.subscriptionIndex!];
        if (offer.offerId != null) {
          final list = _offers.putIfAbsent(pd.id, () => []);
          list.removeWhere((x) => x.subscriptionIndex == pd.subscriptionIndex);
          list.add(pd);
          continue;
        }
        if (out.containsKey(pd.id)) continue;
        _products[pd.id] = pd;
        out[pd.id] = {
          'itemId': pd.id,
          'title': pd.title,
          'description': pd.description,
          'price': {'currency': pd.currencyCode, 'value': priceValue(pd.rawPrice)},
          'subscriptionPeriod': offer.pricingPhases.isEmpty ? null : offer.pricingPhases.last.billingPeriod,
        };
      } else {
        _products[pd.id] = pd;
        out[pd.id] = {
          'itemId': pd.id,
          'title': pd.title,
          'description': pd.description,
          'price': {'currency': pd.currencyCode, 'value': priceValue(pd.rawPrice)},
        };
      }
    }
    return out.values.toList();
  }

  Future<List<GooglePlayPurchaseDetails>> _held() async {
    final r = await _android.queryPastPurchases();
    return r.pastPurchases;
  }

  @override
  Future<List<Map<String, Object?>>> purchases() async => [
        for (final p in await _held()) {'itemId': p.productID, 'purchaseToken': p.verificationData.serverVerificationData},
      ];

  @override
  Future<Map<String, Object?>> buy(String sku, {String? oldSku, String? oldToken}) async {
    if (_buying != null && !_buying!.isCompleted) throw const PluginError('a purchase is already open', code: 'busy');
    ProductDetails? pd = _products[sku];
    if (pd == null) {
      await details([sku]);
      pd = _products[sku];
    }
    if (pd == null) throw PluginError('Play has no product $sku', code: 'noproduct');
    ChangeSubscriptionParam? change;
    if (oldToken != null) {
      final old = (await _held()).where((p) => p.verificationData.serverVerificationData == oldToken).firstOrNull;
      if (old != null) change = ChangeSubscriptionParam(oldPurchaseDetails: old, replacementMode: ReplacementMode.withTimeProration);
    }
    // A new subscription starts with the best offer Play still allows this
    // account (a free trial before a discount); a plan change keeps the base plan.
    if (change == null) pd = bestOffer(pd, _offers[sku] ?? const []);
    final c = _buying = Completer<Map<String, Object?>>();
    _buyingSku = sku;
    final started = await _iap.buyNonConsumable(
      purchaseParam: GooglePlayPurchaseParam(productDetails: pd, changeSubscriptionParam: change),
    );
    if (!started && !c.isCompleted) c.completeError(const PluginError('Play did not open its sheet', code: 'error'));
    return c.future;
  }

  @override
  Future<void> consume(String token) async {
    final p = (await _held()).where((p) => p.verificationData.serverVerificationData == token).firstOrNull;
    if (p == null) return; // already consumed, or not this account's
    final r = await _android.consumePurchase(p);
    if (r.responseCode != BillingResponse.ok) throw PluginError(r.debugMessage ?? 'consume failed');
  }
}
