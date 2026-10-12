// Runs assets/android_bridge.js against a fake app and a fake page, and checks
// it gives src/billing.js and src/backend.js what Chrome's Play bridge gave them.
const fs = require('fs');
const assert = require('assert');

const calls = [];
let answers = {};
const ls = {};
const added = [];
const window = {
  localStorage: { getItem: (k) => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); } },
  document: { documentElement: { appendChild: (n) => added.push(n) }, head: null, createElement: (t) => ({ tag: t, textContent: '' }) },
  flutter_inappwebview: {
    callHandler(name, msg) {
      calls.push([name, msg]);
      const a = answers[msg.method];
      return Promise.resolve(typeof a === 'function' ? a(msg.args) : a || { ok: true, value: null });
    },
  },
  setTimeout, clearTimeout, setInterval, clearInterval,
};
new Function('window', 'localStorage', 'document', 'setInterval', 'clearInterval', fs.readFileSync(process.argv[2], 'utf8'))(
  window, window.localStorage, window.document, setInterval, clearInterval);

(async () => {
  // The site reads isTWA() from this, so it shows the Play shop and no web prices.
  assert.strictEqual(ls['nabu-twa'], 'true');
  // The site's own bottom bar is hidden: the app has its own.
  assert.ok(added.some((n) => n.tag === 'style' && /nav\.nav/.test(n.textContent)));

  // Digital Goods: getDetails / listPurchases / consume go to PlayBilling.
  answers.getDetails = { ok: true, value: [{ itemId: 'tarot', title: 'Tarot', price: { currency: 'VND', value: '199000' } }] };
  const svc = await window.getDigitalGoodsService('https://play.google.com/billing');
  const det = await svc.getDetails(['tarot', 'plus']);
  assert.deepStrictEqual(det[0].price, { currency: 'VND', value: '199000' });
  assert.deepStrictEqual(calls.at(-1)[1], { plugin: 'PlayBilling', method: 'getDetails', args: { itemIds: ['tarot', 'plus'] } });
  answers.listPurchases = { ok: true, value: [{ itemId: 'plus', purchaseToken: 'tok-old' }] };
  assert.deepStrictEqual(await svc.listPurchases(), [{ itemId: 'plus', purchaseToken: 'tok-old' }]);
  await svc.consume('tok-w');
  assert.deepStrictEqual(calls.at(-1)[1].args, { purchaseToken: 'tok-w' });
  await assert.rejects(window.getDigitalGoodsService('https://other.example/pay'));

  // PaymentRequest: show() buys data.sku (and replaces an old plan when asked)
  // and answers details.purchaseToken; complete() resolves.
  answers.buy = (args) => ({ ok: true, value: { purchaseToken: 'tok-new', itemId: args.sku } });
  const req = new window.PaymentRequest([{ supportedMethods: 'https://play.google.com/billing', data: { sku: 'pro', oldSku: 'plus', purchaseToken: 'tok-old' } }],
    { total: { label: 'Pro', amount: { currency: 'VND', value: '0' } } });
  const res = await req.show();
  assert.deepStrictEqual(calls.at(-1)[1], { plugin: 'PlayBilling', method: 'buy', args: { sku: 'pro', oldSku: 'plus', oldToken: 'tok-old' } });
  assert.strictEqual(res.details.purchaseToken, 'tok-new');
  await res.complete('success');

  // A closed sheet is an AbortError (the site's "aborted"); any other failure is not.
  answers.buy = { ok: false, message: 'cancelled', code: 'cancelled' };
  await assert.rejects(new window.PaymentRequest([{ supportedMethods: 'https://play.google.com/billing', data: { sku: 'tarot' } }], {}).show(),
    (e) => e.name === 'AbortError');
  answers.buy = { ok: false, message: 'BillingResponse.error', code: 'error' };
  await assert.rejects(new window.PaymentRequest([{ supportedMethods: 'https://play.google.com/billing', data: { sku: 'tarot' } }], {}).show(),
    (e) => e.name === 'OperationError');
  // abort() is refused while Play's sheet is up: the site then says "still waiting".
  await assert.rejects(new window.PaymentRequest([{ supportedMethods: 'https://play.google.com/billing', data: { sku: 'x' } }], {}).abort());

  // Google sign-in: once Firebase is on the page, a google.com popup becomes the native sheet.
  let usedCred = null;
  function GoogleAuthProvider() { this.providerId = 'google.com'; }
  GoogleAuthProvider.credential = (idToken, at) => ({ idToken, at });
  function Auth() {}
  Auth.prototype.signInWithPopup = async () => 'web popup';
  Auth.prototype.signInWithRedirect = async () => 'web redirect';
  Auth.prototype.signInWithCredential = async function (c) { usedCred = c; return { user: { uid: 'u1' } }; };
  window.firebase = { auth: Object.assign(() => new Auth(), { Auth, GoogleAuthProvider }) };
  await new Promise((r) => setTimeout(r, 450));
  answers.signInWithGoogle = { ok: true, value: { credential: { idToken: 'gid', accessToken: null } } };
  const out = await new Auth().signInWithPopup(new GoogleAuthProvider());
  assert.deepStrictEqual(usedCred, { idToken: 'gid', at: null });
  assert.deepStrictEqual(calls.at(-1)[1], { plugin: 'FirebaseAuthentication', method: 'signInWithGoogle', args: {} });
  assert.strictEqual(out.user.uid, 'u1');
  // A closed Google sheet reads as a closed popup, the code the site already handles.
  answers.signInWithGoogle = { ok: false, message: 'The user canceled the sign-in flow (error 1001)' };
  await assert.rejects(new Auth().signInWithPopup(new GoogleAuthProvider()), (e) => e.code === 'auth/popup-closed-by-user');
  // Other providers keep the web flow.
  assert.strictEqual(await new Auth().signInWithPopup({ providerId: 'facebook.com' }), 'web popup');

  console.log('android bridge ok');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
