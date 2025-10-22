# Claude Code Configuration - ClubNath

Este diretório contém configurações específicas para o Claude Code, otimizando a experiência de desenvolvimento com IA.

## 📁 Estrutura

```
.claude/
├── README.md           # Este arquivo
└── settings.json       # Configurações do Claude Code
```

## ⚙️ settings.json

### SessionStart Hooks

Executado automaticamente quando uma sessão Claude Code é iniciada:

- ✅ **Verifica versões** de Node.js e npm
- ✅ **Instala dependências** se necessário
- ✅ **Valida arquivo .env**
- ✅ **Exibe comandos úteis**

### Network Access

Configurado para permitir acesso a:
- `supabase.co` - Backend e database
- `github.com` - Repositório
- `npmjs.com` - Pacotes npm

### Preferences

- `autoInstallDependencies: true` - Instala automaticamente dependências
- `checkToolsOnStartup: true` - Verifica ferramentas na inicialização
- `showWelcomeMessage: true` - Mostra mensagem de boas-vindas

## 🚀 Uso

### Primeira Sessão

1. Claude Code detecta o repositório
2. Executa `scripts/install-deps.sh` automaticamente
3. Verifica ambiente e dependências
4. Exibe comandos úteis

### Comandos Úteis

**Verificar ferramentas disponíveis:**
```bash
bash scripts/check-tools.sh
```

**Instalar/atualizar dependências manualmente:**
```bash
bash scripts/install-deps.sh
```

## 📚 Documentação

### CLAUDE.md

Arquivo principal com:
- Comandos essenciais
- Estrutura de arquivos
- Guia de estilo
- Padrões de teste
- Troubleshooting

**Acesse:** `/CLAUDE.md`

### Guias Específicos

- **Setup Supabase:** `/docs/setup/SUPABASE_SETUP.md`
- **Migrations:** `/APLICAR_MIGRATIONS.md`
- **Deploy:** `/DEPLOY_AGORA.md`
- **Auditoria:** `/docs/audit-2025-10-22.md`

## 🔧 Personalização

### Adicionar Novos Hooks

Edite `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "seu_comando_aqui"
          }
        ]
      }
    ]
  }
}
```

### Restringir Network Access

```json
{
  "networkAccess": {
    "enabled": true,
    "allowedDomains": [
      "dominio.com"
    ]
  }
}
```

## 🐛 Troubleshooting

### Hook não executa

1. Verifique permissões: `chmod +x scripts/*.sh`
2. Verifique caminho em `settings.json`
3. Teste manualmente: `bash scripts/install-deps.sh`

### Dependências não instalam

1. Verifique versão do Node: `node --version` (>=20.19.0)
2. Limpe cache: `rm -rf node_modules package-lock.json`
3. Reinstale: `npm install`

### .env não encontrado

1. Copie exemplo: `cp .env.example .env`
2. Configure variáveis: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

## 📖 Recursos

- [Claude Code Docs](https://docs.anthropic.com/claude/docs/claude-code)
- [GitHub Integration](https://docs.anthropic.com/claude/docs/github-integration)
- [Best Practices](https://docs.anthropic.com/claude/docs/best-practices)

## 🆘 Suporte

Se encontrar problemas:

1. Consulte `CLAUDE.md` para guias
2. Execute `check-tools.sh` para diagnóstico
3. Verifique logs do hook no console Claude Code
4. Abra issue no GitHub repository

---

**Última atualização:** 2025-10-22
