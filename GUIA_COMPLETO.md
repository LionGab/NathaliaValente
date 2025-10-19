# 🌸 ClubNath - Guia Completo de Configuração

Bem-vinda ao ClubNath! Este guia vai te ajudar a configurar o banco de dados e iniciar sua aplicação.

---

## 📋 Índice

1. [Configuração do Banco de Dados](#passo-1-configuração-do-banco-de-dados)
2. [Instalação de Dependências](#passo-2-instalação-de-dependências)
3. [Configuração do Supabase](#passo-3-configuração-do-supabase)
4. [Execução da Aplicação](#passo-4-execução-da-aplicação)
5. [Verificação do Setup](#passo-5-verificação-do-setup)

---

## Passo 1: Configuração do Banco de Dados

### 🔗 Onde executar o SQL?

Execute o SQL no Supabase SQL Editor:
**https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new**

### 📊 Tabelas Necessárias

O ClubNath requer as seguintes tabelas:

- **`profiles`** - Perfis de usuários
- **`posts`** - Posts do feed
- **`comments`** - Comentários nos posts
- **`likes`** - Curtidas nos posts
- **`nathy_badges`** - Badges especiais da Nathy
- **`saved_items`** - Itens salvos pelos usuários
- **`chat_messages`** - Mensagens do chat com o Robô Nath
- **`daily_quotes`** - Frases diárias inspiradoras

### 💻 SQL Completo

Copie e cole o seguinte SQL no editor do Supabase:

```sql
-- ========================================
-- ClubNath - Database Setup Script
-- ========================================
-- Este script cria todas as tabelas necessárias para o ClubNath
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new
-- ========================================

-- 1. TABELA DE PERFIS
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. TABELA DE POSTS
-- ========================================
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  caption text NOT NULL,
  category text NOT NULL CHECK (category IN ('Look do dia', 'Desabafo', 'Fé', 'Dica de mãe')),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. TABELA DE COMENTÁRIOS
-- ========================================
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. TABELA DE LIKES
-- ========================================
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. TABELA DE BADGES DA NATHY
-- ========================================
CREATE TABLE IF NOT EXISTS nathy_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id)
);

ALTER TABLE nathy_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON nathy_badges FOR SELECT
  TO authenticated
  USING (true);

-- 6. TABELA DE ITENS SALVOS
-- ========================================
CREATE TABLE IF NOT EXISTS saved_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  content text,
  type text NOT NULL CHECK (type IN ('post', 'quote', 'verse')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved items"
  ON saved_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved items"
  ON saved_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items"
  ON saved_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. TABELA DE MENSAGENS DO CHAT
-- ========================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_user boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 8. TABELA DE FRASES DIÁRIAS
-- ========================================
CREATE TABLE IF NOT EXISTS daily_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author text,
  type text NOT NULL CHECK (type IN ('motivational', 'verse', 'reflection')),
  date date NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quotes are viewable by everyone"
  ON daily_quotes FOR SELECT
  TO authenticated
  USING (true);

-- 9. ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_date ON daily_quotes(date);

-- 10. DADOS DE EXEMPLO (FRASES DIÁRIAS)
-- ========================================
INSERT INTO daily_quotes (content, author, type, date)
VALUES
  ('Você é mais forte do que imagina, mãe. Cada dia é uma vitória de amor.', 'Nathalia Valente', 'motivational', CURRENT_DATE),
  ('Provérbios 31:25 - Força e dignidade são os seus vestidos, e se alegra com o dia futuro.', 'Bíblia', 'verse', CURRENT_DATE + INTERVAL '1 day'),
  ('Maternidade não é perfeição, é presença. E você está fazendo um trabalho incrível.', 'Nathalia Valente', 'reflection', CURRENT_DATE + INTERVAL '2 days')
ON CONFLICT (date) DO NOTHING;

-- ========================================
-- ✅ SETUP COMPLETO!
-- ========================================
-- Todas as tabelas, policies e índices foram criados.
-- O ClubNath está pronto para uso! 🌸
```

### ✅ Verificação

Após executar o SQL, verifique se todas as tabelas foram criadas:

1. No Supabase Dashboard, vá para **Table Editor**
2. Você deve ver todas as 8 tabelas listadas:
   - ✓ profiles
   - ✓ posts
   - ✓ comments
   - ✓ likes
   - ✓ nathy_badges
   - ✓ saved_items
   - ✓ chat_messages
   - ✓ daily_quotes

---

## Passo 2: Instalação de Dependências

Instale as dependências do projeto:

```bash
npm install
```

---

## Passo 3: Configuração do Supabase

### 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 🔑 Onde encontrar suas credenciais?

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
2. Vá para **Settings** → **API**
3. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## Passo 4: Execução da Aplicação

### 🚀 Modo de Desenvolvimento

Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

### 🏗️ Build para Produção

Para criar uma build de produção:

```bash
npm run build
```

### 👀 Preview da Build

Para visualizar a build de produção localmente:

```bash
npm run preview
```

---

## Passo 5: Verificação do Setup

### ✅ Checklist de Verificação

- [ ] Todas as 8 tabelas foram criadas no Supabase
- [ ] Row Level Security (RLS) está habilitado em todas as tabelas
- [ ] Policies de segurança foram aplicadas
- [ ] Índices foram criados para performance
- [ ] Dados de exemplo foram inseridos (daily_quotes)
- [ ] Arquivo `.env` foi configurado com as credenciais corretas
- [ ] Dependências foram instaladas (`npm install`)
- [ ] Aplicação está rodando sem erros (`npm run dev`)

### 🧪 Testando a Aplicação

1. **Autenticação**: Tente criar uma conta e fazer login
2. **Feed**: Crie um novo post em uma das categorias
3. **Interações**: Teste curtir e comentar em posts
4. **Chat**: Envie mensagens para o Robô Nath
5. **Salvos**: Salve posts e quotes
6. **Daily Quote**: Verifique se a frase do dia aparece

---

## 🎯 Estrutura do Banco de Dados

### Diagrama de Relacionamentos

```
auth.users (Supabase Auth)
    ↓
profiles (1:1 com auth.users)
    ↓
    ├── posts (1:N)
    │   ├── comments (1:N)
    │   ├── likes (1:N)
    │   └── nathy_badges (1:1)
    │
    ├── saved_items (1:N)
    └── chat_messages (1:N)

daily_quotes (tabela independente)
```

### Categorias de Posts

- **Look do dia**: Posts sobre moda e estilo
- **Desabafo**: Espaço para compartilhar sentimentos
- **Fé**: Reflexões e versículos bíblicos
- **Dica de mãe**: Dicas sobre maternidade

### Tipos de Itens Salvos

- **post**: Posts salvos do feed
- **quote**: Frases motivacionais salvas
- **verse**: Versículos bíblicos salvos

### Tipos de Frases Diárias

- **motivational**: Frases motivacionais
- **verse**: Versículos bíblicos
- **reflection**: Reflexões sobre maternidade

---

## 🆘 Troubleshooting

### Erro: "relation does not exist"

**Solução**: Execute o SQL de setup novamente no Supabase SQL Editor.

### Erro: "RLS policy violated"

**Solução**: Verifique se você está autenticado. As policies requerem usuários autenticados.

### Erro: "Foreign key violation"

**Solução**: Certifique-se de que:
1. Um perfil foi criado após o signup (tabela `profiles`)
2. O perfil está vinculado ao usuário autenticado

### Posts não aparecem no feed

**Solução**: 
1. Verifique se há posts criados no banco
2. Execute no SQL Editor: `SELECT * FROM posts;`
3. Se vazio, crie alguns posts de teste

---

## 📚 Recursos Adicionais

### Documentação

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

### Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Supabase
2. Confira os logs do console do navegador
3. Revise os logs do terminal onde o app está rodando

---

## 🎉 Pronto!

Seu ClubNath está configurado e pronto para uso! 🌸

**Próximos passos:**
- Personalize os estilos e cores do seu tema
- Adicione mais frases diárias
- Convide usuários para testar
- Implemente recursos adicionais

Boa sorte com seu projeto! 💜
