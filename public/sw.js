// MyChronos Service Worker
const CACHE_VERSION = 'v1'
const CACHE_NAME = `mychronos-${CACHE_VERSION}`
const STATIC_CACHE = `mychronos-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `mychronos-dynamic-${CACHE_VERSION}`

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/register',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets')
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Failed to cache some assets:', err)
      })
    }).then(() => {
      console.log('[Service Worker] Installed successfully')
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('mychronos-') && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[Service Worker] Activated successfully')
      return self.clients.claim()
    })
  )
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip caching for localhost development files
  if (url.hostname === 'localhost' && (
    url.pathname.includes('/_next/') ||
    url.pathname.includes('/static/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.map')
  )) {
    // Always fetch fresh in development
    event.respondWith(fetch(request))
    return
  }

  // Skip caching for API routes (except /api/time which can be cached briefly)
  if (url.pathname.startsWith('/api/')) {
    // Network-first strategy for APIs
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses briefly
          if (response.ok && url.pathname === '/api/time') {
            const clonedResponse = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clonedResponse)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache for /api/time only
          if (url.pathname === '/api/time') {
            return caches.match(request)
          }
          // Return error response for other APIs
          return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          })
        })
    )
    return
  }

  // Skip caching for authentication endpoints
  if (url.pathname.includes('/api/auth/')) {
    event.respondWith(fetch(request))
    return
  }

  // Cache-first strategy for static assets (only images and fonts in production)
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const clonedResponse = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clonedResponse)
            })
          }
          return response
        })
      })
    )
    return
  }

  // Network-first strategy for HTML pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clonedResponse = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clonedResponse)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          // Return offline page
          return caches.match('/dashboard')
        })
      })
  )
})

// Background sync for offline agenda creation
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag)
  
  if (event.tag === 'sync-agendas') {
    event.waitUntil(syncAgendas())
  }
})

async function syncAgendas() {
  try {
    // Get pending agendas from IndexedDB (to be implemented)
    console.log('[Service Worker] Syncing pending agendas...')
    // This would sync any agendas created while offline
    return Promise.resolve()
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error)
    throw error
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received')
  
  let data = { title: 'MyChronos', body: 'New notification' }
  
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data.body = event.data.text()
    }
  }
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/dashboard',
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data || '/dashboard'
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus()
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
    )
  }
})

// Message handler for client communication
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data)
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll(event.data.urls)
      })
    )
  }
})

console.log('[Service Worker] Loaded successfully')
