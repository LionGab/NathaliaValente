-- =====================================================
-- CLUBNATH CHAT HISTORY - MEMÓRIA CONVERSACIONAL
-- NathIA Inteligente com Memória Persistente
-- =====================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA DE HISTÓRICO DE CONVERSAS
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'assistant')),
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'system')),
    metadata JSONB DEFAULT '{}', -- Para dados adicionais (tokens, model, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chat_history_message_length CHECK (char_length(message) >= 1 AND char_length(message) <= 4000)
);

-- =====================================================
-- 2. TABELA DE RESUMOS DE CONVERSAS
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_summaries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    summary TEXT NOT NULL,
    topics TEXT[], -- Array de tópicos discutidos
    mood_indicators JSONB DEFAULT '{}', -- Indicadores de humor/estado emocional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    
    -- Constraints
    UNIQUE(user_id, session_id)
);

-- =====================================================
-- 3. TABELA DE PREFERÊNCIAS DE MEMÓRIA
-- =====================================================
CREATE TABLE IF NOT EXISTS memory_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    memory_enabled BOOLEAN DEFAULT true,
    memory_retention_days INTEGER DEFAULT 30,
    auto_summarize BOOLEAN DEFAULT true,
    personalized_responses BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id),
    CONSTRAINT memory_retention_days_check CHECK (memory_retention_days >= 1 AND memory_retention_days <= 365)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para chat_history
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_created ON chat_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_sender ON chat_history(sender);

-- Índices para chat_summaries
CREATE INDEX IF NOT EXISTS idx_chat_summaries_user_id ON chat_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_summaries_expires_at ON chat_summaries(expires_at);
CREATE INDEX IF NOT EXISTS idx_chat_summaries_created_at ON chat_summaries(created_at DESC);

-- Índices para memory_preferences
CREATE INDEX IF NOT EXISTS idx_memory_preferences_user_id ON memory_preferences(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_preferences ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS PARA CHAT_HISTORY
-- =====================================================

-- Usuários podem ver apenas seu próprio histórico
CREATE POLICY "Users can view their own chat history" ON chat_history
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir mensagens em seu próprio histórico
CREATE POLICY "Users can insert their own chat history" ON chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias mensagens (para correções)
CREATE POLICY "Users can update their own chat history" ON chat_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar seu próprio histórico
CREATE POLICY "Users can delete their own chat history" ON chat_history
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA CHAT_SUMMARIES
-- =====================================================

-- Usuários podem ver apenas seus próprios resumos
CREATE POLICY "Users can view their own chat summaries" ON chat_summaries
    FOR SELECT USING (auth.uid() = user_id);

-- Sistema pode inserir resumos para usuários
CREATE POLICY "System can insert chat summaries" ON chat_summaries
    FOR INSERT WITH CHECK (true);

-- Sistema pode atualizar resumos
CREATE POLICY "System can update chat summaries" ON chat_summaries
    FOR UPDATE USING (true);

-- Sistema pode deletar resumos expirados
CREATE POLICY "System can delete expired chat summaries" ON chat_summaries
    FOR DELETE USING (true);

-- =====================================================
-- POLÍTICAS RLS PARA MEMORY_PREFERENCES
-- =====================================================

-- Usuários podem ver apenas suas próprias preferências
CREATE POLICY "Users can view their own memory preferences" ON memory_preferences
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir suas próprias preferências
CREATE POLICY "Users can insert their own memory preferences" ON memory_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias preferências
CREATE POLICY "Users can update their own memory preferences" ON memory_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem deletar suas próprias preferências
CREATE POLICY "Users can delete their own memory preferences" ON memory_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para limpar histórico antigo automaticamente
CREATE OR REPLACE FUNCTION cleanup_old_chat_history()
RETURNS void AS $$
BEGIN
    -- Deletar mensagens antigas (mais de 30 dias por padrão)
    DELETE FROM chat_history 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Deletar resumos expirados
    DELETE FROM chat_summaries 
    WHERE expires_at < NOW();
    
    -- Log da limpeza
    RAISE NOTICE 'Chat history cleanup completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para obter histórico recente de um usuário
CREATE OR REPLACE FUNCTION get_recent_chat_history(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    session_id UUID,
    message TEXT,
    sender VARCHAR(20),
    message_type VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ch.id,
        ch.session_id,
        ch.message,
        ch.sender,
        ch.message_type,
        ch.metadata,
        ch.created_at
    FROM chat_history ch
    WHERE ch.user_id = p_user_id
    ORDER BY ch.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Função para criar resumo de conversa
CREATE OR REPLACE FUNCTION create_chat_summary(
    p_user_id UUID,
    p_session_id UUID,
    p_summary TEXT,
    p_topics TEXT[] DEFAULT '{}',
    p_mood_indicators JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    summary_id UUID;
BEGIN
    INSERT INTO chat_summaries (user_id, session_id, summary, topics, mood_indicators)
    VALUES (p_user_id, p_session_id, p_summary, p_topics, p_mood_indicators)
    ON CONFLICT (user_id, session_id) 
    DO UPDATE SET 
        summary = EXCLUDED.summary,
        topics = EXCLUDED.topics,
        mood_indicators = EXCLUDED.mood_indicators,
        created_at = NOW(),
        expires_at = NOW() + INTERVAL '30 days'
    RETURNING id INTO summary_id;
    
    RETURN summary_id;
END;
$$ LANGUAGE plpgsql;

-- Função para obter contexto de conversa para o NathIA
CREATE OR REPLACE FUNCTION get_chat_context_for_ai(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    recent_messages JSONB;
    recent_summaries JSONB;
    user_preferences JSONB;
    context JSONB;
BEGIN
    -- Buscar mensagens recentes (últimas 10)
    SELECT jsonb_agg(
        jsonb_build_object(
            'message', message,
            'sender', sender,
            'timestamp', created_at,
            'session_id', session_id
        ) ORDER BY created_at DESC
    ) INTO recent_messages
    FROM (
        SELECT message, sender, created_at, session_id
        FROM chat_history 
        WHERE user_id = p_user_id 
        ORDER BY created_at DESC 
        LIMIT 10
    ) recent;
    
    -- Buscar resumos recentes (últimos 5)
    SELECT jsonb_agg(
        jsonb_build_object(
            'summary', summary,
            'topics', topics,
            'mood_indicators', mood_indicators,
            'created_at', created_at
        ) ORDER BY created_at DESC
    ) INTO recent_summaries
    FROM (
        SELECT summary, topics, mood_indicators, created_at
        FROM chat_summaries 
        WHERE user_id = p_user_id 
        AND expires_at > NOW()
        ORDER BY created_at DESC 
        LIMIT 5
    ) summaries;
    
    -- Buscar preferências do usuário
    SELECT jsonb_build_object(
        'memory_enabled', memory_enabled,
        'personalized_responses', personalized_responses,
        'memory_retention_days', memory_retention_days
    ) INTO user_preferences
    FROM memory_preferences 
    WHERE user_id = p_user_id;
    
    -- Montar contexto completo
    context := jsonb_build_object(
        'recent_messages', COALESCE(recent_messages, '[]'::jsonb),
        'recent_summaries', COALESCE(recent_summaries, '[]'::jsonb),
        'user_preferences', COALESCE(user_preferences, '{"memory_enabled": true, "personalized_responses": true}'::jsonb),
        'generated_at', NOW()
    );
    
    RETURN context;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas
CREATE TRIGGER trigger_chat_history_updated_at
    BEFORE UPDATE ON chat_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_memory_preferences_updated_at
    BEFORE UPDATE ON memory_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir preferências padrão para usuários existentes (opcional)
-- INSERT INTO memory_preferences (user_id, memory_enabled, personalized_responses)
-- SELECT id, true, true FROM auth.users
-- WHERE id NOT IN (SELECT user_id FROM memory_preferences);

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE chat_history IS 'Histórico de conversas do NathIA com memória persistente';
COMMENT ON TABLE chat_summaries IS 'Resumos de conversas para contexto do NathIA';
COMMENT ON TABLE memory_preferences IS 'Preferências de memória e privacidade dos usuários';

COMMENT ON FUNCTION get_recent_chat_history IS 'Retorna histórico recente de conversas de um usuário';
COMMENT ON FUNCTION create_chat_summary IS 'Cria ou atualiza resumo de conversa';
COMMENT ON FUNCTION get_chat_context_for_ai IS 'Retorna contexto completo para o NathIA';
COMMENT ON FUNCTION cleanup_old_chat_history IS 'Limpa histórico antigo automaticamente';

-- =====================================================
-- EXEMPLO DE USO
-- =====================================================

-- Exemplo: Buscar contexto para o NathIA
-- SELECT get_chat_context_for_ai('user-uuid-here');

-- Exemplo: Criar resumo de conversa
-- SELECT create_chat_summary(
--     'user-uuid-here',
--     'session-uuid-here',
--     'Conversa sobre amamentação e dificuldades do sono',
--     ARRAY['amamentação', 'sono', 'cansaço'],
--     '{"mood": "cansada", "stress_level": "alto"}'::jsonb
-- );

-- Exemplo: Limpar histórico antigo
-- SELECT cleanup_old_chat_history();

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
