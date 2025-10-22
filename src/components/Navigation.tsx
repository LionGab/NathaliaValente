import { Home, MessageCircle, Search, Sparkles, User, Users, Heart } from 'lucide-react';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home, badge: null },
    { id: 'groups', label: 'Grupos', icon: Users, badge: null },
    { id: 'chat', label: 'Nath', icon: MessageCircle, badge: 'AI' },
    { id: 'search', label: 'Buscar', icon: Search, badge: null },
    { id: 'daily', label: 'Frase', icon: Sparkles, badge: null },
    { id: 'profile', label: 'Perfil', icon: User, badge: null },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass backdrop-blur-xl border-t border-claude-gray-200/50 dark:border-claude-gray-800/50 z-50 transition-colors duration-300 safe-bottom">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex justify-around items-center h-16 sm:h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 px-2 sm:px-5 py-2 rounded-xl sm:rounded-2xl transition-all duration-300 touch-target ${
                  isActive
                    ? 'text-pink-600 dark:text-pink-400'
                    : 'text-claude-gray-500 dark:text-claude-gray-400 hover:text-claude-gray-700 dark:hover:text-claude-gray-300'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-50 to-purple-50 dark:from-pink-500/10 dark:to-purple-500/10 rounded-xl sm:rounded-2xl animate-scale-in" />
                )}
                <div className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-pink-100 dark:bg-pink-500/20' : ''
                }`}>
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'scale-110' : ''} transition-transform duration-300`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                      {item.badge}
                    </div>
                  )}
                </div>
                <span
                  className={`relative text-xs sm:text-xs ${isActive ? 'font-semibold' : 'font-medium'} transition-all duration-300 ${
                    isActive ? 'text-pink-600 dark:text-pink-400' : ''
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
