import Flutter
import StoreKit
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    if let r = engineBridge.pluginRegistry.registrar(forPlugin: "NabuStoreKit") {
      StoreKitBridge.register(with: r)
    }
  }
}

/// A refusal handed to Dart as a PlatformException(code, message).
struct BridgeError: Error {
  let code: String
  let message: String
  init(_ code: String, _ message: String) { self.code = code; self.message = message }
}

/// StoreKit 2 for the site's purchases (lib/bridge/native_purchases_plugin.dart).
///
/// A purchase is never finished here on its own: the site finishes it
/// (acknowledgePurchase -> "finish") only once the worker has answered for
/// it, so a purchase made while the worker cannot be reached stays in Apple's
/// queue and comes back through Transaction.updates or "current".
/// Transactions are passed on whether or not StoreKit could verify them
/// locally: the worker asks Apple about every one (worker/src/apple.ts).
final class StoreKitBridge: NSObject, FlutterStreamHandler {
  private static var shared: StoreKitBridge?
  private var sink: FlutterEventSink?
  private var held: [[String: Any]] = []
  private var updates: Task<Void, Never>?

  static func register(with registrar: FlutterPluginRegistrar) {
    let me = StoreKitBridge()
    shared = me
    FlutterMethodChannel(name: "nabu/purchases", binaryMessenger: registrar.messenger())
      .setMethodCallHandler { call, result in me.handle(call, result) }
    FlutterEventChannel(name: "nabu/purchases/updates", binaryMessenger: registrar.messenger())
      .setStreamHandler(me)
    me.updates = Task.detached {
      for await v in Transaction.updates {
        let row = StoreKitBridge.row(v.unsafePayloadValue)
        await MainActor.run { me.emit(row) }
      }
    }
  }

  static func row(_ t: Transaction) -> [String: Any] {
    return [
      "transactionId": String(t.id),
      "productIdentifier": t.productID,
      "appAccountToken": t.appAccountToken?.uuidString ?? "",
      "originalTransactionId": String(t.originalID),
      "purchaseDate": Int(t.purchaseDate.timeIntervalSince1970 * 1000),
    ]
  }

  // MARK: events

  func onListen(withArguments arguments: Any?, eventSink events: @escaping FlutterEventSink) -> FlutterError? {
    sink = events
    held.forEach { events($0) }
    held.removeAll()
    return nil
  }

  func onCancel(withArguments arguments: Any?) -> FlutterError? {
    sink = nil
    return nil
  }

  private func emit(_ row: [String: Any]) {
    if let s = sink { s(row) } else { held.append(row) }
  }

  // MARK: calls

  private func handle(_ call: FlutterMethodCall, _ result: @escaping FlutterResult) {
    let a = call.arguments as? [String: Any] ?? [:]
    Task { @MainActor in
      do {
        switch call.method {
        case "products":
          let ids = a["ids"] as? [String] ?? []
          let ps = try await Product.products(for: ids)
          result(ps.map { p -> [String: Any] in
            [
              "identifier": p.id,
              "priceString": p.displayPrice,
              "displayName": p.displayName,
              "description": p.description,
              "price": NSDecimalNumber(decimal: p.price).doubleValue,
              "currencyCode": p.priceFormatStyle.currencyCode,
            ]
          })
        case "storefront":
          result(await Storefront.current?.countryCode ?? "")
        case "purchase":
          result(try await purchase(a["id"] as? String ?? "", a["token"] as? String ?? ""))
        case "current":
          var rows: [String: [String: Any]] = [:]
          for await v in Transaction.currentEntitlements {
            let t = v.unsafePayloadValue
            rows[String(t.id)] = StoreKitBridge.row(t)
          }
          for await v in Transaction.unfinished {
            let t = v.unsafePayloadValue
            rows[String(t.id)] = StoreKitBridge.row(t)
          }
          result(Array(rows.values))
        case "finish":
          let id = UInt64(a["id"] as? String ?? "") ?? 0
          for await v in Transaction.unfinished {
            let t = v.unsafePayloadValue
            if t.id == id { await t.finish() }
          }
          result(nil)
        case "manage":
          let scene = UIApplication.shared.connectedScenes
            .first { $0.activationState == .foregroundActive } as? UIWindowScene
          if let scene = scene { try await AppStore.showManageSubscriptions(in: scene) }
          result(nil)
        default:
          result(FlutterMethodNotImplemented)
        }
      } catch let e as BridgeError {
        result(FlutterError(code: e.code, message: e.message, details: nil))
      } catch StoreKitError.userCancelled {
        result(FlutterError(code: "cancelled", message: "The user cancelled the purchase", details: nil))
      } catch {
        result(FlutterError(code: "storekit", message: error.localizedDescription, details: nil))
      }
    }
  }

  private func purchase(_ id: String, _ token: String) async throws -> [String: Any] {
    guard let p = try await Product.products(for: [id]).first else {
      throw BridgeError("noproduct", "The App Store has no product \(id)")
    }
    var opts: Set<Product.PurchaseOption> = []
    if let u = UUID(uuidString: token) { opts.insert(.appAccountToken(u)) }
    switch try await p.purchase(options: opts) {
    case .success(let v):
      return StoreKitBridge.row(v.unsafePayloadValue)
    case .userCancelled:
      throw BridgeError("cancelled", "The user cancelled the purchase")
    case .pending:
      throw BridgeError("pending", "Purchase pending approval")
    @unknown default:
      throw BridgeError("storekit", "The App Store gave an unknown answer")
    }
  }
}
