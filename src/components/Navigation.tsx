import { Home, MessageCircle, Search, Sparkles, User } from 'lucide-react';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'daily', label: 'Frase', icon: Sparkles },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300 safe-bottom">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-pink-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-pink-500/20' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
