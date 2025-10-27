# 🔒 Guia de Correções de Segurança

## ⚠️ AÇÃO IMEDIATA NECESSÁRIA

### 1. Rotacionar Credenciais Expostas

**Status:** 🔴 CRÍTICO - Executar HOJE

#### Passo 1: Rotacionar Chave Supabase

1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
2. Clique em "Generate new anon key"
3. Copie a nova chave
4. Salve em local seguro (1Password, Bitwarden, etc)

#### Passo 2: Atualizar Código

```bash
# 1. Criar arquivo .env na raiz do projeto
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_NOVA_CHAVE_AQUI
VITE_INSTAGRAM_CLIENT_ID=SEU_CLIENT_ID_AQUI
EOF

# 2. Adicionar .env ao .gitignore (verificar se já existe)
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

#### Passo 3: Atualizar src/lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Validação rigorosa - NUNCA usar fallback em produção
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 
    '❌ CRITICAL ERROR: Supabase credentials not configured.\n\n' +
    'Required environment variables:\n' +
    '  - VITE_SUPABASE_URL\n' +
    '  - VITE_SUPABASE_ANON_KEY\n\n' +
    'Steps to fix:\n' +
    '1. Copy .env.example to .env\n' +
    '2. Add your Supabase credentials from:\n' +
    '   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api\n' +
    '3. Restart the dev server\n';
  
  console.error(errorMsg);
  
  // Em desenvolvimento, mostrar erro claro
  if (import.meta.env.DEV) {
    throw new Error(errorMsg);
  }
  
  // Em produção, logar mas não quebrar o app
  // (Netlify vai mostrar erro no build se vars não configuradas)
}

// Validação adicional da chave
if (supabaseAnonKey && (
  supabaseAnonKey.includes('example') || 
  supabaseAnonKey.length < 100 ||
  !supabaseAnonKey.startsWith('eyJ')
)) {
  throw new Error(
    '❌ Invalid Supabase anon key format. ' +
    'Please check your .env file and ensure you copied the correct key.'
  );
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Log apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('✅ Supabase initialized successfully');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-10) : 'MISSING');
}

// ... resto do arquivo (types)
```

#### Passo 4: Atualizar Netlify

```bash
# Configurar no Netlify Dashboard
# Site Settings → Environment Variables → Add variable

# Adicionar:
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=[NOVA_CHAVE_AQUI]
VITE_INSTAGRAM_CLIENT_ID=[SEU_CLIENT_ID]
```

#### Passo 5: Auditar Acesso

```sql
-- Execute no Supabase SQL Editor
-- Verificar acessos recentes suspeitos

SELECT 
  created_at,
  user_id,
  ip_address,
  user_agent
FROM auth.audit_log_entries
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 100;
```

#### Passo 6: Revogar Chave Antiga

1. Volte para: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
2. Clique em "Revoke" na chave antiga
3. Confirme a revogação

---

### 2. Implementar Sanitização HTML

**Problema:** XSS através de campos de texto não sanitizados

**Solução:** Criar utilitário de sanitização

```typescript
// src/utils/sanitize.ts

/**
 * Sanitiza string para prevenir XSS
 * Remove HTML tags, JS protocols e event handlers
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove tags HTML
    .replace(/<[^>]*>/g, '')
    // Remove JS protocols
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Normalizar espaços
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitiza string preservando quebras de linha
 * Útil para captions de posts
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Valida e sanitiza URL
 */
export function sanitizeUrl(input: string): string | null {
  if (typeof input !== 'string') return null;
  
  try {
    const url = new URL(input);
    
    // Apenas permitir http/https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Escapa HTML entities
 * Para exibir texto como-é sem interpretação
 */
export function escapeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (match) => htmlEntities[match] || match);
}

/**
 * Valida email
 */
export function sanitizeEmail(input: string): string | null {
  if (typeof input !== 'string') return null;
  
  const email = input.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email) ? email : null;
}
```

**Uso nas Validações:**

```typescript
// src/utils/validation.ts
import { sanitizeHtml, sanitizeText, sanitizeUrl } from './sanitize';

interface ProfileUpdateData {
  preferred_nickname?: string;
  avatar_emoji?: string;
  onboarding_goals?: string[];
  bio?: string;
}

export function validateProfileUpdate(
  data: unknown
): { isValid: boolean; errors: string[]; cleanData: Partial<ProfileUpdateData> } {
  const errors: string[] = [];
  const cleanData: Partial<ProfileUpdateData> = {};

  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Invalid data format'], cleanData: {} };
  }

  const input = data as Record<string, unknown>;

  // Nickname com sanitização
  if (input.preferred_nickname !== undefined) {
    if (typeof input.preferred_nickname !== 'string') {
      errors.push('Nickname must be a string');
    } else {
      const sanitized = sanitizeHtml(input.preferred_nickname);
      if (sanitized.length > 50) {
        errors.push('Nickname must be less than 50 characters');
      } else if (sanitized.length > 0) {
        cleanData.preferred_nickname = sanitized;
      }
    }
  }

  // Bio com sanitização (preserva quebras de linha)
  if (input.bio !== undefined) {
    if (typeof input.bio !== 'string') {
      errors.push('Bio must be a string');
    } else {
      const sanitized = sanitizeText(input.bio);
      if (sanitized.length > 500) {
        errors.push('Bio must be less than 500 characters');
      } else if (sanitized.length > 0) {
        cleanData.bio = sanitized;
      }
    }
  }

  // Goals com sanitização
  if (input.onboarding_goals !== undefined) {
    if (!Array.isArray(input.onboarding_goals)) {
      errors.push('Goals must be an array');
    } else {
      const validGoals = input.onboarding_goals
        .filter((goal): goal is string => typeof goal === 'string')
        .map(goal => sanitizeHtml(goal))
        .filter(goal => goal.length > 0 && goal.length <= 100)
        .slice(0, 10); // Max 10 goals

      if (validGoals.length > 0) {
        cleanData.onboarding_goals = validGoals;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData
  };
}

// Validação de posts
interface PostData {
  caption: string;
  category: string;
  image_url?: string;
}

export function validatePostData(
  data: unknown
): { isValid: boolean; errors: string[]; cleanData: Partial<PostData> } {
  const errors: string[] = [];
  const cleanData: Partial<PostData> = {};

  if (typeof data !== 'object' || data === null) {
    return { isValid: false, errors: ['Invalid data format'], cleanData: {} };
  }

  const input = data as Record<string, unknown>;

  // Caption obrigatório
  if (!input.caption || typeof input.caption !== 'string') {
    errors.push('Caption is required');
  } else {
    const sanitized = sanitizeText(input.caption);
    if (sanitized.length === 0) {
      errors.push('Caption cannot be empty');
    } else if (sanitized.length > 1000) {
      errors.push('Caption must be less than 1000 characters');
    } else {
      cleanData.caption = sanitized;
    }
  }

  // Category validação
  const validCategories = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'];
  if (!input.category || typeof input.category !== 'string') {
    errors.push('Category is required');
  } else if (!validCategories.includes(input.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  } else {
    cleanData.category = input.category;
  }

  // Image URL validação
  if (input.image_url !== undefined) {
    if (typeof input.image_url !== 'string') {
      errors.push('Image URL must be a string');
    } else {
      const sanitizedUrl = sanitizeUrl(input.image_url);
      if (!sanitizedUrl) {
        errors.push('Invalid image URL');
      } else {
        cleanData.image_url = sanitizedUrl;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanData
  };
}
```

---

### 3. Implementar Rate Limiting

**Criar:** `src/utils/rateLimiter.ts`

```typescript
/**
 * Rate Limiter no lado do cliente
 * Previne spam e abuse de APIs
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(options: { 
    maxRequests: number; 
    windowMs: number;
    cleanupIntervalMs?: number;
  }) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;

    // Cleanup periódico para prevenir memory leak
    const cleanupMs = options.cleanupIntervalMs || 60000;
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupMs);
  }

  /**
   * Tenta adquirir permissão para fazer request
   * @returns true se permitido, false se rate limit atingido
   */
  tryAcquire(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove requests fora da janela de tempo
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  /**
   * Retorna quanto tempo falta até próximo request permitido
   */
  getRetryAfter(key: string): number {
    const userRequests = this.requests.get(key);
    if (!userRequests || userRequests.length < this.maxRequests) {
      return 0;
    }

    const oldestRequest = Math.min(...userRequests);
    const nextAllowed = oldestRequest + this.windowMs;
    return Math.max(0, nextAllowed - Date.now());
  }

  /**
   * Reseta limite para uma chave específica
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Limpa entradas antigas para prevenir memory leak
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      const valid = timestamps.filter(t => now - t < this.windowMs);
      if (valid.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, valid);
      }
    }
  }

  /**
   * Cleanup ao destruir
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.requests.clear();
  }
}

// Criar limiters globais
export const postLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60000, // 5 posts por minuto
});

export const commentLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 10 comments por minuto
});

export const likeLimiter = new RateLimiter({
  maxRequests: 30,
  windowMs: 60000, // 30 likes por minuto
});

export const searchLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60000, // 20 searches por minuto
});
```

**Uso nos Services:**

```typescript
// src/services/posts.service.ts
import { postLimiter } from '../utils/rateLimiter';
import { validatePostData } from '../utils/validation';

export async function createPost(data: {
  userId: string;
  caption: string;
  category: string;
  imageUrl?: string;
}): Promise<{ 
  success: boolean; 
  post?: Post; 
  error?: string;
  retryAfter?: number;
}> {
  // Rate limiting check
  if (!postLimiter.tryAcquire(data.userId)) {
    const retryAfter = postLimiter.getRetryAfter(data.userId);
    return {
      success: false,
      error: `Por favor, aguarde ${Math.ceil(retryAfter / 1000)} segundos antes de postar novamente.`,
      retryAfter
    };
  }

  // Validação com sanitização
  const validation = validatePostData({
    caption: data.caption,
    category: data.category,
    image_url: data.imageUrl,
  });

  if (!validation.isValid) {
    return { 
      success: false, 
      error: validation.errors.join(', ') 
    };
  }

  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: data.userId,
        caption: validation.cleanData.caption,
        category: validation.cleanData.category,
        image_url: validation.cleanData.image_url,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, post: post as unknown as Post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Erro ao criar publicação' };
  }
}
```

---

## 🧪 Testes de Segurança

Criar testes para validar as correções:

```typescript
// src/utils/__tests__/sanitize.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText, sanitizeUrl } from '../sanitize';

describe('sanitizeHtml', () => {
  it('remove HTML tags', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>Hello'))
      .toBe('alert("xss")Hello');
    
    expect(sanitizeHtml('<b>Bold</b> text'))
      .toBe('Bold text');
  });

  it('remove JavaScript protocols', () => {
    expect(sanitizeHtml('javascript:alert(1)'))
      .toBe('alert(1)');
  });

  it('remove event handlers', () => {
    expect(sanitizeHtml('Hello onclick=alert(1)'))
      .toBe('Hello alert(1)');
  });

  it('handle empty and null input', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as any)).toBe('');
  });
});

describe('sanitizeUrl', () => {
  it('accepts valid HTTP/HTTPS URLs', () => {
    expect(sanitizeUrl('https://example.com'))
      .toBe('https://example.com/');
    
    expect(sanitizeUrl('http://example.com'))
      .toBe('http://example.com/');
  });

  it('rejects JavaScript protocol', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
  });

  it('rejects data URIs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>'))
      .toBeNull();
  });

  it('rejects invalid URLs', () => {
    expect(sanitizeUrl('not-a-url')).toBeNull();
  });
});
```

```typescript
// src/utils/__tests__/rateLimiter.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateLimiter } from '../rateLimiter';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      maxRequests: 3,
      windowMs: 1000,
    });
  });

  it('allows requests under limit', () => {
    expect(limiter.tryAcquire('user1')).toBe(true);
    expect(limiter.tryAcquire('user1')).toBe(true);
    expect(limiter.tryAcquire('user1')).toBe(true);
  });

  it('blocks requests over limit', () => {
    limiter.tryAcquire('user1');
    limiter.tryAcquire('user1');
    limiter.tryAcquire('user1');
    
    expect(limiter.tryAcquire('user1')).toBe(false);
  });

  it('allows requests after window expires', async () => {
    limiter.tryAcquire('user1');
    limiter.tryAcquire('user1');
    limiter.tryAcquire('user1');
    
    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(limiter.tryAcquire('user1')).toBe(true);
  });

  it('isolates limits per user', () => {
    limiter.tryAcquire('user1');
    limiter.tryAcquire('user1');
    limiter.tryAcquire('user1');
    
    // User2 should still be able to make requests
    expect(limiter.tryAcquire('user2')).toBe(true);
  });
});
```

---

## ✅ Checklist de Segurança

- [ ] Rotacionar chave Supabase exposta
- [ ] Remover fallbacks hardcoded
- [ ] Implementar sanitização HTML
- [ ] Adicionar rate limiting
- [ ] Atualizar variáveis de ambiente no Netlify
- [ ] Auditar logs de acesso no Supabase
- [ ] Adicionar testes de segurança
- [ ] Verificar .gitignore inclui arquivos sensíveis
- [ ] Revisar permissões RLS no Supabase
- [ ] Documentar práticas de segurança para equipe

---

**Próximos Passos:** Após implementar estas correções, execute a auditoria de segurança completa usando `npm audit` e revise as políticas RLS do Supabase.
