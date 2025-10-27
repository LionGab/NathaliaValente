# 🗄️ Arquitetura do Banco de Dados - ClubNath VIP

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Diagrama de Entidades](#diagrama-de-entidades)
3. [Tabelas](#tabelas)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Funções e Triggers](#funções-e-triggers)
6. [Índices e Performance](#índices-e-performance)

---

## Visão Geral

### Tecnologia

- **Database:** PostgreSQL 15 (via Supabase)
- **ORM:** Supabase Client JS
- **Autenticação:** Supabase Auth (JWT)
- **Storage:** Supabase Storage para arquivos

### Princípios de Design

- **Normalização:** 3NF (Third Normal Form)
- **Segurança:** Row Level Security em todas as tabelas
- **Performance:** Índices em colunas frequentemente consultadas
- **Auditoria:** `created_at` e `updated_at` em todas as tabelas

---

## Diagrama de Entidades

```
┌─────────────┐
│   auth.users│ (Supabase Auth)
└──────┬──────┘
       │ 1
       │
       │ *
┌──────▼──────────┐      ┌──────────────┐
│    profiles     │      │    posts     │
│                 │      │              │
│ - id (PK)       │      │ - id (PK)    │
│ - username      │◄─────┤ - user_id FK │
│ - avatar_url    │  1:* │ - content    │
│ - bio           │      │ - likes      │
└─────────────────┘      └──────┬───────┘
       │                         │
       │ 1                       │ 1
       │                         │
       │ *                       │ *
┌──────▼───────────┐    ┌───────▼────────┐
│  subscriptions   │    │   comments     │
│                  │    │                │
│ - id (PK)        │    │ - id (PK)      │
│ - user_id (FK)   │    │ - post_id (FK) │
│ - plan           │    │ - user_id (FK) │
│ - status         │    │ - content      │
└──────────────────┘    └────────────────┘

┌────────────────────┐
│ private_messages   │
│                    │
│ - id (PK)          │
│ - sender_id (FK)   │───┐
│ - recipient_id(FK) │   │ Both FK to profiles
│ - content          │   │
│ - read             │◄──┘
└────────────────────┘

┌──────────────┐      ┌───────────────┐
│   groups     │      │ group_members │
│              │      │               │
│ - id (PK)    │◄─────┤ - group_id FK │
│ - name       │  1:* │ - user_id FK  │
│ - owner_id   │      │ - role        │
└──────────────┘      └───────────────┘
```

---

## Tabelas

### 1. `profiles`

Armazena perfis de usuários (estende `auth.users`).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  is_premium BOOLEAN DEFAULT false,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**

```sql
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_is_premium ON profiles(is_premium);
```

**RLS:**

- ✅ SELECT: Público (todos podem ver perfis)
- ✅ UPDATE: Apenas o próprio usuário
- ✅ DELETE: Apenas o próprio usuário

---

### 2. `posts`

Posts criados por usuários.

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**

```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_is_premium ON posts(is_premium);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

**RLS:**

- ✅ SELECT: Usuários autenticados (premium content requer verificação adicional)
- ✅ INSERT: Usuários autenticados
- ✅ UPDATE: Apenas o autor
- ✅ DELETE: Apenas o autor

---

### 3. `comments`

Comentários em posts.

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Para respostas
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**

```sql
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
```

**RLS:**

- ✅ SELECT: Usuários autenticados
- ✅ INSERT: Usuários autenticados
- ✅ DELETE: Apenas o autor

---

### 4. `likes`

Curtidas em posts e comentários.

```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);
```

**Índices:**

```sql
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_comment_id ON likes(comment_id);
```

**RLS:**

- ✅ SELECT: Usuários autenticados
- ✅ INSERT: Usuários autenticados (apenas like próprio)
- ✅ DELETE: Apenas o próprio usuário

---

### 5. `follows`

Relações de seguir/seguidor.

```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);
```

**Índices:**

```sql
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

**RLS:**

- ✅ SELECT: Usuários autenticados
- ✅ INSERT: Usuários autenticados (apenas follow próprio)
- ✅ DELETE: Apenas o próprio usuário

---

### 6. `subscriptions`

Assinaturas premium dos usuários.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL, -- 'monthly', 'annual'
  status TEXT NOT NULL, -- 'active', 'canceled', 'expired'
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**

```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

**RLS:**

- ✅ SELECT: Apenas o próprio usuário
- ✅ INSERT: Apenas através de Edge Function (webhook Stripe)
- ✅ UPDATE: Apenas através de Edge Function

---

### 7. `private_messages`

Mensagens diretas entre usuários.

```sql
CREATE TABLE private_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**

```sql
CREATE INDEX idx_private_messages_sender_id ON private_messages(sender_id);
CREATE INDEX idx_private_messages_recipient_id ON private_messages(recipient_id);
CREATE INDEX idx_private_messages_read ON private_messages(read);
CREATE INDEX idx_private_messages_conversation ON private_messages(sender_id, recipient_id, created_at);
```

**RLS:**

- ✅ SELECT: Apenas remetente ou destinatário
- ✅ INSERT: Usuários autenticados (sender_id = auth.uid())
- ✅ UPDATE: Apenas destinatário (para marcar como lido)

---

### 8. `groups`

Grupos criados por usuários.

```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT false,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Índices:**

```sql
CREATE INDEX idx_groups_owner_id ON groups(owner_id);
CREATE INDEX idx_groups_is_private ON groups(is_private);
```

**RLS:**

- ✅ SELECT: Todos podem ver grupos públicos, membros veem grupos privados
- ✅ INSERT: Usuários autenticados
- ✅ UPDATE: Apenas o dono
- ✅ DELETE: Apenas o dono

---

### 9. `group_members`

Membros de grupos.

```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'owner', 'moderator', 'member'
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);
```

**Índices:**

```sql
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
```

**RLS:**

- ✅ SELECT: Membros do grupo
- ✅ INSERT: Usuários autenticados (join request)
- ✅ DELETE: Próprio usuário ou moderador/owner do grupo

---

## Row Level Security (RLS)

### Ativação Global

```sql
-- Ativar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
```

### Políticas de Exemplo

Ver arquivo [SECURITY.md](./SECURITY.md) para políticas detalhadas de RLS.

---

## Funções e Triggers

### 1. Atualizar `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas as tabelas com updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Incrementar Contadores

```sql
-- Trigger para atualizar likes_count em posts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_likes_count();
```

### 3. Atualizar Contagem de Seguidores

```sql
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;

    UPDATE profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET follower_count = follower_count - 1
    WHERE id = OLD.following_id;

    UPDATE profiles
    SET following_count = following_count - 1
    WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_follow_counts
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW
  EXECUTE FUNCTION update_follow_counts();
```

---

## Índices e Performance

### Estratégia de Indexação

1. **Primary Keys:** Índice automático
2. **Foreign Keys:** Sempre indexadas
3. **Colunas de filtro frequente:** `is_premium`, `status`, etc.
4. **Ordenação:** `created_at DESC` para queries de feed
5. **Full-text search:** Índices GIN para arrays e JSONB

### Monitoramento

```sql
-- Queries mais lentas
SELECT
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Índices não utilizados
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_%';
```

---

## 🔧 Manutenção

### Backup

- **Automático:** Supabase faz backup diário
- **Manual:** Via Dashboard > Database > Backups

### Migrações

```bash
# Criar nova migração
supabase migration new add_new_feature

# Aplicar migrações
supabase db push

# Reverter migração
supabase db reset
```

---

**Última Atualização:** 27 de Outubro de 2025  
**Versão:** 1.0.0
