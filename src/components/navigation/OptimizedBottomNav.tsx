/**
 * Nossa Maternidade - Navegação Inferior Otimizada
 * Reduz de 5 para 3 tabs principais + ações rápidas
 */

import { useState } from 'react';
import {
  Home,
  MessageCircle,
  User,
  Plus,
  Search,
  Bell,
  Heart,
  Users,
  Star,
  Menu,
  Sparkles,
} from 'lucide-react';

interface OptimizedBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onCreatePost: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  onQuickMenu?: () => void;
}

export const OptimizedBottomNav = ({
  currentTab,
  onTabChange,
  onCreatePost,
  onSearch,
  onNotifications,
}: OptimizedBottomNavProps) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  // 3 tabs principais (máximo recomendado para mobile)
  const mainTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Início',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      id: 'profile',
      icon: User,
      label: 'Perfil',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  // Ações rápidas no menu expandido
  const quickActions = [
    {
      icon: Sparkles,
      label: 'Bem-Estar',
      color: 'text-pink-600 dark:text-pink-400',
      onClick: () => onTabChange('wellness'),
    },
    {
      icon: Users,
      label: 'Grupos',
      color: 'text-blue-600 dark:text-blue-400',
      onClick: () => onTabChange('groups'),
    },
    {
      icon: Star,
      label: 'Favoritos',
      color: 'text-yellow-600 dark:text-yellow-400',
      onClick: () => onTabChange('favorites'),
    },
    {
      icon: Search,
      label: 'Buscar',
      color: 'text-gray-600 dark:text-gray-400',
      onClick: onSearch,
    },
    {
      icon: Bell,
      label: 'Notificações',
      color: 'text-gray-600 dark:text-gray-400',
      onClick: onNotifications,
      hasNotification: true,
    },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20">
        <div className="px-4 py-2">
          {/* Ações Rápidas - Sempre Visíveis */}
          <div className="flex items-center justify-between mb-2">
            {/* Busca */}
            <button
              onClick={onSearch}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notificações */}
            <button
              onClick={onNotifications}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400 relative"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
            </button>

            {/* Botão Criar Post - Central e Destacado */}
            <button
              onClick={onCreatePost}
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>

            {/* Menu Rápido */}
            <button
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Favoritos */}
            <button
              onClick={() => onTabChange('favorites')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Rápido Expandido */}
          {isQuickMenuOpen && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      onClick={() => {
                        action.onClick();
                        setIsQuickMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 ${action.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{action.label}</span>
                      {action.hasNotification && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full ml-auto"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabs Principais - Apenas 3 */}
          <div className="flex items-center justify-around">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                    isActive
                      ? `${tab.bgColor} ${tab.color}`
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <div className={`relative ${isActive ? 'animate-bounce' : ''}`}>
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-300`}
                    />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium truncate ${isActive ? 'font-semibold' : ''}`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20"></div>
    </>
  );
};
