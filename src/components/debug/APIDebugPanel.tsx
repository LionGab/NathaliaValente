/**
 * ClubNath VIP - API Debug Panel
 * Componente para debug e monitoramento das APIs configuradas
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Settings, Zap, CreditCard, Brain, Database } from 'lucide-react';
import { apiConfig } from '../../lib/api-config';
import { aiService } from '../../services/ai-integration.service';
import { paymentService } from '../../services/payment-integration.service';

interface APIDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIDebugPanel: React.FC<APIDebugPanelProps> = ({ isOpen, onClose }) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDebugInfo();
    }
  }, [isOpen]);

  const loadDebugInfo = async () => {
    setIsLoading(true);
    try {
      const info = apiConfig.getDebugInfo();
      setDebugInfo(info);
    } catch (error) {
      console.error('Erro ao carregar informações de debug:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testAIConnection = async () => {
    try {
      const response = await aiService.generateNathIAResponse('Olá, NathIA! Como você está?');
      return { success: true, response: response.content.substring(0, 100) + '...' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  const testPaymentConnection = async () => {
    try {
      const config = paymentService.getPaymentConfigInfo();
      return { success: true, config };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Debug das APIs
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status das integrações e configurações
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Informações Gerais
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ambiente</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {debugInfo?.environment || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Desenvolvimento</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {debugInfo?.isDevelopment ? 'Sim' : 'Não'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Dados Mock</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {debugInfo?.useMockData ? 'Sim' : 'Não'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">URL Base</p>
                  <p className="font-medium text-gray-900 dark:text-white text-xs">
                    {debugInfo?.apiBaseURL || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status das APIs */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Supabase */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Supabase
                  </h3>
                  {debugInfo?.configuredAPIs?.supabase ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Banco de dados e autenticação
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    URL: {debugInfo?.configuredAPIs?.supabase ? 'Configurada' : 'Não configurada'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Chave: {debugInfo?.configuredAPIs?.supabase ? 'Configurada' : 'Não configurada'}
                  </p>
                </div>
              </div>

              {/* IA */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Inteligência Artificial
                  </h3>
                  {debugInfo?.configuredAPIs?.ai ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  NathIA e assistência virtual
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    Primária: {debugInfo?.primaryAI || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Configurada: {debugInfo?.configuredAPIs?.ai ? 'Sim' : 'Não'}
                  </p>
                </div>
              </div>

              {/* Pagamentos */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pagamentos
                  </h3>
                  {debugInfo?.configuredAPIs?.payments ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Stripe e PayPal
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    Stripe: {debugInfo?.configuredAPIs?.payments ? 'Configurado' : 'Não configurado'}
                  </p>
                  <p className="text-xs text-gray-500">
                    PayPal: {debugInfo?.configuredAPIs?.payments ? 'Configurado' : 'Não configurado'}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Funcionalidades
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Recursos habilitados
                </p>
                <div className="space-y-1">
                  {debugInfo?.features && Object.entries(debugInfo.features).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Validação */}
            {debugInfo?.validation && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Validação das Configurações
                </h3>
                {debugInfo.validation.isValid ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Todas as configurações essenciais estão presentes</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>Configurações em falta:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {debugInfo.validation.missing.map((item: string, index: number) => (
                        <li key={index} className="text-sm text-red-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3">
              <button
                onClick={loadDebugInfo}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Atualizar Status
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
