import { useState, useEffect } from 'react';
import { supabase, Post } from '../lib/supabase';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = ['Todos', 'Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'];

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select(
        `
        *,
        profiles(*)
      `
      )
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'Todos') {
      query = query.eq('category', selectedCategory);
    }

    if (searchTerm) {
      query = query.ilike('caption', `%${searchTerm}%`);
    }

    const { data } = await query;

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchPosts();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPosts();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Look do dia': 'from-pink-400 to-rose-400',
      Desabafo: 'from-purple-400 to-indigo-400',
      Fé: 'from-blue-400 to-cyan-400',
      'Dica de mãe': 'from-green-400 to-emerald-400',
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-500';
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
          {CATEGORIES.map((category) => (
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
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {post.profiles?.full_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {post.profiles?.full_name}
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
