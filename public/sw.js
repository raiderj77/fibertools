const CACHE_NAME = "fibertools-v3";
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

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

function isEmbedPathname(pathname) {
  return pathname === "/embed" || pathname.startsWith("/embed/");
}

async function belongsToEmbedClient(event) {
  if (!event.clientId) return false;

  const client = await self.clients.get(event.clientId);
  if (!client?.url) return false;

  try {
    const clientUrl = new URL(client.url);
    return clientUrl.origin === self.location.origin && isEmbedPathname(clientUrl.pathname);
  } catch {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (isEmbedPathname(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const copy = response.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(url.pathname, copy);
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(url.pathname)) || (await cache.match("/")) || Response.error();
        }),
    );
    return;
  }

  if (["font", "image", "script", "style"].includes(request.destination)) {
    event.respondWith(
      (async () => {
        if (await belongsToEmbedClient(event)) return fetch(request);

        const cached = await caches.match(request);
        if (cached) return cached;

        const response = await fetch(request);
        if (response.ok) {
          const copy = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, copy);
        }
        return response;
      })(),
    );
  }
});
