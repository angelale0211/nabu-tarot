/* The iPhone app's side of the site's native calls.

   The site (src/backend.js, src/billing-apple.js) was written for a Capacitor
   shell and asks window.Capacitor for two plugins. This recreates exactly that
   surface and sends every call to the Flutter app through
   flutter_inappwebview's callHandler('nabu', {plugin, method, args}). Injected
   before the site's own script runs, so iosShell() already sees it. */
(function () {
  if (window.Capacitor && window.Capacitor.__nabu) return;
  var NAMES = ['NativePurchases', 'FirebaseAuthentication'];
  var listeners = {};

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

  function addListener(plugin, event, cb) {
    var byEvent = listeners[plugin] || (listeners[plugin] = {});
    var list = byEvent[event] || (byEvent[event] = []);
    list.push(cb);
    var handle = { remove: function () { var i = list.indexOf(cb); if (i > -1) list.splice(i, 1); return Promise.resolve(); } };
    return handle;
  }

  function plugin(name) {
    return new Proxy({}, {
      get: function (_, prop) {
        if (typeof prop !== 'string' || prop === 'then') return undefined;
        if (prop === 'addListener') return function (event, cb) { return addListener(name, event, cb); };
        return function (args) { return call(name, prop, args); };
      }
    });
  }

  var Plugins = {};
  NAMES.forEach(function (n) { Plugins[n] = plugin(n); });

  window.__nabuEmit = function (pluginName, event, data) {
    var list = ((listeners[pluginName] || {})[event] || []).slice();
    list.forEach(function (cb) { try { cb(data); } catch (e) { /* one listener must not stop the others */ } });
  };

  window.Capacitor = {
    __nabu: true,
    Plugins: Plugins,
    getPlatform: function () { return 'ios'; },
    isNativePlatform: function () { return true; },
    isPluginAvailable: function (n) { return NAMES.indexOf(n) > -1; },
    registerPlugin: function (n) { return Plugins[n]; }
  };
})();
