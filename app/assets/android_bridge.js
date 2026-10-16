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
    /* The Nabu account this is bought for (a hash), written on the purchase by Play. */
    if (d.account) args.account = d.account;
    return call('PlayBilling', 'buy', args).then(function (v) {
      /* A payment Play holds as pending (cash, a slow bank) is not refused and not done: the sheet
         answers with no token and says so (src/billing.js then says it is waiting and frees the
         shop), and the next restore picks it up once Play settles it. */
      if (v && v.pending) return { methodName: PLAY, details: { pending: true, itemId: v.itemId }, complete: function () { return Promise.resolve(); } };
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
      /* Only a person closing the sheet is said the way a closed popup is (backend.js stays quiet then);
         anything else reaches the page with Google's own reason, so a tap never seems to do nothing. */
      if (e && e.code === 'cancelled') { var x = new Error('cancelled'); x.code = 'auth/popup-closed-by-user'; throw x; }
      var y = new Error((e && e.message) || 'Google sign-in failed'); y.code = 'auth/internal-error'; throw y;
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
  /* Firebase arrives with the site's script, later on a slow network; look for it until it is there,
     and the site asks once more right before it signs anybody in (src/backend.js signIn). */
  window.__nabuPatchAuth = patch;
  if (!patch()) {
    var t = setInterval(function () { if (patch()) clearInterval(t); }, 300);
  }

  /* ---- the phone's share sheet (this web view has no navigator.share) ---- */
  function b64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1] || ''); };
      r.onerror = function () { rej(r.error); };
      r.readAsDataURL(blob);
    });
  }
  function shareFiles(d) {
    var fs = [].slice.call((d && d.files) || []);
    return Promise.all(fs.map(function (f) {
      return b64(f).then(function (x) { return { name: f.name || 'nabu', type: f.type || 'application/octet-stream', data: x }; });
    })).then(function (files) {
      return call('Share', 'share', { title: (d && d.title) || '', text: (d && d.text) || '', url: (d && d.url) || '', files: files });
    }).then(function () {}, function (e) {
      throw named(e && e.code === 'cancelled' ? 'AbortError' : 'NotAllowedError', e && e.message);
    });
  }
  var nav = window.navigator;
  if (nav) {
    nav.canShare = function (d) { return !!d && !!(d.text || d.url || d.title || (d.files && d.files.length)); };
    nav.share = function (d) { return shareFiles(d || {}); };
  }

  /* A download (a calendar file, a picture) has nowhere to go in a web view: it goes to the share
     sheet instead, where Calendar, Photos and Files are. */
  function viaShare(a) {
    var href = a.href, name = a.getAttribute('download') || 'nabu';
    fetch(href).then(function (r) { return r.blob(); }).then(function (blob) {
      return shareFiles({ files: [new File([blob], name, { type: blob.type || 'application/octet-stream' })] });
    }).catch(function () {});
  }
  var A = window.HTMLAnchorElement;
  if (A && A.prototype) {
    var click0 = A.prototype.click;
    A.prototype.click = function () {
      if (this.hasAttribute('download') && /^(blob|data):/.test(this.href || '')) { viaShare(this); return; }
      return click0.apply(this, arguments);
    };
  }
  if (document.addEventListener) document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[download]') : null;
    if (!a || !/^(blob|data):/.test(a.href || '')) return;
    e.preventDefault();
    viaShare(a);
  }, true);
})();
