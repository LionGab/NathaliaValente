#!/bin/bash

# 🧪 Demonstração da Configuração GitHub MCP
# Este script gera uma configuração de exemplo para visualização

set -e

echo "🧪 Demonstração da Configuração GitHub MCP"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Sistema detectado
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "${BLUE}Sistema detectado: ${MACHINE}${NC}"

# Definir caminho do config
if [ "$MACHINE" = "Mac" ]; then
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
elif [ "$MACHINE" = "Linux" ]; then
    CONFIG_DIR="$HOME/.config/Claude"
fi

CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
echo -e "${BLUE}Caminho do config: ${CONFIG_FILE}${NC}"
echo ""

# Caminho do projeto
PROJECT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo -e "${BLUE}Caminho do projeto: ${PROJECT_PATH}${NC}"
echo ""

# Verificar pré-requisitos
echo -e "${YELLOW}=== Verificando Pré-requisitos ===${NC}"
echo ""

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"
else
    echo "❌ Node.js não encontrado"
    exit 1
fi

# npx
if command -v npx &> /dev/null; then
    echo -e "${GREEN}✅ npx disponível${NC}"
else
    echo "❌ npx não encontrado"
    exit 1
fi

echo ""
echo -e "${YELLOW}=== Configuração MCP que será criada ===${NC}"
echo ""

# Gerar configuração de exemplo
cat << 'EOF'
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
        "postgresql://postgres:SUA_SENHA@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
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
EOF

echo ""
echo -e "${YELLOW}=== MCPs Configurados ===${NC}"
echo ""
echo "  ✅ clubnath-github     - GitHub API (issues, PRs, code search)"
echo "  ✅ clubnath-filesystem - Acesso aos arquivos locais"
echo "  ✅ clubnath-postgres   - Conexão com Supabase PostgreSQL"
echo "  ✅ clubnath-memory     - Contexto persistente entre sessões"
echo ""

echo -e "${YELLOW}=== Recursos Disponíveis ===${NC}"
echo ""
echo "📝 GitHub:"
echo "   - Criar, listar e gerenciar issues"
echo "   - Criar, revisar e mergear pull requests"
echo "   - Buscar código e arquivos"
echo "   - Analisar commits e branches"
echo ""
echo "📁 Filesystem:"
echo "   - Ler e editar arquivos do projeto"
echo "   - Navegar estrutura de pastas"
echo "   - Criar novos arquivos"
echo ""
echo "🗄️  PostgreSQL:"
echo "   - Executar queries no banco"
echo "   - Ver estrutura de tabelas"
echo "   - Analisar dados"
echo ""
echo "🧠 Memory:"
echo "   - Manter contexto entre conversas"
echo "   - Armazenar preferências"
echo ""

echo -e "${YELLOW}=== Para Executar o Setup Real ===${NC}"
echo ""
echo "1. Crie um GitHub Personal Access Token:"
echo "   https://github.com/settings/tokens/new"
echo ""
echo "2. Execute o script de setup:"
echo "   ./scripts/setup-github-mcp.sh"
echo ""
echo "3. Cole seu token quando solicitado"
echo ""
echo "4. Reinicie o Claude Desktop"
echo ""

echo -e "${GREEN}✅ Demonstração concluída!${NC}"
echo ""
echo "Consulte docs/GITHUB_MCP_SETUP.md para mais detalhes"
