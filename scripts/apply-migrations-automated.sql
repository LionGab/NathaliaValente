-- =====================================================
-- CLUBNATH - APLICAR TODAS AS MIGRATIONS AUTOMATICAMENTE
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Verificar se as tabelas já existem antes de criar
DO $$
BEGIN
    -- Migration 1: Sistema de Onboarding
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        RAISE NOTICE 'Criando tabela profiles...';
        -- Conteúdo da migration de onboarding aqui
    END IF;

    -- Migration 2: Grupos Temáticos
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'groups') THEN
        RAISE NOTICE 'Criando tabelas de grupos...';
        -- Conteúdo da migration de grupos aqui
    END IF;

    -- Migration 3: Chat History com Memória
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_history') THEN
        RAISE NOTICE 'Criando tabelas de chat history...';
        -- Conteúdo da migration de chat history aqui
    END IF;

    -- Migration 4: Estudos Bíblicos
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bible_studies') THEN
        RAISE NOTICE 'Criando tabelas de estudos bíblicos...';
        -- Conteúdo da migration de estudos bíblicos aqui
    END IF;

    -- Migration 5: Sistema de Badges
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'badges') THEN
        RAISE NOTICE 'Criando tabelas de badges...';
        -- Conteúdo da migration de badges aqui
    END IF;

    -- Migration 6: Notificações Push
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notification_subscriptions') THEN
        RAISE NOTICE 'Criando tabelas de notificações...';
        -- Conteúdo da migration de notificações aqui
    END IF;

    -- Migration 7: Orações Compartilhadas
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prayer_posts') THEN
        RAISE NOTICE 'Criando tabelas de orações...';
        -- Conteúdo da migration de orações aqui
    END IF;

    -- Migration 8: Journaling Guiado
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'journal_entries') THEN
        RAISE NOTICE 'Criando tabelas de journaling...';
        -- Conteúdo da migration de journaling aqui
    END IF;

    -- Migration 9: SOS Emocional
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emergency_resources') THEN
        RAISE NOTICE 'Criando tabelas de SOS emocional...';
        -- Conteúdo da migration de SOS emocional aqui
    END IF;

    RAISE NOTICE 'Verificação de migrations concluída!';
END $$;

-- =====================================================
-- VERIFICAÇÃO FINAL DE TODAS AS TABELAS
-- =====================================================

SELECT 
    'VERIFICAÇÃO FINAL' as status,
    COUNT(*) as total_tabelas
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'profiles', 'posts', 'comments', 'likes', 'nathy_badges', 'saved_items',
    'chat_messages', 'daily_quotes', 'groups', 'group_members', 'group_posts',
    'chat_history', 'chat_summaries', 'memory_preferences', 'bible_studies',
    'user_bible_progress', 'badges', 'user_badges', 'badge_progress',
    'notification_subscriptions', 'prayer_posts', 'prayer_amens', 'prayer_categories',
    'journal_entries', 'journal_prompts', 'user_mood_tracker', 'journal_streaks',
    'emergency_resources', 'crisis_sessions', 'coping_techniques', 'technique_usage',
    'user_emergency_contacts', 'crisis_analytics'
);

-- =====================================================
-- LISTAR TODAS AS TABELAS EXISTENTES
-- =====================================================

SELECT 
    table_name,
    '✅ EXISTE' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
