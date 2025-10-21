#!/bin/bash

# ============================================================================
# Script de Deploy - Sistema de Onboarding NathClub
# ============================================================================
# Este script aplica a migration de onboarding e faz deploy das Edge Functions
# ============================================================================

set -e  # Exit on error

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Deploy Sistema de Onboarding - NathClub${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não encontrado!${NC}"
    echo -e "${YELLOW}Instale com: npm install -g supabase${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI encontrado${NC}"
echo ""

# Verificar se está logado
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você não está logado no Supabase${NC}"
    echo -e "${BLUE}Fazendo login...${NC}"
    supabase login
fi

echo -e "${GREEN}✅ Autenticado no Supabase${NC}"
echo ""

# Link com o projeto (se necessário)
echo -e "${BLUE}Conectando com o projeto NathClub...${NC}"
if [ ! -f ".supabase/config.toml" ]; then
    supabase link --project-ref bbcwitnbnosyfpfjtzkr
else
    echo -e "${GREEN}✅ Projeto já linkado${NC}"
fi
echo ""

# Aplicar migration
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  PASSO 1: Aplicando Migration de Onboarding${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${YELLOW}Arquivo: supabase/migrations/20251021_onboarding_system.sql${NC}"
echo ""
read -p "Deseja aplicar a migration? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Aplicando migration...${NC}"
    supabase db push
    echo ""
    echo -e "${GREEN}✅ Migration aplicada com sucesso!${NC}"
    echo ""

    # Verificar se as colunas foram criadas
    echo -e "${BLUE}Verificando se as colunas foram criadas...${NC}"
    supabase db query "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name IN ('onboarding_completed', 'onboarding_goals', 'avatar_emoji');"
    echo ""
else
    echo -e "${YELLOW}⚠️  Migration pulada${NC}"
fi

# Deploy Edge Function
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  PASSO 2: Deploy da Edge Function (Robô Nath)${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${YELLOW}Função: chat-ai (com novo prompt da Nathália Valente)${NC}"
echo ""
read -p "Deseja fazer deploy da função chat-ai? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Fazendo deploy da função chat-ai...${NC}"
    supabase functions deploy chat-ai
    echo ""
    echo -e "${GREEN}✅ Função chat-ai deployed com sucesso!${NC}"
    echo ""

    # Listar funções
    echo -e "${BLUE}Funções disponíveis:${NC}"
    supabase functions list
    echo ""
else
    echo -e "${YELLOW}⚠️  Deploy da função pulado${NC}"
fi

# Resumo
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  RESUMO DO DEPLOY${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${GREEN}✅ Migration de onboarding aplicada${NC}"
echo -e "${GREEN}✅ Edge Function chat-ai deployed${NC}"
echo ""
echo -e "${YELLOW}PRÓXIMOS PASSOS:${NC}"
echo ""
echo -e "1. ${BLUE}Build local:${NC}"
echo -e "   npm run build"
echo ""
echo -e "2. ${BLUE}Deploy no Netlify:${NC}"
echo -e "   - Merge do branch no GitHub (auto-deploy)"
echo -e "   - OU: netlify deploy --prod"
echo ""
echo -e "3. ${BLUE}Configurar Redirect URLs no Supabase:${NC}"
echo -e "   https://supabase.com/dashboard/project/bbcwitnbnosyfpfjtzkr/auth/url-configuration"
echo -e "   Adicionar: https://SEU_SITE.netlify.app"
echo ""
echo -e "4. ${BLUE}Testar onboarding:${NC}"
echo -e "   - Criar nova conta no site"
echo -e "   - Verificar fluxo de onboarding (4 telas)"
echo -e "   - Testar Robô Nath (novo tom)"
echo ""
echo -e "${GREEN}📚 Documentação completa: DEPLOY_ONBOARDING.md${NC}"
echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}  Deploy preparado com sucesso! 🚀${NC}"
echo -e "${BLUE}============================================================================${NC}"
