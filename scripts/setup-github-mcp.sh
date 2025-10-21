#!/bin/bash

# 🐙 GitHub MCP Setup Script para ClubNath
# Este script configura automaticamente o GitHub MCP no Claude Desktop

set -e

echo "🐙 GitHub MCP Setup - ClubNath"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detectar sistema operacional
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    MINGW*)     MACHINE=Windows;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "${BLUE}Sistema detectado: ${MACHINE}${NC}"
echo ""

# Definir caminho do config baseado no OS
if [ "$MACHINE" = "Mac" ]; then
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
elif [ "$MACHINE" = "Linux" ]; then
    CONFIG_DIR="$HOME/.config/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
else
    echo -e "${RED}❌ Sistema não suportado por este script${NC}"
    echo "Para Windows, use setup-github-mcp.bat"
    exit 1
fi

echo -e "${YELLOW}Caminho do config: ${CONFIG_FILE}${NC}"
echo ""

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    echo "Instale Node.js 18+ de: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} encontrado${NC}"
echo ""

# Verificar npx
echo -e "${BLUE}Verificando npx...${NC}"
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npx encontrado${NC}"
echo ""

# Solicitar GitHub Token
echo -e "${YELLOW}┌─────────────────────────────────────────────┐${NC}"
echo -e "${YELLOW}│  GITHUB PERSONAL ACCESS TOKEN NECESSÁRIO   │${NC}"
echo -e "${YELLOW}└─────────────────────────────────────────────┘${NC}"
echo ""
echo "Para criar um token:"
echo "1. Acesse: https://github.com/settings/tokens/new"
echo "2. Nome: 'Claude MCP - ClubNath'"
echo "3. Selecione scopes:"
echo "   - ✅ repo (acesso completo a repositórios)"
echo "   - ✅ workflow (GitHub Actions)"
echo "   - ✅ read:org (ler organizações)"
echo "4. Gere e copie o token (começa com 'ghp_')"
echo ""
read -sp "Cole seu GitHub Token (ghp_...): " GITHUB_TOKEN
echo ""

# Validar token
if [[ ! $GITHUB_TOKEN =~ ^ghp_ ]]; then
    echo -e "${RED}❌ Token inválido. Deve começar com 'ghp_'${NC}"
    exit 1
fi

# Testar token
echo -e "${BLUE}Testando token...${NC}"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: token $GITHUB_TOKEN" \
    https://api.github.com/user)

if [ "$RESPONSE" != "200" ]; then
    echo -e "${RED}❌ Token inválido ou sem permissões${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Token válido!${NC}"
echo ""

# Obter caminho do projeto
PROJECT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo -e "${BLUE}Caminho do projeto: ${PROJECT_PATH}${NC}"
echo ""

# Solicitar senha do PostgreSQL (opcional)
echo -e "${YELLOW}Configuração do PostgreSQL (Supabase)${NC}"
echo "Deixe em branco para pular esta etapa"
read -sp "Senha do PostgreSQL (Supabase): " POSTGRES_PASSWORD
echo ""

# Criar diretório de config se não existir
if [ ! -d "$CONFIG_DIR" ]; then
    echo -e "${BLUE}Criando diretório de configuração...${NC}"
    mkdir -p "$CONFIG_DIR"
fi

# Backup do config existente
if [ -f "$CONFIG_FILE" ]; then
    BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${YELLOW}Fazendo backup da configuração existente...${NC}"
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo -e "${GREEN}✅ Backup salvo em: ${BACKUP_FILE}${NC}"
    echo ""
fi

# Criar configuração
echo -e "${BLUE}Criando configuração MCP...${NC}"

if [ -z "$POSTGRES_PASSWORD" ]; then
    # Sem PostgreSQL
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "clubnath-github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "$GITHUB_TOKEN"
      }
    },
    "clubnath-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "$PROJECT_PATH"
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
else
    # Com PostgreSQL
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "clubnath-github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "$GITHUB_TOKEN"
      }
    },
    "clubnath-filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "$PROJECT_PATH"
      ]
    },
    "clubnath-postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:$POSTGRES_PASSWORD@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
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
fi

echo -e "${GREEN}✅ Configuração criada com sucesso!${NC}"
echo ""

# Resumo
echo -e "${GREEN}┌─────────────────────────────────────────────┐${NC}"
echo -e "${GREEN}│          CONFIGURAÇÃO CONCLUÍDA! 🎉         │${NC}"
echo -e "${GREEN}└─────────────────────────────────────────────┘${NC}"
echo ""
echo "MCPs configurados:"
echo "  ✅ clubnath-github (GitHub API)"
echo "  ✅ clubnath-filesystem (Arquivos locais)"
if [ ! -z "$POSTGRES_PASSWORD" ]; then
    echo "  ✅ clubnath-postgres (Supabase DB)"
fi
echo "  ✅ clubnath-memory (Memória persistente)"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Reinicie o Claude Desktop completamente"
echo "2. Abra o Claude e teste: 'Liste as issues do ClubNath'"
echo "3. Consulte docs/GITHUB_MCP_SETUP.md para mais informações"
echo ""
echo -e "${GREEN}Setup completo! 🚀${NC}"
