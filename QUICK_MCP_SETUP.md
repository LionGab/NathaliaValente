# ⚡ Configuração Rápida de MCPs - 5 Minutos

## 🎯 Setup Mínimo Essencial

Para ter Claude com superpoderes em 5 minutos, instale apenas os 3 MCPs essenciais:

---

## 📦 Passo 1: Instalar MCPs (2 min)

Abra o terminal e execute:

```bash
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-supabase
npm install -g @modelcontextprotocol/server-filesystem
```

---

## 🔑 Passo 2: Obter Tokens (2 min)

### GitHub Token:
1. Acesse: https://github.com/settings/tokens/new
2. Nome: "Claude Desktop MCP"
3. Selecione: `repo`, `workflow`
4. Generate token
5. **Copie o token** (começa com `ghp_`)

### Supabase Service Key:
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/api
2. Encontre "service_role" key
3. Clique em "Copy"
4. **⚠️ Esta key é secreta - não compartilhe!**

---

## ⚙️ Passo 3: Configurar Claude Desktop (1 min)

### Windows:

1. Abra o Explorador de Arquivos
2. Cole na barra de endereço: `%APPDATA%\Claude`
3. Crie o arquivo: `claude_desktop_config.json`
4. Cole este conteúdo (substitua os tokens):

```json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "SEU_TOKEN_GITHUB_AQUI"
      }
    },
    "supabase": {
      "command": "mcp-server-supabase",
      "args": [],
      "env": {
        "SUPABASE_URL": "https://bbcwitnbnosyfpfjtzkr.supabase.co",
        "SUPABASE_SERVICE_KEY": "SUA_SERVICE_KEY_AQUI"
      }
    },
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["C:\\Users\\User\\BoltValente\\boltnathH"]
    }
  }
}
```

### macOS/Linux:

1. Abra o terminal
2. Execute:

```bash
# macOS
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Linux
nano ~/.config/Claude/claude_desktop_config.json
```

3. Cole o conteúdo acima (ajustando o path do filesystem)
4. Salve: `Ctrl+O`, Enter, `Ctrl+X`

---

## 🔄 Passo 4: Reiniciar Claude Desktop

1. Feche completamente o Claude Desktop
2. Abra novamente
3. Aguarde 10 segundos para os MCPs carregarem

---

## ✅ Passo 5: Testar

Digite no Claude:

```
Claude, liste meus últimos 5 commits no GitHub
```

Se funcionou, você verá a lista de commits! 🎉

---

## 🎁 Bonus: MCPs Adicionais (Opcional)

### Netlify (para deploy automático):

```bash
npm install -g @modelcontextprotocol/server-netlify
```

**Token:** https://app.netlify.com/user/applications#personal-access-tokens

Adicione no config:
```json
"netlify": {
  "command": "mcp-server-netlify",
  "args": [],
  "env": {
    "NETLIFY_AUTH_TOKEN": "SEU_TOKEN_NETLIFY"
  }
}
```

### Web Search (para pesquisar docs):

```bash
npm install -g @modelcontextprotocol/server-brave-search
```

**API Key:** https://brave.com/search/api/

Adicione no config:
```json
"brave-search": {
  "command": "mcp-server-brave-search",
  "args": [],
  "env": {
    "BRAVE_API_KEY": "SUA_BRAVE_API_KEY"
  }
}
```

---

## 🐛 Troubleshooting

### MCPs não aparecem?

1. Verifique se salvou o arquivo no local correto
2. Reinicie Claude Desktop **completamente**
3. Verifique logs em: `%APPDATA%\Claude\logs\mcp.log`

### Erro de autenticação?

1. Confirme que copiou os tokens corretamente
2. Verifique se os tokens têm os scopes necessários
3. Regenere os tokens se necessário

### Comando não encontrado?

1. Execute os `npm install -g` novamente
2. Verifique se npm está no PATH
3. Tente reiniciar o terminal

---

## 🚀 Comandos Úteis para Testar

Depois de configurado, teste:

```
# GitHub MCP
Claude, mostre o status do repositório boltnathH
Claude, crie uma issue "Adicionar testes unitários"
Claude, liste os últimos PRs

# Supabase MCP
Claude, mostre todas as tabelas do banco
Claude, execute: SELECT COUNT(*) FROM profiles
Claude, mostre os logs de erro da última hora

# Filesystem MCP
Claude, liste todos os arquivos .tsx
Claude, mostre o conteúdo de package.json
Claude, procure por "AuthContext" no código
```

---

## 📚 Próximos Passos

Configuração completa: **MCP_CONFIGURATION.md**

Lá você encontra:
- 7 MCPs recomendados
- Configuração avançada
- Automações
- Dicas de segurança

---

## 🎯 Resumo

**Tempo total:** ~5 minutos

**O que você ganhou:**
- ✅ Claude pode gerenciar GitHub
- ✅ Claude pode executar SQL no Supabase
- ✅ Claude pode ler/editar arquivos localmente
- ✅ Claude 10x mais poderoso!

---

**Última atualização:** 19/10/2025
