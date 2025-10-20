# 🔧 Solução para Erros 403, 401, 400, 429

## 🔴 Erros Identificados:

1. **403** - URL localhost não autorizada
2. **401** - Problema ao acessar tabela profiles
3. **400** - Falha na autenticação
4. **429** - Muitas tentativas (limite atingido)

---

## ✅ SOLUÇÃO COMPLETA

### **Etapa 1: Configurar URLs Permitidas no Supabase** ⚠️ OBRIGATÓRIO

👉 **Acesse:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

**Adicione estas URLs:**

**Site URL:**
```
http://localhost:5174
```

**Redirect URLs (adicione TODAS):**
```
http://localhost:5174
http://localhost:5174/**
http://localhost:5173
http://localhost:5173/**
```

**Clique em "Save"** ✅

---

### **Etapa 2: Configurar Email Provider**

👉 **Acesse:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/providers

1. Clique em **"Email"**
2. Verifique se está **ENABLED** (ativado)
3. **IMPORTANTE:** Desabilite **"Confirm email"** durante desenvolvimento
   - Isso permite criar contas sem confirmação por email
4. **Clique em "Save"** ✅

---

### **Etapa 3: Verificar Tabela profiles**

👉 **Acesse:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/editor

**Verificar se a tabela `profiles` existe:**

Se **NÃO existir**, crie com este SQL:

```sql
-- Criar tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler perfis
CREATE POLICY "Perfis são visíveis para todos"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Política: Usuários podem inserir seu próprio perfil
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

**Como executar:**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new
2. Cole o SQL acima
3. Clique em **"Run"**

---

### **Etapa 4: Aguardar Limite de Rate (Erro 429)**

O erro **429 (Too Many Requests)** significa que você atingiu o limite de tentativas.

**Soluções:**

**Opção A: Aguardar**
- Aguarde **1 hora** antes de tentar novamente
- O limite será resetado automaticamente

**Opção B: Usar email diferente**
- Tente com outro email: `teste2@example.com`

**Opção C: Limpar tentativas no Supabase**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/users
2. Delete usuários de teste criados
3. Aguarde alguns minutos

---

### **Etapa 5: Reiniciar Servidor Local**

Após fazer TODAS as configurações acima:

```bash
# Parar o servidor (Ctrl+C)
# Depois iniciar novamente:
npm run dev
```

---

### **Etapa 6: Limpar Cache do Navegador**

1. Abra o DevTools (F12)
2. Clique com botão direito no ícone de **Reload**
3. Selecione **"Empty Cache and Hard Reload"**

Ou:

- Chrome: `Ctrl + Shift + Delete` → Limpar cache
- Edge: `Ctrl + Shift + Delete` → Limpar cache

---

### **Etapa 7: Testar Novamente**

**Aguarde pelo menos 30 minutos** após configurar tudo para evitar o erro 429.

Depois tente criar uma conta com:
- Email: `teste123@example.com` (use um NOVO email)
- Senha: `Senha123!`
- Nome: `Teste Usuario`

---

## 📋 Checklist de Verificação

Antes de testar, verifique se fez TUDO:

- [ ] URLs localhost adicionadas no Supabase Auth Config
- [ ] Email Provider habilitado
- [ ] "Confirm email" desabilitado (para dev)
- [ ] Tabela `profiles` existe e tem RLS configurado
- [ ] Aguardou 30-60 minutos (erro 429)
- [ ] Servidor local reiniciado
- [ ] Cache do navegador limpo
- [ ] Usando um email NOVO que não foi testado antes

---

## 🐛 Se Ainda Não Funcionar

### Verificar Logs do Supabase:

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/logs/auth-logs
2. Veja os erros de autenticação
3. Copie a mensagem de erro específica

### Verificar Console do Navegador:

1. Abra DevTools (F12)
2. Aba **Console**
3. Veja se há erros em vermelho
4. Copie a mensagem completa

---

## ⚡ Alternativa: Apenas Fazer Deploy no Netlify

Se você quer apenas fazer o deploy em produção (e não rodar localmente):

1. **Pule todas as configurações de localhost**
2. **Vá direto para o deploy no Netlify**
3. **Configure apenas URLs do Netlify no Supabase**

Siga o guia: **`CONFIGURAR_NETLIFY.md`**

---

## 🎯 Resumo

**Causa dos erros:**
- Supabase bloqueando localhost (403)
- Tabela profiles não existe ou RLS mal configurado (401)
- Email Provider não configurado (400)
- Muitas tentativas de signup (429)

**Solução:**
1. Configurar URLs no Supabase
2. Habilitar Email Provider
3. Criar tabela profiles com RLS
4. Aguardar 1 hora ou usar novo email
5. Reiniciar servidor e limpar cache

**Tempo estimado:** 10 minutos + 1 hora de espera

---

**Última atualização:** 20/10/2025
