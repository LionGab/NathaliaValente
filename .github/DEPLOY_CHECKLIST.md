# ✅ Checklist de Deploy - Sistema de Onboarding

Use este checklist para garantir que o deploy do onboarding foi feito corretamente.

---

## 📋 PRÉ-DEPLOY (Desenvolvimento)

- [ ] Build local compila sem erros (`npm run build`)
- [ ] Componentes de onboarding criados em `src/components/onboarding/`
- [ ] Migration criada em `supabase/migrations/20251021_onboarding_system.sql`
- [ ] Prompt do Robô Nath atualizado em `supabase/functions/chat-ai/index.ts`
- [ ] Tipos TypeScript atualizados em `src/lib/supabase.ts`
- [ ] Paleta de cores `nath` adicionada em `tailwind.config.js`

---

## 🗄️ BANCO DE DADOS (Supabase)

- [ ] Login no Supabase CLI (`supabase login`)
- [ ] Projeto linkado (`supabase link --project-ref bbcwitnbnosyfpfjtzkr`)
- [ ] Migration aplicada (`supabase db push`)
- [ ] Verificar colunas criadas:
  ```sql
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'profiles'
  AND column_name IN ('onboarding_completed', 'onboarding_goals', 'avatar_emoji');
  ```
  Deve retornar 3 linhas ✅

---

## 🤖 EDGE FUNCTIONS (Supabase)

- [ ] Deploy da função `chat-ai` (`supabase functions deploy chat-ai`)
- [ ] Verificar deploy (`supabase functions list`)
- [ ] Testar função (curl ou Postman):
  ```bash
  curl -X POST 'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
    -H 'Authorization: Bearer ANON_KEY' \
    -H 'Content-Type: application/json' \
    -d '{"message": "oi"}'
  ```
  Deve responder com tom jovem + emojis 💜 ✅

---

## 🔐 AUTENTICAÇÃO (Supabase Dashboard)

- [ ] Acessar: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration
- [ ] **Site URL** configurada:
  - [ ] `https://clubnath.netlify.app`
- [ ] **Redirect URLs** adicionadas:
  - [ ] `https://clubnath.netlify.app`
  - [ ] `https://clubnath.netlify.app/**`
  - [ ] `http://localhost:5173` (dev)
  - [ ] `http://localhost:5173/**` (dev)
- [ ] Clicou em **Save** ✅

---

## 🌐 NETLIFY (Deploy)

### Variáveis de Ambiente

- [ ] Acessar: https://app.netlify.com/sites/SEU_SITE/settings/deploys#environment
- [ ] Verificar variáveis:
  - [ ] `VITE_SUPABASE_URL` = `https://bbcwitnbnosyfpfjtzkr.supabase.co`
  - [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGc...` (sua key)

### Configurações de Build

- [ ] **Build command:** `npm run build`
- [ ] **Publish directory:** `dist`
- [ ] **Node version:** 18 (opcional, mas recomendado)

### Deploy

- [ ] Git commitado e pushed
- [ ] Merge para `main` (se usar auto-deploy)
- [ ] Deploy completado com sucesso
- [ ] Status: **Published** ✅
- [ ] URL do site acessível

---

## 🧪 TESTES FUNCIONAIS

### Teste 1: Novo Usuário (Onboarding)

- [ ] Acessar site em produção
- [ ] Clicar em **Cadastrar**
- [ ] Criar conta com e-mail novo
- [ ] **Verificar onboarding aparece:**
  - [ ] ✅ Tela 1: Welcome Screen
    - [ ] Mostra "Criado pela Nath, para mães como você 💜"
    - [ ] Botão "Começar minha jornada"
    - [ ] Botão "Pular tour"
  - [ ] ✅ Tela 2: Quick Profile
    - [ ] Permite escolher apelido
    - [ ] Permite escolher emoji de avatar (12 opções)
    - [ ] Indicador de progresso (1/3)
  - [ ] ✅ Tela 3: Goals Selection
    - [ ] 6 objetivos disponíveis
    - [ ] Pode selecionar até 3
    - [ ] Mostra contador (X/3)
    - [ ] Indicador de progresso (2/3)
  - [ ] ✅ Tela 4: Feature Tour
    - [ ] Mostra 4 recursos (Feed, Chat, Versículo, Tesouros)
    - [ ] Destaca recursos relevantes aos objetivos
    - [ ] Citação da Nathália: "Você foi escolhida para isso!"
    - [ ] Indicador de progresso (3/3)
  - [ ] ✅ Após completar, redireciona para Feed

### Teste 2: Usuário Existente (Sem Onboarding)

- [ ] Fazer logout
- [ ] Login com conta antiga (criada antes da migration)
- [ ] **Verificar:**
  - [ ] ✅ Vai direto para Feed
  - [ ] ✅ NÃO mostra onboarding

### Teste 3: Robô Nath (Novo Prompt)

- [ ] Ir para página de Chat
- [ ] Enviar mensagem: "Estou muito cansada"
- [ ] **Verificar resposta:**
  - [ ] ✅ Usa tom jovem/coloquial ("miga", "você arrasa")
  - [ ] ✅ Tem emojis (💜, ✨, 🙏)
  - [ ] ✅ Menciona fé naturalmente
  - [ ] ✅ Valida sentimento antes de solução
  - [ ] ✅ Oferece esperança/encorajamento
- [ ] Enviar: "Consegui tomar banho hoje!"
- [ ] **Verificar resposta celebra vitória:**
  - [ ] ✅ Entusiasmo ("ISSO! 🎉")
  - [ ] ✅ Reconhece pequenas conquistas

### Teste 4: Persistência de Dados

- [ ] Completar onboarding com nova conta
- [ ] Fazer logout
- [ ] Login novamente
- [ ] **Verificar:**
  - [ ] ✅ NÃO mostra onboarding novamente
  - [ ] ✅ Apelido salvo (se visível no perfil)
  - [ ] ✅ Emoji de avatar salvo (se visível)

---

## 📊 VERIFICAÇÕES DE DADOS (SQL)

Execute no SQL Editor do Supabase:

```sql
-- 1. Verificar estrutura das colunas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN (
    'onboarding_completed',
    'onboarding_goals',
    'preferred_nickname',
    'avatar_emoji',
    'onboarding_completed_at'
  );
```
Deve retornar 5 linhas ✅

```sql
-- 2. Verificar usuários que completaram onboarding
SELECT
  id,
  full_name,
  preferred_nickname,
  avatar_emoji,
  onboarding_completed,
  onboarding_goals,
  created_at
FROM profiles
WHERE onboarding_completed = true
ORDER BY created_at DESC
LIMIT 5;
```

```sql
-- 3. Taxa de conclusão de onboarding (novos usuários)
SELECT
  COUNT(*) FILTER (WHERE onboarding_completed = true) AS completed,
  COUNT(*) FILTER (WHERE onboarding_completed = false) AS incomplete,
  ROUND(
    COUNT(*) FILTER (WHERE onboarding_completed = true)::numeric /
    NULLIF(COUNT(*), 0)::numeric * 100,
    2
  ) AS completion_rate
FROM profiles
WHERE created_at > NOW() - INTERVAL '24 hours';
```

---

## 🎨 VERIFICAÇÕES VISUAIS

- [ ] Paleta de cores `nath` aparece nos componentes
- [ ] Gradientes rosa/lavanda/pêssego funcionam
- [ ] Animações suaves (fade-in, slide-up, scale-in)
- [ ] Indicador de progresso (bolinhas) funciona
- [ ] Layout responsivo (mobile e desktop)
- [ ] Dark mode funciona corretamente
- [ ] Sem erros no console do navegador

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Problema: Onboarding não aparece
```sql
-- Verificar campo onboarding_completed
SELECT id, onboarding_completed FROM profiles WHERE id = 'USER_ID_AQUI';

-- Se true, resetar para testar:
UPDATE profiles SET onboarding_completed = false WHERE id = 'USER_ID_AQUI';
```

### Problema: Erro ao salvar
- Verificar RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`
- Verificar logs: Supabase > Logs > Database

### Problema: Build falha
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### Problema: Variáveis não carregam
```bash
# Via Netlify CLI
netlify env:list
netlify env:set VITE_SUPABASE_URL "https://bbcwitnbnosyfpfjtzkr.supabase.co"
netlify deploy --prod
```

---

## ✅ DEPLOY FINALIZADO

Quando todos os itens estiverem marcados:

- [ ] ✅ Migration aplicada
- [ ] ✅ Edge Function deployed
- [ ] ✅ Redirect URLs configuradas
- [ ] ✅ Deploy no Netlify OK
- [ ] ✅ Onboarding funciona para novos usuários
- [ ] ✅ Usuários antigos NÃO veem onboarding
- [ ] ✅ Robô Nath com novo tom
- [ ] ✅ Dados salvos corretamente
- [ ] ✅ Sem erros no console
- [ ] ✅ Testes funcionais passando

---

## 📈 MONITORAMENTO PÓS-DEPLOY

Primeiras 24h:
- [ ] Verificar taxa de conclusão de onboarding
- [ ] Verificar objetivos mais escolhidos
- [ ] Verificar emojis mais usados
- [ ] Monitorar erros no Sentry (se configurado)
- [ ] Coletar feedback das primeiras usuárias

Primeira semana:
- [ ] A/B test de mensagens (opcional)
- [ ] Ajustar passos se taxa de conclusão < 80%
- [ ] Documentar insights de uso

---

## 📞 RECURSOS

- **Documentação completa:** `DEPLOY_ONBOARDING.md`
- **Deploy rápido:** `DEPLOY_RAPIDO_ONBOARDING.md`
- **Script automatizado:** `scripts/apply-onboarding-migration.sh`
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
- **Netlify Dashboard:** https://app.netlify.com/sites/SEU_SITE
- **Criar issue:** https://github.com/LionGab/boltnathH/issues

---

**Data do deploy:** ___/___/_____
**Responsável:** _______________
**Status:** ☐ Em progresso  ☐ Completo  ☐ Com problemas

---

**Versão:** 1.0.0 - Sistema de Onboarding NathClub
**Última atualização:** 2025-10-21
