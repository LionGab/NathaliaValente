# 🎯 Plano de Ação Imediato - ClubNath VIP

**Data:** 27 de Outubro de 2025
**Prazo:** 30 dias
**Objetivo:** Tornar o projeto 100% funcional e production-ready

---

## 🚨 AÇÕES IMEDIATAS (HOJE - 2h)

### 1. Configurar Ambiente Local (30 min)

```bash
# Passo 1: Criar arquivo .env
cp .env.example .env

# Passo 2: Editar .env e adicionar:
# VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
# VITE_SUPABASE_ANON_KEY=[obter do Supabase Dashboard]
# VITE_ENV=development

# Passo 3: Instalar dependências
npm install

# Passo 4: Testar
npm run dev
# Deve abrir em http://localhost:5173
```

**Validação:**
- [ ] `npm run dev` funciona sem erros
- [ ] App carrega no navegador
- [ ] Login Instagram aparece

---

### 2. Atualizar CLAUDE.md (1h)

**Problema:** Arquivo fala de React Native, mas projeto é React Web

```bash
# Backup do antigo
mv CLAUDE.md CLAUDE.md.old

# Criar novo CLAUDE.md correto
# (ver template abaixo)
```

**Novo CLAUDE.md deve conter:**
- ✅ Stack: React 18 + Vite 7 + TypeScript
- ✅ PWA, não app nativo
- ✅ Tailwind CSS, não NativeWind
- ✅ Comandos corretos (npm run dev, build, test)
- ✅ Estrutura de pastas real

---

### 3. Validar CI/CD (30 min)

```bash
# Verificar que CI passa
git push origin [sua-branch]

# Acompanhar em:
# https://github.com/LionGab/NathaliaValente/actions

# Se falhar, verificar:
# - Testes estão passando localmente
# - TypeScript sem erros
# - Build funciona
```

**Validação:**
- [ ] CI passa verde
- [ ] Build completa com sucesso
- [ ] Testes executam (mesmo que poucos)

---

## 📅 SEMANA 1: Fundação (27 Out - 02 Nov)

### Segunda-feira (4h)
**Configurar Ambiente**
- [ ] Criar `.env` conforme acima
- [ ] Testar app localmente
- [ ] Documentar problemas encontrados
- [ ] Commitar `.env.example` atualizado se necessário

**Criar Logger Service**
```typescript
// src/utils/logger.ts
export const logger = {
  dev: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.log(`[${new Date().toISOString()}] ${message}`, data);
    }
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error);
    // TODO: Integrar Sentry
  },
  warn: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, data);
    }
  }
};
```

---

### Terça-feira (4h)
**Limpar Console.log - Parte 1**

Prioridade em arquivos críticos:
```bash
# 1. App.tsx
# 2. contexts/AuthContext.tsx
# 3. lib/supabase.ts
# 4. services/chat-history.service.ts
# 5. hooks/useMonetization.ts
```

**Para cada arquivo:**
```typescript
// Substituir:
console.log('[AUTH] State:', user);

// Por:
import { logger } from '@/utils/logger';
logger.dev('[AUTH] State:', user);
```

**Meta do dia:** Limpar 30-50 console.log

---

### Quarta-feira (4h)
**Criar Testes - AuthContext**

```typescript
// src/contexts/__tests__/AuthContext.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  it('deve iniciar com loading=true', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.loading).toBe(true);
  });

  it('deve setar user após login', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    // Simular login
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Adicionar mais testes conforme necessário
  });
});
```

**Meta do dia:** 10+ testes básicos de AuthContext

---

### Quinta-feira (4h)
**Criar Testes - Hooks**

```typescript
// src/hooks/__tests__/useAuth.test.ts
// src/hooks/__tests__/usePosts.test.ts
// src/hooks/__tests__/useMonetization.test.ts
```

**Template:**
```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useHookName', () => {
  it('deve retornar dados corretos', async () => {
    const { result } = renderHook(() => useHookName(), {
      wrapper: createWrapper()
    });

    // Asserções
  });
});
```

**Meta do dia:** Testar 5 hooks principais

---

### Sexta-feira (4h)
**Criar Testes E2E - Básicos**

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve mostrar página de login', async ({ page }) => {
    await page.goto('/');

    // Verificar que Instagram login está visível
    const loginButton = page.getByText(/entrar com instagram/i);
    await expect(loginButton).toBeVisible();
  });

  test('deve redirecionar para feed após login', async ({ page }) => {
    // Implementar mock de login
    // Verificar redirecionamento
  });
});
```

**Meta do dia:**
- [ ] 3-5 testes E2E básicos
- [ ] Pipeline E2E no CI
- [ ] Documentar como rodar

**Review Semanal:**
- [ ] Cobertura atual: ~20-25%
- [ ] Console.log reduzidos: 50%
- [ ] Ambiente configurado: 100%

---

## 📅 SEMANA 2: Qualidade (03 - 09 Nov)

### Foco: Limpar Código + Testes

**Segunda:** Limpar console.log (componentes)
- [ ] components/FeedPage.tsx
- [ ] components/ChatPage.tsx
- [ ] components/ProfilePage.tsx
- [ ] components/groups/
- Meta: < 100 console.log total

**Terça:** Corrigir tipos 'any' - Core
- [ ] App.tsx
- [ ] contexts/*.tsx
- [ ] types/*.ts
- Meta: Core 100% tipado

**Quarta:** Corrigir tipos 'any' - Services
- [ ] services/chat-history.service.ts
- [ ] services/notifications.service.ts
- [ ] services/posts.service.ts
- Meta: Services 80% tipados

**Quinta:** Testes - Components
- [ ] FeedPage.test.tsx
- [ ] InstagramAuth.test.tsx
- [ ] ProfilePage.test.tsx
- Meta: 40% cobertura

**Sexta:** Review + Ajustes
- [ ] Code review do que foi feito
- [ ] Corrigir bugs encontrados
- [ ] Atualizar documentação

**Review Semanal:**
- [ ] Cobertura: ~40%
- [ ] Console.log: < 50
- [ ] Tipos 'any': < 40

---

## 📅 SEMANA 3: Expansão (10 - 16 Nov)

### Foco: Testes Completos + Organização

**Segunda-Terça:** Testes - Services
```typescript
// src/services/__tests__/posts.service.test.ts
// src/services/__tests__/groups.service.test.ts
// src/services/__tests__/notifications.service.test.ts
```

**Quarta:** Organizar Documentação
```bash
# Mover arquivos de auditoria
mkdir -p docs/auditorias/archive
mv AUDITORIA-*.md docs/auditorias/archive/
mv RESUMO-*.md docs/auditorias/archive/

# Manter apenas:
# - docs/auditorias/AUDITORIA-OUTUBRO-2025.md (atual)
# - docs/auditorias/LATEST.md (link simbólico)
```

**Quinta:** Limpar Branches
```bash
# Revisar branches antigas
git branch -r | grep claude

# Para cada branch:
# 1. Verificar se já mergeada
# 2. Se sim, deletar
# 3. Se não, revisar se necessária

git push origin --delete claude/branch-antiga
```

**Sexta:** Testes E2E Expandidos
```typescript
// e2e/feed.spec.ts - Fluxo completo de feed
// e2e/groups.spec.ts - Criar grupo
// e2e/chat.spec.ts - Chat com IA
```

**Review Semanal:**
- [ ] Cobertura: ~55-60%
- [ ] Docs organizadas
- [ ] Branches limpas

---

## 📅 SEMANA 4: Finalização (17 - 23 Nov)

### Foco: 100% Production Ready

**Segunda-Terça:** Completar Testes
- [ ] Todos hooks testados
- [ ] Componentes UI testados
- [ ] Services 100% testados
- Meta: 70%+ cobertura

**Quarta:** Performance Audit
```bash
# Lighthouse audit
npm run build
npx lighthouse http://localhost:4173 --view

# Analisar bundle
npm run build -- --mode production
ls -lh dist/assets/

# Verificar compression
ls -lh dist/assets/*.br
```

**Quinta:** Security Audit
```bash
# npm audit
npm audit
npm audit fix

# Verificar secrets
npm run check-secrets

# Scan de vulnerabilidades
npm run security-scan
```

**Sexta:** Release Preparation
- [ ] Changelog completo
- [ ] Version bump
- [ ] Tag de release
- [ ] Deploy em produção
- [ ] Smoke tests

---

## 📊 MÉTRICAS DE PROGRESSO

### Tracking Diário
```markdown
## [Data]

### Completado:
- [ ] Tarefa 1
- [ ] Tarefa 2

### Bloqueios:
- Nenhum / [descrever]

### Próximos passos:
- Amanhã: [...]

### Métricas:
- Cobertura: X%
- Console.log: Y
- Tipos 'any': Z
```

---

## 🎯 CRITÉRIOS DE SUCESSO

### ✅ Semana 1
- [ ] Ambiente local 100% configurado
- [ ] CLAUDE.md atualizado
- [ ] 20-25% cobertura de testes
- [ ] Logger service criado
- [ ] 50% console.log removidos

### ✅ Semana 2
- [ ] 40% cobertura de testes
- [ ] < 50 console.log
- [ ] Tipos 'any' < 40
- [ ] Core components tipados

### ✅ Semana 3
- [ ] 60% cobertura de testes
- [ ] Documentação organizada
- [ ] Branches limpas
- [ ] E2E tests principais flows

### ✅ Semana 4 - PRODUCTION READY
- [ ] 70%+ cobertura de testes
- [ ] < 20 console.log
- [ ] < 10 tipos 'any'
- [ ] CI/CD 100% verde
- [ ] Lighthouse > 90
- [ ] Zero vulnerabilidades críticas
- [ ] Deploy em produção
- [ ] Monitoramento ativo

---

## 🚀 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev                 # Dev server
npm run build              # Build produção
npm run preview            # Preview build local

# Qualidade
npm run typecheck          # Verificar TypeScript
npm run lint               # ESLint
npm run format             # Prettier
npm run format:check       # Check formatting

# Testes
npm run test               # Tests watch mode
npm run test:run           # Run once
npm run test:coverage      # Com cobertura
npm run test:e2e           # E2E com Playwright
npm run test:all           # Todos os testes

# Análise
npm audit                  # Security audit
npm run build -- --mode production  # Build análise
```

---

## 📞 SUPORTE E RECURSOS

### Documentação:
- Setup: `docs/setup/SETUP_INSTRUCTIONS.md`
- Testes: `TESTING.md`
- Deploy: `docs/deployment/DEPLOY_NETLIFY.md`
- Auditoria Completa: `AUDITORIA-OUTUBRO-2025.md`

### CI/CD:
- Actions: https://github.com/LionGab/NathaliaValente/actions
- Netlify: [configurar URL]

### Supabase:
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs

---

## ✅ CHECKLIST FINAL

Antes de marcar como "100% funcional":

**Desenvolvimento:**
- [ ] `.env` configurado e documentado
- [ ] `npm run dev` funciona sem erros
- [ ] Todos os comandos package.json funcionam

**Código:**
- [ ] TypeScript sem erros
- [ ] ESLint sem warnings críticos
- [ ] < 20 console.log
- [ ] < 10 tipos 'any'
- [ ] Código organizado e documentado

**Testes:**
- [ ] 70%+ cobertura total
- [ ] Testes críticos: Auth, Feed, Chat
- [ ] E2E: Login, Post, Grupo
- [ ] CI rodando testes automaticamente

**Build:**
- [ ] Build sucesso
- [ ] Bundle < 200KB
- [ ] Compression funcionando
- [ ] Source maps configurados

**Performance:**
- [ ] Lighthouse > 90
- [ ] FCP < 1.5s
- [ ] TTI < 3s
- [ ] PWA score 100

**Segurança:**
- [ ] npm audit: zero críticas
- [ ] Secrets scan: limpo
- [ ] .env não commitado
- [ ] RLS configurado no Supabase

**Deploy:**
- [ ] Netlify configurado
- [ ] Env vars em produção
- [ ] CI/CD automático
- [ ] Health check funcionando

**Documentação:**
- [ ] README atualizado
- [ ] CLAUDE.md correto
- [ ] Docs organizadas
- [ ] Changelog atualizado

---

**Criado por:** Claude Code
**Última atualização:** 27 de Outubro de 2025
**Prazo:** 27 de Novembro de 2025 (30 dias)
