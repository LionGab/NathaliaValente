/**
 * Emotional Intelligence System - Type Definitions
 * Privacy-first emotional analysis for personalized notifications
 */

// ============================================
// EMOTION TYPES
// ============================================

export type EmotionCategory =
  // Positive
  | 'joyful'
  | 'grateful'
  | 'peaceful'
  | 'proud'
  | 'hopeful'
  // Negative
  | 'stressed'
  | 'overwhelmed'
  | 'anxious'
  | 'sad'
  | 'frustrated'
  | 'exhausted'
  | 'lonely'
  | 'guilty'
  // Neutral
  | 'neutral'
  | 'reflective'
  | 'uncertain';

export type NotificationTone =
  | 'gentle'
  | 'balanced'
  | 'motivational'
  | 'calming'
  | 'warm'
  | 'enthusiastic';

export type SupportLevel = 'none' | 'gentle_suggestion' | 'supportive_checkin' | 'direct_offer';

export type ResourceType = 'article' | 'hotline' | 'therapist_finder' | 'meditation' | 'exercise';

export type PeriodType = 'daily' | 'weekly' | 'monthly';

export type NotificationType = 'habit' | 'support' | 'quote' | 'check_in';

// ============================================
// DIARY ENTRY
// ============================================

export interface DiaryEntry {
  id: string;
  user_id: string;
  content: string;
  content_encrypted?: string;
  detected_emotions: EmotionScore[];
  primary_emotion: EmotionCategory;
  emotion_confidence: number; // 0-1
  sentiment_score: number; // -1 to 1
  emojis: string[];
  user_emotion_tag?: EmotionCategory;
  mood_intensity: number; // 1-5
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateDiaryEntryInput {
  content: string;
  user_emotion_tag?: EmotionCategory;
  mood_intensity?: number;
}

// ============================================
// EMOTION ANALYSIS
// ============================================

export interface EmotionScore {
  emotion: EmotionCategory;
  confidence: number; // 0-1
  source: 'keyword' | 'emoji' | 'user_tag' | 'ml_model';
  matches?: string[]; // The keywords/emojis that matched
}

export interface EmotionalAnalysis {
  primaryEmotion: EmotionCategory;
  confidence: number;
  allEmotions: EmotionScore[];
  sentimentScore: number; // -1 (negative) to 1 (positive)
  detectedEmojis: string[];
  moodIntensity?: number; // 1-5
}

export interface EmotionDetectionConfig {
  enableKeywordAnalysis: boolean;
  enableEmojiAnalysis: boolean;
  confidenceThreshold: number; // Minimum confidence to consider an emotion
  sentimentWeighting: {
    keywords: number; // 0-1
    emojis: number; // 0-1
    userTag: number; // 0-1
  };
}

// ============================================
// EMOTIONAL PATTERNS
// ============================================

export interface EmotionalPattern {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  period_type: PeriodType;
  dominant_emotions: EmotionScore[];
  average_sentiment: number;
  mood_volatility: number; // 0-1, how much mood varies
  // Time-based patterns
  morning_sentiment: number;
  afternoon_sentiment: number;
  evening_sentiment: number;
  // Stress indicators
  stress_level: number; // 1-5
  overwhelm_score: number; // 0-1
  // Positive indicators
  gratitude_count: number;
  joy_count: number;
  // Entry count
  entry_count: number;
  computed_at: string;
  created_at: string;
}

export interface EmotionalContext {
  currentState: {
    primary_emotion: EmotionCategory;
    sentiment_score: number;
    stress_level: number;
    lastEntryDate: string;
  };
  patterns: EmotionalPattern;
  preferences: NotificationPreferences;
  recentEntries: DiaryEntry[];
}

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

export interface NotificationPreferences {
  id: string;
  user_id: string;
  ai_adjustment_enabled: boolean;
  preferred_times: number[]; // Hours in UTC
  blackout_start?: string; // Time
  blackout_end?: string; // Time
  max_daily_notifications: number;
  min_notification_interval_hours: number;
  preferred_tone: NotificationTone;
  enable_support_resources: boolean;
  // Privacy
  store_diary_content: boolean;
  encryption_enabled: boolean;
  // Auto-computed
  avoid_morning_notifications: boolean;
  reduce_frequency_on_stress: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationPreferencesInput {
  ai_adjustment_enabled?: boolean;
  preferred_times?: number[];
  blackout_start?: string;
  blackout_end?: string;
  max_daily_notifications?: number;
  min_notification_interval_hours?: number;
  preferred_tone?: NotificationTone;
  enable_support_resources?: boolean;
  store_diary_content?: boolean;
  encryption_enabled?: boolean;
}

// ============================================
// HABIT REMINDERS
// ============================================

export interface HabitReminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  scheduled_time: string; // Time
  frequency: 'daily' | 'weekly' | 'custom';
  days_of_week?: number[]; // 0-6 (Sunday-Saturday)
  adjust_for_emotions: boolean;
  skip_on_negative_mood: boolean;
  is_active: boolean;
  last_sent_at?: string;
  next_scheduled_at?: string;
  completed_count: number;
  skipped_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateHabitReminderInput {
  title: string;
  description?: string;
  scheduled_time: string;
  frequency?: 'daily' | 'weekly' | 'custom';
  days_of_week?: number[];
  adjust_for_emotions?: boolean;
  skip_on_negative_mood?: boolean;
}

// ============================================
// NOTIFICATION OPTIMIZATION
// ============================================

export interface OptimizedSchedule {
  originalTime: string;
  optimizedTime: string;
  adjustment: string; // Reason for adjustment
  confidence: number; // How confident we are in this adjustment
  shouldSend: boolean; // Whether to send at all
}

export interface NotificationContent {
  title: string;
  message: string;
  tone: NotificationTone;
  includeSupport?: boolean;
  supportMessage?: string;
  offerToSkip?: boolean;
  includeBreathingExercise?: boolean;
  resourceLinks?: SupportResource[];
}

export interface NotificationHistory {
  id: string;
  user_id: string;
  habit_reminder_id?: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  user_emotional_state?: EmotionalContext['currentState'];
  adjustment_applied?: string;
  delivered: boolean;
  opened: boolean;
  action_taken: boolean;
  dismissed: boolean;
  scheduled_for: string;
  sent_at?: string;
  opened_at?: string;
  created_at: string;
}

// ============================================
// SUPPORT RESOURCES
// ============================================

export interface SupportResource {
  id: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  url?: string;
  phone_number?: string;
  trigger_emotions: EmotionCategory[];
  trigger_stress_level?: number;
  locale: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface SupportAssessment {
  level: SupportLevel;
  reasons: string[];
  suggestedResources: SupportResource[];
  urgency: 'low' | 'medium' | 'high';
  prioritize?: boolean;
  message: string;
}

// ============================================
// FREQUENCY ADJUSTMENT
// ============================================

export interface FrequencyAdjustment {
  original: number;
  adjusted: number;
  reason: string;
  temporary: boolean;
  reviewDate?: string;
}

// ============================================
// ANALYTICS & INSIGHTS
// ============================================

export interface EmotionalInsight {
  type: 'pattern' | 'achievement' | 'concern' | 'tip';
  title: string;
  description: string;
  emotionTrend?: EmotionCategory[];
  sentimentTrend?: number[];
  actionable?: boolean;
  action?: {
    label: string;
    route: string;
  };
}

export interface UserEmotionalProfile {
  userId: string;
  currentPattern: EmotionalPattern;
  weeklyTrend: EmotionalPattern[];
  monthlyTrend: EmotionalPattern[];
  insights: EmotionalInsight[];
  supportNeeded: SupportAssessment;
}

// ============================================
// ALGORITHM CONFIG
// ============================================

export interface AlgorithmConfig {
  emotionDetection: EmotionDetectionConfig;
  timingOptimization: {
    enableMorningAvoidance: boolean;
    enableStressDelay: boolean;
    stressDelayHours: number;
    enableHistoricalOptimization: boolean;
  };
  contentPersonalization: {
    enableEmotionalTone: boolean;
    enableSupportSuggestions: boolean;
    supportThresholdStress: number; // 1-5
  };
  frequencyAdjustment: {
    enableAutoReduction: boolean;
    overwhelmThreshold: number; // 0-1
    stressThreshold: number; // 1-5
    minNotificationsPerDay: number;
  };
  supportEscalation: {
    enableAutoSuggestions: boolean;
    negativeStreakDays: number;
    sentimentThreshold: number; // -1 to 1
    concerningKeywords: string[];
  };
}

// ============================================
// UTILITY TYPES
// ============================================

export interface TimeSlot {
  hour: number;
  minute: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================
// CONSTANTS
// ============================================

export const POSITIVE_EMOTIONS: EmotionCategory[] = [
  'joyful',
  'grateful',
  'peaceful',
  'proud',
  'hopeful',
];

export const NEGATIVE_EMOTIONS: EmotionCategory[] = [
  'stressed',
  'overwhelmed',
  'anxious',
  'sad',
  'frustrated',
  'exhausted',
  'lonely',
  'guilty',
];

export const NEUTRAL_EMOTIONS: EmotionCategory[] = ['neutral', 'reflective', 'uncertain'];

export const DEFAULT_ALGORITHM_CONFIG: AlgorithmConfig = {
  emotionDetection: {
    enableKeywordAnalysis: true,
    enableEmojiAnalysis: true,
    confidenceThreshold: 0.3,
    sentimentWeighting: {
      keywords: 0.6,
      emojis: 0.3,
      userTag: 0.8,
    },
  },
  timingOptimization: {
    enableMorningAvoidance: true,
    enableStressDelay: true,
    stressDelayHours: 2,
    enableHistoricalOptimization: true,
  },
  contentPersonalization: {
    enableEmotionalTone: true,
    enableSupportSuggestions: true,
    supportThresholdStress: 3,
  },
  frequencyAdjustment: {
    enableAutoReduction: true,
    overwhelmThreshold: 0.6,
    stressThreshold: 4,
    minNotificationsPerDay: 1,
  },
  supportEscalation: {
    enableAutoSuggestions: true,
    negativeStreakDays: 7,
    sentimentThreshold: -0.6,
    concerningKeywords: ['não aguento', 'desistir', 'sem esperança', 'não consigo mais'],
  },
};
