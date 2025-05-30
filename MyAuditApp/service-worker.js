const CACHE_NAME = 'security-audit-cache-v1';
const urlsToCache = [
  './', // This is important if your main HTML file is named index.html and at the root of your server.
  './audit_app.html', // Replace with the actual name of your main HTML file if different.
  // Add other essential local assets here if you had separate CSS or JS files.
  // For CDN assets like Tailwind and Chart.js, the browser handles its own caching;
  // service workers *can* cache them, but it's more complex for cross-origin resources.
  // For simplicity, we're focusing on caching the local app shell.
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // It's important that urlsToCache correctly lists your main HTML file.
        // If audit_app.html is your start_url and is at the root, then './' might also cache it,
        // but being explicit is good.
        let explicitUrlsToCache = [...urlsToCache];
        if (!explicitUrlsToCache.includes('./audit_app.html') && urlsToCache.includes('./interactive_security_audit_spa_v5_pwa_localstorage.html')) {
            // If the old template name is in urlsToCache, replace it or add the new one.
            // For simplicity, assuming you've updated urlsToCache directly if filename changed.
            // Or ensure your actual HTML filename is in urlsToCache.
        } else if (!urlsToCache.find(url => url.endsWith('audit_app.html')) && !urlsToCache.includes('./')) {
            // If neither './' nor the explicit filename is there, you might want to add it.
            // For this generic example, we assume urlsToCache is correctly set up by the developer.
        }
        return cache.addAll(explicitUrlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not found in cache, try to fetch from network
        return fetch(event.request).catch(() => {
          // If network fetch also fails (e.g., offline),
          // you could return a generic offline fallback page here if you had one cached.
          // For now, it will just result in the browser's default offline error.
        });
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});