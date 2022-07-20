self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
});

const cacheName = "about-svelte";

self.addEventListener("fetch", (e) => {
  e.respondWith(
    new Promise(async (res) => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) res(r);
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      if (!r) res(response);
    })
  );
});
