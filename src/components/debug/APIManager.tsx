/**
 * ClubNath VIP - API Manager
 * Componente principal para gerenciar e testar todas as APIs
 */

import React, { useState } from 'react';
import { Settings, TestTube, Database, Brain, CreditCard, Zap } from 'lucide-react';
import { APIDebugPanel } from './APIDebugPanel';
import { APITestPanel } from './APITestPanel';
import { apiConfig } from '../../lib/api-config';

interface APIManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIManager: React.FC<APIManagerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'debug' | 'test'>('debug');
  const [debugOpen, setDebugOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);

  const debugInfo = apiConfig.getDebugInfo();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Gerenciador de APIs
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ClubNath VIP - Configurações e Testes
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

          {/* Quick Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {debugInfo?.configuredAPIs?.supabase ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Supabase</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <Brain className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {debugInfo?.configuredAPIs?.ai ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Inteligência Artificial</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <CreditCard className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {debugInfo?.configuredAPIs?.payments ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pagamentos</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {debugInfo?.validation?.isValid ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Validação</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('debug')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'debug'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Debug & Configurações
              </div>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'test'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TestTube className="w-4 h-4" />
                Testes & Validação
              </div>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'debug' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Informações de Debug
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Visualize o status detalhado de todas as APIs e configurações.
                </p>
                <button
                  onClick={() => setDebugOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Abrir Painel de Debug
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Configurações Essenciais
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Supabase URL:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {debugInfo?.configuredAPIs?.supabase ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">APIs de IA:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {debugInfo?.configuredAPIs?.ai ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pagamentos:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {debugInfo?.configuredAPIs?.payments ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Funcionalidades Ativas
                  </h4>
                  <div className="space-y-2">
                    {debugInfo?.features && Object.entries(debugInfo.features).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {value ? '✅' : '❌'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Testes de Integração
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Execute testes para verificar se todas as APIs estão funcionando corretamente.
                </p>
                <button
                  onClick={() => setTestOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Executar Testes
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Testes Disponíveis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Conexão Supabase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Teste NathIA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sistemas de Pagamento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Validação Geral</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Status Atual
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ambiente:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {debugInfo?.environment || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Desenvolvimento:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {debugInfo?.isDevelopment ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Dados Mock:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {debugInfo?.useMockData ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                ClubNath VIP v{debugInfo?.appVersion || '1.0.0'}
              </div>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <APIDebugPanel isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
      <APITestPanel isOpen={testOpen} onClose={() => setTestOpen(false)} />
    </>
  );
};
