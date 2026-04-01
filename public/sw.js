const CACHE_NAME = 'fibertools-v2';
const STATIC_ASSETS = [
  '/manifest.json'
];

// Install — cache core shell and take over immediately
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches (including legacy 'privacy-toolkit-v1')
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - Navigation requests (HTML pages): network-first with cache fallback
// - Static assets (JS, CSS, images): stale-while-revalidate
// - External requests: network-only
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // External requests — network only, no caching
  if (url.origin !== location.origin) return;

  // Navigation requests (HTML pages) — always network-first
  // This ensures users always see the latest content on page load
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images) — stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const networkFetch = fetch(e.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});
