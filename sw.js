const CACHE_NAME = 'cursor3-intro-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/en/',
  '/en/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/icons/favicon.svg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/manifest.json'
];

const EXTERNAL_ASSETS = [
  'https://fonts.bunny.net/css?family=inter:400,500,600,700,800|jetbrains-mono:400,500,600,700&display=swap'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for pages, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external resources (except fonts)
  if (url.origin !== self.location.origin && !url.hostname.includes('bunny.net')) {
    return;
  }

  // Network-first strategy for HTML pages
  if (request.headers.get('Accept') && request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});
