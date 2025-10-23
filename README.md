# 🌸 ClubNath VIP - Comunidade Premium para Mulheres

> **Plataforma exclusiva da Nathalia Arcuri**
> 35M+ seguidoras • Design Premium • Tecnologia de Ponta

## 🚀 **Live Demo**
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site-name)

**🌐 [clubnath.netlify.app](https://clubnath.netlify.app)**

---

## ✨ **O que é o ClubNath VIP?**

Uma comunidade premium para mulheres que buscam conexão, crescimento e transformação. Design de nível internacional, experiência mobile-first impecável, e funcionalidades exclusivas para uma comunidade engajada de mais de 35 milhões de seguidoras.

---

## 🎯 **Features Implementadas**

### **🏠 Feed Social Premium**
- Posts com imagens, categorias e badges
- Sistema de likes e comentários em tempo real
- Infinite scroll otimizado
- Compartilhamento web nativo
- Salvamento de posts
- Animações Framer Motion suaves

### **📅 Eventos & Calendário** ✨ NOVO
- Calendário visual interativo
- Workshops, lives, meetups, webinars e masterclasses
- Sistema de registro com controle de vagas
- Eventos online e presenciais
- Eventos premium e gratuitos
- Notificações de eventos

### **👥 Sistema de Conexões** ✨ NOVO
- Seguir/deixar de seguir membras
- Contadores de seguidores/seguindo
- Lista de seguidores mútuos
- Sugestões de usuários para seguir
- Perfis personalizáveis

### **👫 Grupos Temáticos**
- Círculos de interesse
- Chat em grupo
- Posts exclusivos do grupo
- Sistema de moderação
- Categorias organizadas

### **💬 Chat Inteligente com IA**
- Conversas com a Nath (AI-powered)
- Histórico de conversas
- Respostas contextualizadas
- Interface moderna

### **🎯 Badges & Conquistas**
- Sistema de gamificação
- Badges por participação
- Progresso visual
- Conquistas desbloqueáveis

### **📔 Journaling**
- Diário pessoal privado
- Mood tracking
- Reflexões diárias
- Histórico completo

### **🙏 Orações & Fé**
- Pedidos de oração da comunidade
- Respostas e testemunhos
- Suporte espiritual mútuo

### **📚 Estudos Bíblicos**
- Conteúdo diário
- Estudos temáticos
- Progresso personalizado

### **🎨 Design Premium**
- Animações Framer Motion
- Glassmorphism moderno
- Gradientes suaves
- Micro-interações delicadas
- Paleta rosé, lilás e dourado
- 100% responsivo (mobile-first)

---

## 🛠️ **Stack Tecnológico**

### **Frontend**
- ⚛️ **React 18** + **TypeScript 5.3** (strict mode)
- 🎨 **Tailwind CSS** + **NativeWind** (mobile-first design)
- 🎭 **Framer Motion** (animações profissionais)
- ⚡ **Vite 7** (build ultra-rápido)
- 📱 **PWA** (Progressive Web App)

### **Backend & Database**
- 🗄️ **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- 🔐 **Row Level Security (RLS)** para segurança máxima
- 📊 **React Query (TanStack)** para cache inteligente
- 🔄 **Realtime subscriptions** para notificações instantâneas

### **Deploy & CI/CD**
- 🌐 **Netlify** (deploy automático)
- 📦 **GitHub Actions** (CI/CD pipeline)
- 🔒 **HTTPS** + Security Headers
- 🗜️ **Gzip + Brotli** compression

---

## 📊 **Performance Metrics**

```
Bundle Size (gzipped):
├── EventsPage: 4.96KB ✨
├── FeedPage: 5.22KB
├── ChatPage: 10.20KB
├── React: 44.99KB
├── Supabase: 41.83KB
└── Total: ~107KB

PWA Features:
├── Service Worker: ✅ Ativo
├── Cache: ✅ Otimizado
├── Compression: ✅ Gzip + Brotli
├── Offline: ✅ Funcional
└── Lighthouse: 🎯 90+ score

Build Time: ⚡ ~8 segundos
```

---

## 🚀 **Quick Start**

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Configurar Supabase**

Crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
VITE_INSTAGRAM_CLIENT_ID=seu_instagram_client_id_aqui
VITE_ENV=development
```

**📖 Guia completo:** [docs/SUPABASE_SETUP_COMPLETE.md](docs/SUPABASE_SETUP_COMPLETE.md)

### **3. Executar Migrações**

No SQL Editor do Supabase, execute em ordem:
```sql
-- 1. Setup básico
supabase/migrations/setup-database.sql
supabase/migrations/setup_auth_trigger.sql

-- 2. Sistemas principais
supabase/migrations/20250121_badges_system.sql
supabase/migrations/20250121_groups_system.sql
...

-- 3. ✨ Novas features
supabase/migrations/20251023_events_system.sql
supabase/migrations/20251023_followers_system.sql
```

### **4. Iniciar Desenvolvimento**
```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) 🎉

---

## 📦 **Comandos Disponíveis**

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (Vite)
npm run preview          # Preview da build de produção

# Build & Deploy
npm run build            # Build otimizado para produção
npm run typecheck        # Verificar erros TypeScript

# Qualidade de Código
npm run lint             # ESLint
npm run format           # Prettier (auto-fix)
npm run format:check     # Verificar formatação

# Testes
npm run test             # Executar testes (Vitest)
npm run test:ui          # Interface visual de testes
npm run test:coverage    # Coverage report

# Otimizações
npm run optimize-avatars # Otimizar imagens de avatares
```

---

## 🌐 **Deploy no Netlify**

### **Opção 1: Deploy Automático (Recomendado)**

1. Conecte o repositório ao Netlify
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_INSTAGRAM_CLIENT_ID`
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 20
4. Deploy! 🚀

### **Opção 2: Deploy Manual**

```bash
# Build
npm run build

# Deploy com Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🎨 **Design System**

### **Cores**
```javascript
// Paleta Premium
primary: {
  50: '#fdf2f8',   // Rosa clarinho
  500: '#ec4899',  // Rosa principal
  600: '#db2777',  // Rosa escuro
}

secondary: {
  50: '#faf5ff',   // Lilás clarinho
  500: '#a855f7',  // Lilás principal
  600: '#9333ea',  // Lilás escuro
}

// Gradientes
from-pink-500 via-purple-600 to-indigo-700
from-pink-500 to-purple-600
```

### **Animações Framer Motion**
```javascript
// Fade in com movimento
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: 'easeOut' }}

// Hover suave
whileHover={{ y: -4, scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Pulso contínuo
animate={{ scale: [1, 1.05, 1] }}
transition={{ duration: 2, repeat: Infinity }}
```

### **Tipografia**
- **Família:** Inter (moderna e legível)
- **Tamanhos:** 0.75rem → 2.25rem (mobile-first)
- **Pesos:** 400 (normal), 600 (semibold), 700 (bold)

---

## 📁 **Estrutura do Projeto**

```
src/
├── components/
│   ├── EventsPage.tsx           # ✨ Sistema de eventos
│   ├── FeedPage.tsx             # Feed com Framer Motion
│   ├── CreatePostModal.tsx      # Modal animado
│   ├── Navigation.tsx           # Nav com animações
│   ├── groups/                  # Grupos temáticos
│   ├── badges/                  # Sistema de badges
│   ├── ui/                      # Design system
│   └── ...
├── services/
│   ├── events.service.ts        # ✨ API de eventos
│   ├── followers.service.ts     # ✨ API de followers
│   ├── posts.service.ts
│   └── ...
├── types/
│   ├── events.ts                # ✨ Tipos de eventos
│   ├── followers.ts             # ✨ Tipos de followers
│   └── ...
├── hooks/
│   ├── useQueries.ts            # React Query hooks
│   ├── useGestures.ts           # Gestos mobile
│   └── ...
├── contexts/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── QueryProvider.tsx
├── lib/
│   ├── supabase/                # Cliente Supabase
│   └── utils.ts                 # Utilidades
└── App.tsx                      # App principal

supabase/migrations/
├── 20251023_events_system.sql      # ✨ Migração eventos
├── 20251023_followers_system.sql   # ✨ Migração followers
└── ...
```

---

## 🔐 **Segurança**

- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **Políticas de acesso** granulares por usuário
- ✅ **Autenticação JWT** via Supabase
- ✅ **HTTPS** obrigatório em produção
- ✅ **Security Headers** configurados
- ✅ **Sanitização** de inputs
- ✅ **Rate limiting** no backend

---

## 📱 **PWA Features**

- ✅ **Instalável** - Adicionar à tela inicial
- ✅ **Offline-first** - Funciona sem internet
- ✅ **Push Notifications** - Engajamento proativo
- ✅ **Service Worker** - Cache inteligente
- ✅ **Manifest** - Ícones e splash screens
- ✅ **App-like** - Experiência nativa no mobile

---

## 🧪 **Testes**

```bash
# Executar todos os testes
npm run test

# Testes com UI
npm run test:ui

# Coverage completo
npm run test:coverage
```

### **O que testamos:**
- ✅ Componentes UI (React Testing Library)
- ✅ Hooks customizados
- ✅ Utilidades e helpers
- ✅ Integração com Supabase

---

## 🐛 **Troubleshooting**

### **Erro: Cannot find module '@supabase/supabase-js'**
```bash
npm install
```

### **Erro: VITE_SUPABASE_URL is not defined**
- Certifique-se de que o arquivo `.env` existe
- Reinicie o servidor de desenvolvimento

### **Build falha no Netlify**
- Verifique as variáveis de ambiente no Netlify
- Node version deve ser 20+
- Verifique os logs de build

### **Supabase RLS bloqueando queries**
- Veja [docs/SUPABASE_SETUP_COMPLETE.md](docs/SUPABASE_SETUP_COMPLETE.md)
- Teste as políticas no SQL Editor

---

## 📈 **Roadmap**

### **Em Progresso** 🚧
- [ ] Sistema de pagamentos (Stripe)
- [ ] Notificações push nativas
- [ ] App mobile nativo (React Native)

### **Planejado** 🎯
- [ ] Vídeo chamadas em grupo
- [ ] Marketplace de produtos
- [ ] Cursos online integrados
- [ ] Dashboard de analytics

### **Concluído** ✅
- [x] Sistema de eventos e calendário
- [x] Sistema de followers/conexões
- [x] Animações Framer Motion
- [x] Design premium glassmorphism
- [x] Feed social completo
- [x] Grupos temáticos
- [x] Chat com IA
- [x] Sistema de badges
- [x] PWA funcional

---

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### **Padrões de Código**
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configurados
- ✅ Commits semânticos (feat, fix, docs, refactor)
- ✅ Testes para novas features
- ✅ Mobile-first sempre

---

## 📄 **Licença**

Este projeto é propriedade da **Nathalia Arcuri** e está protegido por direitos autorais.
© 2025 ClubNath. Todos os direitos reservados.

---

## 📞 **Contato & Suporte**

- 📧 **Email:** contato@nathaliaarcuri.com.br
- 📱 **Instagram:** [@nathalia_arcuri](https://instagram.com/nathalia_arcuri)
- 🌐 **Website:** [nathaliaarcuri.com.br](https://nathaliaarcuri.com.br)
- 💬 **Suporte:** [discord.gg/clubnath](https://discord.gg/clubnath)

---

<div align="center">

**🌸 Feito com amor para a comunidade ClubNath 🌸**

*Design premium • Tecnologia de ponta • Experiência incomparável*

[⭐ Star no GitHub](https://github.com/seu-usuario/clubnath) • [🐛 Report Bug](https://github.com/seu-usuario/clubnath/issues) • [✨ Request Feature](https://github.com/seu-usuario/clubnath/issues)

</div>
