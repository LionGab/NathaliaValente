import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey);

if (!SUPABASE_CONFIGURED) {
  // Log once in dev to orientar configuração, mas não quebrar a UI
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[Supabase] Variáveis VITE_SUPABASE_URL/ANON_KEY ausentes. Rodando em modo limitado.');
  }
}

// Usa valores seguros para evitar crash de import; chamadas reais falharão graciosamente quando não configurado
const safeUrl = supabaseUrl || 'https://example.supabase.co';
const safeKey = supabaseAnonKey || 'public-anon-key-missing';

export const supabase = createClient(safeUrl, safeKey);

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
