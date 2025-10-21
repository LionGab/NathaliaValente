/**
 * Post-related type definitions
 */

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  category: PostCategory;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  likes_count: number;
  comments_count: number;
  user_has_liked?: boolean;
  profiles?: UserProfile;
  has_badge?: boolean;
}

export type PostCategory = 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe' | 'Todos';

export interface CreatePostInput {
  caption: string;
  category: Exclude<PostCategory, 'Todos'>;
  image_url?: string;
}

export interface UpdatePostInput {
  caption?: string;
  category?: Exclude<PostCategory, 'Todos'>;
  image_url?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  onboarding_completed?: boolean;
  goals?: string[];
  life_phase?: string;
  interests?: string[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  profiles?: UserProfile;
}

export interface CreateCommentInput {
  post_id: string;
  content: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}
