-- =====================================================
-- CLUBNATH - APLICAR MIGRATIONS PASSO A PASSO
-- Execute cada seção no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- MIGRATION 1: SISTEMA DE BADGES
-- =====================================================

-- Tabela de badges
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    points INTEGER DEFAULT 0,
    requirements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de badges do usuário
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, badge_id)
);

-- RLS para badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para badges
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own badges" ON user_badges FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- MIGRATION 2: GRUPOS TEMÁTICOS
-- =====================================================

-- Tabela de grupos
CREATE TABLE IF NOT EXISTS groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT FALSE,
    max_members INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de membros do grupo
CREATE TABLE IF NOT EXISTS group_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Tabela de posts do grupo
CREATE TABLE IF NOT EXISTS group_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para grupos
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para grupos
CREATE POLICY "Groups are viewable by everyone" ON groups FOR SELECT USING (true);
CREATE POLICY "Users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Group members can view group" ON group_members FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Group members can view posts" ON group_posts FOR SELECT USING (
    EXISTS (SELECT 1 FROM group_members WHERE group_id = group_posts.group_id AND user_id = auth.uid())
);
CREATE POLICY "Group members can create posts" ON group_posts FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM group_members WHERE group_id = group_posts.group_id AND user_id = auth.uid())
);

-- =====================================================
-- MIGRATION 3: CHAT HISTORY COM MEMÓRIA
-- =====================================================

-- Tabela de histórico de chat
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'bot')),
    session_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de resumos de conversa
CREATE TABLE IF NOT EXISTS chat_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para chat history
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_summaries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para chat history
CREATE POLICY "Users can view their own chat history" ON chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat history" ON chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own chat summaries" ON chat_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat summaries" ON chat_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- MIGRATION 4: ESTUDOS BÍBLICOS
-- =====================================================

-- Tabela de estudos bíblicos
CREATE TABLE IF NOT EXISTS bible_studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    verse TEXT NOT NULL,
    reflection TEXT NOT NULL,
    question TEXT NOT NULL,
    prayer TEXT NOT NULL,
    practical_tip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de progresso do usuário
CREATE TABLE IF NOT EXISTS user_bible_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    study_id UUID REFERENCES bible_studies(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reflection TEXT,
    UNIQUE(user_id, study_id)
);

-- RLS para estudos bíblicos
ALTER TABLE bible_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bible_progress ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para estudos bíblicos
CREATE POLICY "Bible studies are viewable by everyone" ON bible_studies FOR SELECT USING (true);
CREATE POLICY "Users can view their own progress" ON user_bible_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_bible_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- MIGRATION 5: ORAÇÕES COMPARTILHADAS
-- =====================================================

-- Tabela de orações
CREATE TABLE IF NOT EXISTS prayer_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de "Améns"
CREATE TABLE IF NOT EXISTS prayer_amens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prayer_id UUID REFERENCES prayer_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prayer_id, user_id)
);

-- RLS para orações
ALTER TABLE prayer_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_amens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para orações
CREATE POLICY "Prayers are viewable by everyone" ON prayer_posts FOR SELECT USING (true);
CREATE POLICY "Users can create prayers" ON prayer_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can amen prayers" ON prayer_amens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view amens" ON prayer_amens FOR SELECT USING (true);

-- =====================================================
-- MIGRATION 6: JOURNALING GUIADO
-- =====================================================

-- Tabela de entradas de journal
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mood VARCHAR(20) NOT NULL,
    tags TEXT[],
    prompt_id UUID,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de prompts
CREATE TABLE IF NOT EXISTS journal_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'easy',
    estimated_time INTEGER DEFAULT 5
);

-- RLS para journaling
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_prompts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para journaling
CREATE POLICY "Users can view their own journal entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create journal entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Prompts are viewable by everyone" ON journal_prompts FOR SELECT USING (true);

-- =====================================================
-- MIGRATION 7: SOS EMOCIONAL
-- =====================================================

-- Tabela de recursos de emergência
CREATE TABLE IF NOT EXISTS emergency_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    contact_info TEXT NOT NULL,
    description TEXT,
    is_24h BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 1
);

-- Tabela de sessões de crise
CREATE TABLE IF NOT EXISTS crisis_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    crisis_level INTEGER NOT NULL CHECK (crisis_level BETWEEN 1 AND 4),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    techniques_used TEXT[],
    follow_up_scheduled BOOLEAN DEFAULT FALSE
);

-- RLS para SOS emocional
ALTER TABLE emergency_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para SOS emocional
CREATE POLICY "Emergency resources are viewable by everyone" ON emergency_resources FOR SELECT USING (true);
CREATE POLICY "Users can view their own crisis sessions" ON crisis_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create crisis sessions" ON crisis_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- MIGRATION 8: NOTIFICAÇÕES PUSH
-- =====================================================

-- Tabela de inscrições de notificação
CREATE TABLE IF NOT EXISTS notification_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para notificações
ALTER TABLE notification_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para notificações
CREATE POLICY "Users can manage their own subscriptions" ON notification_subscriptions FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- INSERIR DADOS INICIAIS
-- =====================================================

-- Inserir badges iniciais
INSERT INTO badges (name, description, icon, category, rarity, points) VALUES
('Primeira Oração', 'Compartilhou sua primeira oração', '🙏', 'spiritual', 'common', 10),
('Mãe Corajosa', 'Usou o SOS Emocional em momento difícil', '💪', 'emotional', 'rare', 25),
('Reflexiva', 'Completou 7 dias de journaling', '📝', 'personal', 'rare', 20),
('Estudiosa', 'Completou um estudo bíblico', '📖', 'spiritual', 'common', 15),
('Comunidade', 'Participou de 5 grupos', '👥', 'social', 'epic', 50);

-- Inserir estudos bíblicos iniciais
INSERT INTO bible_studies (day, title, verse, reflection, question, prayer, practical_tip) VALUES
(1, 'Quando Você Está No Limite', 'Mateus 11:28 - Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.', 'Miga, estar exausta não é fraqueza. Seu corpo passou por transformação radical. Noites sem dormir, amamentação, mudanças hormonais - tudo junto é realmente muito. Aquele cansaço que você sente? É real. Válido. E Deus não quer que você carregue isso sozinha.', 'Em que momento do dia você sente o cansaço mais pesado? E se você pudesse dar a si mesma permissão para descansar nesse momento?', 'Pai, meu corpo está cansado e minha alma também. Perdoa-me por achar que devo ser forte sozinha. Ensina-me a receber descanso como seu presente, não como falha.', 'Hoje, sem culpa: tire um cochilo de 20 minutos enquanto o bebê dorme, ou peça a alguém para segurar o bebê para você sentar em silêncio. Isso conta.');

-- Inserir recursos de emergência
INSERT INTO emergency_resources (name, type, contact_info, description, is_24h, priority) VALUES
('Centro de Valorização da Vida (CVV)', 'phone', '188', 'Atendimento 24h para prevenção do suicídio', true, 1),
('SAMU', 'phone', '192', 'Serviço de Atendimento Móvel de Urgência', true, 1),
('Disque 100', 'phone', '100', 'Disque Direitos Humanos', true, 2),
('Polícia Militar', 'phone', '190', 'Emergências policiais', true, 1);

-- Inserir prompts de journaling
INSERT INTO journal_prompts (category, text, difficulty, estimated_time) VALUES
('gratidão', 'Três coisas pelas quais você é grata hoje, mesmo nos momentos difíceis', 'easy', 5),
('reflexão', 'Como você se sente sobre sua jornada de maternidade hoje?', 'medium', 10),
('crescimento', 'O que você aprendeu sobre si mesma esta semana?', 'medium', 15),
('desafios', 'Qual foi seu maior desafio hoje e como você lidou com ele?', 'hard', 20);

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'MIGRATIONS APLICADAS COM SUCESSO!' as status;

-- Contar tabelas criadas
SELECT 
    COUNT(*) as total_tabelas,
    'Tabelas criadas' as descricao
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'badges', 'user_badges', 'groups', 'group_members', 'group_posts',
    'chat_history', 'chat_summaries', 'bible_studies', 'user_bible_progress',
    'prayer_posts', 'prayer_amens', 'journal_entries', 'journal_prompts',
    'emergency_resources', 'crisis_sessions', 'notification_subscriptions'
);
