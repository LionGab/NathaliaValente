# 📚 Guia Completo de Setup do Supabase - ClubNath

Este guia contém todas as instruções para configurar o backend Supabase para o aplicativo ClubNath, incluindo as novas funcionalidades de **Eventos** e **Followers**.

## 🚀 Início Rápido

### 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Anote a **URL** e **Anon Key** do projeto

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Instagram OAuth (Opcional)
VITE_INSTAGRAM_CLIENT_ID=seu_instagram_client_id_aqui

# Environment
VITE_ENV=development
```

## 📦 Executar Migrações

Execute as migrações SQL na seguinte ordem no **SQL Editor** do Supabase:

### 1. Setup Básico (já existente)
```sql
-- Execute: supabase/migrations/setup-database.sql
-- Execute: supabase/migrations/setup_auth_trigger.sql
```

### 2. Sistemas Principais (já existente)
```sql
-- Execute: supabase/migrations/20250121_badges_system.sql
-- Execute: supabase/migrations/20250121_groups_system.sql
-- Execute: supabase/migrations/20250121_prayers_system.sql
-- Execute: supabase/migrations/20250121_journaling_system.sql
-- Execute: supabase/migrations/20250121_notifications_system.sql
```

### 3. **✨ NOVAS FEATURES**

#### 3.1 Sistema de Eventos e Calendário
```sql
-- Execute: supabase/migrations/20251023_events_system.sql
```

**O que este sistema inclui:**
- ✅ Tabela `events` com eventos da comunidade
- ✅ Tabela `event_attendees` para registros
- ✅ Controle de vagas (max_attendees)
- ✅ Categorias: Workshop, Live, Meetup, Webinar, Masterclass
- ✅ Eventos online e presenciais
- ✅ Eventos premium e gratuitos
- ✅ RLS policies para segurança
- ✅ Funções para incrementar/decrementar participantes
- ✅ Dados de exemplo para teste

**Funcionalidades:**
- Criar e gerenciar eventos
- Registrar-se em eventos
- Calendário visual
- Limite de participantes
- Status automático (upcoming, ongoing, completed)

#### 3.2 Sistema de Followers/Conexões
```sql
-- Execute: supabase/migrations/20251023_followers_system.sql
```

**O que este sistema inclui:**
- ✅ Tabela `followers` para relações sociais
- ✅ Contadores `followers_count` e `following_count` nos perfis
- ✅ Função para verificar se segue alguém
- ✅ Função para pegar seguidores mútuos
- ✅ Triggers automáticos para atualizar contadores
- ✅ RLS policies para segurança
- ✅ Prevenção de auto-seguir

**Funcionalidades:**
- Seguir/deixar de seguir usuários
- Ver lista de seguidores
- Ver lista de seguindo
- Seguidores mútuos
- Sugestões de usuários para seguir

## 🔐 Configurar Autenticação

### 1. Habilitar Provedores de Auth

No painel do Supabase:
1. Vá para **Authentication** → **Providers**
2. Habilite:
   - ✅ Email (já habilitado)
   - ✅ Instagram (opcional)

### 2. Configurar Instagram OAuth (Opcional)

1. Crie um app no [Facebook Developers](https://developers.facebook.com)
2. Adicione o Instagram Basic Display
3. Configure as URLs de redirect:
   - `https://seu-projeto.supabase.co/auth/v1/callback`
   - `https://seu-site.netlify.app/*`
4. Copie o Client ID e cole no `.env`

### 3. Configurar URLs Permitidas

Em **Authentication** → **URL Configuration**, adicione:
```
https://seu-site.netlify.app
https://seu-site.netlify.app/**
http://localhost:5173
http://localhost:5173/**
```

## 🗄️ Verificar Estrutura do Banco

Após executar todas as migrações, você deve ter as seguintes tabelas:

### Tabelas Core
- `profiles` - Perfis de usuários
- `posts` - Posts da comunidade
- `comments` - Comentários em posts
- `likes` - Likes em posts

### Tabelas de Features
- `groups` - Grupos da comunidade
- `group_members` - Membros de grupos
- `group_posts` - Posts em grupos
- `prayers` - Pedidos de oração
- `prayer_responses` - Respostas a orações
- `journal_entries` - Diário pessoal
- `badges` - Sistema de conquistas
- `user_badges` - Badges dos usuários
- `notifications` - Notificações

### **✨ Novas Tabelas**
- `events` - Eventos da comunidade
- `event_attendees` - Participantes de eventos
- `followers` - Sistema de seguidores

## 📊 Verificar Storage Buckets

Crie os buckets de storage:

1. Vá para **Storage**
2. Crie os seguintes buckets (se não existirem):
   - `avatars` - Fotos de perfil
   - `posts` - Imagens de posts
   - `groups` - Imagens de grupos

### Políticas de Storage

Para cada bucket, configure as políticas:

**Política de Leitura (Público):**
```sql
bucket_id = 'nome-do-bucket'
```

**Política de Upload (Autenticado):**
```sql
bucket_id = 'nome-do-bucket' AND auth.role() = 'authenticated'
```

**Política de Atualização (Próprio usuário):**
```sql
bucket_id = 'nome-do-bucket' AND (storage.foldername(name))[1] = auth.uid()
```

## 🧪 Testar Funcionalidades

### 1. Testar Sistema de Eventos

```sql
-- Ver eventos criados
SELECT * FROM events ORDER BY start_date;

-- Ver participantes de um evento
SELECT
  e.title,
  p.full_name,
  ea.status
FROM event_attendees ea
JOIN events e ON e.id = ea.event_id
JOIN profiles p ON p.id = ea.user_id
WHERE e.id = 'ID_DO_EVENTO';
```

### 2. Testar Sistema de Followers

```sql
-- Ver seguidores de um usuário
SELECT
  p.full_name,
  p.followers_count,
  p.following_count
FROM followers f
JOIN profiles p ON p.id = f.follower_id
WHERE f.following_id = 'ID_DO_USUARIO';

-- Ver contadores atualizados
SELECT full_name, followers_count, following_count
FROM profiles
ORDER BY followers_count DESC
LIMIT 10;
```

## 🔧 Funcionalidades Avançadas

### Agendar Atualização de Status de Eventos

Configure um cron job para atualizar status de eventos automaticamente:

1. Vá para **Database** → **Functions**
2. Crie uma função HTTP:

```sql
CREATE OR REPLACE FUNCTION update_events_status_http()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.update_event_status();
  RETURN json_build_object('success', true);
END;
$$;
```

3. Configure um cron job externo (ex: cron-job.org) para chamar:
```
https://seu-projeto.supabase.co/rest/v1/rpc/update_events_status_http
```

### Habilitar Realtime

Para notificações em tempo real:

1. Vá para **Database** → **Replication**
2. Habilite realtime para:
   - `events`
   - `event_attendees`
   - `followers`
   - `notifications`
   - `group_posts`

## 📈 Monitoramento

### Ver Logs

Em **Logs** → **Database**, você pode ver:
- Queries executadas
- Erros
- Performance

### Ver Métricas

Em **Reports**, monitore:
- Número de usuários ativos
- Queries por minuto
- Storage usado
- Bandwidth

## 🚨 Troubleshooting

### Problema: Migrações falhando

**Solução:**
1. Verifique se está executando em ordem
2. Verifique se as tabelas necessárias existem
3. Veja os logs de erro no SQL Editor

### Problema: RLS impedindo acesso

**Solução:**
1. Verifique se o usuário está autenticado
2. Veja as políticas em **Authentication** → **Policies**
3. Teste as queries com diferentes usuários

### Problema: Storage não funciona

**Solução:**
1. Verifique se os buckets existem
2. Veja as políticas de storage
3. Teste com o console do Supabase primeiro

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guia de Storage](https://supabase.com/docs/guides/storage)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)

## ✅ Checklist Final

Antes de ir para produção, verifique:

- [ ] Todas as migrações executadas com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] URLs de autenticação configuradas
- [ ] Storage buckets criados e configurados
- [ ] RLS policies testadas
- [ ] Realtime habilitado nas tabelas necessárias
- [ ] Backup configurado
- [ ] Monitoramento ativo

---

**🎉 Parabéns! Seu backend Supabase está completo e pronto para produção!**

Para deploy no Netlify, siga as instruções no README principal.
