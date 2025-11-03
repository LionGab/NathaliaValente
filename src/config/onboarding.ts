/**
 * Configuração do Onboarding - Nossa Maternidade
 * Para desenvolvimento e teste
 */

export const ONBOARDING_CONFIG = {
  // Pular onboarding automaticamente em desenvolvimento
  SKIP_ONBOARDING: import.meta.env.DEV,

  // Forçar onboarding completo em produção
  FORCE_ONBOARDING: import.meta.env.PROD,

  // Tempo de delay para simular carregamento
  LOADING_DELAY: 1500,

  // Dados de exemplo para teste
  DEMO_DATA: {
    emotionalState: 'serena' as const,
    currentDesire: 'orientacao' as const,
    selectedArchetype: 'nutridora' as const,
    completedAt: new Date().toISOString(),
  },
};
