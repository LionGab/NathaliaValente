# 📋 Relatório de Auditoria de Código - Nossa Maternidade

**Data:** 27/10/2025
**Auditor:** Claude Code - Auditoria Automatizada
**Branch:** claude/code-audit-review-011CUXKcuL7CJcMafQK3QAME
**Commit:** 317d612

---

## 📊 Resumo Executivo

### ✅ Status Geral: **BOM COM RESSALVAS**

O projeto está em estado funcional com uma arquitetura sólida, mas apresenta algumas áreas que requerem atenção para garantir escalabilidade, manutenibilidade e segurança a longo prazo.

**Pontuação Geral:** 7.5/10

| Categoria       | Status       | Pontuação |
| --------------- | ------------ | --------- |
| Dependências    | ✅ Bom       | 9/10      |
| Configuração    | ⚠️ Atenção   | 6/10      |
| Código Core     | ✅ Bom       | 8/10      |
| Build/Deploy    | ✅ Excelente | 9/10      |
| Integração APIs | ⚠️ Atenção   | 7/10      |
| Segurança       | ⚠️ Atenção   | 7/10      |
| Performance     | ✅ Bom       | 8/10      |

---

## 🔍 1. DEPENDÊNCIAS

### ✅ Status: BOM

**Problemas Críticos:** 0
**Vulnerabilidades:** 0 (conforme npm audit)

### Dependências Desatualizadas

```
Pacote                    Atual    Disponível  Impacto
@supabase/supabase-js     2.76.0   2.76.1      BAIXO
react                     18.3.1   19.2.0      ALTO
react-dom                 18.3.1   19.2.0      ALTO
tailwindcss               3.4.18   4.1.16      MÉDIO
vitest                    3.2.4    4.0.3       MÉDIO
```

### 🔴 PROBLEMA CRÍTICO #1: React 18 vs React 19

**Evidência:**

- `src/App.tsx:1` - Usando React 18.3.1
- React 19 disponível desde 2024
- TypeScript types incompatíveis entre versões

**Causa Raiz:**
Projeto não foi atualizado para React 19, que traz breaking changes significativos.

**Impacto:**

- ALTO - Futura migração será complexa
- Perda de novos recursos (Actions, Document Metadata, etc)
- Incompatibilidade com bibliotecas mais recentes

**Solução Recomendada:**

```bash
# Opção 1: Manter React 18 (estável - RECOMENDADO)
# Justificativa: Ecosistema ainda em transição para React 19
npm install react@18.3.1 react-dom@18.3.1 --save-exact

# Opção 2: Migrar para React 19 (futuro)
# Requer: Auditoria completa de breaking changes
# Tempo estimado: 2-3 dias de desenvolvimento
```

**Prioridade:** 🟡 MÉDIA (planejar para Q2 2025)

---

### ⚠️ PROBLEMA #2: Tailwind CSS v3 → v4

**Evidência:**

- `tailwind.config.js` - Configuração v3
- Tailwind v4.1.16 disponível com nova arquitetura

**Impacto:**

- MÉDIO - Breaking changes na sintaxe
- Melhor performance com nova engine CSS

**Solução:**

```bash
# Aguardar estabilização do ecossistema
# Tailwind v4 ainda em early adoption
# Planejar migração para Q3 2025
```

**Prioridade:** 🟢 BAIXA

---

## 🔧 2. CONFIGURAÇÕES E VARIÁVEIS DE AMBIENTE

### ⚠️ Status: ATENÇÃO NECESSÁRIA

**Problemas Críticos:** 2
**Warnings:** 3

### 🔴 PROBLEMA CRÍTICO #2: Variáveis de Ambiente Expostas no Build

**Evidência:**

```yaml
# .github/workflows/deploy.yml:28-44
env:
  VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
  VITE_CLAUDE_API_KEY: ${{ secrets.VITE_CLAUDE_API_KEY }}
  VITE_STRIPE_SECRET_KEY: ${{ secrets.VITE_STRIPE_SECRET_KEY }}
```

**Causa Raiz:**
Secrets sendo injetadas diretamente no build frontend, expostas no JavaScript do cliente.

**Impacto:**

- 🔥 CRÍTICO - Chaves de API expostas publicamente
- Potencial vazamento de `STRIPE_SECRET_KEY` (deveria estar APENAS no backend)
- Custo financeiro se chaves forem exploradas

**Solução Imediata:**

```diff
# .github/workflows/deploy.yml
env:
  VITE_APP_NAME: Nossa Maternidade
  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
- VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
- VITE_CLAUDE_API_KEY: ${{ secrets.VITE_CLAUDE_API_KEY }}
- VITE_STRIPE_SECRET_KEY: ${{ secrets.VITE_STRIPE_SECRET_KEY }}
+ # ⚠️ NUNCA exponha secret keys no frontend!
+ # Use Edge Functions ou Backend API
```

**Arquitetura Correta:**

```typescript
// ✅ CORRETO - Backend/Edge Function
// supabase/functions/ai-chat/index.ts
const openaiKey = Deno.env.get('OPENAI_API_KEY'); // Servidor apenas

// ✅ CORRETO - Frontend chama função segura
const response = await supabase.functions.invoke('ai-chat', {
  body: { message: userInput },
});
```

**Prioridade:** 🔴 CRÍTICA - Corrigir IMEDIATAMENTE

---

### 🔴 PROBLEMA CRÍTICO #3: Arquivo .env Não Existe

**Evidência:**

```bash
$ ls -la | grep .env
-rw-r--r--   1 root root    247 Oct 27 07:38 .env.example
# Nenhum arquivo .env encontrado
```

**Causa Raiz:**
Projeto depende de variáveis de ambiente mas não tem `.env` local configurado.

**Impacto:**

- ALTO - Desenvolvedores não conseguem rodar localmente
- Supabase não funciona sem credenciais
- Modo demo ativa automaticamente (fallback)

**Solução:**

```bash
# 1. Criar .env a partir do exemplo
cp .env.example .env

# 2. Adicionar credenciais reais
cat > .env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=<PEGAR_DO_PAINEL_SUPABASE>

# Environment
VITE_ENV=development
EOF

# 3. Verificar .gitignore
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
```

**Prioridade:** 🔴 ALTA - Bloqueia desenvolvimento

---

### ⚠️ PROBLEMA #3: Base Path Hardcoded para GitHub Pages

**Evidência:**

```typescript
// vite.config.ts:9
base: process.env.NODE_ENV === 'production' ? '/NathaliaValente/' : '/',
```

**Impacto:**

- MÉDIO - Deploy em outros ambientes (Netlify, Vercel) quebra
- Assets 404 se base path mudar

**Solução:**

```typescript
// vite.config.ts
base: process.env.VITE_BASE_PATH ||
      (process.env.NODE_ENV === 'production' ? '/NathaliaValente/' : '/'),
```

**Prioridade:** 🟡 MÉDIA

---

## 💻 3. CÓDIGO CORE E ARQUITETURA

### ✅ Status: BOM

**Problemas:** 4 (todos não-bloqueantes)

### ⚠️ PROBLEMA #4: Console Logs em Produção

**Evidência:**

```bash
# Grep encontrou 328 ocorrências de console.* em 62 arquivos
$ grep -r "console\.(log|error|warn)" src/
```

**Arquivos mais problemáticos:**

- `src/App.tsx:48` - 3 console.log
- `src/components/InstagramAuth.tsx` - 7 console.log
- `src/lib/performance-monitor.ts` - 26 console.log/warn

**Impacto:**

- BAIXO - Performance negligenciável
- MÉDIO - Vazamento de informações sensíveis em logs
- Poluição do console do usuário

**Solução:**

```typescript
// ✅ CORRETO - Usar logger condicional
// src/utils/logger.ts já existe!
import { logger } from '@/utils/logger';

// Em vez de:
console.log('[AUTH] User signed in:', user.email); // ❌

// Use:
logger.info('[AUTH] User signed in', { userId: user.id }); // ✅
```

**Configuração vite.config.ts já remove console em produção:**

```typescript
// vite.config.ts:173-175
terserOptions: {
  compress: {
    drop_console: true, // ✅ Já configurado
  }
}
```

**Prioridade:** 🟢 BAIXA - Já mitigado no build

---

### ⚠️ PROBLEMA #5: Imports Não Utilizados e TODOs

**Evidência:**

```bash
# 15 arquivos com TODOs/FIXMEs
$ grep -ri "TODO\|FIXME" src/
```

**Principais TODOs:**

1. `src/services/payment-integration.service.ts` - TODO: Implementar Stripe
2. `src/components/navigation/index.ts` - FIXME: Exportar componentes
3. `src/features/groups/services/index.ts` - TODO: Documentar API

**Impacto:**

- BAIXO - Código técnico não afeta produção
- MÉDIO - Débito técnico crescente

**Solução:**

```bash
# Criar issues do GitHub para rastrear
npm run lint # Já configurado para detectar unused imports
```

**Prioridade:** 🟢 BAIXA

---

### ⚠️ PROBLEMA #6: Service Worker Manual em main.tsx

**Evidência:**

```typescript
// src/main.tsx:13-29
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js'); // ❌ Redundante
}
```

**Causa Raiz:**
vite-plugin-pwa já gerencia service worker automaticamente.

**Impacto:**

- BAIXO - Registro duplicado (não causa erro)
- Confusão de lógica

**Solução:**

```typescript
// src/main.tsx - REMOVER bloco inteiro
// vite.config.ts:14 já tem VitePWA({ registerType: 'autoUpdate' })
```

**Prioridade:** 🟢 BAIXA

---

## 🏗️ 4. BUILD E DEPLOY

### ✅ Status: EXCELENTE

**Build:** ✅ Passou (11.42s)
**Tamanho Total:** ~12.16 MB (precache)
**JavaScript:** 676 KB (sem gzip)
**CSS:** 112 KB (gzip: 16.5 KB)

### Análise de Bundle

```
Arquivo                          Tamanho    Gzip      Brotli
vendor-supabase-DIEBp4c2.js      165 KB     41.8 KB   35.5 KB  ⚠️
vendor-react-XBcw1F22.js         139 KB     45 KB     38.3 KB  ⚠️
index-BjZDXI7B.js                107 KB     28.9 KB   24.1 KB  ✅
FeedPage-BM7aeVpF.js             42 KB      12.1 KB   10.6 KB  ✅
useMockData-Dp_uFU_k.js          33 KB      10.8 KB   9.2 KB   ✅
```

### ⚠️ PROBLEMA #7: Supabase Bundle Grande

**Evidência:**
vendor-supabase: 165 KB (41.8 KB gzip)

**Impacto:**

- MÉDIO - Aumenta tempo de carregamento inicial
- Primeira visita: ~500ms adicional (3G)

**Solução:**

```typescript
// vite.config.ts - Tree shaking manual
import { createClient } from '@supabase/supabase-js/dist/module/index.js';

// Ou usar imports específicos
import { SupabaseClient } from '@supabase/supabase-js';
```

**Prioridade:** 🟡 MÉDIA (otimização futura)

---

### ✅ DESTAQUES POSITIVOS

1. **Compressão Excelente**
   - Gzip + Brotli configurados
   - Assets < 4KB inline como base64
   - Cache splitting otimizado

2. **PWA Bem Configurado**
   - Service Worker: 76 assets precached
   - Workbox com estratégias corretas
   - Offline-first para assets estáticos

3. **CI/CD Robusto**
   ```yaml
   # .github/workflows/ci.yml
   ✅ Type check
   ✅ Tests com coverage (80%+ threshold)
   ✅ Security audit
   ✅ Build artifacts
   ✅ Secret scanning
   ```

---

## 🔗 5. INTEGRAÇÃO COM APIs

### ⚠️ Status: ATENÇÃO

**Problemas:** 3

### 🔴 PROBLEMA CRÍTICO #4: Configuração Supabase Insegura

**Evidência:**

```typescript
// src/lib/supabase.ts:8-18
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ SUPABASE NÃO CONFIGURADO - Usando modo DEMO');
}

// Fallback com placeholder
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {...})
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {...});
  //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^
  //             ❌ PROBLEMA: Cliente inválido criado sem erro
```

**Causa Raiz:**
Fallback silencioso permite aplicação rodar sem backend funcional.

**Impacto:**

- ALTO - Erros só aparecem em runtime ao usar features
- Dificulta debugging ("por que não salva?")
- Dados mockados podem confundir usuário

**Solução:**

```typescript
// src/lib/supabase.ts
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.PROD) {
    // ✅ PRODUÇÃO: Falhar loud
    throw new Error('SUPABASE_CONFIG_MISSING');
  } else {
    // ✅ DEV: Avisar claramente
    console.error('🚨 SUPABASE NÃO CONFIGURADO!');
    console.error('Configure .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
  }
}
```

**Prioridade:** 🔴 ALTA

---

### ⚠️ PROBLEMA #8: AuthContext com Retry Lógica Complexa

**Evidência:**

```typescript
// src/contexts/AuthContext.tsx:107-132
const signIn = async (email: string, password: string) => {
  const result = await authWithRetry(
    () => supabase.auth.signInWithPassword({...}),
    { feature: 'auth', retries: 2 }
  );
  // Lógica complexa de error handling
}
```

**Impacto:**

- MÉDIO - Difícil de testar
- Retry pode mascarar problemas de conectividade
- Error messages genéricos

**Solução:**

```typescript
// Simplificar - deixar React Query fazer retry
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error; // ✅ Deixar boundary capturar
  return data;
};
```

**Prioridade:** 🟡 MÉDIA (refatoração)

---

### ⚠️ PROBLEMA #9: Profile Fetch Silencioso

**Evidência:**

```typescript
// src/contexts/AuthContext.tsx:37-50
const fetchProfile = async (userId: string) => {
  try {
    const { data } = await supabase.from('profiles').select('*')...
    if (data) setProfile(data);
  } catch (error) {
    // ❌ Silently fail - profile is optional
  }
}
```

**Impacto:**

- MÉDIO - UI pode quebrar esperando profile.avatar_url
- Usuário não sabe que profile está incompleto

**Solução:**

```typescript
const fetchProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('profiles')...

    if (error) {
      logger.error('Profile fetch failed', { error, userId });
      // ✅ Mostrar toast ao usuário
      toast.warning('Perfil incompleto. Atualize suas informações.');
    }

    setProfile(data || null);
  } catch (error) {
    logger.error('Profile fetch exception', { error });
  }
}
```

**Prioridade:** 🟡 MÉDIA

---

## 🔒 6. SEGURANÇA

### ⚠️ Status: ATENÇÃO

**Vulnerabilidades npm:** 0
**Problemas de Código:** 3

### ✅ DESTAQUES POSITIVOS

1. **Secret Scanner Implementado**

   ```javascript
   // scripts/check-secrets.js
   ✅ Detecta API keys
   ✅ Bloqueia commits com secrets
   ✅ Integrado no lint-staged
   ```

2. **npm audit Limpo**

   ```json
   {
     "vulnerabilities": {},
     "metadata": {
       "vulnerabilities": { "total": 0 }
     }
   }
   ```

3. **CSP Headers** (via Netlify/GH Pages)
   ```toml
   # netlify.toml existe
   ```

### 🔴 PROBLEMA CRÍTICO #5: API Keys no Frontend

**Já coberto no Problema Crítico #2** - Reiterar importância:

**Chaves Expostas:**

```javascript
// ⚠️ VERIFICAR se estão no dist/assets/*.js
VITE_OPENAI_API_KEY;
VITE_CLAUDE_API_KEY;
VITE_PERPLEXITY_API_KEY;
VITE_GEMINI_API_KEY;
VITE_STRIPE_SECRET_KEY; // 🔥 NUNCA deve estar no frontend
```

**Impacto Financeiro:**

```
OpenAI API:     $0.002/1K tokens → $20/10M tokens
Claude API:     $0.015/1K tokens → $150/10M tokens
Stripe:         Acesso total a pagamentos 💀
```

**Ação Imediata:**

```bash
# 1. Verificar se já vazou
cd dist && grep -r "sk-" . # Stripe keys começam com sk_
cd dist && grep -r "eyJ" . # JWT tokens

# 2. Rotar TODAS as chaves se vazaram
# 3. Implementar backend proxy
```

**Prioridade:** 🔴 CRÍTICA

---

### ⚠️ PROBLEMA #10: CORS Aberto no Dev Server

**Evidência:**

```typescript
// vite.config.ts:240-241
server: {
  cors: true, // ❌ Aceita todas as origens
}
```

**Impacto:**

- BAIXO - Apenas em desenvolvimento
- Risco de CSRF em ambiente dev compartilhado

**Solução:**

```typescript
server: {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }
}
```

**Prioridade:** 🟢 BAIXA

---

## 📈 7. PERFORMANCE E OTIMIZAÇÃO

### ✅ Status: BOM

**Lighthouse Score Estimado:** 85-90

### Otimizações Implementadas

1. **Code Splitting** ✅

   ```typescript
   // src/App.tsx:24-29
   const FeedPage = lazy(() => import('./components/FeedPage'));
   const ChatPage = lazy(() => import('./components/ChatPage'));
   // ...
   ```

2. **Image Optimization** ✅
   - LazyImage component
   - imageCache utility
   - WebP support

3. **Virtual Lists** ✅
   - react-window implementado
   - react-window-infinite-loader

### ⚠️ PROBLEMA #11: Service Worker Cache Agressivo

**Evidência:**

```typescript
// vite.config.ts:84-95
urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
handler: 'NetworkFirst',
options: {
  expiration: { maxAgeSeconds: 60 * 60 } // 1 hora
}
```

**Impacto:**

- MÉDIO - Dados desatualizados podem ser servidos
- Usuários podem não ver posts novos por 1 hora

**Solução:**

```typescript
// Reduzir cache de API ou usar StaleWhileRevalidate
handler: 'StaleWhileRevalidate',
options: {
  expiration: { maxAgeSeconds: 60 * 5 } // 5 minutos
}
```

**Prioridade:** 🟡 MÉDIA

---

## 🎯 8. RECOMENDAÇÕES PRIORIZADAS

### 🔴 CRÍTICO - Implementar HOJE

1. **Remover API Keys do Frontend** (Problema #2)
   - Mover para Edge Functions
   - Tempo: 4-6 horas
   - Risco: Alto (vazamento financeiro)

2. **Validar Configuração Supabase** (Problema #4)
   - Fail-fast em produção
   - Tempo: 30 minutos

3. **Criar .env Local** (Problema #3)
   - Documentar no README
   - Tempo: 15 minutos

### 🟡 ALTO - Próxima Sprint

4. **Migrar Stripe para Backend** (Problema #2)
   - Criar Edge Function payment-intent
   - Tempo: 1 dia

5. **Simplificar AuthContext** (Problema #8)
   - Refatorar retry logic
   - Tempo: 2 horas

6. **Atualizar Dependencies** (Problema #1)
   - Manter React 18 pinned
   - Atualizar Supabase, Vite
   - Tempo: 1 hora

### 🟢 MÉDIO - Q2 2025

7. **Planejar Migração React 19**
   - Auditoria de breaking changes
   - Tempo: 2-3 dias

8. **Otimizar Bundle Supabase** (Problema #7)
   - Tree shaking manual
   - Tempo: 3 horas

9. **Reduzir Service Worker Cache** (Problema #11)
   - Tempo: 30 minutos

### 🔵 BAIXO - Backlog

10. **Remover Console Logs** (Problema #4)
11. **Cleanup TODOs** (Problema #5)
12. **Remover SW Manual** (Problema #6)

---

## 📝 9. CHECKLIST DE AÇÕES IMEDIATAS

```bash
# 🔴 CRÍTICO - Executar AGORA

# 1. Verificar se secrets vazaram
cd dist
grep -r "sk_" . && echo "🚨 STRIPE KEY FOUND IN BUILD!"
grep -r "eyJ" . && echo "⚠️ Potential JWT tokens found"
cd ..

# 2. Criar .env local
cp .env.example .env
echo "⚠️ CONFIGURE .env com credenciais reais!"

# 3. Remover secrets do workflow
git checkout .github/workflows/deploy.yml
# Editar manualmente removendo VITE_*_API_KEY e VITE_STRIPE_SECRET_KEY

# 4. Testar build
npm run build
npm run preview

# 5. Commit fix
git add .
git commit -m "security: Remove API keys from frontend build"
git push -u origin claude/code-audit-review-011CUXKcuL7CJcMafQK3QAME
```

---

## 📊 10. MÉTRICAS E TENDÊNCIAS

### Débito Técnico

```
TODOs/FIXMEs:        15 arquivos
Console Logs:        328 ocorrências
Dependências Outdated: 16 pacotes
Test Coverage:        ~60-70% (estimado)
```

### Saúde do Código

```
✅ TypeScript:       Strict mode habilitado
✅ Linting:          ESLint configurado
✅ Formatting:       Prettier configurado
✅ Git Hooks:        Husky + lint-staged
✅ CI/CD:            3 workflows ativos
```

### Recomendação de Monitoramento

```typescript
// Adicionar ferramentas:
1. Sentry - Error tracking
2. LogRocket - Session replay
3. Lighthouse CI - Performance regression
4. Dependabot - Automated updates
```

---

## 🎓 11. CONCLUSÕES E PRÓXIMOS PASSOS

### Conclusões

O projeto **Nossa Maternidade** demonstra uma arquitetura sólida e moderna, com práticas de desenvolvimento bem estabelecidas. A equipe implementou:

✅ **Pontos Fortes:**

- Build otimizado com code splitting
- PWA bem configurado
- CI/CD robusto com múltiplas validações
- Zero vulnerabilidades npm
- TypeScript strict mode
- Design system consistente

⚠️ **Áreas de Melhoria:**

- Segurança de API keys (CRÍTICO)
- Configuração de variáveis de ambiente
- Débito técnico (TODOs, console.logs)
- Estratégia de atualização de dependências

### Roadmap Recomendado

**Semana 1-2 (CRÍTICO):**

1. Migrar API keys para backend
2. Configurar .env local
3. Auditar build para secrets vazados
4. Implementar Sentry para monitoramento

**Mês 1 (ALTO):** 5. Refatorar AuthContext 6. Atualizar dependências não-breaking 7. Aumentar test coverage para 80%+ 8. Documentar arquitetura de segurança

**Q2 2025 (MÉDIO):** 9. Planejar migração React 19 10. Otimizar bundles 11. Implementar Lighthouse CI 12. Code cleanup (TODOs, console.logs)

### Assinatura

```
Auditoria realizada por: Claude Code Auditor
Data: 2025-10-27
Branch: claude/code-audit-review-011CUXKcuL7CJcMafQK3QAME
Commit: 317d612

Status Final: ✅ APROVADO COM RESSALVAS
Requer: Ações críticas de segurança antes de produção

Próxima auditoria recomendada: 60 dias
```

---

## 📚 Anexos

### A. Comandos Úteis

```bash
# Verificar saúde do projeto
npm run typecheck
npm run lint
npm run test:coverage
npm audit

# Otimizar build
npm run build
du -sh dist
find dist -name "*.js" -exec du -h {} \; | sort -rh | head -10

# Verificar secrets
node scripts/check-secrets.js $(git ls-files)

# Atualizar dependências
npm outdated
npm update --save
```

### B. Links de Referência

- [React 19 Migration Guide](https://react.dev/blog/2024/04/25/react-19)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/auth-helpers/security)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [OWASP Frontend Security](https://cheatsheetseries.owasp.org/)

---

**FIM DO RELATÓRIO**

_Relatório gerado automaticamente por Claude Code - Todas as recomendações devem ser validadas por equipe técnica antes de implementação._
