import { createClient } from '@supabase/supabase-js';

// Configuração segura do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação estrita das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
    ❌ CONFIGURAÇÃO DO SUPABASE FALTANDO!
    
    Por favor, configure as seguintes variáveis no arquivo .env:
    - VITE_SUPABASE_URL
    - VITE_SUPABASE_ANON_KEY
    
    Veja o arquivo .env.example para referência.
  `;
  
  if (import.meta.env.DEV) {
    console.error(errorMessage);
  }
  
  throw new Error('Supabase não configurado corretamente');
}

// Log apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('✅ Supabase configurado:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
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
