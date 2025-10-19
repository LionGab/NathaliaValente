# ⚡ Deploy Rápido - ClubNath no Netlify

**Tempo estimado:** 5 minutos

---

## 🚀 3 Passos para Deploy

### 1️⃣ Acesse o Netlify

👉 **https://app.netlify.com/start**

- Faça login com GitHub
- Clique em **"Import from Git"**
- Selecione **GitHub**
- Procure por: `LionGab/boltnathH`

### 2️⃣ Configure as Variáveis de Ambiente

Adicione estas 2 variáveis em **"Environment variables"**:

```
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=[cole sua chave anon aqui]
```

**Onde encontrar a chave anon:**
👉 https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api

Copie o valor de **"anon" "public"**

### 3️⃣ Deploy!

- As configurações de build já estão no `netlify.toml` ✅
- Clique em **"Deploy site"**
- Aguarde 2-3 minutos
- **Pronto!** 🎉

---

## 📋 O Que Vai Acontecer

1. ✅ Netlify clona o repositório
2. ✅ Instala dependências (`npm install`)
3. ✅ Build da aplicação (`npm run build`)
4. ✅ Deploy do site
5. ✅ Gera URL pública: `https://[nome-aleatorio].netlify.app`

---

## ✅ Verificar Se Está Funcionando

Acesse a URL gerada pelo Netlify e teste:

- [ ] Página carrega sem erros
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Feed aparece (vazio inicialmente)
- [ ] Chat com Robô Nath responde
- [ ] Dark mode funciona
- [ ] Navegação entre páginas funciona

---

## 🔧 Configuração Automática (netlify.toml)

O arquivo `netlify.toml` já está configurado com:

- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ Redirects para SPA routing
- ✅ Security headers
- ✅ Cache optimization

**Você não precisa configurar nada manualmente!**

---

## 🐛 Problemas?

### Build falhou?
- Verifique se adicionou as variáveis de ambiente
- Veja os logs de build no Netlify

### Página em branco?
- Abra o console (F12)
- Verifique se as variáveis `VITE_SUPABASE_*` estão corretas

### Chat não responde?
- Normal! O chat usa fallbacks inteligentes
- Para IA real, a `ANTHROPIC_API_KEY` deve estar nos **Supabase Secrets**

---

## 📚 Mais Detalhes

Para guia completo, veja: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🎯 URL Final

Após o deploy, seu app estará em:

```
https://[seu-site-name].netlify.app
```

Você pode customizar o nome em:
**Site settings → Domain management → Options → Change site name**

---

## 🔄 Deploy Automático

Agora, sempre que você fizer push para `main`:

```bash
git add .
git commit -m "Nova funcionalidade"
git push origin main
```

O Netlify automaticamente:
1. Detecta o push
2. Faz rebuild
3. Atualiza o site

**Deploy contínuo ativado!** ✅

---

## 📞 Suporte

- 📖 Guia completo: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 Issues: [GitHub Issues](https://github.com/LionGab/boltnathH/issues)
- 📚 Docs Netlify: https://docs.netlify.com

---

**🎉 Seu ClubNath está pronto para o mundo! 🎉**

---

*Criado em: 19/10/2025*
