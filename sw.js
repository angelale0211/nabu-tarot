/* Nabu Tarot -- offline cache. Bump CACHE on every release. */
const CACHE = 'nabu-tarot-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png', './posts.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // GitHub API, social links: straight through
  const isPosts = /\/posts\.json$/.test(url.pathname);
  if (isPosts) {
    // The feed changes often: try the network, fall back to the last copy.
    e.respondWith(fetch(e.request).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./posts.json', copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match('./posts.json')));
    return;
  }
  // The shell changes only with a release: cache first.
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)
    .then((res) => {
      if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); }
      return res;
    })
    .catch(() => caches.match('./index.html'))));
});
