# 🚀 Configuração para Deploy no Netlify

## 📋 Pré-requisitos

Antes de fazer o deploy, configure o Supabase para aceitar requisições do Netlify.

---

## 1️⃣ Configurar URLs do Netlify no Supabase

### **Passo 1: Adicionar URLs Permitidas**

👉 **Acesse:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

**Configure os seguintes campos:**

**Site URL:**
```
https://clubnath.netlify.app
```
(Ou use o nome que o Netlify gerar automaticamente: `https://[seu-site].netlify.app`)

**Redirect URLs (adicione cada uma):**
```
https://clubnath.netlify.app
https://clubnath.netlify.app/**
https://*.netlify.app
https://*.netlify.app/**
```

> ⚠️ **Importante:** Use `https://` (não `http://`) para URLs de produção!

**Clique em "Save"**

---

### **Passo 2: Verificar Email Provider**

👉 **Acesse:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/providers

- Verifique se **"Email"** está **ENABLED**
- Configure:
  - ✅ **Enable Email provider**
  - ✅ **Confirm email** (recomendado para produção)
  - ✅ **Secure email change**

**Clique em "Save"**

---

## 2️⃣ Deploy no Netlify

### **Passo 1: Acessar Netlify**

1. Acesse: https://app.netlify.com/start
2. Faça login com GitHub
3. Clique em **"Import from Git"**
4. Selecione **GitHub**
5. Procure por: `LionGab/boltnathH`

### **Passo 2: Configurar Build**

**Build settings** (já configurado no `netlify.toml`):
```
Build command: npm run build
Publish directory: dist
```

### **Passo 3: Adicionar Variáveis de Ambiente**

Em **"Environment variables"**, adicione:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://bbcwitnbnosyfpfjtzkr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo` |

### **Passo 4: Deploy!**

1. Clique em **"Deploy site"**
2. Aguarde 2-3 minutos
3. Seu app estará em: `https://[site-name].netlify.app`

---

## 3️⃣ Atualizar URLs com Nome Real do Netlify

Após o primeiro deploy, o Netlify vai gerar uma URL (ex: `https://cheerful-unicorn-123456.netlify.app`).

### **Volte ao Supabase e atualize:**

👉 https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

**Site URL:**
```
https://[seu-site-gerado].netlify.app
```

**Redirect URLs:**
```
https://[seu-site-gerado].netlify.app
https://[seu-site-gerado].netlify.app/**
```

**Clique em "Save"**

---

## 4️⃣ Customizar Nome do Site (Opcional)

No Netlify, você pode customizar o nome:

1. Acesse: **Site settings → Domain management → Options → Change site name**
2. Escolha um nome (ex: `clubnath`)
3. Seu site ficará: `https://clubnath.netlify.app`

**Lembre-se de atualizar as URLs no Supabase após mudar o nome!**

---

## ✅ Checklist de Deploy

### Antes do Deploy:
- [x] Código no GitHub: https://github.com/LionGab/boltnathH
- [x] `netlify.toml` configurado
- [x] `.env.example` criado
- [x] Build testada localmente

### Durante o Deploy:
- [ ] Importar projeto do GitHub no Netlify
- [ ] Adicionar variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
- [ ] Iniciar deploy

### Após o Deploy:
- [ ] Obter URL gerada pelo Netlify
- [ ] Adicionar URL no Supabase Auth Configuration
- [ ] Testar login/cadastro no app deployado
- [ ] Verificar todas as funcionalidades

---

## 🧪 Testar App Deployado

Após o deploy, acesse sua URL do Netlify e teste:

1. ✅ Página carrega sem erros
2. ✅ Criar conta funciona
3. ✅ Login funciona
4. ✅ Feed carrega
5. ✅ Chat com Robô Nath responde
6. ✅ Dark mode funciona
7. ✅ Navegação entre páginas funciona

---

## 🐛 Problemas Comuns

### Erro 403 ao fazer login/cadastro:
- **Causa:** URL do Netlify não está nas configurações do Supabase
- **Solução:** Adicione a URL do Netlify nas Redirect URLs do Supabase

### Build falha no Netlify:
- **Causa:** Variáveis de ambiente não configuradas
- **Solução:** Verifique se adicionou `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### Página em branco após deploy:
- **Causa:** Redirects não configurados
- **Solução:** O `netlify.toml` já tem isso configurado. Force um novo deploy.

---

## 📞 Links Úteis

- **Netlify Dashboard:** https://app.netlify.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
- **Supabase Auth Config:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration
- **GitHub Repo:** https://github.com/LionGab/boltnathH

---

## 🎯 Resumo

1. **Configure URLs no Supabase** (permite requisições do Netlify)
2. **Importe projeto no Netlify** (do GitHub)
3. **Adicione variáveis de ambiente** (credenciais do Supabase)
4. **Deploy!** (aguarde 2-3 minutos)
5. **Atualize URLs no Supabase** com a URL real gerada pelo Netlify
6. **Teste o app** na URL de produção

**Tempo total: ~5-10 minutos** ⚡

---

**Última atualização:** 20/10/2025
