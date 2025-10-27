# 🔧 Guia de Correções TypeScript

## 📊 Situação Atual

**Erros TypeScript:** 4.083 em 93 arquivos  
**Objetivo:** 0 erros, 100% type safety

---

## 🎯 Estratégia de Correção

### Fase 1: Configuração TypeScript Rigorosa

#### Atualizar `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting - RIGOROSO */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* React */
    "types": ["vite/client", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Atualizar `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "include": ["src"]
}
```

---

### Fase 2: Corrigir Tipos `any`

#### Problema Comum: `any` no useState

```typescript
// ❌ ERRADO
const [selectedGroup, setSelectedGroup] = useState<any>(null);
const [data, setData] = useState<any>([]);
```

**Correção:**

```typescript
// ✅ CORRETO
interface Group {
  id: string;
  name: string;
  category: GroupCategory;
  description?: string;
  member_count: number;
  created_at: string;
}

const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
const [groups, setGroups] = useState<Group[]>([]);
```

#### Problema: Tipos Supabase Não Definidos

**Criar:** `src/types/database.types.ts`

```typescript
/**
 * Tipos gerados do schema Supabase
 * Para gerar automaticamente: supabase gen types typescript --project-id bbcwitnbnosyfpfjtzkr
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          preferred_nickname: string | null;
          avatar_emoji: string | null;
          onboarding_completed: boolean;
          onboarding_step: number;
          onboarding_goals: string[] | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          preferred_nickname?: string | null;
          avatar_emoji?: string | null;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          onboarding_goals?: string[] | null;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          preferred_nickname?: string | null;
          avatar_emoji?: string | null;
          onboarding_completed?: boolean;
          onboarding_step?: number;
          onboarding_goals?: string[] | null;
          onboarding_completed_at?: string | null;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          caption: string;
          category: 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe';
          image_url: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          caption: string;
          category: 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe';
          image_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          caption?: string;
          category?: 'Look do dia' | 'Desabafo' | 'Fé' | 'Dica de mãe';
          image_url?: string | null;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: never;
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: GroupCategory;
          cover_image_url: string | null;
          created_by: string;
          member_count: number;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: GroupCategory;
          cover_image_url?: string | null;
          created_by: string;
          member_count?: number;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          category?: GroupCategory;
          cover_image_url?: string | null;
          is_private?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      // Views se houver
    };
    Functions: {
      get_posts_with_user_likes: {
        Args: {
          p_user_id: string | null;
          p_limit: number;
          p_offset: number;
        };
        Returns: PostWithStats[];
      };
      // Outras functions
    };
    Enums: {
      group_category: 'Maternidade' | 'Fé' | 'Finanças' | 'Saúde' | 'Relacionamentos';
    };
  };
}

// Tipos derivados para uso na aplicação
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];

export type Like = Database['public']['Tables']['likes']['Row'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];

export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupInsert = Database['public']['Tables']['groups']['Insert'];
export type GroupUpdate = Database['public']['Tables']['groups']['Update'];

export type GroupCategory = Database['public']['Enums']['group_category'];

// Tipos estendidos com relações
export interface PostWithStats extends Post {
  profiles: Profile | null;
  has_badge: boolean;
  user_has_liked: boolean;
}

export interface CommentWithProfile extends Comment {
  profiles: Profile | null;
}
```

**Atualizar:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação rigorosa
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

// ✅ Cliente tipado
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-exportar tipos para conveniência
export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Post,
  PostInsert,
  PostUpdate,
  PostWithStats,
  Comment,
  CommentWithProfile,
  Group,
  GroupCategory,
} from '../types/database.types';
```

---

### Fase 3: Corrigir Error Handling

#### Problema: `any` em Error Handlers

```typescript
// ❌ ERRADO
try {
  await doSomething();
} catch (error: any) {
  console.error(error.message);
}
```

**Correção:**

```typescript
// ✅ CORRETO - Usar unknown e type guards
try {
  await doSomething();
} catch (error) {
  // error é automaticamente 'unknown' no TypeScript 4.4+
  if (error instanceof Error) {
    console.error('Error:', error.message);
    showToast(error.message, 'error');
  } else if (typeof error === 'string') {
    console.error('String error:', error);
    showToast(error, 'error');
  } else {
    console.error('Unknown error:', error);
    showToast('Ocorreu um erro inesperado', 'error');
  }
}
```

**Helper para Error Handling:**

```typescript
// src/utils/errorHandling.ts

/**
 * Converte erro desconhecido em mensagem legível
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'Ocorreu um erro inesperado';
}

/**
 * Type guard para PostgrestError do Supabase
 */
export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    'code' in error &&
    'details' in error
  );
}

/**
 * Formata erro do Supabase de forma amigável
 */
export function formatSupabaseError(error: unknown): string {
  if (isPostgrestError(error)) {
    // Mensagens customizadas baseadas no código
    switch (error.code) {
      case '23505':
        return 'Este registro já existe.';
      case '23503':
        return 'Erro de referência: registro relacionado não encontrado.';
      case 'PGRST116':
        return 'Nenhum resultado encontrado.';
      default:
        return error.message || 'Erro no banco de dados.';
    }
  }
  
  return getErrorMessage(error);
}

/**
 * Wrapper para async operations com error handling
 */
export async function tryCatch<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const message = errorMessage || formatSupabaseError(error);
    console.error('Operation failed:', error);
    return { data: null, error: message };
  }
}
```

**Uso:**

```typescript
// src/services/posts.service.ts
import { supabase, type PostInsert, type Post } from '../lib/supabase';
import { tryCatch, formatSupabaseError } from '../utils/errorHandling';
import { validatePostData } from '../utils/validation';

export async function createPost(
  data: PostInsert
): Promise<{ success: boolean; post?: Post; error?: string }> {
  // Validação
  const validation = validatePostData(data);
  if (!validation.isValid) {
    return { 
      success: false, 
      error: validation.errors.join(', ') 
    };
  }

  // Operação com error handling tipado
  const { data: post, error } = await tryCatch(
    async () => {
      const result = await supabase
        .from('posts')
        .insert(validation.cleanData)
        .select()
        .single();
      
      if (result.error) throw result.error;
      return result.data;
    },
    'Erro ao criar publicação'
  );

  if (error || !post) {
    return { success: false, error: error || 'Erro desconhecido' };
  }

  return { success: true, post };
}
```

---

### Fase 4: Corrigir Event Handlers

#### Problema: Event Types Incorretos

```typescript
// ❌ ERRADO
const handleChange = (e: any) => {
  setValue(e.target.value);
};

const handleSubmit = (e: any) => {
  e.preventDefault();
};
```

**Correção:**

```typescript
// ✅ CORRETO - Tipos específicos do React
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';

interface FormData {
  email: string;
  password: string;
}

function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Process form
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Handle click
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      {/* ... */}
    </form>
  );
}
```

---

### Fase 5: Corrigir React Component Props

#### Problema: Props Sem Tipo

```typescript
// ❌ ERRADO
export function Button({ children, onClick, variant }) {
  // ...
}
```

**Correção:**

```typescript
// ✅ CORRETO - Props tipadas com interface
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-colors',
        {
          'bg-pink-600 hover:bg-pink-700': variant === 'primary',
          'bg-gray-200 hover:bg-gray-300': variant === 'secondary',
          'bg-red-600 hover:bg-red-700': variant === 'danger',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'w-full': fullWidth,
          'opacity-50 cursor-not-allowed': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...restProps}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

---

### Fase 6: Corrigir Hooks Customizados

#### Problema: Return Types Não Definidos

```typescript
// ❌ ERRADO
export function usePosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // ...
  return { posts, loading };
}
```

**Correção:**

```typescript
// ✅ CORRETO - Tipos explícitos
import type { Post } from '../types/database.types';

interface UsePostsOptions {
  userId?: string | null;
  category?: string;
  limit?: number;
  enabled?: boolean;
}

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const { 
    userId, 
    category, 
    limit = 20, 
    enabled = true 
  } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch logic
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .limit(limit);

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, category, limit, enabled]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  };
}
```

---

## 🧪 Script de Verificação

Criar script para identificar problemas TypeScript:

```bash
#!/bin/bash
# scripts/check-types.sh

echo "🔍 Verificando tipos TypeScript..."

# Limpar cache
rm -rf node_modules/.cache

# Type check
echo "📝 Executando type check..."
npm run typecheck 2>&1 | tee typecheck-output.txt

# Contar erros
ERROR_COUNT=$(grep -c "error TS" typecheck-output.txt || echo "0")

echo ""
echo "📊 Resultado:"
echo "Erros encontrados: $ERROR_COUNT"

if [ "$ERROR_COUNT" -eq "0" ]; then
  echo "✅ Nenhum erro TypeScript!"
  exit 0
else
  echo "❌ Corrija os erros antes de commitar"
  exit 1
fi
```

---

## ✅ Checklist de Correções

### Tipos Básicos
- [ ] Substituir todos `any` por tipos específicos
- [ ] Definir interfaces para todos os objetos
- [ ] Tipar todos os estados (`useState`)
- [ ] Tipar todos os props de componentes
- [ ] Tipar todos os event handlers

### Supabase
- [ ] Gerar tipos do schema Supabase
- [ ] Importar tipos em todos os services
- [ ] Tipar queries Supabase
- [ ] Tipar responses de RPC functions

### Error Handling
- [ ] Usar `unknown` em catch blocks
- [ ] Implementar type guards para erros
- [ ] Criar helper functions para error formatting
- [ ] Substituir `any` em error handlers

### Hooks
- [ ] Tipar return types de hooks customizados
- [ ] Tipar options/params de hooks
- [ ] Definir interfaces para hook returns

### Components
- [ ] Definir interfaces para props
- [ ] Tipar children apropriadamente
- [ ] Usar tipos corretos para refs
- [ ] Tipar forward refs

---

**Próximos Passos:** Após corrigir todos os tipos, execute `npm run typecheck` regularmente e configure pre-commit hook para prevenir regressões.
