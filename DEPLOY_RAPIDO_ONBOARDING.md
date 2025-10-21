# 🚀 Deploy Rápido - Onboarding NathClub

Guia ultra-rápido para fazer deploy do sistema de onboarding.

---

## ⚡ DEPLOY EM 5 MINUTOS

### 1️⃣ Aplicar Migration + Deploy Edge Function

**Linux/Mac:**
```bash
chmod +x scripts/apply-onboarding-migration.sh
./scripts/apply-onboarding-migration.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\apply-onboarding-migration.ps1
```

**OU manualmente:**

```bash
# 1. Login no Supabase
supabase login

# 2. Link projeto
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# 3. Aplicar migration
supabase db push

# 4. Deploy função
supabase functions deploy chat-ai
```

---

### 2️⃣ Configurar Redirect URLs

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

2. Adicione nas **Redirect URLs:**
   ```
   https://SEU_SITE.netlify.app
   https://SEU_SITE.netlify.app/**
   ```

3. Clique **Save**

---

### 3️⃣ Deploy no Netlify

**Opção A: Auto-deploy via Git (Recomendado)**

```bash
# Merge para main
git checkout main
git merge claude/nathclub-product-strategy-011CUKui93ADErLbA5MyavPn
git push origin main

# Netlify faz deploy automático
```

Acompanhe em: https://app.netlify.com/sites/SEU_SITE/deploys

**Opção B: Manual**

```bash
npm run build
netlify deploy --prod
```

---

### 4️⃣ Testar

1. Acesse seu site: `https://SEU_SITE.netlify.app`
2. Cadastre nova conta
3. **Deve aparecer:**
   - ✅ Tela 1: Welcome "Criado pela Nath"
   - ✅ Tela 2: Escolha de apelido + emoji
   - ✅ Tela 3: Objetivos (selecionar até 3)
   - ✅ Tela 4: Tour dos recursos
   - ✅ Feed após completar

4. Testar Robô Nath:
   - Ir em Chat
   - Enviar: "Estou cansada"
   - **Deve responder com:**
     - Tom jovem ("miga", "você arrasa")
     - Emojis 💜✨🙏
     - Fé natural

---

## ✅ CHECKLIST MÍNIMO

- [ ] Migration aplicada (`supabase db push`)
- [ ] Função deployed (`supabase functions deploy chat-ai`)
- [ ] Redirect URLs configuradas no Supabase
- [ ] Deploy no Netlify publicado
- [ ] Testado com nova conta (onboarding aparece)

---

## 🐛 PROBLEMAS COMUNS

### Onboarding não aparece
```bash
# Verificar migration
supabase db query "SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'onboarding_completed';"

# Deve retornar: onboarding_completed | boolean
```

### Robô Nath com tom antigo
```bash
# Re-deploy da função
supabase functions deploy chat-ai

# Testar:
curl -X POST 'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
  -H 'Authorization: Bearer SUA_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"message": "oi"}'
```

### Build falha no Netlify
```bash
# Build local primeiro
npm install
npm run build

# Se funcionar local, verificar env vars no Netlify:
VITE_SUPABASE_URL = https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
```

---

## 📚 Documentação Completa

Para guia detalhado: **DEPLOY_ONBOARDING.md**

---

**Tempo total estimado:** 5-10 minutos
**Última atualização:** 2025-10-21
