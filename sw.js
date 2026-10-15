// Keeps the translator usable offline: caches the page, its worker and the
// translation library. Requests from the other pages are left untouched.
const CACHE = 'dfp-translator-v1';
const PAGES = ['translate.html', 'translate-worker.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PAGES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('dfp-translator-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  // The translator page and worker: network first so updates arrive, cache when offline.
  if (url.origin === location.origin && PAGES.some(p => url.pathname.endsWith('/' + p))) {
    e.respondWith(fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })));
    return;
  }

  // The translation library and its WebAssembly runtime: versioned URLs, so cache first.
  if (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/@huggingface/transformers@')) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    })));
  }
});
