/**
 * Chat-related type definitions
 */

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_user: boolean;
  created_at: string;
  metadata?: {
    emotion?: string;
    intent?: string;
  };
}

export interface CreateChatMessageInput {
  message: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  resources?: ChatResource[];
}

export interface ChatResource {
  title: string;
  description: string;
  url?: string;
  type: 'article' | 'video' | 'exercise' | 'community';
}
