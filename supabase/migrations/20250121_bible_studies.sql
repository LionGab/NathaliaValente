-- =====================================================
-- CLUBNATH BIBLE STUDIES - ESTUDOS BÍBLICOS PARA MÃES
-- Sistema de Estudos Bíblicos Personalizados
-- =====================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA DE ESTUDOS BÍBLICOS
-- =====================================================
CREATE TABLE IF NOT EXISTS bible_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    day INTEGER NOT NULL,
    verse TEXT NOT NULL,
    verse_reference VARCHAR(100) NOT NULL,
    reflection TEXT NOT NULL,
    question TEXT NOT NULL,
    prayer TEXT NOT NULL,
    practical_tip TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'maternity' CHECK (category IN ('maternity', 'postpartum', 'parenting', 'self-care', 'relationships', 'faith')),
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER DEFAULT 10, -- em minutos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT bible_studies_day_positive CHECK (day > 0),
    CONSTRAINT bible_studies_time_positive CHECK (estimated_time > 0)
);

-- =====================================================
-- 2. TABELA DE PROGRESSO DOS USUÁRIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_bible_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_id UUID NOT NULL REFERENCES bible_studies(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- em minutos
    user_reflection TEXT, -- reflexão pessoal do usuário
    prayer_response TEXT, -- resposta à oração
    practical_application TEXT, -- como aplicou a dica prática
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- avaliação do estudo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, study_id)
);

-- =====================================================
-- 3. TABELA DE PLANOS DE ESTUDO
-- =====================================================
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    total_days INTEGER NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'beginner',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT study_plans_days_positive CHECK (total_days > 0)
);

-- =====================================================
-- 4. TABELA DE INSCRIÇÕES EM PLANOS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_study_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES study_plans(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    current_day INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0, -- dias consecutivos
    total_time_spent INTEGER DEFAULT 0, -- em minutos
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, plan_id),
    CONSTRAINT user_study_plans_day_positive CHECK (current_day > 0),
    CONSTRAINT user_study_plans_streak_positive CHECK (streak_days >= 0)
);

-- =====================================================
-- 5. TABELA DE VERSÍCULOS FAVORITOS
-- =====================================================
CREATE TABLE IF NOT EXISTS favorite_verses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verse_text TEXT NOT NULL,
    verse_reference VARCHAR(100) NOT NULL,
    personal_note TEXT, -- nota pessoal do usuário
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, verse_reference)
);

-- =====================================================
-- 6. TABELA DE REFLEXÕES DIÁRIAS
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_reflections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    study_id UUID REFERENCES bible_studies(id) ON DELETE SET NULL,
    reflection_text TEXT NOT NULL,
    mood VARCHAR(20) CHECK (mood IN ('grateful', 'struggling', 'hopeful', 'overwhelmed', 'peaceful', 'anxious')),
    prayer_requests TEXT,
    gratitude_list TEXT[], -- array de gratidões
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT daily_reflections_text_length CHECK (char_length(reflection_text) >= 10)
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para bible_studies
CREATE INDEX IF NOT EXISTS idx_bible_studies_category ON bible_studies(category);
CREATE INDEX IF NOT EXISTS idx_bible_studies_difficulty ON bible_studies(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_bible_studies_day ON bible_studies(day);
CREATE INDEX IF NOT EXISTS idx_bible_studies_created_at ON bible_studies(created_at DESC);

-- Índices para user_bible_progress
CREATE INDEX IF NOT EXISTS idx_user_bible_progress_user_id ON user_bible_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bible_progress_study_id ON user_bible_progress(study_id);
CREATE INDEX IF NOT EXISTS idx_user_bible_progress_completed_at ON user_bible_progress(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_bible_progress_user_completed ON user_bible_progress(user_id, completed_at DESC);

-- Índices para study_plans
CREATE INDEX IF NOT EXISTS idx_study_plans_category ON study_plans(category);
CREATE INDEX IF NOT EXISTS idx_study_plans_active ON study_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_study_plans_difficulty ON study_plans(difficulty_level);

-- Índices para user_study_plans
CREATE INDEX IF NOT EXISTS idx_user_study_plans_user_id ON user_study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_study_plans_plan_id ON user_study_plans(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_study_plans_active ON user_study_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_study_plans_streak ON user_study_plans(user_id, streak_days DESC);

-- Índices para favorite_verses
CREATE INDEX IF NOT EXISTS idx_favorite_verses_user_id ON favorite_verses(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_verses_created_at ON favorite_verses(created_at DESC);

-- Índices para daily_reflections
CREATE INDEX IF NOT EXISTS idx_daily_reflections_user_id ON daily_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_created_at ON daily_reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_mood ON daily_reflections(mood);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE bible_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bible_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reflections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS PARA BIBLE_STUDIES
-- =====================================================

-- Todos podem ver estudos bíblicos (públicos)
CREATE POLICY "Anyone can view bible studies" ON bible_studies
    FOR SELECT USING (true);

-- Apenas admins podem inserir/atualizar/deletar estudos
CREATE POLICY "Only admins can modify bible studies" ON bible_studies
    FOR ALL USING (false); -- Será configurado com roles específicos

-- =====================================================
-- POLÍTICAS RLS PARA USER_BIBLE_PROGRESS
-- =====================================================

-- Usuários podem ver apenas seu próprio progresso
CREATE POLICY "Users can view their own bible progress" ON user_bible_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir/atualizar seu próprio progresso
CREATE POLICY "Users can modify their own bible progress" ON user_bible_progress
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA STUDY_PLANS
-- =====================================================

-- Todos podem ver planos de estudo ativos
CREATE POLICY "Anyone can view active study plans" ON study_plans
    FOR SELECT USING (is_active = true);

-- =====================================================
-- POLÍTICAS RLS PARA USER_STUDY_PLANS
-- =====================================================

-- Usuários podem ver apenas seus próprios planos
CREATE POLICY "Users can view their own study plans" ON user_study_plans
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir/atualizar seus próprios planos
CREATE POLICY "Users can modify their own study plans" ON user_study_plans
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA FAVORITE_VERSES
-- =====================================================

-- Usuários podem ver apenas seus próprios versículos favoritos
CREATE POLICY "Users can view their own favorite verses" ON favorite_verses
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir/atualizar/deletar seus próprios versículos favoritos
CREATE POLICY "Users can modify their own favorite verses" ON favorite_verses
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- POLÍTICAS RLS PARA DAILY_REFLECTIONS
-- =====================================================

-- Usuários podem ver apenas suas próprias reflexões
CREATE POLICY "Users can view their own daily reflections" ON daily_reflections
    FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem inserir/atualizar/deletar suas próprias reflexões
CREATE POLICY "Users can modify their own daily reflections" ON daily_reflections
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar progresso do usuário
CREATE OR REPLACE FUNCTION update_user_study_progress(
    p_user_id UUID,
    p_study_id UUID,
    p_time_spent INTEGER DEFAULT 0,
    p_user_reflection TEXT DEFAULT NULL,
    p_prayer_response TEXT DEFAULT NULL,
    p_practical_application TEXT DEFAULT NULL,
    p_rating INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    progress_id UUID;
BEGIN
    INSERT INTO user_bible_progress (
        user_id, study_id, completed_at, time_spent,
        user_reflection, prayer_response, practical_application, rating
    )
    VALUES (
        p_user_id, p_study_id, NOW(), p_time_spent,
        p_user_reflection, p_prayer_response, p_practical_application, p_rating
    )
    ON CONFLICT (user_id, study_id)
    DO UPDATE SET
        completed_at = NOW(),
        time_spent = EXCLUDED.time_spent,
        user_reflection = COALESCE(EXCLUDED.user_reflection, user_bible_progress.user_reflection),
        prayer_response = COALESCE(EXCLUDED.prayer_response, user_bible_progress.prayer_response),
        practical_application = COALESCE(EXCLUDED.practical_application, user_bible_progress.practical_application),
        rating = COALESCE(EXCLUDED.rating, user_bible_progress.rating),
        updated_at = NOW()
    RETURNING id INTO progress_id;
    
    RETURN progress_id;
END;
$$ LANGUAGE plpgsql;

-- Função para obter progresso do usuário
CREATE OR REPLACE FUNCTION get_user_bible_progress(p_user_id UUID)
RETURNS TABLE (
    study_id UUID,
    title VARCHAR(255),
    day INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER,
    rating INTEGER,
    streak_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bs.id,
        bs.title,
        bs.day,
        ubp.completed_at,
        ubp.time_spent,
        ubp.rating,
        usp.streak_days
    FROM bible_studies bs
    LEFT JOIN user_bible_progress ubp ON bs.id = ubp.study_id AND ubp.user_id = p_user_id
    LEFT JOIN user_study_plans usp ON usp.user_id = p_user_id
    ORDER BY bs.day;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular streak de estudos
CREATE OR REPLACE FUNCTION calculate_study_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
    has_study_today BOOLEAN;
BEGIN
    -- Verificar se há estudo hoje
    SELECT EXISTS(
        SELECT 1 FROM user_bible_progress 
        WHERE user_id = p_user_id 
        AND DATE(completed_at) = current_date
    ) INTO has_study_today;
    
    IF has_study_today THEN
        streak_count := 1;
        
        -- Contar dias consecutivos anteriores
        WHILE EXISTS(
            SELECT 1 FROM user_bible_progress 
            WHERE user_id = p_user_id 
            AND DATE(completed_at) = current_date - INTERVAL '1 day' * streak_count
        ) LOOP
            streak_count := streak_count + 1;
        END LOOP;
    END IF;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estudo do dia
CREATE OR REPLACE FUNCTION get_daily_study(p_user_id UUID, p_day INTEGER DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    day INTEGER,
    verse TEXT,
    verse_reference VARCHAR(100),
    reflection TEXT,
    question TEXT,
    prayer TEXT,
    practical_tip TEXT,
    category VARCHAR(50),
    difficulty_level VARCHAR(20),
    estimated_time INTEGER,
    is_completed BOOLEAN,
    user_progress JSONB
) AS $$
DECLARE
    target_day INTEGER;
BEGIN
    -- Se não especificado, usar o próximo dia não completado
    IF p_day IS NULL THEN
        SELECT COALESCE(MAX(bs.day) + 1, 1) INTO target_day
        FROM bible_studies bs
        LEFT JOIN user_bible_progress ubp ON bs.id = ubp.study_id AND ubp.user_id = p_user_id
        WHERE ubp.completed_at IS NULL
        ORDER BY bs.day
        LIMIT 1;
    ELSE
        target_day := p_day;
    END IF;
    
    RETURN QUERY
    SELECT 
        bs.id,
        bs.title,
        bs.day,
        bs.verse,
        bs.verse_reference,
        bs.reflection,
        bs.question,
        bs.prayer,
        bs.practical_tip,
        bs.category,
        bs.difficulty_level,
        bs.estimated_time,
        (ubp.completed_at IS NOT NULL) as is_completed,
        jsonb_build_object(
            'completed_at', ubp.completed_at,
            'time_spent', ubp.time_spent,
            'user_reflection', ubp.user_reflection,
            'prayer_response', ubp.prayer_response,
            'practical_application', ubp.practical_application,
            'rating', ubp.rating
        ) as user_progress
    FROM bible_studies bs
    LEFT JOIN user_bible_progress ubp ON bs.id = ubp.study_id AND ubp.user_id = p_user_id
    WHERE bs.day = target_day
    LIMIT 1;
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

-- Aplicar triggers nas tabelas
CREATE TRIGGER trigger_bible_studies_updated_at
    BEFORE UPDATE ON bible_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_bible_progress_updated_at
    BEFORE UPDATE ON user_bible_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_study_plans_updated_at
    BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_study_plans_updated_at
    BEFORE UPDATE ON user_study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS - ESTUDOS BÍBLICOS PARA MÃES
-- =====================================================

-- Inserir estudos bíblicos iniciais
INSERT INTO bible_studies (title, day, verse, verse_reference, reflection, question, prayer, practical_tip, category, difficulty_level, estimated_time) VALUES
(
    'Quando Você Está No Limite',
    1,
    'Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.',
    'Mateus 11:28',
    'Miga, estar exausta não é fraqueza. Seu corpo passou por transformação radical. Noites sem dormir, amamentação, mudanças hormonais - tudo junto é realmente muito. Aquele cansaço que você sente? É real. Válido. E Deus não quer que você carregue isso sozinha. Jesus não oferece culpa quando estamos no limite - oferece descanso. Não é preguiça buscar repouso. É sabedoria. Às vezes, pedir ajuda, tirar uma soneca, ou simplesmente parar é o ato mais espiritual que você pode fazer.',
    'Em que momento do dia você sente o cansaço mais pesado? E se você pudesse dar a si mesma permissão para descansar nesse momento?',
    'Pai, meu corpo está cansado e minha alma também. Perdoa-me por achar que devo ser forte sozinha. Ensina-me a receber descanso como seu presente, não como falha.',
    'Hoje, sem culpa: tire um cochilo de 20 minutos enquanto o bebê dorme, ou peça a alguém para segurar o bebê para você sentar em silêncio. Isso conta.',
    'postpartum',
    'beginner',
    15
),
(
    'A Culpa Que Você Não Merece Carregar',
    2,
    'Portanto, não há condenação para os que estão em Cristo Jesus.',
    'Romanos 8:1',
    'Você sente culpa? Por estar irritada. Por não amar cada momento. Por querer estar longe do bebê às vezes. Por não ser a mãe que imaginava. Miga, essa culpa não vem de Deus. Vem de uma narrativa que nos venderam: que maternidade deve ser perfeita, instintivo, bonito o tempo todo. Mentira. Você pode amar seu filho e estar furious. Pode se dedicar totalmente e ainda querer um tempo só seu. Isso não te torna má mãe - te torna humana. A Bíblia está cheia de mulheres que não tinham tudo sob controle, e Deus as viu com compaixão, não julgamento.',
    'Qual culpa você carrega que talvez não deveria? O que mudaria se você a soltasse?',
    'Senhor, solto a culpa que não me pertence. Vejo meus sentimentos contraditórios e escolho me amar como você me ama - com compaixão e sem condenação.',
    'Escreva uma culpa que você sente em um papel e a queime, jogue fora ou rasque. É um ato simbólico, mas funciona. Sua culpa não define sua maternidade.',
    'maternity',
    'beginner',
    12
),
(
    'Solidão em Meio a Multidões',
    3,
    'Com a minha voz clamo ao Senhor; com a minha voz suplico mercê ao Senhor... Derramaria meu clamor diante dele...',
    'Salmos 142:1-2',
    'Você está cercada - bebê, visitas, alguém sempre ao seu redor. E ao mesmo tempo nunca se sentiu tão sozinha. Essa solidão pós-parto é real, miga. Ninguém mais fala como você falava antes. As conversas giram em torno de fraldas e ganho de peso. Seu corpo mudou, sua vida mudou, mas ninguém vê você. Só veem ''a mãe''. Mesmo a Bíblia permite essa solidão - os Salmos inteiros gritam com ela. Deus não diz ''não se sinta sozinha''. Ele diz ''eu ouço seu clamor''. Sua solidão é válida, e Deus está nela com você.',
    'Que relacionamento você sente falta? E se pudesse ter uma conversa com alguém que realmente a visse, sem ser sobre maternidade, o que você falaria?',
    'Mesmo quando ninguém entende, você entende, Deus. Você me vê toda inteira - não só como mãe. Ajuda-me a encontrar ou recriar conexões que me lembrem quem eu sou.',
    'Mande uma mensagem a uma amiga contando algo sobre você (não sobre o bebê). Reconecte com você mesma através de alguém que também te vê.',
    'postpartum',
    'intermediate',
    18
),
(
    'Quando Você Acha Que Não É Boa O Suficiente',
    4,
    'Tudo posso naquele que me fortalece.',
    'Filipenses 4:13',
    'A comparação é uma mãe assassina de alegria. Aquela mãe que está sempre arrumada? Aquela cujo bebê dorme perfeitamente? Aquela que sabe exatamente o que fazer em cada situação? Não é real como você acha que é. E mesmo que fosse, suas circunstâncias são diferentes - seu bebê é diferente, seu corpo é diferente, sua história é diferente. Você não foi chamada a ser mãe assim. Você foi chamada a ser VOCÊ como mãe. Aquela que ama imperfeitamente mas de coração. Que tenta, falha, levanta. Isso é suficiente. Deus não escolhe mães perfeitas - escolhe mulheres que amam seus filhos naquele dia, naquela hora.',
    'De quem você está tentando ser cópia? E que qualidades genuinamente suas você está deixando de ver?',
    'Deus, liberta-me da comparação. Mostra-me que meus erros não me desqualificam. Que minha imperfeição é onde você trabalha.',
    'Liste 3 coisas que você faz bem como mãe (mesmo que pequenas: abraços, paciência em algum momento, cuidado). Leia quando duvidar.',
    'maternity',
    'beginner',
    14
),
(
    'Quando a Raiva Quer Explodir',
    5,
    'Irritem-se, porém não pequem; não deixem que o sol se ponha sobre a sua ira.',
    'Efésios 4:26',
    'Você está irritada. Com o bebê que não para de chorar. Com o parceiro que ''não entende''. Com seu corpo. Com a situação. E depois se sente CULPADA por estar irritada. Miga, Deus não proíbe raiva - proíbe o que você faz com ela. Raiva é um sinal de que algo importa para você, que você chegou ao limite, que precisa de mudança. É válida. Honrada na Bíblia por homens e mulheres. O que importa é não deixar essa raiva virar bílis - contra você mesma ou contra quem você ama. Às vezes você precisa sair da sala, chorar sozinha, sentir aquilo. Depois, quando passar, converter essa energia em mudança.',
    'Sob essa raiva, o que você realmente precisa que mudasse? Qual é o pedido que está escondido?',
    'Deus, honro minha raiva como sinal. Ensina-me a não negar o que sinto, mas a transformá-lo em força e clareza.',
    'Quando sentir raiva subindo: saia do ambiente por 5 minutos. Respire. Bata um pano molhado na pia. Grite para um travesseiro. Depois fale o que realmente precisa.',
    'maternity',
    'intermediate',
    16
),
(
    'Encontrar Ouro No Caos',
    6,
    'Regozijem-se sempre... deem graças em toda situação...',
    '1 Tessalonicenses 5:16-18',
    'Isso não é sobre fingir que tudo é perfeito. É sobre enxergar pequenas graças enquanto você está exausta. Gratidão no pós-parto não é ''obrigada por essa provação''. É ''aquele sorriso do bebê existiu''. ''Minha sogra fez sopa''. ''Consegui tomar banho quente''. ''Dormi 4 horas seguidas''. Gratidão é um músculo que você treina quando tudo parece cinzento. Não muda a realidade, mas muda como você a carrega. E sim, isso é difícil quando você está no fundo do poço. Comece pequeno. Uma coisa por dia. Não precisa ser grande.',
    'Qual é uma pequena coisa de hoje que você poderia ser grata? Nem que seja respirar ou um copo de água.',
    'Obrigada pelos pequenos milagres que quase não vejo. Pela graça que me sustenta. Pelo fato de ainda estar aqui.',
    'Note 3 coisas pequenas hoje - pode ser no telefone, uma frase. Releia à noite. Pequenas graças acumulam.',
    'postpartum',
    'beginner',
    10
),
(
    'Você Será Renovada',
    7,
    'Mas aqueles que confiam no Senhor renovarão as suas forças. Voarão alto como águias; correrão e não se cansarão; caminharão e não desmaiarão.',
    'Isaías 40:31',
    'Você chegou até aqui. Nessa semana você foi exausta, culpada, furiosa, solidária e ainda assim acordou cada dia. Isso é força. Isso é renovação acontecendo já. Não é mágica - é graça trabalhando enquanto você segue em frente. Essas semanas são duras, miga. Podem ser as mais duras da sua vida. Mas elas não duram para sempre. Seu corpo vai se recuperar. Seu sono vai melhorar. Seus sentimentos vão fazer mais sentido. E quando a névoa passar, você vai descobrir que sobreviveu. Que você era mais forte do que pensava. Que Deus estava ali o tempo todo, mesmo quando você não sentia.',
    'Qual é uma coisa que você quer fazer de novo quando as forças retornarem?',
    'Obrigada por me trazer até aqui. Mesmo cansada, mesmo ferida, eu continuo. Renova-me, Senhor. Lenta e firmemente, como só tu sabes fazer.',
    'Celebre hoje algo pequeno que você conseguiu essa semana. Uma chamada com uma amiga, um banho, levantar da cama. Você merece ver o que fez.',
    'maternity',
    'beginner',
    20
);

-- Criar plano de estudo padrão
INSERT INTO study_plans (name, description, category, total_days, difficulty_level) VALUES
(
    'Maternidade: Primeiros Passos',
    'Um plano de 7 dias para mães no pós-parto, focando em autocompaixão, descanso e conexão espiritual.',
    'postpartum',
    7,
    'beginner'
);

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE bible_studies IS 'Estudos bíblicos personalizados para mães';
COMMENT ON TABLE user_bible_progress IS 'Progresso dos usuários nos estudos bíblicos';
COMMENT ON TABLE study_plans IS 'Planos de estudo estruturados';
COMMENT ON TABLE user_study_plans IS 'Inscrições dos usuários em planos de estudo';
COMMENT ON TABLE favorite_verses IS 'Versículos favoritos dos usuários';
COMMENT ON TABLE daily_reflections IS 'Reflexões diárias dos usuários';

COMMENT ON FUNCTION get_daily_study IS 'Retorna o estudo bíblico do dia para um usuário';
COMMENT ON FUNCTION update_user_study_progress IS 'Atualiza o progresso de um usuário em um estudo';
COMMENT ON FUNCTION calculate_study_streak IS 'Calcula a sequência de dias de estudo de um usuário';
COMMENT ON FUNCTION get_user_bible_progress IS 'Retorna o progresso completo de estudos bíblicos de um usuário';

-- =====================================================
-- EXEMPLO DE USO
-- =====================================================

-- Exemplo: Obter estudo do dia
-- SELECT * FROM get_daily_study('user-uuid-here');

-- Exemplo: Atualizar progresso
-- SELECT update_user_study_progress(
--     'user-uuid-here',
--     'study-uuid-here',
--     15, -- tempo em minutos
--     'Minha reflexão pessoal...',
--     'Minha resposta à oração...',
--     'Como apliquei a dica prática...',
--     5 -- rating
-- );

-- Exemplo: Calcular streak
-- SELECT calculate_study_streak('user-uuid-here');

-- =====================================================
-- FIM DO SCHEMA
-- =====================================================
