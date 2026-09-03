// TEMPLATE:CORE — Service Worker Cache Engine
// TEMPLATE:EDIT — Bump CACHE_NAME whenever you deploy new asset versions
const CACHE_NAME = 'static-landing-v1';

// Scope-aware base path for seamless GitHub Pages subpath and custom domain compatibility
const BASE_SCOPE = self.registration.scope;

const STATIC_ASSETS = [
  new URL('./', BASE_SCOPE).pathname,
  new URL('./index.html', BASE_SCOPE).pathname,
  new URL('./en/', BASE_SCOPE).pathname,
  new URL('./en/index.html', BASE_SCOPE).pathname,
  new URL('./assets/css/style.css?v=3.10.0', BASE_SCOPE).pathname,
  new URL('./assets/js/main.js?v=3.10.0', BASE_SCOPE).pathname,
  new URL('./assets/icons/favicon.svg', BASE_SCOPE).pathname,
  new URL('./assets/icons/icon-192.png', BASE_SCOPE).pathname,
  new URL('./assets/icons/icon-512.png', BASE_SCOPE).pathname,
  new URL('./manifest.json', BASE_SCOPE).pathname
];

const EXTERNAL_ASSETS = [
  'https://fonts.bunny.net/css?family=inter:400,500,600,700,800|jetbrains-mono:400,500,600,700&display=swap'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate: clean all old caches
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

// Fetch: network-first strategy for both HTML and CSS/JS to avoid stale cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external resources (except fonts)
  if (url.origin !== self.location.origin && !url.hostname.includes('bunny.net')) {
    return;
  }

  // Network-first strategy for local requests to always get fresh styles
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
