# 🚀 Guia de Deploy - Sistema de Onboarding NathClub

Este guia detalha como fazer o deploy completo do novo sistema de onboarding no Netlify e Supabase.

---

## ⚠️ PRÉ-REQUISITOS

Antes de começar, certifique-se de ter:

- [ ] Supabase CLI instalado (`npm install -g supabase`)
- [ ] Conta Netlify configurada
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Acesso ao projeto Supabase (ID: `bbcwitnbnosyfpfjtzkr`)

---

## 📋 CHECKLIST COMPLETO DE DEPLOY

### ✅ PASSO 1: Aplicar Migration no Banco de Dados

**Opção A: Via Supabase CLI (Recomendado)**

```bash
# 1. Login no Supabase (se ainda não estiver logado)
supabase login

# 2. Link com o projeto
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# 3. Aplicar a migration
supabase db push
```

**Opção B: Via Supabase Dashboard (Manual)**

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **+ New Query**
4. Copie TODO o conteúdo do arquivo:
   ```
   supabase/migrations/20251021_onboarding_system.sql
   ```
5. Cole no editor SQL
6. Clique em **Run** (canto inferior direito)
7. Aguarde confirmação: ✅ Success

**Verificar se funcionou:**

```sql
-- Execute no SQL Editor:
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('onboarding_completed', 'onboarding_goals', 'avatar_emoji');
```

Deve retornar 3 linhas mostrando as novas colunas.

---

### ✅ PASSO 2: Deploy da Edge Function Atualizada (Robô Nath)

O prompt do Robô Nath foi atualizado com a personalidade da Nathália Valente.

**Via Supabase CLI:**

```bash
# 1. Certifique-se de estar no diretório do projeto
cd /caminho/para/boltnathH

# 2. Deploy da função chat-ai
supabase functions deploy chat-ai

# 3. Verificar se o deploy funcionou
supabase functions list
```

**Esperado:**
```
Functions
  - chat-ai (status: deployed)
  - notifications (status: deployed)
```

**Testar a função:**

```bash
# Teste via curl (substitua SEU_ANON_KEY)
curl -X POST 'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
  -H 'Authorization: Bearer SEU_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"message": "Olá Robô Nath!"}'
```

Deve retornar uma resposta com o novo tom ("miga", emojis 💜✨).

---

### ✅ PASSO 3: Build Local (Verificação)

Antes de fazer deploy no Netlify, verifique que tudo compila:

```bash
# 1. Instalar dependências (se necessário)
npm install

# 2. Build de produção
npm run build

# 3. Verificar que não há erros
# Deve mostrar: ✓ built in X.XXs
```

**Arquivos gerados:**
```
dist/
├── index.html
├── assets/
│   ├── css/index-*.css
│   └── js/index-*.js
```

---

### ✅ PASSO 4: Deploy no Netlify

**Opção A: Deploy Automático via Git (Recomendado)**

1. **Merge do branch** (se ainda não fez):
   ```bash
   # Via GitHub Web:
   # 1. Acesse: https://github.com/LionGab/boltnathH
   # 2. Vá em "Pull Requests"
   # 3. Clique em "New Pull Request"
   # 4. Base: main | Compare: claude/nathclub-product-strategy-011CUKui93ADErLbA5MyavPn
   # 5. Clique "Create Pull Request"
   # 6. Clique "Merge Pull Request"

   # OU via linha de comando:
   git checkout main
   git merge claude/nathclub-product-strategy-011CUKui93ADErLbA5MyavPn
   git push origin main
   ```

2. **Netlify fará deploy automático:**
   - Acesse: https://app.netlify.com/sites/SEU_SITE/deploys
   - Aguarde build completar (~2-3 minutos)
   - Status: ✅ Published

**Opção B: Deploy Manual via Netlify CLI**

```bash
# 1. Instalar Netlify CLI (se necessário)
npm install -g netlify-cli

# 2. Login no Netlify
netlify login

# 3. Deploy
netlify deploy --prod

# Quando perguntado:
# - Publish directory: dist
# - Confirme o site
```

**Opção C: Deploy Manual via Drag & Drop**

1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `dist/` para o navegador
3. Aguarde upload completar

---

### ✅ PASSO 5: Verificar Variáveis de Ambiente no Netlify

1. Acesse: https://app.netlify.com/sites/SEU_SITE/settings/deploys
2. Vá em **Environment variables**
3. Verifique que existem:

```
VITE_SUPABASE_URL = https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Se não existirem, adicione:**

```bash
# Via Netlify CLI:
netlify env:set VITE_SUPABASE_URL "https://bbcwitnbnosyfpfjtzkr.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "SUA_ANON_KEY_AQUI"

# Depois, re-deploy:
netlify deploy --prod
```

---

### ✅ PASSO 6: Configurar Redirect URLs no Supabase

Para que o login funcione corretamente após onboarding:

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration

2. **Site URL:**
   ```
   https://clubnath.netlify.app
   ```

3. **Redirect URLs (adicione):**
   ```
   https://clubnath.netlify.app
   https://clubnath.netlify.app/**
   http://localhost:5173
   http://localhost:5173/**
   ```

4. Clique **Save**

---

## 🧪 PASSO 7: Testar o Onboarding em Produção

### Teste 1: Novo Usuário

1. Acesse seu site: `https://clubnath.netlify.app`
2. Clique em **Cadastrar**
3. Crie uma conta nova com e-mail de teste
4. **Verifique que aparece o onboarding:**
   - ✅ Tela 1: Welcome Screen com "Criado pela Nath"
   - ✅ Tela 2: Escolha de apelido e emoji
   - ✅ Tela 3: Seleção de objetivos
   - ✅ Tela 4: Feature tour
   - ✅ Após completar: vai para o Feed

### Teste 2: Robô Nath Atualizado

1. Após completar onboarding, vá em **Chat**
2. Envie mensagem: "Estou cansada"
3. **Verifique resposta:**
   - ✅ Usa "miga" ou tom jovem
   - ✅ Tem emojis (💜✨🙏)
   - ✅ Menciona fé naturalmente
   - ✅ Tom acolhedor e autêntico

### Teste 3: Usuário Existente (Não Deve Ver Onboarding)

1. Faça logout
2. Login com conta antiga
3. **Verificar:**
   - ✅ Vai direto para o Feed
   - ✅ NÃO mostra onboarding (campo `onboarding_completed = true`)

### Teste 4: Perfil com Dados de Onboarding

1. Acesse **Perfil**
2. **Verificar:**
   - ✅ Avatar emoji aparece (se implementou exibição)
   - ✅ Apelido salvo

---

## 🐛 TROUBLESHOOTING

### Problema 1: Onboarding não aparece para novos usuários

**Sintoma:** Após signup, vai direto para o feed

**Solução:**
```sql
-- Verificar no SQL Editor do Supabase:
SELECT id, full_name, onboarding_completed
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- Se onboarding_completed = true para usuários novos:
-- A migration marcou usuários antigos como completados
-- Crie novo usuário para testar
```

### Problema 2: Erro ao salvar dados do onboarding

**Sintoma:** Erro 500 ou "Failed to complete onboarding"

**Verificar:**
1. Migration foi aplicada?
   ```sql
   SELECT * FROM information_schema.columns
   WHERE table_name = 'profiles'
     AND column_name = 'onboarding_goals';
   ```

2. RLS está configurado?
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles';
   ```

3. Verificar logs no Supabase:
   - Dashboard > Logs > Database

### Problema 3: Robô Nath responde com tom antigo

**Sintoma:** Respostas sem "miga", sem emojis 💜

**Solução:**
```bash
# Re-deploy da função
supabase functions deploy chat-ai --no-verify-jwt

# Verificar no Dashboard:
# Project Settings > Edge Functions > chat-ai
# Deve mostrar "Last deployed: há poucos minutos"
```

### Problema 4: Build falha no Netlify

**Sintoma:** Deploy failed com erro de compilação

**Verificar:**
1. Build local funciona?
   ```bash
   npm run build
   ```

2. Node version no Netlify:
   - Site Settings > Build & Deploy > Environment
   - Adicionar: `NODE_VERSION = 18`

3. Build command está correto?
   - Build command: `npm run build`
   - Publish directory: `dist`

### Problema 5: Variáveis de ambiente não carregam

**Sintoma:** "Missing Supabase environment variables"

**Solução:**
```bash
# Verificar variáveis:
netlify env:list

# Se vazias, adicionar:
netlify env:set VITE_SUPABASE_URL "https://bbcwitnbnosyfpfjtzkr.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "COLE_SUA_KEY_AQUI"

# Trigger novo deploy:
netlify deploy --prod --trigger
```

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy completo:

- [ ] Migration aplicada no Supabase (verificar colunas)
- [ ] Edge Function `chat-ai` re-deployed
- [ ] Build local funciona sem erros
- [ ] Deploy no Netlify publicado
- [ ] Variáveis de ambiente configuradas
- [ ] Redirect URLs atualizadas no Supabase
- [ ] Teste com novo usuário (onboarding aparece)
- [ ] Teste com usuário antigo (onboarding NÃO aparece)
- [ ] Robô Nath responde com novo tom
- [ ] Perfil salva dados do onboarding

---

## 📊 MONITORAMENTO PÓS-DEPLOY

### Analytics de Onboarding

Verificar métricas via SQL:

```sql
-- Taxa de conclusão de onboarding
SELECT
  COUNT(*) FILTER (WHERE onboarding_completed = true) AS completed,
  COUNT(*) FILTER (WHERE onboarding_completed = false) AS incomplete,
  ROUND(
    COUNT(*) FILTER (WHERE onboarding_completed = true)::numeric /
    COUNT(*)::numeric * 100,
    2
  ) AS completion_rate_percent
FROM profiles
WHERE created_at > NOW() - INTERVAL '7 days';

-- Objetivos mais escolhidos
SELECT
  goal,
  COUNT(*) as count
FROM profiles,
  jsonb_array_elements_text(onboarding_goals) as goal
WHERE onboarding_completed = true
GROUP BY goal
ORDER BY count DESC;

-- Emojis de avatar mais usados
SELECT
  avatar_emoji,
  COUNT(*) as count
FROM profiles
WHERE avatar_emoji IS NOT NULL
GROUP BY avatar_emoji
ORDER BY count DESC
LIMIT 10;
```

### Logs do Robô Nath

```sql
-- Volume de mensagens no chat
SELECT
  DATE(created_at) as day,
  COUNT(*) as messages
FROM chat_messages
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY day
ORDER BY day DESC;
```

---

## 🎯 PRÓXIMAS OTIMIZAÇÕES

Após deploy inicial funcionar:

1. **A/B Testing de Onboarding:**
   - Testar diferentes mensagens de boas-vindas
   - Variar número de passos (3 vs 4)
   - Medir impacto na retenção

2. **Onboarding Analytics Dashboard:**
   - Implementar tracking de tempo por tela
   - Taxa de skip vs conclusão
   - Correlação objetivos x engajamento

3. **Personalização Avançada:**
   - Feed inicial baseado em `onboarding_goals`
   - Sugestões de primeiros posts
   - Matching com mães de objetivos similares

4. **Melhorias no Robô Nath:**
   - Contexto do onboarding nas respostas
   - Referências aos objetivos escolhidos
   - Celebração de milestones (primeira semana, primeiro mês)

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Verificar logs:**
   - Netlify: Site > Deploys > [último deploy] > Deploy log
   - Supabase: Dashboard > Logs > Database/Functions

2. **Consultar documentação:**
   - [Netlify Docs](https://docs.netlify.com/)
   - [Supabase Docs](https://supabase.com/docs)

3. **Criar issue:**
   - https://github.com/LionGab/boltnathH/issues

---

## ✨ DEPLOY COMPLETO!

Após seguir todos os passos, você terá:

- ✅ Onboarding funcionando para novos usuários
- ✅ Robô Nath com personalidade da Nathália
- ✅ Sistema de analytics de onboarding
- ✅ Dados persistidos no Supabase
- ✅ App rodando em produção no Netlify

**URL do site:** https://SEU_SITE.netlify.app

---

**Última atualização:** 2025-10-21
**Versão:** 1.0.0 - Sistema de Onboarding NathClub
