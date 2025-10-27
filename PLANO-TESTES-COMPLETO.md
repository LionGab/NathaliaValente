# 🧪 Plano de Testes - ClubNath VIP

## Estratégia Completa de Testes para PWA Mobile

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Pirâmide de Testes](#pirâmide-de-testes)
3. [Testes Unitários](#testes-unitários)
4. [Testes de Integração](#testes-de-integração)
5. [Testes E2E](#testes-e2e)
6. [Testes de Performance](#testes-de-performance)
7. [Testes de Segurança](#testes-de-segurança)
8. [Testes de Acessibilidade](#testes-de-acessibilidade)
9. [Cobertura de Testes](#cobertura-de-testes)
10. [Scripts e Automação](#scripts-e-automação)

---

## Visão Geral

### Status Atual

```
📊 Estatísticas Atuais:
- Arquivos TypeScript: 153
- Arquivos de Teste: 4 (2.6%)
- Total de Testes: 36
- Cobertura Estimada: < 20%
- Taxa de Sucesso: 100% (36/36 passed)
```

### Metas

| Métrica | Atual | Meta (1 mês) | Meta (3 meses) |
|---------|-------|--------------|----------------|
| Cobertura Geral | 20% | 60% | 80% |
| Arquivos de Teste | 4 | 50+ | 100+ |
| Total de Testes | 36 | 200+ | 500+ |
| Testes E2E | 0 | 10+ | 30+ |
| Performance Tests | 0 | 5+ | 15+ |

---

## Pirâmide de Testes

```
           🔺 E2E (10%)
          /  \
         /    \
        /      \
       /________\  
      / Integration \  (30%)
     /              \
    /________________\
   /    Unit Tests    \  (60%)
  /____________________\
```

### Distribuição Recomendada

1. **Testes Unitários (60%)**: Funções, utilities, hooks, componentes isolados
2. **Testes de Integração (30%)**: Interação entre componentes, services com API
3. **Testes E2E (10%)**: Fluxos críticos de usuário

---

## Testes Unitários

### Prioridade CRÍTICA (Semana 1)

#### 1. Core Libraries (3 arquivos)

**1.1 src/lib/config.ts** ⏱️ 4h
```typescript
// tests/lib/config.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configManager, getConfig } from '@/lib/config';

describe('ConfigManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadConfig', () => {
    it('should load config with all required env vars', () => {
      const config = getConfig();
      expect(config.supabase.url).toBeDefined();
      expect(config.supabase.anonKey).toBeDefined();
    });

    it('should throw error if required env var missing', () => {
      vi.stubEnv('VITE_SUPABASE_URL', '');
      expect(() => configManager.loadConfig()).toThrow();
    });

    it('should use default values for optional vars', () => {
      const config = getConfig();
      expect(config.app.url).toBe('https://clubnath.app');
    });

    it('should validate Supabase URL format', () => {
      vi.stubEnv('VITE_SUPABASE_URL', 'http://invalid');
      expect(() => configManager.loadConfig()).toThrow('must be a valid HTTPS URL');
    });
  });

  describe('feature flags', () => {
    it('should return correct feature flag values', () => {
      const config = getConfig();
      expect(config.features.pwa).toBe(true);
    });
  });

  describe('environment detection', () => {
    it('should detect production environment', () => {
      vi.stubEnv('VITE_ENVIRONMENT', 'production');
      expect(configManager.isProduction()).toBe(true);
    });
  });
});
```

**1.2 src/lib/errorHandler.ts** ⏱️ 4h
```typescript
// tests/lib/errorHandler.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { errorHandler, ErrorType } from '@/lib/errorHandler';

describe('ErrorHandler', () => {
  beforeEach(() => {
    errorHandler.clearErrors();
  });

  describe('handleError', () => {
    it('should classify network errors correctly', () => {
      const error = new Error('Network request failed');
      const details = errorHandler.handleError(error);
      
      expect(details.type).toBe(ErrorType.NETWORK);
      expect(details.retryable).toBe(true);
    });

    it('should classify auth errors correctly', () => {
      const error = new Error('Unauthorized access');
      const details = errorHandler.handleError(error);
      
      expect(details.type).toBe(ErrorType.AUTH);
      expect(details.userFriendlyMessage).toContain('login');
    });

    it('should add error to queue', () => {
      const error = new Error('Test error');
      errorHandler.handleError(error);
      
      expect(errorHandler.getErrors()).toHaveLength(1);
    });

    it('should not exceed max queue size', () => {
      for (let i = 0; i < 150; i++) {
        errorHandler.handleError(new Error(`Error ${i}`));
      }
      
      expect(errorHandler.getErrors().length).toBeLessThanOrEqual(100);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should provide helpful message for network errors', () => {
      const error = new Error('fetch failed');
      const details = errorHandler.handleError(error);
      
      expect(details.userFriendlyMessage).toContain('conexão');
    });
  });
});
```

**1.3 src/lib/supabase.ts** ⏱️ 3h
```typescript
// tests/lib/supabase.test.ts
import { describe, it, expect, vi } from 'vitest';
import { supabase } from '@/lib/supabase';

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getSession: vi.fn() },
    from: vi.fn(),
  })),
}));

describe('Supabase Client', () => {
  it('should create client with correct config', () => {
    expect(supabase).toBeDefined();
  });

  it('should have auth methods', () => {
    expect(supabase.auth).toBeDefined();
  });

  it('should have database methods', () => {
    expect(supabase.from).toBeDefined();
  });
});
```

#### 2. Utilities (5 arquivos) ⏱️ 10h

**2.1 src/utils/validation.ts** ✅ Já tem testes!

**2.2 src/utils/imageCache.ts**
```typescript
// tests/utils/imageCache.test.ts
describe('ImageCache', () => {
  it('should cache images', async () => {
    const url = 'https://example.com/image.jpg';
    await imageCache.cache(url);
    expect(imageCache.has(url)).toBe(true);
  });

  it('should handle cache miss', () => {
    expect(imageCache.get('nonexistent')).toBeNull();
  });

  it('should respect cache size limits', () => {
    // Test max cache size
  });
});
```

#### 3. Top 5 Services Críticos ⏱️ 25h

**3.1 services/groups.service.ts** (969 linhas) ⏱️ 8h
```typescript
// tests/services/groups.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { groupsService } from '@/services/groups.service';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase');

describe('GroupsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createGroup', () => {
    it('should create group with valid data', async () => {
      const mockGroup = {
        name: 'Mães de Primeira Viagem',
        description: 'Grupo de apoio',
        type: 'support',
      };

      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockGroup, error: null }),
          }),
        }),
      } as any);

      const result = await groupsService.createGroup(mockGroup);
      expect(result).toEqual(mockGroup);
    });

    it('should validate required fields', async () => {
      await expect(groupsService.createGroup({})).rejects.toThrow();
    });

    it('should handle duplicate group names', async () => {
      // Test unique constraint
    });
  });

  describe('getGroups', () => {
    it('should fetch all groups', async () => {
      // Test
    });

    it('should filter by category', async () => {
      // Test
    });

    it('should paginate results', async () => {
      // Test
    });
  });

  describe('joinGroup', () => {
    it('should add user to group', async () => {
      // Test
    });

    it('should prevent duplicate joins', async () => {
      // Test
    });

    it('should check group capacity', async () => {
      // Test
    });
  });
});
```

**3.2 services/badges.service.ts** (698 linhas) ⏱️ 6h
**3.3 services/notifications.service.ts** ⏱️ 5h
**3.4 services/posts.service.ts** ⏱️ 4h
**3.5 services/prayers.service.ts** ⏱️ 2h

### Prioridade ALTA (Semana 2)

#### 4. Componentes Críticos (10 componentes) ⏱️ 20h

**4.1 components/groups/GroupDetail.tsx** ⏱️ 3h
```typescript
// tests/components/groups/GroupDetail.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupDetail } from '@/components/groups/GroupDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('GroupDetail', () => {
  it('should render group information', () => {
    render(<GroupDetail groupId="123" />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display join button for non-members', async () => {
    render(<GroupDetail groupId="123" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /participar/i })).toBeInTheDocument();
    });
  });

  it('should handle join group action', async () => {
    const user = userEvent.setup();
    render(<GroupDetail groupId="123" />, { wrapper: createWrapper() });
    
    const joinButton = await screen.findByRole('button', { name: /participar/i });
    await user.click(joinButton);
    
    await waitFor(() => {
      expect(screen.getByText(/grupo/i)).toBeInTheDocument();
    });
  });

  it('should handle error states', async () => {
    // Mock error
    render(<GroupDetail groupId="invalid" />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText(/erro/i)).toBeInTheDocument();
    });
  });
});
```

**4.2 components/sos-emotional/SosButton.tsx** ⏱️ 2h
**4.3 components/bible-studies/BibleStudyCard.tsx** ⏱️ 2h
**Demais componentes críticos** ⏱️ 13h

#### 5. Custom Hooks (5 hooks) ⏱️ 10h

**5.1 hooks/useWebShare.ts** ✅ Já tem testes!

**5.2 hooks/useAuth.ts**
```typescript
// tests/hooks/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('should return current user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeDefined();
  });

  it('should login user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).not.toBeNull();
  });

  it('should handle login errors', async () => {
    const { result } = renderHook(() => useAuth());
    
    await expect(
      result.current.login('invalid@example.com', 'wrong')
    ).rejects.toThrow();
  });
});
```

### Resumo Fase 1 (2 semanas)

| Categoria | Arquivos | Esforço | Prioridade |
|-----------|----------|---------|------------|
| Core Libraries | 3 | 11h | 🔴 Crítica |
| Utilities | 5 | 10h | 🔴 Crítica |
| Services | 5 | 25h | 🔴 Crítica |
| Components | 10 | 20h | 🟡 Alta |
| Hooks | 5 | 10h | 🟡 Alta |
| **TOTAL** | **28** | **76h** | **~2 semanas** |

---

## Testes de Integração

### 1. Services + Supabase ⏱️ 15h

```typescript
// tests/integration/groups-with-supabase.test.ts
import { describe, it, expect } from 'vitest';
import { groupsService } from '@/services/groups.service';

describe('Groups Integration', () => {
  it('should create and fetch group', async () => {
    const newGroup = await groupsService.createGroup({
      name: 'Test Group',
      description: 'Integration test',
    });

    const groups = await groupsService.getGroups();
    expect(groups).toContainEqual(newGroup);
  });

  it('should handle concurrent joins', async () => {
    // Test race conditions
  });
});
```

### 2. Component + Service ⏱️ 10h

```typescript
// tests/integration/group-detail-integration.test.tsx
describe('GroupDetail Integration', () => {
  it('should load and display real group data', async () => {
    // Test with real API calls (mocked responses)
  });
});
```

### 3. Authentication Flow ⏱️ 8h

```typescript
// tests/integration/auth-flow.test.ts
describe('Authentication Flow', () => {
  it('should complete full signup flow', async () => {
    // Signup -> Email verification -> Login
  });

  it('should complete password reset flow', async () => {
    // Request reset -> Receive email -> Reset -> Login
  });
});
```

---

## Testes E2E

### Setup Playwright ✅ Já configurado!

### Fluxos Críticos (10 testes) ⏱️ 20h

**1. User Onboarding**
```typescript
// tests/e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('complete user onboarding', async ({ page }) => {
  await page.goto('/');
  
  // Click signup
  await page.click('text=Cadastrar');
  
  // Fill form
  await page.fill('input[name=email]', 'test@example.com');
  await page.fill('input[name=password]', 'SecurePass123!');
  
  // Submit
  await page.click('button[type=submit]');
  
  // Verify redirect
  await expect(page).toHaveURL('/onboarding');
  
  // Complete onboarding steps
  await page.fill('input[name=name]', 'Maria Silva');
  await page.click('text=Continuar');
  
  // Verify success
  await expect(page).toHaveURL('/feed');
});
```

**2. Create Post**
```typescript
// tests/e2e/create-post.spec.ts
test('create new post', async ({ page }) => {
  await page.goto('/feed');
  
  // Click create post
  await page.click('[aria-label="Criar post"]');
  
  // Fill content
  await page.fill('textarea', 'Meu primeiro post!');
  
  // Select category
  await page.selectOption('select[name=category]', 'Desabafo');
  
  // Submit
  await page.click('text=Publicar');
  
  // Verify post appears
  await expect(page.locator('text=Meu primeiro post!')).toBeVisible();
});
```

**3. Join Group**
**4. Send Prayer Request**
**5. Use SOS Emotional Button**
**6. Complete Bible Study**
**7. Search Posts**
**8. Update Profile**
**9. Logout Flow**
**10. PWA Installation**

---

## Testes de Performance

### 1. Lighthouse CI ✅ Já configurado!

### 2. Bundle Size Tests ⏱️ 4h

```typescript
// tests/performance/bundle-size.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { gzipSync } from 'zlib';

describe('Bundle Size', () => {
  it('should be under 500KB (gzipped)', () => {
    const bundle = readFileSync('dist/assets/index.js');
    const gzipped = gzipSync(bundle);
    
    const sizeKB = gzipped.length / 1024;
    expect(sizeKB).toBeLessThan(500);
  });

  it('vendor chunks should be properly split', () => {
    // Check chunk sizes
  });
});
```

### 3. Render Performance ⏱️ 6h

```typescript
// tests/performance/render.test.tsx
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';

describe('Render Performance', () => {
  it('should render feed in < 100ms', () => {
    const start = performance.now();
    render(<Feed />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });

  it('should handle 1000 items efficiently', () => {
    // Test virtual scrolling
  });
});
```

### 4. API Response Time ⏱️ 4h

```typescript
// tests/performance/api.test.ts
describe('API Performance', () => {
  it('should fetch posts in < 200ms', async () => {
    const start = Date.now();
    await groupsService.getGroups();
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(200);
  });
});
```

---

## Testes de Segurança

### 1. XSS Protection ⏱️ 3h

```typescript
// tests/security/xss.test.tsx
describe('XSS Protection', () => {
  it('should sanitize user input', () => {
    const malicious = '<script>alert("XSS")</script>';
    render(<Post content={malicious} />);
    
    expect(screen.queryByRole('script')).not.toBeInTheDocument();
  });
});
```

### 2. CSRF Protection ⏱️ 2h
### 3. Authentication Tests ⏱️ 4h
### 4. Authorization Tests ⏱️ 4h

---

## Testes de Acessibilidade

### 1. ARIA Labels ⏱️ 3h

```typescript
// tests/accessibility/aria.test.tsx
import { axe } from 'jest-axe';

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Keyboard Navigation ⏱️ 4h
### 3. Screen Reader ⏱️ 3h

---

## Cobertura de Testes

### Configuração

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/test/**',
        'src/**/*.d.ts',
      ],
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
});
```

### Gates no CI

```yaml
# .github/workflows/test.yml
- name: Check coverage thresholds
  run: |
    npm run test:coverage
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 60" | bc -l) )); then
      echo "❌ Coverage is below 60%: $COVERAGE%"
      exit 1
    fi
    echo "✅ Coverage: $COVERAGE%"
```

---

## Scripts e Automação

### package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:unit": "vitest run --dir tests/unit",
    "test:integration": "vitest run --dir tests/integration",
    "test:performance": "vitest run --dir tests/performance",
    "test:security": "vitest run --dir tests/security",
    "test:a11y": "vitest run --dir tests/accessibility",
    "test:all": "npm run test:run && npm run test:e2e",
    "test:ci": "npm run test:run && npm run test:e2e && npm run test:coverage"
  }
}
```

### Test Generator Script

```bash
#!/bin/bash
# scripts/generate-test.sh

FILE_PATH=$1
TEST_TYPE=${2:-unit}  # unit, integration, e2e

if [ -z "$FILE_PATH" ]; then
  echo "Usage: ./generate-test.sh <file-path> [test-type]"
  exit 1
fi

# Extract file info
FILENAME=$(basename "$FILE_PATH" .ts)
DIRNAME=$(dirname "$FILE_PATH")

# Create test directory
TEST_DIR="tests/${TEST_TYPE}/${DIRNAME}"
mkdir -p "$TEST_DIR"

# Generate test file
TEST_FILE="${TEST_DIR}/${FILENAME}.test.ts"

cat > "$TEST_FILE" <<EOF
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ${FILENAME} } from '@/${FILE_PATH}';

describe('${FILENAME}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TODO', () => {
    it('should TODO', () => {
      // Arrange
      
      // Act
      
      // Assert
      expect(true).toBe(true);
    });
  });
});
EOF

echo "✅ Test file created: $TEST_FILE"
code "$TEST_FILE"
```

### Coverage Report Generator

```bash
#!/bin/bash
# scripts/coverage-report.sh

echo "📊 Gerando relatório de cobertura..."

npm run test:coverage

echo ""
echo "📈 Estatísticas de Cobertura:"
cat coverage/coverage-summary.json | jq '.total'

echo ""
echo "🔍 Arquivos com baixa cobertura (< 50%):"
cat coverage/coverage-summary.json | jq -r '
  to_entries[] | 
  select(.value.lines.pct < 50) | 
  "\(.key): \(.value.lines.pct)%"
'

echo ""
echo "📄 Relatório completo: coverage/index.html"
open coverage/index.html
```

---

## Checklist de Implementação

### Fase 1: Fundação (Semana 1-2) ✅ Meta: 40% cobertura

- [ ] Configurar MSW para mocks
- [ ] Testar `lib/config.ts`
- [ ] Testar `lib/errorHandler.ts`
- [ ] Testar `lib/supabase.ts`
- [ ] Testar top 5 utilities
- [ ] Testar top 5 services críticos
- [ ] Configurar coverage gates no CI
- [ ] Documentar padrões de teste

### Fase 2: Expansão (Semana 3-4) ✅ Meta: 60% cobertura

- [ ] Testar 10 componentes críticos
- [ ] Testar 5 custom hooks
- [ ] Adicionar 5 testes de integração
- [ ] Adicionar 5 testes E2E
- [ ] Testes de performance (3 suítes)
- [ ] Testes de segurança (4 suítes)

### Fase 3: Excelência (Mês 2) ✅ Meta: 80% cobertura

- [ ] Completar cobertura de todos services
- [ ] Completar cobertura de todos componentes
- [ ] 10 testes E2E completos
- [ ] Testes de acessibilidade
- [ ] Visual regression tests
- [ ] Stress tests

---

## 📊 Métricas de Sucesso

| Métrica | Baseline | Meta 1 mês | Meta 3 meses |
|---------|----------|------------|--------------|
| Cobertura Total | 20% | 60% | 80% |
| Testes Unitários | 36 | 200+ | 400+ |
| Testes Integração | 0 | 15+ | 40+ |
| Testes E2E | 0 | 10+ | 25+ |
| Falhas em Produção | ? | -50% | -80% |
| Bugs Detectados Pré-Deploy | ? | 90% | 95% |

---

## 🎯 Conclusão

### Investimento Total

- **Fase 1 (2 semanas)**: 76 horas
- **Fase 2 (2 semanas)**: 50 horas
- **Fase 3 (4 semanas)**: 80 horas
- **Total**: ~206 horas (~5 semanas)

### ROI Esperado

- ✅ Redução de bugs em produção: 80%
- ✅ Tempo de debugging: -60%
- ✅ Confiança para refactoring: +100%
- ✅ Velocity do time: +30%
- ✅ Qualidade do código: +50%

---

**Última atualização**: Outubro 2025  
**Responsável**: Equipe de Qualidade  
**Próxima revisão**: Novembro 2025
