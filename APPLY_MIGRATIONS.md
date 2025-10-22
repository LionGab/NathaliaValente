# 🚀 GUIA COMPLETO: APLICAR MIGRATIONS NO SUPABASE

## ⚙️ ORDEM EXATA DE EXECUÇÃO

Copie e execute cada bloco **na EXATA ORDEM** abaixo no Supabase SQL Editor:
https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new

---

## 📋 PASSO 1: EXECUÇÃO EM SEQUÊNCIA

### **1️⃣ PRIMEIRO - Execute setup-database.sql**
- Cria tabelas base: profiles, posts, comments, likes, badges, saved_items, chat_messages, daily_quotes
- Cria índices para performance
- Configura RLS (Row Level Security)

**Arquivo:** `supabase/migrations/setup-database.sql`

---

### **2️⃣ SEGUNDO - Execute setup_auth_trigger.sql**
- Cria função `handle_new_user()`
- Cria trigger para auto-criar perfil quando usuário faz signup
- Essencial para fluxo de autenticação

**Arquivo:** `supabase/migrations/setup_auth_trigger.sql`

---

### **3️⃣ TERCEIRO - Execute 20251015223118_create_clubnath_schema.sql**
- Cria schema completo do ClubNath
- Adiciona tabelas específicas
- Configura relacionamentos

**Arquivo:** `supabase/migrations/20251015223118_create_clubnath_schema.sql`

---

### **4️⃣ QUARTO - Execute 20251021_onboarding_system.sql**
- Adiciona campos de onboarding aos profiles
- `onboarding_completed`, `onboarding_step`, `onboarding_goals`, etc.
- Funções: `complete_onboarding()`, `get_onboarding_progress()`

**Arquivo:** `supabase/migrations/20251021_onboarding_system.sql`

---

### **5️⃣ QUINTO - Execute 20251021_notification_triggers.sql**
- Configura triggers para notificações automáticas
- Relacionamentos com posts, comentários, likes

**Arquivo:** `supabase/migrations/20251021_notification_triggers.sql`

---

### **6️⃣ SEXTO - Execute 20251021_notifications_system.sql**
- Tabela `notifications` com RLS
- Políticas de acesso
- Funções de notificação

**Arquivo:** `supabase/migrations/20251021_notifications_system.sql`

---

### **7️⃣ SÉTIMO - Execute 20251021_performance_optimization.sql**
- Índices adicionais para queries rápidas
- Materialized views para performance
- Configurações de cache

**Arquivo:** `supabase/migrations/20251021_performance_optimization.sql`

---

### **8️⃣ OITAVO - Execute 20251022_emotional_intelligence_system.sql**
- Tabelas para análise emocional
- Detecção de emoções em posts
- Sistema de recomendações

**Arquivo:** `supabase/migrations/20251022_emotional_intelligence_system.sql`

---

### **9️⃣ NONO - Execute 20250121_groups_system.sql**
- Tabelas: `groups`, `group_members`, `group_posts`
- RLS policies para grupos privados
- Permissões de admin/moderator

**Arquivo:** `supabase/migrations/20250121_groups_system.sql`

---

### **🔟 DÉCIMO - Execute 20250121_chat_history.sql**
- Tabela `chat_history` para salvar conversas
- Relacionamento com NathIA
- Índices para recuperar histórico

**Arquivo:** `supabase/migrations/20250121_chat_history.sql`

---

### **1️⃣1️⃣ DÉCIMO PRIMEIRO - Execute 20250121_bible_studies.sql**
- Tabela `bible_studies` para estudos bíblicos
- `daily_verses` para versículos do dia
- Comentários e notas dos usuários

**Arquivo:** `supabase/migrations/20250121_bible_studies.sql`

---

### **1️⃣2️⃣ DÉCIMO SEGUNDO - Execute 20250121_prayers_system.sql**
- Tabela `prayers` para orações compartilhadas
- `prayer_responses` para respostas
- Sistema de apoio comunitário

**Arquivo:** `supabase/migrations/20250121_prayers_system.sql`

---

### **1️⃣3️⃣ DÉCIMO TERCEIRO - Execute 20250121_journaling_system.sql**
- Tabela `journal_entries` para diários
- `journal_prompts` para perguntas guiadas
- Análise de sentimento por entrada

**Arquivo:** `supabase/migrations/20250121_journaling_system.sql`

---

### **1️⃣4️⃣ DÉCIMO QUARTO - Execute 20250121_notifications_system.sql**
- Sistema completo de notificações push
- Preferences do usuário
- Histórico de notificações

**Arquivo:** `supabase/migrations/20250121_notifications_system.sql`

---

### **1️⃣5️⃣ DÉCIMO QUINTO - Execute 20250121_badges_system.sql**
- Tabela `badges` para conquistas
- `user_badges` para vincular badges aos usuários
- Gamificação do app

**Arquivo:** `supabase/migrations/20250121_badges_system.sql`

---

### **1️⃣6️⃣ DÉCIMO SEXTO - Execute 20250121_sos_emotional.sql**
- Tabela `sos_emotional` para momentos de crise
- Sistema de suporte emocional
- Alertas para moderadores

**Arquivo:** `supabase/migrations/20250121_sos_emotional.sql`

---

### **1️⃣7️⃣ DÉCIMO SÉTIMO - Execute 20250122_privacy_controls.sql**
- Controles de privacidade dos usuários
- Bloqueio de usuários
- Visibilidade de perfil

**Arquivo:** `supabase/migrations/20250122_privacy_controls.sql`

---

## ✅ VERIFICAÇÃO APÓS EXECUÇÃO

Após executar TODAS as migrations, execute esta query no SQL Editor para verificar:

```sql
-- Verificar todas as tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Resultado esperado: 30+ tabelas
```

Você deve ver tabelas como:
- ✅ `profiles`
- ✅ `posts`
- ✅ `comments`
- ✅ `likes`
- ✅ `groups`
- ✅ `prayers`
- ✅ `journal_entries`
- ✅ `badges`
- ✅ `notifications`
- ✅ E muitas outras...

---

## 🔧 ALTERNATIVA: AUTOMÁTICO COM SUPABASE CLI

Se você tem Supabase CLI instalado:

```bash
supabase link --project-ref bbcwitnbnosyfpfjtzkr
supabase db push
```

---

## 🚀 PRÓXIMO PASSO

Após aplicar todas as migrations, execute:

```bash
npm run dev
```

O ClubNath estará **100% funcional!** 🎉

---

**📞 DÚVIDAS?** Consulte o README.md para mais detalhes de configuração.
