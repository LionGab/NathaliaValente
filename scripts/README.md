# 🛠️ Scripts de Configuração - ClubNath

Scripts automatizados para facilitar a configuração do projeto ClubNath.

## 📋 Scripts Disponíveis

### 🐙 GitHub MCP Setup

Configura automaticamente o GitHub MCP (Model Context Protocol) no Claude Desktop.

**Linux/Mac:**
```bash
chmod +x setup-github-mcp.sh
./setup-github-mcp.sh
```

**Windows:**
```batch
setup-github-mcp.bat
```

**O que o script faz:**
- ✅ Verifica dependências (Node.js, npx)
- ✅ Solicita seu GitHub Personal Access Token
- ✅ Valida o token via GitHub API
- ✅ Detecta automaticamente seu sistema operacional
- ✅ Cria backup da configuração existente
- ✅ Configura `claude_desktop_config.json` automaticamente
- ✅ Configura MCPs: GitHub, Filesystem, PostgreSQL (opcional), Memory

**Pré-requisitos:**
- Node.js 18+ instalado
- GitHub Personal Access Token com scope `repo`
- Claude Desktop instalado

**Criar GitHub Token:**
1. Acesse: https://github.com/settings/tokens/new
2. Nome: `Claude MCP - ClubNath`
3. Selecione scopes:
   - ✅ `repo` (acesso completo a repositórios)
   - ✅ `workflow` (GitHub Actions)
   - ✅ `read:org` (ler organizações)
4. Gere e copie o token

**Troubleshooting:**
- **Node.js não encontrado:** Instale de https://nodejs.org
- **Token inválido:** Verifique se copiou corretamente e se tem os scopes corretos
- **Claude não reconhece MCPs:** Reinicie o Claude Desktop completamente

---

## 📚 Documentação Relacionada

- **[GitHub MCP Setup](../docs/GITHUB_MCP_SETUP.md)** - Guia completo do GitHub MCP
- **[MCP Setup](../docs/MCP_SETUP.md)** - Configuração geral de MCPs
- **[README Principal](../README.md)** - Documentação do projeto

---

## 🔐 Segurança

**IMPORTANTE:**
- ⚠️ **NUNCA** commite seus tokens no Git
- ⚠️ Configure expiração nos tokens (recomendado: 90 dias)
- ⚠️ Use tokens com permissões mínimas necessárias
- ⚠️ Revogue tokens não utilizados

**Onde ficam os tokens:**
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Esses arquivos NÃO devem ser commitados!**

---

## 🚀 Após o Setup

Depois de executar o script:

1. **Reinicie o Claude Desktop** completamente
2. **Teste a conexão:**
   ```
   Claude, você tem acesso ao GitHub MCP?
   Liste as issues abertas do ClubNath
   ```
3. **Explore os recursos:**
   ```
   Mostre os últimos commits do repositório
   Busque por "ChatPage" no código
   Crie uma issue de teste
   ```

---

## 💡 Recursos do GitHub MCP

Com o GitHub MCP configurado, você pode:

- 📝 **Issues:** Criar, listar, atualizar e fechar
- 🔀 **Pull Requests:** Criar, revisar, comentar e mergear
- 🔍 **Código:** Buscar arquivos e conteúdo
- 📊 **Análise:** Ver commits, branches e histórico
- 🏷️ **Organização:** Labels, milestones, projects
- 👥 **Colaboração:** Gerenciar colaboradores e permissões

**Exemplo de workflow:**
```
1. "Crie uma branch feature/new-feature a partir de main"
2. "Mostre os TODOs em src/components/"
3. "Crie uma issue para implementar notificações"
4. "Crie um PR da branch feature/new-feature para main"
5. "Faça merge do PR #42"
```

---

## 🤝 Contribuindo

Encontrou um bug ou tem uma sugestão?
- Abra uma issue: https://github.com/LionGab/boltnathH/issues
- Consulte o guia de contribuição no README principal

---

**Scripts criados com 💕 para facilitar o desenvolvimento do ClubNath**
