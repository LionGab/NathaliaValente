# ClubNath VIP - Comunidade Exclusiva de Mães

[![Deploy Status](https://img.shields.io/badge/deploy-netlify-00C7B7?style=for-the-badge&logo=netlify)](https://clubnath.netlify.app/)
[![CI Status](https://github.com/LionGab/NathaliaValente/workflows/CI%20-%20Build%20%26%20Test/badge.svg)](https://github.com/LionGab/NathaliaValente/actions)
[![codecov](https://codecov.io/gh/LionGab/NathaliaValente/branch/main/graph/badge.svg)](https://codecov.io/gh/LionGab/NathaliaValente)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🌟 Sobre o Projeto

ClubNath VIP é uma Progressive Web App (PWA) exclusiva para a comunidade de seguidoras da influenciadora Nathália Valente. Uma plataforma moderna, segura e otimizada para dispositivos móveis.

### ✨ Features Principais

- 💬 **Feed Social** - Compartilhe momentos e conecte-se com outras mães
- 👥 **Grupos Temáticos** - Discussões focadas em temas específicos
- 💌 **Mensagens Diretas** - Conversas privadas e seguras
- 📚 **Estudos Bíblicos** - Conteúdo espiritual exclusivo
- 🎁 **Loja Premium** - Produtos exclusivos da marca
- 📱 **PWA** - Instale no celular para experiência de app nativo
- 🔒 **Assinatura Premium** - Conteúdo exclusivo para assinantes

---

## 🚀 Tech Stack

### Frontend

- **Framework:** React 18.3 + TypeScript 5.5
- **Build Tool:** Vite 7.1
- **Styling:** TailwindCSS 3.4 + NativeWind patterns
- **State Management:** React Query (TanStack Query) + Context API
- **PWA:** Vite PWA Plugin + Service Worker

### Backend

- **BaaS:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Authentication:** Supabase Auth (JWT)
- **Database:** PostgreSQL 15 com Row Level Security (RLS)

### DevOps & Quality

- **CI/CD:** GitHub Actions
- **Testing:** Vitest + React Testing Library + Playwright
- **Linting:** ESLint + Prettier
- **Type Safety:** TypeScript Strict Mode
- **Error Monitoring:** Sentry
- **Deployment:** Netlify

---

## 📦 Instalação

### Pré-requisitos

- Node.js >= 20.19.0
- npm >= 10.0.0

### Setup

```bash
# Clone o repositório
git clone https://github.com/LionGab/NathaliaValente.git
cd NathaliaValente

# Instale dependências
npm ci

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build de produção
npm run preview          # Preview do build local

# Qualidade de Código
npm run lint             # Executa ESLint
npm run typecheck        # Verifica tipos TypeScript
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação

# Testes
npm run test             # Testes em watch mode
npm run test:run         # Executa todos os testes
npm run test:coverage    # Testes com cobertura
npm run test:e2e         # Testes end-to-end com Playwright
npm run test:all         # Todos os testes (unit + e2e)
```

---

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Design system (Button, Input, etc)
│   └── shared/         # Componentes de negócio
├── features/           # Features completas
│   ├── auth/           # Autenticação
│   ├── chat/           # Chat e mensagens
│   ├── groups/         # Grupos
│   └── posts/          # Posts e feed
├── lib/                # Bibliotecas e configurações
│   ├── supabase.ts     # Cliente Supabase
│   ├── sentry.ts       # Monitoramento de erros
│   └── env-validator.ts # Validação de ambiente
├── hooks/              # React hooks customizados
├── contexts/           # Context providers
├── services/           # Lógica de negócio
├── utils/              # Funções utilitárias
└── types/              # TypeScript types

```

### Padrões de Desenvolvimento

Ver [CLAUDE.md](./CLAUDE.md) para diretrizes completas de desenvolvimento.

---

## 🔒 Segurança

### Práticas Implementadas

- ✅ **Row Level Security (RLS)** ativo em todas as tabelas
- ✅ **Variáveis de ambiente** nunca commitadas
- ✅ **Pre-commit hooks** para detectar segredos
- ✅ **Validação de inputs** em todos os formulários
- ✅ **Sanitização de HTML** para prevenir XSS
- ✅ **Headers de segurança** configurados (CSP, X-Frame-Options)
- ✅ **Dependências auditadas** automaticamente no CI

### Documentação de Segurança

- [SECURITY.md](./SECURITY.md) - Guia completo de segurança
- [DATABASE.md](./DATABASE.md) - Arquitetura e RLS do banco de dados

### Reportar Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, **NÃO** crie uma issue pública.
Envie um email para: security@clubnath.app

---

## 🧪 Testes

### Cobertura de Testes

- **Threshold Mínimo:** 70% (branches, functions, lines, statements)
- **Ferramentas:** Vitest (unit) + Playwright (e2e)

```bash
# Ver relatório de cobertura
npm run test:coverage
open coverage/index.html
```

### Estratégia de Testes

1. **Unit Tests** - Hooks, utilities, componentes isolados
2. **Integration Tests** - Fluxos completos de features
3. **E2E Tests** - Jornadas críticas de usuário

Ver [TESTING.md](./TESTING.md) para mais detalhes.

---

## 📊 Performance

### Métricas Atuais

- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size:** ~165KB (vendor) + ~45KB (app)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s

### Otimizações

- ✅ Code splitting por rota
- ✅ Lazy loading de componentes pesados
- ✅ Compressão Gzip/Brotli
- ✅ Service Worker com cache estratégico
- ✅ Otimização de imagens
- ✅ React Query para cache de dados

---

## 🚀 Deploy

### Netlify (Produção)

Deploy automático via GitHub Actions:

```bash
git push origin main
# Deploy é executado automaticamente
```

### Variáveis de Ambiente (Netlify)

Configure em: Site settings > Build & deploy > Environment

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
VITE_SENTRY_DSN=https://xxx@sentry.io/yyy
VITE_APP_URL=https://clubnath.netlify.app
VITE_ENVIRONMENT=production
```

---

## 🤝 Contribuindo

### Workflow

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Regras

- ✅ TypeScript strict mode
- ✅ Todos os testes devem passar
- ✅ Cobertura mínima de 70%
- ✅ ESLint e Prettier devem passar
- ✅ Commits devem seguir Conventional Commits

---

## 📝 Documentação Adicional

### Desenvolvimento

- [CLAUDE.md](./CLAUDE.md) - Diretrizes para desenvolvimento
- [SECURITY.md](./SECURITY.md) - Guia de segurança
- [DATABASE.md](./DATABASE.md) - Arquitetura do banco de dados
- [TESTING.md](./TESTING.md) - Estratégia de testes
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Design system e componentes

### Code Review e Melhorias

- [QUICK_START.md](./QUICK_START.md) - ⚡ Comece aqui! Guia rápido de melhorias
- [CODE_REVIEW_SUMMARY.md](./CODE_REVIEW_SUMMARY.md) - Sumário executivo da revisão
- [CODE_REVIEW_REPORT.md](./CODE_REVIEW_REPORT.md) - Relatório completo de revisão
- [CODE_IMPROVEMENTS_GUIDE.md](./CODE_IMPROVEMENTS_GUIDE.md) - Guia prático com exemplos

---

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

## 👥 Time

- **Product Owner:** Nathália Valente
- **Tech Lead:** [LionGab](https://github.com/LionGab)
- **Desenvolvimento:** ClubNath Dev Team

---

## 🙏 Agradecimentos

- Comunidade de mães que inspira este projeto
- Time de desenvolvimento e design
- Tecnologias open source que tornam isso possível

---

**Made with 💖 for the ClubNath community**
