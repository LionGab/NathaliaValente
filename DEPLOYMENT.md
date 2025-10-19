# 🚀 Guia de Deploy - ClubNath

Este guia detalha como fazer o deploy do ClubNath no **Netlify** de forma rápida e fácil.

---

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de que:

- ✅ Código está no GitHub: https://github.com/LionGab/boltnathH
- ✅ Projeto Supabase configurado: `bbcwitnbnosyfpfjtzkr`
- ✅ Edge Function `chat-ai` deployada
- ✅ `ANTHROPIC_API_KEY` configurada nos Supabase Secrets

---

## 🌐 Deploy no Netlify

### Passo 1: Crie uma conta no Netlify

1. Acesse: https://app.netlify.com/signup
2. Faça login com sua conta do GitHub
3. Autorize o Netlify a acessar seus repositórios

### Passo 2: Importe o Projeto

1. No dashboard do Netlify, clique em **"Add new site"**
2. Selecione **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Procure e selecione o repositório: `LionGab/boltnathH`

### Passo 3: Configure o Build

Na tela de configuração, preencha:

**Build settings:**
```
Build command: npm run build
Publish directory: dist
```

**Advanced settings** (clique para expandir):

Adicione as **Environment Variables**:

| Key | Value | Descrição |
|-----|-------|-----------|
| `VITE_SUPABASE_URL` | `https://bbcwitnbnosyfpfjtzkr.supabase.co` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anon do Supabase | Chave pública do Supabase |

**Onde encontrar as credenciais:**
- Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
- Copie:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Passo 4: Deploy!

1. Clique em **"Deploy site"**
2. Aguarde o build (leva ~2-3 minutos)
3. Seu app estará disponível em: `https://[site-name].netlify.app`

---

## ⚙️ Configurações Adicionais (Recomendado)

### 1. Configurar Custom Domain (Opcional)

1. No dashboard do site, vá em **"Domain settings"**
2. Clique em **"Add custom domain"**
3. Siga as instruções para configurar o DNS

### 2. Configurar Redirects para SPA

O ClubNath é um Single Page Application (SPA). Para que o roteamento funcione corretamente, você precisa configurar redirects.

**Método 1: Usando arquivo `_redirects`**

Crie o arquivo `public/_redirects` com o conteúdo:
```
/*    /index.html   200
```

**Método 2: Usando `netlify.toml` (Recomendado)**

Já existe um arquivo `netlify.toml` na raiz do projeto. Confira se contém:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Habilitar Deploy Automático

Por padrão, o Netlify já configura deploy automático:
- ✅ Push para `main` → Deploy automático
- ✅ Pull Requests → Deploy de preview

---

## 🔒 Segurança no Deploy

### ✅ Checklist de Segurança:

- [x] `.env` está no `.gitignore` (não vai para o GitHub)
- [x] Chaves sensíveis removidas da documentação
- [x] `.env.example` fornece template sem valores reais
- [x] `ANTHROPIC_API_KEY` está nos Supabase Secrets (não no Netlify)
- [x] Apenas chaves públicas (`VITE_*`) no Netlify

### ⚠️ IMPORTANTE:

- **NUNCA** exponha a `ANTHROPIC_API_KEY` no frontend
- Ela deve ficar **APENAS** nos Supabase Secrets
- O Netlify precisa **APENAS** das variáveis `VITE_*` (públicas)

---

## 📊 Verificação Pós-Deploy

Após o deploy, verifique:

### 1. App Carrega Corretamente

- [ ] Acesse `https://[seu-site].netlify.app`
- [ ] Tela de login aparece
- [ ] Não há erros no console (F12)

### 2. Criar Conta e Login

- [ ] Clique em "Cadastrar"
- [ ] Crie uma conta de teste
- [ ] Faça login com sucesso

### 3. Testar Funcionalidades

- [ ] **Feed**: Criar um post funciona
- [ ] **Chat**: Robô Nath responde (com IA se configurada, ou fallback)
- [ ] **Frases Diárias**: Carregam corretamente
- [ ] **Perfil**: Mostra dados do usuário
- [ ] **Dark Mode**: Toggle funciona

### 4. Verificar Console de Erros

Abra o DevTools (F12) e verifique:
- [ ] Sem erros 404
- [ ] Sem erros de CORS
- [ ] Supabase conecta corretamente

---

## 🐛 Troubleshooting

### Problema: Build falha no Netlify

**Erro comum:** `Cannot find module...`

**Solução:**
```bash
# Localmente, execute:
npm install
npm run build

# Se funcionar localmente, commite o package-lock.json atualizado:
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Problema: Página em branco após deploy

**Causa:** Roteamento SPA não configurado

**Solução:** Verifique o arquivo `netlify.toml` ou crie `public/_redirects`

### Problema: Erro de CORS ao chamar Supabase

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Vá em Site settings → Environment variables
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Clique em "Trigger deploy" para rebuildar

### Problema: Chat retorna apenas fallback

**Esperado!** Se a `ANTHROPIC_API_KEY` não estiver configurada ou houver problemas com a API, o chat usa fallbacks inteligentes.

**Para habilitar IA real:**
1. Configure `ANTHROPIC_API_KEY` nos **Supabase Secrets** (NÃO no Netlify)
2. Verifique a Edge Function: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/functions
3. Veja os logs para debugar

### Problema: Erros de build do TypeScript

**Solução:**
```bash
# Execute localmente para ver erros detalhados:
npm run typecheck
npm run build
```

---

## 📈 Otimizações de Performance

### 1. Habilitar Asset Optimization

No Netlify dashboard:
1. Site settings → Build & deploy → Post processing
2. Habilite:
   - [x] Bundle CSS
   - [x] Minify CSS
   - [x] Minify JS
   - [x] Compress images

### 2. Configurar Cache Headers

Adicione ao `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. Habilitar Brotli Compression

Por padrão o Netlify já comprime com gzip/brotli. Nada a fazer! ✅

---

## 🔄 Deploy Contínuo

### Como funciona:

1. **Você faz um commit:**
   ```bash
   git add .
   git commit -m "Nova funcionalidade"
   git push origin main
   ```

2. **Netlify detecta automaticamente** e inicia o build

3. **Em ~2-3 minutos** seu app está atualizado!

### Ver Status de Deploy:

- Dashboard: https://app.netlify.com/sites/[seu-site]/deploys
- Badge de status (opcional):
  ```markdown
  [![Netlify Status](https://api.netlify.com/api/v1/badges/[badge-id]/deploy-status)](https://app.netlify.com/sites/[site-name]/deploys)
  ```

---

## 📝 Arquivo netlify.toml Completo

Crie/atualize o arquivo `netlify.toml` na raiz do projeto:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🎯 Checklist Final de Deploy

### Antes do Deploy:
- [x] Código no GitHub: https://github.com/LionGab/boltnathH
- [x] `.env` no `.gitignore`
- [x] `.env.example` criado
- [x] Documentação atualizada
- [x] Build local funciona: `npm run build`

### Durante o Deploy:
- [ ] Projeto importado no Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] `netlify.toml` configurado
- [ ] Build executado com sucesso

### Após o Deploy:
- [ ] App acessível e funcionando
- [ ] Login/cadastro funciona
- [ ] Supabase conecta
- [ ] Chat responde (com fallback ou IA)
- [ ] Todas as páginas funcionam
- [ ] Dark mode funciona

---

## 🔗 Links Úteis

### Netlify:
- **Dashboard:** https://app.netlify.com
- **Docs:** https://docs.netlify.com
- **Status:** https://status.netlify.com

### Supabase:
- **Projeto:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
- **API Settings:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
- **Edge Functions:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/functions

### Repositório:
- **GitHub:** https://github.com/LionGab/boltnathH

---

## 💡 Próximos Passos

Depois do deploy bem-sucedido:

1. **Teste completo** em produção
2. **Monitore erros** no Netlify dashboard
3. **Configure analytics** (opcional)
4. **Custom domain** (opcional)
5. **Compartilhe** com usuários beta! 🎉

---

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique os logs de build** no Netlify
2. **Consulte o console** do navegador (F12)
3. **Revise as variáveis de ambiente**
4. **Teste localmente** com `npm run build && npm run preview`

---

**🎉 Parabéns! Seu ClubNath está no ar! 🎉**

---

*Última atualização: 19/10/2025*
