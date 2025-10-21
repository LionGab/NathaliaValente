# 🚀 Guia de Deploy - ClubNath no Netlify

Guia completo para fazer deploy da aplicação ClubNath no Netlify em 5 minutos.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem:

- ✅ Conta no GitHub (código já está no repositório)
- ✅ Conta no Netlify (grátis em https://netlify.com)
- ✅ Projeto Supabase configurado (bbcwitnbnosyfpfjtzkr)
- ✅ SUPABASE_ANON_KEY disponível

---

## ⚡ Deploy Rápido (5 minutos)

### Método 1: Deploy via GitHub (Recomendado)

#### 1. Conectar Repositório ao Netlify

1. Acesse: https://app.netlify.com/start
2. Clique em **"Import from Git"**
3. Escolha **GitHub**
4. Selecione o repositório: `LionGab/boltnathH`
5. Configure o deploy:

**Build settings:**
```
Build command:     npm run build
Publish directory: dist
```

**Esses valores já estão em `netlify.toml`, então o Netlify detecta automaticamente! ✅**

#### 2. Configurar Variáveis de Ambiente

No Netlify Dashboard:

1. Vá em **Site settings** > **Environment variables**
2. Clique em **Add a variable**
3. Adicione as seguintes variáveis:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://bbcwitnbnosyfpfjtzkr.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | [Sua chave do Supabase] |

**Como obter a ANON KEY:**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
2. Copie o valor em **Project API keys** > **anon/public**

#### 3. Deploy!

1. Clique em **"Deploy site"**
2. Aguarde ~2-3 minutos
3. Pronto! Seu app estará em `https://SEU-SITE.netlify.app` 🎉

---

### Método 2: Deploy via Netlify CLI (Avançado)

#### 1. Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login no Netlify

```bash
netlify login
```

#### 3. Inicializar Projeto

```bash
netlify init
```

Siga o wizard:
- **Create & configure a new site**: Yes
- **Team**: Escolha seu time
- **Site name**: clubnath (ou nome desejado)
- **Build command**: `npm run build`
- **Directory to deploy**: `dist`

#### 4. Configurar Variáveis de Ambiente

```bash
netlify env:set VITE_SUPABASE_URL "https://bbcwitnbnosyfpfjtzkr.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "sua_anon_key_aqui"
```

#### 5. Deploy

```bash
# Deploy de produção
netlify deploy --prod

# Ou deploy de preview primeiro
netlify deploy
```

---

## 🔧 Configurações Incluídas

O projeto já está configurado com:

### ✅ `netlify.toml`
- Build command e publish directory
- Node.js versão 18
- Redirects para SPA routing
- Headers de segurança (CSP, X-Frame-Options, etc.)
- Cache otimizado para assets estáticos
- Preconnect hints para performance

### ✅ `public/_redirects`
- Fallback para index.html (SPA routing)

### ✅ `public/_headers`
- Security headers
- Cache policies para assets
- CORS para fonts

### ✅ `.env.example`
- Template com variáveis necessárias
- Instruções de configuração

---

## 📊 Verificação Pós-Deploy

Depois do deploy, verifique:

### 1. Build bem-sucedido
- ✅ No dashboard do Netlify, veja se o build passou
- ✅ Logs devem mostrar "Site is live"

### 2. Variáveis de ambiente
```bash
# Via CLI
netlify env:list

# Ou no dashboard:
# Site settings > Environment variables
```

### 3. Teste a aplicação

Acesse `https://SEU-SITE.netlify.app` e teste:

- ✅ Página inicial carrega
- ✅ Login/Signup funciona (Supabase conectado)
- ✅ Feed carrega posts
- ✅ Chat com Robô Nath funciona
- ✅ Tema claro/escuro funciona
- ✅ Navegação funciona
- ✅ Imagens carregam

### 4. Headers e Performance

Use ferramentas para verificar:

**Security Headers:**
- https://securityheaders.com/
- Deve obter nota **A** ou superior

**Performance:**
- https://pagespeed.web.dev/
- Lighthouse no Chrome DevTools
- Deve ter score > 90

**PWA:**
- Lighthouse > PWA
- Deve ser "installable"

---

## 🌐 Domínio Customizado (Opcional)

### Adicionar Domínio Próprio

1. No Netlify Dashboard: **Domain settings** > **Add custom domain**
2. Digite seu domínio: `clubnath.com.br`
3. Siga instruções para configurar DNS

**Configuração DNS:**
```
Type    Name    Value
CNAME   www     SEU-SITE.netlify.app
A       @       75.2.60.5
```

### SSL Automático

- ✅ Netlify gera certificado SSL automaticamente
- ✅ Aguarde 1-2 minutos após adicionar domínio
- ✅ HTTPS forçado por padrão

---

## 🔄 Deploy Contínuo

### Configuração Automática

Com GitHub conectado, **todo push para `main`** dispara deploy automático!

```bash
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main

# Deploy automático inicia! 🚀
```

### Deploy Previews

**Pull Requests geram previews automáticos:**
1. Crie um PR no GitHub
2. Netlify gera URL de preview
3. Teste antes de mergear
4. URL: `https://deploy-preview-123--SEU-SITE.netlify.app`

### Branch Deploys

Configure branches específicas para deploy:

1. **Site settings** > **Build & deploy** > **Continuous deployment**
2. **Branch deploys**: All / None / Let me add individual branches
3. Adicione branches: `develop`, `staging`, etc.

---

## 🐛 Troubleshooting

### Build falha

**Erro:** `Module not found`

**Solução:**
```bash
# Localmente, limpe e reinstale
rm -rf node_modules package-lock.json
npm install
npm run build

# Se funcionar, commit do package-lock.json
git add package-lock.json
git commit -m "fix: Update package-lock.json"
git push
```

**Erro:** `vite: not found`

**Solução:**
- Verifique `package.json` tem `vite` em `devDependencies`
- Limpe cache do Netlify: **Site settings** > **Build & deploy** > **Clear cache and deploy site**

### Variáveis de ambiente não funcionam

**Sintomas:**
- Erro de conexão com Supabase
- "Invalid API key"

**Solução:**
1. Verifique nomes: devem começar com `VITE_`
2. Re-adicione variáveis no dashboard
3. Trigger novo deploy: **Deploys** > **Trigger deploy** > **Clear cache and deploy site**

### Páginas 404 ao navegar

**Sintoma:**
- `https://site.com/feed` dá 404
- Apenas home funciona

**Solução:**
- Verifique `netlify.toml` tem redirect `/* -> /index.html`
- Verifique `public/_redirects` existe
- Re-deploy

### Chat não funciona

**Sintomas:**
- "Failed to fetch" no console
- Mensagens não enviam

**Solução:**
1. Verifique Edge Function está deployada no Supabase:
   ```bash
   supabase functions list
   # Deve mostrar: chat-ai
   ```

2. Verifique ANTHROPIC_API_KEY no Supabase:
   ```bash
   supabase secrets list
   # Deve mostrar: ANTHROPIC_API_KEY
   ```

3. Re-deploy da função:
   ```bash
   supabase functions deploy chat-ai
   ```

### Performance baixa

**Soluções:**
1. Habilite compressão: já configurado em `netlify.toml` ✅
2. Otimize imagens: use WebP e comprima
3. Lazy load de componentes: ver `ANALISE_TECNICA.md`
4. Adicione Service Worker para cache offline

---

## 📈 Monitoramento

### Analytics (Opcional)

**Netlify Analytics** (pago):
- **Site settings** > **Analytics**
- $9/mês por site
- Server-side, sem cookies

**Google Analytics** (grátis):
1. Crie propriedade: https://analytics.google.com
2. Adicione script ao `index.html`
3. Re-deploy

### Logs

**Ver logs de build:**
```bash
netlify logs:site
```

**Ver logs de função:**
```bash
netlify logs:function chat-ai
```

**No Dashboard:**
- **Deploys** > Clique no deploy > **Deploy log**

---

## 🔐 Segurança

### Headers Configurados

O `netlify.toml` já inclui:
- ✅ **CSP** - Content Security Policy
- ✅ **X-Frame-Options** - Previne clickjacking
- ✅ **X-XSS-Protection** - Proteção XSS
- ✅ **Referrer-Policy** - Controle de referrer
- ✅ **Permissions-Policy** - Limita APIs do browser

### Auditoria

Execute regularmente:
```bash
npm audit
npm audit fix
```

### Atualizações

Mantenha dependências atualizadas:
```bash
npm outdated
npm update
```

---

## 💰 Custos

### Netlify

**Free Tier:**
- ✅ 100 GB bandwidth/mês
- ✅ 300 build minutes/mês
- ✅ Deploy contínuo ilimitado
- ✅ SSL automático
- ✅ Deploy previews ilimitados

**Suficiente para:** Projetos pequenos/médios (~10k usuários/mês)

**Upgrade quando:**
- Mais de 100 GB bandwidth
- Mais de 300 min de build
- Necessário analytics ou forms

### Supabase

**Free Tier:**
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50k monthly active users
- ✅ 2 GB bandwidth

**Upgrade quando:**
- Mais de 500 MB dados
- Mais de 50k usuários ativos/mês

---

## 📚 Recursos

### Documentação
- **Netlify Docs:** https://docs.netlify.com
- **Vite Docs:** https://vitejs.dev
- **Supabase Docs:** https://supabase.com/docs

### Comunidade
- **Netlify Community:** https://answers.netlify.com
- **Discord Netlify:** https://discord.gg/netlify

### Monitoramento
- **Status Netlify:** https://www.netlifystatus.com
- **Status Supabase:** https://status.supabase.com

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Build local funciona (`npm run build`)
- [ ] Site deployado no Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] Login/Signup funciona
- [ ] Feed carrega posts
- [ ] Chat funciona com Robô Nath
- [ ] Tema escuro/claro funciona
- [ ] Performance > 90 no Lighthouse
- [ ] Security headers OK (securityheaders.com)
- [ ] SSL ativo (HTTPS)
- [ ] Domínio customizado (se aplicável)
- [ ] Analytics configurado (se desejado)
- [ ] Error tracking configurado (opcional)

---

## 🎉 Próximos Passos

Depois do deploy inicial:

1. **Monitorar:** Analytics e erros
2. **Otimizar:** Performance e SEO
3. **Iterar:** Feedback dos usuários
4. **Escalar:** Conforme crescimento

**Seu app está no ar! 🚀**

Acesse: `https://SEU-SITE.netlify.app`

---

**Deploy com sucesso? Compartilhe com a comunidade!** 💕

_Guia gerado por Claude Code - Mantido e atualizado regularmente_
