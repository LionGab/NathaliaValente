-- =====================================================
-- CLUBNATH SOS EMOCIONAL SYSTEM
-- Sistema de Suporte em Crise Emocional
-- =====================================================

-- Tabela de recursos de emergência
CREATE TABLE IF NOT EXISTS emergency_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    whatsapp TEXT,
    email TEXT,
    category TEXT NOT NULL CHECK (category IN ('crisis', 'professional', 'support_group', 'emergency')),
    is_24h BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'pt-BR',
    region TEXT DEFAULT 'BR',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1, -- 1 = alta, 2 = média, 3 = baixa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de crise
CREATE TABLE IF NOT EXISTS crisis_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    crisis_level TEXT NOT NULL CHECK (crisis_level IN ('low', 'medium', 'high', 'critical')),
    initial_mood TEXT,
    final_mood TEXT,
    techniques_used TEXT[], -- Array de técnicas utilizadas
    resources_accessed TEXT[], -- Array de recursos acessados
    follow_up_needed BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    notes TEXT, -- Notas privadas do sistema
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de técnicas de coping
CREATE TABLE IF NOT EXISTS coping_techniques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('breathing', 'grounding', 'mindfulness', 'physical', 'cognitive', 'spiritual')),
    duration_minutes INTEGER DEFAULT 5,
    difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    instructions JSONB NOT NULL, -- Instruções passo a passo
    audio_url TEXT, -- URL para áudio guiado
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de uso de técnicas
CREATE TABLE IF NOT EXISTS technique_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    technique_id UUID REFERENCES coping_techniques(id) ON DELETE CASCADE,
    crisis_session_id UUID REFERENCES crisis_sessions(id) ON DELETE CASCADE,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    notes TEXT
);

-- Tabela de contatos de emergência do usuário
CREATE TABLE IF NOT EXISTS user_emergency_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT, -- Ex: "Mãe", "Amiga", "Psicóloga"
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    is_primary BOOLEAN DEFAULT false,
    can_contact_during_crisis BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de crises (para análise e melhoria)
CREATE TABLE IF NOT EXISTS crisis_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    crisis_session_id UUID REFERENCES crisis_sessions(id) ON DELETE CASCADE,
    trigger_event TEXT, -- O que desencadeou a crise
    time_of_day INTEGER, -- Hora do dia (0-23)
    day_of_week INTEGER, -- Dia da semana (1-7)
    duration_minutes INTEGER,
    techniques_effective TEXT[], -- Técnicas que funcionaram
    techniques_ineffective TEXT[], -- Técnicas que não funcionaram
    resources_used TEXT[],
    outcome TEXT CHECK (outcome IN ('resolved', 'improved', 'unchanged', 'worsened')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE emergency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE technique_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para emergency_resources
CREATE POLICY "Anyone can view active emergency resources" ON emergency_resources
    FOR SELECT USING (is_active = true);

-- Políticas para crisis_sessions
CREATE POLICY "Users can view own crisis sessions" ON crisis_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crisis sessions" ON crisis_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crisis sessions" ON crisis_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para coping_techniques
CREATE POLICY "Anyone can view active coping techniques" ON coping_techniques
    FOR SELECT USING (is_active = true);

-- Políticas para technique_usage
CREATE POLICY "Users can view own technique usage" ON technique_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own technique usage" ON technique_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para user_emergency_contacts
CREATE POLICY "Users can manage own emergency contacts" ON user_emergency_contacts
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para crisis_analytics
CREATE POLICY "Users can view own crisis analytics" ON crisis_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert crisis analytics" ON crisis_analytics
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para emergency_resources
CREATE INDEX IF NOT EXISTS idx_emergency_resources_category ON emergency_resources(category);
CREATE INDEX IF NOT EXISTS idx_emergency_resources_priority ON emergency_resources(priority);
CREATE INDEX IF NOT EXISTS idx_emergency_resources_is_active ON emergency_resources(is_active);

-- Índices para crisis_sessions
CREATE INDEX IF NOT EXISTS idx_crisis_sessions_user_id ON crisis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_sessions_started_at ON crisis_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_crisis_sessions_crisis_level ON crisis_sessions(crisis_level);
CREATE INDEX IF NOT EXISTS idx_crisis_sessions_is_resolved ON crisis_sessions(is_resolved);

-- Índices para coping_techniques
CREATE INDEX IF NOT EXISTS idx_coping_techniques_category ON coping_techniques(category);
CREATE INDEX IF NOT EXISTS idx_coping_techniques_difficulty ON coping_techniques(difficulty);
CREATE INDEX IF NOT EXISTS idx_coping_techniques_is_active ON coping_techniques(is_active);

-- Índices para technique_usage
CREATE INDEX IF NOT EXISTS idx_technique_usage_user_id ON technique_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_technique_usage_crisis_session_id ON technique_usage(crisis_session_id);
CREATE INDEX IF NOT EXISTS idx_technique_usage_used_at ON technique_usage(used_at DESC);

-- Índices para user_emergency_contacts
CREATE INDEX IF NOT EXISTS idx_user_emergency_contacts_user_id ON user_emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_emergency_contacts_is_primary ON user_emergency_contacts(is_primary);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_sos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_emergency_resources_updated_at 
    BEFORE UPDATE ON emergency_resources 
    FOR EACH ROW EXECUTE FUNCTION update_sos_updated_at();

-- Função para finalizar sessão de crise
CREATE OR REPLACE FUNCTION end_crisis_session(p_session_id UUID, p_final_mood TEXT, p_is_resolved BOOLEAN)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE crisis_sessions 
    SET 
        ended_at = NOW(),
        final_mood = p_final_mood,
        is_resolved = p_is_resolved
    WHERE id = p_session_id AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar uso de técnica
CREATE OR REPLACE FUNCTION log_technique_usage(
    p_technique_id UUID,
    p_crisis_session_id UUID,
    p_effectiveness_rating INTEGER DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    usage_id UUID;
BEGIN
    INSERT INTO technique_usage (
        user_id,
        technique_id,
        crisis_session_id,
        effectiveness_rating,
        notes
    ) VALUES (
        auth.uid(),
        p_technique_id,
        p_crisis_session_id,
        p_effectiveness_rating,
        p_notes
    ) RETURNING id INTO usage_id;
    
    RETURN usage_id;
END;
$$ LANGUAGE plpgsql;

-- Função para obter recursos de emergência por categoria
CREATE OR REPLACE FUNCTION get_emergency_resources_by_category(p_category TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    phone TEXT,
    website TEXT,
    whatsapp TEXT,
    email TEXT,
    is_24h BOOLEAN,
    is_free BOOLEAN,
    priority INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        er.id,
        er.name,
        er.description,
        er.phone,
        er.website,
        er.whatsapp,
        er.email,
        er.is_24h,
        er.is_free,
        er.priority
    FROM emergency_resources er
    WHERE er.category = p_category 
    AND er.is_active = true
    ORDER BY er.priority ASC, er.name ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS - RECURSOS DE EMERGÊNCIA
-- =====================================================

INSERT INTO emergency_resources (name, description, phone, website, whatsapp, category, is_24h, is_free, priority) VALUES
-- CRISE
('CVV - Centro de Valorização da Vida', 'Atendimento 24h para prevenção do suicídio', '188', 'https://www.cvv.org.br', NULL, 'crisis', true, true, 1),
('SAMU - Serviço de Atendimento Móvel de Urgência', 'Emergências médicas e de saúde mental', '192', 'https://www.gov.br/saude/pt-br', NULL, 'emergency', true, true, 1),
('Disque 100', 'Direitos Humanos - Violência contra mulheres', '100', 'https://www.gov.br/mdh/pt-br', NULL, 'crisis', true, true, 1),

-- PROFISSIONAL
('CRAS - Centro de Referência de Assistência Social', 'Assistência social e apoio psicológico', NULL, 'https://www.gov.br/cidadania/pt-br', NULL, 'professional', false, true, 2),
('CAPS - Centro de Atenção Psicossocial', 'Atenção psicossocial especializada', NULL, 'https://www.gov.br/saude/pt-br', NULL, 'professional', false, true, 2),
('Conselho Federal de Psicologia', 'Busca por psicólogos por região', NULL, 'https://www.cfp.org.br', NULL, 'professional', false, true, 3),

-- GRUPOS DE APOIO
('Amigas da Onça', 'Grupo de apoio para mães', NULL, 'https://www.instagram.com/amigasdaonca', NULL, 'support_group', false, true, 2),
('Mães que Amamentam', 'Apoio à amamentação', NULL, 'https://www.instagram.com/maesqueamamentam', NULL, 'support_group', false, true, 3),
('Depressão Pós-Parto Brasil', 'Grupo de apoio específico', NULL, 'https://www.facebook.com/groups/dppbrasil', NULL, 'support_group', false, true, 2)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DADOS INICIAIS - TÉCNICAS DE COPING
-- =====================================================

INSERT INTO coping_techniques (name, description, category, duration_minutes, difficulty, instructions) VALUES
-- RESPIRAÇÃO
('Respiração 4-7-8', 'Técnica de respiração para acalmar a ansiedade', 'breathing', 5, 'easy', 
 '{"steps": ["Inspire pelo nariz contando até 4", "Segure a respiração contando até 7", "Expire pela boca contando até 8", "Repita 4 vezes"]}'),

('Respiração Quadrada', 'Respiração em 4 tempos iguais', 'breathing', 3, 'easy',
 '{"steps": ["Inspire contando até 4", "Segure contando até 4", "Expire contando até 4", "Segure vazio contando até 4", "Repita 5 vezes"]}'),

-- GROUNDING
('5-4-3-2-1', 'Técnica de aterramento usando os 5 sentidos', 'grounding', 5, 'easy',
 '{"steps": ["5 coisas que você pode VER", "4 coisas que você pode TOCAR", "3 coisas que você pode OUVIR", "2 coisas que você pode CHEIRAR", "1 coisa que você pode SABOREAR"]}'),

('Aterramento Corporal', 'Foco na sensação do corpo no presente', 'grounding', 7, 'medium',
 '{"steps": ["Sente-se confortavelmente", "Feche os olhos", "Sinta seus pés no chão", "Sinta seu corpo na cadeira", "Respire profundamente", "Abra os olhos lentamente"]}'),

-- MINDFULNESS
('Meditação de 5 Minutos', 'Meditação guiada para acalmar a mente', 'mindfulness', 5, 'easy',
 '{"steps": ["Sente-se confortavelmente", "Feche os olhos", "Foque na respiração", "Quando a mente divagar, volte ao foco", "Termine com gratidão"]}'),

('Body Scan', 'Varredura corporal para relaxamento', 'mindfulness', 10, 'medium',
 '{"steps": ["Deite-se confortavelmente", "Comece pelos pés", "Vá subindo pelo corpo", "Observe cada sensação", "Relaxe cada parte", "Termine relaxado"]}'),

-- FÍSICO
('Exercício de Liberação', 'Movimentos para liberar tensão', 'physical', 5, 'easy',
 '{"steps": ["Gire os ombros para trás", "Estique os braços para cima", "Gire o pescoço suavemente", "Estique as pernas", "Respire profundamente"]}'),

('Caminhada Consciente', 'Caminhada focada no presente', 'physical', 10, 'easy',
 '{"steps": ["Caminhe devagar", "Sinta cada passo", "Observe o ambiente", "Respire naturalmente", "Foque no movimento"]}'),

-- COGNITIVO
('Reframing Positivo', 'Reestruturação de pensamentos negativos', 'cognitive', 7, 'medium',
 '{"steps": ["Identifique o pensamento negativo", "Questione sua veracidade", "Encontre evidências contrárias", "Reformule de forma positiva", "Repita a nova versão"]}'),

('Lista de Gratidão', 'Foco em aspectos positivos da vida', 'cognitive', 5, 'easy',
 '{"steps": ["Pegue papel e caneta", "Liste 3 coisas pelas quais é grata", "Escreva por que é grata por cada uma", "Leia em voz alta", "Guarde a lista"]}'),

-- ESPIRITUAL
('Oração de Paz', 'Oração para encontrar calma interior', 'spiritual', 5, 'easy',
 '{"steps": ["Sente-se em posição confortável", "Feche os olhos", "Respire profundamente", "Faça sua oração de paz", "Termine com gratidão"]}'),

('Versículo de Conforto', 'Meditação em versículo bíblico', 'spiritual', 7, 'easy',
 '{"steps": ["Escolha um versículo de conforto", "Leia em voz alta", "Reflita sobre o significado", "Aplique à sua situação", "Termine com oração"]}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- VIEWS PARA RELATÓRIOS
-- =====================================================

-- View para estatísticas de crise
CREATE OR REPLACE VIEW crisis_statistics AS
SELECT 
    DATE_TRUNC('month', started_at) as month,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN crisis_level = 'critical' THEN 1 END) as critical_sessions,
    COUNT(CASE WHEN is_resolved = true THEN 1 END) as resolved_sessions,
    AVG(EXTRACT(EPOCH FROM (ended_at - started_at))/60) as avg_duration_minutes,
    COUNT(DISTINCT user_id) as unique_users
FROM crisis_sessions
WHERE started_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', started_at)
ORDER BY month DESC;

-- View para técnicas mais eficazes
CREATE OR REPLACE VIEW effective_techniques AS
SELECT 
    ct.name as technique_name,
    ct.category,
    COUNT(tu.id) as usage_count,
    AVG(tu.effectiveness_rating) as avg_effectiveness,
    COUNT(CASE WHEN tu.effectiveness_rating >= 4 THEN 1 END) as high_rating_count
FROM coping_techniques ct
LEFT JOIN technique_usage tu ON ct.id = tu.technique_id
WHERE tu.used_at >= NOW() - INTERVAL '6 months'
GROUP BY ct.id, ct.name, ct.category
HAVING COUNT(tu.id) > 0
ORDER BY avg_effectiveness DESC, usage_count DESC;

-- View para recursos mais acessados
CREATE OR REPLACE VIEW resource_usage_stats AS
SELECT 
    er.name as resource_name,
    er.category,
    COUNT(cs.id) as access_count,
    COUNT(CASE WHEN cs.crisis_level = 'critical' THEN 1 END) as critical_access_count
FROM emergency_resources er
LEFT JOIN crisis_sessions cs ON er.name = ANY(cs.resources_accessed)
WHERE cs.started_at >= NOW() - INTERVAL '6 months'
GROUP BY er.id, er.name, er.category
ORDER BY access_count DESC;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE emergency_resources IS 'Recursos de emergência e suporte para crises emocionais';
COMMENT ON TABLE crisis_sessions IS 'Sessões de crise dos usuários';
COMMENT ON TABLE coping_techniques IS 'Técnicas de coping e relaxamento';
COMMENT ON TABLE technique_usage IS 'Uso de técnicas de coping pelos usuários';
COMMENT ON TABLE user_emergency_contacts IS 'Contatos de emergência pessoais dos usuários';
COMMENT ON TABLE crisis_analytics IS 'Análise de padrões de crise para melhoria do sistema';

COMMENT ON COLUMN crisis_sessions.crisis_level IS 'Nível da crise: low, medium, high, critical';
COMMENT ON COLUMN coping_techniques.instructions IS 'Instruções passo a passo em formato JSON';
COMMENT ON COLUMN technique_usage.effectiveness_rating IS 'Avaliação de 1-5 da eficácia da técnica';

COMMENT ON FUNCTION end_crisis_session(UUID, TEXT, BOOLEAN) IS 'Finaliza uma sessão de crise';
COMMENT ON FUNCTION log_technique_usage(UUID, UUID, INTEGER, TEXT) IS 'Registra o uso de uma técnica de coping';
COMMENT ON FUNCTION get_emergency_resources_by_category(TEXT) IS 'Retorna recursos de emergência por categoria';
