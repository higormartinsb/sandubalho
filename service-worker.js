self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll([
        "/sandubalho/index.html",
        "/pedidos.html",
        "/sandubalho/manifest.json",
        "/sandubalho/css/styles.css",
        "/sandubalho/js/scripts.js",
        "/sandubalho/img/icons/image512x512.png",
        "/sandubalho/img/icons/image192x192.png"
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
