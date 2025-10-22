import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Moon, Sun, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderMenuProps {
  onSettingsClick?: () => void;
}

export const HeaderMenu = ({ onSettingsClick }: HeaderMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { profile, signOut } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 touch-target"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu do usuário"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-pink-200/50 dark:ring-pink-500/30"
          />
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
        )}
        <span className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 hidden md:inline">
          {profile?.full_name || 'Perfil'}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neutral-600 dark:text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 py-2 animate-scale-in z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {profile?.full_name}
            </p>
            {profile?.bio && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
            role="menuitem"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            ) : (
              <Moon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            )}
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          </button>

          {/* Settings (Optional) */}
          {onSettingsClick && (
            <button
              onClick={() => {
                onSettingsClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
              role="menuitem"
            >
              <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Configurações
              </span>
            </button>
          )}

          {/* Divider */}
          <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors text-left"
            role="menuitem"
          >
            <LogOut className="w-5 h-5 text-error-600 dark:text-error-500" />
            <span className="text-sm font-medium text-error-600 dark:text-error-500">
              Sair
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
