/**
 * Nossa Maternidade - Navegação Contextual Inteligente
 * Sugere ações baseadas no comportamento do usuário
 */

import { useState, useEffect } from 'react';
import {
  Home,
  MessageCircle,
  User,
  Plus,
  Heart,
  Users,
  Star,
  Clock,
  TrendingUp,
  Bell,
  Search,
  BookOpen,
  ShoppingBag,
} from 'lucide-react';

interface ContextualNavigationProps {
  currentTab: string;
  userBehavior: {
    mostVisited: string[];
    recentActivity: string[];
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    isNewUser: boolean;
  };
  onNavigate: (tab: string) => void;
  onQuickAction: (action: string) => void;
}

export const ContextualNavigation = ({
  currentTab,
  userBehavior,
  onNavigate,
  onQuickAction,
}: ContextualNavigationProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Gera sugestões baseadas no contexto
  useEffect(() => {
    const generateSuggestions = () => {
      const suggestions = [];

      // Baseado no horário do dia
      if (userBehavior.timeOfDay === 'morning') {
        suggestions.push({
          icon: BookOpen,
          label: 'Devocional Matinal',
          description: 'Comece o dia com fé',
          color: 'bg-yellow-500',
          action: 'devotional',
        });
      }

      if (userBehavior.timeOfDay === 'evening') {
        suggestions.push({
          icon: Heart,
          label: 'Reflexão do Dia',
          description: 'Compartilhe suas conquistas',
          color: 'bg-pink-500',
          action: 'reflection',
        });
      }

      // Baseado na atividade recente
      if (userBehavior.recentActivity.includes('chat')) {
        suggestions.push({
          icon: MessageCircle,
          label: 'Continuar Conversa',
          description: 'Retome onde parou',
          color: 'bg-purple-500',
          action: 'continue_chat',
        });
      }

      // Baseado nos grupos mais visitados
      if (userBehavior.mostVisited.includes('groups')) {
        suggestions.push({
          icon: Users,
          label: 'Seus Grupos',
          description: 'Veja as últimas atualizações',
          color: 'bg-blue-500',
          action: 'my_groups',
        });
      }

      // Para novos usuários
      if (userBehavior.isNewUser) {
        suggestions.push({
          icon: Star,
          label: 'Tour do App',
          description: 'Conheça as funcionalidades',
          color: 'bg-indigo-500',
          action: 'app_tour',
        });
      }

      // Ações sempre relevantes
      suggestions.push(
        {
          icon: Plus,
          label: 'Criar Post',
          description: 'Compartilhe algo especial',
          color: 'bg-green-500',
          action: 'create_post',
        },
        {
          icon: Search,
          label: 'Buscar',
          description: 'Encontre o que precisa',
          color: 'bg-gray-500',
          action: 'search',
        }
      );

      return suggestions.slice(0, 4); // Máximo 4 sugestões
    };

    setSuggestions(generateSuggestions());
  }, [userBehavior]);

  // Mostra sugestões quando o usuário fica inativo
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowSuggestions(true);
      }, 30000); // 30 segundos de inatividade
    };

    // Reset timeout em qualquer interação
    const events = ['click', 'scroll', 'touchstart', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout, { passive: true });
    });

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, []);

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.action === 'create_post') {
      onQuickAction('create_post');
    } else if (suggestion.action === 'search') {
      onQuickAction('search');
    } else {
      onNavigate(suggestion.action);
    }
    setShowSuggestions(false);
  };

  if (!showSuggestions || suggestions.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sugestões para você</h3>
          </div>
          <button
            onClick={() => setShowSuggestions(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-left group"
              >
                <div
                  className={`w-10 h-10 ${suggestion.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                    {suggestion.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Baseado no seu comportamento</span>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              Não mostrar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
