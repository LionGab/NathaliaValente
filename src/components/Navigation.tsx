import { memo, useMemo } from 'react';
import { Home, MessageCircle, Search, Sparkles, User } from 'lucide-react';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

const navItems = [
  { id: 'feed', label: 'Feed', icon: Home },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'search', label: 'Buscar', icon: Search },
  { id: 'daily', label: 'Frase', icon: Sparkles },
  { id: 'profile', label: 'Perfil', icon: User },
] as const;

export const Navigation = memo(({ currentPage, onNavigate }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass backdrop-blur-xl border-t border-claude-gray-200/50 dark:border-claude-gray-800/50 z-50 transition-colors duration-300 safe-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1.5 px-5 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'text-claude-orange-600 dark:text-claude-orange-500'
                    : 'text-claude-gray-500 dark:text-claude-gray-400 hover:text-claude-gray-700 dark:hover:text-claude-gray-300'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-claude-orange-50 dark:bg-claude-orange-500/10 rounded-2xl animate-scale-in" />
                )}
                <Icon
                  className={`relative w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform duration-300`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`relative text-xs ${isActive ? 'font-semibold' : 'font-medium'} transition-all duration-300`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});
