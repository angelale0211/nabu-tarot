/* What both phone apps add to the site so it behaves as an app, not a web page
   (injected before the site's script, after assets/bridge.js or
   assets/android_bridge.js, on nabutarot.com only):
     - notifications: window.Notification answered by the phone's own
       notifications (Notify), so the site's reminders reach the status bar
     - links and windows: target=_blank and window.open become one navigation
       the app routes (lib/shell/links.dart), so nothing opens a dead window
     - the status bar follows the site's theme (App.ground)
     - who is signed in is told to the app, which files the notification token
       under that account and forgets it on sign-out
     - no web look: no text selection on buttons and labels, no long-press
       menu, no tap flash. Fields, and text people read, stay selectable. */
(function () {
  if (window.__nabuApp) return;
  window.__nabuApp = true;

  function call(plugin, method, args) {
    var h = window.flutter_inappwebview;
    if (!h || typeof h.callHandler !== 'function') return Promise.reject(new Error('the app bridge is not ready'));
    return h.callHandler('nabu', { plugin: plugin, method: method, args: args || {} }).then(function (r) {
      if (r && r.ok) return r.value;
      var e = new Error((r && r.message) || 'failed');
      if (r && r.code) e.code = r.code;
      throw e;
    });
  }
  /* The handler arrives a moment after the page starts; calls made before then wait for it. */
  function ready(fn) {
    if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) return fn();
    window.addEventListener('flutterInAppWebViewPlatformReady', function once() { window.removeEventListener('flutterInAppWebViewPlatformReady', once); fn(); });
  }

  /* ---- notifications ---- */
  function NabuNotification(title, opts) {
    opts = opts || {};
    this.title = String(title || '');
    this.body = opts.body || '';
    this.onclick = null;
    var hash = (opts.data && opts.data.hash) || '';
    call('Notify', 'show', { title: this.title, body: this.body, tag: opts.tag || '', hash: hash }).catch(function () {});
  }
  NabuNotification.prototype.close = function () {};
  NabuNotification.permission = 'default';
  NabuNotification.requestPermission = function (cb) {
    return call('Notify', 'request', {}).then(function (p) {
      NabuNotification.permission = p; if (typeof cb === 'function') cb(p); return p;
    }, function () { return NabuNotification.permission; });
  };
  window.Notification = NabuNotification;
  ready(function () { call('Notify', 'permission', {}).then(function (p) { NabuNotification.permission = p; }).catch(function () {}); });

  /* ---- links and windows ---- */
  function go(u) {
    try { location.href = new URL(String(u), location.href).href; } catch (e) { /* not an address */ }
  }
  window.open = function (u) { if (u) go(u); return null; };
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    var a = e.target && e.target.closest ? e.target.closest('a[target="_blank"]') : null;
    if (!a || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    e.preventDefault();
    go(a.href);
  }, false);

  /* ---- the status bar and the ground behind the page follow the theme ---- */
  var lastGround = '';
  function ground() {
    var b = document.body;
    if (!b) return;
    var c = getComputedStyle(b).backgroundColor || '';
    if (!c || c === lastGround || /rgba\(0, 0, 0, 0\)|transparent/.test(c)) return;
    lastGround = c;
    call('App', 'ground', { color: c }).catch(function () {});
  }
  function watchTheme() {
    ground();
    new MutationObserver(function () { setTimeout(ground, 60); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', function () { setTimeout(ground, 60); });
    }
  }

  /* ---- who is signed in ---- */
  var lastUser = null;
  function watchAuth() {
    var fb = window.firebase;
    if (!fb || !fb.apps || !fb.apps.length || typeof fb.auth !== 'function') return false;
    fb.auth().onAuthStateChanged(function (u) {
      var now = !!u;
      if (now === lastUser) return;
      lastUser = now;
      call('FirebaseAuthentication', '__state', { signedIn: now }).catch(function () {});
    });
    return true;
  }

  /* ---- no web look ---- */
  var css = 'html{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}'
    + 'button,.btn,a,nav,header,footer,label,.chip,.tab,.tabs,.slot,.card h3,.eyebrow,img,svg{-webkit-user-select:none;user-select:none}'
    + 'input,textarea,select,[contenteditable]{-webkit-user-select:text;user-select:text;-webkit-touch-callout:default}';
  function addStyle() {
    var root = document.head || document.documentElement;
    if (!root || document.getElementById('nabu-app-css')) return !!root;
    var style = document.createElement('style');
    style.id = 'nabu-app-css';
    style.textContent = css;
    root.appendChild(style);
    return true;
  }
  /* At the very start of a page there may be no document element yet. */
  if (!addStyle()) new MutationObserver(function (m, o) { if (addStyle()) o.disconnect(); }).observe(document, { childList: true, subtree: true });

  function onReady() {
    addStyle();
    ready(watchTheme);
    var tries = 0;
    var t = setInterval(function () { if (watchAuth() || ++tries > 600) clearInterval(t); }, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady); else onReady();
})();
