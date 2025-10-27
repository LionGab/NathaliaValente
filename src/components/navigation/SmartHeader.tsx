/**
 * Nossa Maternidade - Header Inteligente
 * Integra busca, notificações e ações rápidas
 */

import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Plus, 
  Heart, 
  Users, 
  Star,
  X,
  Filter,
  SortAsc,
  Settings
} from 'lucide-react';

interface SmartHeaderProps {
  onProfileClick: () => void;
  onCreatePost: () => void;
  onSearch: (query: string) => void;
  onNotifications: () => void;
  onQuickAction: (action: string) => void;
}

export const SmartHeader = ({ 
  onProfileClick, 
  onCreatePost, 
  onSearch, 
  onNotifications, 
  onQuickAction 
}: SmartHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ações rápidas contextuais
  const quickActions = [
    {
      icon: Plus,
      label: 'Criar Post',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: onCreatePost
    },
    {
      icon: Heart,
      label: 'Favoritos',
      color: 'bg-red-500 hover:bg-red-600',
      onClick: () => onQuickAction('favorites')
    },
    {
      icon: Users,
      label: 'Grupos',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => onQuickAction('groups')
    },
    {
      icon: Star,
      label: 'Destaques',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => onQuickAction('highlights')
    }
  ];

  // Mock search results
  const mockSearchResults = [
    { id: 1, type: 'post', title: 'Dica de amamentação', author: 'Maria Silva', category: 'Amamentação' },
    { id: 2, type: 'user', title: 'Ana Costa', subtitle: 'Mãe de 2 filhos', avatar: '👩‍👧‍👦' },
    { id: 3, type: 'group', title: 'Mães de primeira viagem', subtitle: '1.2k membros', category: 'Primeira Viagem' },
    { id: 4, type: 'post', title: 'Roupa de bebê', author: 'Carla Santos', category: 'Moda' },
  ];

  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase())
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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <img
                src="/logos/clubnath-logo-final.jpg"
                alt="Nossa Maternidade"
                className="w-10 h-10 rounded-xl object-cover shadow-md"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">VIP</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Nossa Maternidade
              </h1>
            </div>
          </div>

          {/* Search Bar - Sempre Visível */}
          <div className="flex-1 max-w-md" ref={searchRef}>
            <div className="relative">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 z-10" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Buscar posts, pessoas, grupos..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-3 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => {
                        onSearch(result.title);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                          {result.type === 'post' && <Search className="w-4 h-4 text-pink-600" />}
                          {result.type === 'user' && <User className="w-4 h-4 text-pink-600" />}
                          {result.type === 'group' && <Users className="w-4 h-4 text-pink-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {result.title}
                          </div>
                          {result.subtitle && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {result.subtitle}
                            </div>
                          )}
                          {result.category && (
                            <div className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                              {result.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              onClick={onNotifications}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">3</span>
              </div>
            </button>

            {/* Quick Actions Toggle */}
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Profile */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        {showQuickActions && (
          <div className="pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 ${action.color} flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
