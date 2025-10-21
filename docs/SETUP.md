# 🔧 Guia de Configuração - ClubNath

Guia completo para configurar o projeto ClubNath em qualquer máquina.

## 📋 Índice

- [Configuração Inicial](#-configuração-inicial)
- [Setup em Nova Máquina](#-setup-em-nova-máquina)
- [Trabalhar com Claude](#-trabalhar-com-claude)
- [Troubleshooting](#-troubleshooting)

## 🚀 Configuração Inicial

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Conta Supabase** ([Criar](https://supabase.com/))
- **Conta Anthropic** ([Criar](https://console.anthropic.com/))

### 1. Clone o Projeto

```bash
# Clone o repositório
git clone https://github.com/LionGab/boltnathH.git
cd boltnathH

# Instale dependências
npm install
```

### 2. Configure Variáveis de Ambiente

O arquivo `.env` já deve existir com:

```env
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-key
```

Se não existir, crie:
1. Copie `.env.example` para `.env`
2. Acesse [Supabase API Settings](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api)
3. Copie "anon public" key

### 3. Instale Supabase CLI

**Windows (PowerShell como Admin):**
```powershell
# Via Scoop
scoop install supabase

# Ou via npm
npm install -g supabase
```

**Mac:**
```bash
brew install supabase/tap/supabase
```

**Linux:**
```bash
npm install -g supabase
```

### 4. Faça Login no Supabase

```bash
# Login
supabase login

# Vincule ao projeto
supabase link --project-ref bbcwitnbnosyfpfjtzkr
```

Quando solicitado:
- Database password: `G2008ab01M2012AB!`
- Ou acesse: [Database Settings](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database)

### 5. Configure API Key da Anthropic

```bash
# Adicione a chave ao Supabase Secrets
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

Obter API key:
1. Acesse: https://console.anthropic.com/
2. Settings → API Keys
3. Create Key

### 6. Deploy da Edge Function

```bash
# Deploy da função de chat
supabase functions deploy chat-ai

# Verifique logs
supabase functions logs chat-ai
```

### 7. Inicie o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Acesse: http://localhost:5174
```

## 🖥️ Setup em Nova Máquina

### Checklist Rápido

- [ ] Node.js 18+ instalado
- [ ] Git instalado
- [ ] Clonar repositório
- [ ] `npm install`
- [ ] Arquivo `.env` configurado
- [ ] Supabase CLI instalado
- [ ] `supabase login`
- [ ] `supabase link`
- [ ] Testar: `npm run dev`

### Script Automatizado (Windows)

```powershell
# Salve como setup.ps1 e execute

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não encontrado. Instale: https://nodejs.org/"
    exit 1
}

# Clone (se necessário)
if (-not (Test-Path "boltnathH")) {
    git clone https://github.com/LionGab/boltnathH.git
    cd boltnathH
}

# Instalar dependências
npm install

# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Vincular projeto
supabase link --project-ref bbcwitnbnosyfpfjtzkr

Write-Host "✅ Setup concluído! Execute: npm run dev"
```

### Arquivos Importantes

**Não commitar:**
- `.env` - Chaves locais
- `node_modules/` - Dependências

**Commitar:**
- `.env.example` - Template de variáveis
- `package.json` - Dependências do projeto
- `package-lock.json` - Lock de versões

## 🤖 Trabalhar com Claude

### Continuar Projeto com Claude Desktop

1. **Instale Claude Desktop**
   - Download: https://claude.ai/download

2. **Configure MCP** (opcional)
   - Veja: [docs/MCP_SETUP.md](./MCP_SETUP.md)

3. **Compartilhe Contexto**

   Ao abrir nova conversa:
   ```
   Estou trabalhando no projeto ClubNath.
   É uma plataforma de apoio maternal com React + Supabase.
   
   Contexto:
   - Frontend: React 18 + TypeScript
   - Backend: Supabase (PostgreSQL + Edge Functions)
   - IA: Claude 4.5 Haiku
   - Repo: github.com/LionGab/boltnathH
   ```

4. **Comandos Úteis para Claude**

   ```
   "Analise a estrutura do projeto"
   "Mostre o componente ChatPage"
   "Como funciona a autenticação?"
   "Adicione feature X no componente Y"
   "Debugue erro Z"
   ```

### Documentos para Compartilhar

Ao trabalhar com Claude, compartilhe:
- `README.md` - Visão geral
- `src/App.tsx` - Estrutura principal
- `src/components/` - Componentes específicos
- `supabase/functions/chat-ai/` - Lógica da IA

## 🐛 Troubleshooting

### Erro: "Supabase CLI not found"

```bash
# Reinstale
npm install -g supabase

# Verifique
supabase --version
```

### Erro: "Project not linked"

```bash
# Desvincule e vincule novamente
supabase unlink
supabase link --project-ref bbcwitnbnosyfpfjtzkr
```

### Erro: "Invalid anon key"

1. Verifique em [API Settings](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api)
2. Copie "anon public" key novamente
3. Atualize `.env`
4. Reinicie servidor: `npm run dev`

### Erro: "Edge function failed"

```bash
# Veja logs
supabase functions logs chat-ai

# Redeploy
supabase functions deploy chat-ai

# Teste direto
curl -i --location --request POST \
  'https://bbcwitnbnosyfpfjtzkr.supabase.co/functions/v1/chat-ai' \
  --header 'Content-Type: application/json' \
  --data '{"message":"teste"}'
```

### Erro: Port 5174 em uso

```bash
# Mate processo na porta
# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5174 | xargs kill
```

### Build falhando

```bash
# Limpe cache
rm -rf node_modules
rm package-lock.json

# Reinstale
npm install

# Tente build
npm run build
```

## 📚 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar dev server
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Supabase

```bash
# Status do projeto
supabase status

# Ver funções
supabase functions list

# Logs da função
supabase functions logs chat-ai --tail

# Deploy função
supabase functions deploy chat-ai

# Testar função localmente
supabase functions serve

# Ver secrets
supabase secrets list

# Adicionar secret
supabase secrets set KEY=value
```

### Git

```bash
# Ver mudanças
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "mensagem"

# Push
git push origin main

# Pull
git pull origin main

# Nova branch
git checkout -b feature/nome
```

## 🔐 Segurança

### Chaves e Senhas

**NUNCA commite:**
- ❌ API keys
- ❌ Senhas do banco
- ❌ Tokens de acesso
- ❌ Arquivo `.env`

**SEMPRE use:**
- ✅ Variáveis de ambiente
- ✅ Supabase Secrets (para Edge Functions)
- ✅ `.env.example` (sem valores reais)
- ✅ `.gitignore` configurado

### Verificar Segurança

```bash
# Verifique se .env está no .gitignore
cat .gitignore | grep .env

# Verifique histórico Git
git log --all --full-history -- .env

# Se .env foi commitado:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

## 🎯 Próximos Passos

Após setup:

1. ✅ Teste todas as funcionalidades
2. ✅ Crie uma conta de teste
3. ✅ Envie uma mensagem para Robô Nath
4. ✅ Crie um post no feed
5. ✅ Configure MCP (opcional)
6. ✅ Leia documentação do Supabase
7. ✅ Explore o código

## 📞 Suporte

- 📖 [Documentação Completa](../README.md)
- 🚀 [Guia de Deploy](./DEPLOYMENT.md)
- 🤖 [Setup MCP](./MCP_SETUP.md)
- 🐛 [Troubleshooting](./TROUBLESHOOTING.md)

---

**Setup feliz! 🎉**
