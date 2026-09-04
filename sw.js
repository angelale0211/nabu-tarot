/* Nabu Tarot -- offline cache. Bump CACHE on every release. */
const CACHE = 'nabu-tarot-v26';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png', './icon-512-maskable.png', './posts.json', './schedule.json', './fb.json', './horoscope.json'];
const LIVE = /\/(posts|schedule|fb|horoscope)\.json$/;

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
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
