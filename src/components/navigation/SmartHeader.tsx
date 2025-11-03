/**
 * Nossa Maternidade - Header Inteligente
 * Integra ações rápidas e navegação
 */

import { useState } from 'react';
import { User, Plus, Heart, Users, Star } from 'lucide-react';

interface SmartHeaderProps {
  onProfileClick: () => void;
  onCreatePost: () => void;
  onQuickAction: (action: string) => void;
}

export const SmartHeader = ({ onProfileClick, onCreatePost, onQuickAction }: SmartHeaderProps) => {
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Ações rápidas contextuais
  const quickActions = [
    {
      icon: Plus,
      label: 'Criar Post',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: onCreatePost,
    },
    {
      icon: Heart,
      label: 'Favoritos',
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => onQuickAction('favorites'),
    },
    {
      icon: Users,
      label: 'Grupos',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => onQuickAction('groups'),
    },
    {
      icon: Star,
      label: 'Destaques',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => onQuickAction('highlights'),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <img
                src="/logos/clubnath-logo-final.jpg"
                alt="Nossa Maternidade"
                className="w-10 h-10 rounded-xl object-cover shadow-md"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">VIP</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Nossa Maternidade
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Actions Toggle */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Profile */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        {showQuickActions && (
          <div className="pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 ${action.color} flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
