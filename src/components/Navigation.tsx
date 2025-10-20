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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-peanut-gray-800 shadow-peanut z-50 transition-colors duration-300 safe-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-peanut-coral'
                    : 'text-peanut-gray-400 dark:text-peanut-gray-500 hover:text-peanut-gray-600 dark:hover:text-peanut-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-peanut-coral/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
