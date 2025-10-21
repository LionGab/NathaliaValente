# 🤖 Guia Completo de Configuração dos MCPs - ClubNath

Este guia detalha todos os Model Context Protocol (MCP) servidores configurados para o projeto ClubNath, incluindo o que cada um faz, como configurá-los e como obter as chaves de API necessárias.

## 📋 Índice

- [MCPs Essenciais](#-mcps-essenciais-já-configurados)
- [MCPs Altamente Recomendados](#-mcps-altamente-recomendados)
- [MCPs Opcionais](#-mcps-opcionais)
- [Como Configurar](#-como-configurar)
- [Solução de Problemas](#-solução-de-problemas)

---

## 📦 MCPs Essenciais (Já Configurados)

### 📁 FILESYSTEM - Acesso aos Arquivos do Projeto

**O que faz:**
- Permite que o Claude leia, edite e crie arquivos no seu projeto
- Navega pela estrutura de pastas
- Gerencia arquivos de código, configuração e documentação

**Configuração:**
```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "C:\\Users\\User\\BoltValente\\boltnathH"
  ]
}
```

**Recursos:**
- ✅ Ler arquivos
- ✅ Criar novos arquivos
- ✅ Editar código existente
- ✅ Navegar estrutura de pastas
- ✅ Deletar arquivos (com cuidado!)

**Nenhuma chave de API necessária** ✓

---

### 🐙 GITHUB - Integração com GitHub

**O que faz:**
- Gerencia issues e pull requests
- Cria e edita comentários
- Visualiza repositórios e commits
- Gerencia labels e milestones

**Configuração:**
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "ghp_seu_token_aqui"
  }
}
```

**Como obter o token:**
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Selecione os escopos:
   - `repo` (acesso completo a repositórios privados)
   - `read:org` (ler dados da organização)
   - `workflow` (atualizar workflows do GitHub Actions)
4. Clique em "Generate token"
5. Copie o token (começa com `ghp_`)

**Recursos:**
- ✅ Criar e gerenciar issues
- ✅ Criar e revisar pull requests
- ✅ Adicionar comentários
- ✅ Gerenciar labels e milestones
- ✅ Ver histórico de commits

---

### 🗄️ POSTGRES/SUPABASE - Banco de Dados

**O que faz:**
- Executa queries SQL diretas no banco de dados
- Visualiza estrutura de tabelas
- Analisa dados do ClubNath
- Faz consultas e relatórios

**Configuração:**
```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "postgresql://postgres:[SUA_SENHA]@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
  }
}
```

**Como obter a senha do banco:**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database
2. Vá para a seção "Database password"
3. Se não souber a senha, clique em "Reset database password"
4. Copie a senha e substitua `[SUA_SENHA]` na URL

**Recursos:**
- ✅ Executar SELECT queries
- ✅ INSERT, UPDATE, DELETE (cuidado!)
- ✅ Ver schema das tabelas
- ✅ Analisar dados dos usuários
- ✅ Gerar relatórios

**⚠️ Atenção:** Este servidor tem acesso completo ao banco. Use com cuidado!

---

### 📦 NPM - Gerenciamento de Pacotes

**O que faz:**
- Instala e atualiza dependências npm
- Busca informações sobre pacotes
- Gerencia scripts do package.json
- Verifica vulnerabilidades

**Configuração:**
```json
"npm": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-npm",
    "C:\\Users\\User\\BoltValente\\boltnathH"
  ]
}
```

**Recursos:**
- ✅ Instalar pacotes
- ✅ Atualizar dependências
- ✅ Buscar pacotes no npm registry
- ✅ Ver detalhes de pacotes
- ✅ Executar scripts npm

**Nenhuma chave de API necessária** ✓

---

## 🚀 MCPs Altamente Recomendados

### 🔍 BRAVE SEARCH - Busca na Web

**O que faz:**
- Busca informações atualizadas na internet
- Resolve dúvidas sobre tecnologias e APIs
- Encontra soluções para problemas
- Pesquisa documentação e exemplos

**Configuração:**
```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_API_KEY": "seu_brave_api_key_aqui"
  }
}
```

**Como obter a chave de API:**
1. Acesse: https://api.search.brave.com/app/keys
2. Crie uma conta ou faça login
3. Clique em "Create API Key"
4. Copie a chave gerada

**Recursos:**
- ✅ Busca na web
- ✅ Resultados atualizados
- ✅ Pesquisa de documentação
- ✅ Encontrar exemplos de código
- ✅ Resolver dúvidas técnicas

**Plano gratuito:** 2.000 queries/mês ✓

---

### 🌐 FETCH - Requisições HTTP/API

**O que faz:**
- Faz chamadas HTTP para APIs externas
- Testa endpoints da aplicação
- Valida respostas de APIs
- Debug de integrações

**Configuração:**
```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

**Recursos:**
- ✅ GET, POST, PUT, DELETE requests
- ✅ Headers customizados
- ✅ Autenticação
- ✅ Upload de arquivos
- ✅ Download de recursos

**Nenhuma chave de API necessária** ✓

**Exemplos de uso:**
- Testar a API da Edge Function do chat
- Verificar integrações com Supabase
- Validar webhooks
- Testar endpoints REST

---

### 🧠 SEQUENTIAL THINKING - Raciocínio Complexo

**O que faz:**
- Ajuda o Claude a resolver problemas complexos
- Divide tarefas grandes em etapas menores
- Raciocínio estruturado passo a passo
- Melhor planejamento de soluções

**Configuração:**
```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

**Recursos:**
- ✅ Pensamento estruturado
- ✅ Análise passo a passo
- ✅ Resolução de problemas complexos
- ✅ Planejamento de features
- ✅ Debugging avançado

**Nenhuma chave de API necessária** ✓

**Quando usar:**
- Debugging de problemas complexos
- Planejamento de novas features
- Refatoração de código grande
- Análise de arquitetura

---

### 💾 MEMORY - Contexto Persistente

**O que faz:**
- Mantém memória entre conversas
- Lembra de decisões e preferências
- Contexto contínuo do projeto
- Histórico de trabalho

**Configuração:**
```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

**Recursos:**
- ✅ Memória entre sessões
- ✅ Contexto do projeto
- ✅ Histórico de decisões
- ✅ Preferências salvas
- ✅ Continuidade do trabalho

**Nenhuma chave de API necessária** ✓

**Benefícios:**
- Não precisa repetir contexto
- Claude lembra de decisões anteriores
- Continuidade entre dias de trabalho
- Histórico de progresso

---

### 📦 GIT - Operações Git Avançadas

**O que faz:**
- Executa comandos Git
- Gerencia branches e commits
- Faz merge e rebase
- Resolve conflitos

**Configuração:**
```json
"git": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-git",
    "--repository",
    "C:\\Users\\User\\BoltValente\\boltnathH"
  ]
}
```

**Recursos:**
- ✅ Commits e push
- ✅ Criar branches
- ✅ Merge e rebase
- ✅ Ver histórico
- ✅ Resolver conflitos
- ✅ Tags e releases

**Nenhuma chave de API necessária** ✓

**⚠️ Atenção:** Tenha cuidado com operações destrutivas!

---

## 🔧 MCPs Opcionais

### 🌐 NETLIFY - Deploy e Gerenciamento

**O que faz:**
- Gerencia deploys no Netlify
- Configura domínios
- Visualiza logs de build
- Gerencia variáveis de ambiente

**Configuração:**
```json
"netlify": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-netlify"],
  "env": {
    "NETLIFY_AUTH_TOKEN": "seu_netlify_token_aqui"
  }
}
```

**Como obter o token:**
1. Acesse: https://app.netlify.com/user/applications#personal-access-tokens
2. Clique em "New access token"
3. Dê um nome (ex: "Claude MCP")
4. Copie o token gerado

**Recursos:**
- ✅ Deploy manual
- ✅ Ver status de builds
- ✅ Configurar domínios
- ✅ Gerenciar env vars
- ✅ Ver logs

**Útil para:**
- Fazer deploys rápidos
- Debugar problemas de build
- Gerenciar configurações de produção

---

### 🐛 SENTRY - Monitoramento de Erros

**O que faz:**
- Monitora erros em produção
- Analisa stack traces
- Identifica padrões de erro
- Prioriza correções

**Configuração:**
```json
"sentry": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sentry"],
  "env": {
    "SENTRY_AUTH_TOKEN": "seu_sentry_token_aqui",
    "SENTRY_ORG": "sua_organizacao",
    "SENTRY_PROJECT": "clubnath"
  }
}
```

**Como configurar:**
1. Acesse: https://sentry.io/settings/account/api/auth-tokens/
2. Clique em "Create New Token"
3. Selecione escopos:
   - `project:read`
   - `event:read`
   - `org:read`
4. Copie o token
5. Configure o nome da organização e projeto

**Recursos:**
- ✅ Ver erros em tempo real
- ✅ Analisar stack traces
- ✅ Identificar tendências
- ✅ Resolver issues
- ✅ Performance monitoring

**Útil para:**
- Debugging de erros em produção
- Monitoramento de estabilidade
- Análise de performance

---

### 💬 SLACK - Notificações e Integração

**O que faz:**
- Envia notificações para o Slack
- Posta mensagens em canais
- Responde a threads
- Gerencia comunicação

**Configuração:**
```json
"slack": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-seu-token-aqui",
    "SLACK_TEAM_ID": "seu_team_id_aqui"
  }
}
```

**Como configurar:**
1. Acesse: https://api.slack.com/apps
2. Clique em "Create New App" → "From scratch"
3. Dê um nome (ex: "ClubNath Bot")
4. Selecione o workspace
5. Vá para "OAuth & Permissions"
6. Adicione escopos:
   - `chat:write`
   - `channels:read`
   - `users:read`
7. Instale o app no workspace
8. Copie o "Bot User OAuth Token" (começa com `xoxb-`)

**Para encontrar o Team ID:**
1. No Slack, clique no nome do workspace
2. Vá para "Settings & administration" → "Workspace settings"
3. O Team ID está na URL ou nas configurações

**Recursos:**
- ✅ Enviar mensagens
- ✅ Postar em canais
- ✅ Responder threads
- ✅ Notificações automáticas
- ✅ Integração com CI/CD

**Útil para:**
- Notificações de deploy
- Alertas de erro
- Comunicação da equipe

---

## 🛠 Como Configurar

### 1. Localizar o Arquivo de Configuração

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Mac:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### 2. Copiar a Configuração de Exemplo

```bash
# No Windows (PowerShell)
Copy-Item claude_desktop_config.example.json "$env:APPDATA\Claude\claude_desktop_config.json"

# No Mac/Linux
cp claude_desktop_config.example.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### 3. Editar com suas Chaves de API

Abra o arquivo `claude_desktop_config.json` e substitua:

- `ghp_seu_token_aqui` → seu token do GitHub
- `[SUA_SENHA]` → senha do banco Supabase
- `seu_brave_api_key_aqui` → chave da API Brave Search
- `seu_netlify_token_aqui` → token do Netlify
- E assim por diante para os outros serviços...

### 4. Ajustar Paths (Se Necessário)

Se o seu projeto está em um local diferente, atualize os paths:

```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "SEU/CAMINHO/PARA/boltnathH"
  ]
}
```

**Linux/Mac:** Use `/home/usuario/projetos/boltnathH`
**Windows:** Use `C:\\Users\\Usuario\\projetos\\boltnathH`

### 5. Reiniciar Claude Desktop

1. Feche completamente o Claude Desktop
2. Abra novamente
3. Verifique se os servidores MCP aparecem

### 6. Testar

No Claude Desktop, pergunte:
```
Você consegue acessar os servidores MCP?
Liste os arquivos do projeto ClubNath.
```

---

## 🧪 Testando os MCPs

### Testar Filesystem
```
Mostre o conteúdo do arquivo src/App.tsx
Quantos componentes temos na pasta src/components/?
```

### Testar GitHub
```
Liste as issues abertas do repositório LionGab/boltnathH
Mostre os últimos 5 commits
```

### Testar Database
```
Mostre as tabelas do banco ClubNath
Quantos usuários temos cadastrados?
```

### Testar Brave Search
```
Busque na web sobre "React Server Components"
Encontre a documentação mais recente do Supabase
```

### Testar Fetch
```
Faça uma requisição GET para https://api.github.com/repos/LionGab/boltnathH
Teste o endpoint do chat-ai
```

---

## 🐛 Solução de Problemas

### MCPs não aparecem no Claude

**Solução:**
1. Verifique se o JSON está válido (use https://jsonlint.com/)
2. Certifique-se que o arquivo está no local correto
3. Reinicie o Claude Desktop completamente
4. Verifique os logs em:
   - Windows: `%APPDATA%\Claude\logs`
   - Mac: `~/Library/Logs/Claude`

### Erro de autenticação

**Solução:**
1. Verifique se as chaves de API estão corretas
2. Certifique-se que os tokens não expiraram
3. Regenere os tokens se necessário
4. Verifique os escopos/permissões dos tokens

### npx não encontrado

**Solução:**
```bash
# Instale Node.js
# Verifique instalação
node --version
npm --version
npx --version
```

### Erro de conexão com banco

**Solução:**
1. Verifique a senha do banco
2. Confirme que seu IP está liberado no Supabase
3. Teste a conexão com outro cliente (DBeaver, pgAdmin)

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [Claude Desktop](https://claude.ai/desktop)

### Servidores MCP Disponíveis

- [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [@modelcontextprotocol/server-github](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [@modelcontextprotocol/server-postgres](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)
- [@modelcontextprotocol/server-brave-search](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)
- [@modelcontextprotocol/server-fetch](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch)
- E muitos outros...

### Links Úteis para o ClubNath

- [Dashboard Supabase](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr)
- [GitHub Repository](https://github.com/LionGab/boltnathH)
- [Netlify Dashboard](https://app.netlify.com/)

---

## 🎯 Resumo de Prioridades

### Configurar AGORA (Essenciais):
1. ✅ **filesystem** - Acesso aos arquivos
2. ✅ **github** - Integração GitHub
3. ✅ **postgres** - Banco de dados
4. ✅ **npm** - Gerenciamento de pacotes

### Configurar EM SEGUIDA (Altamente Recomendados):
5. 🔍 **brave-search** - Busca na web
6. 🌐 **fetch** - Requisições HTTP
7. 🧠 **sequential-thinking** - Raciocínio avançado
8. 💾 **memory** - Contexto persistente
9. 📦 **git** - Operações Git

### Configurar DEPOIS (Opcionais):
10. 🌐 **netlify** - Deploy
11. 🐛 **sentry** - Monitoramento
12. 💬 **slack** - Notificações

---

**Configuração completa! Claude está pronto para ajudar no ClubNath! 🚀**
