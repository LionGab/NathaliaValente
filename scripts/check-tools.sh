#!/bin/bash

# ================================================
# VERIFICAÇÃO DE FERRAMENTAS - CLUBNATH
# ================================================
# Verifica se todas as ferramentas necessárias estão disponíveis

echo "🔍 Verificando ferramentas disponíveis no ambiente..."
echo ""

# ================================================
# FUNCTION: Check Command
# ================================================
check_command() {
    local cmd=$1
    local display_name=${2:-$cmd}
    local version_flag=${3:---version}

    if command -v "$cmd" >/dev/null 2>&1; then
        local version=$($cmd $version_flag 2>&1 | head -n 1)
        echo "✅ $display_name - $version"
        return 0
    else
        echo "❌ $display_name - não encontrado"
        return 1
    fi
}

# ================================================
# CATEGORIAS DE FERRAMENTAS
# ================================================

echo "📦 Node.js & Package Managers:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command node "Node.js" "-v"
check_command npm "npm" "-v"
check_command npx "npx" "-v"
check_command yarn "yarn" "-v" 2>/dev/null || true
check_command pnpm "pnpm" "-v" 2>/dev/null || true
echo ""

echo "🔧 Build Tools & Compilers:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command tsc "TypeScript" "-v"
check_command vite "Vite" "--version"
check_command esbuild "esbuild" "--version"
echo ""

echo "🧪 Testing:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command vitest "Vitest" "--version"
echo ""

echo "🎨 Code Quality:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command eslint "ESLint" "--version"
check_command prettier "Prettier" "--version"
echo ""

echo "🐙 Version Control:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command git "Git" "--version"
check_command gh "GitHub CLI" "--version" 2>/dev/null || echo "⚠️  gh (GitHub CLI) - não encontrado (opcional)"
echo ""

echo "🗄️  Database Tools:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command supabase "Supabase CLI" "--version" 2>/dev/null || echo "⚠️  supabase - não encontrado (opcional para desenvolvimento local)"
echo ""

echo "🖼️  Image Processing:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command sharp "Sharp" "--version" 2>/dev/null || echo "⚠️  sharp - disponível via npm (usado para otimização de avatars)"
echo ""

echo "🌐 Network Tools:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command curl "curl" "--version" | head -n 1
check_command wget "wget" "--version" | head -n 1
echo ""

echo "📝 Editors & Utilities:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check_command vim "vim" "--version" | head -n 1
check_command nano "nano" "--version" 2>&1 | head -n 1
echo ""

# ================================================
# VERIFICAÇÃO DE DEPENDÊNCIAS DO PROJETO
# ================================================
echo "📚 Dependências do Projeto:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"

    # Verificar node_modules
    if [ -d "node_modules" ]; then
        echo "✅ node_modules existe"

        # Contar pacotes instalados
        PKG_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
        echo "   📦 $PKG_COUNT pacotes instalados"
    else
        echo "❌ node_modules não encontrado"
        echo "   💡 Execute: npm install"
    fi

    # Verificar scripts disponíveis
    echo ""
    echo "🎯 Scripts disponíveis:"
    node -pe "Object.keys(require('./package.json').scripts).map(s => '   • ' + s).join('\n')"
else
    echo "❌ package.json não encontrado"
fi
echo ""

# ================================================
# VERIFICAÇÃO DE CONFIGURAÇÕES
# ================================================
echo "⚙️  Arquivos de Configuração:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
    fi
}

check_file "tsconfig.json"
check_file "tsconfig.app.json"
check_file "vite.config.ts"
check_file "tailwind.config.js"
check_file "eslint.config.js"
check_file ".prettierrc"
check_file "vitest.config.ts"
check_file ".env"
check_file "CLAUDE.md"
check_file ".claude/settings.json"
echo ""

# ================================================
# VERIFICAÇÃO DE AMBIENTE
# ================================================
echo "🌍 Variáveis de Ambiente:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    echo "✅ Arquivo .env existe"

    # Verificar variáveis críticas (sem mostrar valores)
    check_env_var() {
        if grep -q "^$1=" .env 2>/dev/null; then
            echo "✅ $1 definido"
        else
            echo "❌ $1 não definido"
        fi
    }

    check_env_var "VITE_SUPABASE_URL"
    check_env_var "VITE_SUPABASE_ANON_KEY"
else
    echo "⚠️  Arquivo .env não encontrado"
    echo "   💡 Copie .env.example e configure as variáveis"
fi
echo ""

# ================================================
# RESUMO FINAL
# ================================================
echo "📊 Resumo:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificações críticas
CRITICAL_OK=true

if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js não encontrado (CRÍTICO)"
    CRITICAL_OK=false
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm não encontrado (CRÍTICO)"
    CRITICAL_OK=false
fi

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules não encontrado - execute 'npm install'"
    CRITICAL_OK=false
fi

if [ ! -f ".env" ]; then
    echo "⚠️  .env não configurado"
fi

if $CRITICAL_OK; then
    echo "✅ Ambiente pronto para desenvolvimento!"
else
    echo "❌ Alguns requisitos críticos não foram atendidos"
    echo "   Resolva os problemas acima antes de continuar"
fi

echo ""
echo "💡 Dica: Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo ""
