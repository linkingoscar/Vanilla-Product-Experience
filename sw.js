// VPE:CORE — Service Worker Cache Engine
// Bump CACHE_NAME whenever the exact precache dependency graph changes.
const CACHE_NAME = 'vpe-v1.0.0-cache-001';

const BASE_SCOPE = self.registration.scope;

// Exact query strings are deliberate cache keys. Keep them aligned with the
// public entrypoints and internal module versions documented in VERSIONING.md.
const STATIC_ASSETS = [
  new URL('./', BASE_SCOPE).href,
  new URL('./index.html', BASE_SCOPE).href,
  new URL('./en/', BASE_SCOPE).href,
  new URL('./en/index.html', BASE_SCOPE).href,
  new URL('./assets/css/style.css?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/js/main.js?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/css/style-base.css?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/css/liquid-glass.css?v=0.1.2', BASE_SCOPE).href,
  new URL('./assets/css/liquid-glass-v2.css?v=0.2.0', BASE_SCOPE).href,
  new URL('./assets/css/liquid-glass-components.css?v=0.3.0', BASE_SCOPE).href,
  new URL('./assets/css/ambient-particles.css?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/css/site-motion.css?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/css/product-ui.css?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/css/product-ui-media.css?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/css/experience-integration.css?v=1.0.0', BASE_SCOPE).href,
  new URL('./assets/js/main-base.js?v=3.10.0', BASE_SCOPE).href,
  new URL('./assets/js/liquid-glass.js?v=0.1.3', BASE_SCOPE).href,
  new URL('./assets/js/liquid-glass-v2.js?v=0.2.1', BASE_SCOPE).href,
  new URL('./assets/js/liquid-glass-components.js?v=0.3.1', BASE_SCOPE).href,
  new URL('./assets/js/ambient/particle-renderer-webgl.js?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/js/ambient/interaction-field.js?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/js/ambient/particle-field.js?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/js/motion/spring.js?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/js/motion/layout-motion.js?v=0.1.1', BASE_SCOPE).href,
  new URL('./assets/js/motion/number-motion.js?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/js/motion/site-motion.js?v=0.1.0', BASE_SCOPE).href,
  new URL('./assets/js/product-ui.js?v=0.1.1', BASE_SCOPE).href,
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
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS)
        .then(() => Promise.allSettled(EXTERNAL_ASSETS.map((url) => cache.add(url))))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.hostname.includes('bunny.net')) return;

  // Bootstrap/runtime files that historically suffered stale-query migrations
  // are explicitly revalidated. Offline fallback still uses exact Cache Storage.
  const forceFreshRuntime = url.origin === self.location.origin && (
    url.pathname.endsWith('/assets/js/main.js') ||
    url.pathname.endsWith('/assets/css/style.css') ||
    url.pathname.endsWith('/assets/js/motion/layout-motion.js')
  );
  const networkRequest = forceFreshRuntime
    ? new Request(request, { cache: 'reload' })
    : request;

  event.respondWith(
    fetch(networkRequest)
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
