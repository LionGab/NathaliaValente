import { Home, MessageCircle, User, Users, ShoppingBag } from 'lucide-react';

type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'feed', label: 'Início', icon: Home, badge: null },
    { id: 'chat', label: 'Nath IA', icon: MessageCircle, badge: 'AI' },
    { id: 'store', label: 'Loja', icon: ShoppingBag, badge: null },
    { id: 'groups', label: 'Grupos', icon: Users, badge: null },
    { id: 'profile', label: 'Perfil', icon: User, badge: null },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 z-50 transition-colors duration-300 safe-bottom shadow-large">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16 sm:h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 touch-target group ${isActive
                  ? 'text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500 to-secondary-500 rounded-2xl shadow-medium animate-scale-in" />
                )}

                <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? '' : 'group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30'
                  }`}>
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                      }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                      {item.badge}
                    </div>
                  )}
                </div>

                <span
                  className={`relative text-[10px] sm:text-xs font-medium transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:font-semibold'
                    }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};