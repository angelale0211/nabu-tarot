/* The Android app's side of the site (injected before the site's script, on
   nabutarot.com only).

   The site was written for the Trusted Web Activity, where Chrome supplied two
   things this web view does not: Play Billing through the Digital Goods API
   and PaymentRequest, and a browser in which Google's sign-in page works.
   Both are recreated here and answered by the app (lib/bridge/), through
   flutter_inappwebview's callHandler('nabu', {plugin, method, args}):
     - getDigitalGoodsService / PaymentRequest  ->  PlayBilling (Google Play Billing)
     - a google.com sign-in popup or redirect    ->  FirebaseAuthentication.signInWithGoogle
   The site itself (src/) is unchanged: billing.js and backend.js see what
   Chrome gave them. */
(function () {
  if (window.__nabuAndroid) return;
  window.__nabuAndroid = true;
  var PLAY = 'https://play.google.com/billing';

  /* isTWA() in src/core.js: the store app, so the Play shop and no web prices. */
  try { localStorage.setItem('nabu-twa', 'true'); } catch (e) { /* storage off */ }

  /* The app draws its own tab bar; the site's would be a second one. */
  try {
    var st = document.createElement('style');
    st.textContent = 'nav.nav{display:none!important}:root{--nav-h:0px!important}';
    (document.head || document.documentElement).appendChild(st);
  } catch (e) { /* no document yet */ }

  function call(plugin, method, args) {
    var h = window.flutter_inappwebview;
    if (!h || typeof h.callHandler !== 'function') return Promise.reject(named('UnknownError', 'the app bridge is not ready'));
    return h.callHandler('nabu', { plugin: plugin, method: method, args: args || {} }).then(function (r) {
      if (r && r.ok) return r.value;
      var e = new Error((r && r.message) || 'failed');
      if (r && r.code) e.code = r.code;
      throw e;
    });
  }
  function named(name, message) { var e = new Error(message || name); e.name = name; return e; }

  /* ---- Digital Goods API ---- */
  window.getDigitalGoodsService = function (method) {
    if (method !== PLAY) return Promise.reject(named('NotSupportedError', 'unsupported payment method'));
    return Promise.resolve({
      getDetails: function (itemIds) { return call('PlayBilling', 'getDetails', { itemIds: itemIds || [] }); },
      listPurchases: function () { return call('PlayBilling', 'listPurchases', {}); },
      listPurchaseHistory: function () { return call('PlayBilling', 'listPurchases', {}); },
      consume: function (purchaseToken) { return call('PlayBilling', 'consume', { purchaseToken: purchaseToken }); }
    });
  };

  /* ---- PaymentRequest (Play only) ---- */
  function NabuPaymentRequest(methods, details) {
    var m = (methods || []).filter(function (x) { return x && x.supportedMethods === PLAY; })[0];
    this._data = (m && m.data) || {};
    this._details = details || {};
  }
  NabuPaymentRequest.prototype.canMakePayment = function () { return Promise.resolve(true); };
  NabuPaymentRequest.prototype.show = function () {
    var d = this._data, args = { sku: d.sku };
    if (d.oldSku) args.oldSku = d.oldSku;
    if (d.purchaseToken) args.oldToken = d.purchaseToken;
    return call('PlayBilling', 'buy', args).then(function (v) {
      return {
        methodName: PLAY,
        details: { purchaseToken: v && v.purchaseToken, itemId: v && v.itemId },
        complete: function () { return Promise.resolve(); }
      };
    }, function (e) {
      /* Only a person closing the sheet is an AbortError (src/billing.js sheetOutcome). */
      throw named(e && e.code === 'cancelled' ? 'AbortError' : 'OperationError', e && e.message);
    });
  };
  /* Play's sheet cannot be closed from outside: refusing is what the site
     expects, and it then tells the buyer the app is still waiting. */
  NabuPaymentRequest.prototype.abort = function () { return Promise.reject(named('InvalidStateError', 'the Play sheet is open')); };
  window.PaymentRequest = NabuPaymentRequest;

  /* ---- Google sign-in on the phone itself ---- */
  function nativeGoogle(auth) {
    return call('FirebaseAuthentication', 'signInWithGoogle', {}).then(function (r) {
      var c = (r && r.credential) || {};
      return auth.signInWithCredential(window.firebase.auth.GoogleAuthProvider.credential(c.idToken, c.accessToken));
    }, function (e) {
      /* Said the way a closed popup is, which backend.js already handles. */
      if (/cancel|error 1001/i.test(String((e && e.message) || ''))) { var x = new Error('cancelled'); x.code = 'auth/popup-closed-by-user'; throw x; }
      throw e;
    });
  }
  function patch() {
    var fb = window.firebase, A = fb && fb.auth && fb.auth.Auth;
    if (!A || !A.prototype || A.prototype.__nabu) return !!(A && A.prototype && A.prototype.__nabu);
    var popup = A.prototype.signInWithPopup, redirect = A.prototype.signInWithRedirect;
    A.prototype.signInWithPopup = function (p) { return p && p.providerId === 'google.com' ? nativeGoogle(this) : popup.apply(this, arguments); };
    A.prototype.signInWithRedirect = function (p) { return p && p.providerId === 'google.com' ? nativeGoogle(this) : redirect.apply(this, arguments); };
    A.prototype.__nabu = true;
    return true;
  }
  /* Firebase arrives with the site's script; look for it until it is there. */
  if (!patch()) {
    var tries = 0, t = setInterval(function () { if (patch() || ++tries > 120) clearInterval(t); }, 250);
  }
})();
