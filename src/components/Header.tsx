import { Heart, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type HeaderProps = {
  onProfileClick: () => void;
};

export const Header = ({ onProfileClick }: HeaderProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-peanut-gray-800 shadow-peanut-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-peanut-coral p-2.5 rounded-2xl">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <h1 className="text-xl font-bold text-peanut-gray-800 dark:text-white tracking-tight">ClubNath</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-peanut-sand dark:hover:bg-peanut-gray-700 transition-colors"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-peanut-coral/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-peanut-coral flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-peanut-gray-700 dark:text-peanut-gray-200 hidden sm:inline">
                {profile?.full_name}
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl hover:bg-peanut-sand dark:hover:bg-peanut-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-peanut-gray-500" />
              )}
            </button>

            <button
              onClick={signOut}
              className="p-2.5 rounded-2xl hover:bg-peanut-sand dark:hover:bg-peanut-gray-700 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5 text-peanut-gray-500 dark:text-peanut-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
