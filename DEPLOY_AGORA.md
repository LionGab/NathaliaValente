# 🚀 Deploy Imediato - clubnath.netlify.app

## ✅ O QUE JÁ ESTÁ PRONTO

- ✅ Código do onboarding implementado
- ✅ Migration SQL criada
- ✅ Edge Function (Robô Nath) atualizada
- ✅ Build compila sem erros
- ✅ Documentação completa

---

## 🎯 AÇÕES NECESSÁRIAS (15 minutos)

### PASSO 1: Aplicar Migration no Supabase (5 min)

1. **Acesse o SQL Editor:**
   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/sql/new

2. **Copie TODO o conteúdo deste arquivo:**
   ```
   supabase/migrations/20251021_onboarding_system.sql
   ```

3. **Cole no SQL Editor** e clique em **Run** (canto inferior direito)

4. **Aguarde confirmação:** ✅ Success (pode levar 10-15 segundos)

5. **Verificar se funcionou** - Execute esta query:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'profiles'
     AND column_name IN ('onboarding_completed', 'onboarding_goals', 'avatar_emoji');
   ```

   **Deve retornar 3 linhas:**
   ```
   onboarding_completed | boolean
   onboarding_goals     | jsonb
   avatar_emoji         | text
   ```

---

### PASSO 2: Deploy da Edge Function (3 min)

1. **Acesse Edge Functions:**
   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/functions

2. **Encontre a função:** `chat-ai`

3. **Clique em "Deploy"** ou **"Update"**

4. **Cole o código atualizado de:**
   ```
   supabase/functions/chat-ai/index.ts
   ```

5. **Clique em "Deploy"** e aguarde

6. **Verificar:** Status deve mostrar "Deployed" em verde ✅

---

### PASSO 3: Configurar Redirect URLs (2 min)

1. **Acesse URL Configuration:**
   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

2. **Site URL** - Configure para:
   ```
   https://clubnath.netlify.app
   ```

3. **Redirect URLs** - Adicione (clique em "+ Add URL" para cada):
   ```
   https://clubnath.netlify.app
   https://clubnath.netlify.app/**
   http://localhost:5173
   http://localhost:5173/**
   ```

4. **Clique em "Save"** ✅

---

### PASSO 4: Deploy no Netlify (Auto - 3 min)

O código já está no branch. Vou fazer merge para `main` e o Netlify vai fazer deploy automático.

**Status do deploy:**
https://app.netlify.com/sites/clubnath/deploys

**Aguarde até ver:** ✅ Published

---

### PASSO 5: Testar (2 min)

1. **Abra:** https://clubnath.netlify.app

2. **Cadastre nova conta** com e-mail de teste

3. **Deve aparecer onboarding:**
   - Tela 1: Welcome "Criado pela Nath, para mães como você 💜"
   - Tela 2: Escolha apelido + emoji
   - Tela 3: Selecione objetivos (até 3)
   - Tela 4: Tour dos recursos
   - Após completar: Feed

4. **Teste Robô Nath:**
   - Ir em Chat
   - Enviar: "oi"
   - Deve responder com tom jovem + emojis 💜✨

---

## 📋 RESUMO - CHECKLIST RÁPIDO

Após seguir os passos acima:

- [ ] Migration aplicada no Supabase (query de verificação retorna 3 linhas)
- [ ] Edge Function `chat-ai` deployed (status verde)
- [ ] Redirect URLs configuradas (4 URLs adicionadas)
- [ ] Deploy no Netlify concluído (status Published)
- [ ] Teste: Nova conta mostra onboarding ✅
- [ ] Teste: Robô Nath responde com novo tom ✅

---

## 🎉 PRONTO!

Quando todos os itens estiverem marcados, o sistema de onboarding estará funcionando em:

**https://clubnath.netlify.app** 🚀

---

## 🆘 PROBLEMAS?

### Migration falha
- Verifique se copiou TODO o arquivo SQL
- Verifique se não há queries em execução (aguarde terminar)

### Edge Function não atualiza
- Aguarde 1-2 minutos para propagação
- Teste novamente: https://clubnath.netlify.app (chat)

### Onboarding não aparece
- Limpe cache do navegador (Ctrl+Shift+Delete)
- Crie conta com e-mail NOVO (não usado antes)
- Verifique que migration foi aplicada (query de verificação)

### Deploy não completa no Netlify
- Verifique logs: https://app.netlify.com/sites/clubnath/deploys
- Se falhar, re-trigger: Clique "Trigger deploy" > "Deploy site"

---

**Documentação completa:** `DEPLOY_ONBOARDING.md`
**Checklist detalhado:** `.github/DEPLOY_CHECKLIST.md`
