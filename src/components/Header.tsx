import { Heart, LogOut, User, Bell, Crown, Sparkles, Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { HeaderLogo } from './ui/Logo';

type HeaderProps = {
  onProfileClick: () => void;
};

export const Header = ({ onProfileClick }: HeaderProps) => {
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search results (replace with real search logic)
  const mockSearchResults = [
    { id: 1, type: 'post', title: 'Dica de maternidade', author: 'Maria Silva' },
    { id: 2, type: 'user', title: 'Ana Costa', subtitle: 'Mãe de 2 filhos' },
    { id: 3, type: 'group', title: 'Mães de primeira viagem', subtitle: '1.2k membros' },
  ];

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Filter mock results based on query
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 safe-area-inset shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/logos/clubnath-logo.png"
                alt="ClubNath VIP"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-medium group-hover:shadow-glow transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-[10px] font-bold">VIP</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold gradient-text tracking-tight">
                Nossa Maternidade
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block font-medium">
                Comunidade de Mães
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4" ref={searchRef}>
            <div className="relative">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 text-left"
                >
                  <Search className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Buscar posts, pessoas, grupos...</span>
                </button>
              ) : (
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 z-10" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute right-3 p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-large border border-neutral-200 dark:border-neutral-800 max-h-80 overflow-y-auto z-50">
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          className="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                              {result.type === 'post' && <Search className="w-4 h-4 text-primary-600" />}
                              {result.type === 'user' && <User className="w-4 h-4 text-primary-600" />}
                              {result.type === 'group' && <Heart className="w-4 h-4 text-primary-600" />}
                            </div>
                            <div>
                              <div className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                                {result.title}
                              </div>
                              {result.subtitle && (
                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                  {result.subtitle}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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