# ⚡ Quick Start - Deploy no Netlify (5 minutos)

Guia super rápido para colocar o ClubNath no ar.

## 1️⃣ Conecte o GitHub ao Netlify

1. Acesse: **https://app.netlify.com/start**
2. Clique em **"Import from Git"**
3. Escolha **GitHub**
4. Selecione: **LionGab/boltnathH**
5. Clique **Deploy**

✅ Pronto! O Netlify detecta `netlify.toml` automaticamente.

## 2️⃣ Configure Variáveis de Ambiente

No dashboard do Netlify:

1. **Site settings** > **Environment variables**
2. **Add a variable**

Adicione estas 2 variáveis:

```
VITE_SUPABASE_URL = https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY = [Copie do Supabase Dashboard]
```

**Onde obter a ANON KEY:**
- Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
- Copie: **anon/public key**

## 3️⃣ Re-Deploy

1. **Deploys** > **Trigger deploy**
2. Aguarde ~2 minutos
3. Acesse seu site: `https://SEU-SITE.netlify.app`

## ✅ Verificação Rápida

- [ ] Site abre
- [ ] Login funciona
- [ ] Feed carrega
- [ ] Chat funciona

## 🆘 Problemas?

Veja o guia completo: **NETLIFY_DEPLOY.md**

---

**Deploy em 5 minutos! 🚀**
