// Runs assets/bridge.js against a fake WKWebView handler and checks it
// answers the way src/backend.js and src/billing-apple.js expect.
const fs = require('fs');
const assert = require('assert');

const calls = [];
const window = {
  flutter_inappwebview: {
    callHandler(name, msg) {
      calls.push([name, msg]);
      if (msg.method === 'fail') return Promise.resolve({ ok: false, message: 'The user canceled (error 1001)' });
      if (msg.method === 'failCode') return Promise.resolve({ ok: false, message: 'Pending', code: 'pending' });
      return Promise.resolve({ ok: true, value: { echo: msg.args } });
    },
  },
};
new Function('window', fs.readFileSync(process.argv[2], 'utf8'))(window);

(async () => {
  const C = window.Capacitor;
  assert.strictEqual(C.getPlatform(), 'ios');
  assert.strictEqual(C.isPluginAvailable('NativePurchases'), true);
  assert.strictEqual(C.isPluginAvailable('Nope'), false);
  assert.strictEqual(C.registerPlugin('FirebaseAuthentication'), C.Plugins.FirebaseAuthentication);

  // A method answers through callHandler('nabu', {plugin, method, args}).
  const got = await C.Plugins.NativePurchases.getProducts({ productIdentifiers: ['tarot'] });
  assert.deepStrictEqual(got, { echo: { productIdentifiers: ['tarot'] } });
  assert.deepStrictEqual(calls[0], ['nabu', { plugin: 'NativePurchases', method: 'getProducts', args: { productIdentifiers: ['tarot'] } }]);

  // No argument means {}.
  await C.Plugins.FirebaseAuthentication.signOut();
  assert.deepStrictEqual(calls[1][1].args, {});

  // A refusal is a rejected promise with the message, and a code only when given.
  await assert.rejects(C.Plugins.FirebaseAuthentication.fail(), (e) => /error 1001/.test(e.message) && e.code === undefined);
  await assert.rejects(C.Plugins.NativePurchases.failCode(), (e) => e.code === 'pending');

  // typeof checks used by the site see functions.
  assert.strictEqual(typeof C.Plugins.NativePurchases.acknowledgePurchase, 'function');
  assert.strictEqual(typeof C.Plugins.NativePurchases.addListener, 'function');

  // Events reach listeners; remove() stops them.
  const seen = [];
  const h = C.Plugins.NativePurchases.addListener('transactionUpdated', (d) => seen.push(d));
  window.__nabuEmit('NativePurchases', 'transactionUpdated', { transactionId: '1' });
  h.remove();
  window.__nabuEmit('NativePurchases', 'transactionUpdated', { transactionId: '2' });
  assert.deepStrictEqual(seen, [{ transactionId: '1' }]);

  // Not a thenable: awaiting a plugin object must not call a "then" method.
  assert.strictEqual(C.Plugins.NativePurchases.then, undefined);

  console.log('bridge ok');
})().catch((e) => { console.error(e); process.exit(1); });
