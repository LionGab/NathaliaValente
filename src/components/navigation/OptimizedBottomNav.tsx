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
} from 'lucide-react';

interface OptimizedBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onCreatePost: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  onQuickMenu: () => void;
}

export const OptimizedBottomNav = ({
  currentTab,
  onTabChange,
  onCreatePost,
  onSearch,
  onNotifications,
  onQuickMenu,
}: OptimizedBottomNavProps) => {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  // 5 tabs principais organizadas com design maternal
  const mainTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'Início',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      maternalColor: 'maternal-icon',
    },
    {
      id: 'feed',
      icon: Users,
      label: 'Comunidade',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'NathIA',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      id: 'store',
      icon: Star,
      label: 'Loja',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
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
    {
      icon: Heart,
      label: 'Ferramentas',
      color: 'text-purple-600 dark:text-purple-400',
      onClick: () => onTabChange('tools'),
    },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-white/20 dark:border-gray-700/20 pb-safe">
        <div className="px-4 py-2">
          {/* Ações Rápidas - Sempre Visíveis */}
          <div className="flex items-center justify-between mb-2">
            {/* Busca */}
            <button
              onClick={onSearch}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400"
              aria-label="Buscar conteúdo"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Notificações */}
            <button
              onClick={onNotifications}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400 relative touch-target"
              aria-label="Ver notificações"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <div
                className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"
                aria-hidden="true"
              ></div>
            </button>

            {/* Botão Criar Post - Central e Destacado com Design Maternal */}
            <button
              onClick={onCreatePost}
              className="w-14 h-14 maternal-button rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center touch-target maternal-float"
              aria-label="Criar nova publicação"
            >
              <Plus className="w-7 h-7" aria-hidden="true" />
            </button>

            {/* Menu Rápido */}
            <button
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400 touch-target"
              aria-label={isQuickMenuOpen ? 'Fechar menu rápido' : 'Abrir menu rápido'}
              aria-expanded={isQuickMenuOpen}
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Favoritos */}
            <button
              onClick={() => onTabChange('favorites')}
              className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-400 touch-target"
              aria-label="Ver favoritos"
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Menu Rápido Expandido */}
          {isQuickMenuOpen && (
            <div
              className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
              role="menu"
              aria-label="Menu de ações rápidas"
            >
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
                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 ${action.color} touch-target`}
                      role="menuitem"
                      aria-label={action.label}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">{action.label}</span>
                      {action.hasNotification && (
                        <div
                          className="w-2 h-2 bg-pink-500 rounded-full ml-auto"
                          aria-hidden="true"
                        ></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabs Principais - Apenas 3 */}
          <div
            className="flex items-center justify-around"
            role="tablist"
            aria-label="Navegação principal"
          >
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 min-w-0 flex-1 touch-target ${
                    isActive
                      ? `${tab.bgColor} ${tab.color} maternal-shadow`
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${tab.label}${isActive ? ' - página atual' : ''}`}
                >
                  <div className={`relative ${isActive ? 'animate-bounce' : ''}`}>
                    <Icon
                      className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform duration-300`}
                      aria-hidden="true"
                    />
                    {isActive && (
                      <div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full animate-pulse"
                        aria-hidden="true"
                      ></div>
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

      {/* Bottom Spacer - Mobile Safe Area */}
      <div className="h-24 mobile-bottom-nav"></div>
    </>
  );
};
