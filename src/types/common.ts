/**
 * Common type definitions to replace 'any' types throughout the application
 * Provides type safety for frequently used patterns
 */

/**
 * Generic metadata structure for extensible objects
 */
export interface Metadata {
  [key: string]: string | number | boolean | null | undefined | Metadata;
}

/**
 * Search result types with discriminated unions for type safety
 */
export interface BaseSearchResult {
  id: number | string;
  title: string;
  relevance?: number;
}

export interface PostSearchResult extends BaseSearchResult {
  type: 'post';
  author: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
}

export interface UserSearchResult extends BaseSearchResult {
  type: 'user';
  username: string;
  subtitle: string;
  avatar_url?: string;
  is_premium?: boolean;
}

export interface GroupSearchResult extends BaseSearchResult {
  type: 'group';
  subtitle: string;
  member_count: number;
  is_private: boolean;
  thumbnail_url?: string;
}

export type SearchResult = PostSearchResult | UserSearchResult | GroupSearchResult;

/**
 * Chat message metadata with specific structure
 */
export interface ChatMessageMetadata {
  attachments?: Array<{
    type: 'image' | 'audio' | 'file';
    url: string;
    filename: string;
    size: number;
    mime_type?: string;
  }>;
  edited?: boolean;
  editedAt?: string;
  reactions?: {
    heart?: number;
    like?: number;
    pray?: number;
    hug?: number;
  };
  flags?: {
    important?: boolean;
    pinned?: boolean;
    archived?: boolean;
  };
  read_by?: string[];
}

/**
 * Chat summary mood indicators with structured data
 */
export interface MoodIndicators {
  sentiment: 'positive' | 'neutral' | 'negative';
  emotions: Array<{
    type: 'joy' | 'sadness' | 'anxiety' | 'anger' | 'hope' | 'fear';
    confidence: number;
  }>;
  stress_level?: 1 | 2 | 3 | 4 | 5;
  needs_support?: boolean;
}

/**
 * NathIA user context for personalized responses
 */
export interface UserContext {
  name?: string;
  preferences?: {
    communication_style?: 'formal' | 'casual' | 'empathetic';
    topics_of_interest?: string[];
    language?: string;
  };
  history?: {
    frequent_topics?: string[];
    previous_conversations?: number;
    last_interaction?: string;
  };
  profile?: {
    is_premium?: boolean;
    member_since?: string;
    badges?: string[];
  };
}

/**
 * NathIA response metadata
 */
export interface NathIAMetadata {
  response_time_ms: number;
  model_version: string;
  confidence_score: number;
  context_used: boolean;
  tokens_used?: number;
  topics_detected: string[];
}

/**
 * Notification data payload with specific structure
 */
export interface NotificationData {
  action?: 'navigate' | 'open_modal' | 'refresh';
  target?: string;
  post_id?: string;
  user_id?: string;
  group_id?: string;
  custom_data?: Record<string, string | number | boolean>;
}

/**
 * API Error response structure
 */
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
  timestamp: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

/**
 * Form field error structure
 */
export interface FieldError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

/**
 * File upload progress
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

/**
 * Image metadata
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: 'jpeg' | 'png' | 'webp' | 'gif';
  size: number;
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
}

/**
 * Analytics event data
 */
export interface AnalyticsEvent {
  event_name: string;
  timestamp: string;
  user_id?: string;
  session_id: string;
  properties: Record<string, string | number | boolean>;
  page_url?: string;
  referrer?: string;
}

/**
 * Type guard to check if value is Metadata
 */
export const isMetadata = (value: unknown): value is Metadata => {
  return typeof value === 'object' && value !== null;
};

/**
 * Type guard to check if error is ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error &&
    'status' in error
  );
};
