// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "nossa-maternidade.firebaseapp.com",
  projectId: "nossa-maternidade",
  storageBucket: "nossa-maternidade.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Nossa Maternidade';
  const notificationOptions = {
    body: payload.notification?.body || 'Você tem uma nova notificação',
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: payload.notification?.badge || '/icons/icon-192x192.png',
    image: payload.notification?.image,
    data: payload.data,
    requireInteraction: true,
    silent: false,
    tag: payload.notification?.tag || 'default',
    timestamp: Date.now(),
    vibrate: [200, 100, 200],
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Handle different notification types
  const data = event.notification.data;
  
  if (data?.action) {
    switch (data.action) {
      case 'open_chat':
        event.waitUntil(
          clients.openWindow('/chat')
        );
        break;
      case 'open_community':
        event.waitUntil(
          clients.openWindow('/feed')
        );
        break;
      case 'open_event':
        event.waitUntil(
          clients.openWindow('/events')
        );
        break;
      case 'open_profile':
        event.waitUntil(
          clients.openWindow('/profile')
        );
        break;
      default:
        event.waitUntil(
          clients.openWindow('/')
        );
    }
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Handle push events
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    console.log('Push data:', data);
  }
});
