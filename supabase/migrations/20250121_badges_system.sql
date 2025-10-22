-- =====================================================
-- CLUBNATH BADGES SYSTEM
-- Sistema de Badges Completo
-- =====================================================

-- Tabela de badges
CREATE TABLE IF NOT EXISTS badges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('participation', 'faith', 'support', 'journey', 'special')),
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    color TEXT NOT NULL,
    requirements JSONB NOT NULL, -- Array de BadgeRequirement
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de badges dos usuários
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    is_earned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Tabela de progresso de badges (para tracking em tempo real)
CREATE TABLE IF NOT EXISTS badge_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT REFERENCES badges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_progress ENABLE ROW LEVEL SECURITY;

-- Políticas para badges
CREATE POLICY "Anyone can view active badges" ON badges
    FOR SELECT USING (is_active = true);

-- Políticas para user_badges
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view other users badges" ON user_badges
    FOR SELECT USING (true); -- Para leaderboards

CREATE POLICY "System can insert user badges" ON user_badges
    FOR INSERT WITH CHECK (true); -- Sistema pode inserir

CREATE POLICY "System can update user badges" ON user_badges
    FOR UPDATE USING (true); -- Sistema pode atualizar

-- Políticas para badge_progress
CREATE POLICY "Users can view own badge progress" ON badge_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage badge progress" ON badge_progress
    FOR ALL USING (true); -- Sistema pode gerenciar

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para badges
CREATE INDEX IF NOT EXISTS idx_badges_category ON badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_rarity ON badges(rarity);
CREATE INDEX IF NOT EXISTS idx_badges_is_active ON badges(is_active);

-- Índices para user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON user_badges(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_is_earned ON user_badges(is_earned);

-- Índices para badge_progress
CREATE INDEX IF NOT EXISTS idx_badge_progress_user_id ON badge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_badge_id ON badge_progress(badge_id);
CREATE INDEX IF NOT EXISTS idx_badge_progress_last_updated ON badge_progress(last_updated DESC);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_badges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_badges_updated_at 
    BEFORE UPDATE ON badges 
    FOR EACH ROW EXECUTE FUNCTION update_badges_updated_at();

-- Função para verificar e conceder badges automaticamente
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
    awarded_badges TEXT[] := '{}';
    badge_record RECORD;
    progress_value INTEGER;
    requirement_record RECORD;
    meets_requirements BOOLEAN;
BEGIN
    -- Iterar sobre todas as badges ativas
    FOR badge_record IN 
        SELECT * FROM badges WHERE is_active = true
    LOOP
        -- Verificar se o usuário já tem esta badge
        IF NOT EXISTS (
            SELECT 1 FROM user_badges 
            WHERE user_id = p_user_id AND badge_id = badge_record.id
        ) THEN
            meets_requirements := true;
            
            -- Verificar cada requisito da badge
            FOR requirement_record IN 
                SELECT * FROM jsonb_array_elements(badge_record.requirements)
            LOOP
                -- Calcular progresso baseado no tipo de requisito
                CASE requirement_record->>'type'
                    WHEN 'posts_count' THEN
                        SELECT COUNT(*) INTO progress_value
                        FROM posts WHERE author_id = p_user_id;
                        
                    WHEN 'comments_count' THEN
                        SELECT COUNT(*) INTO progress_value
                        FROM comments WHERE user_id = p_user_id;
                        
                    WHEN 'prayers_shared' THEN
                        SELECT COUNT(*) INTO progress_value
                        FROM prayer_posts WHERE user_id = p_user_id;
                        
                    WHEN 'journal_entries' THEN
                        SELECT COUNT(*) INTO progress_value
                        FROM journal_entries WHERE user_id = p_user_id;
                        
                    WHEN 'days_active' THEN
                        SELECT EXTRACT(DAYS FROM (NOW() - created_at))::INTEGER INTO progress_value
                        FROM profiles WHERE id = p_user_id;
                        
                    WHEN 'streak_days' THEN
                        SELECT COALESCE(current_streak, 0) INTO progress_value
                        FROM user_journal_streaks WHERE user_id = p_user_id;
                        
                    WHEN 'special' THEN
                        -- Implementar lógica específica baseada na métrica
                        CASE requirement_record->>'metric'
                            WHEN 'likes_given' THEN
                                SELECT COUNT(*) INTO progress_value
                                FROM post_likes WHERE user_id = p_user_id;
                            WHEN 'prayer_amens' THEN
                                SELECT COUNT(*) INTO progress_value
                                FROM prayer_amens WHERE user_id = p_user_id;
                            WHEN 'journal_streak' THEN
                                SELECT COALESCE(current_streak, 0) INTO progress_value
                                FROM user_journal_streaks WHERE user_id = p_user_id;
                            WHEN 'nath_approved' THEN
                                SELECT COUNT(*) INTO progress_value
                                FROM posts WHERE author_id = p_user_id AND nathy_aproved = true;
                            ELSE
                                progress_value := 0;
                        END CASE;
                        
                    ELSE
                        progress_value := 0;
                END CASE;
                
                -- Verificar se atende o requisito
                IF progress_value < (requirement_record->>'value')::INTEGER THEN
                    meets_requirements := false;
                    EXIT;
                END IF;
            END LOOP;
            
            -- Se atende todos os requisitos, conceder a badge
            IF meets_requirements THEN
                INSERT INTO user_badges (user_id, badge_id, earned_at, progress, is_earned)
                VALUES (p_user_id, badge_record.id, NOW(), 100, true);
                
                awarded_badges := array_append(awarded_badges, badge_record.id);
            END IF;
        END IF;
    END LOOP;
    
    RETURN awarded_badges;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar progresso de badges
CREATE OR REPLACE FUNCTION update_badge_progress(p_user_id UUID, p_badge_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    progress_value INTEGER := 0;
    badge_record RECORD;
    requirement_record RECORD;
    requirement_progress INTEGER;
    total_requirements INTEGER;
BEGIN
    -- Buscar a badge
    SELECT * INTO badge_record FROM badges WHERE id = p_badge_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    total_requirements := jsonb_array_length(badge_record.requirements);
    
    -- Calcular progresso para cada requisito
    FOR requirement_record IN 
        SELECT * FROM jsonb_array_elements(badge_record.requirements)
    LOOP
        -- Calcular progresso baseado no tipo de requisito
        CASE requirement_record->>'type'
            WHEN 'posts_count' THEN
                SELECT LEAST(100, (COUNT(*) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                FROM posts WHERE author_id = p_user_id;
                
            WHEN 'comments_count' THEN
                SELECT LEAST(100, (COUNT(*) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                FROM comments WHERE user_id = p_user_id;
                
            WHEN 'prayers_shared' THEN
                SELECT LEAST(100, (COUNT(*) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                FROM prayer_posts WHERE user_id = p_user_id;
                
            WHEN 'journal_entries' THEN
                SELECT LEAST(100, (COUNT(*) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                FROM journal_entries WHERE user_id = p_user_id;
                
            WHEN 'days_active' THEN
                SELECT LEAST(100, (EXTRACT(DAYS FROM (NOW() - created_at)) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                FROM profiles WHERE id = p_user_id;
                
            WHEN 'streak_days' THEN
                SELECT LEAST(100, (COALESCE(current_streak, 0) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                FROM user_journal_streaks WHERE user_id = p_user_id;
                
            WHEN 'special' THEN
                -- Implementar lógica específica baseada na métrica
                CASE requirement_record->>'metric'
                    WHEN 'likes_given' THEN
                        SELECT LEAST(100, (COUNT(*) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                        FROM post_likes WHERE user_id = p_user_id;
                    WHEN 'prayer_amens' THEN
                        SELECT LEAST(100, (COUNT(*) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                        FROM prayer_amens WHERE user_id = p_user_id;
                    WHEN 'journal_streak' THEN
                        SELECT LEAST(100, (COALESCE(current_streak, 0) * 100 / (requirement_record->>'value')::INTEGER)) INTO requirement_progress
                        FROM user_journal_streaks WHERE user_id = p_user_id;
                    WHEN 'nath_approved' THEN
                        SELECT CASE WHEN COUNT(*) > 0 THEN 100 ELSE 0 END INTO requirement_progress
                        FROM posts WHERE author_id = p_user_id AND nathy_aproved = true;
                    ELSE
                        requirement_progress := 0;
                END CASE;
                
            ELSE
                requirement_progress := 0;
        END CASE;
        
        progress_value := progress_value + requirement_progress;
    END LOOP;
    
    -- Calcular média
    progress_value := progress_value / total_requirements;
    
    -- Atualizar ou inserir progresso
    INSERT INTO badge_progress (user_id, badge_id, progress, last_updated)
    VALUES (p_user_id, p_badge_id, progress_value, NOW())
    ON CONFLICT (user_id, badge_id) 
    DO UPDATE SET 
        progress = progress_value,
        last_updated = NOW();
    
    RETURN progress_value;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS - BADGES
-- =====================================================

INSERT INTO badges (id, name, description, icon, category, rarity, color, requirements) VALUES
-- PARTICIPAÇÃO
('first_post', 'Primeira Publicação', 'Compartilhou seu primeiro post no ClubNath', '📝', 'participation', 'common', '#10B981', 
 '[{"type": "posts_count", "value": 1, "description": "Fazer 1 post"}]'),

('social_butterfly', 'Borboleta Social', 'Compartilhou 10 posts com a comunidade', '🦋', 'participation', 'common', '#8B5CF6', 
 '[{"type": "posts_count", "value": 10, "description": "Fazer 10 posts"}]'),

('content_creator', 'Criadora de Conteúdo', 'Compartilhou 50 posts com a comunidade', '✨', 'participation', 'rare', '#F59E0B', 
 '[{"type": "posts_count", "value": 50, "description": "Fazer 50 posts"}]'),

('helpful_commenter', 'Comentadora Apoiadora', 'Deixou 25 comentários em posts de outras mães', '💬', 'participation', 'common', '#06B6D4', 
 '[{"type": "comments_count", "value": 25, "description": "Fazer 25 comentários"}]'),

('community_cheerleader', 'Torcedora da Comunidade', 'Deixou 100 comentários apoiadores', '🎉', 'participation', 'rare', '#EF4444', 
 '[{"type": "comments_count", "value": 100, "description": "Fazer 100 comentários"}]'),

-- FÉ
('first_prayer', 'Primeira Oração', 'Compartilhou sua primeira oração com a comunidade', '🙏', 'faith', 'common', '#10B981', 
 '[{"type": "prayers_shared", "value": 1, "description": "Compartilhar 1 oração"}]'),

('prayer_warrior', 'Guerreira da Oração', 'Compartilhou 10 orações com a comunidade', '⚔️', 'faith', 'rare', '#8B5CF6', 
 '[{"type": "prayers_shared", "value": 10, "description": "Compartilhar 10 orações"}]'),

('intercessor', 'Intercessora', 'Compartilhou 25 orações e disse 50 améns', '🤲', 'faith', 'epic', '#F59E0B', 
 '[{"type": "prayers_shared", "value": 25, "description": "Compartilhar 25 orações"}, {"type": "special", "value": 50, "description": "Dizer 50 améns", "metric": "prayer_amens"}]'),

('faith_journaler', 'Jornalista da Fé', 'Escreveu 7 entradas de journal com prompts espirituais', '📖', 'faith', 'rare', '#06B6D4', 
 '[{"type": "journal_entries", "value": 7, "description": "7 entradas de journal"}]'),

-- APOIO
('first_like', 'Primeira Curtida', 'Curtiu seu primeiro post de outra mãe', '❤️', 'support', 'common', '#EF4444', 
 '[{"type": "special", "value": 1, "description": "Dar 1 curtida", "metric": "likes_given"}]'),

('supportive_friend', 'Amiga Apoiadora', 'Curtiu 50 posts de outras mães', '🤗', 'support', 'common', '#8B5CF6', 
 '[{"type": "special", "value": 50, "description": "Dar 50 curtidas", "metric": "likes_given"}]'),

('community_angel', 'Anjo da Comunidade', 'Curtiu 200 posts e deixou 50 comentários', '👼', 'support', 'rare', '#F59E0B', 
 '[{"type": "special", "value": 200, "description": "Dar 200 curtidas", "metric": "likes_given"}, {"type": "comments_count", "value": 50, "description": "Fazer 50 comentários"}]'),

('prayer_supporter', 'Apoiadora em Oração', 'Disse amém em 25 orações de outras mães', '🙌', 'support', 'rare', '#10B981', 
 '[{"type": "special", "value": 25, "description": "Dizer 25 améns", "metric": "prayer_amens"}]'),

-- JORNADA
('early_bird', 'Madrugadora', 'Ativa no app por 7 dias consecutivos', '🌅', 'journey', 'common', '#F59E0B', 
 '[{"type": "streak_days", "value": 7, "description": "7 dias consecutivos ativa"}]'),

('dedicated_mom', 'Mãe Dedicada', 'Ativa no app por 30 dias consecutivos', '💪', 'journey', 'rare', '#8B5CF6', 
 '[{"type": "streak_days", "value": 30, "description": "30 dias consecutivos ativa"}]'),

('journal_keeper', 'Guardiã do Journal', 'Manteve um journal por 14 dias consecutivos', '📔', 'journey', 'rare', '#06B6D4', 
 '[{"type": "special", "value": 14, "description": "14 dias de journal", "metric": "journal_streak"}]'),

('clubnath_veteran', 'Veterana do ClubNath', 'Membro ativa por 90 dias', '🏆', 'journey', 'epic', '#F59E0B', 
 '[{"type": "days_active", "value": 90, "description": "90 dias ativa"}]'),

-- ESPECIAIS
('nath_approved', 'Nathy Aprovou', 'Teve um post destacado pela Nath', '👑', 'special', 'legendary', '#F59E0B', 
 '[{"type": "special", "value": 1, "description": "Post aprovado pela Nath", "metric": "nath_approved"}]'),

('early_adopter', 'Pioneira', 'Uma das primeiras 100 membros do ClubNath', '🚀', 'special', 'legendary', '#8B5CF6', 
 '[{"type": "special", "value": 100, "description": "Entre as primeiras 100", "metric": "early_member"}]')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VIEWS PARA RELATÓRIOS
-- =====================================================

-- View para leaderboard de badges
CREATE OR REPLACE VIEW badge_leaderboard AS
SELECT 
    p.id as user_id,
    p.full_name,
    COUNT(ub.id) as total_badges,
    COUNT(CASE WHEN b.rarity = 'rare' THEN 1 END) as rare_badges,
    COUNT(CASE WHEN b.rarity = 'epic' THEN 1 END) as epic_badges,
    COUNT(CASE WHEN b.rarity = 'legendary' THEN 1 END) as legendary_badges,
    MAX(ub.earned_at) as last_badge_earned
FROM profiles p
LEFT JOIN user_badges ub ON p.id = ub.user_id
LEFT JOIN badges b ON ub.badge_id = b.id
WHERE ub.is_earned = true
GROUP BY p.id, p.full_name
ORDER BY legendary_badges DESC, epic_badges DESC, rare_badges DESC, total_badges DESC;

-- View para estatísticas de badges
CREATE OR REPLACE VIEW badge_statistics AS
SELECT 
    b.category,
    b.rarity,
    COUNT(b.id) as total_badges,
    COUNT(ub.id) as earned_count,
    ROUND(COUNT(ub.id)::numeric / COUNT(b.id) * 100, 2) as earn_rate
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.is_earned = true
WHERE b.is_active = true
GROUP BY b.category, b.rarity
ORDER BY b.category, b.rarity;

-- View para progresso de badges por usuário
CREATE OR REPLACE VIEW user_badge_progress_view AS
SELECT 
    bp.user_id,
    bp.badge_id,
    b.name as badge_name,
    b.icon as badge_icon,
    b.category as badge_category,
    b.rarity as badge_rarity,
    bp.progress,
    CASE WHEN ub.is_earned THEN true ELSE false END as is_earned,
    ub.earned_at
FROM badge_progress bp
JOIN badges b ON bp.badge_id = b.id
LEFT JOIN user_badges ub ON bp.user_id = ub.user_id AND bp.badge_id = ub.badge_id
WHERE b.is_active = true
ORDER BY bp.user_id, b.category, b.rarity;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE badges IS 'Definições de badges disponíveis no sistema';
COMMENT ON TABLE user_badges IS 'Badges conquistadas pelos usuários';
COMMENT ON TABLE badge_progress IS 'Progresso em tempo real para cada badge';

COMMENT ON COLUMN badges.requirements IS 'Array JSON com requisitos para conquistar a badge';
COMMENT ON COLUMN badges.rarity IS 'Raridade: common, rare, epic, legendary';
COMMENT ON COLUMN badges.category IS 'Categoria: participation, faith, support, journey, special';

COMMENT ON COLUMN user_badges.progress IS 'Progresso da badge (0-100)';
COMMENT ON COLUMN user_badges.is_earned IS 'Se a badge foi conquistada';

COMMENT ON FUNCTION check_and_award_badges(UUID) IS 'Verifica e concede badges automaticamente para um usuário';
COMMENT ON FUNCTION update_badge_progress(UUID, TEXT) IS 'Atualiza o progresso de uma badge específica para um usuário';
