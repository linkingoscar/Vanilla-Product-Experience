// TEMPLATE:CORE — Service Worker Cache Engine
// TEMPLATE:EDIT — Bump CACHE_NAME whenever you deploy new asset versions
const CACHE_NAME = 'static-landing-v3-liquid-glass-0311';

// Scope-aware base path for GitHub Pages subpaths and custom domains.
const BASE_SCOPE = self.registration.scope;

// Keep the exact query strings used by the HTML/wrappers. Cache keys therefore
// match the real requests instead of silently dropping ?v=... via `.pathname`.
const STATIC_ASSETS = [
  new URL('./', BASE_SCOPE).href,
  new URL('./index.html', BASE_SCOPE).href,
  new URL('./en/', BASE_SCOPE).href,
  new URL('./en/index.html', BASE_SCOPE).href,

  // Public entrypoints referenced by index.html / en/index.html
  new URL('./assets/css/style.css?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/js/main.js?v=3.10.0', BASE_SCOPE).href,

  // Entrypoint dependency graph — required for true offline rendering.
  new URL('./assets/css/style-base.css?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/css/liquid-glass.css?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/css/liquid-glass-v2.css?v=0.2.0', BASE_SCOPE).href,
  new URL('./assets/css/liquid-glass-components.css?v=0.3.0', BASE_SCOPE).href,
  new URL('./assets/js/main-base.js?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/js/liquid-glass.js?v=0.1.1', BASE_SCOPE).href,
  new URL('./assets/js/liquid-glass-v2.js?v=0.2.1', BASE_SCOPE).href,
  new URL('./assets/js/liquid-glass-components.js?v=0.3.1', BASE_SCOPE).href,

  new URL('./assets/icons/favicon.svg', BASE_SCOPE).href,
  new URL('./assets/icons/icon-192.png', BASE_SCOPE).href,
  new URL('./assets/icons/icon-512.png', BASE_SCOPE).href,
  new URL('./manifest.json', BASE_SCOPE).href
];

const EXTERNAL_ASSETS = [
  'https://fonts.bunny.net/css?family=inter:400,500,600,700,800|jetbrains-mono:400,500,600,700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // External font availability must never prevent the app shell installing.
      return cache.addAll(STATIC_ASSETS)
        .then(() => Promise.allSettled(EXTERNAL_ASSETS.map((url) => cache.add(url))));
    })
  );
  self.skipWaiting();
});

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

// Network-first keeps rapidly evolving template/optical code fresh. If the
// network is unavailable, exact versioned keys are used first; ignoreSearch is
// a final compatibility fallback for older cached deployments.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.origin !== self.location.origin && !url.hostname.includes('bunny.net')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        const exact = await caches.match(request);
        if (exact) return exact;
        return caches.match(request, { ignoreSearch: true });
      })
  );
});
