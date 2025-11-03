/**
 * Nossa Maternidade - Modern Bottom Navigation
 * Navegação inferior moderna e responsiva
 */

import { useState } from 'react';
import {
  Home,
  MessageCircle,
  Users,
  Heart,
  User,
  Plus,
  Search,
  Bell,
  BookHeart,
  Star,
} from 'lucide-react';

interface ModernBottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onCreatePost: () => void;
  onSearch: () => void;
  onNotifications: () => void;
}

export const ModernBottomNavigation = ({
  currentTab,
  onTabChange,
  onCreatePost,
  onSearch,
  onNotifications,
}: ModernBottomNavigationProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const tabs = [
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
      id: 'groups',
      icon: Users,
      label: 'Grupos',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'favorites',
      icon: Star,
      label: 'Favoritos',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      id: 'profile',
      icon: User,
      label: 'Perfil',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  const quickActions = [
    {
      icon: Search,
      label: 'Buscar',
      onClick: onSearch,
      color: 'text-gray-600 dark:text-gray-400',
    },
    {
      icon: Bell,
      label: 'Notificações',
      onClick: onNotifications,
      color: 'text-gray-600 dark:text-gray-400',
      hasNotification: true,
    },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20">
        <div className="px-4 py-2">
          {/* Quick Actions Row */}
          <div className="flex items-center justify-between mb-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative ${action.color}`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {action.hasNotification && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></div>
                  )}
                </button>
              );
            })}

            {/* Create Post Button */}
            <button
              onClick={onCreatePost}
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
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
