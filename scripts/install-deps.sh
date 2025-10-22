#!/bin/bash

# ================================================
# SCRIPT DE INSTALAÇÃO DE DEPENDÊNCIAS - CLUBNATH
# ================================================
# Executado automaticamente no início de sessões Claude Code
# Configura ambiente e instala dependências necessárias

set -e  # Exit on error

echo "🚀 ClubNath - Configurando ambiente de desenvolvimento..."
echo ""

# ================================================
# 1. VERIFICAR VERSÕES NECESSÁRIAS
# ================================================
echo "📦 Verificando versões do Node.js e npm..."

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
NPM_VERSION=$(npm --version | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  WARNING: Node.js version $NODE_VERSION detected. Recomended: >= 20.19.0"
fi

if [ "$NPM_VERSION" -lt 10 ]; then
    echo "⚠️  WARNING: npm version $NPM_VERSION detected. Recommended: >= 10.0.0"
fi

echo "✅ Node: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# ================================================
# 2. VERIFICAR SE NODE_MODULES EXISTE
# ================================================
if [ ! -d "node_modules" ]; then
    echo "📥 node_modules não encontrado. Instalando dependências..."
    npm install
    echo "✅ Dependências instaladas!"
else
    echo "✅ node_modules já existe"

    # Verificar se package.json foi modificado
    if [ "package.json" -nt "node_modules" ]; then
        echo "⚡ package.json foi modificado. Atualizando dependências..."
        npm install
        echo "✅ Dependências atualizadas!"
    fi
fi
echo ""

# ================================================
# 3. VERIFICAR ARQUIVO .env
# ================================================
echo "🔐 Verificando arquivo .env..."

if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: Arquivo .env não encontrado!"
    echo "📝 Criando .env.example como referência..."

    cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Instagram OAuth (Optional)
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id_here

# Environment
VITE_ENV=development
EOF

    echo "⚠️  Por favor, crie um arquivo .env baseado em .env.example"
else
    echo "✅ Arquivo .env encontrado"

    # Verificar variáveis essenciais
    if ! grep -q "VITE_SUPABASE_URL" .env; then
        echo "⚠️  WARNING: VITE_SUPABASE_URL não encontrado em .env"
    fi

    if ! grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "⚠️  WARNING: VITE_SUPABASE_ANON_KEY não encontrado em .env"
    fi
fi
echo ""

# ================================================
# 4. VERIFICAR GIT
# ================================================
echo "🔧 Verificando configuração Git..."

if [ -d ".git" ]; then
    echo "✅ Repositório Git inicializado"

    # Verificar branch atual
    CURRENT_BRANCH=$(git branch --show-current)
    echo "📍 Branch atual: $CURRENT_BRANCH"
else
    echo "⚠️  WARNING: Git não inicializado"
fi
echo ""

# ================================================
# 5. VERIFICAR FERRAMENTAS DISPONÍVEIS
# ================================================
echo "🛠️  Verificando ferramentas disponíveis..."

command -v git >/dev/null 2>&1 && echo "✅ git" || echo "❌ git (não encontrado)"
command -v node >/dev/null 2>&1 && echo "✅ node" || echo "❌ node (não encontrado)"
command -v npm >/dev/null 2>&1 && echo "✅ npm" || echo "❌ npm (não encontrado)"
command -v tsc >/dev/null 2>&1 && echo "✅ typescript (tsc)" || echo "⚠️  typescript (instalar via npm)"

echo ""

# ================================================
# 6. EXIBIR INFORMAÇÕES DO PROJETO
# ================================================
echo "📊 Informações do Projeto:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Nome: ClubNath - Comunidade de Mães"
echo "Stack: React 18 + TypeScript + Vite + Supabase"
echo "PWA: Habilitado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ================================================
# 7. COMANDOS ÚTEIS
# ================================================
echo "📚 Comandos úteis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  npm run dev          - Iniciar servidor de desenvolvimento"
echo "  npm run build        - Build de produção"
echo "  npm run test         - Rodar testes"
echo "  npm run typecheck    - Verificar tipos TypeScript"
echo "  npm run lint         - Lint com ESLint"
echo "  npm run format       - Formatar com Prettier"
echo ""
echo "📖 Consulte CLAUDE.md para guia completo de desenvolvimento"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ================================================
# 8. VERIFICAÇÃO FINAL
# ================================================
echo "🎯 Status Final:"

WARNINGS=0

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules não encontrado"
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ node_modules OK"
fi

# Check .env
if [ ! -f ".env" ]; then
    echo "⚠️  .env não encontrado"
    WARNINGS=$((WARNINGS + 1))
else
    echo "✅ .env OK"
fi

# Check TypeScript
if npm run typecheck --silent 2>/dev/null; then
    echo "✅ TypeScript OK"
else
    echo "⚠️  TypeScript tem erros (execute: npm run typecheck)"
fi

echo ""

if [ $WARNINGS -eq 0 ]; then
    echo "✅ Ambiente pronto para desenvolvimento!"
else
    echo "⚠️  Ambiente configurado com $WARNINGS warning(s)"
    echo "    Resolva os warnings acima antes de começar"
fi

echo ""
echo "🚀 Pronto para começar! Execute 'npm run dev' para iniciar"
echo ""

exit 0
