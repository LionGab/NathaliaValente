# Script de verificação e configuração dos PRs automáticos

Write-Host "🤖 Verificando configuração de PRs automáticos..." -ForegroundColor Cyan
Write-Host ""

# Verificar Git
Write-Host "📋 Verificando pré-requisitos..." -ForegroundColor Yellow
Write-Host ""

$gitOk = $false
try {
    $null = git remote get-url origin 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git configurado" -ForegroundColor Green
        $gitOk = $true
    } else {
        Write-Host "❌ Git não configurado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Git não disponível" -ForegroundColor Red
}

# Verificar GitHub CLI
$ghOk = $false
try {
    $null = gh --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub CLI disponível" -ForegroundColor Green
        $ghOk = $true
    } else {
        Write-Host "❌ GitHub CLI não instalado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ GitHub CLI não disponível" -ForegroundColor Red
}

# Verificar Node.js
$nodeOk = $false
try {
    $null = node --version 2>&1
    $nodeCheck = ($LASTEXITCODE -eq 0)
    $null = npm --version 2>&1
    $npmCheck = ($LASTEXITCODE -eq 0)
    
    if ($nodeCheck -and $npmCheck) {
        Write-Host "✅ Node.js e npm disponíveis" -ForegroundColor Green
        $nodeOk = $true
    } else {
        Write-Host "❌ Node.js ou npm não instalados" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Node.js não disponível" -ForegroundColor Red
}

Write-Host ""
Write-Host "📁 Verificando workflows..." -ForegroundColor Yellow
Write-Host ""

$workflowsOk = 0
$workflowsTotal = 7

if (Test-Path ".github/workflows/auto-pr.yml") {
    Write-Host "✅ Auto Pull Request configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ Auto Pull Request não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/auto-dependency-pr.yml") {
    Write-Host "✅ Auto Dependency Update configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ Auto Dependency Update não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/auto-fix-pr.yml") {
    Write-Host "✅ Auto Fix PR configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ Auto Fix PR não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/auto-release-pr.yml") {
    Write-Host "✅ Auto Release PR configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ Auto Release PR não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/pr-management.yml") {
    Write-Host "✅ PR Management configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ PR Management não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/claude.yml") {
    Write-Host "✅ Claude Code configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ Claude Code não encontrado" -ForegroundColor Red
}

if (Test-Path ".github/workflows/claude-code-review.yml") {
    Write-Host "✅ Claude Code Review configurado" -ForegroundColor Green
    $workflowsOk++
} else {
    Write-Host "❌ Claude Code Review não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📄 Verificando arquivos de configuração..." -ForegroundColor Yellow
Write-Host ""

$configOk = 0
$configTotal = 2

if (Test-Path ".github/AUTO_PR_CONFIG.md") {
    Write-Host "✅ Documentação de configuração" -ForegroundColor Green
    $configOk++
} else {
    Write-Host "❌ Documentação não encontrada" -ForegroundColor Red
}

if (Test-Path "package.json") {
    Write-Host "✅ Package.json" -ForegroundColor Green
    $configOk++
} else {
    Write-Host "❌ Package.json não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 RELATÓRIO FINAL" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

Write-Host "FUNCIONANDO:" -ForegroundColor Green
if ($gitOk) {
    Write-Host "   ✓ Git configurado" -ForegroundColor Green
}
if ($ghOk) {
    Write-Host "   ✓ GitHub CLI disponível" -ForegroundColor Green
}
if ($nodeOk) {
    Write-Host "   ✓ Node.js e npm disponíveis" -ForegroundColor Green
}
Write-Host "   ✓ $workflowsOk/$workflowsTotal workflows configurados" -ForegroundColor Green
Write-Host "   ✓ $configOk/$configTotal arquivos de configuração" -ForegroundColor Green

if (-not $gitOk -or -not $ghOk -or -not $nodeOk -or $workflowsOk -lt $workflowsTotal) {
    Write-Host ""
    Write-Host "AÇÕES NECESSÁRIAS:" -ForegroundColor Yellow
    
    if (-not $gitOk) {
        Write-Host "   ! Configure repositório Git remoto" -ForegroundColor Yellow
    }
    if (-not $ghOk) {
        Write-Host "   ! Instale GitHub CLI: gh auth login" -ForegroundColor Yellow
    }
    if (-not $nodeOk) {
        Write-Host "   ! Instale Node.js e npm" -ForegroundColor Yellow
    }
    if ($workflowsOk -lt $workflowsTotal) {
        Write-Host "   ! Alguns workflows estão faltando" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 COMO USAR OS PRs AUTOMÁTICOS:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. PARA FEATURES:" -ForegroundColor White
Write-Host "   git checkout -b feature/nome-da-feature" -ForegroundColor Gray
Write-Host "   git commit -m 'feat: nova funcionalidade'" -ForegroundColor Gray
Write-Host "   git push origin feature/nome-da-feature" -ForegroundColor Gray
Write-Host "   → PR automático criado para 'develop'" -ForegroundColor Green
Write-Host ""

Write-Host "2. PARA BUG FIXES:" -ForegroundColor White
Write-Host "   git checkout -b bugfix/nome-do-fix" -ForegroundColor Gray
Write-Host "   git commit -m 'fix: corrige problema'" -ForegroundColor Gray
Write-Host "   git push origin bugfix/nome-do-fix" -ForegroundColor Gray
Write-Host "   → PR automático criado para 'develop'" -ForegroundColor Green
Write-Host ""

Write-Host "3. PARA HOTFIXES:" -ForegroundColor White
Write-Host "   git checkout -b hotfix/nome-do-hotfix" -ForegroundColor Gray
Write-Host "   git commit -m 'fix: correção urgente'" -ForegroundColor Gray
Write-Host "   git push origin hotfix/nome-do-hotfix" -ForegroundColor Gray
Write-Host "   → PR automático criado para 'main'" -ForegroundColor Green
Write-Host ""

Write-Host "4. PARA ISSUES:" -ForegroundColor White
Write-Host "   - Adicione label 'auto-fix' na issue" -ForegroundColor Gray
Write-Host "   → PR automático criado em modo draft" -ForegroundColor Green
Write-Host ""

Write-Host "5. PARA RELEASES:" -ForegroundColor White
Write-Host "   - Executa automaticamente sexta-feira" -ForegroundColor Gray
Write-Host "   - Ou manual: Actions → Auto Release PR" -ForegroundColor Gray
Write-Host ""

Write-Host "6. DEPENDÊNCIAS:" -ForegroundColor White
Write-Host "   - Atualiza automaticamente segunda-feira" -ForegroundColor Gray
Write-Host "   - Ou manual: Actions → Auto Dependency Update" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentação: .github/AUTO_PR_CONFIG.md" -ForegroundColor Cyan
Write-Host ""

if ($gitOk -and $ghOk -and $nodeOk -and $workflowsOk -eq $workflowsTotal) {
    Write-Host "🎉 CONFIGURAÇÃO COMPLETA! Sistema de PRs automáticos pronto!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Configure os itens pendentes e execute novamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Pronto para automatizar seus PRs! ✨" -ForegroundColor Magenta
Write-Host ""
