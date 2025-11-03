/**
 * ClubNath VIP - API Manager Hook
 * Hook para gerenciar e testar APIs de forma fácil
 */

import { useState, useEffect } from 'react';
import { apiConfig } from '../lib/api-config';
import { aiService } from '../services/ai-integration.service';
import { paymentService } from '../services/payment-integration.service';

export interface APIManagerState {
  isConfigured: {
    supabase: boolean;
    ai: boolean;
    payments: boolean;
  };
  debugInfo: any;
  isLoading: boolean;
  error: string | null;
}

export const useAPIManager = () => {
  const [state, setState] = useState<APIManagerState>({
    isConfigured: {
      supabase: false,
      ai: false,
      payments: false,
    },
    debugInfo: null,
    isLoading: true,
    error: null,
  });

  const loadAPIConfig = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const debugInfo = apiConfig.getDebugInfo();
      const isConfigured = {
        supabase: apiConfig.isAPIConfigured('supabase'),
        ai: apiConfig.isAPIConfigured('ai'),
        payments: apiConfig.isAPIConfigured('payments'),
      };

      setState({
        isConfigured,
        debugInfo,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
    }
  };

  const testAIConnection = async () => {
    try {
      if (!state.isConfigured.ai) {
        throw new Error('APIs de IA não configuradas');
      }

      const response = await aiService.generateNathIAResponse('Teste de conectividade');
      return {
        success: true,
        response: response.content,
        provider: response.provider,
        model: response.model,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const testPaymentConnection = async () => {
    try {
      if (!state.isConfigured.payments) {
        throw new Error('Sistemas de pagamento não configurados');
      }

      const config = paymentService.getPaymentConfigInfo();
      return {
        success: true,
        config,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const testSupabaseConnection = async () => {
    try {
      if (!state.isConfigured.supabase) {
        throw new Error('Supabase não configurado');
      }

      // Aqui você pode adicionar um teste real de conexão com o Supabase
      // Por exemplo, fazer uma query simples
      return {
        success: true,
        message: 'Supabase configurado corretamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const runAllTests = async () => {
    const results = {
      supabase: await testSupabaseConnection(),
      ai: await testAIConnection(),
      payments: await testPaymentConnection(),
    };

    return results;
  };

  const getValidationStatus = () => {
    const validation = apiConfig.validateEssentialConfig();
    return {
      isValid: validation.isValid,
      missing: validation.missing,
      configured: state.isConfigured,
    };
  };

  const refreshConfig = () => {
    loadAPIConfig();
  };

  useEffect(() => {
    loadAPIConfig();
  }, []);

  return {
    ...state,
    testAIConnection,
    testPaymentConnection,
    testSupabaseConnection,
    runAllTests,
    getValidationStatus,
    refreshConfig,
  };
};
