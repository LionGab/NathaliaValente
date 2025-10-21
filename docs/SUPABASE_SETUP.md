# 🔐 Configuração Completa do Supabase para ClubNath

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Passo a Passo](#passo-a-passo)
3. [Verificação](#verificação)
4. [Configurações de E-mail](#configurações-de-e-mail)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este guia configura o sistema de autenticação automatizado do ClubNath, onde:
- ✅ Perfis são criados **automaticamente** após confirmação de e-mail
- ✅ Row Level Security (RLS) protege todos os dados
- ✅ Triggers mantêm timestamps atualizados
- ✅ Políticas garantem privacidade e segurança

---

## 📝 Passo a Passo

### 1️⃣ Acessar o SQL Editor

1. Acesse o [Painel do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto: **ClubNath** (ID: `bbcwitnbnosyfpfjtzkr`)
3. No menu lateral, clique em **SQL Editor**
4. Clique em **+ New query**

### 2️⃣ Executar Script de Configuração

1. Abra o arquivo: `supabase/migrations/setup_auth_trigger.sql`
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **RUN** (ou pressione `Ctrl+Enter`)

### 3️⃣ Verificar Execução

Você deve ver a mensagem: **"Success. No rows returned"**

Se houver erros, verifique:
- ✅ O projeto Supabase está ativo
- ✅ Você tem permissões de administrador
- ✅ O script foi copiado completamente

---

## ✅ Verificação

Execute estas queries no SQL Editor para confirmar que tudo está funcionando:

### Verificar Função
```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';
```
**Resultado esperado:** 1 linha retornada

### Verificar Trigger
```sql
SELECT tgname, tgtype 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```
**Resultado esperado:** 1 linha retornada

### Verificar Policies
```sql
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';
```
**Resultado esperado:** 3 linhas (SELECT, INSERT, UPDATE)

### Verificar Tabela Profiles
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```
**Resultado esperado:** 6 colunas (id, full_name, avatar_url, bio, created_at, updated_at)

---

## 📧 Configurações de E-mail

### 1️⃣ Template de Confirmação

1. Vá para: **Authentication** → **Email Templates**
2. Selecione: **Confirm signup**
3. Cole este template:

```html
<h2>Bem-vinda ao ClubNath! 💜</h2>

<p>Olá <strong>{{ .Name }}</strong>,</p>

<p>Obrigada por se cadastrar no ClubNath! Para confirmar seu e-mail e acessar sua conta, clique no botão abaixo:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #F97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    Confirmar meu e-mail
  </a>
</p>

<p>Ou copie e cole este link no seu navegador:</p>
<p style="font-size: 12px; color: #666; word-break: break-all;">{{ .ConfirmationURL }}</p>

<hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

<p style="font-size: 12px; color: #999;">
  Se você não criou esta conta, pode ignorar este e-mail com segurança.
</p>

<p>Com carinho,<br>
<strong>Equipe ClubNath</strong> 💜</p>
```

4. Clique em **Save**

### 2️⃣ Configurações de Autenticação

1. Vá para: **Authentication** → **Settings**
2. Configure:

#### Email Auth
- ✅ **Enable email confirmations** (recomendado para produção)
- ⚠️ Para testes locais, pode desabilitar temporariamente

#### Site URL
```
https://clubnath.netlify.app
```
(ou sua URL de produção)

#### Redirect URLs
Adicione estas URLs:
```
http://localhost:5173
http://localhost:5173/**
https://clubnath.netlify.app
https://clubnath.netlify.app/**
```

#### Email Rate Limits
- **Max emails per hour:** 4 (padrão gratuito)
- Para produção, considere aumentar ou usar provedor externo

### 3️⃣ Templates Adicionais (Opcional)

Configure também:
- **Magic Link** (se usar login sem senha)
- **Change Email Address**
- **Reset Password**

---

## 🔧 Troubleshooting

### Problema: Perfil não é criado após confirmação

**Causa:** Trigger não está funcionando ou metadados ausentes

**Solução:**
```sql
-- Verificar se o trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Se não existir, execute novamente o script setup_auth_trigger.sql
```

### Problema: Erro "permission denied for table profiles"

**Causa:** RLS está muito restritivo

**Solução:**
```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Se necessário, recriar policies (está no script setup_auth_trigger.sql)
```

### Problema: E-mail de confirmação não chega

**Soluções:**
1. Verifique a pasta de spam
2. Confirme que "Enable email confirmations" está ativado
3. Verifique os logs em: **Authentication** → **Logs**
4. Para testes, desabilite confirmação temporariamente

### Problema: Usuário não consegue fazer login após confirmação

**Causa:** Perfil não foi criado

**Solução temporária:**
```sql
-- Criar perfil manualmente (substitua os valores)
INSERT INTO public.profiles (id, full_name)
VALUES (
  'UUID_DO_USUARIO',
  'Nome do Usuário'
);
```

**Solução permanente:**
Execute novamente o script `setup_auth_trigger.sql` completo.

---

## 🎯 Próximos Passos

Após configurar o Supabase:

1. ✅ Teste o cadastro de um novo usuário
2. ✅ Confirme o e-mail
3. ✅ Faça login
4. ✅ Verifique se o perfil foi criado automaticamente

Para testar:
```sql
-- Listar todos os perfis
SELECT * FROM public.profiles;

-- Verificar último perfil criado
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 1;
```

---

## 📚 Recursos Adicionais

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## ✨ Resumo

Após seguir este guia, seu ClubNath terá:

- ✅ Sistema de cadastro automático
- ✅ Confirmação de e-mail profissional
- ✅ Segurança com RLS
- ✅ Triggers automatizados
- ✅ Performance otimizada

**Tudo pronto para produção!** 🚀
