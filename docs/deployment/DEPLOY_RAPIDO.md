# 🚀 DEPLOY RÁPIDO - 2 MINUTOS

## Opção Mais Rápida: Drag and Drop

### 1️⃣ Acesse:
```
https://app.netlify.com/drop
```

### 2️⃣ Arraste a pasta:
Arraste TODA a pasta `dist` (não os arquivos dentro dela)

**Localização:** `C:\Users\User\BoltValente\boltnathH\dist`

### 3️⃣ Configure variáveis (depois do deploy):

**Site settings** → **Environment variables** → **Add a variable**

Adicione estas 2 variáveis:

**Variável 1:**
```
Name: VITE_SUPABASE_URL
Value: https://bbcwitnbnosyfpfjtzkr.supabase.co
```

**Variável 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
```

### 4️⃣ Redeploy:
**Deploys** → **Trigger deploy** → **Deploy site**

### 5️⃣ Configure Supabase:
Após ter a URL do Netlify (ex: `https://clubnath.netlify.app`):

Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

**Site URL:**
```
https://sua-url.netlify.app
```

**Redirect URLs:**
```
http://localhost:5173
http://localhost:5173/**
https://sua-url.netlify.app
https://sua-url.netlify.app/**
```

---

## ✅ Pronto!

Seu ClubNath está no ar com:
- ✅ Feed social
- ✅ Chat com IA
- ✅ Frases diárias
- ✅ Sistema de autenticação
- ✅ Dark mode
- ✅ Design responsivo

---

## 📱 Testar:

1. Acesse seu site
2. Cadastre-se
3. Confirme o e-mail
4. Faça login
5. Explore as funcionalidades!

---

**Guia completo:** `docs/DEPLOY_NETLIFY.md`
