// =====================================================
// CLUBNATH CHAT - INDICADOR DE MEMÓRIA
// NathIA Inteligente com Memória Persistente
// =====================================================

import React, { useState } from 'react';
import { 
  Brain, 
  Heart, 
  Clock, 
  Settings, 
  Trash2, 
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatHistoryService } from '../../services/chat-history.service';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  formatChatDate, 
  getMemoryIndicatorText,
  shouldUseMemory 
} from '../../types/chat-history';

interface MemoryIndicatorProps {
  onManageMemory?: () => void;
  compact?: boolean;
  showDetails?: boolean;
}

export const MemoryIndicator: React.FC<MemoryIndicatorProps> = ({
  onManageMemory,
  compact = false,
  showDetails = false
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Queries
  const { data: context, isLoading: contextLoading } = useQuery({
    queryKey: ['chat-context', user?.id],
    queryFn: () => chatHistoryService.getChatContext(user!.id),
    enabled: !!user
  });

  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['memory-preferences', user?.id],
    queryFn: () => chatHistoryService.getMemoryPreferences(user!.id),
    enabled: !!user
  });

  // Mutations
  const clearHistoryMutation = useMutation({
    mutationFn: () => chatHistoryService.clearChatHistory(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-context', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['chat-history', user?.id] });
    }
  });

  const toggleMemoryMutation = useMutation({
    mutationFn: (enabled: boolean) => 
      chatHistoryService.updateMemoryPreferences(user!.id, { memory_enabled: enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory-preferences', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['chat-context', user?.id] });
    }
  });

  const handleExportHistory = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const historyData = await chatHistoryService.exportChatHistory(user.id, 'json');
      const blob = new Blob([historyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting history:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Tem certeza que deseja apagar todo o histórico de conversas? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    await clearHistoryMutation.mutateAsync();
  };

  const handleToggleMemory = async () => {
    if (!preferences) return;
    await toggleMemoryMutation.mutateAsync(!preferences.memory_enabled);
  };

  if (contextLoading || preferencesLoading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Carregando memória...
        </span>
      </div>
    );
  }

  if (!context || !preferences) {
    return null;
  }

  const hasMemory = context.recent_messages.length > 0 || context.recent_summaries.length > 0;
  const topicsCount = context.recent_summaries.reduce((acc, summary) => acc + summary.topics.length, 0);
  const lastInteraction = context.recent_messages[0]?.created_at;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
          hasMemory && preferences.memory_enabled
            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          <Brain className="w-3 h-3" />
          <span>
            {preferences.memory_enabled ? 'Memória Ativa' : 'Memória Desativada'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-pink-200 dark:border-pink-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${
            hasMemory && preferences.memory_enabled
              ? 'bg-pink-100 dark:bg-pink-900/30'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Brain className={`w-5 h-5 ${
              hasMemory && preferences.memory_enabled
                ? 'text-pink-600 dark:text-pink-400'
                : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Memória do NathIA
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getMemoryIndicatorText(hasMemory && preferences.memory_enabled, topicsCount)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleToggleMemory}
            variant="ghost"
            size="sm"
            className={preferences.memory_enabled ? 'text-green-600' : 'text-gray-400'}
          >
            {preferences.memory_enabled ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
          >
            {showSettings ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-gray-600 dark:text-gray-400">
              {context.recent_messages.length} mensagens
            </span>
          </div>
          
          {topicsCount > 0 && (
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {topicsCount} tópicos
              </span>
            </div>
          )}
          
          {lastInteraction && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {formatChatDate(lastInteraction)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Configurações */}
      {showSettings && (
        <div className="border-t border-pink-200 dark:border-pink-800 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Memória Ativada
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                NathIA lembra de conversas anteriores
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.memory_enabled}
                onChange={(e) => toggleMemoryMutation.mutate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Respostas Personalizadas
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                NathIA adapta respostas ao seu contexto
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.personalized_responses}
                onChange={(e) => 
                  chatHistoryService.updateMemoryPreferences(user!.id, { 
                    personalized_responses: e.target.checked 
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
            </label>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleExportHistory}
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              disabled={isExporting}
            >
              {isExporting ? 'Exportando...' : 'Exportar'}
            </Button>
            
            <Button
              onClick={handleClearHistory}
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              disabled={clearHistoryMutation.isPending}
            >
              {clearHistoryMutation.isPending ? 'Limpando...' : 'Limpar'}
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
            <p className="font-medium mb-1">ℹ️ Sobre a Memória:</p>
            <ul className="space-y-1">
              <li>• NathIA lembra das últimas 10 mensagens</li>
              <li>• Histórico é mantido por 30 dias</li>
              <li>• Dados são criptografados e seguros</li>
              <li>• Você pode desativar a qualquer momento</li>
            </ul>
          </div>
        </div>
      )}

      {/* Resumos Recentes */}
      {showDetails && context.recent_summaries.length > 0 && (
        <div className="mt-3 border-t border-pink-200 dark:border-pink-800 pt-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Tópicos Lembrados:
          </h4>
          <div className="flex flex-wrap gap-1">
            {context.recent_summaries.slice(0, 5).map((summary, index) => (
              <div key={index} className="flex flex-wrap gap-1">
                {summary.topics.slice(0, 3).map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// COMPONENTE COMPACTO PARA HEADER
// =====================================================

export const MemoryIndicatorCompact: React.FC = () => {
  const { user } = useAuth();
  
  const { data: context } = useQuery({
    queryKey: ['chat-context', user?.id],
    queryFn: () => chatHistoryService.getChatContext(user!.id),
    enabled: !!user
  });

  const { data: preferences } = useQuery({
    queryKey: ['memory-preferences', user?.id],
    queryFn: () => chatHistoryService.getMemoryPreferences(user!.id),
    enabled: !!user
  });

  if (!context || !preferences) return null;

  const hasMemory = context.recent_messages.length > 0;
  const isActive = preferences.memory_enabled && hasMemory;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
      isActive
        ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
    }`}>
      <Brain className="w-3 h-3" />
      <span>
        {isActive ? 'NathIA lembra de você 💜' : 'Memória desativada'}
      </span>
    </div>
  );
};
