-- =====================================================
-- CLUBNATH PRAYERS SYSTEM
-- Sistema de Orações Compartilhadas
-- =====================================================

-- Tabela de posts de oração
CREATE TABLE IF NOT EXISTS prayer_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (length(content) >= 10 AND length(content) <= 1000),
    is_anonymous BOOLEAN DEFAULT false,
    category TEXT CHECK (category IN ('gratitude', 'request', 'intercession', 'praise')) DEFAULT 'request',
    is_urgent BOOLEAN DEFAULT false,
    amen_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de amens (curtidas em orações)
CREATE TABLE IF NOT EXISTS prayer_amens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prayer_id UUID REFERENCES prayer_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prayer_id, user_id)
);

-- Tabela de categorias de oração
CREATE TABLE IF NOT EXISTS prayer_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE prayer_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_amens ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_categories ENABLE ROW LEVEL SECURITY;

-- Políticas para prayer_posts
CREATE POLICY "Anyone can view prayer posts" ON prayer_posts
    FOR SELECT USING (true);

CREATE POLICY "Users can create prayer posts" ON prayer_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer posts" ON prayer_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer posts" ON prayer_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para prayer_amens
CREATE POLICY "Anyone can view prayer amens" ON prayer_amens
    FOR SELECT USING (true);

CREATE POLICY "Users can create prayer amens" ON prayer_amens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer amens" ON prayer_amens
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para prayer_categories
CREATE POLICY "Anyone can view active prayer categories" ON prayer_categories
    FOR SELECT USING (is_active = true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para prayer_posts
CREATE INDEX IF NOT EXISTS idx_prayer_posts_user_id ON prayer_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_posts_created_at ON prayer_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_posts_category ON prayer_posts(category);
CREATE INDEX IF NOT EXISTS idx_prayer_posts_is_urgent ON prayer_posts(is_urgent);
CREATE INDEX IF NOT EXISTS idx_prayer_posts_amen_count ON prayer_posts(amen_count DESC);

-- Índice para busca de texto
CREATE INDEX IF NOT EXISTS idx_prayer_posts_content_search ON prayer_posts USING gin(to_tsvector('portuguese', content));

-- Índices para prayer_amens
CREATE INDEX IF NOT EXISTS idx_prayer_amens_prayer_id ON prayer_amens(prayer_id);
CREATE INDEX IF NOT EXISTS idx_prayer_amens_user_id ON prayer_amens(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_amens_created_at ON prayer_amens(created_at DESC);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_prayer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_prayer_posts_updated_at 
    BEFORE UPDATE ON prayer_posts 
    FOR EACH ROW EXECUTE FUNCTION update_prayer_updated_at();

-- Função para incrementar contador de amens
CREATE OR REPLACE FUNCTION increment_prayer_amen_count(prayer_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE prayer_posts 
    SET amen_count = amen_count + 1 
    WHERE id = prayer_id;
END;
$$ language 'plpgsql';

-- Função para decrementar contador de amens
CREATE OR REPLACE FUNCTION decrement_prayer_amen_count(prayer_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE prayer_posts 
    SET amen_count = GREATEST(amen_count - 1, 0) 
    WHERE id = prayer_id;
END;
$$ language 'plpgsql';

-- Função para buscar orações com estatísticas do usuário
CREATE OR REPLACE FUNCTION get_prayers_with_user_stats(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    content TEXT,
    is_anonymous BOOLEAN,
    category TEXT,
    is_urgent BOOLEAN,
    amen_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    user_name TEXT,
    user_avatar_url TEXT,
    user_amened BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.id,
        pp.user_id,
        pp.content,
        pp.is_anonymous,
        pp.category,
        pp.is_urgent,
        pp.amen_count,
        pp.created_at,
        pp.updated_at,
        p.full_name as user_name,
        p.avatar_url as user_avatar_url,
        CASE 
            WHEN user_id_param IS NOT NULL THEN 
                EXISTS(
                    SELECT 1 FROM prayer_amens pa 
                    WHERE pa.prayer_id = pp.id 
                    AND pa.user_id = user_id_param
                )
            ELSE false
        END as user_amened
    FROM prayer_posts pp
    LEFT JOIN profiles p ON pp.user_id = p.id
    ORDER BY pp.created_at DESC;
END;
$$ language 'plpgsql';

-- Função para estatísticas de orações
CREATE OR REPLACE FUNCTION get_prayer_stats(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (
    total_prayers BIGINT,
    total_amens BIGINT,
    prayers_today BIGINT,
    amens_given BIGINT,
    prayers_shared BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM prayer_posts WHERE (user_id_param IS NULL OR user_id = user_id_param)) as total_prayers,
        (SELECT COUNT(*) FROM prayer_amens WHERE (user_id_param IS NULL OR user_id = user_id_param)) as total_amens,
        (SELECT COUNT(*) FROM prayer_posts 
         WHERE created_at >= CURRENT_DATE 
         AND (user_id_param IS NULL OR user_id = user_id_param)) as prayers_today,
        (SELECT COUNT(*) FROM prayer_amens WHERE user_id = user_id_param) as amens_given,
        (SELECT COUNT(*) FROM prayer_posts WHERE user_id = user_id_param) as prayers_shared;
END;
$$ language 'plpgsql';

-- =====================================================
-- DADOS INICIAIS - CATEGORIAS DE ORAÇÃO
-- =====================================================

INSERT INTO prayer_categories (id, name, description, icon, color) VALUES
('gratitude', 'Gratidão', 'Expressar gratidão e reconhecimento', '🙏', '#10B981'),
('request', 'Pedido', 'Solicitar ajuda e orientação', '💜', '#8B5CF6'),
('intercession', 'Intercessão', 'Orar por outras pessoas', '🤲', '#F59E0B'),
('praise', 'Louvores', 'Adorar e celebrar', '✨', '#EF4444')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VIEWS PARA RELATÓRIOS
-- =====================================================

-- View para orações populares
CREATE OR REPLACE VIEW popular_prayers AS
SELECT 
    pp.*,
    p.full_name as user_name,
    p.avatar_url as user_avatar_url,
    pp.amen_count,
    pp.created_at
FROM prayer_posts pp
LEFT JOIN profiles p ON pp.user_id = p.id
WHERE pp.created_at >= NOW() - INTERVAL '7 days'
ORDER BY pp.amen_count DESC, pp.created_at DESC;

-- View para orações urgentes
CREATE OR REPLACE VIEW urgent_prayers AS
SELECT 
    pp.*,
    p.full_name as user_name,
    p.avatar_url as user_avatar_url,
    pp.amen_count,
    pp.created_at
FROM prayer_posts pp
LEFT JOIN profiles p ON pp.user_id = p.id
WHERE pp.is_urgent = true
ORDER BY pp.created_at DESC;

-- View para estatísticas diárias
CREATE OR REPLACE VIEW daily_prayer_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as prayers_count,
    SUM(amen_count) as total_amens,
    COUNT(CASE WHEN is_urgent = true THEN 1 END) as urgent_prayers
FROM prayer_posts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE prayer_posts IS 'Posts de oração compartilhados pela comunidade';
COMMENT ON TABLE prayer_amens IS 'Amens (curtidas) em posts de oração';
COMMENT ON TABLE prayer_categories IS 'Categorias de oração disponíveis';

COMMENT ON COLUMN prayer_posts.content IS 'Conteúdo da oração (10-1000 caracteres)';
COMMENT ON COLUMN prayer_posts.is_anonymous IS 'Se a oração é anônima';
COMMENT ON COLUMN prayer_posts.category IS 'Categoria da oração: gratitude, request, intercession, praise';
COMMENT ON COLUMN prayer_posts.is_urgent IS 'Se a oração é urgente';
COMMENT ON COLUMN prayer_posts.amen_count IS 'Número de amens recebidos';

COMMENT ON FUNCTION increment_prayer_amen_count(UUID) IS 'Incrementa o contador de amens de uma oração';
COMMENT ON FUNCTION decrement_prayer_amen_count(UUID) IS 'Decrementa o contador de amens de uma oração';
COMMENT ON FUNCTION get_prayers_with_user_stats(UUID) IS 'Retorna orações com estatísticas do usuário logado';
COMMENT ON FUNCTION get_prayer_stats(UUID) IS 'Retorna estatísticas de orações para um usuário ou globalmente';
