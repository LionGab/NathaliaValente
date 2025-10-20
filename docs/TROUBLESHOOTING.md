# 🐛 Troubleshooting - ClubNath

Guia completo de solução de problemas comuns no ClubNath.

## 📋 Índice

- [Erros de Instalação](#-erros-de-instalação)
- [Erros de Build](#-erros-de-build)
- [Erros de Runtime](#-erros-de-runtime)
- [Erros do Supabase](#-erros-do-supabase)
- [Erros da IA (Claude)](#-erros-da-ia-claude)
- [Erros de Deploy](#-erros-de-deploy)

## 🔧 Erros de Instalação

### Erro: "npm install" falha

**Sintomas:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solução:**
```bash
# Limpe cache
npm cache clean --force

# Remova node_modules e lock
rm -rf node_modules package-lock.json

# Reinstale
npm install

# Se persistir, force instalação
npm install --legacy-peer-deps
```

### Erro: "Node version incompatível"

**Sintomas:**
```
error This project requires Node.js 18 or higher
```

**Solução:**
```bash
# Verifique versão
node --version

# Se < 18, atualize:
# Windows: Baixe de https://nodejs.org/
# Mac: brew install node@18
# Linux: nvm install 18
```

### Erro: "Permission denied" (Linux/Mac)

**Sintomas:**
```
EACCES: permission denied
```

**Solução:**
```bash
# Use sudo apenas se necessário
sudo npm install -g supabase

# Ou configure permissões npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

## 🏗️ Erros de Build

### Erro: "TypeScript compilation failed"

**Sintomas:**
```
error TS2304: Cannot find name 'X'
error TS2769: Type 'Y' is not assignable
```

**Solução:**
```bash
# Verifique tipos
npm run typecheck

# Limpe cache TypeScript
rm -rf dist
rm tsconfig.tsbuildinfo

# Reconstrua
npm run build
```

### Erro: "Module not found"

**Sintomas:**
```
Error: Cannot find module '@/components/X'
```

**Solução:**
```bash
# Verifique se módulo existe
ls src/components/X.tsx

# Reinstale dependências
rm -rf node_modules
npm install

# Verifique imports
# Corrija caminhos relativos
```

### Erro: "Vite build failed"

**Sintomas:**
```
[vite] Build failed with X errors
```

**Solução:**
```bash
# Limpe dist
rm -rf dist

# Tente build detalhado
npm run build -- --debug

# Verifique espaço em disco
df -h

# Aumente memória Node
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

## ⚡ Erros de Runtime

### Erro 403: "Access denied"

**Sintomas:**
```
Failed to load resource: the server responded with a status of 403
```

**Solução:**

1. **Verifique variáveis de ambiente:**
```bash
# Confirme que .env contém:
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

2. **Obtenha nova anon key:**
   - Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
   - Copie "anon public" key
   - Atualize `.env`

3. **Reinicie servidor:**
```bash
# Pare servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### Erro: "Supabase client not initialized"

**Sintomas:**
```
Error: supabase is undefined
```

**Solução:**

1. **Verifique `src/lib/supabase.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
```

2. **Verifique imports:**
```typescript
// Correto:
import { supabase } from '@/lib/supabase'

// Incorreto:
import { supabase } from './supabase'
```

### Erro: "White screen" / Página em branco

**Sintomas:**
- Página carrega mas fica em branco
- Console sem erros óbvios

**Solução:**

1. **Verifique console:**
```
F12 → Console → Veja erros
```

2. **Verifique rotas:**
```typescript
// src/App.tsx
// Confirme que rotas existem
```

3. **Teste em modo produção:**
```bash
npm run build
npm run preview
```

4. **Limpe cache do navegador:**
```
Ctrl+Shift+Delete → Limpar cache
Ou modo anônimo: Ctrl+Shift+N
```

## 🗄️ Erros do Supabase

### Erro: "Supabase CLI not authenticated"

**Sintomas:**
```
Error: Not logged in
```

**Solução:**
```bash
# Login novamente
supabase login

# Vincule projeto
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# Digite senha quando solicitado
# Senha: G2008ab01M2012AB!
```

### Erro: "Invalid project reference"

**Sintomas:**
```
Error: Project not found
```

**Solução:**
```bash
# Desvincule
supabase unlink

# Vincule novamente
supabase link --project-ref bbcwitnbnosyfpfjtzkr

# Verifique status
supabase status
```

### Erro: "Database connection failed"

**Sintomas:**
```
FATAL: password authentication failed
```

**Solução:**

1. **Redefina senha:**
   - Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database
   - "Reset database password"

2. **Atualize conexão:**
```bash
supabase link --project-ref bbcwitnbnosyfpfjtzkr
# Digite nova senha
```

### Erro: "Edge Function deployment failed"

**Sintomas:**
```
Error deploying function: [error message]
```

**Solução:**

1. **Verifique estrutura:**
```bash
# Deve existir:
supabase/functions/chat-ai/index.ts
```

2. **Verifique código:**
```typescript
// Deve ter:
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // ... seu código
})
```

3. **Deploy novamente:**
```bash
supabase functions deploy chat-ai --no-verify-jwt
```

4. **Verifique logs:**
```bash
supabase functions logs chat-ai
```

## 🤖 Erros da IA (Claude)

### Erro: "Failed to get AI response"

**Sintomas:**
```
Error: Request to chat-ai function failed
```

**Solução:**

1. **Verifique API key:**
```bash
# Liste secrets
supabase secrets list

# Deve conter ANTHROPIC_API_KEY
# Se não, adicione:
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

2. **Teste Edge Function:**
```bash
# Via curl
curl -i --location --request POST \
  'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
  --header 'Authorization: Bearer SUA_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"message":"Olá"}'
```

3. **Verifique logs:**
```bash
supabase functions logs chat-ai --tail
```

### Erro: "Invalid API key"

**Sintomas:**
```
Error: 401 Unauthorized
```

**Solução:**

1. **Obtenha nova chave:**
   - Acesse: https://console.anthropic.com/
   - Settings → API Keys
   - Create Key

2. **Atualize secret:**
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api-...-sua-nova-chave
```

3. **Redeploy função:**
```bash
supabase functions deploy chat-ai
```

### Erro: "Rate limit exceeded"

**Sintomas:**
```
Error: 429 Too Many Requests
```

**Solução:**

1. **Aguarde 1 minuto**
2. **Verifique créditos Anthropic:**
   - https://console.anthropic.com/settings/billing

3. **Implemente throttling:**
```typescript
// Adicione delay entre requests
await new Promise(resolve => setTimeout(resolve, 1000))
```

## 🚀 Erros de Deploy

### Erro: "Netlify build failed"

**Sintomas:**
```
Build failed
```

**Solução:**

1. **Verifique variáveis de ambiente no Netlify:**
   - Site settings → Environment variables
   - Deve ter: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

2. **Teste build local:**
```bash
npm run build
```

3. **Verifique logs do Netlify:**
   - Deploys → (clique no deploy) → Deploy log

4. **Aumente memória:**
```toml
# netlify.toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Erro: "404 on page refresh" (SPA)

**Sintomas:**
- Rotas funcionam na navegação
- Erro 404 ao recarregar página

**Solução:**

Crie `public/_redirects`:
```
/*    /index.html   200
```

Ou `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Erro: "Environment variables não funcionam"

**Sintomas:**
```
VITE_SUPABASE_URL is undefined
```

**Solução:**

1. **Variáveis DEVEM começar com `VITE_`**
```
✅ VITE_SUPABASE_URL
❌ SUPABASE_URL
```

2. **Adicione no Netlify:**
   - Site settings → Environment variables
   - Add variable

3. **Redeploy:**
   - Triggers → Deploy site

## 🔍 Debugging Geral

### Habilitar modo debug

```bash
# Variável de ambiente
export DEBUG=*

# Ou no código
console.log('Debug:', variavel)
```

### Ver logs do navegador

```
F12 → Console
F12 → Network → Ver requests
F12 → Application → Ver localStorage
```

### Ver logs do Supabase

```bash
# Logs da Edge Function
supabase functions logs chat-ai --tail

# Logs do projeto
supabase logs
```

### Testar componentes isoladamente

```typescript
// Crie arquivo test.tsx
import Component from './Component'

export default function Test() {
  return <Component />
}
```

## 📞 Ainda com problemas?

1. ✅ Verifique [README.md](../README.md)
2. ✅ Veja [docs/SETUP.md](./SETUP.md)
3. ✅ Consulte logs detalhados
4. ✅ Teste em modo produção local
5. ✅ Crie issue no GitHub com:
   - Descrição do erro
   - Steps para reproduzir
   - Logs relevantes
   - Versão do Node/npm

---

**Boa sorte no debugging! 🔍**
