# 📊 DIAGRAMAS DE ARQUITETURA - ClubNath VIP

> Visualizações da arquitetura e fluxos do sistema

**Referência:** [ANALISE-ARQUITETURA-MOBILE.md](./ANALISE-ARQUITETURA-MOBILE.md)

---

## 🏗️ DIAGRAMA DE ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA DE APRESENTAÇÃO                    │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Feed    │  │   Chat   │  │  Profile │  │  Groups  │      │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │  ... │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │              │              │            │
└───────┼─────────────┼──────────────┼──────────────┼────────────┘
        │             │              │              │
        ▼             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA DE LÓGICA DE NEGÓCIO                   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Custom      │  │   React      │  │   Context    │         │
│  │  Hooks       │  │   Query      │  │   API        │         │
│  │              │  │              │  │              │         │
│  │ • usePosts   │  │ • useQuery   │  │ • Auth       │         │
│  │ • useAuth    │  │ • useMutation│  │ • Theme      │         │
│  │ • usePWA     │  │ • Optimistic │  │ • Query      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                 │
└─────────┼─────────────────┼──────────────────┼─────────────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CAMADA DE SERVIÇOS                           │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Posts Service   │  │  Groups Service  │  │  Chat Service│ │
│  │                  │  │                  │  │              │ │
│  │ • getPosts()     │  │ • getGroups()    │  │ • getMsg()   │ │
│  │ • createPost()   │  │ • createGroup()  │  │ • sendMsg()  │ │
│  │ • likePost()     │  │ • joinGroup()    │  │ • getHist()  │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                     │         │
└───────────┼─────────────────────┼─────────────────────┼─────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CAMADA DE DADOS                             │
│                                                                  │
│                  ┌─────────────────────────┐                    │
│                  │   Supabase Client       │                    │
│                  │                         │                    │
│                  │  • Authentication       │                    │
│                  │  • PostgreSQL Database  │                    │
│                  │  • Real-time Events     │                    │
│                  │  • Storage (Files)      │                    │
│                  │  • Row Level Security   │                    │
│                  └─────────────────────────┘                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUTURA DE FEATURES

```
src/features/
│
├── chat/                           # Feature: Chat AI
│   ├── services/
│   │   ├── nathia-enhanced.service.ts    (451 linhas)
│   │   └── ai-matching.service.ts        (412 linhas)
│   └── components/
│       └── [UI Components]
│
├── connections/                    # Feature: Conexões entre Usuários
│   ├── components/
│   │   ├── ConnectionCard.tsx
│   │   ├── AdvancedConnectionCard.tsx
│   │   └── ConnectionFilters.tsx
│   ├── hooks/
│   │   └── useConnections.ts
│   ├── pages/
│   │   └── ConnectionsPage.tsx
│   └── services/
│       ├── advanced-matching.service.ts  (592 linhas)
│       ├── connections.service.ts        (374 linhas)
│       └── notifications.service.ts
│
├── health/                         # Feature: Saúde e Bem-estar
│   ├── pages/
│   │   └── HealthPage.tsx               (488 linhas)
│   └── services/
│       └── babytest-integration.service.ts (649 linhas)
│
├── safety/                         # Feature: Segurança
│   ├── pages/
│   │   └── SafetyPage.tsx               (386 linhas)
│   └── services/
│       └── safety-community.service.ts   (497 linhas)
│
├── shop/                           # Feature: E-commerce
│   └── services/
│       └── nava-shop.service.ts         (634 linhas)
│
├── virtual-tryon/                  # Feature: AR Try-on
│   ├── pages/
│   │   └── VirtualTryOnPage.tsx
│   └── services/
│       └── ar-tryon.service.ts          (569 linhas)
│
├── posts/                          # Feature: Posts/Feed
│   └── components/
│       └── NathInspiraCard.tsx
│
└── profile/                        # Feature: Perfil
    └── components/
        └── AvatarSelector.tsx

TOTAL: 8 Features principais
```

---

## 🔄 FLUXO DE DADOS

### Fluxo de Leitura (Read)

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│  User   │─────▶│Component │─────▶│  Hook   │─────▶│ Service  │
│ (Click) │      │          │      │(usePost)│      │(postsServ)│
└─────────┘      └──────────┘      └─────────┘      └────┬─────┘
                                                          │
                                                          ▼
                                                    ┌──────────┐
                                                    │ Supabase │
                                                    │   GET    │
                                                    └────┬─────┘
                                                         │
    ┌────────────────────────────────────────────────────┘
    │
    ▼
┌─────────┐      ┌──────────┐      ┌─────────┐
│  Cache  │◀─────│React Query◀─────│ Response│
│(1 min)  │      │  (stale) │      │  (data) │
└────┬────┘      └────┬─────┘      └─────────┘
     │                │
     ▼                ▼
┌────────────────────────┐
│   Component Update     │
│   (Re-render)          │
└────────────────────────┘
```

### Fluxo de Escrita (Write)

```
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│  User   │─────▶│Component │─────▶│Mutation │─────▶│ Service  │
│(Submit) │      │ (Form)   │      │ (React  │      │(postsServ)│
└─────────┘      └──────────┘      │  Query) │      └────┬─────┘
                                    └─────────┘           │
                                         │                │
                                         ▼                ▼
                                    ┌─────────┐      ┌──────────┐
                                    │Optimis- │      │ Supabase │
                                    │tic UI   │      │   POST   │
                                    │(instant)│      └────┬─────┘
                                    └─────────┘           │
                                         │                │
                                         │     ┌──────────┘
                                         │     │ Success
                                         ▼     ▼
                                    ┌──────────────┐
                                    │  Invalidate  │
                                    │    Cache     │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   Refetch    │
                                    │  (background)│
                                    └──────────────┘
```

---

## 🎯 STATE MANAGEMENT

```
┌─────────────────────────────────────────────────────────────┐
│                    HIERARQUIA DE ESTADO                      │
└─────────────────────────────────────────────────────────────┘

Level 1: Global State (Context API)
├── AuthContext
│   ├── user
│   ├── profile
│   ├── session
│   └── methods (signIn, signOut, etc)
│
├── ThemeContext
│   ├── theme (light/dark)
│   └── toggleTheme()
│
└── QueryProvider
    └── React Query Client

Level 2: Server State (React Query)
├── Posts (useQuery)
├── Groups (useQuery)
├── Chat Messages (useQuery)
├── User Profile (useQuery)
└── Connections (useQuery)

Level 3: Feature State (Custom Hooks)
├── useConnections()
├── usePosts()
├── useMonetization()
├── usePWA()
└── useWebShare()

Level 4: Local State (useState)
├── Form inputs
├── Modal visibility
├── Dropdown state
└── UI interactions

Level 5: Derived State (useMemo)
├── Filtered lists
├── Computed values
└── Formatted data
```

---

## 🔐 SECURITY LAYERS

```
┌─────────────────────────────────────────────────────────────┐
│                      CAMADAS DE SEGURANÇA                    │
└─────────────────────────────────────────────────────────────┘

Layer 1: Network Security
├── HTTPS Only
├── Security Headers (Netlify)
│   ├── X-Frame-Options: DENY
│   ├── X-XSS-Protection: 1; mode=block
│   └── Content-Security-Policy
└── CORS Configuration

Layer 2: Authentication (Supabase Auth)
├── JWT Tokens
├── Session Management
├── OAuth Providers
│   ├── Google
│   ├── Apple
│   └── Instagram
└── Email/Password

Layer 3: Authorization (Row Level Security)
├── PostgreSQL RLS Policies
├── User-specific Data Access
└── Role-based Permissions

Layer 4: Input Validation
├── Client-side Validation
│   ├── Form validation (manual)
│   └── TypeScript type checking
└── Server-side Validation
    └── Supabase constraints

Layer 5: Data Protection
├── Environment Variables
│   ├── VITE_SUPABASE_URL
│   └── VITE_SUPABASE_ANON_KEY
├── .env files (gitignored)
└── No sensitive data in code
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

```
┌─────────────────────────────────────────────────────────────┐
│                  ESTRATÉGIAS DE PERFORMANCE                  │
└─────────────────────────────────────────────────────────────┘

1. Code Splitting
   ├── React.lazy() para páginas
   ├── Manual chunks (vendor-react, vendor-supabase)
   └── Dynamic imports

2. Bundle Optimization
   ├── Terser minification
   ├── Tree shaking
   ├── Gzip compression
   └── Brotli compression

3. Caching Strategies
   ├── Service Worker (PWA)
   │   ├── NetworkFirst (API calls)
   │   ├── CacheFirst (images, fonts)
   │   └── StaleWhileRevalidate (CSS/JS)
   │
   └── React Query
       ├── staleTime: 60s
       ├── Background refetch
       └── Optimistic updates

4. Asset Optimization
   ├── Image compression
   ├── SVG optimization (scripts/optimize-avatars.js)
   └── Lazy loading images

5. Runtime Performance
   ├── useMemo for expensive computations
   ├── useCallback for function refs
   └── React.memo for pure components
```

---

## 📱 PWA ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    PROGRESSIVE WEB APP                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       ▼
┌──────────────┐      ┌──────────────┐
│   PWA App    │─────▶│  Service     │
│   (React)    │      │  Worker      │
└──────┬───────┘      └──────┬───────┘
       │                     │
       │                     ├─▶ Cache Storage
       │                     │   ├── API responses
       │                     │   ├── Images
       │                     │   ├── Fonts
       │                     │   └── Static assets
       │                     │
       │                     └─▶ Background Sync
       │                         └── Offline actions
       │
       ▼
┌──────────────────────────────┐
│      Manifest.json           │
│                              │
│  • name: "ClubNath VIP"      │
│  • display: "standalone"     │
│  • orientation: "portrait"   │
│  • theme_color: "#FF6B6B"    │
│  • icons: [72..512]px        │
│  • start_url: "/"            │
└──────────────────────────────┘

Mobile Experience:
├── Install Prompt ✅
├── Splash Screen ✅
├── Offline Mode ✅
├── Push Notifications ✅
├── Background Sync ✅
└── Native-like UI ✅
```

---

## 🧪 TESTING PYRAMID

```
┌─────────────────────────────────────────────────────────────┐
│                      PIRÂMIDE DE TESTES                      │
└─────────────────────────────────────────────────────────────┘

                     ▲
                    ╱ ╲
                   ╱   ╲
                  ╱ E2E ╲               ⚠️ Faltam testes E2E
                 ╱ Tests ╲              • 0 testes Playwright
                ╱─────────╲             • Target: 10-20 tests
               ╱───────────╲
              ╱Integration ╲            ⚠️ Faltam integration
             ╱    Tests     ╲           • 0 testes de integração
            ╱───────────────╲           • Target: 50-100 tests
           ╱─────────────────╲
          ╱   Unit Tests      ╲         ✅ Alguns testes unitários
         ╱                     ╲        • 36 testes passando
        ╱───────────────────────╲       • Target: 500+ tests
       ╱─────────────────────────╲
      ╱           ⚠️              ╲
     ╱    Coverage: ~10%          ╲
    ╱     Target: 70%+             ╲
   ╱─────────────────────────────────╲
  └───────────────────────────────────┘

Atual:
├── Utils tests ✅ (19 tests)
├── Hooks tests ✅ (7 tests)
├── Component tests ✅ (8 tests)
└── Example tests ✅ (2 tests)

Faltam:
├── Services tests ❌ (0 tests)
├── Context tests ❌ (0 tests)
├── Feature tests ❌ (0 tests)
├── Integration tests ❌ (0 tests)
└── E2E tests ❌ (0 tests)
```

---

## 🔄 CI/CD PIPELINE

```
┌─────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS                          │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────┐
│          CI Pipeline               │
├────────────────────────────────────┤
│  1. Checkout code                  │
│  2. Install dependencies           │
│  3. Run linter (ESLint)            │
│  4. Type check (TypeScript)        │
│  5. Run tests (Vitest)             │
│  6. Build (Vite)                   │
│  7. Run E2E tests (Playwright)     │
└────────┬───────────────────────────┘
         │
         ▼
    ┌─────────┐
    │ Success?│
    └────┬────┘
         │
    ┌────┴────┐
    │   YES   │
    └────┬────┘
         │
         ▼
┌────────────────────────────────────┐
│         CD Pipeline                │
├────────────────────────────────────┤
│  1. Build production               │
│  2. Optimize assets                │
│  3. Deploy to Netlify              │
│  4. Deploy to GitHub Pages         │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│      Production URLs               │
├────────────────────────────────────┤
│  ✅ clubnath.netlify.app           │
│  ✅ liongab.github.io/Nathalia...  │
└────────────────────────────────────┘
```

---

## 📊 DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────┐
│                    PRINCIPAIS DEPENDÊNCIAS                   │
└─────────────────────────────────────────────────────────────┘

React Ecosystem
├── react (18.3.1)
├── react-dom (18.3.1)
└── @vitejs/plugin-react (5.0.4)

State Management
├── @tanstack/react-query (5.90.5)
│   └── @tanstack/react-query-devtools (5.90.2)
└── [Context API - built-in]

Backend & Auth
└── @supabase/supabase-js (2.76.0)
    ├── PostgreSQL (remote)
    ├── Authentication
    ├── Real-time
    └── Storage

Styling
├── tailwindcss (3.4.1)
│   └── autoprefixer (10.4.18)
├── postcss (8.4.35)
└── class-variance-authority (0.7.1)

UI Components
├── lucide-react (0.546.0)
└── tailwind-merge (3.3.1)

Build Tools
├── vite (7.1.11)
├── typescript (5.5.3)
├── terser (5.44.0)
└── esbuild (0.25.11)

PWA
├── vite-plugin-pwa (1.1.0)
├── vite-plugin-compression (0.5.1)
└── workbox-window (7.3.0)

Testing
├── vitest (3.2.4)
├── @testing-library/react (16.3.0)
└── @playwright/test (1.56.1)

Code Quality
├── eslint (9.9.1)
├── prettier (3.6.2)
└── typescript-eslint (8.3.0)

Zero Vulnerabilities ✅
```

---

## 🎯 FEATURE DEPENDENCIES

```
Features com Menos Dependências (Isoladas) ✅
├── posts/ (isolada)
├── profile/ (isolada)
└── shop/ (isolada)

Features com Dependências Moderadas
├── health/
│   └── → lib/supabase
├── safety/
│   └── → lib/supabase
└── virtual-tryon/
    └── → lib/supabase

Features com Mais Dependências
├── connections/
│   ├── → chat/services/ai-matching
│   ├── → contexts/AuthContext
│   └── → hooks/useNotifications
└── chat/
    ├── → contexts/AuthContext
    └── → lib/supabase

✅ Baixo acoplamento entre features
✅ Alta coesão dentro de cada feature
✅ Zero dependências circulares
```

---

## 📝 CONVENTIONS

### Naming Conventions

```
Files:
├── Components: PascalCase.tsx (Button.tsx, Avatar.tsx)
├── Hooks: camelCase.ts (useAuth.ts, usePosts.ts)
├── Services: kebab-case.service.ts (posts.service.ts)
├── Types: kebab-case.ts (user-profile.ts)
└── Utils: camelCase.ts (formatting.ts)

Variables:
├── Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE)
├── Functions: camelCase (fetchPosts, handleClick)
├── Components: PascalCase (Button, UserCard)
└── Types: PascalCase (User, PostType)

Folders:
├── Features: kebab-case (virtual-tryon/)
├── Components: kebab-case (ui/, groups/)
└── Others: kebab-case (design-system/)
```

### Code Organization

```
Component Structure:
1. Imports
2. Type definitions
3. Constants
4. Component function
5. Hooks (useState, useEffect, custom)
6. Event handlers
7. Render helpers
8. Return JSX

Service Structure:
1. Imports
2. Types
3. Constants
4. Helper functions
5. Service object
6. Export
```

---

**Documento criado em:** 25 de outubro de 2025  
**Versão:** 1.0

> Para análise detalhada, consulte [ANALISE-ARQUITETURA-MOBILE.md](./ANALISE-ARQUITETURA-MOBILE.md)
