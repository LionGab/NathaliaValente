# 💻 Setup do ClubNath em Nova Máquina

## 🎯 Objetivo

Este guia mostra como configurar o ClubNath em qualquer computador novo.

---

## 📋 Pré-requisitos

Antes de começar, instale:

### 1. **Node.js** (versão 18 ou superior)
- **Windows/macOS/Linux:** https://nodejs.org/
- Verifique: `node --version` (deve mostrar v18.x ou superior)

### 2. **Git**
- **Windows:** https://git-scm.com/download/win
- **macOS:** `brew install git` (ou vem com Xcode)
- **Linux:** `sudo apt install git`
- Verifique: `git --version`

### 3. **Editor de Código** (opcional, mas recomendado)
- **VS Code:** https://code.visualstudio.com/
- **Cursor:** https://cursor.sh/
- **Qualquer outro de sua preferência**

### 4. **Claude Desktop** (para usar MCPs)
- **Download:** https://claude.ai/download
- Opcional, mas muito útil!

---

## 🚀 Passo a Passo

### **Passo 1: Clonar o Repositório** (2 min)

Abra o terminal e execute:

```bash
# Navegue até onde quer salvar o projeto
cd C:\Users\SeuUsuario\Projetos  # Windows
cd ~/Projects  # macOS/Linux

# Clone o repositório
git clone https://github.com/LionGab/boltnathH.git

# Entre na pasta do projeto
cd boltnathH
```

---

### **Passo 2: Instalar Dependências** (3-5 min)

```bash
# Instalar todas as dependências do projeto
npm install
```

Aguarde a instalação completar. Você verá algo como:
```
added 324 packages in 45s
```

---

### **Passo 3: Configurar Variáveis de Ambiente** (2 min)

#### Criar arquivo `.env`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

#### Editar o arquivo `.env`:

Abra o arquivo `.env` e adicione as credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
```

> 💡 **Dica:** Essas credenciais já estão no `.env.example`

---

### **Passo 4: Iniciar o Servidor de Desenvolvimento** (1 min)

```bash
npm run dev
```

Você verá:
```
  VITE v5.4.20  ready in 234 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Acesse:** http://localhost:5174/

---

### **Passo 5: Verificar Funcionamento** ✅

Teste se tudo está funcionando:

1. ✅ Página carrega sem erros
2. ✅ Botões de Login/Cadastro aparecem
3. ✅ Console do navegador (F12) sem erros em vermelho
4. ✅ Dark mode funciona (ícone de sol/lua)

---

## 🔧 Configuração Adicional (Opcional)

### **Configurar Git** (se primeira vez na máquina)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seuemail@example.com"
```

### **Configurar MCPs no Claude Desktop**

Se você instalou o Claude Desktop, siga o guia:
- 📖 **Guia Rápido:** `QUICK_MCP_SETUP.md`
- 📖 **Guia Completo:** `MCP_CONFIGURATION.md`

Resumo:
1. Instale MCPs: `npm install -g @modelcontextprotocol/server-github @modelcontextprotocol/server-supabase @modelcontextprotocol/server-netlify`
2. Configure tokens no `claude_desktop_config.json`
3. Reinicie Claude Desktop

---

## 📁 Estrutura do Projeto

Após clonar, você terá:

```
boltnathH/
├── src/                    # Código fonte
│   ├── components/         # Componentes React
│   ├── contexts/           # AuthContext, ThemeContext
│   ├── lib/                # Supabase client
│   ├── pages/              # Páginas (Feed, Chat, Profile, etc)
│   └── App.tsx             # Componente principal
├── supabase/
│   └── functions/          # Edge Functions
├── public/                 # Arquivos estáticos
├── .env                    # Variáveis de ambiente (você cria)
├── .env.example            # Template de variáveis
├── package.json            # Dependências
├── vite.config.ts          # Configuração Vite
├── tailwind.config.js      # Configuração Tailwind
└── README.md               # Documentação

Guias disponíveis:
├── CLAUDE.md                          # Instruções para Claude Code
├── SETUP_NOVA_MAQUINA.md             # Este arquivo!
├── SOLUCAO_ERROS.md                  # Troubleshooting
├── CONFIGURAR_NETLIFY.md             # Deploy no Netlify
├── MCP_CONFIGURATION.md              # Configurar MCPs
├── QUICK_MCP_SETUP.md                # Setup rápido de MCPs
└── MCP_RECOMENDACOES_CLUBNATH.md    # MCPs recomendados
```

---

## 🐛 Problemas Comuns

### **Erro: `npm: command not found`**
- **Solução:** Instale Node.js: https://nodejs.org/

### **Erro: `git: command not found`**
- **Solução:** Instale Git: https://git-scm.com/

### **Erro: `Port 5174 already in use`**
- **Solução:** Mate o processo ou use outra porta:
  ```bash
  npm run dev -- --port 5175
  ```

### **Página em branco / Erro 403 no login**
- **Solução:** Verifique se o `.env` foi criado corretamente
- **Veja:** `SOLUCAO_ERROS.md` para mais detalhes

### **`npm install` falha**
- **Solução:** Limpe cache e tente novamente:
  ```bash
  npm cache clean --force
  npm install
  ```

---

## 🔄 Sincronizar com Atualizações

Se o projeto já foi atualizado no GitHub:

```bash
# Baixar últimas alterações
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Reiniciar servidor
npm run dev
```

---

## 🌐 Deploy em Produção

Após configurar localmente, você pode fazer deploy:

**Netlify (recomendado):**
- 📖 Siga: `CONFIGURAR_NETLIFY.md`
- Tempo: ~5-10 minutos
- Grátis!

---

## ✅ Checklist de Setup

Antes de começar a desenvolver, verifique:

- [ ] Node.js instalado (`node --version`)
- [ ] Git instalado (`git --version`)
- [ ] Repositório clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Página abre em http://localhost:5174/
- [ ] Console sem erros críticos
- [ ] Git configurado (nome e email)

---

## 🎯 Próximos Passos

Após setup completo:

1. **Ler documentação:**
   - `README.md` - Visão geral
   - `CLAUDE.md` - Arquitetura do projeto

2. **Explorar o código:**
   - Comece por `src/App.tsx`
   - Veja `src/contexts/AuthContext.tsx`
   - Explore `src/pages/FeedPage.tsx`

3. **Fazer primeira alteração:**
   - Teste mudar cores, textos
   - Veja mudanças em tempo real (HMR)
   - Faça commit: `git add . && git commit -m "Minha primeira alteração"`

4. **Configurar MCPs (opcional):**
   - Siga `QUICK_MCP_SETUP.md`
   - Potencialize o desenvolvimento com Claude

---

## 🔑 Credenciais e Tokens

### Supabase (Público - OK compartilhar):
- **URL:** `https://bbcwitnbnosyfpfjtzkr.supabase.co`
- **Anon Key:** Veja `.env.example`

### Supabase Service Key (⚠️ PRIVADO):
- **Onde:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
- **Uso:** Apenas para MCPs ou backend
- **⚠️ NUNCA commite no Git!**

### GitHub Token (para MCPs):
- **Criar:** https://github.com/settings/tokens
- **Scopes:** `repo`, `workflow`

### Netlify Token (para MCPs):
- **Criar:** https://app.netlify.com/user/applications#personal-access-tokens

---

## 💡 Dicas

### **Usar Branch Própria:**
```bash
# Criar sua branch
git checkout -b minha-feature

# Trabalhar na sua branch
# ... fazer alterações ...

# Commit
git add .
git commit -m "Adicionar nova feature"

# Push para sua branch
git push origin minha-feature

# Criar PR no GitHub depois
```

### **Manter Sincronizado:**
```bash
# Atualizar sua branch com mudanças da main
git checkout main
git pull origin main
git checkout minha-feature
git merge main
```

### **Verificar Status:**
```bash
# Ver arquivos modificados
git status

# Ver diferenças
git diff

# Ver histórico
git log --oneline
```

---

## 📞 Suporte

### Documentação do Projeto:
- Todos os arquivos `.md` no repositório
- Especialmente: `SOLUCAO_ERROS.md`

### Links Úteis:
- **Repositório:** https://github.com/LionGab/boltnathH
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr
- **React Docs:** https://react.dev/
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev/

---

## 🎊 Resumo Rápido

```bash
# 1. Clonar
git clone https://github.com/LionGab/boltnathH.git
cd boltnathH

# 2. Instalar
npm install

# 3. Configurar
cp .env.example .env
# Editar .env se necessário

# 4. Iniciar
npm run dev

# 5. Acessar
# http://localhost:5174/
```

**Tempo total:** ~10 minutos

---

## 🔐 Segurança

### ✅ Pode compartilhar:
- Código fonte (público no GitHub)
- Supabase URL
- Supabase Anon Key
- Repositório GitHub

### ❌ NUNCA compartilhe:
- Supabase Service Key
- Tokens pessoais (GitHub, Netlify, etc)
- Senha do database
- API keys privadas

---

**Última atualização:** 19/10/2025

---

**Pronto! Agora você pode desenvolver o ClubNath em qualquer máquina! 🚀**
