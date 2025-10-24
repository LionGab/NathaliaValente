# 🚀 ClubNath VIP - Guia de Deploy

## 📋 Visão Geral

Este guia fornece instruções completas para fazer deploy do ClubNath VIP em produção. O projeto é uma PWA (Progressive Web App) construída com React + Vite + Supabase.

## 🎯 Pré-requisitos

### Contas Necessárias
- [ ] **Netlify** - Para hosting e deploy automático
- [ ] **Supabase** - Para backend (auth, database, storage)
- [ ] **GitHub** - Para repositório e CI/CD

### Ferramentas
- [ ] **Node.js 20+** - Para build local
- [ ] **Git** - Para versionamento
- [ ] **Editor de código** - VS Code recomendado

## 🔧 Configuração Inicial

### 1. Clone o Repositório

`ash
git clone https://github.com/seu-usuario/clubnath-vip.git
cd clubnath-vip
`

### 2. Instale Dependências

`ash
npm install
`

### 3. Configure Variáveis de Ambiente

Copie o arquivo de exemplo:
`ash
cp .env.example .env
`

Edite o arquivo .env com suas credenciais:

`nv
# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# App Configuration
VITE_APP_URL=https://clubnath.app
VITE_ENVIRONMENT=production
VITE_APP_NAME=ClubNath VIP
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=true

# External Services (OPCIONAL)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
`

## 🗄️ Configuração do Supabase

### 1. Crie um Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Configure:
   - **Name**: clubnath-vip
   - **Database Password**: Gere uma senha forte
   - **Region**: Escolha a mais próxima do seu público

### 2. Configure as Tabelas

Execute as migrações SQL localizadas em supabase/migrations/:

`ash
# Via Supabase CLI (recomendado)
supabase db push

# Ou via Dashboard
# Copie e cole cada arquivo SQL no SQL Editor
`

### 3. Configure Storage

Crie os buckets necessários:

`sql
-- Bucket para avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Bucket para imagens de posts
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);

-- Bucket para imagens de grupos
INSERT INTO storage.buckets (id, name, public) VALUES ('group-covers', 'group-covers', true);
`

### 4. Configure Políticas RLS

As políticas estão incluídas nas migrações, mas verifique se estão ativas:

`sql
-- Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
`

## 🌐 Configuração do Netlify

### 1. Conecte o Repositório

1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte sua conta GitHub
4. Selecione o repositório clubnath-vip

### 2. Configure o Build

**Build settings:**
- **Build command**: 
pm run build
- **Publish directory**: dist
- **Node version**: 20

### 3. Configure Variáveis de Ambiente

No painel do Netlify, vá em **Site settings > Environment variables** e adicione:

`
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_APP_URL=https://seu-dominio.netlify.app
VITE_ENVIRONMENT=production
VITE_APP_NAME=ClubNath VIP
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=true
`

### 4. Configure Headers de Segurança

O arquivo 
etlify.toml já está configurado com:
- Content Security Policy (CSP)
- X-Frame-Options
- HSTS
- Permissions Policy

## 🚀 Deploy

### Deploy Automático

O deploy é automático via GitHub:

1. **Faça commit das mudanças:**
`ash
git add .
git commit -m "feat: prepare for production deploy"
git push origin main
`

2. **Netlify fará deploy automaticamente**
3. **Acesse o link fornecido pelo Netlify**

### Deploy Manual

Se preferir deploy manual:

`ash
# Build local
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
`

## 🔍 Verificação Pós-Deploy

### 1. Teste Funcionalidades Básicas

- [ ] **Página inicial carrega**
- [ ] **Autenticação funciona** (login/signup)
- [ ] **Feed de posts carrega**
- [ ] **Chat funciona**
- [ ] **Grupos carregam**
- [ ] **Perfil funciona**

### 2. Teste PWA

- [ ] **Instalação funciona** (botão "Instalar")
- [ ] **Funciona offline** (desconecte internet)
- [ ] **Service Worker ativo** (DevTools > Application)
- [ ] **Manifest válido** (DevTools > Application)

### 3. Teste Performance

- [ ] **Lighthouse Score > 90**
- [ ] **First Contentful Paint < 2s**
- [ ] **Largest Contentful Paint < 2.5s**
- [ ] **Cumulative Layout Shift < 0.1**

### 4. Teste Mobile

- [ ] **Responsivo em mobile**
- [ ] **Touch targets adequados**
- [ ] **Navegação funciona**
- [ ] **PWA instala no mobile**

## 🛠️ Troubleshooting

### Problemas Comuns

#### Build Falha
`ash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build
`

#### Erro de CORS
- Verifique se VITE_APP_URL está correto
- Configure CORS no Supabase Dashboard

#### PWA Não Funciona
- Verifique se VITE_ENABLE_PWA=true
- Confirme se manifest.json está sendo servido
- Verifique Service Worker no DevTools

#### Erro de Autenticação
- Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
- Confirme se as políticas RLS estão ativas
- Verifique se o projeto Supabase está ativo

### Logs e Debug

#### Netlify Logs
`ash
# Via CLI
netlify logs

# Via Dashboard
Site settings > Functions > View logs
`

#### Supabase Logs
- Dashboard > Logs > API
- Dashboard > Logs > Auth
- Dashboard > Logs > Database

## 📊 Monitoramento

### Métricas Importantes

- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%
- **Response Time**: < 500ms
- **PWA Score**: > 90

### Ferramentas Recomendadas

- **Netlify Analytics** - Métricas básicas
- **Google Analytics** - Análise de usuários
- **Sentry** - Error tracking
- **Lighthouse CI** - Performance monitoring

## 🔒 Segurança

### Checklist de Segurança

- [ ] **HTTPS ativo** (Netlify automático)
- [ ] **Headers de segurança** configurados
- [ ] **CSP configurado** corretamente
- [ ] **RLS ativo** no Supabase
- [ ] **API keys** não expostas no frontend
- [ ] **Rate limiting** configurado

### Backup

- [ ] **Database backup** automático (Supabase)
- [ ] **Código versionado** (GitHub)
- [ ] **Variáveis de ambiente** documentadas

## 🎯 Próximos Passos

### Após Deploy Inicial

1. **Configure domínio personalizado**
2. **Implemente analytics**
3. **Configure error tracking**
4. **Otimize performance**
5. **Implemente testes automatizados**

### Melhorias Futuras

- **CDN** para assets estáticos
- **Edge functions** para lógica serverless
- **A/B testing** para otimização
- **Monitoring avançado** com alertas

## 📞 Suporte

### Recursos

- **Documentação**: [docs.clubnath.app](https://docs.clubnath.app)
- **GitHub Issues**: [github.com/clubnath/vip/issues](https://github.com/clubnath/vip/issues)
- **Discord**: [discord.gg/clubnath](https://discord.gg/clubnath)

### Contato

- **Email**: dev@clubnath.app
- **Telegram**: @clubnath_dev

---

**Última atualização**: 23 de outubro de 2025
**Versão**: 1.0.0
