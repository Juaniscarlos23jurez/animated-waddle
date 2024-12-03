// service-worker.js sin Workbox

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
// Asegúrate de que Workbox esté disponible
if (typeof workbox !== 'undefined') {
  console.log('Workbox está disponible.');

  // Estrategia CacheFirst para recursos estáticos (HTML, CSS, JS)
  workbox.routing.registerRoute(
    ({ request }) => {
      return (
        request.destination === 'document' || 
        request.destination === 'style' || 
        request.destination === 'script'
      );
    },
    new workbox.strategies.CacheFirst({
      cacheName: 'static-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50, // Máximo número de recursos cacheados
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semana
        }),
      ],
    })
  );

  // Estrategia CacheFirst para imágenes
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20, // Máximo número de imágenes cacheadas
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        }),
      ],
    })
  );

  // Cache para el archivo de manifiesto y otros archivos estáticos
  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin,
    new workbox.strategies.CacheFirst({
      cacheName: 'html-cache',
    })
  );

} else {
  console.log('Workbox no está disponible.');
}