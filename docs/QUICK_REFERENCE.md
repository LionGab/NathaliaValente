# 📖 Guia Rápido de Boas Práticas - ClubNath

## 🎯 Princípios Fundamentais

### 1. **TypeScript First**
```typescript
// ❌ NUNCA
const data: any = ...;

// ✅ SEMPRE
interface UserData {
  id: string;
  name: string;
}
const data: UserData = ...;
```

### 2. **Segurança em Primeiro Lugar**
```typescript
// ❌ NUNCA hardcode credenciais
const apiKey = 'abc123';

// ✅ SEMPRE use env vars
const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) throw new Error('API key missing');
```

### 3. **Validação e Sanitização**
```typescript
// ❌ NUNCA confie em input do usuário
const post = await create({ caption: userInput });

// ✅ SEMPRE valide e sanitize
const validation = validatePost({ caption: userInput });
if (!validation.isValid) {
  return { error: validation.errors };
}
const post = await create(validation.cleanData);
```

---

## 🔐 Checklist de Segurança

### Antes de Commitar
- [ ] Nenhuma credencial hardcoded
- [ ] Todos inputs validados e sanitizados
- [ ] Erros não expõem informações sensíveis
- [ ] URLs validadas (sem `javascript:`, `data:`)
- [ ] Rate limiting implementado em actions críticas

### Antes de Deploy
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase RLS policies revisadas
- [ ] HTTPS habilitado
- [ ] Security headers configurados
- [ ] Auditoria de dependências (`npm audit`)

---

## ⚡ Performance Checklist

### Componentes
- [ ] Lazy loading para rotas
- [ ] `React.memo` para componentes pesados
- [ ] `useMemo`/`useCallback` para computações caras
- [ ] Virtualização para listas longas (>100 items)

### Imagens
- [ ] Lazy loading (`loading="lazy"`)
- [ ] Compressão antes de upload
- [ ] Thumbnails para previews
- [ ] WebP quando possível

### Queries
- [ ] React Query para cache
- [ ] Paginação ao invés de scroll infinito
- [ ] Debounce em search inputs
- [ ] RPC functions ao invés de N+1 queries

---

## 🎨 Padrões de Código

### Nomenclatura
```typescript
// Components: PascalCase
export function UserProfile() {}

// Hooks: camelCase com prefixo 'use'
export function useAuth() {}

// Types/Interfaces: PascalCase
interface UserData {}
type Status = 'active' | 'inactive';

// Constants: SCREAMING_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// Functions: camelCase
export async function fetchUserPosts() {}

// Files: kebab-case ou PascalCase
// user-profile.tsx ou UserProfile.tsx
```

### Estrutura de Arquivo
```typescript
// 1. Imports de bibliotecas
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// 2. Imports de types
import type { User, Post } from '@/types';

// 3. Imports de components
import { Button } from '@/components/ui/Button';

// 4. Imports de utils
import { formatDate } from '@/utils/formatting';

// 5. Constants locais
const DEFAULT_PAGE_SIZE = 20;

// 6. Interfaces/Types locais
interface Props {
  userId: string;
}

// 7. Component/Function
export function UserPosts({ userId }: Props) {
  // ...
}
```

---

## 🧪 Testes

### Estrutura de Teste
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  beforeEach(() => {
    // Setup
  });

  it('renders user name', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Mock error
    render(<UserProfile userId="invalid" />);
    await waitFor(() => {
      expect(screen.getByText(/erro/i)).toBeInTheDocument();
    });
  });
});
```

### O Que Testar
- ✅ Business logic (services, utils)
- ✅ Validações
- ✅ Transformações de dados
- ✅ Error handling
- ❌ Boilerplate do framework
- ❌ Estilos CSS
- ❌ Bibliotecas de terceiros

---

## 📝 Commits

### Conventional Commits
```bash
# Features
git commit -m "feat: adiciona upload de imagens"
git commit -m "feat(posts): adiciona filtro por categoria"

# Fixes
git commit -m "fix: corrige validação de email"
git commit -m "fix(auth): resolve loop infinito no login"

# Refactoring
git commit -m "refactor: extrai validação para service"
git commit -m "refactor(ui): simplifica componente Button"

# Security
git commit -m "security: remove credenciais hardcoded"
git commit -m "security: adiciona sanitização HTML"

# Performance
git commit -m "perf: adiciona lazy loading em imagens"
git commit -m "perf(feed): otimiza query com RPC"

# Documentation
git commit -m "docs: atualiza guia de segurança"

# Tests
git commit -m "test: adiciona testes para validatePost"

# Chores
git commit -m "chore: atualiza dependências"
git commit -m "chore: configura pre-commit hooks"
```

---

## 🚨 Red Flags (O Que NUNCA Fazer)

### 🔴 CRÍTICO
- ❌ Commitar credenciais ou secrets
- ❌ Desabilitar TypeScript strict mode
- ❌ Usar `eval()` ou `Function()` com input de usuário
- ❌ SQL injection (sempre use prepared statements/ORMs)
- ❌ Expor stack traces em produção

### 🟠 ALTO
- ❌ Ignorar erros silenciosamente (`try/catch` vazio)
- ❌ Usar `any` quando tipo é conhecido
- ❌ Fazer requests sem rate limiting
- ❌ Carregar imagens sem otimização
- ❌ Não validar inputs de formulário

### 🟡 MÉDIO
- ❌ Console.log em código de produção
- ❌ Variáveis não utilizadas
- ❌ Imports não utilizados
- ❌ Comentários de código antigo
- ❌ Nomes de variáveis não descritivos

---

## 🎯 Code Review Checklist

### Como Revisor
- [ ] Código segue padrões do projeto
- [ ] Não há vulnerabilidades de segurança
- [ ] Testes cobrem casos críticos
- [ ] Documentação atualizada se necessário
- [ ] Performance não foi degradada
- [ ] Acessibilidade mantida/melhorada
- [ ] Código é legível e auto-explicativo
- [ ] Não há duplicação desnecessária

### Como Autor
- [ ] Executou linter sem erros
- [ ] Executou type check sem erros
- [ ] Todos testes passando
- [ ] Testou manualmente a funcionalidade
- [ ] PR description explica o "porquê"
- [ ] Commits são atômicos e bem descritos
- [ ] Screenshots para mudanças visuais
- [ ] Breaking changes documentadas

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                 # Inicia dev server
npm run build              # Build produção
npm run preview            # Preview build

# Qualidade
npm run lint               # ESLint
npm run lint -- --fix      # Auto-fix lint issues
npm run typecheck          # TypeScript check
npm run format             # Prettier format
npm run format:check       # Check formatting

# Testes
npm run test               # Run tests (watch mode)
npm run test:run           # Run tests (once)
npm run test:coverage      # Coverage report
npm run test:ui            # Vitest UI

# Git
git status                 # Check status
git add .                  # Stage all changes
git commit -m "msg"        # Commit
git push                   # Push to remote
git pull                   # Pull from remote

# Supabase (local)
supabase start             # Start local Supabase
supabase stop              # Stop local Supabase
supabase status            # Check status
supabase db reset          # Reset database
```

---

## 📚 Recursos Essenciais

### Documentação
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev)

### Ferramentas
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Supabase Studio](https://supabase.com/dashboard)

### Learning
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [JavaScript.info](https://javascript.info/)
- [Web.dev](https://web.dev/)

---

## 💡 Dicas Rápidas

### TypeScript
```typescript
// Use type inference quando óbvio
const count = 0; // number implícito
const name = 'John'; // string implícito

// Declare tipos quando necessário
const [user, setUser] = useState<User | null>(null);

// Use generics para reutilização
function identity<T>(arg: T): T {
  return arg;
}

// Prefira interfaces para objects
interface User {
  id: string;
  name: string;
}

// Prefira types para unions/intersections
type Status = 'idle' | 'loading' | 'success' | 'error';
```

### React
```typescript
// Extraia lógica complexa para hooks
function useUserPosts(userId: string) {
  // ... lógica
  return { posts, loading, error };
}

// Use React.memo para componentes pesados
export const HeavyComponent = React.memo(({ data }) => {
  // ... renderização pesada
});

// Evite inline functions em props
// ❌ Causa re-render
<Button onClick={() => doSomething()} />

// ✅ Não causa re-render
const handleClick = useCallback(() => doSomething(), []);
<Button onClick={handleClick} />
```

### Performance
```typescript
// Debounce para search
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    performSearch(debouncedSearch);
  }
}, [debouncedSearch]);

// Lazy load componentes pesados
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 🎓 Próximos Passos

1. **Leia a documentação completa:**
   - [CODE_REVIEW.md](./CODE_REVIEW.md) - Análise detalhada
   - [SECURITY_FIXES.md](./SECURITY_FIXES.md) - Correções de segurança
   - [TYPESCRIPT_FIXES.md](./TYPESCRIPT_FIXES.md) - Correções TypeScript

2. **Implemente as correções prioritárias:**
   - Fase 1: Segurança (CRÍTICO)
   - Fase 2: TypeScript (ALTO)
   - Fase 3: Performance (MÉDIO)

3. **Configure ferramentas de qualidade:**
   - Pre-commit hooks
   - CI/CD com checks automáticos
   - Code coverage mínimo

4. **Mantenha-se atualizado:**
   - Review periódico de dependências
   - Atualização de práticas de segurança
   - Refatoração contínua

---

**Última Atualização:** 2025-10-27  
**Versão:** 1.0  
**Mantido por:** GitHub Copilot Code Review Agent
