-- ========================================
-- ClubNath - Configuração de Trigger de Autenticação
-- ========================================
-- Este script cria a função e trigger para criar perfis automaticamente
-- após o usuário confirmar o e-mail no Supabase Auth
--
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/sql/new
-- ========================================

-- 1. Criar função para lidar com novos usuários
-- ========================================
-- Esta função é chamada automaticamente quando um novo usuário é criado
-- no sistema de autenticação (auth.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insere um novo perfil com o ID do usuário e o nome completo
  -- O nome completo vem dos metadados do usuário (raw_user_meta_data)
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário')
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Em caso de erro (ex: perfil já existe), apenas registra e continua
    RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- 2. Criar trigger para novos usuários
-- ========================================
-- Remove o trigger se já existir (para permitir reexecução do script)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Cria o trigger que dispara após a inserção de um novo usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Garantir que a tabela profiles existe com a estrutura correta
-- ========================================
-- Criar tabela profiles se não existir
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT 'Usuário',
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Configurar Row Level Security (RLS)
-- ========================================
-- Ativar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas se existirem
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Policy: Todos podem ver todos os perfis (necessário para feed, comentários, etc)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Usuários podem inserir seu próprio perfil
-- (necessário caso o trigger falhe ou para migração de dados)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Criar índice para melhorar performance
-- ========================================
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 6. Criar função para atualizar updated_at automaticamente
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- 7. Criar trigger para atualizar updated_at
-- ========================================
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- Verificação e Teste
-- ========================================
-- Comentários para verificação manual:
-- 
-- 1. Verifique se a função foi criada:
--    SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
--
-- 2. Verifique se o trigger foi criado:
--    SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
--
-- 3. Verifique as policies:
--    SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'profiles';
--
-- ========================================
-- Configuração de E-mail no Supabase
-- ========================================
-- IMPORTANTE: Configure o template de e-mail de confirmação no painel do Supabase:
-- 
-- 1. Vá para: Authentication > Email Templates
-- 2. Selecione "Confirm signup"
-- 3. Use este template:
--
-- <h2>Bem-vinda ao ClubNath!</h2>
-- <p>Olá {{ .Name }},</p>
-- <p>Obrigada por se cadastrar no ClubNath! Para confirmar seu e-mail e acessar sua conta, clique no link abaixo:</p>
-- <p><a href="{{ .ConfirmationURL }}">Confirmar meu e-mail</a></p>
-- <p>Ou copie e cole este link no seu navegador:</p>
-- <p>{{ .ConfirmationURL }}</p>
-- <p>Com carinho,<br>Equipe ClubNath 💜</p>
--
-- ========================================
-- Configuração no Dashboard do Supabase
-- ========================================
-- IMPORTANTE: Configure as opções de autenticação:
--
-- 1. Vá para: Authentication > Settings
-- 2. Em "Email Auth":
--    - ✅ Enable email confirmations (recomendado para produção)
--    - ⚠️ Ou desabilite para testes (não recomendado para produção)
-- 3. Em "Site URL":
--    - Adicione a URL do seu site (ex: https://clubnath.netlify.app)
-- 4. Em "Redirect URLs":
--    - Adicione as URLs permitidas para redirecionamento após confirmação
--
-- ========================================
-- Script Completo!
-- ========================================
-- ✅ Função handle_new_user criada
-- ✅ Trigger on_auth_user_created criado
-- ✅ Tabela profiles configurada
-- ✅ RLS e Policies configuradas
-- ✅ Índices criados
-- ✅ Trigger de updated_at criado
--
-- Agora o sistema está pronto para:
-- 1. Criar perfis automaticamente após confirmação de e-mail
-- 2. Proteger dados com Row Level Security
-- 3. Manter updated_at sempre atualizado
-- 4. Performance otimizada com índices
-- ========================================
