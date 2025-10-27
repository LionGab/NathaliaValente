# Guia Prático de Melhorias de Código

Este documento fornece exemplos práticos de código aprimorado para os problemas mais comuns identificados no projeto ClubNath VIP.

---

## 📑 Índice

1. [Substituindo `any` por Tipos Específicos](#1-substituindo-any-por-tipos-específicos)
2. [Corrigindo Dependências em useEffect](#2-corrigindo-dependências-em-useeffect)
3. [Removendo Código Morto](#3-removendo-código-morto)
4. [Melhorando Validação e Sanitização](#4-melhorando-validação-e-sanitização)
5. [Otimizações de Performance](#5-otimizações-de-performance)
6. [Patterns de Error Handling](#6-patterns-de-error-handling)

---

## 1. Substituindo `any` por Tipos Específicos

### Header.tsx - Search Results

**Antes (❌):**

```typescript
const [searchResults, setSearchResults] = useState<any[]>([]);

const mockSearchResults = [
  { id: 1, type: 'post', title: 'Dica de maternidade', author: 'Maria Silva' },
  { id: 2, type: 'user', title: 'Ana Costa', subtitle: 'Mãe de 2 filhos' },
  { id: 3, type: 'group', title: 'Mães de primeira viagem', subtitle: '1.2k membros' },
];
```

**Depois (✅):**

```typescript
// 1. Criar types específicos
interface BaseSearchResult {
  id: number;
  title: string;
}

interface PostSearchResult extends BaseSearchResult {
  type: 'post';
  author: string;
  subtitle?: never;
}

interface UserSearchResult extends BaseSearchResult {
  type: 'user';
  subtitle: string;
  author?: never;
}

interface GroupSearchResult extends BaseSearchResult {
  type: 'group';
  subtitle: string;
  author?: never;
}

type SearchResult = PostSearchResult | UserSearchResult | GroupSearchResult;

// 2. Usar o tipo específico
const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

const mockSearchResults: SearchResult[] = [
  { id: 1, type: 'post', title: 'Dica de maternidade', author: 'Maria Silva' },
  { id: 2, type: 'user', title: 'Ana Costa', subtitle: 'Mãe de 2 filhos' },
  { id: 3, type: 'group', title: 'Mães de primeira viagem', subtitle: '1.2k membros' },
];

// 3. Type-safe rendering
const renderSearchResult = (result: SearchResult) => {
  switch (result.type) {
    case 'post':
      return <PostResult author={result.author} />; // ✅ TypeScript sabe que author existe
    case 'user':
      return <UserResult subtitle={result.subtitle} />; // ✅ TypeScript sabe que subtitle existe
    case 'group':
      return <GroupResult subtitle={result.subtitle} />; // ✅ TypeScript sabe que subtitle existe
  }
};
```

### validation.ts - Tipos Genéricos

**Antes (❌):**

```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  cleanData?: any; // ❌ Perde type safety
}
```

**Depois (✅):**

```typescript
export interface ValidationResult<T = unknown> {
  isValid: boolean;
  errors: string[];
  cleanData?: T;
}

// Uso com tipo específico
interface CleanEmail {
  email: string;
  domain: string;
}

export const validateEmail = (email: string): ValidationResult<CleanEmail> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  if (isValid) {
    const [, domain] = email.split('@');
    return {
      isValid: true,
      errors: [],
      cleanData: { email: email.toLowerCase(), domain },
    };
  }

  return {
    isValid: false,
    errors: ['Email inválido'],
  };
};

// ✅ TypeScript sabe que cleanData tem email e domain
const result = validateEmail('test@example.com');
if (result.isValid && result.cleanData) {
  console.log(result.cleanData.email); // ✅ Type-safe
  console.log(result.cleanData.domain); // ✅ Type-safe
}
```

### chat-history.ts - Metadata Específico

**Antes (❌):**

```typescript
export interface ChatMessage {
  id: string;
  message: string;
  metadata?: Record<string, any>; // ❌ Não sabemos o que está aqui
}
```

**Depois (✅):**

```typescript
export interface ChatMessageMetadata {
  attachments?: Array<{
    type: 'image' | 'audio' | 'file';
    url: string;
    filename: string;
    size: number;
  }>;
  edited?: boolean;
  editedAt?: string;
  reactions?: Record<'heart' | 'like' | 'pray' | 'hug', number>;
  flags?: {
    important?: boolean;
    pinned?: boolean;
    archived?: boolean;
  };
}

export interface ChatMessage {
  id: string;
  message: string;
  metadata?: ChatMessageMetadata; // ✅ Estrutura bem definida
}

// Uso type-safe
const addReaction = (message: ChatMessage, reaction: keyof ChatMessageMetadata['reactions']) => {
  const currentReactions = message.metadata?.reactions || {};
  return {
    ...message,
    metadata: {
      ...message.metadata,
      reactions: {
        ...currentReactions,
        [reaction]: (currentReactions[reaction] || 0) + 1,
      },
    },
  };
};
```

---

## 2. Corrigindo Dependências em useEffect

### ChatPage.tsx - Fetch Messages

**Antes (❌):**

```typescript
const ChatPage = () => {
  const fetchMessages = async () => {
    const { data } = await supabase.from('messages').select('*');
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages(); // ⚠️ fetchMessages não está nas dependências
  }, []);

  return <div>{/* ... */}</div>;
};
```

**Solução 1 - useCallback (✅):**

```typescript
const ChatPage = () => {
  const fetchMessages = useCallback(async () => {
    const { data } = await supabase.from('messages').select('*');
    setMessages(data);
  }, []); // Sem dependências externas

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]); // ✅ Incluir fetchMessages

  return <div>{/* ... */}</div>;
};
```

**Solução 2 - Função dentro do Effect (✅):**

```typescript
const ChatPage = () => {
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from('messages').select('*');
      setMessages(data);
    };

    fetchMessages();
  }, []); // ✅ Sem dependências externas

  return <div>{/* ... */}</div>;
};
```

**Solução 3 - Com Dependências (✅):**

```typescript
const ChatPage = ({ userId, chatId }: ChatPageProps) => {
  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .eq('chat_id', chatId);
    setMessages(data);
  }, [userId, chatId]); // ✅ Incluir todas as dependências

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]); // ✅ Reage a mudanças de userId ou chatId

  return <div>{/* ... */}</div>;
};
```

### NotificationSettings.tsx - Load Preferences

**Antes (❌):**

```typescript
const NotificationSettings = () => {
  const loadPreferences = async () => {
    const { data } = await supabase.from('preferences').select('*');
    setPreferences(data);
  };

  useEffect(() => {
    loadPreferences(); // ⚠️ loadPreferences não está nas dependências
  }, []);

  return <div>{/* ... */}</div>;
};
```

**Depois (✅):**

```typescript
const NotificationSettings = () => {
  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('preferences')
          .select('*')
          .single();

        if (error) throw error;

        if (isMounted) {
          setPreferences(data);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        if (isMounted) {
          setError('Falha ao carregar preferências');
        }
      }
    };

    loadPreferences();

    return () => {
      isMounted = false; // Cleanup
    };
  }, []); // ✅ Sem dependências externas, inclui cleanup

  return <div>{/* ... */}</div>;
};
```

---

## 3. Removendo Código Morto

### FeedPage.tsx - Imports Não Utilizados

**Antes (❌):**

```typescript
import { useState, useEffect, useMemo } from 'react'; // useMemo nunca usado
import { useCreateComment } from '../hooks/useComments'; // Nunca usado
import { Heart, MessageCircle, Share2, Crown } from 'lucide-react'; // Crown nunca usado

const FeedPage = () => {
  const { addComment } = useCreateComment(); // addComment nunca usado

  // ...
};
```

**Depois (✅):**

```typescript
import { useState, useEffect } from 'react'; // ✅ Apenas o necessário
import { Heart, MessageCircle, Share2 } from 'lucide-react'; // ✅ Apenas o necessário

const FeedPage = () => {
  // ✅ Sem código morto
  // ...
};
```

### AdvancedSearch.tsx - State Não Utilizado

**Antes (❌):**

```typescript
const AdvancedSearch = () => {
  const [showFilters, setShowFilters] = useState(false); // ❌ Nunca usado

  return (
    <div>
      {/* showFilters nunca é usado aqui */}
    </div>
  );
};
```

**Opção 1 - Remover (✅):**

```typescript
const AdvancedSearch = () => {
  // ✅ Removido código não utilizado

  return (
    <div>
      {/* ... */}
    </div>
  );
};
```

**Opção 2 - Implementar a Feature (✅):**

```typescript
const AdvancedSearch = () => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      <button onClick={() => setShowFilters(!showFilters)}>
        Filtros {showFilters ? '▲' : '▼'}
      </button>

      {showFilters && (
        <div className="filters-panel">
          {/* Implementação dos filtros */}
        </div>
      )}
    </div>
  );
};
```

---

## 4. Melhorando Validação e Sanitização

### validation.ts - Regex Seguro

**Antes (❌):**

```typescript
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
//                                                            ^^^ Escape desnecessário
```

**Depois (✅):**

```typescript
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
```

### AdvancedSearch.tsx - Input Sanitization

**Antes (❌):**

```typescript
const performSearch = async () => {
  let queryBuilder = supabase.from('posts').select('*').ilike('content', `%${query}%`); // ❌ Sem sanitização ou limite
};
```

**Depois (✅):**

```typescript
// 1. Criar constantes
const MAX_SEARCH_LENGTH = 100;
const SEARCH_DEBOUNCE_MS = 300;

// 2. Criar função de sanitização
const sanitizeSearchQuery = (input: string): string => {
  return input.trim().slice(0, MAX_SEARCH_LENGTH).replace(/[<>]/g, ''); // Remove caracteres perigosos
};

// 3. Usar debounce
import { useMemo } from 'react';
import { debounce } from '../utils/debounce';

const performSearch = useMemo(
  () =>
    debounce(async (searchQuery: string) => {
      const sanitized = sanitizeSearchQuery(searchQuery);

      if (sanitized.length < 2) {
        setResults([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, content, author, created_at')
          .textSearch('content', sanitized, {
            type: 'websearch',
            config: 'portuguese',
          })
          .limit(20);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    }, SEARCH_DEBOUNCE_MS),
  []
);
```

### Validação de Email com Domain Whitelist

**Antes (❌):**

```typescript
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    isValid: emailRegex.test(email),
    errors: emailRegex.test(email) ? [] : ['Email inválido'],
  };
};
```

**Depois (✅):**

```typescript
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'clubnath.app',
];

const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  // ... mais domínios descartáveis
];

export const validateEmail = (
  email: string
): ValidationResult<{ email: string; domain: string }> => {
  const errors: string[] = [];

  // 1. Validação básica
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errors: ['Email inválido'],
    };
  }

  // 2. Extrair e validar domínio
  const [localPart, domain] = email.toLowerCase().split('@');

  if (localPart.length > 64) {
    errors.push('Parte local do email muito longa');
  }

  if (domain.length > 255) {
    errors.push('Domínio do email muito longo');
  }

  // 3. Verificar domínios descartáveis
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    errors.push('Emails descartáveis não são permitidos');
  }

  // 4. Verificar whitelist (opcional)
  // if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
  //   errors.push('Domínio de email não permitido');
  // }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    cleanData: isValid ? { email: email.toLowerCase(), domain } : undefined,
  };
};
```

---

## 5. Otimizações de Performance

### Memoização de Componentes

**Antes (❌):**

```typescript
export const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  return (
    <div className="post-card">
      {/* renderização pesada */}
    </div>
  );
};
```

**Depois (✅):**

```typescript
import { memo } from 'react';

export const PostCard = memo(
  ({ post, onLike, onComment }: PostCardProps) => {
    return (
      <div className="post-card">
        {/* renderização pesada */}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison - só re-renderiza se algo relevante mudou
    return (
      prevProps.post.id === nextProps.post.id &&
      prevProps.post.updated_at === nextProps.post.updated_at &&
      prevProps.post.likes_count === nextProps.post.likes_count &&
      prevProps.post.comments_count === nextProps.post.comments_count
    );
  }
);

PostCard.displayName = 'PostCard';
```

### Lazy Loading de Componentes

**Antes (❌):**

```typescript
import { ProfilePage } from './components/ProfilePage';
import { StorePage } from './components/StorePage';
import { GroupsPage } from './components/GroupsPage';
import { ChatPage } from './components/ChatPage';

// Todos os componentes carregados no bundle inicial
```

**Depois (✅):**

```typescript
import { lazy, Suspense } from 'react';
import { LoadingScreen } from './components/LoadingScreen';

// Lazy loading
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const StorePage = lazy(() => import('./components/StorePage'));
const GroupsPage = lazy(() => import('./components/GroupsPage'));
const ChatPage = lazy(() => import('./components/ChatPage'));

// No router
<Routes>
  <Route
    path="/profile"
    element={
      <Suspense fallback={<LoadingScreen />}>
        <ProfilePage />
      </Suspense>
    }
  />
  <Route
    path="/store"
    element={
      <Suspense fallback={<LoadingScreen />}>
        <StorePage />
      </Suspense>
    }
  />
  {/* ... */}
</Routes>
```

### Debounce em Buscas

**Antes (❌):**

```typescript
const handleSearch = (query: string) => {
  setSearchQuery(query);
  performSearch(query); // ❌ Chamado a cada keystroke
};

<input
  type="text"
  onChange={(e) => handleSearch(e.target.value)}
/>
```

**Depois (✅):**

```typescript
// utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// No componente
import { useMemo, useCallback } from 'react';
import { debounce } from '../utils/debounce';

const performSearch = useCallback(async (query: string) => {
  // implementação da busca
}, []);

const debouncedSearch = useMemo(
  () => debounce(performSearch, 300),
  [performSearch]
);

const handleSearch = (query: string) => {
  setSearchQuery(query);
  debouncedSearch(query); // ✅ Só chamado após 300ms de inatividade
};

<input
  type="text"
  value={searchQuery}
  onChange={(e) => handleSearch(e.target.value)}
/>
```

---

## 6. Patterns de Error Handling

### Try-Catch com Logging Apropriado

**Antes (❌):**

```typescript
const fetchPosts = async () => {
  const { data } = await supabase.from('posts').select('*');
  setPosts(data);
};
```

**Depois (✅):**

```typescript
import { logger } from '../utils/logger';

const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    setPosts(data || []);
    setError(null);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    logger.error('Failed to fetch posts', {
      error: errorMessage,
      context: 'fetchPosts',
    });

    setError('Não foi possível carregar os posts. Tente novamente.');
    setPosts([]);
  }
};
```

### Error Boundary Component

**Criar um Error Boundary (✅):**

```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught error', {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-container">
          <h2>Algo deu errado</h2>
          <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
          <button onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Uso:
<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### Type-Safe Error Handling com Result Pattern

**Pattern Result (✅):**

```typescript
// utils/result.ts
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

export const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

// Uso:
const fetchUser = async (userId: string): Promise<Result<User, string>> => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error) return failure(error.message);
    if (!data) return failure('Usuário não encontrado');

    return success(data);
  } catch (error) {
    return failure('Erro ao buscar usuário');
  }
};

// No componente:
const loadUser = async () => {
  const result = await fetchUser(userId);

  if (result.success) {
    setUser(result.data); // ✅ TypeScript sabe que data existe
  } else {
    setError(result.error); // ✅ TypeScript sabe que error existe
  }
};
```

---

## 🎯 Resumo de Prioridades

### Implementar Imediatamente

1. ✅ Substituir todos os `any` por tipos específicos
2. ✅ Adicionar debounce em buscas
3. ✅ Implementar Error Boundaries nas rotas principais
4. ✅ Sanitizar todos os inputs de usuário

### Implementar Esta Sprint

1. ✅ Memoizar componentes de lista
2. ✅ Lazy loading de rotas
3. ✅ Corrigir dependências de useEffect
4. ✅ Remover código morto

### Implementar Próxima Sprint

1. ✅ Implementar Result pattern
2. ✅ Adicionar validações avançadas
3. ✅ Otimizar re-renders com useMemo/useCallback
4. ✅ Criar biblioteca de hooks customizados

---

**Documento mantido por:** Time de Desenvolvimento ClubNath  
**Última atualização:** 2025-10-27  
**Versão:** 1.0
