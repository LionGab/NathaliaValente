# CLAUDE.md - ClubNath Development Guide

**Projeto:** ClubNath - Comunidade de Mães
**Stack:** React 18 + TypeScript + Vite + Supabase + Tailwind CSS
**Última Atualização:** 2025-10-22

---

## 📋 Visão Geral do Projeto

ClubNath é uma Progressive Web App (PWA) para comunidade de mães brasileiras, oferecendo:
- Feed social com posts e interações
- Sistema de grupos temáticos
- Chat com IA (emotional intelligence)
- Sistema de orações (prayers)
- Diário pessoal (journaling)
- Estudos bíblicos
- Sistema de badges/gamificação
- Suporte emocional SOS

---

## 🚀 Comandos Essenciais

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Preview de produção local
npm run preview
```

### Build & Deploy
```bash
# Build de produção
npm run build

# Otimizar avatars (executado automaticamente no prebuild)
npm run optimize-avatars
```

### Qualidade de Código
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Formatação
npm run format
npm run format:check
```

### Testes
```bash
# Rodar testes (watch mode)
npm run test

# UI de testes (visual)
npm run test:ui

# Testes single run
npm run test:run

# Coverage report
npm run test:coverage
```

### Database (Supabase)
```bash
# Aplicar migrations
# Ver: /supabase/migrations/
# Executar via Supabase Dashboard SQL Editor

# Migrations importantes:
# - setup-database.sql (schema inicial)
# - setup_auth_trigger.sql (triggers de auth)
# - 20251021_onboarding_system.sql (onboarding)
# - 20250121_groups_system.sql (grupos)
# - 20250121_prayers_system.sql (orações)
```

---

## 📁 Estrutura de Arquivos Principais

### Componentes Críticos
```
src/components/
├── FeedPage.tsx              # Feed principal com infinite scroll
├── ChatPage.tsx              # Chat com IA (emotional intelligence)
├── ProfilePage.tsx           # Perfil do usuário
├── groups/
│   ├── GroupsList.tsx        # Lista de grupos
│   ├── GroupDetail.tsx       # Detalhes do grupo
│   └── CreateGroupModal.tsx  # Criação de grupos
├── prayers/
│   ├── PrayerPost.tsx        # Post de oração
│   └── CreatePrayerModal.tsx # Criar oração
└── ui/
    ├── Button.tsx            # Componente base de botão
    ├── Avatar.tsx            # Avatar com fallback
    └── LoadingSpinner.tsx    # Spinners de loading
```

### Services (Lógica de Negócio)
```
src/services/
├── posts.service.ts          # CRUD de posts
├── groups.service.ts         # Sistema completo de grupos (700+ linhas)
├── prayers.service.ts        # Sistema de orações
├── journaling.service.ts     # Diário pessoal
├── badges.service.ts         # Gamificação (650+ linhas)
├── chat-history.service.ts   # Histórico de chat
└── notifications.service.ts  # Sistema de notificações
```

### Hooks Customizados
```
src/hooks/
├── useQueries.ts             # React Query hooks centralizados
├── useAuth.ts                # Hook de autenticação (via Context)
├── usePWA.ts                 # PWA features (install, notifications)
├── useSwipe.ts               # Gestos de swipe
├── useGestures.ts            # Haptic feedback + infinite scroll
└── useMonetization.ts        # Lógica de monetização
```

### Types
```
src/types/
├── groups.ts                 # Tipos do sistema de grupos (1,750 linhas)
├── emotional-intelligence.ts # Tipos de emoções e mood
├── bible-studies.ts          # Tipos de estudos bíblicos
└── chat-history.ts           # Tipos de mensagens de chat
```

### Core Libraries
```
src/lib/
├── supabase.ts               # Cliente Supabase + tipos base
└── utils.ts                  # Utilitários (cn, formatters, etc)
```

---

## 🎨 Guia de Estilo de Código

### TypeScript
- **Sempre usar tipos explícitos** - Evitar `any` a todo custo
- **Strict mode habilitado** - Seguir regras estritas do TS
- **Interfaces over types** - Preferir `interface` para objetos
- **Named exports** - Evitar default exports exceto componentes

**Exemplo:**
```typescript
// ✅ BOM
interface GroupData {
  name: string;
  category: GroupCategory;
  isPrivate: boolean;
}

export const createGroup = async (data: GroupData): Promise<Group> => {
  // ...
}

// ❌ EVITAR
const createGroup = async (data: any) => {
  // ...
}
```

### React Components
- **Function components** - Usar arrow functions
- **Hooks no topo** - Sempre no início do componente
- **useCallback/useMemo** - Para otimizações de performance
- **Early returns** - Para loading/error states
- **Prop types** - Definir interface para props

**Exemplo:**
```typescript
interface FeedPageProps {
  initialPage?: number;
}

export const FeedPage = ({ initialPage = 0 }: FeedPageProps) => {
  const [page, setPage] = useState(initialPage);
  const { data, isLoading } = usePosts(page);

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <ErrorMessage />;

  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Services
- **Tipos de retorno explícitos** - Sempre tipar retorno de funções
- **Error handling consistente** - Usar try/catch ou throw Error
- **Documentação** - Adicionar JSDoc para funções complexas

**Exemplo:**
```typescript
/**
 * Cria um novo grupo temático
 * @param data Dados do grupo a ser criado
 * @returns Promise<Group> Grupo criado
 * @throws Error se criação falhar
 */
export const createGroup = async (data: CreateGroupData): Promise<Group> => {
  const { data: result, error } = await supabase
    .from('groups')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar grupo: ${error.message}`);
  return result;
};
```

### Tailwind CSS
- **Utility-first** - Preferir classes Tailwind
- **Mobile-first** - Breakpoints progressivos (sm:, md:, lg:)
- **Design tokens** - Usar cores do design system
- **Responsiveness** - Sempre testar em mobile

**Exemplo:**
```tsx
<button className="
  w-full px-6 py-3
  bg-gradient-to-r from-pink-500 to-purple-500
  text-white font-semibold rounded-lg
  hover:shadow-lg hover:scale-105
  transition-all duration-200
  sm:w-auto sm:px-8
">
  Criar Grupo
</button>
```

---

## 🧪 Guia de Testes

### Estrutura de Testes
```
src/
├── services/__tests__/
│   ├── posts.service.test.ts
│   └── groups.service.test.ts
├── hooks/__tests__/
│   ├── useQueries.test.tsx
│   └── useAuth.test.tsx
└── components/__tests__/
    ├── FeedPage.test.tsx
    └── ChatPage.test.tsx
```

### Padrões de Teste

**Services:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { postsService } from '../posts.service';

describe('postsService', () => {
  describe('createPost', () => {
    it('should create post successfully', async () => {
      const result = await postsService.createPost({
        caption: 'Test',
        category: 'Look do dia',
        userId: 'user-1'
      });

      expect(result).toBeDefined();
      expect(result.caption).toBe('Test');
    });
  });
});
```

**Components:**
```typescript
import { render, screen } from '@testing-library/react';
import { FeedPage } from '../FeedPage';

describe('FeedPage', () => {
  it('renders create post button', () => {
    render(<FeedPage />);
    expect(screen.getByText(/compartilhar/i)).toBeInTheDocument();
  });
});
```

### Coverage Requirements
- **Mínimo:** 70% (lines, functions, branches, statements)
- **Crítico:** Services devem ter >80%
- **Componentes UI:** >60% aceitável

---

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente (.env)
```bash
# Supabase
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-chave-anon>

# Instagram OAuth (opcional)
VITE_INSTAGRAM_CLIENT_ID=<seu-client-id>

# Development
VITE_ENV=development
```

### Node & NPM
```
Node: >=20.19.0
NPM: >=10.0.0
```

Verificar versões:
```bash
node --version  # Deve ser >= 20.19.0
npm --version   # Deve ser >= 10.0.0
```

### Supabase Local (opcional)
```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar local
supabase start

# Aplicar migrations
supabase db reset
```

---

## 📊 Métricas de Performance

### Targets
- **Lighthouse Score:** >90
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Bundle Size (gzipped):** <200KB

### Monitoramento
```bash
# Build e verificar bundle size
npm run build

# Verificar bundle com analyzer (adicionar plugin)
npx vite-bundle-visualizer
```

---

## 🐛 Debugging

### React Query DevTools
```typescript
// Já configurado em src/contexts/QueryProvider.tsx
// Acesse em: http://localhost:5173 (botão no canto inferior)
```

### Console Logs
⚠️ **IMPORTANTE:** Console logs são removidos em produção via Terser

```typescript
// ❌ NÃO usar console.log em código final
console.log('Debug info');

// ✅ Usar logger customizado (TODO: implementar)
import { logger } from '../lib/logger';
logger.debug('Debug info');
```

### Supabase Logs
```bash
# Ver logs no dashboard
# https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/logs
```

---

## 🔐 Segurança

### Row-Level Security (RLS)
- **Todas as tabelas** devem ter políticas RLS
- **Usuários** só podem acessar seus próprios dados
- **Grupos privados** requerem membership

### Validação de Input
```typescript
// Sempre validar input do usuário
import { validatePost } from '../utils/validation';

const result = validatePost(postData);
if (!result.valid) {
  throw new Error(result.error);
}
```

### Secrets
- **Nunca commitar** .env
- **Usar Netlify env vars** para produção
- **Rotacionar keys** regularmente

---

## 📦 Dependências Principais

### Core
- `react@18.3.1` - UI library
- `typescript@5.5.3` - Type safety
- `vite@7.1.11` - Build tool

### State Management
- `@tanstack/react-query@5.90.5` - Server state
- React Context API - UI state (Auth, Theme)

### Backend
- `@supabase/supabase-js@2.76.0` - Database + Auth

### UI
- `tailwindcss@3.4.1` - Styling
- `lucide-react@0.546.0` - Icons
- `class-variance-authority@0.7.1` - Component variants

### Testing
- `vitest@3.2.4` - Test runner
- `@testing-library/react@16.3.0` - Component testing

---

## 🚨 Problemas Comuns & Soluções

### Build Falha
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Verificar tipos
npm run typecheck

# Limpar cache TS
rm -rf node_modules/.vite
```

### Supabase Connection Issues
```bash
# Verificar .env
cat .env | grep SUPABASE

# Testar conexão
npm run dev
# Abrir console do navegador e verificar Network tab
```

### PWA Não Atualiza
```bash
# Limpar service worker
# Chrome DevTools > Application > Service Workers > Unregister
# Recarregar página com Ctrl+Shift+R
```

---

## 📚 Recursos Adicionais

### Documentação
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)

### Arquitetura
- Ver `AGENTS.md` para guias específicos de features
- Ver relatório de auditoria em `/docs/audit-2025-10-22.md`

### Suporte
- GitHub Issues: [repositório do projeto]
- Supabase Support: support@supabase.io

---

## 🎯 Próximos Passos (Roadmap)

### Prioridade Alta (Sprint Atual)
- [ ] Aumentar cobertura de testes para 40%
- [ ] Implementar logger customizado
- [ ] Integrar Sentry para error tracking
- [ ] Reduzir uso de `any` em 50%

### Prioridade Média (Próximo Sprint)
- [ ] Implementar E2E tests (Playwright)
- [ ] Criar Storybook para UI components
- [ ] Adicionar performance monitoring
- [ ] Refatorar services grandes (>500 linhas)

### Prioridade Baixa (Backlog)
- [ ] Implementar feature flags
- [ ] A11y audit completo
- [ ] Internationalization (i18n)
- [ ] Dark mode automático por horário

---

## 📝 Notas de Desenvolvimento

### Convenções de Commit
```
feat: adiciona nova funcionalidade
fix: corrige bug
refactor: refatora código sem mudar funcionalidade
test: adiciona ou modifica testes
docs: atualiza documentação
style: formatação de código
perf: melhoria de performance
chore: tarefas de build/config
```

### Branch Strategy
```
main          - produção (protegida)
develop       - desenvolvimento
feature/*     - novas features
fix/*         - bug fixes
refactor/*    - refatorações
```

### Code Review Checklist
- [ ] TypeScript sem erros
- [ ] Testes passando (se aplicável)
- [ ] Formatado com Prettier
- [ ] Sem console.logs desnecessários
- [ ] Documentação atualizada
- [ ] Performance considerada
- [ ] Segurança revisada

---

**Última atualização:** 2025-10-22
**Mantido por:** Time de Desenvolvimento ClubNath
