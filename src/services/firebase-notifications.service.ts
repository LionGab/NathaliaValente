import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nossa-maternidade.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nossa-maternidade",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nossa-maternidade.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
  vibrate?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class FirebaseNotificationService {
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || "demo-vapid-key";
  private isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.initializeServiceWorker();
  }

  private async initializeServiceWorker() {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      
      if (this.permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    if (!this.isSupported || this.permission !== 'granted') {
      return null;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: this.vapidKey
      });
      
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      return null;
    }
  }

  async subscribeToTopic(topic: string): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return false;

      // In a real implementation, you would send this to your backend
      // which would then subscribe the token to the topic
      console.log(`Subscribing token to topic: ${topic}`);
      
      // Mock implementation - in reality, this would be an API call
      return true;
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) return false;

      // In a real implementation, you would send this to your backend
      console.log(`Unsubscribing token from topic: ${topic}`);
      
      // Mock implementation - in reality, this would be an API call
      return true;
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }

  setupMessageListener(onMessageReceived: (payload: NotificationPayload) => void) {
    if (!this.isSupported) return;

    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      
      const notificationPayload: NotificationPayload = {
        title: payload.notification?.title || 'Nossa Maternidade',
        body: payload.notification?.body || 'Você tem uma nova notificação',
        icon: payload.notification?.icon || '/icons/icon-192x192.png',
        badge: payload.notification?.badge || '/icons/icon-192x192.png',
        image: payload.notification?.image,
        data: payload.data,
        requireInteraction: true,
        silent: false,
        tag: payload.notification?.tag || 'default',
        timestamp: Date.now(),
        vibrate: [200, 100, 200]
      };

      onMessageReceived(notificationPayload);
    });
  }

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/icon-192x192.png',
        image: payload.image,
        data: payload.data,
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false,
        tag: payload.tag || 'default',
        timestamp: payload.timestamp || Date.now(),
        vibrate: payload.vibrate || [200, 100, 200],
        actions: payload.actions
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Handle different actions based on data
        if (payload.data?.action) {
          this.handleNotificationAction(payload.data.action, payload.data);
        }
        
        notification.close();
      };

      // Auto-close after 5 seconds if not requiring interaction
      if (!payload.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    } catch (error) {
      console.error('Error showing local notification:', error);
    }
  }

  private handleNotificationAction(action: string, data: any) {
    switch (action) {
      case 'open_chat':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'chat' } }));
        break;
      case 'open_community':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }));
        break;
      case 'open_event':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'events' } }));
        break;
      case 'open_profile':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'profile' } }));
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  async scheduleNotification(payload: NotificationPayload, delay: number): Promise<void> {
    setTimeout(() => {
      this.showLocalNotification(payload);
    }, delay);
  }

  async clearAllNotifications(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const notifications = await registration.getNotifications();
        notifications.forEach(notification => notification.close());
      }
    }
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  isNotificationSupported(): boolean {
    return this.isSupported;
  }
}

// Create singleton instance
export const firebaseNotificationService = new FirebaseNotificationService();

// Export types and service
export default firebaseNotificationService;
