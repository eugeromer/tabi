const CACHE_NAME = 'tabi-v1';
const ASSETS = [
  '/tabi/app.html',
  '/tabi/index.html',
  '/tabi/app.css',
  '/tabi/app.js',
  '/tabi/index.css',
  '/tabi/index.js',
  '/tabi/frame_5.svg',
  '/tabi/tabi-icon.webp'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names =>
    Promise.all(names.map(n => n !== CACHE_NAME && caches.delete(n)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Only cache assets from the same origin — never Firebase, CDN, or API calls
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
      .catch(() => caches.match('/tabi/index.html'))
  );
});
