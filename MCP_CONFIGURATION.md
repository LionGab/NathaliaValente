# 🔌 MCP Configuration - Model Context Protocol

## O que é MCP?

**Model Context Protocol (MCP)** permite que o Claude se conecte com ferramentas externas, APIs e serviços, expandindo suas capacidades além do código local.

---

## 🚀 MCPs Recomendados para ClubNath

### 1️⃣ **GitHub MCP** - Gerenciamento de Repositório

Permite ao Claude:
- Criar issues e PRs
- Gerenciar branches
- Revisar código
- Sincronizar com repositório

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-github
```

**Configuração:**
```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "seu_token_aqui"
      }
    }
  }
}
```

**Como obter GitHub Token:**
1. Acesse: https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Selecione scopes: `repo`, `workflow`, `read:org`
4. Copie o token

---

### 2️⃣ **Supabase MCP** - Gerenciamento de Database

Permite ao Claude:
- Executar queries SQL
- Gerenciar tabelas
- Configurar RLS policies
- Verificar logs

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-supabase
```

**Configuração:**
```json
{
  "mcpServers": {
    "supabase": {
      "command": "mcp-server-supabase",
      "args": [],
      "env": {
        "SUPABASE_URL": "https://bbcwitnbnosyfpfjtzkr.supabase.co",
        "SUPABASE_SERVICE_KEY": "seu_service_key_aqui"
      }
    }
  }
}
```

**Como obter Service Key:**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
2. Copie "service_role" key (⚠️ **NÃO compartilhe!**)

---

### 3️⃣ **Filesystem MCP** - Acesso a Arquivos

Permite ao Claude:
- Ler/escrever arquivos
- Navegar diretórios
- Pesquisar código

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**Configuração:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["C:\\Users\\User\\BoltValente\\boltnathH"]
    }
  }
}
```

---

### 4️⃣ **Web Search MCP** - Pesquisa na Web

Permite ao Claude:
- Pesquisar documentação
- Buscar soluções para erros
- Verificar atualizações de bibliotecas

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-brave-search
```

**Configuração:**
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "mcp-server-brave-search",
      "args": [],
      "env": {
        "BRAVE_API_KEY": "seu_brave_api_key"
      }
    }
  }
}
```

**Como obter Brave API Key:**
1. Acesse: https://brave.com/search/api/
2. Crie uma conta
3. Copie a API key

---

### 5️⃣ **Netlify MCP** - Deploy e Gerenciamento

Permite ao Claude:
- Fazer deploy automático
- Gerenciar variáveis de ambiente
- Verificar build logs
- Gerenciar domínios

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-netlify
```

**Configuração:**
```json
{
  "mcpServers": {
    "netlify": {
      "command": "mcp-server-netlify",
      "args": [],
      "env": {
        "NETLIFY_AUTH_TOKEN": "seu_netlify_token"
      }
    }
  }
}
```

**Como obter Netlify Token:**
1. Acesse: https://app.netlify.com/user/applications#personal-access-tokens
2. "New access token"
3. Copie o token

---

### 6️⃣ **NPM MCP** - Gerenciamento de Pacotes

Permite ao Claude:
- Instalar/atualizar pacotes
- Verificar vulnerabilidades
- Gerenciar scripts npm

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-npm
```

**Configuração:**
```json
{
  "mcpServers": {
    "npm": {
      "command": "mcp-server-npm",
      "args": ["C:\\Users\\User\\BoltValente\\boltnathH"]
    }
  }
}
```

---

### 7️⃣ **PostgreSQL MCP** - Database Direto

Permite ao Claude:
- Executar queries SQL complexas
- Gerenciar schemas
- Otimizar performance

**Instalação:**
```bash
npm install -g @modelcontextprotocol/server-postgres
```

**Configuração:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "mcp-server-postgres",
      "args": [],
      "env": {
        "DATABASE_URL": "postgresql://postgres:[PASSWORD]@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
      }
    }
  }
}
```

**Como obter Database URL:**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database
2. Copie "Connection string" (URI)
3. Substitua `[YOUR-PASSWORD]` pela senha do projeto

---

## 📝 Arquivo de Configuração Completo

Crie/edite o arquivo de configuração do Claude Desktop:

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Exemplo de Configuração Completa:

Veja: `claude_desktop_config.example.json` neste repositório

---

## 🔐 Segurança - IMPORTANTE!

### ⚠️ NUNCA COMMITE TOKENS/KEYS NO GIT!

**Arquivos a adicionar no `.gitignore`:**
```
claude_desktop_config.json
.env
.env.local
*.key
*.pem
```

### ✅ Boas Práticas:

1. **Use variáveis de ambiente** para tokens sensíveis
2. **Rotacione tokens** regularmente
3. **Limite escopos** aos necessários
4. **Revogue tokens** não usados
5. **Não compartilhe** service keys do Supabase

---

## 🎯 MCPs Prioritários para ClubNath

Para começar, recomendo instalar nesta ordem:

### Essenciais:
1. ✅ **GitHub MCP** - Gerenciar código
2. ✅ **Supabase MCP** - Gerenciar database
3. ✅ **Filesystem MCP** - Acesso a arquivos

### Úteis:
4. ✅ **Netlify MCP** - Deploy automático
5. ✅ **Web Search MCP** - Pesquisar docs

### Opcionais:
6. ✅ **NPM MCP** - Gerenciar pacotes
7. ✅ **PostgreSQL MCP** - Queries avançadas

---

## 🚀 Como Instalar Tudo de Uma Vez

```bash
# Instalar todos os MCPs recomendados
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-supabase
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-netlify
npm install -g @modelcontextprotocol/server-npm
npm install -g @modelcontextprotocol/server-postgres
```

---

## 🧪 Testar MCPs

Após configurar, reinicie o Claude Desktop e teste:

```
Claude, liste meus repositórios no GitHub
Claude, execute SELECT * FROM profiles no Supabase
Claude, pesquise a documentação do React 18
Claude, faça deploy da última versão no Netlify
```

---

## 📚 Recursos Adicionais

- **MCP Documentation:** https://modelcontextprotocol.io/
- **Available Servers:** https://github.com/modelcontextprotocol/servers
- **Community MCPs:** https://github.com/topics/model-context-protocol

---

## 🐛 Troubleshooting

### MCP não aparece no Claude Desktop

1. Verifique se o arquivo de configuração está no local correto
2. Reinicie o Claude Desktop completamente
3. Verifique se os comandos estão instalados globalmente
4. Veja logs em: `%APPDATA%\Claude\logs\mcp.log`

### Erro de autenticação

1. Verifique se os tokens estão corretos
2. Confirme que os tokens têm os scopes necessários
3. Regenere tokens se necessário

### MCP lento ou travando

1. Reduza o número de MCPs ativos
2. Verifique conexão de internet
3. Use apenas MCPs necessários para a tarefa

---

## 💡 Dicas de Uso

### Combinar MCPs

```
Claude, faça o seguinte:
1. Busque na web como otimizar Vite build
2. Aplique as mudanças no vite.config.ts
3. Teste o build
4. Se funcionar, commite no GitHub
5. Faça deploy no Netlify
```

### Automatizar Tarefas

```
Claude, todo dia às 9h:
1. Verifique issues abertas no GitHub
2. Analise logs do Supabase
3. Verifique status do deploy no Netlify
4. Me envie um resumo
```

---

## 🎊 Benefícios dos MCPs

Com MCPs configurados, Claude pode:

- ✅ Gerenciar **end-to-end** o desenvolvimento
- ✅ Fazer **deploy automático** de mudanças
- ✅ **Debuggar produção** em tempo real
- ✅ **Pesquisar soluções** automaticamente
- ✅ **Executar queries** no database
- ✅ **Gerenciar GitHub** (issues, PRs, releases)
- ✅ **Monitorar** aplicação em produção

---

**Última atualização:** 19/10/2025

