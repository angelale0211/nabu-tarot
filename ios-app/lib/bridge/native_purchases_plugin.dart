import 'dart:async';

import 'package:flutter/services.dart';

import 'plugin.dart';

/// The App Store, as the Swift side (StoreKitBridge in AppDelegate.swift)
/// exposes it. Rows are {transactionId, productIdentifier, appAccountToken}.
abstract class StoreKit {
  Future<List<Map<String, Object?>>> products(List<String> ids);
  Future<String> storefront();

  /// Shows the payment sheet. The transaction comes back unfinished.
  Future<Map<String, Object?>> purchase(String id, String appAccountToken);

  /// What this Apple account holds now, plus every transaction not yet finished.
  Future<List<Map<String, Object?>>> current();
  Future<void> finish(String transactionId);
  Future<void> manage();

  /// Transactions StoreKit delivers by itself (renewals, Ask to Buy approvals,
  /// purchases left unfinished last time).
  Stream<Map<String, Object?>> get updates;
}

/// What the Capacitor NativePurchases plugin did for src/billing-apple.js,
/// with the same method names and answer shapes. Nothing is finished here
/// unless the site asks (acknowledgePurchase), which it does only after the
/// worker has answered for the transaction.
class NativePurchasesPlugin implements NativePlugin {
  NativePurchasesPlugin(this.store);
  final StoreKit store;

  @override
  String get name => 'NativePurchases';

  @override
  Stream<(String, Object?)> get events => store.updates.map((t) => ('transactionUpdated', t));

  @override
  Future<Object?> call(String method, Map<String, Object?> args) async {
    switch (method) {
      case 'getProducts':
        final ids = [for (final i in (args['productIdentifiers'] as List? ?? const [])) '$i'];
        return {'products': await store.products(ids)};
      case 'getStorefront':
        return {'countryCode': await store.storefront()};
      case 'purchaseProduct':
        final id = args['productIdentifier'];
        if (id is! String || id.isEmpty) throw const PluginError('no productIdentifier');
        return store.purchase(id, '${args['appAccountToken'] ?? ''}');
      case 'getPurchases':
        return {'purchases': await store.current()};
      case 'acknowledgePurchase':
        final t = args['purchaseToken'];
        if (t == null || '$t'.isEmpty) throw const PluginError('no purchaseToken');
        await store.finish('$t');
        return <String, Object?>{};
      case 'manageSubscriptions':
        await store.manage();
        return <String, Object?>{};
      default:
        throw PluginError('NativePurchases.$method is not in this app');
    }
  }
}

/// StoreKit through the Swift bridge.
class ChannelStoreKit implements StoreKit {
  static const _ch = MethodChannel('nabu/purchases');
  static const _ev = EventChannel('nabu/purchases/updates');

  Future<T> _call<T>(String method, [Object? args]) async {
    try {
      return await _ch.invokeMethod<T>(method, args) as T;
    } on PlatformException catch (e) {
      throw PluginError(e.message ?? e.code, code: e.code);
    }
  }

  static Map<String, Object?> _row(Object? m) =>
      m is Map ? m.map((k, v) => MapEntry('$k', v as Object?)) : <String, Object?>{};

  @override
  Future<List<Map<String, Object?>>> products(List<String> ids) async =>
      [for (final p in await _call<List<Object?>>('products', {'ids': ids})) _row(p)];

  @override
  Future<String> storefront() async => await _call<String?>('storefront') ?? '';

  @override
  Future<Map<String, Object?>> purchase(String id, String appAccountToken) async =>
      _row(await _call<Object?>('purchase', {'id': id, 'token': appAccountToken}));

  @override
  Future<List<Map<String, Object?>>> current() async => [for (final t in await _call<List<Object?>>('current')) _row(t)];

  @override
  Future<void> finish(String transactionId) => _call<void>('finish', {'id': transactionId});

  @override
  Future<void> manage() => _call<void>('manage');

  @override
  late final Stream<Map<String, Object?>> updates = _ev.receiveBroadcastStream().map(_row);
}
