# 🎯 EXECUTAR NO SUPABASE - SCRIPT RÁPIDO

## 📋 O que fazer:

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new
2. Copie e cole TODO o código abaixo
3. Clique em RUN

---

```sql
-- ============================================================
-- CLUBNATH - CONFIGURAÇÃO AUTOMÁTICA DE AUTENTICAÇÃO
-- ============================================================

-- 1. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuário')
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- 2. Trigger para disparar a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Garantir tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT 'Usuário',
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. RLS e Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 5. Índices
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 6. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- 7. Trigger para updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ✅ PRONTO! Agora configure no Dashboard:
-- 1. Authentication > Email Templates > Confirm signup
-- 2. Authentication > Settings > Site URL e Redirect URLs
-- ============================================================
```

---

## ✅ Verificação

Após executar, rode isso para verificar:

```sql
-- Verificar função
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- Verificar trigger
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Verificar policies
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
```

**Resultado esperado:** 1 função, 1 trigger, 3 policies

---

## 📧 Configurar E-mail (Dashboard)

### 1. Template de Confirmação
**Caminho:** Authentication → Email Templates → Confirm signup

```html
<h2>Bem-vinda ao ClubNath! 💜</h2>
<p>Olá <strong>{{ .Name }}</strong>,</p>
<p>Para confirmar seu e-mail, clique no botão:</p>
<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
    Confirmar meu e-mail
  </a>
</p>
<p style="font-size: 12px; color: #666;">Ou copie: {{ .ConfirmationURL }}</p>
<p>Com carinho,<br><strong>Equipe ClubNath</strong> 💜</p>
```

### 2. URLs
**Caminho:** Authentication → Settings

**Site URL:**
```
https://clubnath.netlify.app
```

**Redirect URLs:**
```
http://localhost:5173
http://localhost:5173/**
https://clubnath.netlify.app
https://clubnath.netlify.app/**
```

---

## 🎉 Tudo Pronto!

Agora você pode:
- ✅ Criar conta no ClubNath
- ✅ Receber e-mail de confirmação
- ✅ Perfil criado automaticamente
- ✅ Login funcional

**Para testar:**
1. Acesse o ClubNath
2. Cadastre-se com um e-mail válido
3. Confirme o e-mail
4. Faça login

**Para verificar perfil criado:**
```sql
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;
```
