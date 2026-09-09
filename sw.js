/* Nabu Tarot -- offline cache. Bump CACHE on every release. */
const CACHE = 'nabu-tarot-v206';
/* icon-512-round.png is the loading screen's mark, so it belongs here with the
   rest of the shell: it is wanted at the very first paint of a cold start, and
   an app opened with no signal would otherwise show the purple with nothing on
   it - which is the thing the loading screen exists to avoid. */
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png', './icon-512-maskable.png', './icon-512-round.png', './posts.json', './schedule.json', './fb.json', './horoscope.json'];
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
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
    if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
    return res;
  }).catch(() => caches.match('./index.html'))));
});
