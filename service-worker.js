// service-worker.js

// Asegúrate de que Workbox esté cargado
if (workbox) {
    console.log('Workbox está cargado');
  
    // Cache de los archivos estáticos, por ejemplo, imágenes, CSS y JS
    workbox.routing.registerRoute(
      ({ request }) => request.destination === 'image',
      new workbox.strategies.CacheFirst({
        cacheName: 'images-cache',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 10,
            maxAgeSeconds: 24 * 60 * 60, // 1 día
          }),
        ],
      })
    );
  
    workbox.routing.registerRoute(
      ({ request }) =>
        request.destination === 'script' || request.destination === 'style',
      new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources-cache',
      })
    );
  
    // Para HTML y otros recursos estáticos
    workbox.routing.registerRoute(
      ({ url }) => url.origin === self.location.origin,
      new workbox.strategies.CacheFirst({
        cacheName: 'html-cache',
      })
    );
  } else {
    console.log('Workbox no está disponible');
  }
  