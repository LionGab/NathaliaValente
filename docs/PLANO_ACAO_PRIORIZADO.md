# 🎯 Plano de Ação Priorizado - ClubNath

**Data de Criação:** 23 de Outubro de 2025  
**Status:** 🔴 Ação Imediata Necessária  
**Última Atualização:** 2025-10-23

---

## 📊 Visão Geral

Este plano organiza todas as ações necessárias por **prioridade**, **impacto** e **esforço**, garantindo que os problemas mais críticos sejam resolvidos primeiro.

### Legenda de Prioridades

| Nível | Emoji | Descrição | Prazo |
|-------|-------|-----------|-------|
| **P0** | 🔴 | Crítico - Bloqueador | Hoje |
| **P1** | 🟠 | Alta - Urgente | Esta Semana |
| **P2** | 🟡 | Média - Importante | Este Mês |
| **P3** | 🔵 | Baixa - Desejável | Próximo Trimestre |

### Legenda de Esforço

- 🟢 **Baixo:** < 2 horas
- 🟡 **Médio:** 2-8 horas
- 🔴 **Alto:** > 8 horas

---

## 🔴 PRIORIDADE 0 - CRÍTICO (Fazer HOJE)

### P0.1 - Remover Chave Supabase Hardcoded
**Impacto:** 🔴 CRÍTICO - Vulnerabilidade de Segurança  
**Esforço:** 🟢 Baixo (30 minutos)  
**Arquivos:** `src/lib/supabase.ts`

#### Problema
```typescript
// ❌ ATUAL - VULNERÁVEL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Chave exposta!
```

#### Solução
```typescript
// ✅ CORRETO - SEGURO
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error(
    '❌ VITE_SUPABASE_ANON_KEY não configurada! ' +
    'Adicione a chave no arquivo .env'
  );
}
```

#### Passos
1. ✅ Abrir `src/lib/supabase.ts`
2. ✅ Remover o fallback com a chave hardcoded
3. ✅ Adicionar validação que lança erro se não configurada
4. ✅ Testar localmente com .env configurado
5. ✅ Verificar que Netlify tem a variável configurada
6. ✅ Commit e push

#### Verificação
```bash
# Garantir que .env está no .gitignore
grep -q "^\.env$" .gitignore && echo "✅ OK" || echo "❌ ADICIONAR"

# Verificar se não há mais chaves hardcoded
grep -r "eyJ" src/ && echo "❌ AINDA TEM CHAVES" || echo "✅ LIMPO"
```

---

### P0.2 - Corrigir Import React no App.tsx
**Impacto:** 🔴 CRÍTICO - Bug de Runtime  
**Esforço:** 🟢 Baixo (5 minutos)  
**Arquivos:** `src/App.tsx`

#### Problema
```typescript
// Linha 1: import { useState, Suspense, lazy } from 'react';
// Linha 37: React.useEffect(() => { ... }); // ❌ React não importado!
```

#### Solução
```typescript
// ✅ OPÇÃO 1: Usar useEffect diretamente
import { useState, Suspense, lazy, useEffect } from 'react';
// ...
useEffect(() => { ... }, [user, loading]);

// ✅ OPÇÃO 2: Importar React
import React, { useState, Suspense, lazy } from 'react';
// ...
React.useEffect(() => { ... }, [user, loading]);
```

#### Passos
1. ✅ Abrir `src/App.tsx`
2. ✅ Adicionar `useEffect` ao import da linha 1
3. ✅ Trocar `React.useEffect` por `useEffect` na linha 37
4. ✅ Verificar que não há outros usos de `React.` sem import
5. ✅ Executar `npm run typecheck` para validar
6. ✅ Commit

#### Verificação
```bash
# Verificar que não há mais React. sem import
grep -n "React\." src/App.tsx
```

---

### P0.3 - Validar Configuração do Ambiente
**Impacto:** 🔴 CRÍTICO - Deploy pode falhar  
**Esforço:** 🟢 Baixo (15 minutos)  
**Arquivos:** `.env`, Netlify Dashboard

#### Checklist
```bash
# Local
[ ] .env existe
[ ] VITE_SUPABASE_URL configurada
[ ] VITE_SUPABASE_ANON_KEY configurada
[ ] VITE_INSTAGRAM_CLIENT_ID configurada (opcional)

# Netlify
[ ] Environment Variables configuradas
[ ] VITE_SUPABASE_URL presente
[ ] VITE_SUPABASE_ANON_KEY presente
[ ] Build command: npm run build
[ ] Publish directory: dist

# Supabase
[ ] Site URL configurada: https://clubnath.netlify.app
[ ] Redirect URLs: https://clubnath.netlify.app/**
[ ] Auth habilitado
[ ] RLS policies ativas
```

#### Passos
1. ✅ Verificar `.env.example` como referência
2. ✅ Criar `.env` local se não existe
3. ✅ Adicionar todas as variáveis necessárias
4. ✅ Acessar Netlify → Site Settings → Environment Variables
5. ✅ Verificar que todas estão configuradas
6. ✅ Fazer deploy de teste

---

## 🟠 PRIORIDADE 1 - ALTA (Fazer ESTA SEMANA)

### P1.1 - Consolidar LoadingSpinner Duplicado
**Impacto:** 🟠 Alto - Manutenibilidade e Consistência  
**Esforço:** 🟡 Médio (2-3 horas)  
**Arquivos:** 16 arquivos afetados

#### Problema
```
/src/components/LoadingSpinner.tsx (34 linhas)
/src/components/ui/LoadingSpinner.tsx (92 linhas) 
↑ Usado em 16 componentes diferentes
```

#### Solução
1. **Escolher versão definitiva:** `/components/ui/LoadingSpinner.tsx`
2. **Deletar:** `/components/LoadingSpinner.tsx`
3. **Atualizar imports em 16 arquivos**

#### Passos

**Fase 1: Análise (30 min)**
```bash
# Listar todos os imports
grep -r "LoadingSpinner" src/ --include="*.tsx" --include="*.ts"

# Verificar qual versão é mais completa
# Result: /ui/LoadingSpinner.tsx tem:
# - LoadingSpinner (component)
# - PulseLoader (skeleton)
# - PostSkeleton (skeleton específico)
```

**Fase 2: Atualizar Imports (1h)**
```typescript
// ❌ ANTIGO
import { LoadingSpinner } from '../LoadingSpinner';
import { LoadingSpinner } from './LoadingSpinner';

// ✅ NOVO
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { LoadingSpinner } from './ui/LoadingSpinner';
```

**Arquivos a atualizar:**
1. `src/components/FeedPage.tsx`
2. `src/components/NotificationSettings.tsx`
3. `src/components/onboarding/AvatarSelector.tsx`
4. `src/components/onboarding/NotificationOnboarding.tsx`
5. `src/components/journaling/CreateJournalModal.tsx`
6. `src/components/journaling/JournalEntry.tsx`
7. `src/components/prayers/PrayerPost.tsx`
8. `src/components/prayers/CreatePrayerModal.tsx`
9. `src/components/sos-emotional/SosButton.tsx`
10. `src/components/groups/GroupsList.tsx`
11. `src/components/bible-studies/DailyStudy.tsx`
12. `src/components/bible-studies/BibleStudyCard.tsx`
13. `src/components/groups/CreateGroupModal.tsx`
14. `src/components/chat/MemoryIndicator.tsx`
15. `src/components/groups/GroupDetail.tsx`
16. `src/components/badges/BadgesGrid.tsx`

**Fase 3: Deletar Arquivo Antigo (5 min)**
```bash
rm src/components/LoadingSpinner.tsx
```

**Fase 4: Testar (30 min)**
```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

#### Script Automatizado
```bash
#!/bin/bash
# update-loading-spinner.sh

echo "🔄 Consolidando LoadingSpinner..."

# Lista de arquivos
files=(
  "src/components/FeedPage.tsx"
  "src/components/NotificationSettings.tsx"
  # ... adicionar todos os 16 arquivos
)

# Atualizar imports
for file in "${files[@]}"; do
  echo "Atualizando $file..."
  sed -i "s|from '../LoadingSpinner'|from '../ui/LoadingSpinner'|g" "$file"
  sed -i "s|from './LoadingSpinner'|from './ui/LoadingSpinner'|g" "$file"
  sed -i "s|from '../../LoadingSpinner'|from '../../ui/LoadingSpinner'|g" "$file"
done

# Deletar arquivo antigo
echo "Deletando arquivo duplicado..."
rm src/components/LoadingSpinner.tsx

echo "✅ Concluído! Execute: npm run typecheck"
```

---

### P1.2 - Remover Console.log de Produção
**Impacto:** 🟠 Alto - Performance e Segurança  
**Esforço:** 🟡 Médio (2-4 horas)  
**Arquivos:** 44 arquivos

#### Problema
```typescript
// ❌ Código de debug em produção
console.log('[AUTH] State change:', { loading, user });
console.error('Error creating post:', error);
console.warn('Performance warning:', metrics);
```

#### Solução

**Opção 1: Logger Service (Recomendado)**
```typescript
// src/utils/logger.ts
export const logger = {
  log: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[${new Date().toISOString()}]`, message, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, message, error);
    // Em produção, enviar para Sentry
  },
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[${new Date().toISOString()}] WARN:`, message, data);
    }
  }
};

// Uso
import { logger } from '@/utils/logger';
logger.log('[AUTH] State change', { loading, user });
```

**Opção 2: Remover Todos (Mais Rápido)**
```bash
# Script para comentar todos os console.log
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i 's/console\.log(/\/\/ console.log(/g'
```

#### Passos
1. ✅ Criar `src/utils/logger.ts` com logger service
2. ✅ Substituir console.log por logger.log nos 44 arquivos
3. ✅ Manter apenas console.error para erros críticos
4. ✅ Configurar Sentry (opcional, P2)
5. ✅ Testar em dev e produção
6. ✅ Commit

#### Arquivos Prioritários (Top 10)
1. `src/App.tsx` - 2 console.log
2. `src/contexts/AuthContext.tsx` - 3 console.log
3. `src/lib/supabase.ts` - 2 console.error
4. `src/services/chat-history.service.ts` - 5+ console
5. `src/services/notifications.service.ts` - 3+ console
6. `src/hooks/useMonetization.ts` - 2 console
7. `src/components/InstagramAuth.tsx` - 2 console
8. `src/components/ErrorBoundary.tsx` - 1 console.error
9. `src/components/FeedPage.tsx` - 2 console
10. `src/services/posts.service.ts` - 3 console

---

### P1.3 - Corrigir Tipos 'any' no TypeScript
**Impacto:** 🟠 Alto - Type Safety  
**Esforço:** 🔴 Alto (4-8 horas)  
**Arquivos:** 24 arquivos, 50 ocorrências

#### Estratégia

**Fase 1: Priorizar Arquivos Críticos**
```typescript
// src/App.tsx:32 - PRIORITÁRIO
❌ const [selectedGroup, setSelectedGroup] = useState<any>(null);
✅ const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

// src/types/groups.ts - Adicionar tipo
export interface Group {
  id: string;
  name: string;
  description?: string;
  // ... adicionar campos conforme necessário
}
```

**Fase 2: Tipos Comuns**
```typescript
// ❌ Evitar
function handleData(data: any) { ... }
const response: any = await fetch(...);
const [state, setState] = useState<any>({});

// ✅ Corrigir
function handleData(data: Post | Comment | Group) { ... }
const response: ApiResponse<Post[]> = await fetch(...);
const [state, setState] = useState<AppState>({});
```

#### Passos

**Prioridade 1 - Arquivos Core (2h)**
1. `src/App.tsx` - 1 ocorrência
2. `src/contexts/AuthContext.tsx` - tipar user, session
3. `src/lib/supabase.ts` - exportar tipos faltantes
4. `src/types/*.ts` - adicionar tipos faltantes

**Prioridade 2 - Services (3h)**
5. `src/services/chat-history.service.ts` - 5+ any
6. `src/services/groups.service.ts` - tipar responses
7. `src/services/badges.service.ts` - tipar responses
8. `src/services/emotionDetection.service.ts` - tipar ML responses

**Prioridade 3 - Components (3h)**
9. `src/components/groups/*.tsx` - tipar props
10. `src/components/prayers/*.tsx` - tipar props
11. `src/components/journaling/*.tsx` - tipar props

#### Tipos a Criar

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

// src/types/groups.ts
export interface Group {
  id: string;
  name: string;
  description: string;
  cover_image_url?: string;
  member_count: number;
  is_private: boolean;
  created_at: string;
  created_by: string;
}

// src/types/chat-history.ts - melhorar tipos existentes
export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  emotion?: EmotionData;
  context?: ConversationContext;
  created_at: string;
}
```

---

### P1.4 - Implementar TODOs Pendentes
**Impacto:** 🟠 Médio - Funcionalidades Incompletas  
**Esforço:** 🟡 Médio (3-4 horas)

#### TODO 1: Avatar Selector (ProfilePage.tsx)
```typescript
// src/components/ProfilePage.tsx:76, 84
// TODO: Open avatar selector modal

// ✅ IMPLEMENTAR
const [showAvatarModal, setShowAvatarModal] = useState(false);

// Adicionar modal
{showAvatarModal && (
  <AvatarSelectorModal
    currentAvatar={profile?.avatar_url}
    onSelect={(avatarUrl) => {
      updateProfile({ avatar_url: avatarUrl });
      setShowAvatarModal(false);
    }}
    onClose={() => setShowAvatarModal(false)}
  />
)}
```

**Esforço:** 2 horas  
**Arquivos:** `src/components/ProfilePage.tsx`, criar `AvatarSelectorModal.tsx`

#### TODO 2: Upload de Imagem de Capa (CreateGroupModal.tsx)
```typescript
// src/components/groups/CreateGroupModal.tsx:142
// TODO: Upload da imagem de capa se necessário

// ✅ IMPLEMENTAR
const uploadCoverImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `group-covers/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('public')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('public')
    .getPublicUrl(filePath);

  return publicUrl;
};
```

**Esforço:** 2 horas  
**Arquivos:** `src/components/groups/CreateGroupModal.tsx`

---

### P1.5 - Executar npm audit e Corrigir Vulnerabilidades
**Impacto:** 🟠 Alto - Segurança  
**Esforço:** 🟢 Baixo (1 hora)

#### Passos
```bash
# 1. Instalar dependências
npm install

# 2. Verificar vulnerabilidades
npm audit

# 3. Corrigir automaticamente
npm audit fix

# 4. Se houver vulnerabilidades críticas
npm audit fix --force

# 5. Verificar mudanças
git diff package-lock.json

# 6. Testar
npm run typecheck
npm run build
npm test

# 7. Commit
git add package-lock.json
git commit -m "🔒 Security: Fix npm audit vulnerabilities"
```

#### Se houver problemas
```bash
# Reverter e corrigir manualmente
git checkout package-lock.json
npm audit  # Ler relatório completo
# Atualizar pacotes específicos manualmente
```

---

## 🟡 PRIORIDADE 2 - MÉDIA (Fazer ESTE MÊS)

### P2.1 - Aumentar Cobertura de Testes para 80%
**Impacto:** 🟡 Médio - Qualidade e Confiabilidade  
**Esforço:** 🔴 Alto (20-30 horas)

#### Estado Atual
- **Cobertura:** ~9% (10 arquivos de teste)
- **Meta:** 80%
- **Gap:** 71%

#### Estratégia: Testar por Camadas

**Fase 1: Testes Unitários - Hooks (5h)**
```typescript
// src/hooks/__tests__/usePosts.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePosts } from '../usePosts';

describe('usePosts', () => {
  it('deve buscar posts com sucesso', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => usePosts(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(greaterThan(0));
  });
});
```

**Hooks a testar:**
1. ✅ `usePosts.ts` (já existe)
2. ✅ `useQueries.ts` (já existe)
3. ✅ `useWebShare.ts` (já existe)
4. ⚠️ `useMonetization.ts` - CRIAR
5. ⚠️ `useOptimisticLike.ts` - CRIAR
6. ⚠️ `usePWA.ts` - CRIAR
7. ⚠️ `usePerformance.ts` - CRIAR

**Fase 2: Testes de Integração - Services (8h)**
```typescript
// src/services/__tests__/posts.service.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { createPost, getPosts } from '../posts.service';

describe('Posts Service', () => {
  beforeAll(() => {
    // Setup Supabase mock
  });

  it('deve criar post com sucesso', async () => {
    const post = await createPost({
      caption: 'Teste',
      category: 'Fé'
    });
    expect(post).toHaveProperty('id');
  });
});
```

**Services a testar:**
1. ⚠️ `posts.service.ts` - CRIAR
2. ⚠️ `notifications.service.ts` - CRIAR
3. ⚠️ `chat-history.service.ts` - CRIAR
4. ⚠️ `groups.service.ts` - CRIAR
5. ⚠️ `badges.service.ts` - CRIAR

**Fase 3: Testes de Componentes (10h)**
```typescript
// src/components/__tests__/FeedPage.test.tsx
import { render, screen } from '@testing-library/react';
import { FeedPage } from '../FeedPage';

describe('FeedPage', () => {
  it('deve renderizar lista de posts', () => {
    render(<FeedPage />);
    expect(screen.getByText(/feed/i)).toBeInTheDocument();
  });
});
```

**Componentes a testar (Top 10):**
1. ⚠️ `FeedPage.tsx` - CRIAR
2. ⚠️ `InstagramAuth.tsx` - CRIAR
3. ⚠️ `ConversionOnboarding.tsx` - CRIAR
4. ⚠️ `CreatePostModal.tsx` - CRIAR
5. ⚠️ `ProfilePage.tsx` - CRIAR

**Fase 4: Testes E2E - Cypress/Playwright (7h)**
```typescript
// e2e/auth.spec.ts
describe('Fluxo de Autenticação', () => {
  it('deve fazer login com Instagram', () => {
    cy.visit('/');
    cy.get('[data-testid="instagram-login"]').click();
    // ... continuar teste
  });
});
```

**Fluxos críticos:**
1. Autenticação completa
2. Criar post
3. Dar like e comentar
4. Onboarding
5. Notificações

---

### P2.2 - Implementar CI/CD com GitHub Actions
**Impacto:** 🟡 Médio - Automação e Qualidade  
**Esforço:** 🟡 Médio (4 horas)

#### Arquivo: `.github/workflows/ci.yml`
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TypeScript check
        run: npm run typecheck
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run tests
        run: npm run test:run
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  deploy:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

#### Configurar Secrets
```bash
# GitHub → Settings → Secrets → Actions
NETLIFY_AUTH_TOKEN=xxx
NETLIFY_SITE_ID=xxx
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
```

---

### P2.3 - Adicionar Pre-commit Hooks
**Impacto:** 🟡 Médio - Qualidade  
**Esforço:** 🟢 Baixo (1 hora)

#### Instalar Husky
```bash
npm install -D husky lint-staged
npx husky init
```

#### `.husky/pre-commit`
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### `package.json`
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

---

### P2.4 - Documentar APIs e Componentes
**Impacto:** 🟡 Médio - Developer Experience  
**Esforço:** 🔴 Alto (10-15 horas)

#### Storybook para Componentes
```bash
npx storybook@latest init
```

**Exemplo: Button.stories.tsx**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
```

#### Documentar APIs Supabase
```markdown
# docs/API.md

## Posts API

### GET /posts
Retorna lista de posts do feed

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "caption": "string",
      "category": "Fé | Look do dia | ...",
      "image_url": "string",
      "created_at": "timestamp"
    }
  ]
}
```
```

---

### P2.5 - Limpar Branches Antigas
**Impacto:** 🟡 Baixo - Organização  
**Esforço:** 🟢 Baixo (30 min)

#### Branches para Revisar
```
remotes/origin/claude/audit-dependencies-...
remotes/origin/claude/code-audit-review-...
remotes/origin/claude/enterprise-integration-plan-...
remotes/origin/claude/essential-work-...
remotes/origin/claude/test-integration
```

#### Passos
```bash
# 1. Revisar cada branch
git checkout claude/audit-dependencies-...
git log --oneline -10

# 2. Se já mergeado ou desnecessário, deletar
git push origin --delete claude/audit-dependencies-...

# 3. Limpar local
git branch -d claude/audit-dependencies-...
```

---

## 🔵 PRIORIDADE 3 - BAIXA (Próximo Trimestre)

### P3.1 - Implementar Sentry para Error Tracking
**Esforço:** 🟡 Médio (3 horas)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

---

### P3.2 - Implementar Feature Flags
**Esforço:** 🟡 Médio (4 horas)

```typescript
// src/lib/featureFlags.ts
export const features = {
  newOnboarding: import.meta.env.VITE_FEATURE_NEW_ONBOARDING === 'true',
  premiumFeatures: true,
  betaGroups: false,
};
```

---

### P3.3 - Adicionar Monitoramento de Performance
**Esforço:** 🟡 Médio (3 horas)

```typescript
// src/lib/analytics.ts
export const trackPageLoad = (page: string) => {
  const loadTime = performance.now();
  // Enviar para analytics
};
```

---

### P3.4 - Configurar Dependabot
**Esforço:** 🟢 Baixo (30 min)

#### `.github/dependabot.yml`
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

### P3.5 - Adicionar ADRs (Architecture Decision Records)
**Esforço:** 🟢 Baixo (2 horas)

```markdown
# docs/adr/001-use-react-query.md

# ADR 001: Usar React Query para Data Fetching

## Status
Accepted

## Context
Precisamos de uma solução para gerenciar estado do servidor...

## Decision
Usar React Query porque...

## Consequences
- ✅ Cache automático
- ✅ Sincronização de dados
- ⚠️ Learning curve
```

---

## 📅 Cronograma Sugerido

### Semana 1 (23-29 Out)
- **Segunda:** P0.1, P0.2, P0.3 (1-2h)
- **Terça:** P1.1 LoadingSpinner (3h)
- **Quarta:** P1.2 Console.log Parte 1 (4h)
- **Quinta:** P1.2 Console.log Parte 2 (4h)
- **Sexta:** P1.5 npm audit + Testes (2h)

### Semana 2 (30 Out - 5 Nov)
- **Segunda:** P1.3 Tipos 'any' - Core (4h)
- **Terça:** P1.3 Tipos 'any' - Services (4h)
- **Quarta:** P1.3 Tipos 'any' - Components (4h)
- **Quinta:** P1.4 TODOs (4h)
- **Sexta:** Code Review + Ajustes (4h)

### Semana 3-4 (6-19 Nov)
- P2.1 Testes (20-30h distribuídas)
- P2.2 CI/CD (4h)
- P2.3 Pre-commit hooks (1h)
- P2.4 Documentação (10h)
- P2.5 Limpar branches (30min)

### Q1 2026
- P3.* Melhorias de longo prazo

---

## 🎯 Critérios de Sucesso

### ✅ Sprint 1 (P0 + P1) - Esta Semana
- [ ] Zero vulnerabilidades críticas de segurança
- [ ] Zero erros de TypeScript
- [ ] Zero warnings de ESLint
- [ ] LoadingSpinner unificado
- [ ] < 10 console.log no código

### ✅ Sprint 2 (P2) - Este Mês
- [ ] Cobertura de testes > 80%
- [ ] CI/CD funcionando
- [ ] Pre-commit hooks ativos
- [ ] Documentação de componentes (Storybook)
- [ ] Branches limpas

### ✅ Sprint 3 (P3) - Próximo Trimestre
- [ ] Sentry configurado
- [ ] Feature flags implementados
- [ ] Monitoramento de performance
- [ ] Dependabot ativo
- [ ] ADRs documentadas

---

## 📊 Tracking de Progresso

### P0 - CRÍTICO
- [ ] P0.1 - Remover chave hardcoded
- [ ] P0.2 - Corrigir import React
- [ ] P0.3 - Validar ambiente

### P1 - ALTA
- [ ] P1.1 - Consolidar LoadingSpinner
- [ ] P1.2 - Remover console.log
- [ ] P1.3 - Corrigir tipos 'any'
- [ ] P1.4 - Implementar TODOs
- [ ] P1.5 - npm audit

### P2 - MÉDIA
- [ ] P2.1 - Testes (80% cobertura)
- [ ] P2.2 - CI/CD
- [ ] P2.3 - Pre-commit hooks
- [ ] P2.4 - Documentação
- [ ] P2.5 - Limpar branches

### P3 - BAIXA
- [ ] P3.1 - Sentry
- [ ] P3.2 - Feature flags
- [ ] P3.3 - Analytics
- [ ] P3.4 - Dependabot
- [ ] P3.5 - ADRs

---

## 💡 Dicas de Execução

1. **Começar pelo P0:** São rápidos e críticos
2. **Um PR por tarefa P1:** Facilita review
3. **P2 pode ser dividido:** Entre membros do time
4. **P3 não bloqueia:** Pode ser feito em paralelo
5. **Testar sempre:** Antes de marcar como concluído

---

## 📞 Próximos Passos

1. **Revisar este plano com o time** (30 min)
2. **Criar issues no GitHub** para cada tarefa (1h)
3. **Atribuir responsáveis** (15 min)
4. **Começar P0.1 HOJE** (30 min)
5. **Daily standup** para acompanhar progresso

---

**Plano criado por:** Claude (Cursor Agent)  
**Última atualização:** 2025-10-23  
**Revisão sugerida:** Semanal
