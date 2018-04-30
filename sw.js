const cacheName = 'pwaPlayground';

const resourcesToPrecache = [
  'index.html',
  'js/app.js',
  'css/style.css'  
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        cache.addAll(resourcesToPrecache);
      })
  );
  e.waitUntil(
    self.skipWaiting()
  )
});

self.addEventListener('activate', e => {
  e.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;

  e.respondWith(
    caches.match(request)
      .then(match => {
        if ( match ) {
          return match;
        }

        const clonedRequest = request.clone();
        return fetch(clonedRequest)
          .then(response => {
            const clonedResponse = response.clone();

            if ( response && /^(2|3)/.test(response.status)) {
              caches.open(cacheName)
                .then(cache => {
                  cache.put(clonedRequest, clonedResponse);  
                });
            }

            return response;
          });
      })
  );
});
