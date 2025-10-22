-- =====================================================
-- CLUBNATH NOTIFICATIONS SYSTEM
-- Sistema de Notificações Push Inteligentes
-- =====================================================

-- Tabela de preferências de notificação
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    daily_quotes BOOLEAN DEFAULT true,
    feed_highlights BOOLEAN DEFAULT true,
    social_interactions BOOLEAN DEFAULT true,
    engagement_reminders BOOLEAN DEFAULT true,
    premium_offers BOOLEAN DEFAULT false,
    prayer_notifications BOOLEAN DEFAULT true,
    journal_reminders BOOLEAN DEFAULT true,
    sos_followup BOOLEAN DEFAULT true,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de subscriptions push
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de logs de notificações
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'failed')),
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atividade do usuário (para engagement reminders)
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_post_at TIMESTAMP WITH TIME ZONE,
    last_comment_at TIMESTAMP WITH TIME ZONE,
    last_prayer_at TIMESTAMP WITH TIME ZONE,
    last_journal_at TIMESTAMP WITH TIME ZONE,
    total_sessions INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- em minutos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de templates de notificação
CREATE TABLE IF NOT EXISTS notification_templates (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    icon TEXT,
    badge TEXT,
    scheduled_time TIME,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    requires_interaction BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para notification_preferences
CREATE POLICY "Users can view own notification preferences" ON notification_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" ON notification_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" ON notification_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para push_subscriptions
CREATE POLICY "Users can view own push subscriptions" ON push_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own push subscriptions" ON push_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions" ON push_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para notification_logs
CREATE POLICY "Users can view own notification logs" ON notification_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification logs" ON notification_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_activity
CREATE POLICY "Users can view own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON user_activity
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para notification_templates (público para leitura)
CREATE POLICY "Anyone can view active notification templates" ON notification_templates
    FOR SELECT USING (is_active = true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para notification_logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON notification_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);

-- Índices para user_activity
CREATE INDEX IF NOT EXISTS idx_user_activity_last_active ON user_activity(last_active_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);

-- Índices para notification_preferences
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_notification_preferences_updated_at 
    BEFORE UPDATE ON notification_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at 
    BEFORE UPDATE ON push_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_activity_updated_at 
    BEFORE UPDATE ON user_activity 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar atividade do usuário
CREATE OR REPLACE FUNCTION update_user_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_activity (user_id, last_active_at)
    VALUES (NEW.user_id, NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        last_active_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar atividade quando usuário faz login
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar preferências padrão de notificação
    INSERT INTO notification_preferences (user_id)
    VALUES (NEW.id);
    
    -- Criar registro de atividade
    INSERT INTO user_activity (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para novos usuários
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- DADOS INICIAIS - TEMPLATES DE NOTIFICAÇÃO
-- =====================================================

INSERT INTO notification_templates (id, type, title, body, scheduled_time, priority) VALUES
('daily_quote', 'daily_quote', '💜 Frase do Dia - ClubNath', 'Sua dose diária de inspiração está pronta!', '08:00', 'normal'),
('feed_highlight', 'feed_highlight', '✨ Destaque do Feed', 'Veja o que está rolando no ClubNath hoje!', '20:00', 'normal'),
('social_interaction', 'social', '💬 Nova Interação', 'Alguém interagiu com seu post!', NULL, 'normal'),
('engagement_reminder', 'engagement', '💜 Sentimos sua falta!', 'Veja o que rolou no ClubNath enquanto você estava fora', NULL, 'low'),
('prayer_notification', 'prayer', '🙏 Nova Oração', 'Uma mãe precisa de suas orações', NULL, 'normal'),
('journal_reminder', 'journal', '📝 Hora do Journaling', 'Que tal refletir sobre seu dia?', '21:00', 'normal'),
('sos_followup', 'sos', '💜 Como você está hoje?', 'Esperamos que esteja se sentindo melhor', NULL, 'high')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE notification_preferences IS 'Preferências de notificação dos usuários';
COMMENT ON TABLE push_subscriptions IS 'Subscriptions para push notifications';
COMMENT ON TABLE notification_logs IS 'Log de todas as notificações enviadas';
COMMENT ON TABLE user_activity IS 'Rastreamento de atividade dos usuários para engagement';
COMMENT ON TABLE notification_templates IS 'Templates de notificação reutilizáveis';

COMMENT ON COLUMN notification_preferences.quiet_hours_start IS 'Horário de início do período silencioso (formato HH:MM)';
COMMENT ON COLUMN notification_preferences.quiet_hours_end IS 'Horário de fim do período silencioso (formato HH:MM)';
COMMENT ON COLUMN user_activity.total_time_spent IS 'Tempo total gasto no app em minutos';
COMMENT ON COLUMN notification_logs.status IS 'Status da notificação: sent, delivered, opened, clicked, failed';
