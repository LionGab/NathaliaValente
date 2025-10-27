import { useState, useEffect } from 'react';
import { Search, Heart, MessageCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Post } from '../lib/supabase';

interface AdvancedSearchProps {
  onClose: () => void;
  onResultSelect: (post: Post) => void;
}

interface SearchFilters {
  category: string;
  dateRange: string;
  author: string;
  hasImage: boolean | null;
  minLikes: number;
  minComments: number;
}

export const AdvancedSearch = ({ onClose, onResultSelect }: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    dateRange: '',
    author: '',
    hasImage: null,
    minLikes: 0,
    minComments: 0,
  });
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'];
  const dateRanges = [
    { value: '', label: 'Qualquer data' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mês' },
    { value: 'year', label: 'Este ano' },
  ];

  const performSearch = async () => {
    if (!query.trim() && !hasActiveFilters()) return;

    setIsLoading(true);
    try {
      let queryBuilder = supabase.from('posts').select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url
          )
        `);

      // Filtro de texto
      if (query.trim()) {
        queryBuilder = queryBuilder.textSearch('caption', query.trim());
      }

      // Filtro de categoria
      if (filters.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      // Filtro de data
      if (filters.dateRange) {
        const now = new Date();
        let startDate: Date;

        switch (filters.dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }

        queryBuilder = queryBuilder.gte('created_at', startDate.toISOString());
      }

      // Filtro de autor
      if (filters.author) {
        queryBuilder = queryBuilder.ilike('profiles.full_name', `%${filters.author}%`);
      }

      // Filtro de imagem
      if (filters.hasImage !== null) {
        if (filters.hasImage) {
          queryBuilder = queryBuilder.not('image_url', 'is', null);
        } else {
          queryBuilder = queryBuilder.is('image_url', null);
        }
      }

      // Filtro de likes mínimos
      if (filters.minLikes > 0) {
        queryBuilder = queryBuilder.gte('likes_count', filters.minLikes);
      }

      // Filtro de comentários mínimos
      if (filters.minComments > 0) {
        queryBuilder = queryBuilder.gte('comments_count', filters.minComments);
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erro na busca:', error);
        return;
      }

      setResults(data || []);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveFilters = () => {
    return (
      filters.category ||
      filters.dateRange ||
      filters.author ||
      filters.hasImage !== null ||
      filters.minLikes > 0 ||
      filters.minComments > 0
    );
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      dateRange: '',
      author: '',
      hasImage: null,
      minLikes: 0,
      minComments: 0,
    });
  };

  const clearAll = () => {
    setQuery('');
    clearFilters();
    setResults([]);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim() || hasActiveFilters()) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Busca Avançada</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar de Filtros */}
          <div className="w-80 border-r bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Busca por texto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por texto
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Digite sua busca..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-pink-600 hover:text-pink-700"
                  >
                    Limpar
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Todas as categorias</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      {dateRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Autor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                    <input
                      type="text"
                      value={filters.author}
                      onChange={(e) => setFilters((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="Nome do autor..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Com imagem */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de post
                    </label>
                    <select
                      value={filters.hasImage === null ? '' : filters.hasImage.toString()}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFilters((prev) => ({
                          ...prev,
                          hasImage: value === '' ? null : value === 'true',
                        }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Todos</option>
                      <option value="true">Com imagem</option>
                      <option value="false">Apenas texto</option>
                    </select>
                  </div>

                  {/* Likes mínimos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Likes mínimos
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={filters.minLikes}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, minLikes: parseInt(e.target.value) || 0 }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Comentários mínimos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comentários mínimos
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={filters.minComments}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minComments: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resultados ({results.length})</h3>
              {(query || hasActiveFilters()) && (
                <button onClick={clearAll} className="text-sm text-gray-500 hover:text-gray-700">
                  Limpar tudo
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {query || hasActiveFilters()
                    ? 'Nenhum resultado encontrado'
                    : 'Digite algo para buscar ou use os filtros'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onResultSelect(post)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.profiles?.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {post.profiles?.full_name || 'Usuário'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2 line-clamp-2">{post.caption}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments_count || 0}
                          </span>
                          <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
