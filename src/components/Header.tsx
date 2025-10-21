import { Heart, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

type HeaderProps = {
  onProfileClick: () => void;
};

export const Header = ({ onProfileClick }: HeaderProps) => {
  const { profile, signOut } = useAuth();

  return (
    <header className="glass sticky top-0 z-50 backdrop-blur-xl border-b border-claude-gray-200/50 dark:border-claude-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-claude-orange-500 to-claude-orange-600 p-2.5 rounded-2xl shadow-claude-sm">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-claude-gray-900 dark:text-white tracking-tight">
              ClubNath
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onProfileClick}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-claude-gray-100/60 dark:hover:bg-claude-gray-800/60 transition-all duration-200"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-claude-orange-200/50 dark:ring-claude-orange-500/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-claude-orange-500 to-claude-orange-600 flex items-center justify-center shadow-claude-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-claude-gray-800 dark:text-claude-gray-200 hidden sm:inline">
                {profile?.full_name}
              </span>
            </button>

            <ThemeToggle />

            <button
              onClick={signOut}
              className="p-2.5 rounded-2xl hover:bg-claude-gray-100/60 dark:hover:bg-claude-gray-800/60 transition-all duration-200"
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5 text-claude-gray-600 dark:text-claude-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
