# Configuração Completa de MCPs para Cursor

# Este arquivo lista todos os MCPs disponíveis e como configurá-los

## 📦 MCPs Disponíveis (Total: 14)

### ✅ Essenciais - Configurados e Prontos para Uso

1. **Supabase MCP**
   - ✅ Configurado com credenciais do projeto
   - Função: Interagir com banco de dados Supabase
   - Acesso: Tabelas, queries, dados, autenticação

2. **Filesystem MCP**
   - ✅ Configurado para /workspace
   - Função: Gerenciar arquivos do projeto
   - Acesso: Ler, escrever, navegar arquivos

3. **Git MCP**
   - ✅ Configurado para repositório local
   - Função: Integração com Git
   - Acesso: Commits, branches, diffs, histórico

### ⚙️ Opcionais - Requerem Configuração Adicional

4. **Brave Search MCP**
   - ⚠️ Requer: `BRAVE_API_KEY`
   - Função: Pesquisas na web atualizadas
   - Obtém em: https://api.search.brave.com/app/keys

5. **GitHub MCP**
   - ⚠️ Requer: `GITHUB_TOKEN`
   - Função: Integração com GitHub
   - Obtém em: https://github.com/settings/tokens

6. **Postgres MCP**
   - ⚠️ Requer: `DATABASE_URL`
   - Função: Conexão direta com PostgreSQL
   - Formato: `postgresql://user:password@host:port/db`

7. **SQLite MCP**
   - ✅ Configurado
   - Função: Trabalhar com bancos SQLite locais

8. **Puppeteer MCP**
   - ✅ Configurado
   - Função: Automação de navegador
   - Uso: Testes E2E, scraping

9. **Fetch MCP**
   - ✅ Configurado
   - Função: Requisições HTTP
   - Uso: Chamadas de API

10. **Memory MCP**
    - ✅ Configurado
    - Função: Gerenciamento de memória contextual
    - Uso: Manter contexto entre conversas

11. **Sequential Thinking MCP**
    - ✅ Configurado
    - Função: Pensamento sequencial
    - Uso: Resolver problemas complexos

12. **Slack MCP**
    - ⚠️ Requer: `SLACK_BOT_TOKEN`, `SLACK_USER_TOKEN`
    - Função: Integração com Slack

13. **Everart MCP**
    - ⚠️ Requer: `EVERART_API_KEY`
    - Função: Geração de imagens

14. **Gmail MCP**
    - ⚠️ Requer: `GMAIL_CREDENTIALS_PATH`
    - Função: Integração com Gmail

## 🚀 Como Usar

### No Cursor:

1. Abra as configurações do Cursor (Ctrl+, ou Cmd+,)
2. Procure por "MCP" ou "Model Context Protocol"
3. Importe o arquivo `.cursor/mcp-config.json` ou configure manualmente
4. Reinicie o Cursor

### Via Comando:

Você pode também instalar os pacotes globalmente:

```bash
npm install -g supabase-mcp
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-sqlite
npm install -g @modelcontextprotocol/server-puppeteer
npm install -g @modelcontextprotocol/server-fetch
npm install -g @modelcontextprotocol/server-memory
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-slack
npm install -g @modelcontextprotocol/server-everart
npm install -g @modelcontextprotocol/server-gmail
```

## 📝 Variáveis de Ambiente Necessárias

Adicione ao arquivo `.env`:

```bash
# Opcionais - Adicione conforme necessário
BRAVE_API_KEY=sua_chave_aqui
GITHUB_TOKEN=seu_token_aqui
DATABASE_URL=postgresql://user:password@host:port/database
SLACK_BOT_TOKEN=xoxb-seu-token
SLACK_USER_TOKEN=xoxp-seu-token
EVERART_API_KEY=sua_chave_aqui
GMAIL_CREDENTIALS_PATH=/caminho/para/credentials.json
```

## ✅ Status Atual

- ✅ 3 MCPs essenciais configurados e prontos
- ⚠️ 11 MCPs opcionais disponíveis (requerem configuração adicional)
- 📁 Arquivos de configuração criados:
  - `.cursor/mcp-config.json` - Configuração principal
  - `cursor-mcp-config.json` - Backup/Referência
  - `CURSOR_MCP_SETUP.md` - Documentação completa

## 🎯 Próximos Passos

1. Importe a configuração no Cursor
2. Configure MCPs opcionais conforme necessidade
3. Teste cada MCP para garantir funcionamento
4. Documente qualquer configuração adicional
