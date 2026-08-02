const NONCE_CSP_MODE = new URL(self.location.href).searchParams.get("mode") === "nonce";
const CACHE_NAME = `fibertools-v2-${NONCE_CSP_MODE ? "nonce" : "static"}`;
const PRECACHE_URLS = [
  "/manifest.json",
  "/favicon.svg",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/offline.html",
];

if (!NONCE_CSP_MODE) PRECACHE_URLS.unshift("/");

function isNonceHtml(response) {
  return (
    response.headers.get("x-fibertools-nonce-csp") === "report-only" ||
    /'nonce-[A-Za-z0-9+/]+=*'/.test(
      response.headers.get("content-security-policy-report-only") ||
        response.headers.get("content-security-policy") ||
        "",
    )
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    if (NONCE_CSP_MODE) {
      event.respondWith(
        fetch(request, { cache: "no-store" }).catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match("/offline.html")) || Response.error();
        }),
      );
      return;
    }

    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok && !isNonceHtml(response)) {
            const copy = response.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(url.pathname, copy);
          } else if (isNonceHtml(response)) {
            const cache = await caches.open(CACHE_NAME);
            await cache.delete(url.pathname);
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (
            (await cache.match(url.pathname)) ||
            (await cache.match("/")) ||
            (await cache.match("/offline.html")) ||
            Response.error()
          );
        }),
    );
    return;
  }

  if (["font", "image", "script", "style"].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then(async (response) => {
            if (response.ok) {
              const copy = response.clone();
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, copy);
            }
            return response;
          }),
      ),
    );
  }
});
