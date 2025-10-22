-- =====================================================
-- CLUBNATH JOURNALING SYSTEM
-- Sistema de Journaling Guiado
-- =====================================================

-- Tabela de prompts de journaling
CREATE TABLE IF NOT EXISTS journal_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('gratitude', 'reflection', 'challenge', 'growth', 'spiritual', 'daily')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'deep')),
    estimated_time INTEGER DEFAULT 5, -- em minutos
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de entradas de journal
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (length(content) >= 10 AND length(content) <= 5000),
    mood TEXT NOT NULL CHECK (mood IN ('happy', 'neutral', 'sad', 'anxious', 'tired', 'grateful', 'overwhelmed', 'peaceful')),
    prompt_id UUID REFERENCES journal_prompts(id),
    tags TEXT[] DEFAULT '{}',
    is_private BOOLEAN DEFAULT true,
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de streaks de journaling
CREATE TABLE IF NOT EXISTS user_journal_streaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_entry_date DATE,
    streak_start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de tags de journaling
CREATE TABLE IF NOT EXISTS journal_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    color TEXT DEFAULT '#8B5CF6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE journal_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journal_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_tags ENABLE ROW LEVEL SECURITY;

-- Políticas para journal_prompts
CREATE POLICY "Anyone can view active journal prompts" ON journal_prompts
    FOR SELECT USING (is_active = true);

-- Políticas para journal_entries
CREATE POLICY "Users can view own journal entries" ON journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create journal entries" ON journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para user_journal_streaks
CREATE POLICY "Users can view own journal streaks" ON user_journal_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own journal streaks" ON user_journal_streaks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal streaks" ON user_journal_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para journal_tags
CREATE POLICY "Anyone can view active journal tags" ON journal_tags
    FOR SELECT USING (is_active = true);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para journal_entries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood ON journal_entries(mood);
CREATE INDEX IF NOT EXISTS idx_journal_entries_prompt_id ON journal_entries(prompt_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_is_private ON journal_entries(is_private);

-- Índice para busca de texto
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_search ON journal_entries USING gin(to_tsvector('portuguese', content));

-- Índice para tags
CREATE INDEX IF NOT EXISTS idx_journal_entries_tags ON journal_entries USING gin(tags);

-- Índices para user_journal_streaks
CREATE INDEX IF NOT EXISTS idx_user_journal_streaks_user_id ON user_journal_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journal_streaks_current_streak ON user_journal_streaks(current_streak DESC);

-- Índices para journal_prompts
CREATE INDEX IF NOT EXISTS idx_journal_prompts_category ON journal_prompts(category);
CREATE INDEX IF NOT EXISTS idx_journal_prompts_difficulty ON journal_prompts(difficulty);
CREATE INDEX IF NOT EXISTS idx_journal_prompts_is_active ON journal_prompts(is_active);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_journal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_journal_prompts_updated_at 
    BEFORE UPDATE ON journal_prompts 
    FOR EACH ROW EXECUTE FUNCTION update_journal_updated_at();

CREATE TRIGGER update_journal_entries_updated_at 
    BEFORE UPDATE ON journal_entries 
    FOR EACH ROW EXECUTE FUNCTION update_journal_updated_at();

CREATE TRIGGER update_user_journal_streaks_updated_at 
    BEFORE UPDATE ON user_journal_streaks 
    FOR EACH ROW EXECUTE FUNCTION update_journal_updated_at();

-- Função para calcular word_count automaticamente
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
    NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular word_count
CREATE TRIGGER calculate_journal_word_count 
    BEFORE INSERT OR UPDATE ON journal_entries 
    FOR EACH ROW EXECUTE FUNCTION calculate_word_count();

-- Função para buscar entradas de journal com estatísticas
CREATE OR REPLACE FUNCTION get_journal_entries_with_stats(user_id_param UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    content TEXT,
    mood TEXT,
    prompt_id UUID,
    tags TEXT[],
    is_private BOOLEAN,
    word_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    prompt_title TEXT,
    prompt_content TEXT,
    prompt_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        je.id,
        je.user_id,
        je.content,
        je.mood,
        je.prompt_id,
        je.tags,
        je.is_private,
        je.word_count,
        je.created_at,
        je.updated_at,
        jp.title as prompt_title,
        jp.content as prompt_content,
        jp.category as prompt_category
    FROM journal_entries je
    LEFT JOIN journal_prompts jp ON je.prompt_id = jp.id
    WHERE je.user_id = user_id_param
    ORDER BY je.created_at DESC;
END;
$$ language 'plpgsql';

-- Função para estatísticas de journaling
CREATE OR REPLACE FUNCTION get_journal_stats(user_id_param UUID)
RETURNS TABLE (
    total_entries BIGINT,
    current_streak INTEGER,
    longest_streak INTEGER,
    entries_this_week BIGINT,
    entries_this_month BIGINT,
    average_word_count NUMERIC,
    last_entry_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM journal_entries WHERE user_id = user_id_param) as total_entries,
        (SELECT current_streak FROM user_journal_streaks WHERE user_id = user_id_param) as current_streak,
        (SELECT longest_streak FROM user_journal_streaks WHERE user_id = user_id_param) as longest_streak,
        (SELECT COUNT(*) FROM journal_entries 
         WHERE user_id = user_id_param 
         AND created_at >= NOW() - INTERVAL '7 days') as entries_this_week,
        (SELECT COUNT(*) FROM journal_entries 
         WHERE user_id = user_id_param 
         AND created_at >= NOW() - INTERVAL '30 days') as entries_this_month,
        (SELECT AVG(word_count) FROM journal_entries WHERE user_id = user_id_param) as average_word_count,
        (SELECT MAX(created_at) FROM journal_entries WHERE user_id = user_id_param) as last_entry_date;
END;
$$ language 'plpgsql';

-- =====================================================
-- DADOS INICIAIS - PROMPTS DE JOURNALING
-- =====================================================

INSERT INTO journal_prompts (title, content, category, difficulty, estimated_time) VALUES
-- Gratidão
('Três Coisas Boas', 'Escreva sobre três coisas pelas quais você é grata hoje. Pode ser algo grande ou pequeno, mas que trouxe alegria ao seu dia.', 'gratitude', 'easy', 5),
('Gratidão pela Maternidade', 'Reflita sobre um momento especial de hoje com seu(s) filho(s). O que te encheu o coração de gratidão?', 'gratitude', 'easy', 5),
('Pequenas Alegrias', 'Quais foram as pequenas alegrias que você experimentou hoje? Às vezes são os detalhes que fazem a diferença.', 'gratitude', 'easy', 5),

-- Reflexão
('Como Me Senti Hoje', 'Descreva como você se sentiu ao longo do dia. Quais emoções estiveram presentes? O que as despertou?', 'reflection', 'easy', 5),
('Desafio do Dia', 'Qual foi o maior desafio que você enfrentou hoje? Como lidou com ele? O que aprendeu?', 'reflection', 'medium', 10),
('Momento de Pausa', 'Se você pudesse dar um conselho para si mesma de ontem, o que diria? E para a você de amanhã?', 'reflection', 'medium', 10),

-- Crescimento
('Lições Aprendidas', 'Que lição você aprendeu hoje? Pode ser sobre maternidade, sobre si mesma, ou sobre a vida em geral.', 'growth', 'medium', 8),
('Crescimento Pessoal', 'Em que aspecto você sente que cresceu hoje? Que nova perspectiva ou habilidade desenvolveu?', 'growth', 'medium', 8),
('Metas e Sonhos', 'Onde você gostaria de estar daqui a um ano? Que passos pequenos pode dar hoje em direção a isso?', 'growth', 'deep', 15),

-- Espiritual
('Oração do Coração', 'Escreva uma oração espontânea sobre como se sente hoje. Fale com Deus como se fosse uma conversa com um amigo.', 'spiritual', 'easy', 5),
('Versículo Inspirador', 'Há algum versículo bíblico que tem tocado seu coração? Como ele se relaciona com sua vida hoje?', 'spiritual', 'medium', 10),
('Fé em Ação', 'Como você viu a fé se manifestar em sua vida hoje? Em que momentos sentiu a presença de Deus?', 'spiritual', 'medium', 10),

-- Desafio
('Autocompaixão', 'Se uma amiga estivesse passando pelo que você passou hoje, que conselho daria? Agora dê esse conselho a si mesma.', 'challenge', 'medium', 10),
('Culpa Materna', 'Há alguma culpa que você está carregando hoje? É real ou imaginária? Como pode se perdoar?', 'challenge', 'deep', 15),
('Limites Saudáveis', 'Em que situações você sentiu que precisava dizer "não" hoje? Como pode se proteger melhor?', 'challenge', 'deep', 15),

-- Diário
('Resumo do Dia', 'Faça um resumo do seu dia. O que aconteceu? Como se sentiu? O que foi mais marcante?', 'daily', 'easy', 5),
('Momentos Especiais', 'Quais foram os momentos mais especiais do seu dia? O que os tornou únicos?', 'daily', 'easy', 5),
('Amanhã Será Melhor', 'Que esperança você tem para amanhã? Que pequena coisa pode fazer para tornar o dia melhor?', 'daily', 'easy', 5)
ON CONFLICT DO NOTHING;

-- =====================================================
-- DADOS INICIAIS - TAGS DE JOURNALING
-- =====================================================

INSERT INTO journal_tags (name, category, color) VALUES
('Gratidão', 'emotion', '#10B981'),
('Reflexão', 'activity', '#8B5CF6'),
('Crescimento', 'growth', '#F59E0B'),
('Fé', 'spiritual', '#EF4444'),
('Maternidade', 'life', '#EC4899'),
('Desafios', 'challenge', '#6B7280'),
('Alegria', 'emotion', '#FCD34D'),
('Tristeza', 'emotion', '#60A5FA'),
('Esperança', 'emotion', '#34D399'),
('Paz', 'emotion', '#A78BFA'),
('Amor', 'emotion', '#FB7185'),
('Família', 'life', '#FDE68A'),
('Trabalho', 'life', '#94A3B8'),
('Saúde', 'life', '#6EE7B7'),
('Sonhos', 'future', '#FBBF24')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- VIEWS PARA RELATÓRIOS
-- =====================================================

-- View para entradas de journal populares
CREATE OR REPLACE VIEW popular_journal_prompts AS
SELECT 
    jp.*,
    COUNT(je.id) as usage_count
FROM journal_prompts jp
LEFT JOIN journal_entries je ON jp.id = je.prompt_id
WHERE jp.is_active = true
GROUP BY jp.id
ORDER BY usage_count DESC;

-- View para streaks de journaling
CREATE OR REPLACE VIEW journal_streak_leaderboard AS
SELECT 
    p.full_name,
    ujs.current_streak,
    ujs.longest_streak,
    ujs.last_entry_date
FROM user_journal_streaks ujs
JOIN profiles p ON ujs.user_id = p.id
WHERE ujs.current_streak > 0
ORDER BY ujs.current_streak DESC, ujs.longest_streak DESC;

-- View para estatísticas diárias de journaling
CREATE OR REPLACE VIEW daily_journal_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as entries_count,
    COUNT(DISTINCT user_id) as active_users,
    AVG(word_count) as avg_word_count,
    COUNT(CASE WHEN mood = 'happy' THEN 1 END) as happy_count,
    COUNT(CASE WHEN mood = 'grateful' THEN 1 END) as grateful_count,
    COUNT(CASE WHEN mood = 'sad' THEN 1 END) as sad_count,
    COUNT(CASE WHEN mood = 'anxious' THEN 1 END) as anxious_count
FROM journal_entries
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE journal_prompts IS 'Prompts guiados para journaling';
COMMENT ON TABLE journal_entries IS 'Entradas de journal dos usuários';
COMMENT ON TABLE user_journal_streaks IS 'Streaks de journaling dos usuários';
COMMENT ON TABLE journal_tags IS 'Tags para categorizar entradas de journal';

COMMENT ON COLUMN journal_entries.content IS 'Conteúdo da entrada de journal (10-5000 caracteres)';
COMMENT ON COLUMN journal_entries.mood IS 'Humor do usuário: happy, neutral, sad, anxious, tired, grateful, overwhelmed, peaceful';
COMMENT ON COLUMN journal_entries.word_count IS 'Número de palavras calculado automaticamente';
COMMENT ON COLUMN journal_entries.is_private IS 'Se a entrada é privada (padrão: true)';

COMMENT ON COLUMN journal_prompts.category IS 'Categoria do prompt: gratitude, reflection, challenge, growth, spiritual, daily';
COMMENT ON COLUMN journal_prompts.difficulty IS 'Dificuldade: easy, medium, deep';
COMMENT ON COLUMN journal_prompts.estimated_time IS 'Tempo estimado em minutos';

COMMENT ON FUNCTION get_journal_entries_with_stats(UUID) IS 'Retorna entradas de journal com informações do prompt';
COMMENT ON FUNCTION get_journal_stats(UUID) IS 'Retorna estatísticas de journaling para um usuário';
