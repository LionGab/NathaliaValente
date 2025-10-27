/**
 * Nossa Maternidade - Modern Search Screen
 * Tela de busca moderna e intuitiva
 */

import { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Clock, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Heart,
  Star,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface ModernSearchScreenProps {
  onClose: () => void;
  onResultSelect: (result: any) => void;
}

export const ModernSearchScreen = ({ onClose, onResultSelect }: ModernSearchScreenProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'amamentação',
    'sono do bebê',
    'dicas de organização',
    'versículo do dia',
    'roupas de maternidade'
  ]);
  const [trendingTopics, setTrendingTopics] = useState([
    { id: 1, title: 'Primeira gravidez', count: 234, category: 'Gravidez' },
    { id: 2, title: 'Amamentação', count: 189, category: 'Bebê' },
    { id: 3, title: 'Organização', count: 156, category: 'Lifestyle' },
    { id: 4, title: 'Fé e maternidade', count: 143, category: 'Espiritualidade' },
    { id: 5, title: 'Exercícios pós-parto', count: 98, category: 'Saúde' }
  ]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Simular busca
  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        // Simular resultados de busca
        const mockResults = [
          {
            id: 1,
            type: 'post',
            title: 'Dicas de amamentação para mães de primeira viagem',
            author: 'Maria Silva',
            avatar: '👩‍👧',
            content: 'Compartilhando minha experiência com amamentação...',
            likes: 24,
            comments: 8,
            time: '2h'
          },
          {
            id: 2,
            type: 'group',
            title: 'Grupo: Amamentação & Apoio',
            members: 156,
            description: 'Comunidade para trocar experiências sobre amamentação',
            category: 'Amamentação'
          },
          {
            id: 3,
            type: 'user',
            name: 'Ana Costa',
            avatar: '👩‍👦',
            bio: 'Mãe de 2 filhos, compartilhando dicas de organização',
            followers: 89
          }
        ];
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post':
        return MessageCircle;
      case 'group':
        return Users;
      case 'user':
        return Heart;
      default:
        return Search;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar posts, grupos, pessoas..."
              className="w-full pl-12 pr-10 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl border-0 focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!query ? (
          /* Empty State - Show suggestions */
          <div className="p-6 space-y-8">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Buscas recentes
                </h3>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {search}
                    </span>
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-pink-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Tópicos em alta
                </h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSearch(topic.title)}
                    className="w-full p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                        {topic.title}
                      </h4>
                      <span className="text-xs px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full">
                        {topic.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      {topic.count} discussões
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Buscando...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Resultados para "{query}"
                  </h3>
                </div>
                
                {searchResults.map((result) => {
                  const Icon = getResultIcon(result.type);
                  return (
                    <button
                      key={result.id}
                      onClick={() => onResultSelect(result)}
                      className="w-full p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400">
                            {result.title || result.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {result.content || result.description || result.bio}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            {result.likes && (
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {result.likes}
                              </span>
                            )}
                            {result.comments && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {result.comments}
                              </span>
                            )}
                            {result.members && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {result.members} membros
                              </span>
                            )}
                            {result.time && (
                              <span>{result.time}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Tente uma busca diferente ou explore os tópicos em alta
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
