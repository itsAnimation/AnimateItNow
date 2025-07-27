const CACHE_NAME = 'animateitnow-v1';
const STATIC_CACHE = 'animateitnow-static-v1';
const DYNAMIC_CACHE = 'animateitnow-dynamic-v1';

// Files to cache immediately
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
  // External CDN resources (cache these for offline use)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
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
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request because it's a stream
        const fetchRequest = request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream
            const responseToCache = response.clone();
            const url = new URL(request.url);

            // Cache HTML, CSS, JS, and image files
            if (
              request.destination === 'document' ||
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'image' ||
              url.pathname.endsWith('.html') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.jpeg') ||
              url.pathname.endsWith('.gif') ||
              url.pathname.endsWith('.svg')
            ) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML pages
            if (request.destination === 'document') {
              return caches.match('/templates/404.html');
            }
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  // Handle background sync tasks here if needed
});

// Push notification handling (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icons/icon-192x192.png',
      badge: '/images/icons/icon-72x72.png',
      data: data.url
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
