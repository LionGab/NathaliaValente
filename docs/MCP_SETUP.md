# 🤖 MCP (Model Context Protocol) - ClubNath

Guia para configurar o Model Context Protocol para trabalhar com Claude Desktop no ClubNath.

## 📋 O que é MCP?

O **Model Context Protocol (MCP)** permite que o Claude Desktop acesse:
- 📁 Arquivos do projeto
- 🗄️ Banco de dados
- 🔧 Ferramentas customizadas
- 🌐 APIs externas

Com MCP, o Claude pode:
- Ler e editar código
- Executar queries no Supabase
- Testar funcionalidades
- Fazer deploys

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

### 2. Configurar MCP

Edite `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\User\\BoltValente\\boltnathH"
      ]
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:[SUA-SENHA]@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
      ]
    }
  }
}
```

### 3. Reiniciar Claude Desktop

- Feche completamente o Claude Desktop
- Abra novamente
- Verifique se os servidores MCP aparecem

## 🔧 Configuração Detalhada

### Servidor Filesystem

Permite acesso aos arquivos do projeto.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/caminho/para/seu/projeto"
      ]
    }
  }
}
```

**Recursos:**
- ✅ Ler arquivos
- ✅ Editar código
- ✅ Criar novos arquivos
- ✅ Navegar estrutura de pastas

### Servidor PostgreSQL (Supabase)

Permite queries diretas no banco.

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:SUA_SENHA@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
      ]
    }
  }
}
```

**Obter senha do Supabase:**
1. Acesse: https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database
2. Copie "Database password"
3. Ou redefina se necessário

**Recursos:**
- ✅ SELECT queries
- ✅ INSERT/UPDATE/DELETE
- ✅ Ver schema
- ✅ Analisar dados

## 📝 Recomendações para ClubNath

### Configuração Ideal

```json
{
  "mcpServers": {
    "clubnath-files": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\User\\BoltValente\\boltnathH",
        "C:\\Users\\User\\BoltValente\\boltnathH\\src",
        "C:\\Users\\User\\BoltValente\\boltnathH\\supabase"
      ]
    },
    "clubnath-db": {
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

### Tarefas Comuns com MCP

#### 1. Desenvolvimento
```
Claude pode:
- Ler componentes React
- Sugerir melhorias de código
- Criar novos componentes
- Refatorar código existente
```

#### 2. Banco de Dados
```
Claude pode:
- Ver estrutura das tabelas
- Consultar dados
- Sugerir queries otimizadas
- Debugar problemas de dados
```

#### 3. Debugging
```
Claude pode:
- Analisar logs
- Identificar erros
- Sugerir correções
- Testar soluções
```

## 🔒 Segurança

### ⚠️ Cuidados Importantes

1. **Senha do Banco**
   - Nunca commite no Git
   - Use apenas localmente
   - Considere criar usuário read-only

2. **Acesso a Arquivos**
   - MCP tem acesso TOTAL aos arquivos
   - Cuidado com comandos destrutivos
   - Sempre revise mudanças

3. **Queries no Banco**
   - Claude pode executar qualquer query
   - Cuidado com DELETE/DROP
   - Use em ambiente de desenvolvimento

### ✅ Boas Práticas

```json
// Criar usuário read-only no Supabase
{
  "mcpServers": {
    "supabase-readonly": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://readonly_user:senha@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
      ]
    }
  }
}
```

## 🧪 Testando MCP

### Verificar Instalação

No Claude Desktop, pergunte:
```
Você consegue acessar os servidores MCP?
Liste os arquivos do projeto ClubNath.
```

### Testar Filesystem

```
Mostre o conteúdo do arquivo src/App.tsx
Quantos componentes temos na pasta src/components/?
```

### Testar Database

```
Mostre as tabelas do banco ClubNath
Quantos usuários temos cadastrados?
Mostre os últimos 5 posts criados
```

## 🐛 Troubleshooting

### MCP não aparece

**Problema:** Servidores MCP não aparecem no Claude

**Solução:**
1. Verifique o JSON (use JSONLint)
2. Reinicie Claude Desktop completamente
3. Verifique logs em:
   - Windows: `%APPDATA%\Claude\logs`
   - Mac: `~/Library/Logs/Claude`

### Erro de conexão com banco

**Problema:** "Connection refused" ou "Auth failed"

**Solução:**
1. Verifique senha do banco
2. Confirme que IP está liberado no Supabase
3. Teste conexão com outro cliente (DBeaver, pgAdmin)

### npx não encontrado

**Problema:** "npx: command not found"

**Solução:**
```bash
# Instale Node.js
# Verifique instalação
node --version
npm --version
npx --version
```

## 📚 Recursos Adicionais

### Servidores MCP Oficiais

- `@modelcontextprotocol/server-filesystem` - Arquivos
- `@modelcontextprotocol/server-postgres` - PostgreSQL
- `@modelcontextprotocol/server-memory` - Memória persistente
- `@modelcontextprotocol/server-github` - GitHub API ⭐ **[Ver guia completo](./GITHUB_MCP_SETUP.md)**
- `@modelcontextprotocol/server-fetch` - HTTP requests

### 🚀 Setup Automatizado

Para configurar rapidamente o GitHub MCP e outros servidores:

**Linux/Mac:**
```bash
cd scripts
chmod +x setup-github-mcp.sh
./setup-github-mcp.sh
```

**Windows:**
```batch
cd scripts
setup-github-mcp.bat
```

O script irá:
- ✅ Verificar dependências (Node.js, npx)
- ✅ Solicitar seu GitHub Personal Access Token
- ✅ Testar o token
- ✅ Configurar automaticamente o claude_desktop_config.json
- ✅ Fazer backup da configuração existente
- ✅ Configurar GitHub, Filesystem e Memory MCPs

### Links Úteis

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP GitHub](https://github.com/modelcontextprotocol)
- [Claude Desktop](https://claude.ai/desktop)
- [Supabase Database Settings](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database)

### 📖 Guias Específicos

- **[GitHub MCP Setup](./GITHUB_MCP_SETUP.md)** - Guia completo de configuração do GitHub MCP
  - Criar Personal Access Token
  - Configurar permissões
  - Casos de uso e exemplos
  - Troubleshooting específico

## 🎯 Exemplo de Uso

### Workflow Típico

1. **Abrir Claude Desktop**
2. **Pedir análise:**
   ```
   Analise o componente ChatPage.tsx e sugira melhorias
   ```

3. **Ver dados:**
   ```
   Mostre os últimos 10 posts do feed
   ```

4. **Fazer mudanças:**
   ```
   Crie um novo componente LoadingSpinner.tsx na pasta components
   ```

5. **Testar:**
   ```
   Verifique se há erros de TypeScript nos componentes
   ```

---

**MCP configurado! Agora Claude pode ajudar ainda mais! 🚀**
