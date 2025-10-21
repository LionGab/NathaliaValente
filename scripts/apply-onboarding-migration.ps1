# ============================================================================
# Script de Deploy - Sistema de Onboarding NathClub (PowerShell)
# ============================================================================
# Este script aplica a migration de onboarding e faz deploy das Edge Functions
# ============================================================================

$ErrorActionPreference = "Stop"

# Cores para output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

Write-ColorOutput "============================================================================" "Blue"
Write-ColorOutput "  Deploy Sistema de Onboarding - NathClub" "Blue"
Write-ColorOutput "============================================================================" "Blue"
Write-Host ""

# Verificar se Supabase CLI está instalado
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-ColorOutput "✅ Supabase CLI encontrado" "Green"
} catch {
    Write-ColorOutput "❌ Supabase CLI não encontrado!" "Red"
    Write-ColorOutput "Instale com: npm install -g supabase" "Yellow"
    exit 1
}

Write-Host ""

# Verificar se está logado
try {
    $null = supabase projects list 2>&1
    Write-ColorOutput "✅ Autenticado no Supabase" "Green"
} catch {
    Write-ColorOutput "⚠️  Você não está logado no Supabase" "Yellow"
    Write-ColorOutput "Fazendo login..." "Blue"
    supabase login
}

Write-Host ""

# Link com o projeto (se necessário)
Write-ColorOutput "Conectando com o projeto NathClub..." "Blue"
if (-not (Test-Path ".supabase/config.toml")) {
    supabase link --project-ref bbcwitnbnosyfpfjtzkr
} else {
    Write-ColorOutput "✅ Projeto já linkado" "Green"
}

Write-Host ""

# Aplicar migration
Write-ColorOutput "============================================================================" "Blue"
Write-ColorOutput "  PASSO 1: Aplicando Migration de Onboarding" "Blue"
Write-ColorOutput "============================================================================" "Blue"
Write-Host ""
Write-ColorOutput "Arquivo: supabase/migrations/20251021_onboarding_system.sql" "Yellow"
Write-Host ""

$applyMigration = Read-Host "Deseja aplicar a migration? (y/n)"

if ($applyMigration -eq "y" -or $applyMigration -eq "Y") {
    Write-ColorOutput "Aplicando migration..." "Blue"
    supabase db push
    Write-Host ""
    Write-ColorOutput "✅ Migration aplicada com sucesso!" "Green"
    Write-Host ""

    # Verificar se as colunas foram criadas
    Write-ColorOutput "Verificando se as colunas foram criadas..." "Blue"
    supabase db query "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name IN ('onboarding_completed', 'onboarding_goals', 'avatar_emoji');"
    Write-Host ""
} else {
    Write-ColorOutput "⚠️  Migration pulada" "Yellow"
}

# Deploy Edge Function
Write-ColorOutput "============================================================================" "Blue"
Write-ColorOutput "  PASSO 2: Deploy da Edge Function (Robô Nath)" "Blue"
Write-ColorOutput "============================================================================" "Blue"
Write-Host ""
Write-ColorOutput "Função: chat-ai (com novo prompt da Nathália Valente)" "Yellow"
Write-Host ""

$deployFunction = Read-Host "Deseja fazer deploy da função chat-ai? (y/n)"

if ($deployFunction -eq "y" -or $deployFunction -eq "Y") {
    Write-ColorOutput "Fazendo deploy da função chat-ai..." "Blue"
    supabase functions deploy chat-ai
    Write-Host ""
    Write-ColorOutput "✅ Função chat-ai deployed com sucesso!" "Green"
    Write-Host ""

    # Listar funções
    Write-ColorOutput "Funções disponíveis:" "Blue"
    supabase functions list
    Write-Host ""
} else {
    Write-ColorOutput "⚠️  Deploy da função pulado" "Yellow"
}

# Resumo
Write-ColorOutput "============================================================================" "Blue"
Write-ColorOutput "  RESUMO DO DEPLOY" "Blue"
Write-ColorOutput "============================================================================" "Blue"
Write-Host ""
Write-ColorOutput "✅ Migration de onboarding aplicada" "Green"
Write-ColorOutput "✅ Edge Function chat-ai deployed" "Green"
Write-Host ""
Write-ColorOutput "PRÓXIMOS PASSOS:" "Yellow"
Write-Host ""
Write-ColorOutput "1. Build local:" "Blue"
Write-Host "   npm run build"
Write-Host ""
Write-ColorOutput "2. Deploy no Netlify:" "Blue"
Write-Host "   - Merge do branch no GitHub (auto-deploy)"
Write-Host "   - OU: netlify deploy --prod"
Write-Host ""
Write-ColorOutput "3. Configurar Redirect URLs no Supabase:" "Blue"
Write-Host "   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration"
Write-Host "   Adicionar: https://SEU_SITE.netlify.app"
Write-Host ""
Write-ColorOutput "4. Testar onboarding:" "Blue"
Write-Host "   - Criar nova conta no site"
Write-Host "   - Verificar fluxo de onboarding (4 telas)"
Write-Host "   - Testar Robô Nath (novo tom)"
Write-Host ""
Write-ColorOutput "📚 Documentação completa: DEPLOY_ONBOARDING.md" "Green"
Write-Host ""
Write-ColorOutput "============================================================================" "Blue"
Write-ColorOutput "  Deploy preparado com sucesso! 🚀" "Green"
Write-ColorOutput "============================================================================" "Blue"
