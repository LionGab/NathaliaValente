/**
 * ClubNath Notification System - Shared TypeScript Types
 *
 * These types are shared between the Edge Function and the client app
 */

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface NotificationPreferences {
  id: string;
  user_id: string;

  // Notification Type Toggles
  enable_push: boolean;
  enable_email: boolean;
  enable_in_app: boolean;

  // Category Preferences
  enable_community_activity: boolean;
  enable_new_content: boolean;
  enable_daily_encouragement: boolean;
  enable_habit_reminders: boolean;
  enable_chat_responses: boolean;
  enable_badges: boolean;

  // Timing Preferences
  quiet_hours_start: string | null; // Time format: 'HH:MM:SS'
  quiet_hours_end: string | null;
  preferred_time_morning: string;
  preferred_time_evening: string;
  timezone: string;

  // Frequency Controls
  max_community_per_day: number;
  max_content_per_day: number;
  max_reminders_per_day: number;

  // Followed Categories
  followed_categories: string[];

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface PushToken {
  id: string;
  user_id: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  device_name: string | null;
  is_active: boolean;
  last_used_at: string;
  created_at: string;
}

export interface NotificationTemplate {
  id: string;
  template_key: string;
  category: string;
  title_template: string;
  body_template: string;
  language: string;
  priority: 'high' | 'normal' | 'low';
  ttl_seconds: number;
  deep_link_pattern: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationHistory {
  id: string;
  user_id: string;
  template_key: string | null;
  title: string;
  body: string;
  deep_link: string | null;
  status: 'pending' | 'sent' | 'failed' | 'read';
  delivery_method: 'push' | 'email' | 'in_app';
  data: Record<string, unknown> | null;
  error_message: string | null;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
  rate_limit_key: string | null;
}

export interface NotificationSchedule {
  id: string;
  user_id: string;
  template_key: string;
  scheduled_for: string;
  recurrence: 'daily' | 'weekly' | 'monthly' | null;
  template_data: Record<string, unknown>;
  status: 'pending' | 'sent' | 'cancelled';
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface SendNotificationRequest {
  user_id: string;
  template_key: string;
  template_data?: Record<string, unknown>;
  delivery_method?: 'push' | 'email' | 'in_app' | 'all';
  scheduled_for?: string; // ISO 8601 timestamp
  priority?: 'high' | 'normal' | 'low';

  // Override options (for custom notifications)
  custom_title?: string;
  custom_body?: string;
  custom_deep_link?: string;
}

export interface SendNotificationResponse {
  success: boolean;
  notification_id?: string;
  scheduled_id?: string;
  message: string;
  sent_count?: number;
  skipped_reason?: string;
}

export interface BatchNotificationRequest {
  notifications: SendNotificationRequest[];
}

export interface BatchNotificationResponse {
  success: boolean;
  results: SendNotificationResponse[];
  total_sent: number;
  total_failed: number;
}

// ============================================================================
// NOTIFICATION PAYLOAD TYPES
// ============================================================================

export interface NotificationPayload {
  title: string;
  body: string;
  data?: {
    deep_link?: string;
    notification_id?: string;
    category?: string;
    [key: string]: unknown;
  };
  priority?: 'high' | 'normal' | 'low';
  ttl?: number; // Time to live in seconds
  badge?: number; // For iOS badge count
  sound?: string;
  click_action?: string;
}

// Firebase Cloud Messaging specific
export interface FCMPayload {
  token: string;
  notification: {
    title: string;
    body: string;
    image?: string;
  };
  data?: Record<string, string>;
  android?: {
    priority: 'high' | 'normal';
    ttl: number;
    notification?: {
      sound?: string;
      color?: string;
      icon?: string;
    };
  };
  apns?: {
    payload: {
      aps: {
        alert: {
          title: string;
          body: string;
        };
        badge?: number;
        sound?: string;
      };
    };
  };
  webpush?: {
    notification: {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      vibrate?: number[];
    };
  };
}

// OneSignal specific
export interface OneSignalPayload {
  include_external_user_ids?: string[];
  include_player_ids?: string[];
  headings: { en: string; 'pt-BR': string };
  contents: { en: string; 'pt-BR': string };
  data?: Record<string, unknown>;
  priority?: number;
  ttl?: number;
  ios_badgeType?: string;
  ios_badgeCount?: number;
  android_channel_id?: string;
}

// ============================================================================
// TEMPLATE VARIABLE TYPES
// ============================================================================

export interface CommunityActivityVariables {
  commenter_name?: string;
  comment_content?: string;
  liker_name?: string;
  post_id?: string;
  post_caption?: string;
  post_category?: string;
}

export interface DailyEncouragementVariables {
  quote_content?: string;
  quote_author?: string;
  reflection_content?: string;
  user_name?: string;
}

export interface NewContentVariables {
  category_name?: string;
  author_name?: string;
  post_caption?: string;
  post_id?: string;
}

export interface HabitReminderVariables {
  user_name?: string;
  last_journal_date?: string;
  streak_count?: number;
}

export type TemplateVariables =
  | CommunityActivityVariables
  | DailyEncouragementVariables
  | NewContentVariables
  | HabitReminderVariables
  | Record<string, unknown>;

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface NotificationCategory {
  key: string;
  label: string;
  description: string;
  preference_field: keyof NotificationPreferences;
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    key: 'community_activity',
    label: 'Atividade da Comunidade',
    description: 'Comentários e curtidas em seus posts',
    preference_field: 'enable_community_activity',
  },
  {
    key: 'new_content',
    label: 'Novo Conteúdo',
    description: 'Novos posts nas categorias que você segue',
    preference_field: 'enable_new_content',
  },
  {
    key: 'daily_encouragement',
    label: 'Encorajamento Diário',
    description: 'Mensagens motivacionais e reflexões',
    preference_field: 'enable_daily_encouragement',
  },
  {
    key: 'habit_reminders',
    label: 'Lembretes de Hábitos',
    description: 'Lembretes para diário e autocuidado',
    preference_field: 'enable_habit_reminders',
  },
  {
    key: 'chat_responses',
    label: 'Respostas do Chat',
    description: 'Notificações do Robô Nath',
    preference_field: 'enable_chat_responses',
  },
  {
    key: 'badges',
    label: 'Selos e Conquistas',
    description: 'Quando você recebe um selo Nathy',
    preference_field: 'enable_badges',
  },
];

export interface RateLimitConfig {
  category: string;
  max_per_day: number;
  current_count: number;
  can_send: boolean;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class NotificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'NotificationError';
  }
}

export const NotificationErrorCodes = {
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUIET_HOURS: 'QUIET_HOURS',
  USER_PREFERENCES_DISABLED: 'USER_PREFERENCES_DISABLED',
  NO_PUSH_TOKENS: 'NO_PUSH_TOKENS',
  TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
  INVALID_TEMPLATE_DATA: 'INVALID_TEMPLATE_DATA',
  DELIVERY_FAILED: 'DELIVERY_FAILED',
  INVALID_REQUEST: 'INVALID_REQUEST',
} as const;

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface NotificationAnalytics {
  user_id: string;
  delivery_method: string;
  status: string;
  notification_date: string;
  count: number;
  read_count: number;
  avg_time_to_read_seconds: number | null;
}
