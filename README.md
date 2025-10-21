# 🌸 ClubNath - App de Bem-Estar para Mulheres

> **Comunidade exclusiva da Nathalia Arcuri**  
> 29M+ seguidores • Conteúdo exclusivo • Suporte prioritário

## 🚀 **Live Demo**
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site-name)

**🌐 [clubnath.netlify.app](https://clubnath.netlify.app)**

## 📱 **Sobre o App**

O ClubNath é uma comunidade exclusiva que combina:
- **Feed Social** - Conecte-se com outras mães
- **Conteúdo Exclusivo** - Lives privadas da Nath
- **Suporte Prioritário** - Respostas diretas em 24h
- **Tracking de Hábitos** - Formação de rotinas saudáveis
- **Journaling** - Reflexão pessoal e autoconhecimento

## 🛠️ **Stack Tecnológico**

### **Frontend**
- ⚛️ **React 18** + TypeScript
- 🎨 **Tailwind CSS** (mobile-first)
- ⚡ **Vite** (build otimizado)
- 📱 **PWA** (Progressive Web App)

### **Backend**
- 🗄️ **Supabase** (PostgreSQL + Auth + Storage)
- 🔄 **React Query** (cache inteligente)
- 📊 **Analytics** (performance monitoring)

### **Deploy**
- 🌐 **Netlify** (deploy automático)
- 📦 **GitHub Actions** (CI/CD)
- 🔒 **HTTPS** + Security Headers

## 🎯 **Features Implementadas**

### ✅ **Performance**
- React Query para cache inteligente
- Lazy loading de componentes
- Bundle otimizado (7.26KB gzipped)
- PWA com Service Worker

### ✅ **Mobile-First**
- Safe area insets (iPhone X+)
- Touch targets 44px+
- Overscroll prevention
- TikTok-style feed

### ✅ **Monetização**
- Login com Instagram (zero fricção)
- Onboarding de conversão
- Freemium vs Premium (R$ 39/mês)
- Smart banner timing

### ✅ **Qualidade**
- Testes unitários (Vitest)
- Linting (ESLint + Prettier)
- TypeScript (type safety)
- Performance monitoring

## 🚀 **Como Executar**

### **Desenvolvimento**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar testes
npm run test

# Build para produção
npm run build
```

### **Deploy**
```bash
# Push para GitHub (deploy automático no Netlify)
git add .
git commit -m "feat: nova feature"
git push origin main
```

## 📊 **Métricas de Performance**

```
Bundle Size (gzipped):
├── FeedPage: 7.26KB
├── React: 44.67KB
├── Supabase: 41.83KB
└── Total: ~95KB

PWA Features:
├── Service Worker: ✅ Ativo
├── Cache: ✅ 40 entradas (1.57MB)
├── Compression: ✅ Gzip + Brotli
└── Offline: ✅ Funcional
```

## 🎯 **Estratégia de Lançamento**

### **Fase 1: Soft Launch (7 dias)**
- Beta com 100 seguidores engajados
- Meta: 20 assinantes (R$ 780/mês)

### **Fase 2: Lançamento Oficial (14 dias)**
- Campanha nos Stories do Instagram
- Meta: 100 assinantes (R$ 3.900/mês)

### **Fase 3: Escala (30+ dias)**
- Otimização de conversão
- Meta: 1.000 assinantes (R$ 39.000/mês)

## 🔧 **Configuração**

### **Variáveis de Ambiente**

**⚠️ IMPORTANTE: Configure as variáveis de ambiente antes de usar o app!**

1. **Obter Chaves do Supabase:**
   - Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
   - Copie a URL e a chave anon

2. **Criar arquivo `.env` na raiz do projeto:**
```env
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_REAL_AQUI
VITE_INSTAGRAM_CLIENT_ID=SEU_CLIENT_ID_AQUI
```

3. **Configurar no Netlify:**
   - Site Settings → Environment Variables
   - Adicionar as mesmas variáveis

### **Setup do Supabase**

**⚠️ CRÍTICO: Execute as migrations do Supabase antes de usar o app!**

1. **Acessar o Supabase:**
   - URL: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
   - Vá para: SQL Editor

2. **Executar Migrations:**
   ```sql
   -- Execute os arquivos em ordem:
   -- 1. supabase/migrations/setup-database.sql
   -- 2. supabase/migrations/setup_auth_trigger.sql
   -- 3. supabase/migrations/20251021_onboarding_system.sql
   ```

3. **Verificar Configuração:**
   - Authentication → Settings
   - Site URL: https://clubnath.netlify.app
   - Redirect URLs: https://clubnath.netlify.app/**

**📖 Guia Completo:** [docs/setup/SUPABASE_SETUP.md](docs/setup/SUPABASE_SETUP.md)

### **Netlify**
- Deploy automático via GitHub
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

## 📱 **PWA Features**

- ✅ **Instalável** - Adicionar à tela inicial
- ✅ **Offline** - Funciona sem internet
- ✅ **Push Notifications** - Engajamento proativo
- ✅ **App-like** - Experiência nativa

## 🧪 **Testes**

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📈 **Analytics**

- **Performance**: Web Vitals
- **Usage**: React Query DevTools
- **Errors**: Console monitoring
- **Conversion**: Custom tracking

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto é propriedade da Nathalia Arcuri e está protegido por direitos autorais.

## 📞 **Contato**

- **Instagram**: [@nathalia_arcuri](https://instagram.com/nathalia_arcuri)
- **Email**: contato@nathaliaarcuri.com.br
- **Website**: [nathaliaarcuri.com.br](https://nathaliaarcuri.com.br)

---

**🌸 Feito com amor para a comunidade ClubNath**