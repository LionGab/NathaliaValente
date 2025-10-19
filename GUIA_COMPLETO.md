# 🌸 ClubNath - Guia Completo de Configuração

## 📊 Status Atual do Projeto

### ✅ O que já está configurado e funcionando:

1. **Frontend React + TypeScript**
   - ✅ Servidor de desenvolvimento rodando em http://localhost:5174/
   - ✅ Vite configurado com hot reload
   - ✅ Tailwind CSS para estilização
   - ✅ Componentes criados (Feed, Chat, Profile, etc)

2. **Supabase Backend**
   - ✅ Projeto vinculado: `bbcwitnbnosyfpfjtzkr`
   - ✅ Credenciais configuradas no `.env`
   - ✅ Edge Function `chat-ai` deployada com sucesso
   - ⚠️ Tabelas do banco precisam ser verificadas/criadas manualmente

3. **Autenticação e Contextos**
   - ✅ AuthContext configurado
   - ✅ ThemeContext (dark/light mode) configurado
   - ✅ Sistema de autenticação pronto

---

## 🚀 Como deixar 100% funcional

### Passo 1: Verificar/Criar Tabelas no Banco de Dados

Acesse o SQL Editor do Supabase:
https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new

Execute este SQL para verificar e criar as tabelas necessárias:

```sql
-- 1. Criar tabela de perfis (se não existir)
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

-- 2. Verificar e corrigir tabela posts
-- Primeiro, dropar a tabela se existir com estrutura incorreta
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts (
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

-- 3. Criar tabela de comentários
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

-- 4. Criar tabela de likes
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

-- 5. Criar tabela de badges da Nathy
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

-- 6. Criar tabela de itens salvos
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

-- 7. Criar tabela de mensagens do chat
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

-- 8. Criar tabela de frases diárias
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

-- 9. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quotes_date ON daily_quotes(date);

-- 10. Inserir dados de exemplo (frases diárias)
INSERT INTO daily_quotes (content, author, type, date)
VALUES
  ('Você é mais forte do que imagina, mãe. Cada dia é uma vitória de amor.', 'Nathalia Valente', 'motivational', CURRENT_DATE),
  ('Provérbios 31:25 - Força e dignidade são os seus vestidos, e se alegra com o dia futuro.', 'Bíblia', 'verse', CURRENT_DATE + INTERVAL ''1 day''),
  ('Maternidade não é perfeição, é presença. E você está fazendo um trabalho incrível.', 'Nathalia Valente', 'reflection', CURRENT_DATE + INTERVAL ''2 days'')
ON CONFLICT (date) DO NOTHING;
```

### Passo 2: Configurar API Key da Anthropic

Para que o Robô Nath funcione com IA real:

1. **Gere uma NOVA chave da Anthropic:**
   - Acesse: https://console.anthropic.com/settings/keys
   - Clique em "Create Key"
   - Copie a chave gerada

2. **Adicione aos Supabase Secrets:**
   - Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/vault
   - Clique em "New secret"
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Cole a chave que você gerou
   - Clique em "Add secret"

3. **Reinicie a Edge Function** (opcional, mas recomendado):
```bash
export SUPABASE_ACCESS_TOKEN=seu_token_aqui
npx supabase functions deploy chat-ai
```

### Passo 3: Configurar Autenticação

No Supabase Dashboard, configure os métodos de autenticação:

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/providers

2. Habilite "Email" auth (já deve estar habilitado)

3. Configure o Email Template se desejar personalizar

### Passo 4: Testar o Aplicativo

1. **Acesse:** http://localhost:5174/

2. **Crie uma conta:**
   - Clique em "Criar conta"
   - Preencha nome completo, email e senha
   - O perfil será criado automaticamente

3. **Teste as funcionalidades:**
   - ✅ Feed (visualizar posts vazios inicialmente)
   - ✅ Criar um post (adicione seu primeiro post!)
   - ✅ Chat com Robô Nath (se a API key estiver configurada)
   - ✅ Frases diárias
   - ✅ Perfil do usuário

---

## 🎯 Funcionalidades do ClubNath

### 1. **Feed de Posts** 📱
- Criar posts com categorias:
  - Look do dia (gradiente rosa)
  - Desabafo (gradiente roxo)
  - Fé (gradiente azul)
  - Dica de mãe (gradiente verde)
- Upload de imagens
- Curtir posts
- Comentar em posts
- Sistema de badges da Nathy

### 2. **Chat com Robô Nath** 🤖
- IA personalizada usando Claude 3.5 Haiku
- Respostas empáticas focadas em maternidade
- Histórico de conversas salvo

### 3. **Frases Diárias** ✨
- Motivacionais
- Versículos bíblicos
- Reflexões sobre maternidade
- Salvar frases favoritas

### 4. **Perfil** 👤
- Avatar personalizado
- Bio
- Ver posts do usuário
- Itens salvos

### 5. **Busca** 🔍
- Buscar posts por palavra-chave
- Filtrar por categoria
- Buscar usuários

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Iniciar servidor dev

# Build
npm run build                  # Build para produção
npm run preview                # Preview do build

# Type checking
npm run typecheck              # Verificar tipos TypeScript

# Supabase
npx supabase link              # Vincular projeto
npx supabase db push           # Aplicar migrations
npx supabase functions deploy  # Deploy de Edge Functions
npx supabase functions logs    # Ver logs das funções
```

---

## 📁 Estrutura do Projeto

```
boltnathH/
├── src/
│   ├── components/
│   │   ├── AuthPage.tsx           # Login/Cadastro
│   │   ├── FeedPage.tsx           # Feed de posts
│   │   ├── ChatPage.tsx           # Chat com IA
│   │   ├── DailyQuotePage.tsx     # Frases diárias
│   │   ├── ProfilePage.tsx        # Perfil do usuário
│   │   ├── SearchPage.tsx         # Busca
│   │   ├── CreatePostModal.tsx    # Modal criar post
│   │   ├── PostComments.tsx       # Comentários
│   │   ├── Header.tsx             # Cabeçalho
│   │   └── Navigation.tsx         # Navegação inferior
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Autenticação
│   │   └── ThemeContext.tsx       # Tema dark/light
│   ├── lib/
│   │   └── supabase.ts            # Cliente Supabase
│   ├── App.tsx                    # App principal
│   └── main.tsx                   # Entry point
├── supabase/
│   ├── functions/
│   │   └── chat-ai/
│   │       └── index.ts           # Edge Function IA
│   └── migrations/
│       └── *.sql                  # Database migrations
├── .env                           # Variáveis de ambiente
└── package.json                   # Dependências
```

---

## 🛡️ Segurança

### ✅ Configurado corretamente:
- Row Level Security (RLS) em todas as tabelas
- API keys no Supabase Vault (não no código)
- CORS configurado nas Edge Functions
- Autenticação via Supabase Auth

### ⚠️ IMPORTANTE:
- **NUNCA** commite o arquivo `.env` no Git (já está no `.gitignore`)
- **SEMPRE** revogue chaves expostas publicamente
- Use **Supabase Vault** para secrets, não variáveis de ambiente do frontend

---

## 🐛 Troubleshooting

### Problema: Tabelas não existem
**Solução:** Execute o SQL completo no Passo 1 acima

### Problema: Chat não responde com IA
**Solução:** Verifique se `ANTHROPIC_API_KEY` está no Supabase Vault

### Problema: Erro de autenticação
**Solução:** Verifique se as credenciais no `.env` estão corretas

### Problema: Edge Function não funciona
**Solução:**
```bash
# Ver logs da função
export SUPABASE_ACCESS_TOKEN=seu_token
npx supabase functions logs chat-ai
```

---

## 📚 Recursos

- [Documentação Supabase](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ✅ Checklist Final

- [ ] Tabelas criadas no Supabase (SQL executado)
- [ ] `ANTHROPIC_API_KEY` configurada no Vault
- [ ] Autenticação Email habilitada
- [ ] Servidor dev rodando (http://localhost:5174/)
- [ ] Edge Function deployada
- [ ] Conta de teste criada
- [ ] Primeiro post criado
- [ ] Chat testado

---

**🎉 Pronto! Seu ClubNath está funcionando!**

Qualquer dúvida, consulte este guia ou os arquivos de documentação criados.
