import { useState, useMemo } from 'react';
import { usePosts } from '../hooks';
import { ALL_CATEGORIES, getCategoryColor } from '../constants';
import { Search, Filter } from 'lucide-react';

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Use optimized hook for category filtering
  const { posts: allPosts, loading } = usePosts({
    category: selectedCategory,
  });

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
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por palavras-chave..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por categoria:
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {ALL_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            >
              {post.image_url && (
                <img src={post.image_url} alt="Post" className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {post.avatar_url ? (
                    <img
                      src={post.avatar_url}
                      alt={post.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {post.full_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {post.full_name}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-3">
                  {post.caption}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
                    post.category
                  )}`}
                >
                  {post.category}
                </span>
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
