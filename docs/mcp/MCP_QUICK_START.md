# 🚀 MCP Quick Start - ClubNath

## 📦 O Que Foi Configurado

Este projeto agora inclui uma configuração completa de **12 servidores MCP** para melhorar significativamente a capacidade do Claude Desktop de ajudar no desenvolvimento do ClubNath.

### ✅ MCPs Essenciais (4)
- 📁 **filesystem** - Acesso aos arquivos do projeto
- 🐙 **github** - Integração com GitHub (issues, PRs, commits)
- 🗄️ **postgres** - Acesso direto ao banco de dados Supabase
- 📦 **npm** - Gerenciamento de pacotes Node.js

### 🚀 MCPs Altamente Recomendados (5)
- 🔍 **brave-search** - Busca na web para resolver dúvidas
- 🌐 **fetch** - Fazer chamadas HTTP/API
- 🧠 **sequential-thinking** - Raciocínio complexo passo a passo
- 💾 **memory** - Manter contexto entre conversas
- 📦 **git** - Operações Git avançadas (commits, branches)

### 🔧 MCPs Opcionais (3)
- 🌐 **netlify** - Deploy e gerenciamento (você usa Netlify!)
- 🐛 **sentry** - Monitoramento de erros
- 💬 **slack** - Notificações e integração

---

## ⚡ Como Usar (3 Passos)

### 1️⃣ Copiar a Configuração

**Windows (PowerShell):**
```powershell
Copy-Item claude_desktop_config.example.json "$env:APPDATA\Claude\claude_desktop_config.json"
```

**Mac:**
```bash
cp claude_desktop_config.example.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Linux:**
```bash
cp claude_desktop_config.example.json ~/.config/Claude/claude_desktop_config.json
```

### 2️⃣ Adicionar Suas Chaves de API

Edite o arquivo copiado e substitua os placeholders:

| Variável | Onde Obter | Necessário? |
|----------|------------|-------------|
| `GITHUB_TOKEN` | [GitHub Tokens](https://github.com/settings/tokens) | ✅ Essencial |
| `[SUA_SENHA]` | [Supabase Database Settings](https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/settings/database) | ✅ Essencial |
| `BRAVE_API_KEY` | [Brave Search API](https://api.search.brave.com/app/keys) | 🎯 Recomendado |
| `NETLIFY_AUTH_TOKEN` | [Netlify Tokens](https://app.netlify.com/user/applications#personal-access-tokens) | ⭐ Opcional |
| `SENTRY_AUTH_TOKEN` | [Sentry Auth Tokens](https://sentry.io/settings/account/api/auth-tokens/) | ⭐ Opcional |
| `SLACK_BOT_TOKEN` | [Slack Apps](https://api.slack.com/apps) | ⭐ Opcional |

**Nota:** Você pode começar configurando apenas os **Essenciais** e adicionar os outros depois!

### 3️⃣ Reiniciar Claude Desktop

1. Feche **completamente** o Claude Desktop (Ctrl+Q ou Cmd+Q)
2. Abra novamente
3. Verifique se os MCPs aparecem

---

## 🧪 Testar a Configuração

Abra o Claude Desktop e pergunte:

```
Você consegue acessar os servidores MCP?
Liste os arquivos do projeto ClubNath.
```

Se funcionar, você verá algo como:
```
✓ Conectado a 12 servidores MCP
✓ Acesso ao filesystem habilitado
✓ Acesso ao GitHub habilitado
...
```

---

## 📚 Documentação Completa

Para instruções detalhadas sobre cada MCP, como obter chaves de API, exemplos de uso e solução de problemas, consulte:

- 📖 **[Guia Completo de Configuração](./docs/MCP_CONFIG_GUIDE.md)** - Instruções detalhadas para cada MCP
- 🤖 **[MCP Setup](./docs/MCP_SETUP.md)** - Configuração rápida e visão geral

---

## 💡 O Que Você Pode Fazer Agora

Com os MCPs configurados, o Claude Desktop pode:

### 📁 Com Filesystem
```
"Analise o componente ChatPage.tsx e sugira melhorias"
"Crie um novo componente LoadingSpinner.tsx"
"Refatore o código para usar TypeScript strict mode"
```

### 🐙 Com GitHub
```
"Liste as issues abertas"
"Crie uma nova issue para adicionar testes"
"Mostre os últimos commits do projeto"
```

### 🗄️ Com PostgreSQL
```
"Mostre as tabelas do banco ClubNath"
"Quantos usuários temos cadastrados?"
"Mostre os últimos 5 posts do feed"
```

### 🔍 Com Brave Search
```
"Busque na web sobre 'React Server Components'"
"Como implementar autenticação com Supabase?"
"Encontre exemplos de uso do Claude API"
```

### 🌐 Com Fetch
```
"Teste o endpoint da Edge Function chat-ai"
"Faça uma requisição para a API do GitHub"
"Verifique se o Supabase está respondendo"
```

### 💾 Com Memory
```
"Lembre-se que estamos usando Tailwind para estilos"
"Anote que a API key da Anthropic está no Supabase Secrets"
```

### 📦 Com Git
```
"Crie um novo branch para a feature X"
"Mostre o histórico de commits"
"Faça commit das mudanças recentes"
```

---

## ⚠️ Dicas Importantes

1. **Segurança**: Nunca commite o arquivo `claude_desktop_config.json` no Git (já está no `.gitignore`)

2. **Paths**: Se o projeto estiver em outro local, edite os paths no arquivo de configuração:
   ```json
   "C:\\Users\\User\\BoltValente\\boltnathH"
   ```
   
3. **Ordem**: Configure os **Essenciais** primeiro, depois adicione os **Recomendados**

4. **Testes**: Teste cada MCP individualmente após configurar

5. **Logs**: Se algo não funcionar, verifique os logs:
   - Windows: `%APPDATA%\Claude\logs`
   - Mac: `~/Library/Logs/Claude`
   - Linux: `~/.config/Claude/logs`

---

## 🆘 Precisa de Ajuda?

- 📖 Consulte o [Guia Completo](./docs/MCP_CONFIG_GUIDE.md)
- 🐛 Veja [Troubleshooting](./docs/TROUBLESHOOTING.md)
- 💬 Crie uma [issue no GitHub](https://github.com/LionGab/boltnathH/issues)

---

**Pronto! Agora o Claude Desktop está super-poderoso para ajudar no ClubNath! 🚀**

*Configuração criada especificamente para o projeto [ClubNath](https://github.com/LionGab/boltnathH)*
