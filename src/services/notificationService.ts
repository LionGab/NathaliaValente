/**
 * ClubNath Notification Service
 *
 * Client-side service for managing notifications, preferences, and push tokens
 */

import { supabase } from '../lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationPreferences {
  id: string;
  user_id: string;
  enable_push: boolean;
  enable_email: boolean;
  enable_in_app: boolean;
  enable_community_activity: boolean;
  enable_new_content: boolean;
  enable_daily_encouragement: boolean;
  enable_habit_reminders: boolean;
  enable_chat_responses: boolean;
  enable_badges: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  preferred_time_morning: string;
  preferred_time_evening: string;
  timezone: string;
  max_community_per_day: number;
  max_content_per_day: number;
  max_reminders_per_day: number;
  followed_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  template_key: string | null;
  title: string;
  body: string;
  deep_link: string | null;
  status: 'pending' | 'sent' | 'failed' | 'read';
  delivery_method: string;
  data: Record<string, any> | null;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface SendNotificationRequest {
  user_id: string;
  template_key?: string;
  template_data?: Record<string, any>;
  custom_title?: string;
  custom_body?: string;
  custom_deep_link?: string;
  delivery_method?: 'push' | 'email' | 'in_app' | 'all';
  scheduled_for?: string;
  priority?: 'high' | 'normal' | 'low';
}

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

export class NotificationService {
  /**
   * Get user's notification preferences
   */
  static async getPreferences(): Promise<NotificationPreferences | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching notification preferences:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPreferences:', error);
      return null;
    }
  }

  /**
   * Update user's notification preferences
   */
  static async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notification_preferences')
        .update(preferences)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating notification preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return false;
    }
  }

  /**
   * Toggle a specific notification category
   */
  static async toggleCategory(
    category: keyof Pick<
      NotificationPreferences,
      | 'enable_community_activity'
      | 'enable_new_content'
      | 'enable_daily_encouragement'
      | 'enable_habit_reminders'
      | 'enable_chat_responses'
      | 'enable_badges'
    >,
    enabled: boolean
  ): Promise<boolean> {
    return this.updatePreferences({ [category]: enabled });
  }

  /**
   * Set quiet hours
   */
  static async setQuietHours(
    startTime: string | null,
    endTime: string | null
  ): Promise<boolean> {
    return this.updatePreferences({
      quiet_hours_start: startTime,
      quiet_hours_end: endTime,
    });
  }

  /**
   * Update followed categories for content notifications
   */
  static async updateFollowedCategories(
    categories: string[]
  ): Promise<boolean> {
    return this.updatePreferences({
      followed_categories: categories,
    });
  }

  // ============================================================================
  // PUSH TOKENS
  // ============================================================================

  /**
   * Register device push token
   */
  static async registerPushToken(
    token: string,
    platform: 'ios' | 'android' | 'web',
    deviceName?: string
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.from('push_tokens').upsert(
        {
          user_id: user.id,
          token,
          platform,
          device_name: deviceName || null,
          is_active: true,
          last_used_at: new Date().toISOString(),
        },
        {
          onConflict: 'token',
        }
      );

      if (error) {
        console.error('Error registering push token:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in registerPushToken:', error);
      return false;
    }
  }

  /**
   * Remove push token (e.g., on logout)
   */
  static async removePushToken(token: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('push_tokens')
        .update({ is_active: false })
        .eq('token', token);

      if (error) {
        console.error('Error removing push token:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removePushToken:', error);
      return false;
    }
  }

  /**
   * Get all active push tokens for current user
   */
  static async getActivePushTokens(): Promise<any[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('push_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching push tokens:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActivePushTokens:', error);
      return [];
    }
  }

  // ============================================================================
  // IN-APP NOTIFICATIONS
  // ============================================================================

  /**
   * Get unread in-app notifications
   */
  static async getUnreadNotifications(): Promise<InAppNotification[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('delivery_method', 'in_app')
        .is('read_at', null)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching unread notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUnreadNotifications:', error);
      return [];
    }
  }

  /**
   * Get all in-app notifications (with pagination)
   */
  static async getNotifications(
    limit: number = 20,
    offset: number = 0
  ): Promise<InAppNotification[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .eq('delivery_method', 'in_app')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_history')
        .update({
          read_at: new Date().toISOString(),
          status: 'read',
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('notification_history')
        .update({
          read_at: new Date().toISOString(),
          status: 'read',
        })
        .eq('user_id', user.id)
        .eq('delivery_method', 'in_app')
        .is('read_at', null);

      if (error) {
        console.error('Error marking all as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('notification_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('delivery_method', 'in_app')
        .is('read_at', null);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================

  /**
   * Subscribe to new notifications in real-time
   * Note: This will only work when user is authenticated
   */
  static async subscribeToNotifications(
    onNotification: (notification: InAppNotification) => void
  ): Promise<(() => void) | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not authenticated');
        return null;
      }

      const channel = supabase
        .channel('notifications')
        .on<InAppNotification>(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notification_history',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            onNotification(payload.new);
          }
        )
        .subscribe();

      // Return cleanup function
      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      console.error('Error in subscribeToNotifications:', error);
      return null;
    }
  }

  // ============================================================================
  // SEND NOTIFICATIONS (Admin/Server)
  // ============================================================================

  /**
   * Send a notification (typically called from server/admin)
   * For client-side, this would be triggered by user actions (comments, likes, etc.)
   */
  static async sendNotification(
    request: SendNotificationRequest
  ): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke(
        'send-notification',
        {
          body: request,
        }
      );

      if (error) {
        console.error('Error sending notification:', error);
        return { success: false, error };
      }

      return data;
    } catch (error) {
      console.error('Error in sendNotification:', error);
      return { success: false, error };
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Request notification permission (Web)
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Check if notifications are enabled
   */
  static isNotificationEnabled(): boolean {
    if (!('Notification' in window)) {
      return false;
    }

    return Notification.permission === 'granted';
  }

  /**
   * Get notification permission status
   */
  static getPermissionStatus():
    | 'granted'
    | 'denied'
    | 'default'
    | 'unsupported' {
    if (!('Notification' in window)) {
      return 'unsupported';
    }

    return Notification.permission;
  }
}

export default NotificationService;
