/**
 * TypeScript types for Postpartum Wellness Module
 * Corresponds to supabase/postpartum-wellness-schema.sql
 */

import { Profile } from '../lib/supabase';

// =====================================================
// WELLNESS CONTENT
// =====================================================

export type ContentType = 'article' | 'video' | 'audio' | 'infographic';

export type ContentCategory =
  | 'nutrition'
  | 'exercise'
  | 'mental_health'
  | 'baby_care'
  | 'self_care'
  | 'recovery';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface WellnessContent {
  id: string;
  title: string;
  description?: string;
  content_type: ContentType;
  category: ContentCategory;
  body?: string; // Markdown content for articles
  media_url?: string; // URL for video/audio/image
  thumbnail_url?: string;
  duration_minutes?: number;
  author_name?: string;
  author_credentials?: string;
  expert_verified: boolean;
  reading_time_minutes?: number;
  tags?: string[];
  difficulty_level?: DifficultyLevel;
  postpartum_week_min?: number;
  postpartum_week_max?: number;
  views_count: number;
  likes_count: number;
  saves_count: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// =====================================================
// ROUTINES
// =====================================================

export type RoutineCategory =
  | 'morning'
  | 'evening'
  | 'exercise'
  | 'meditation'
  | 'self_care'
  | 'baby_care';

export type RoutineDifficulty = 'easy' | 'moderate' | 'challenging';

export interface RoutineStep {
  order: number;
  title: string;
  description: string;
  duration_minutes: number;
  media_url?: string;
}

export interface WellnessRoutine {
  id: string;
  title: string;
  description?: string;
  category: RoutineCategory;
  duration_minutes: number;
  difficulty_level?: RoutineDifficulty;
  postpartum_week_min?: number;
  postpartum_week_max?: number;
  steps: RoutineStep[];
  tips?: string[];
  required_items?: string[];
  expert_created: boolean;
  expert_name?: string;
  expert_credentials?: string;
  completions_count: number;
  rating_average?: number;
  rating_count: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoutineProgress {
  id: string;
  user_id: string;
  routine_id: string;
  completed_at?: string;
  current_step: number;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  routine?: WellnessRoutine;
}

// =====================================================
// CHECKLISTS
// =====================================================

export type ChecklistCategory =
  | 'hospital_bag'
  | 'baby_essentials'
  | 'recovery'
  | 'postpartum_checkup'
  | 'self_care'
  | 'feeding';

export type PriorityLevel = 'essential' | 'recommended' | 'optional';

export interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
  notes?: string;
  optional?: boolean;
}

export interface WellnessChecklist {
  id: string;
  title: string;
  description?: string;
  category: ChecklistCategory;
  postpartum_week?: number;
  priority_level?: PriorityLevel;
  items: ChecklistItem[];
  tips?: string[];
  published: boolean;
  default_checklist: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserChecklistItem {
  id: string;
  user_id: string;
  checklist_id: string;
  item_id: string;
  completed: boolean;
  notes?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// COMMUNITY FORUMS
// =====================================================

export type ForumCategory =
  | 'general'
  | 'recovery'
  | 'breastfeeding'
  | 'mental_health'
  | 'relationships'
  | 'baby_development'
  | 'tips_tricks';

export interface WellnessForumTopic {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: ForumCategory;
  tags?: string[];
  is_pinned: boolean;
  is_locked: boolean;
  is_moderated: boolean;
  moderator_notes?: string;
  views_count: number;
  replies_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  last_reply_at?: string;
  profiles?: Profile;
}

export interface WellnessForumReply {
  id: string;
  topic_id: string;
  user_id: string;
  content: string;
  parent_reply_id?: string;
  is_hidden: boolean;
  moderator_notes?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  replies?: WellnessForumReply[]; // For nested replies
}

// =====================================================
// USER INTERACTIONS
// =====================================================

export type InteractionType = 'view' | 'like' | 'save' | 'complete';

export interface UserContentInteraction {
  id: string;
  user_id: string;
  content_id: string;
  interaction_type: InteractionType;
  created_at: string;
}

// =====================================================
// CALENDAR EVENTS
// =====================================================

export type EventType =
  | 'appointment'
  | 'checkup'
  | 'exercise'
  | 'routine'
  | 'reminder'
  | 'milestone';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly';

export interface WellnessCalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_type: EventType;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
  reminder_minutes_before?: number[];
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// USER PREFERENCES
// =====================================================

export type DeliveryType = 'vaginal' | 'cesarean' | 'other';

export interface NotificationSettings {
  daily_tips?: boolean;
  routine_reminders?: boolean;
  forum_replies?: boolean;
  calendar_reminders?: boolean;
  new_content?: boolean;
}

export interface UserWellnessPreferences {
  user_id: string;
  due_date?: string;
  birth_date?: string;
  delivery_type?: DeliveryType;
  preferred_content_types?: ContentType[];
  preferred_categories?: ContentCategory[];
  notification_settings?: NotificationSettings;
  anonymous_in_forums: boolean;
  share_progress: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateTopicRequest {
  title: string;
  content: string;
  category: ForumCategory;
  tags?: string[];
}

export interface CreateReplyRequest {
  topic_id: string;
  content: string;
  parent_reply_id?: string;
}

export interface UpdateChecklistItemRequest {
  completed: boolean;
  notes?: string;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  event_type: EventType;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
  reminder_minutes_before?: number[];
}

export interface RateRoutineRequest {
  rating: number;
  feedback?: string;
}

export interface ContentFilters {
  content_type?: ContentType;
  category?: ContentCategory;
  tags?: string[];
  difficulty_level?: DifficultyLevel;
  postpartum_week?: number;
  featured?: boolean;
  search?: string;
}

export interface RoutineFilters {
  category?: RoutineCategory;
  difficulty_level?: RoutineDifficulty;
  max_duration?: number;
  postpartum_week?: number;
  featured?: boolean;
}

export interface ForumFilters {
  category?: ForumCategory;
  tags?: string[];
  search?: string;
  pinned_only?: boolean;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface WellnessStats {
  total_content_viewed: number;
  total_routines_completed: number;
  total_checklist_items_completed: number;
  streak_days: number;
  favorite_category?: ContentCategory;
}
