# 🐙 GitHub MCP - Configuração Otimizada para ClubNath

Guia completo para configurar o GitHub MCP (Model Context Protocol) no projeto ClubNath, permitindo que o Claude Code/Desktop gerencie issues, pull requests, repositórios e mais diretamente via GitHub API.

## 📋 Índice

- [O que é GitHub MCP?](#-o-que-é-github-mcp)
- [Pré-requisitos](#-pré-requisitos)
- [Setup Rápido](#-setup-rápido-5-minutos)
- [Configuração Detalhada](#-configuração-detalhada)
- [Recursos Disponíveis](#-recursos-disponíveis)
- [Casos de Uso](#-casos-de-uso)
- [Segurança](#-segurança)
- [Troubleshooting](#-troubleshooting)

## 🎯 O que é GitHub MCP?

O **GitHub MCP** (`@modelcontextprotocol/server-github`) permite que o Claude:

- 📝 Criar, listar e gerenciar **Issues**
- 🔀 Criar, revisar e mergear **Pull Requests**
- 🔍 Buscar código e repositórios
- 📊 Analisar branches e commits
- 👥 Gerenciar colaboradores
- 🏷️ Trabalhar com labels, milestones e projects
- 📁 Ler e criar arquivos no repositório
- ⭐ Gerenciar stars, forks e watches

## 🔧 Pré-requisitos

### 1. Node.js e npm
```bash
node --version  # v18 ou superior
npm --version   # v9 ou superior
```

### 2. GitHub Personal Access Token

Crie um token com as permissões necessárias:

1. **Acesse:** https://github.com/settings/tokens/new
2. **Nome:** `Claude MCP - ClubNath`
3. **Expiration:** 90 dias (ou conforme sua preferência)
4. **Selecione os scopes:**

   **Repositórios (essencial):**
   - ✅ `repo` - Acesso completo a repositórios privados
     - ✅ `repo:status` - Status de commits
     - ✅ `repo_deployment` - Deploys
     - ✅ `public_repo` - Repos públicos
     - ✅ `repo:invite` - Convites

   **Pull Requests:**
   - ✅ `read:org` - Ler organizações
   - ✅ `write:discussion` - Discussões

   **Workflow (opcional, mas recomendado):**
   - ✅ `workflow` - GitHub Actions

   **Administração (se necessário):**
   - ✅ `admin:repo_hook` - Webhooks
   - ✅ `admin:org_hook` - Org hooks

5. **Gere o token** e copie (aparece apenas uma vez!)

## ⚡ Setup Rápido (5 minutos)

### 1. Localizar Arquivo de Configuração

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

### 2. Adicionar Configuração

Edite `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "clubnath-github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_SEU_TOKEN_AQUI"
      }
    }
  }
}
```

**Substitua:** `ghp_SEU_TOKEN_AQUI` pelo token gerado.

### 3. Reiniciar Claude

1. Feche **completamente** o Claude Desktop/Code
2. Abra novamente
3. Verifique se o servidor MCP está ativo

### 4. Testar

No Claude, teste:
```
Liste as issues abertas do repositório LionGab/boltnathH
```

## 🔧 Configuração Detalhada

### Configuração Completa Recomendada

Para máximo desempenho com o ClubNath, use esta configuração:

```json
{
  "mcpServers": {
    "clubnath-github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_SEU_TOKEN_AQUI"
      }
    },
    "clubnath-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/user/boltnathH"
      ]
    },
    "clubnath-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:[SENHA]@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
      ]
    },
    "clubnath-memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    }
  }
}
```

### Variações por Sistema Operacional

**Windows:**
```json
{
  "clubnath-filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "C:\\Users\\SeuUsuario\\ClubNath\\boltnathH"
    ]
  }
}
```

**Mac/Linux:**
```json
{
  "clubnath-filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/home/usuario/boltnathH"
    ]
  }
}
```

## 🚀 Recursos Disponíveis

### 1. Gerenciamento de Issues

**Criar Issue:**
```
Crie uma issue no ClubNath com título "Adicionar dark mode ao perfil"
e descrição "Implementar tema escuro na página de perfil"
```

**Listar Issues:**
```
Liste todas as issues abertas do ClubNath
Mostre issues com label "bug"
Quais issues estão assignadas para mim?
```

**Atualizar Issue:**
```
Feche a issue #42
Adicione o label "enhancement" na issue #15
Atribua a issue #20 para @LionGab
```

### 2. Pull Requests

**Criar PR:**
```
Crie um PR da branch "feature/dark-mode" para "main"
com título "feat: Adiciona tema escuro"
```

**Revisar PR:**
```
Mostre os arquivos modificados no PR #25
Adicione um comentário no PR #25: "LGTM! 🚀"
Liste os PRs abertos do ClubNath
```

**Mergear PR:**
```
Faça merge do PR #25
Feche o PR #30 sem merge
```

### 3. Código e Arquivos

**Buscar código:**
```
Busque por "supabase.auth" no repositório ClubNath
Encontre todos os arquivos TypeScript com "ChatPage"
```

**Ler arquivos:**
```
Mostre o conteúdo de src/components/ChatPage.tsx
Liste os arquivos na pasta src/components/
```

### 4. Branches e Commits

**Branches:**
```
Liste todas as branches do ClubNath
Mostre os últimos commits da branch main
Qual é a diferença entre main e develop?
```

**Commits:**
```
Mostre o commit c8bf51e
Liste os últimos 10 commits
Quem fez o último commit em ChatPage.tsx?
```

### 5. Colaboração

**Colaboradores:**
```
Liste os colaboradores do ClubNath
Adicione @usuario como colaborador
```

**Labels e Milestones:**
```
Crie um label "prioridade-alta" com cor vermelha
Liste todos os milestones
Atribua a issue #15 ao milestone "v1.0"
```

## 💡 Casos de Uso

### Workflow de Desenvolvimento

**1. Iniciar nova feature:**
```
Crie uma nova branch "feature/notifications" a partir de main
Crie uma issue "Implementar sistema de notificações"
Atribua a issue para mim
```

**2. Durante o desenvolvimento:**
```
Mostre os arquivos modificados desde o último commit
Busque por implementações similares de notificações no código
Liste os TODOs em src/components/
```

**3. Finalizar feature:**
```
Crie um PR de "feature/notifications" para "main"
com título "feat: Sistema de notificações push"
Adicione a descrição baseada nos commits
Vincule a issue #42 ao PR
```

**4. Code Review:**
```
Analise o código do PR #50
Sugira melhorias de performance
Verifique se há testes para as novas funcionalidades
Adicione comentários inline se necessário
```

**5. Deploy:**
```
Faça merge do PR #50
Crie uma tag de release "v1.2.0"
Feche todas as issues do milestone "v1.2"
```

### Manutenção e Bugs

**Triagem de Issues:**
```
Liste issues sem label
Adicione labels apropriados baseado no conteúdo
Priorize issues por severidade
Atribua issues aos desenvolvedores certos
```

**Bug Tracking:**
```
Crie uma issue de bug com template:
- Título: [BUG] Chat não envia mensagens
- Descrição: Passos para reproduzir, comportamento esperado
- Labels: bug, prioridade-alta
- Milestone: v1.2.1
```

### Automação

**Daily Standup:**
```
Liste PRs criados nas últimas 24h
Mostre issues fechadas ontem
Qual o status das issues do sprint atual?
```

**Sprint Planning:**
```
Crie issues para as tarefas:
1. Implementar filtro no feed
2. Adicionar paginação nos posts
3. Otimizar queries do banco
Adicione todas ao milestone "Sprint 15"
```

## 🔒 Segurança

### ⚠️ Boas Práticas

**1. Token de Acesso:**
- ✅ Use tokens com escopo mínimo necessário
- ✅ Configure expiração (90 dias recomendado)
- ✅ **NUNCA** commite tokens no Git
- ✅ Revogue tokens não utilizados
- ✅ Use tokens diferentes para dev/prod

**2. Permissões:**
- ✅ Conceda apenas permissões necessárias
- ✅ Para uso pessoal: `repo` é suficiente
- ✅ Para CI/CD: adicione `workflow`
- ⚠️ Evite `admin:*` se não for necessário

**3. Monitoramento:**
- ✅ Revise atividades do token regularmente
- ✅ Configure notificações de atividade
- ✅ Audite operações críticas (merges, releases)

### 🔐 Tokens por Ambiente

**Desenvolvimento Local:**
```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_token_desenvolvimento"
  }
}
```

**Produção/CI:**
```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_token_producao_readonly"
  }
}
```

### 🚫 O Que NUNCA Fazer

- ❌ Commitar o arquivo `claude_desktop_config.json`
- ❌ Compartilhar tokens publicamente
- ❌ Usar token com `delete_repo` sem necessidade
- ❌ Dar permissões de admin desnecessárias
- ❌ Usar o mesmo token em múltiplos ambientes

## 🧪 Testando a Configuração

### Verificação Básica

```
# 1. Verificar conexão
Claude, você tem acesso ao GitHub MCP?

# 2. Testar leitura
Liste as branches do repositório LionGab/boltnathH

# 3. Testar busca
Busque por "ChatPage" no código do ClubNath

# 4. Testar issues
Mostre as últimas 5 issues do ClubNath
```

### Testes Avançados

```
# 1. Análise de código
Analise a estrutura de pastas do ClubNath
Quantos componentes React existem?

# 2. Histórico
Mostre os commits da última semana
Quem são os contribuidores mais ativos?

# 3. PRs
Liste PRs abertos e seus status
Mostre conflitos no PR #X
```

## 🐛 Troubleshooting

### MCP não conecta

**Sintoma:** GitHub MCP não aparece ou dá erro

**Soluções:**

1. **Verificar Token:**
   ```bash
   # Testar token via curl
   curl -H "Authorization: token ghp_SEU_TOKEN" \
        https://api.github.com/user
   ```

2. **Verificar JSON:**
   - Use [JSONLint](https://jsonlint.com/) para validar
   - Certifique-se que não há vírgulas extras
   - Verifique aspas duplas (não simples)

3. **Verificar npx:**
   ```bash
   npx --version
   # Se não funcionar, reinstale Node.js
   ```

4. **Logs do Claude:**
   - Windows: `%APPDATA%\Claude\logs`
   - Mac: `~/Library/Logs/Claude`
   - Linux: `~/.config/Claude/logs`

### Token inválido

**Sintoma:** Erro "Bad credentials" ou "401 Unauthorized"

**Soluções:**
1. Verifique se o token foi copiado corretamente
2. Confirme que o token não expirou
3. Verifique os scopes/permissões do token
4. Regenere o token se necessário

### Rate Limiting

**Sintoma:** Erro "API rate limit exceeded"

**Soluções:**
1. Aguarde 1 hora (limite reseta a cada hora)
2. Use autenticação (5000 req/hora vs 60 req/hora)
3. Otimize queries para fazer menos requisições
4. Use cache quando possível

### Permissões insuficientes

**Sintoma:** "Resource not accessible" ou "403 Forbidden"

**Soluções:**
1. Verifique se o token tem scope `repo`
2. Confirme acesso ao repositório privado
3. Verifique se é colaborador/admin do repo
4. Recrie token com permissões corretas

## 📚 Recursos Adicionais

### Links Úteis

- **MCP GitHub Server:** https://github.com/modelcontextprotocol/servers/tree/main/src/github
- **GitHub API Docs:** https://docs.github.com/en/rest
- **Personal Access Tokens:** https://github.com/settings/tokens
- **Scopes Explained:** https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps

### Repositório ClubNath

- **GitHub:** https://github.com/LionGab/boltnathH
- **Issues:** https://github.com/LionGab/boltnathH/issues
- **PRs:** https://github.com/LionGab/boltnathH/pulls
- **Actions:** https://github.com/LionGab/boltnathH/actions

### Comandos Úteis

```bash
# Ver branches
gh branch list

# Ver issues
gh issue list

# Ver PRs
gh pr list

# Ver status do repo
gh repo view LionGab/boltnathH

# Ver workflows
gh workflow list
```

## 🎯 Próximos Passos

Após configurar o GitHub MCP:

1. ✅ Configure também o **Filesystem MCP** (acesso ao código local)
2. ✅ Configure o **PostgreSQL MCP** (acesso ao Supabase)
3. ✅ Configure o **Memory MCP** (contexto persistente)
4. 📖 Leia [MCP_SETUP.md](./MCP_SETUP.md) para configuração completa
5. 🚀 Comece a usar Claude para gerenciar seu projeto!

## 💬 Exemplos de Prompts

### Gerenciamento de Issues
```
"Crie uma issue para implementar dark mode no feed"
"Liste issues com label 'enhancement' criadas esta semana"
"Feche todas as issues do milestone v1.0 que estão completas"
```

### Pull Requests
```
"Crie um PR da minha branch atual para main"
"Revise o código do PR #42 e sugira melhorias"
"Mostre os arquivos modificados no PR #38"
```

### Análise de Código
```
"Busque por 'TODO' em todos os arquivos TypeScript"
"Quantos componentes React temos em src/components?"
"Mostre o histórico de mudanças do ChatPage.tsx"
```

### Automação
```
"Liste PRs que precisam de review"
"Crie issues para todos os TODOs encontrados no código"
"Gere um relatório de atividades da última semana"
```

---

**GitHub MCP configurado! Agora Claude pode gerenciar seu repositório! 🚀**

Para configuração completa com outros MCPs, consulte [MCP_SETUP.md](./MCP_SETUP.md)
