import { useState, useMemo } from 'react';
import { usePosts } from '../hooks';
import { ALL_CATEGORIES, getCategoryColor } from '../constants';
import { Search, Filter, X, TrendingUp, Clock, Star, Users, Hash } from 'lucide-react';
import { useMockData } from '../hooks/useMockData';

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Use mock data for better experience
  const { posts: mockPosts, loading: mockLoading } = useMockData();
  
  // Fallback to real data if needed
  const { posts: realPosts, loading: realLoading } = usePosts({
    category: selectedCategory,
  });
  
  // Use mock data if available, otherwise real data
  const allPosts = mockPosts.length > 0 ? mockPosts : realPosts;
  const loading = mockLoading || realLoading;

  // Filter posts by search term locally (client-side)
  const posts = useMemo(() => {
    if (!searchTerm.trim()) return allPosts;

    return allPosts.filter((post) =>
      post.caption.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPosts, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically by useMemo
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24">
      {/* Search Header Mobile-First */}
      <div className="mb-4 sm:mb-6">
        <form onSubmit={handleSearch} className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por palavras-chave..."
              className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-16 sm:right-20 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 sm:px-6 py-2 rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Filter Section Mobile-First */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por categoria:
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {ALL_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all touch-target ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Quick Search Suggestions */}
        {!searchTerm && (
          <div className="mt-4 sm:mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Sugestões de busca:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {['Educação Financeira', 'Investimentos', 'Empreendedorismo', 'Motivação'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchTerm(suggestion)}
                  className="p-2 sm:p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-pink-200 dark:border-pink-700 rounded-lg hover:shadow-md transition-all text-xs sm:text-sm text-gray-700 dark:text-gray-300 touch-target"
                >
                  <Hash className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-pink-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              {post.image_url && (
                <div className="relative">
                  <img src={post.image_url} alt="Post" className="w-full h-40 sm:h-48 object-cover" />
                  {post.has_badge && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-1.5 rounded-full shadow-lg">
                      <Star className="w-3 h-3" />
                    </div>
                  )}
                </div>
              )}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  {post.avatar_url ? (
                    <img
                      src={post.avatar_url}
                      alt={post.full_name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-pink-100 dark:ring-pink-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                      {post.full_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">
                    {post.full_name}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-3 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
                      post.category
                    )}`}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">{post.likes_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Nenhuma publicação encontrada</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
