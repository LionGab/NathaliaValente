# ClubNath VIP - React PWA + Supabase

## 🚨 REGRAS CRÍTICAS

- NUNCA edite arquivos em src/legacy/ (se existir)
- NUNCA faça commit direto na main
- SEMPRE rode testes antes de commitar
- NÃO modifique package.json sem aprovação explícita
- NÃO crie arquivos duplicados (Component2, utilsNew, etc)
- NUNCA remova funcionalidades premium existentes
- SEMPRE use logger.dev() ao invés de console.log()

## 🎯 CONTEXTO DO PROJETO

### Tech Stack REAL
- **Framework:** React 18.3 (Web, não mobile)
- **Build Tool:** Vite 7.1.11
- **Linguagem:** TypeScript 5.5.3 (strict mode)
- **Backend:** Supabase (auth, database, realtime, storage)
- **State:** React Query (TanStack Query) + Context API
- **Styling:** TailwindCSS 3.4.1
- **PWA:** Vite PWA Plugin + Service Worker
- **Forms:** React Hook Form + Zod (se necessário)
- **Testes:** Vitest + React Testing Library + Playwright
- **Deploy:** Netlify

### Tipo de Aplicação
- ✅ **Progressive Web App (PWA)** - Pode ser instalada no celular
- ✅ **Single Page Application (SPA)** - React Web
- ❌ **NÃO é React Native** - Não usa Expo ou React Navigation
- ❌ **NÃO é app nativo** - Roda no navegador

### Estrutura do Projeto
```
src/
├── components/         # Componentes React reutilizáveis
│   ├── ui/            # Design system (Button, Input, Card, etc)
│   ├── onboarding/    # Fluxo de onboarding
│   ├── groups/        # Grupos
│   ├── prayers/       # Orações
│   ├── journaling/    # Diário
│   ├── badges/        # Sistema de badges
│   ├── bible-studies/ # Estudos bíblicos
│   ├── chat/          # Chat com IA
│   └── sos-emotional/ # SOS Emocional
├── contexts/          # Context providers (Auth, Theme, Cart, Query)
├── hooks/             # React hooks customizados
├── services/          # Lógica de negócio e API calls
├── lib/               # Bibliotecas e configurações
│   ├── supabase.ts    # Cliente Supabase
│   ├── sentry.ts      # Error monitoring
│   └── utils.ts       # Utilitários
├── types/             # TypeScript types globais
├── utils/             # Funções utilitárias
│   └── logger.ts      # Logger service (USE AO INVÉS DE console.log)
├── layouts/           # Layouts responsivos
└── data/              # Mock data e constantes
```

## 🔧 PADRÕES DE DESENVOLVIMENTO

### Componentes React

```typescript
// ✅ CORRETO - Componente funcional com TypeScript
interface ButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  variant = 'primary',
  loading,
  children
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-pink-500 hover:bg-pink-600 text-white',
        variant === 'secondary' && 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        variant === 'danger' && 'bg-red-500 hover:bg-red-600 text-white',
        loading && 'opacity-50 cursor-not-allowed'
      )}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};

// ❌ ERRADO
const Button = (props) => { /* sem tipos */ }
const Button = () => <div style={{...}} /> // inline styles
```

### Integração com Supabase

```typescript
// ✅ CORRETO - React Query hook
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/supabase';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: Omit<Post, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// ❌ ERRADO - Fetch direto no componente
const posts = await supabase.from('posts').select(); // sem error handling
```

### Logging (NÃO use console.log)

```typescript
// ✅ CORRETO - Usar logger service
import { logger } from '@/utils/logger';

function MyComponent() {
  const handleClick = () => {
    logger.dev('[MyComponent] Button clicked', { userId: user.id });
    // Só aparece em desenvolvimento
  };

  try {
    // ...
  } catch (error) {
    logger.error('[MyComponent] Failed to save', error);
    // Sempre logado, será enviado para Sentry em produção
  }
}

// ❌ ERRADO - console.log em produção
console.log('Debug info:', data); // Removido no build, mas ruim para manutenção
```

### Tratamento de Erros

```typescript
// ✅ CORRETO - Error handling completo
import { logger } from '@/utils/logger';

async function createPost(data: NewPost) {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert(data)
      .select()
      .single();

    if (error) throw error;

    logger.dev('[Posts] Post created', { postId: post.id });
    return post;
  } catch (error) {
    logger.error('[Posts] Failed to create post', error);

    if (error instanceof Error) {
      throw new Error(`Erro ao criar post: ${error.message}`);
    }
    throw new Error('Erro desconhecido ao criar post');
  }
}

// ❌ ERRADO - Sem error handling
const data = await supabase.from('posts').insert(newPost);
return data; // E se der erro?
```

### TypeScript - Evitar 'any'

```typescript
// ✅ CORRETO - Tipos específicos
interface User {
  id: string;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);
const [posts, setPosts] = useState<Post[]>([]);

// Use 'unknown' quando tipo for realmente desconhecido
function handleApiResponse(response: unknown) {
  if (isPost(response)) {
    // Type guard
    return response.title;
  }
}

// ❌ ERRADO - Usar 'any'
const [user, setUser] = useState<any>(null);
const [data, setData] = useState<any>({});
function handle(data: any) { }
```

## 📋 COMANDOS

### Desenvolvimento
```bash
npm run dev          # Inicia servidor dev (http://localhost:5173)
npm run build        # Build de produção
npm run preview      # Preview do build local
```

### Qualidade de Código
```bash
npm run typecheck    # Verificar TypeScript
npm run lint         # ESLint
npm run format       # Prettier (formatar)
npm run format:check # Verificar formatação
```

### Testes
```bash
npm test             # Testes em watch mode
npm run test:run     # Executar todos os testes
npm run test:coverage # Testes com cobertura
npm run test:e2e     # Testes E2E (Playwright)
npm run test:all     # Todos os testes (unit + e2e)
```

### Git Workflow
- Branch: `feature/TASK-123-descricao` ou `fix/TASK-123-descricao`
- Commit: `[TASK-123] Descrição das mudanças`
- SEMPRE criar PR para review
- CI deve passar antes de merge

## 🐛 PROBLEMAS CONHECIDOS

### Performance
- Lazy loading já implementado para páginas principais
- React Query com cache automático
- Service Worker com estratégia de cache

### Build
- Bundle target: ES2020 (navegadores modernos)
- Code splitting automático por rota
- Compression: Gzip + Brotli

### PWA
- Instalar prompt automático
- Offline support configurado
- Service Worker atualiza automaticamente

## 🔒 SEGURANÇA

### Variáveis de Ambiente
```typescript
// ✅ SEMPRE use variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação obrigatória
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configuração do Supabase ausente');
}

// ❌ NUNCA hardcode secrets
const key = 'eyJhbG...'; // ERRADO!
```

### Checklist de Segurança
- ✅ NUNCA commite arquivos .env
- ✅ API keys via environment variables apenas
- ✅ Valide TODOS os inputs de usuário
- ✅ Use Zod para validação de schemas
- ✅ Sanitize dados antes de renderizar
- ✅ RLS (Row Level Security) ativo no Supabase

## 📱 RESPONSIVIDADE

### Breakpoints (TailwindCSS)
```typescript
// Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
  {/*
    Mobile: width 100%
    Tablet (md): width 50%
    Desktop (lg): width 33.3%
  */}
</div>

// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### Layouts
- `MobileLayout` - < 768px
- `TabletLayout` - 768px - 1024px
- `DesktopLayout` - > 1024px
- `ResponsiveLayout` - Wrapper que escolhe automaticamente

## ⚠️ INSTRUÇÕES ESPECÍFICAS PARA CLAUDE

### Ao implementar features:

1. **SEMPRE verifique se funcionalidade similar já existe**
   ```bash
   # Buscar componentes existentes
   find src/components -name "*Post*"

   # Buscar hooks
   find src/hooks -name "use*"
   ```

2. **Reutilize componentes e hooks existentes**
   - Componentes UI em `src/components/ui/`
   - Hooks em `src/hooks/`
   - Services em `src/services/`

3. **Siga os padrões estabelecidos rigorosamente**
   - TypeScript strict mode
   - React Query para data fetching
   - Logger service ao invés de console.log
   - Error boundaries para componentes

4. **Inclua tipos TypeScript para tudo**
   ```typescript
   // Sempre exporte tipos
   export interface ComponentProps {
     // ...
   }
   ```

5. **Adicione JSDoc comments para funções exportadas**
   ```typescript
   /**
    * Hook para buscar posts do feed
    * @returns Query com lista de posts
    */
   export function usePosts() {
     // ...
   }
   ```

6. **Escreva testes junto com implementação**
   ```typescript
   // src/hooks/usePosts.ts
   // src/hooks/__tests__/usePosts.test.ts (criar junto)
   ```

7. **Pergunte se algo não está claro nos requisitos**

8. **Para navegação, teste que funciona no build de produção**

9. **Para APIs, use React Query, não fetch/axios direto**

10. **NUNCA deixe console.log em código de produção**
    - Use `logger.dev()` que já remove automaticamente

11. **ANTES de criar arquivo novo, verifique se similar já existe**
    ```bash
    # Buscar antes de criar
    find src -name "*Similar*"
    grep -r "function similar" src/
    ```

12. **MANTENHA funcionalidades premium existentes**
    - Sistema de badges
    - Assinaturas
    - Conteúdo exclusivo

13. **FOQUE em UX mobile-first**
    - PWA instalável
    - Offline support
    - Touch-friendly
    - Rápido e responsivo

## 🧪 TESTES

### Estrutura de Testes
```typescript
// src/hooks/__tests__/usePosts.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePosts } from '../usePosts';

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

describe('usePosts', () => {
  it('deve buscar posts com sucesso', async () => {
    const { result } = renderHook(() => usePosts(), {
      wrapper: createWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

### Cobertura Mínima
- **Target:** 70% (branches, functions, lines, statements)
- **Crítico:** Auth, Posts, Payments
- **E2E:** Login, Create Post, Subscribe

## 🚀 DEPLOY

### Netlify (Produção)
```bash
# Deploy automático via GitHub Actions
git push origin main

# Deploy manual (se necessário)
npm run build
netlify deploy --prod
```

### Variáveis de Ambiente (Netlify)
```
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=[chave_anon]
VITE_SENTRY_DSN=[opcional]
VITE_APP_URL=https://clubnath.netlify.app
VITE_ENV=production
```

## 📊 MÉTRICAS DE QUALIDADE

### Targets
- TypeScript: 0 errors
- ESLint: 0 critical warnings
- Test Coverage: > 70%
- Lighthouse Performance: > 90
- Bundle Size: < 200KB
- FCP: < 1.5s
- TTI: < 3.0s

## 📚 RECURSOS

### Documentação do Projeto
- `README.md` - Visão geral
- `TESTING.md` - Estratégia de testes
- `SECURITY.md` - Guia de segurança
- `DATABASE.md` - Arquitetura do banco
- `docs/` - Documentação detalhada

### Tecnologias
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [Supabase](https://supabase.com/docs)
- [React Query](https://tanstack.com/query)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

## 🎓 EXEMPLO COMPLETO

### Feature: Criar Post

```typescript
// 1. Tipo (src/types/post.ts)
export interface Post {
  id: string;
  user_id: string;
  caption: string;
  category: 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe';
  image_url?: string;
  created_at: string;
}

export type NewPost = Omit<Post, 'id' | 'created_at'>;

// 2. Service (src/services/posts.service.ts)
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';
import type { Post, NewPost } from '@/types/post';

export async function createPost(data: NewPost): Promise<Post> {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert(data)
      .select('*, profiles(*)')
      .single();

    if (error) throw error;

    logger.dev('[Posts] Created', { postId: post.id });
    return post;
  } catch (error) {
    logger.error('[Posts] Create failed', error);
    throw error;
  }
}

// 3. Hook (src/hooks/usePosts.ts)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '@/services/posts.service';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// 4. Componente (src/components/CreatePostModal.tsx)
import { useCreatePost } from '@/hooks/usePosts';
import { Button } from '@/components/ui/Button';
import { logger } from '@/utils/logger';

export function CreatePostModal() {
  const createPost = useCreatePost();

  const handleSubmit = async (data: NewPost) => {
    try {
      await createPost.mutateAsync(data);
      logger.dev('[CreatePost] Success');
      onClose();
    } catch (error) {
      logger.error('[CreatePost] Failed', error);
      // Show error toast
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" loading={createPost.isPending}>
        Criar Post
      </Button>
    </form>
  );
}

// 5. Teste (src/hooks/__tests__/usePosts.test.ts)
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreatePost } from '../usePosts';

describe('useCreatePost', () => {
  it('deve criar post com sucesso', async () => {
    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper()
    });

    await result.current.mutateAsync({
      user_id: 'test',
      caption: 'Test post',
      category: 'Fé'
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

---

**Última atualização:** 27 de Outubro de 2025
**Stack:** React 18 + Vite 7 + TypeScript 5.5 + Supabase + PWA
**Tipo:** Progressive Web App (não React Native)
