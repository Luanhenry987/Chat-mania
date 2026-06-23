importScripts('https://cdn.webpushr.com/sw-server.min.js');

// O sistema de cache do seu chat antigo foi movido para cá (Sem Firebase!)
const CACHE_NAME = 'app-cache-v3';

self.addEventListener('install', e => {
  self.skipWaiting(); 
  e.waitUntil(caches.open(CACHE_NAME).then(c => {
    return c.addAll(['./', './index.html']);
  }));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) 
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('webpushr.com')) return;
  
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
