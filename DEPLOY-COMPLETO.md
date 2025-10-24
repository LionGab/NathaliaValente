# 🚀 CLUBNATH VIP - GUIA COMPLETO DE DEPLOY

## 📋 PRÉ-REQUISITOS
- ✅ Node.js 20+ instalado
- ✅ Conta no Netlify (gratuita)
- ✅ Conta no Supabase (gratuita)
- ✅ APIs de IA configuradas (opcional)

## 🎯 DEPLOY EM 3 PASSOS SIMPLES

### PASSO 1: PREPARAR O PROJETO
```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/clubnath-vip.git
cd clubnath-vip

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### PASSO 2: CONFIGURAR SUPABASE
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie URL e anon key
5. Cole no arquivo .env

### PASSO 3: DEPLOY NO NETLIFY
#### Opção A: Deploy via GitHub (Recomendado)
1. Faça push do código para GitHub
2. Acesse [netlify.com](https://netlify.com)
3. Clique em "New site from Git"
4. Conecte sua conta GitHub
5. Selecione o repositório
6. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Clique em "Deploy site"

#### Opção B: Deploy via Drag & Drop
1. Execute: `npm run build`
2. Acesse [netlify.com](https://netlify.com)
3. Arraste a pasta `dist` para a área de deploy
4. Pronto! Site no ar em segundos

## ⚙️ CONFIGURAÇÕES AVANÇADAS

### Variáveis de Ambiente no Netlify
1. Vá em Site settings > Environment variables
2. Adicione todas as variáveis do .env
3. Clique em "Save"

### Domínio Personalizado
1. Vá em Site settings > Domain management
2. Clique em "Add custom domain"
3. Digite seu domínio (ex: clubnath.com)
4. Configure DNS conforme instruções
5. SSL será ativado automaticamente

### Configurações de Build
O arquivo `netlify.toml` já está configurado com:
- ✅ Headers de segurança
- ✅ Cache otimizado
- ✅ Compressão automática
- ✅ Redirects para SPA
- ✅ PWA headers

## 📱 TESTANDO O PWA

### No Desktop
1. Abra o site no Chrome/Edge
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação
4. O app aparecerá na área de trabalho

### No Mobile
1. Abra o site no Safari (iOS) ou Chrome (Android)
2. Toque em "Compartilhar" > "Adicionar à Tela Inicial"
3. Confirme a instalação
4. O app aparecerá na tela inicial

## 🔧 COMANDOS ÚTEIS

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Testes
npm test

# Lint
npm run lint

# Type check
npm run typecheck
```

## 📊 MONITORAMENTO

### Performance
- Lighthouse Score: 90+ em todas as métricas
- Bundle size: ~108KB gzipped
- Load time: <2s em 3G

### Analytics
Configure Google Analytics no .env:
```
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🚨 TROUBLESHOOTING

### Build falha
```bash
# Limpe cache
npm run clean
rm -rf node_modules
npm install
npm run build
```

### PWA não instala
1. Verifique se manifest.webmanifest está acessível
2. Confirme se Service Worker está registrado
3. Teste em HTTPS (obrigatório para PWA)

### Variáveis não carregam
1. Verifique se estão no painel do Netlify
2. Confirme se começam com VITE_
3. Faça redeploy após alterar variáveis

## 📞 SUPORTE

### Documentação
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps)

### Contato
- Email: suporte@clubnath.com
- GitHub Issues: [Link do repositório]

## 🎉 PRONTO!

Seu ClubNath VIP está no ar e funcionando!
Acesse: https://seu-site.netlify.app

### Próximos Passos
1. ✅ Teste todas as funcionalidades
2. ✅ Configure domínio personalizado
3. ✅ Ative Google Analytics
4. ✅ Configure notificações push
5. ✅ Monitore performance

**Bem-vinda ao mundo digital, Nathália! 💜**
