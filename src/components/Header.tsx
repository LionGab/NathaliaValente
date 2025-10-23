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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 safe-area-inset shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-[10px] font-bold">VIP</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold gradient-text tracking-tight">
                ClubNath
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block font-medium">
                Comunidade Exclusiva
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 touch-target group">
              <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-[10px] font-bold">3</span>
              </div>
            </button>

            {/* Profile Button */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 touch-target group"
            >
              {profile?.avatar_url ? (
                <div className="relative">
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-primary-200 dark:ring-primary-800 group-hover:ring-primary-400 dark:group-hover:ring-primary-600 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-neutral-900 shadow-lg"></div>
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 hidden md:inline">
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
              className="p-2.5 rounded-xl hover:bg-error-50 dark:hover:bg-error-950/30 transition-all duration-200 touch-target group"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5 text-error-600 dark:text-error-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};