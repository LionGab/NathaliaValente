# 🚀 Guia de Deploy - ClubNath

Guia completo para fazer deploy do ClubNath no Netlify.

## ⚡ Deploy Rápido (5 minutos)

### Pré-requisitos
- Conta no [Netlify](https://netlify.com)
- Conta no [GitHub](https://github.com)
- Projeto ClubNath no GitHub

### Passos

1. **Acesse o Netlify**
   - Vá para: https://app.netlify.com/start
   - Faça login com GitHub

2. **Importe o Repositório**
   - Clique em "Import from Git"
   - Selecione GitHub
   - Escolha `LionGab/boltnathH`

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Adicione Variáveis de Ambiente**
   
   Em "Site settings" → "Environment variables", adicione:
   
   ```
   VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   ```

5. **Deploy**
   - Clique em "Deploy site"
   - Aguarde ~3 minutos

**Pronto!** 🎉 Seu app estará no ar!

## 📋 Deploy Passo a Passo Detalhado

### 1. Preparação

#### Verificar Build Local
```bash
# Teste o build localmente
npm run build

# Verifique a pasta dist
ls dist

# Preview local
npm run preview
```

#### Verificar Variáveis
```bash
# Arquivo .env deve conter:
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

### 2. Configuração do Netlify

#### Opção A: Deploy via Interface Web

1. **Login no Netlify**
   - https://app.netlify.com
   - Login com GitHub

2. **Novo Site**
   - "Add new site" → "Import an existing project"
   - Conecte com GitHub
   - Autorize acesso ao repositório

3. **Configurar Build**
   ```
   Base directory: (deixe em branco)
   Build command: npm run build
   Publish directory: dist
   ```

4. **Variáveis de Ambiente**
   - Site settings → Environment variables
   - Add variable:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Deploy**
   - "Deploy site"

#### Opção B: Deploy via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

### 3. Configuração do Domínio

#### Domínio Netlify (Gratuito)
```
Seu site estará em:
https://seu-site.netlify.app
```

Para personalizar:
- Site settings → Domain management
- Options → Edit site name

#### Domínio Customizado

1. **Adicionar Domínio**
   - Domain settings → Add custom domain
   - Digite seu domínio: `clubnath.com`

2. **Configurar DNS**
   
   No seu provedor de DNS, adicione:
   ```
   Type: CNAME
   Name: www
   Value: seu-site.netlify.app
   
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

3. **HTTPS**
   - Netlify ativa automaticamente
   - Certificado SSL gratuito via Let's Encrypt

### 4. Deploy Contínuo

#### Configuração Automática

Por padrão, Netlify faz deploy automático quando você:
- Faz push para a branch `main`
- Aceita um Pull Request
- Faz merge de branches

#### Deploy Previews

Para cada PR, Netlify cria:
- URL de preview única
- Build independente
- Perfeito para testar mudanças

### 5. Configurações Avançadas

#### netlify.toml

Crie na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### Redirects para SPA

Adicione em `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Ou crie `public/_redirects`:
```
/*    /index.html   200
```

## 🔧 Troubleshooting

### Build Falhando

**Erro: "Command failed"**
```bash
# Verifique localmente
npm run build

# Limpe cache
rm -rf node_modules
npm install
```

**Erro: "Out of memory"**
```toml
# Em netlify.toml, aumente memória
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Variáveis de Ambiente

**Erro: "VITE_SUPABASE_URL is undefined"**
- Verifique em Site settings → Environment variables
- Variáveis DEVEM começar com `VITE_`
- Faça redeploy após adicionar variáveis

### Página 404

**SPA não carrega rotas**
- Adicione redirects (veja seção acima)
- Verifique `_redirects` ou `netlify.toml`

### Deploy Lento

**Build demora muito**
```bash
# Use npm ci no lugar de npm install
# Em netlify.toml:
[build]
  command = "npm ci && npm run build"
```

## 📊 Monitoramento

### Ver Logs de Deploy
```bash
# Via CLI
netlify logs

# Via Web
Site → Deploys → (clique no deploy) → Deploy log
```

### Analytics
- Site settings → Analytics
- Ative Netlify Analytics (pago)
- Ou use Google Analytics (gratuito)

### Performance
- Lighthouse CI integrado
- Verifica em cada deploy:
  - Performance
  - Accessibility
  - Best Practices
  - SEO

## 🔐 Segurança

### HTTPS
- ✅ Ativado automaticamente
- ✅ Certificado SSL renovado automaticamente
- ✅ HTTP → HTTPS redirect automático

### Variáveis de Ambiente
- ✅ Nunca comite chaves no código
- ✅ Use environment variables
- ✅ Diferentes variáveis para dev/prod

### Headers de Segurança
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Teste todas as funcionalidades
2. ✅ Configure domínio customizado
3. ✅ Ative analytics
4. ✅ Configure notificações de deploy
5. ✅ Configure deploy previews

## 📚 Links Úteis

- [Netlify Docs](https://docs.netlify.com/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Dashboard Netlify](https://app.netlify.com/)
- [Status do Netlify](https://www.netlifystatus.com/)

---

**Deploy feliz! 🚀**
