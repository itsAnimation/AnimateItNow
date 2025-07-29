const STATIC_CACHE = 'animateitnow-static-v2';
const DYNAMIC_CACHE = 'animateitnow-dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/contributors.html',
  '/templates.html',
  '/leaderboard.html',
  '/styles.css',
  '/glassmorphismstyle.css',
  '/script.js',
  '/images/logo.png',
  '/images/bg.jpg',
  '/images/bgdark.png',
  '/images/pa.png',
  // Template files
  '/templates/animated-btn.html',
  '/templates/button.html',
  '/templates/card_hover.html',
  '/templates/CardHoverEffects.html',
  '/templates/carousel.html',
  '/templates/glassmorphism.html',
  '/templates/hero.html',
  '/templates/loader.html',
  '/templates/login.html',
  '/templates/modal.html',
  '/templates/navbar.html',
  '/templates/neumorphic.html',
  '/templates/profile_card.html',
  '/templates/social-share-buttons.html',
  '/templates/tilt-card.html',
  '/templates/timer.html',
  '/templates/tooltip.html',
  // External CDN
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting(); // Immediately activate new service worker
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Claim control immediately
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request.clone()).then((response) => {
        if (
          !response ||
          response.status !== 200 ||
          response.type !== 'basic'
        ) {
          return response;
        }

        const responseToCache = response.clone();
        const url = new URL(request.url);

        // Cache only HTML, CSS, JS, images
        if (
          request.destination === 'document' ||
          request.destination === 'style' ||
          request.destination === 'script' ||
          request.destination === 'image' ||
          url.pathname.match(/\.(html|css|js|png|jpg|jpeg|gif|svg)$/)
        ) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return response;
      }).catch(() => {
        // Optional fallback page
        if (request.destination === 'document') {
          return caches.match('/templates/404.html');
        }
      });
    })
  );
});
