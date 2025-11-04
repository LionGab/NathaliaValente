import { createClient } from '@supabase/supabase-js';

// Configuração segura do Supabase - APENAS variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação CRÍTICA: Falhar se credenciais ausentes
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '🚨 ERRO DE CONFIGURAÇÃO: Variáveis de ambiente do Supabase não encontradas!\n' +
    'Por favor, configure:\n' +
    '  - VITE_SUPABASE_URL\n' +
    '  - VITE_SUPABASE_ANON_KEY\n' +
    'Veja .env.example para mais detalhes.'
  );
}

// Validação da URL do Supabase
if (!supabaseUrl.startsWith('https://')) {
  throw new Error(
    `🚨 SUPABASE: URL inválida! Deve começar com https://\n` +
    `URL recebida: ${supabaseUrl}`
  );
}

// Criar cliente Supabase com configuração mobile-optimized
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Log apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('✅ Supabase configurado:', supabaseUrl);
}

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
