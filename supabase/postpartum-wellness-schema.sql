-- =====================================================
-- POSTPARTUM WELLNESS APP - SUPABASE SCHEMA
-- =====================================================
-- Tabelas para app de bem-estar pós-parto
-- Conteúdo curado, rotinas, checklists, fóruns
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- WELLNESS CONTENT (Artigos, Vídeos, Áudios)
-- =====================================================

CREATE TABLE IF NOT EXISTS wellness_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'infographic')),
  category TEXT NOT NULL CHECK (category IN ('nutrition', 'exercise', 'mental_health', 'baby_care', 'self_care', 'recovery')),
  -- Content data
  body TEXT, -- Para artigos (markdown)
  media_url TEXT, -- URL do vídeo/áudio/imagem
  thumbnail_url TEXT,
  duration_minutes INTEGER, -- Duração para vídeos/áudios
  -- Metadata
  author_name TEXT,
  author_credentials TEXT,
  expert_verified BOOLEAN DEFAULT false,
  reading_time_minutes INTEGER,
  -- Tags and filtering
  tags TEXT[], -- Array de tags para busca
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  postpartum_week_min INTEGER, -- Semana pós-parto mínima recomendada
  postpartum_week_max INTEGER, -- Semana pós-parto máxima recomendada
  -- Engagement
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  -- Status
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_wellness_content_category ON wellness_content(category);
CREATE INDEX idx_wellness_content_type ON wellness_content(content_type);
CREATE INDEX idx_wellness_content_published ON wellness_content(published);
CREATE INDEX idx_wellness_content_featured ON wellness_content(featured);
CREATE INDEX idx_wellness_content_tags ON wellness_content USING GIN(tags);

-- =====================================================
-- ROUTINES (Rotinas Personalizadas)
-- =====================================================

CREATE TABLE IF NOT EXISTS wellness_routines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('morning', 'evening', 'exercise', 'meditation', 'self_care', 'baby_care')),
  duration_minutes INTEGER NOT NULL,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
  -- Target audience
  postpartum_week_min INTEGER,
  postpartum_week_max INTEGER,
  -- Content
  steps JSONB NOT NULL, -- Array de steps: [{order, title, description, duration_minutes, media_url}]
  tips TEXT[],
  required_items TEXT[], -- Itens necessários
  -- Metadata
  expert_created BOOLEAN DEFAULT true,
  expert_name TEXT,
  expert_credentials TEXT,
  -- Engagement
  completions_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  -- Status
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wellness_routines_category ON wellness_routines(category);
CREATE INDEX idx_wellness_routines_published ON wellness_routines(published);

-- =====================================================
-- USER ROUTINE PROGRESS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_routine_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  routine_id UUID NOT NULL REFERENCES wellness_routines(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  current_step INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, routine_id, completed_at)
);

CREATE INDEX idx_user_routine_progress_user ON user_routine_progress(user_id);
CREATE INDEX idx_user_routine_progress_routine ON user_routine_progress(routine_id);

-- =====================================================
-- CHECKLISTS
-- =====================================================

CREATE TABLE IF NOT EXISTS wellness_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('hospital_bag', 'baby_essentials', 'recovery', 'postpartum_checkup', 'self_care', 'feeding')),
  -- Target
  postpartum_week INTEGER, -- Semana específica ou NULL para geral
  priority_level TEXT CHECK (priority_level IN ('essential', 'recommended', 'optional')),
  -- Content
  items JSONB NOT NULL, -- [{id, text, category, notes, optional}]
  tips TEXT[],
  -- Status
  published BOOLEAN DEFAULT false,
  default_checklist BOOLEAN DEFAULT false, -- Se é um checklist padrão do app
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wellness_checklists_category ON wellness_checklists(category);
CREATE INDEX idx_wellness_checklists_published ON wellness_checklists(published);

-- =====================================================
-- USER CHECKLIST PROGRESS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checklist_id UUID NOT NULL REFERENCES wellness_checklists(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL, -- ID do item dentro do JSONB
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checklist_id, item_id)
);

CREATE INDEX idx_user_checklist_items_user ON user_checklist_items(user_id);
CREATE INDEX idx_user_checklist_items_checklist ON user_checklist_items(checklist_id);

-- =====================================================
-- COMMUNITY FORUMS
-- =====================================================

CREATE TABLE IF NOT EXISTS wellness_forum_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'recovery', 'breastfeeding', 'mental_health', 'relationships', 'baby_development', 'tips_tricks')),
  tags TEXT[],
  -- Moderation
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_moderated BOOLEAN DEFAULT false,
  moderator_notes TEXT,
  -- Engagement
  views_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_reply_at TIMESTAMPTZ
);

CREATE INDEX idx_forum_topics_category ON wellness_forum_topics(category);
CREATE INDEX idx_forum_topics_user ON wellness_forum_topics(user_id);
CREATE INDEX idx_forum_topics_created ON wellness_forum_topics(created_at DESC);
CREATE INDEX idx_forum_topics_tags ON wellness_forum_topics USING GIN(tags);

-- =====================================================
-- FORUM REPLIES
-- =====================================================

CREATE TABLE IF NOT EXISTS wellness_forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES wellness_forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES wellness_forum_replies(id) ON DELETE CASCADE,
  -- Moderation
  is_hidden BOOLEAN DEFAULT false,
  moderator_notes TEXT,
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_replies_topic ON wellness_forum_replies(topic_id);
CREATE INDEX idx_forum_replies_user ON wellness_forum_replies(user_id);
CREATE INDEX idx_forum_replies_created ON wellness_forum_replies(created_at DESC);

-- =====================================================
-- USER CONTENT INTERACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS user_content_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES wellness_content(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'save', 'complete')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_id, interaction_type)
);

CREATE INDEX idx_user_content_interactions_user ON user_content_interactions(user_id);
CREATE INDEX idx_user_content_interactions_content ON user_content_interactions(content_id);

-- =====================================================
-- CALENDAR EVENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS wellness_calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('appointment', 'checkup', 'exercise', 'routine', 'reminder', 'milestone')),
  -- Date/Time
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT false,
  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly'
  recurrence_end_date TIMESTAMPTZ,
  -- Notifications
  reminder_minutes_before INTEGER[], -- [15, 60, 1440] para 15min, 1h, 1dia antes
  -- Status
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_user ON wellness_calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON wellness_calendar_events(start_date);

-- =====================================================
-- USER PREFERENCES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_wellness_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  -- Postpartum info
  due_date DATE,
  birth_date DATE,
  delivery_type TEXT CHECK (delivery_type IN ('vaginal', 'cesarean', 'other')),
  -- Preferences
  preferred_content_types TEXT[], -- ['article', 'video', 'audio']
  preferred_categories TEXT[], -- ['nutrition', 'exercise', ...]
  notification_settings JSONB, -- {daily_tips: true, routine_reminders: true, ...}
  -- Privacy
  anonymous_in_forums BOOLEAN DEFAULT false,
  share_progress BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE wellness_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_routine_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wellness_preferences ENABLE ROW LEVEL SECURITY;

-- Wellness Content: Public read for published, admin write
CREATE POLICY "Public can view published content" ON wellness_content
  FOR SELECT USING (published = true);

-- Routines: Public read for published
CREATE POLICY "Public can view published routines" ON wellness_routines
  FOR SELECT USING (published = true);

-- User Routine Progress: Users can manage their own
CREATE POLICY "Users can manage own routine progress" ON user_routine_progress
  FOR ALL USING (auth.uid() = user_id);

-- Checklists: Public read for published
CREATE POLICY "Public can view published checklists" ON wellness_checklists
  FOR SELECT USING (published = true);

-- User Checklist Items: Users can manage their own
CREATE POLICY "Users can manage own checklist items" ON user_checklist_items
  FOR ALL USING (auth.uid() = user_id);

-- Forum Topics: Public read, authenticated users can create
CREATE POLICY "Anyone can view forum topics" ON wellness_forum_topics
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create topics" ON wellness_forum_topics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topics" ON wellness_forum_topics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own topics" ON wellness_forum_topics
  FOR DELETE USING (auth.uid() = user_id);

-- Forum Replies: Public read, authenticated users can create
CREATE POLICY "Anyone can view forum replies" ON wellness_forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies" ON wellness_forum_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own replies" ON wellness_forum_replies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own replies" ON wellness_forum_replies
  FOR DELETE USING (auth.uid() = user_id);

-- User Content Interactions: Users can manage their own
CREATE POLICY "Users can manage own interactions" ON user_content_interactions
  FOR ALL USING (auth.uid() = user_id);

-- Calendar Events: Users can manage their own
CREATE POLICY "Users can manage own calendar events" ON wellness_calendar_events
  FOR ALL USING (auth.uid() = user_id);

-- User Preferences: Users can manage their own
CREATE POLICY "Users can manage own preferences" ON user_wellness_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all tables
CREATE TRIGGER update_wellness_content_updated_at BEFORE UPDATE ON wellness_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_routines_updated_at BEFORE UPDATE ON wellness_routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_routine_progress_updated_at BEFORE UPDATE ON user_routine_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_checklists_updated_at BEFORE UPDATE ON wellness_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_checklist_items_updated_at BEFORE UPDATE ON user_checklist_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_forum_topics_updated_at BEFORE UPDATE ON wellness_forum_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_forum_replies_updated_at BEFORE UPDATE ON wellness_forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_calendar_events_updated_at BEFORE UPDATE ON wellness_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_wellness_preferences_updated_at BEFORE UPDATE ON user_wellness_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment content views
CREATE OR REPLACE FUNCTION increment_content_views(content_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE wellness_content
  SET views_count = views_count + 1
  WHERE id = content_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update topic reply count and last_reply_at
CREATE OR REPLACE FUNCTION update_topic_reply_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE wellness_forum_topics
  SET
    replies_count = replies_count + 1,
    last_reply_at = NEW.created_at
  WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_topic_reply_stats_trigger AFTER INSERT ON wellness_forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_topic_reply_stats();

-- =====================================================
-- SAMPLE DATA (for development)
-- =====================================================

-- Sample wellness content
INSERT INTO wellness_content (title, description, content_type, category, body, author_name, expert_verified, published, featured) VALUES
('Recuperação Pós-Parto: Primeiras Semanas', 'Guia completo sobre o que esperar e como cuidar de si mesma nas primeiras semanas após o parto', 'article', 'recovery', '# Recuperação Pós-Parto\n\nAs primeiras semanas após o parto são um período de grandes mudanças...', 'Dra. Maria Silva', true, true, true),
('Exercícios Seguros para Pós-Parto', 'Aprenda exercícios seguros e eficazes para começar sua recuperação física', 'video', 'exercise', NULL, 'Ft. Ana Santos', true, true, false),
('Meditação para Mães: 10 Minutos de Paz', 'Áudio guiado de meditação especialmente para mães no pós-parto', 'audio', 'mental_health', NULL, 'Psicóloga Laura Costa', true, true, false);

-- Sample routines
INSERT INTO wellness_routines (title, description, category, duration_minutes, difficulty_level, steps, published, featured) VALUES
('Rotina Matinal Energizante', 'Comece o dia com energia e disposição', 'morning', 15, 'easy',
'[
  {"order": 1, "title": "Alongamento suave", "description": "5 minutos de alongamentos leves", "duration_minutes": 5},
  {"order": 2, "title": "Hidratação", "description": "Beba um copo de água", "duration_minutes": 2},
  {"order": 3, "title": "Respiração consciente", "description": "Exercícios de respiração profunda", "duration_minutes": 5},
  {"order": 4, "title": "Intenção do dia", "description": "Defina uma intenção positiva para o dia", "duration_minutes": 3}
]'::jsonb, true, true);

-- Sample checklists
INSERT INTO wellness_checklists (title, description, category, items, published, default_checklist) VALUES
('Bolsa Maternidade', 'Itens essenciais para levar para a maternidade', 'hospital_bag',
'[
  {"id": "1", "text": "Documentos (RG, cartão do plano)", "category": "essencial", "optional": false},
  {"id": "2", "text": "Roupas confortáveis", "category": "essencial", "optional": false},
  {"id": "3", "text": "Produtos de higiene pessoal", "category": "essencial", "optional": false},
  {"id": "4", "text": "Roupinhas do bebê", "category": "essencial", "optional": false},
  {"id": "5", "text": "Câmera fotográfica", "category": "opcional", "optional": true}
]'::jsonb, true, true);

COMMIT;
