<!-- 97804c8e-1f52-4ba9-9970-6913bf4705bf 295c6a6f-c1bc-46c4-9ee0-422a60d659b7 -->
# Plano de Correção ClubNath VIP

## FASE 1: CRÍTICO - DIA 1 (4-6 horas)

### 1.1 Implementar Validação de Inputs com Zod

**Arquivos:** `src/features/products/validation.ts`, `src/features/routines/validation.ts`

Criar schemas de validação:

```typescript
// src/features/products/validation.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive().max(999999),
  stock: z.number().int().nonnegative(),
});

// src/features/routines/validation.ts
export const routineSchema = z.object({
  title: z.string().min(1).max(30),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
  icon: z.enum(['feeding', 'bathing', 'sleeping', 'activities']),
});
```

Aplicar em formulários existentes:

- `src/components/CreateRoutineModal.tsx`
- `src/features/products/components/ProductForm.tsx`

### 1.2 Configurar Row Level Security (RLS) no Supabase

**Arquivos:** `supabase/migrations/20250127_enable_rls.sql`

```sql
-- Habilitar RLS em todas as tabelas críticas
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users view own routines" ON routines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own routines" ON routines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own routines" ON routines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own routines" ON routines FOR DELETE USING (auth.uid() = user_id);
```

### 1.3 Adicionar Variáveis de Ambiente

**Arquivos:** `.env.example`, verificar `.gitignore`

Garantir que nenhuma chave está hardcoded em:

- `src/lib/supabase.ts`
- `src/config/*`

## FASE 2: ALTA PRIORIDADE - SEMANA 1 (16-20 horas)

### 2.1 Otimizar Bundle Size

**Meta:** Reduzir de 1.2MB para <600KB

**Ações:**

1. Implementar lazy loading em rotas:
```typescript
// src/App.tsx
const FeedPage = lazy(() => import('./components/FeedPage'));
const StorePage = lazy(() => import('./components/StorePage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
```

2. Otimizar imports de Lucide React:
```typescript
// Antes:
import { Heart, Share, ... } from 'lucide-react';
// Depois:
import Heart from 'lucide-react/dist/esm/icons/heart';
import Share from 'lucide-react/dist/esm/icons/share';
```

3. Adicionar dynamic imports para modais:
```typescript
// src/components/FeedPage.tsx
const CreatePostModal = lazy(() => import('./CreatePostModal'));
```


### 2.2 Implementar Suite de Testes Essenciais

**Coverage meta:** 60% em features críticas

**Testes Unitários:**

```typescript
// src/features/products/__tests__/productService.test.ts
describe('productService', () => {
  it('deve retornar produtos válidos', async () => {
    const products = await productService.getProducts();
    expect(products).toBeInstanceOf(Array);
    expect(products[0]).toHaveProperty('id');
  });
  
  it('deve validar estoque zero', () => {
    const product = { ...mockProduct, stock: 0 };
    expect(isOutOfStock(product)).toBe(true);
  });
});
```

**Testes de Integração:**

```typescript
// src/features/routines/__tests__/useRoutines.integration.test.ts
describe('useRoutines integration', () => {
  it('deve criar e sincronizar rotina offline', async () => {
    const { result } = renderHook(() => useCreateRoutine());
    await act(() => result.current.mutateAsync(mockRoutine));
    expect(localStorage.getItem('routines')).toContain(mockRoutine.id);
  });
});
```

**Testes E2E (Playwright):**

```typescript
// tests/e2e/products.spec.ts
test('deve navegar entre produtos via teclado', async ({ page }) => {
  await page.goto('/products');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'product-1');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'product-2');
});
```

### 2.3 Melhorar Performance - Core Web Vitals

**Arquivos:** `src/components/ui/OptimizedImage.tsx` (já criado)

1. Substituir todas as tags `<img>` por `<OptimizedImage>`:

   - `src/features/home/components/ProductPreview.tsx` (já feito)
   - `src/components/NAVAHeroSection.tsx`
   - `src/components/StorePage.tsx`

2. Adicionar skeletons loading:

   - `src/components/FeedPage.tsx` - usar `ProductCardSkeleton`
   - `src/components/RoutineCalendar.tsx` - usar `RoutineCardSkeleton`

3. Implementar preload de rotas críticas:
```typescript
// src/App.tsx
const preloadRoutes = () => {
  import('./components/StorePage');
  import('./components/ProfilePage');
};
```


## FASE 3: MÉDIO PRAZO - SEMANAS 2-3 (24-30 horas)

### 3.1 Implementar Acessibilidade WCAG 2.1 AA

**Meta:** Score 100 no Lighthouse Accessibility

1. Adicionar skip navigation:
```typescript
// src/components/SkipNavigation.tsx
export const SkipNavigation = () => (
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg">
    Pular para conteúdo principal
  </a>
);
```

2. Melhorar contraste de cores:

   - Validar todas as combinações no `src/shared/design-tokens.ts`
   - Garantir ratio mínimo 4.5:1 para textos

3. Adicionar aria-labels:
```typescript
// src/components/ui/AccessibleButton.tsx (já criado)
// Aplicar em todos os botões com apenas ícones
<button aria-label="Fechar modal">
  <X className="w-5 h-5" />
</button>
```

4. Implementar live regions para notificações:
```typescript
// src/components/Toast.tsx
<div role="alert" aria-live="polite" aria-atomic="true">
  {message}
</div>
```


### 3.2 Refatorar Código Duplicado

**Alvos principais:**

1. Consolidar lógica de validação:

   - Criar `src/utils/validators.ts`
   - Extrair validações repetidas

2. Criar hooks customizados compartilhados:

   - `src/hooks/useForm.ts` - lógica de formulário
   - `src/hooks/useAsync.ts` - estados async

3. Refatorar FeedPage.tsx (331 linhas):

   - Extrair `HeroSection` para componente separado
   - Extrair `CommunityStats` para componente separado
   - Reduzir para <200 linhas

### 3.3 Melhorar PWA - Offline First

**Arquivos:** `vite.config.ts` (já configurado), adicionar fallback

1. Criar página offline:
```typescript
// src/pages/Offline.tsx
export const OfflinePage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1>Você está offline</h1>
    <p>Algumas funcionalidades estão limitadas</p>
  </div>
);
```

2. Adicionar network status indicator:
```typescript
// src/components/NetworkStatus.tsx
export const NetworkStatus = () => {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center z-50">
      Você está offline. Algumas funcionalidades estão limitadas.
    </div>
  );
};
```

3. Implementar queue de sincronização:
```typescript
// src/services/sync-queue.service.ts
export const syncQueueService = {
  async processQueue() {
    const queue = await getSyncQueue();
    for (const item of queue) {
      try {
        await syncItem(item);
        await removeFromQueue(item.id);
      } catch (error) {
        // Retry later
      }
    }
  }
};
```


### 3.4 Integrar Design Tokens

**Arquivos:** `src/shared/design-tokens.ts` (já criado)

1. Atualizar `tailwind.config.js`:
```javascript
import { tokens } from './src/shared/design-tokens';

export default {
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      fontSize: tokens.typography.fontSize,
    }
  }
};
```

2. Criar utilitário de uso:
```typescript
// src/utils/use-tokens.ts
export const useTokens = () => tokens;
```

3. Migrar classes hardcoded para tokens:

   - Buscar `bg-purple-600` → usar `bg-primary-600`
   - Buscar `text-pink-500` → usar `text-secondary-500`

## VALIDAÇÃO E DEPLOYMENT

### Checklist Final:

- [ ] npm audit = 0 vulnerabilidades
- [ ] Test coverage > 60%
- [ ] Lighthouse Performance > 85
- [ ] Lighthouse Accessibility = 100
- [ ] Bundle size < 600KB
- [ ] LCP < 2.5s
- [ ] Todos os formulários com validação Zod
- [ ] RLS habilitado em todas as tabelas
- [ ] PWA score = 100

### Comandos de Validação:

```bash
npm run test:coverage
npm run build
npm run test:e2e
npm audit
```

### To-dos

- [ ] Implementar validação Zod em formulários (routines, products)
- [ ] Configurar Row Level Security no Supabase
- [ ] Verificar e proteger variáveis de ambiente
- [ ] Otimizar bundle size com lazy loading e tree shaking
- [ ] Implementar suite de testes (unit, integration, E2E)
- [ ] Melhorar Core Web Vitals com OptimizedImage e skeletons
- [ ] Implementar acessibilidade WCAG 2.1 AA
- [ ] Refatorar código duplicado e componentes grandes
- [ ] Melhorar PWA com offline-first e sync queue
- [ ] Integrar design tokens no Tailwind e componentes