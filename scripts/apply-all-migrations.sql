-- =====================================================
-- CLUBNATH - APLICAR TODAS AS MIGRATIONS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Migration 1: Schema base do ClubNath
-- (Conteúdo da migration 20251015223118_create_clubnath_schema.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 2: Sistema de Onboarding
-- (Conteúdo da migration 20251021_onboarding_system.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 3: Grupos Temáticos
-- (Conteúdo da migration 20250121_groups_system.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 4: Chat History com Memória
-- (Conteúdo da migration 20250121_chat_history.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 5: Estudos Bíblicos
-- (Conteúdo da migration 20250121_bible_studies.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 6: Sistema de Badges
-- (Conteúdo da migration 20250121_badges_system.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 7: Notificações Push
-- (Conteúdo da migration 20250121_notifications_system.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 8: Orações Compartilhadas
-- (Conteúdo da migration 20250121_prayers_system.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 9: Journaling Guiado
-- (Conteúdo da migration 20250121_journaling_system.sql)
-- [Já aplicada - não incluir novamente]

-- Migration 10: SOS Emocional
-- (Conteúdo da migration 20250121_sos_emotional.sql)
-- [Já aplicada - não incluir novamente]

-- =====================================================
-- VERIFICAÇÃO DE TABELAS EXISTENTES
-- =====================================================

-- Verificar se todas as tabelas principais existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'profiles', 'posts', 'comments', 'likes', 'nathy_badges', 'saved_items',
            'chat_messages', 'daily_quotes', 'groups', 'group_members', 'group_posts',
            'chat_history', 'chat_summaries', 'memory_preferences', 'bible_studies',
            'user_bible_progress', 'badges', 'user_badges', 'badge_progress',
            'notification_subscriptions', 'prayer_posts', 'prayer_amens', 'prayer_categories',
            'journal_entries', 'journal_prompts', 'user_mood_tracker', 'journal_streaks',
            'emergency_resources', 'crisis_sessions', 'coping_techniques', 'technique_usage',
            'user_emergency_contacts', 'crisis_analytics'
        ) THEN '✅ EXISTE'
        ELSE '❌ FALTANDO'
    END as status
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
)
ORDER BY table_name;

-- =====================================================
-- VERIFICAÇÃO DE RLS (Row Level Security)
-- =====================================================

-- Verificar se RLS está habilitado nas tabelas principais
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS ATIVO'
        ELSE '❌ RLS DESATIVO'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'profiles', 'posts', 'comments', 'likes', 'groups', 'group_members',
    'chat_history', 'badges', 'user_badges', 'prayer_posts', 'journal_entries',
    'emergency_resources', 'crisis_sessions'
)
ORDER BY tablename;

-- =====================================================
-- VERIFICAÇÃO DE ÍNDICES
-- =====================================================

-- Verificar índices críticos
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =====================================================
-- VERIFICAÇÃO DE FUNÇÕES
-- =====================================================

-- Verificar funções customizadas
SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name IN (
            'check_and_award_badges', 'update_badge_progress', 'end_crisis_session',
            'log_technique_usage', 'get_emergency_resources_by_category'
        ) THEN '✅ EXISTE'
        ELSE '❌ FALTANDO'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN (
    'check_and_award_badges', 'update_badge_progress', 'end_crisis_session',
    'log_technique_usage', 'get_emergency_resources_by_category'
)
ORDER BY routine_name;

-- =====================================================
-- RESUMO FINAL
-- =====================================================

-- Contar total de tabelas, índices e funções
SELECT 
    'TABELAS' as tipo,
    COUNT(*) as total
FROM information_schema.tables 
WHERE table_schema = 'public'

UNION ALL

SELECT 
    'ÍNDICES' as tipo,
    COUNT(*) as total
FROM pg_indexes 
WHERE schemaname = 'public'

UNION ALL

SELECT 
    'FUNÇÕES' as tipo,
    COUNT(*) as total
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- =====================================================
-- INSTRUÇÕES DE USO
-- =====================================================

/*
INSTRUÇÕES PARA APLICAR:

1. Abra o SQL Editor do Supabase:
   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new

2. Execute este script completo

3. Verifique se todas as tabelas aparecem como "✅ EXISTE"

4. Se alguma tabela aparecer como "❌ FALTANDO", execute a migration correspondente:
   - profiles, posts, comments, likes: 20251015223118_create_clubnath_schema.sql
   - onboarding: 20251021_onboarding_system.sql
   - groups: 20250121_groups_system.sql
   - chat_history: 20250121_chat_history.sql
   - bible_studies: 20250121_bible_studies.sql
   - badges: 20250121_badges_system.sql
   - notifications: 20250121_notifications_system.sql
   - prayers: 20250121_prayers_system.sql
   - journaling: 20250121_journaling_system.sql
   - sos_emotional: 20250121_sos_emotional.sql

5. Após aplicar todas as migrations, o ClubNath estará 100% funcional!
*/
