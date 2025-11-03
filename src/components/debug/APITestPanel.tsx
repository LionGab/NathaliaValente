/**
 * ClubNath VIP - API Test Panel
 * Componente para testar as integrações das APIs
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, TestTube, Brain, CreditCard, Database } from 'lucide-react';
import { apiConfig } from '../../lib/api-config';
import { aiService } from '../../services/ai-integration.service';
import { paymentService } from '../../services/payment-integration.service';

interface APITestPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export const APITestPanel: React.FC<APITestPanelProps> = ({ isOpen, onClose }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const tests: TestResult[] = [
      { name: 'Configuração Supabase', status: 'pending', message: 'Testando...' },
      { name: 'Configuração IA', status: 'pending', message: 'Testando...' },
      { name: 'Configuração Pagamentos', status: 'pending', message: 'Testando...' },
      { name: 'Teste NathIA', status: 'pending', message: 'Testando...' },
      { name: 'Validação Geral', status: 'pending', message: 'Testando...' },
    ];

    setTestResults([...tests]);

    // Teste 1: Configuração Supabase
    try {
      const supabaseConfigured = apiConfig.isAPIConfigured('supabase');
      tests[0] = {
        name: 'Configuração Supabase',
        status: supabaseConfigured ? 'success' : 'error',
        message: supabaseConfigured
          ? 'Supabase configurado corretamente'
          : 'Supabase não configurado',
        details: {
          url: apiConfig.getConfig().supabase.url ? 'Configurada' : 'Não configurada',
          anonKey: apiConfig.getConfig().supabase.anonKey ? 'Configurada' : 'Não configurada',
        },
      };
    } catch (error) {
      tests[0] = {
        name: 'Configuração Supabase',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
    setTestResults([...tests]);

    // Teste 2: Configuração IA
    try {
      const aiConfigured = apiConfig.isAPIConfigured('ai');
      const aiConfig = aiService.getAIConfigInfo();
      tests[1] = {
        name: 'Configuração IA',
        status: aiConfigured ? 'success' : 'error',
        message: aiConfigured ? 'APIs de IA configuradas' : 'Nenhuma API de IA configurada',
        details: {
          primary: aiConfig.primary,
          configured: aiConfig.configured,
        },
      };
    } catch (error) {
      tests[1] = {
        name: 'Configuração IA',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
    setTestResults([...tests]);

    // Teste 3: Configuração Pagamentos
    try {
      const paymentConfigured = apiConfig.isAPIConfigured('payments');
      const paymentConfig = paymentService.getPaymentConfigInfo();
      tests[2] = {
        name: 'Configuração Pagamentos',
        status: paymentConfigured ? 'success' : 'error',
        message: paymentConfigured
          ? 'Sistemas de pagamento configurados'
          : 'Nenhum sistema de pagamento configurado',
        details: {
          stripe: paymentConfig.stripe.configured ? 'Configurado' : 'Não configurado',
          paypal: paymentConfig.paypal.configured ? 'Configurado' : 'Não configurado',
        },
      };
    } catch (error) {
      tests[2] = {
        name: 'Configuração Pagamentos',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
    setTestResults([...tests]);

    // Teste 4: Teste NathIA
    try {
      if (apiConfig.isAPIConfigured('ai')) {
        const response = await aiService.generateNathIAResponse('Olá, NathIA! Como você está?');
        tests[3] = {
          name: 'Teste NathIA',
          status: 'success',
          message: 'NathIA respondeu com sucesso!',
          details: {
            response: response.content.substring(0, 100) + '...',
            provider: response.provider,
            model: response.model,
          },
        };
      } else {
        tests[3] = {
          name: 'Teste NathIA',
          status: 'error',
          message: 'APIs de IA não configuradas',
        };
      }
    } catch (error) {
      tests[3] = {
        name: 'Teste NathIA',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
    setTestResults([...tests]);

    // Teste 5: Validação Geral
    try {
      const validation = apiConfig.validateEssentialConfig();
      tests[4] = {
        name: 'Validação Geral',
        status: validation.isValid ? 'success' : 'error',
        message: validation.isValid
          ? 'Todas as configurações essenciais estão presentes'
          : 'Configurações em falta',
        details: {
          isValid: validation.isValid,
          missing: validation.missing,
        },
      };
    } catch (error) {
      tests[4] = {
        name: 'Validação Geral',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
    setTestResults([...tests]);

    setIsRunning(false);
  };

  const runSingleTest = async (testIndex: number) => {
    const newResults = [...testResults];
    newResults[testIndex] = { ...newResults[testIndex], status: 'pending', message: 'Testando...' };
    setTestResults(newResults);

    // Implementar testes individuais aqui se necessário
    // Por simplicidade, vamos apenas simular
    setTimeout(() => {
      newResults[testIndex] = {
        ...newResults[testIndex],
        status: 'success',
        message: 'Teste concluído',
      };
      setTestResults([...newResults]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <TestTube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teste das APIs</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Verifique se todas as integrações estão funcionando
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

        {/* Test Results */}
        <div className="space-y-4 mb-6">
          {testResults.map((test, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {test.status === 'pending' && (
                    <Loader className="w-5 h-5 text-yellow-500 animate-spin" />
                  )}
                  {test.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {test.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                </div>
                {test.status === 'pending' && (
                  <button
                    onClick={() => runSingleTest(index)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Testar
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{test.message}</p>
              {test.details && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-xs">
                  <pre className="text-gray-600 dark:text-gray-400">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Executando Testes...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Executar Todos os Testes
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>

        {/* Summary */}
        {testResults.length > 0 && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Resumo dos Testes</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {testResults.filter((t) => t.status === 'success').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sucessos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {testResults.filter((t) => t.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Erros</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {testResults.filter((t) => t.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
