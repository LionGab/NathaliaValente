import { Heart, LogOut, User, Bell, Crown, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { HeaderLogo } from './ui/Logo';

type HeaderProps = {
  onProfileClick: () => void;
};

export const Header = ({ onProfileClick }: HeaderProps) => {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-claude-gray-900/80 backdrop-blur-xl border-b border-claude-gray-200/50 dark:border-claude-gray-800/50 safe-area-inset shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <HeaderLogo className="hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                ClubNath
              </h1>
              <p className="text-xs text-claude-gray-500 dark:text-claude-gray-400 hidden sm:block">
                Comunidade VIP
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Premium Badge */}
            <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              <Crown className="w-3 h-3" />
              <span>VIP</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl hover:bg-claude-gray-100/60 dark:hover:bg-claude-gray-800/60 transition-all duration-200 touch-target">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-claude-gray-600 dark:text-claude-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </button>

            {/* Profile Button */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl hover:bg-claude-gray-100/60 dark:hover:bg-claude-gray-800/60 transition-all duration-200 touch-target"
            >
              {profile?.avatar_url ? (
                <div className="relative">
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-pink-200/50 dark:ring-pink-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-claude-gray-800 dark:text-claude-gray-200 hidden md:inline">
                {profile?.full_name || 'Perfil'}
              </span>
            </button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Logout Button */}
            <button
              onClick={signOut}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl hover:bg-claude-gray-100/60 dark:hover:bg-claude-gray-800/60 transition-all duration-200 touch-target"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-claude-gray-600 dark:text-claude-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
