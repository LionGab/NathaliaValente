# 🔑 Guia de Configuração de APIs

**Atualizado:** 27 de Outubro de 2025

---

## 📋 Status das APIs

### ✅ Configuradas
- [x] **Supabase URL** - Banco de dados e auth
- [x] **Supabase ANON KEY** - Cliente frontend

### ❌ Faltando (Críticas)
- [ ] **Anthropic API Key** - 🚨 Chat NathIA não funciona sem isso
- [ ] **Instagram Client ID** - Login Instagram não funciona

### ⏳ Opcionais (Recomendadas)
- [ ] **Sentry DSN** - Error tracking em produção
- [ ] **Stripe** - Pagamentos e assinaturas premium
- [ ] **Google Maps** - Features de localização

---

## 🚨 CRÍTICO: Anthropic API (Chat NathIA)

### O que é?
A API da Anthropic (Claude) que alimenta o chat inteligente **NathIA** - a assistente virtual do app.

### Onde está sendo usada?
```typescript
// src/services/chat-history.service.ts:482
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
```

### Como obter a chave?

1. **Criar conta Anthropic:**
   - Acesse: https://console.anthropic.com
   - Faça signup/login

2. **Criar API Key:**
   - Vá em: Settings → API Keys
   - Clique em "Create Key"
   - Copie a chave (começa com `sk-ant-api03-...`)

3. **Configurar no .env:**
   ```bash
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-sua-chave-aqui
   ```

4. **Testar:**
   ```bash
   npm run dev
   # Ir para página de chat
   # Conversar com NathIA
   ```

### ⚠️ Sem esta chave:
- ❌ Chat NathIA não funciona
- ❌ Detecção emocional desabilitada
- ❌ Sugestões personalizadas não funcionam

---

## 📱 Instagram Client ID (Login Social)

### O que é?
Credenciais OAuth do Instagram para permitir login social.

### Como obter?

1. **Criar App Facebook:**
   - Acesse: https://developers.facebook.com/apps
   - Clique "Create App"
   - Escolha "Consumer"

2. **Configurar Instagram Basic Display:**
   - No dashboard do app
   - Products → Add Product → Instagram Basic Display
   - Configure OAuth Redirect URLs:
     ```
     http://localhost:5173/auth/callback
     https://clubnath.netlify.app/auth/callback
     ```

3. **Copiar Client ID:**
   - Basic Display Settings
   - Instagram App ID = seu Client ID

4. **Configurar no .env:**
   ```bash
   VITE_INSTAGRAM_CLIENT_ID=seu-client-id-aqui
   ```

### ⚠️ Sem este ID:
- ❌ Login com Instagram não funciona
- ⚠️ Usuários precisam criar conta manual

---

## 🔍 Sentry DSN (Error Tracking)

### O que é?
Monitoramento de erros em tempo real.

### Como obter?

1. **Criar conta Sentry:**
   - Acesse: https://sentry.io
   - Faça signup

2. **Criar projeto:**
   - Platform: React
   - Nome: ClubNath VIP

3. **Copiar DSN:**
   - Project Settings → Client Keys (DSN)
   - Copie a URL (https://...@sentry.io/...)

4. **Configurar no .env:**
   ```bash
   VITE_SENTRY_DSN=https://sua-chave@sentry.io/projeto-id
   ```

### Benefícios:
- ✅ Tracking de erros em produção
- ✅ Notificações de bugs
- ✅ Stack traces completos
- ✅ Performance monitoring

---

## 💳 Stripe (Pagamentos)

### O que é?
Sistema de pagamentos para assinaturas premium.

### Como obter?

1. **Criar conta Stripe:**
   - Acesse: https://dashboard.stripe.com/register

2. **Ativar modo teste:**
   - Dashboard → Developers → API Keys
   - Use "Test mode" primeiro

3. **Copiar Publishable Key:**
   - Publishable key (começa com `pk_test_...`)

4. **Configurar no .env:**
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua-chave-aqui
   ```

### ⚠️ Importante:
- ✅ Use `pk_test_...` em desenvolvimento
- ✅ Use `pk_live_...` em produção
- ❌ NUNCA use Secret Key no frontend!

---

## 🗺️ Google Maps API (Opcional)

### O que é?
API para features de localização.

### Como obter?

1. **Google Cloud Console:**
   - Acesse: https://console.cloud.google.com

2. **Criar projeto:**
   - New Project → "ClubNath"

3. **Ativar APIs:**
   - APIs & Services → Enable APIs
   - Buscar: Maps JavaScript API
   - Enable

4. **Criar credencial:**
   - Credentials → Create Credentials → API Key
   - Restringir por HTTP referrers:
     - http://localhost:5173/*
     - https://clubnath.netlify.app/*

5. **Configurar no .env:**
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

---

## 📊 Resumo de Custos

### Gratuito (Tier Free)
- ✅ **Supabase**: 500MB database, 2GB storage
- ✅ **Sentry**: 5k errors/month
- ✅ **Stripe**: Sem custo mensal (só taxas por transação)

### Pago (Necessário para produção)
- 💰 **Anthropic**: ~$0.015 por 1k tokens
  - Estimativa: $10-30/mês (uso moderado)
- 💰 **Instagram OAuth**: Grátis
- 💰 **Google Maps**: $200 crédito grátis/mês

### Total Estimado
- **Desenvolvimento:** $0/mês (tudo grátis)
- **Produção (baixo tráfego):** $10-30/mês
- **Produção (médio tráfego):** $50-100/mês

---

## 🔐 Segurança

### ✅ Seguro para Frontend (Público)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- Todas que começam com `VITE_*` e são "public/publishable"

### ❌ NUNCA no Frontend (Backend Only)
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `ANTHROPIC_API_KEY` (backend Edge Functions)
- Qualquer chave "secret" ou "private"

### 📋 Checklist .env
```bash
# Verificar que .env está no .gitignore
grep "^\.env$" .gitignore

# Nunca commitar .env
git status  # .env não deve aparecer

# Validar que tem as chaves necessárias
cat .env | grep VITE_ANTHROPIC_API_KEY
```

---

## 🚀 Próximos Passos

### 1. AGORA (Crítico)
```bash
# Obter Anthropic API Key
# https://console.anthropic.com/settings/keys

# Editar .env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# Testar
npm run dev
# Testar chat NathIA
```

### 2. HOJE (Importante)
- [ ] Configurar Instagram Client ID
- [ ] Testar login social

### 3. ESTA SEMANA
- [ ] Configurar Sentry DSN
- [ ] Testar error tracking
- [ ] Configurar Stripe (se precisar de pagamentos)

---

## 📞 Problemas?

### Chat não funciona?
```bash
# Verificar se chave está configurada
echo $VITE_ANTHROPIC_API_KEY

# Ver erros no console do navegador
# Deve mostrar erro claro se chave estiver faltando
```

### Login Instagram falha?
```bash
# Verificar redirect URLs no Facebook Developers
# Deve incluir: http://localhost:5173/auth/callback
```

### Build falha?
```bash
# Variáveis VITE_* são opcionais
# App deve funcionar sem elas (features desabilitadas)
npm run build  # Deve passar mesmo sem todas as chaves
```

---

**Dúvidas?** Consulte a documentação de cada serviço ou abra uma issue.

🔑 **Prioridade 1:** Anthropic API (Chat)
🔑 **Prioridade 2:** Instagram OAuth (Login)
🔑 **Prioridade 3:** Sentry (Monitoring)
