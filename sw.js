/* Nabu Tarot -- offline cache. Bump CACHE on every release. */
const CACHE = 'nabu-tarot-v233';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png', './icon-512-maskable.png', './posts.json', './schedule.json', './fb.json', './horoscope.json'];
const LIVE = /\/(posts|schedule|fb|horoscope|activities|activities-stock)\.json$/;

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Firebase, GitHub API, social links: straight through
  if (/\.apk$/.test(url.pathname)) return;        // the Android installer downloads straight from the site
  if (LIVE.test(url.pathname)) {
    const key = './' + url.pathname.split('/').pop();
    e.respondWith(fetch(e.request).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(key, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(key)));
    return;
  }
  // The page itself is network-first: online visitors always get the newest
  // release, the cached copy is only for offline use.
  if (e.request.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname)) {
    e.respondWith(fetch(e.request).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  /* Everything else - the icons, the course answers that index.html fetches
     when a card is opened - is served from the cache first and kept there the
     first time it is fetched.

     The last resort is the page itself, which is right for a navigation that
     arrived here by some other route and wrong for anything the page loads:
     handing index.html back as if it were a script means the browser parses
     HTML as JavaScript and reports a syntax error, which says nothing about
     the real problem, no signal. A script that cannot be fetched fails as a
     script, and learn.js already treats that as "no answers this time". */
  const asPage = !/\.(js|css|png|jpg|jpeg|svg|webp|woff2?|json)$/.test(url.pathname);
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
    return res;
  }).catch(() => (asPage ? caches.match('./index.html') : Response.error()))));
});

// A tap on a notification the page raised through this worker. Android only
// shows worker-raised notifications, so this is where their tap lands: bring
// the app to the front and tell the page where to go. With no window open,
// open one at that place.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const hash = (e.notification.data && e.notification.data.hash) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    const c = list[0];
    if (c) return c.focus().then(() => { if (hash) c.postMessage({ type: 'nabu-open', hash: hash }); }).catch(() => {});
    return self.clients.openWindow('./' + hash);
  }));
});
