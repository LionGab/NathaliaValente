import { createClient } from '@supabase/supabase-js';

// Configuração segura do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente com fallback
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
    ⚠️ SUPABASE NÃO CONFIGURADO - Usando modo DEMO
    
    Para usar funcionalidades completas, configure:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
  `;

  console.warn(errorMessage);
}

// Log apenas em desenvolvimento
if (import.meta.env.DEV && supabaseUrl) {
  console.log('✅ Supabase configurado:', supabaseUrl);
}

// Criar cliente Supabase (ou mock se não configurado)
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

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
