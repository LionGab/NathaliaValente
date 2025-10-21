import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bbcwitnbnosyfpfjtzkr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have a valid Supabase key
if (!supabaseAnonKey || supabaseAnonKey.includes('example') || supabaseAnonKey.length < 100) {
  console.error('❌ SUPABASE NOT CONFIGURED!');
  console.error('Please set VITE_SUPABASE_ANON_KEY in your .env file');
  console.error('Get your key from: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api');
}

// Log environment status for debugging
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'dummy-key-for-development');

export type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  // Onboarding fields
  onboarding_completed?: boolean;
  onboarding_step?: number;
  onboarding_goals?: string[];
  preferred_nickname?: string;
  avatar_emoji?: string;
  onboarding_completed_at?: string;
};

export type Post = {
  id: string;
  user_id: string;
  caption: string;
  category: 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe';
  image_url?: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  likes_count?: number;
  comments_count?: number;
  has_badge?: boolean;
  user_has_liked?: boolean;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
};

export type ChatMessage = {
  id: string;
  user_id: string;
  message: string;
  is_user: boolean;
  created_at: string;
};

export type DailyQuote = {
  id: string;
  content: string;
  author?: string;
  type: 'motivational' | 'verse' | 'reflection';
  date: string;
  created_at: string;
};

export type SavedItem = {
  id: string;
  user_id: string;
  post_id?: string;
  content?: string;
  type: 'post' | 'quote' | 'verse';
  created_at: string;
  posts?: Post;
};
