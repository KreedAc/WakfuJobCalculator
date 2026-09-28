// Service worker: makes the site installable and usable offline.
//
// Strategies (same-origin GET requests only; /api/* is never cached):
//   pages (navigations)  network-first  → fresh after every deploy, cached copy offline
//   /assets/*            cache-first    → file names are content-hashed, never change
//   everything else      stale-while-revalidate → instant from cache, refreshed in background
//                        (game data JSON, icons, images)
//
// Bump VERSION to drop every cache on the next visit.
const VERSION = 'wjc-v1';
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const RUNTIME = `${VERSION}-runtime`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.add('/')).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match('/')) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  return refresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // e.g. Ankama CDN icons: let the browser handle them
  if (url.pathname.startsWith('/api/')) return; // live gallery data: always from the network

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
