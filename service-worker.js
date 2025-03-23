self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll([
        "/index.html",
        "/pedidos.html",
        "/manifest.json",
        "/css/styles.css",
        "/js/scripts.js",
        "/img/icons/image512x512.png",
        "/img/icons/image192x192.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
