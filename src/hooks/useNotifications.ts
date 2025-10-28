import { useState, useEffect, useCallback } from 'react';
import { firebaseNotificationService, NotificationPayload } from '../services/firebase-notifications.service';

export interface NotificationSettings {
  enabled: boolean;
  community: boolean;
  events: boolean;
  chat: boolean;
  reminders: boolean;
  marketing: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  community: true,
  events: true,
  chat: true,
  reminders: true,
  marketing: false,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
};

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      setIsLoading(true);
      
      try {
        const supported = firebaseNotificationService.isNotificationSupported();
        setIsSupported(supported);
        
        if (supported) {
          const currentPermission = firebaseNotificationService.getPermissionStatus();
          setPermission(currentPermission);
          
          if (currentPermission === 'granted') {
            const fcmToken = await firebaseNotificationService.getToken();
            setToken(fcmToken);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initNotifications();
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    setIsLoading(true);
    
    try {
      const granted = await firebaseNotificationService.requestPermission();
      
      if (granted) {
        setPermission('granted');
        const fcmToken = await firebaseNotificationService.getToken();
        setToken(fcmToken);
        
        // Subscribe to default topics
        await firebaseNotificationService.subscribeToTopic('general');
        await firebaseNotificationService.subscribeToTopic('community');
        
        return true;
      } else {
        setPermission('denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Save to localStorage
    localStorage.setItem('notification-settings', JSON.stringify({ ...settings, ...newSettings }));
  }, [settings]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  // Subscribe to topic
  const subscribeToTopic = useCallback(async (topic: string): Promise<boolean> => {
    if (!token) return false;
    
    try {
      return await firebaseNotificationService.subscribeToTopic(topic);
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      return false;
    }
  }, [token]);

  // Unsubscribe from topic
  const unsubscribeFromTopic = useCallback(async (topic: string): Promise<boolean> => {
    if (!token) return false;
    
    try {
      return await firebaseNotificationService.unsubscribeFromTopic(topic);
    } catch (error) {
      console.error('Error unsubscribing from topic:', error);
      return false;
    }
  }, [token]);

  // Show local notification
  const showNotification = useCallback(async (payload: NotificationPayload) => {
    if (!settings.enabled || permission !== 'granted') return;
    
    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = parseInt(settings.quietHours.start.split(':')[0]) * 60 + parseInt(settings.quietHours.start.split(':')[1]);
      const endTime = parseInt(settings.quietHours.end.split(':')[0]) * 60 + parseInt(settings.quietHours.end.split(':')[1]);
      
      if (startTime > endTime) {
        // Overnight quiet hours
        if (currentTime >= startTime || currentTime <= endTime) {
          return;
        }
      } else {
        // Same day quiet hours
        if (currentTime >= startTime && currentTime <= endTime) {
          return;
        }
      }
    }
    
    await firebaseNotificationService.showLocalNotification(payload);
  }, [settings, permission]);

  // Schedule notification
  const scheduleNotification = useCallback(async (payload: NotificationPayload, delay: number) => {
    if (!settings.enabled || permission !== 'granted') return;
    
    await firebaseNotificationService.scheduleNotification(payload, delay);
  }, [settings, permission]);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    await firebaseNotificationService.clearAllNotifications();
  }, []);

  // Setup message listener
  useEffect(() => {
    if (permission === 'granted') {
      firebaseNotificationService.setupMessageListener((payload) => {
        // Check if notification type is enabled
        const data = payload.data;
        if (data?.type) {
          switch (data.type) {
            case 'community':
              if (!settings.community) return;
              break;
            case 'events':
              if (!settings.events) return;
              break;
            case 'chat':
              if (!settings.chat) return;
              break;
            case 'reminders':
              if (!settings.reminders) return;
              break;
            case 'marketing':
              if (!settings.marketing) return;
              break;
          }
        }
        
        showNotification(payload);
      });
    }
  }, [permission, settings, showNotification]);

  // Common notification templates
  const showCommunityNotification = useCallback((title: string, body: string, data?: any) => {
    if (!settings.community) return;
    
    showNotification({
      title,
      body,
      icon: '/icons/icon-192x192.png',
      data: { ...data, type: 'community', action: 'open_community' },
      requireInteraction: false
    });
  }, [settings.community, showNotification]);

  const showEventNotification = useCallback((title: string, body: string, data?: any) => {
    if (!settings.events) return;
    
    showNotification({
      title,
      body,
      icon: '/icons/icon-192x192.png',
      data: { ...data, type: 'events', action: 'open_event' },
      requireInteraction: true
    });
  }, [settings.events, showNotification]);

  const showChatNotification = useCallback((title: string, body: string, data?: any) => {
    if (!settings.chat) return;
    
    showNotification({
      title,
      body,
      icon: '/icons/icon-192x192.png',
      data: { ...data, type: 'chat', action: 'open_chat' },
      requireInteraction: true
    });
  }, [settings.chat, showNotification]);

  const showReminderNotification = useCallback((title: string, body: string, data?: any) => {
    if (!settings.reminders) return;
    
    showNotification({
      title,
      body,
      icon: '/icons/icon-192x192.png',
      data: { ...data, type: 'reminders' },
      requireInteraction: false
    });
  }, [settings.reminders, showNotification]);

  return {
    // State
    isSupported,
    permission,
    token,
    settings,
    isLoading,
    
    // Actions
    requestPermission,
    updateSettings,
    subscribeToTopic,
    unsubscribeFromTopic,
    showNotification,
    scheduleNotification,
    clearAllNotifications,
    
    // Convenience methods
    showCommunityNotification,
    showEventNotification,
    showChatNotification,
    showReminderNotification
  };
};