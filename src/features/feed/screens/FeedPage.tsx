import { useState, Suspense, lazy, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { usePosts, useLikePost, useSaveItem } from '../../../hooks/useQueries';
import { useWebShare } from '../../../hooks';
import { getCategoryGradient } from '../../../constants/colors';
import { Heart, MessageCircle, Award, Plus, Bookmark, Share2, Filter, Users, Star, HelpCircle, Calendar, TrendingUp, Shield, Baby, Lightbulb, Coffee, Clock, Target, CheckCircle, AlertCircle, ThumbsUp, MessageSquare, Share, Flag, MoreHorizontal, Search, Bell, Zap, Crown, Sparkles, UserPlus, MessageSquarePlus, Eye, EyeOff, Lock, Unlock, ChevronDown, ChevronUp, Flame, TrendingUp as TrendingUpIcon, BookOpen, Users2, HeartHandshake, Brain, Stethoscope, DollarSign, Rocket, Baby2, MessageSquareText, Trophy, Search as SearchIcon, Filter as FilterIcon, SortAsc, SortDesc } from 'lucide-react';
import { PostComments } from '../../../components/PostComments';
import { LoadingSpinner, PostSkeleton } from '../../../components/ui/LoadingSpinner';
import { useMockData } from '../../../hooks/useMockData';
import { Button } from '../../../components/ui/Button';
import { useInfiniteScroll, useHapticFeedback } from '../../../hooks/useGestures';
import { formatNumber, formatDate } from '../../../lib/utils';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';
import type { Post } from '../../../lib/supabase';

// Lazy load the CreatePostModal since it's only shown when needed
const CreatePostModal = lazy(() =>
  import('../../../components/CreatePostModal').then((module) => ({ default: module.CreatePostModal }))
);

export const FeedPage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showSupportResources, setShowSupportResources] = useState(false);
  const { user } = useAuth();
  const { triggerHaptic } = useHapticFeedback();

  // Estados para funcionalidades de comunidade
  const [userStats, setUserStats] = useState({
    postsCount: 12,
    likesReceived: 156,
    commentsCount: 89,
    level: 5,
    nextLevelProgress: 75,
    badges: ['Primeira Postagem', 'Apoiadora', 'Especialista em Amamentação']
  });

  // Dados de grupos temáticos
  const communityGroups = [
    {
      id: 'gestantes-primeiro-trimestre',
      name: 'Primeiro Trimestre',
      description: 'Compartilhe experiências dos primeiros 3 meses',
      memberCount: 1247,
      icon: '🤰',
      color: 'from-pink-500 to-rose-500',
      isPrivate: false
    },
    {
      id: 'amamentacao-suporte',
      name: 'Amamentação & Suporte',
      description: 'Dicas, desafios e conquistas da amamentação',
      memberCount: 2156,
      icon: '🍼',
      color: 'from-blue-500 to-cyan-500',
      isPrivate: false
    },
    {
      id: 'maes-empresarias',
      name: 'Mães Empreendedoras',
      description: 'Empreendedorismo e maternidade',
      memberCount: 892,
      icon: '💼',
      color: 'from-purple-500 to-violet-500',
      isPrivate: true
    },
    {
      id: 'desabafos-seguros',
      name: 'Desabafos Seguros',
      description: 'Um espaço seguro para compartilhar',
      memberCount: 3456,
      icon: '💭',
      color: 'from-indigo-500 to-blue-500',
      isPrivate: true
    }
  ];

  // Recursos de apoio emocional
  const supportResources = [
    {
      id: 'crisis-hotline',
      title: 'Linha de Apoio 24h',
      description: 'Fale com especialistas em saúde mental',
      phone: '188',
      icon: HeartHandshake,
      color: 'from-red-500 to-pink-500',
      urgent: true
    },
    {
      id: 'mental-health',
      title: 'Saúde Mental',
      description: 'Recursos para bem-estar emocional',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      urgent: false
    },
    {
      id: 'medical-support',
      title: 'Suporte Médico',
      description: 'Orientações de saúde durante a gestação',
      icon: Stethoscope,
      color: 'from-green-500 to-emerald-500',
      urgent: false
    }
  ];

  // Use mock data for better experience
  const { posts: mockPosts, loading: mockLoading, likePost } = useMockData();

  // Fallback to real data if needed
  const { data: realPosts = [], isLoading: realLoading, refetch } = usePosts(page);
  const likePostMutation = useLikePost();
  const saveItemMutation = useSaveItem();
  const { share, isSupported: isShareSupported } = useWebShare();

  // Use mock data if available, otherwise real data
  const allPosts = mockPosts.length > 0 ? mockPosts : realPosts;

  // Filter posts by category if selected
  const posts = selectedCategory
    ? allPosts.filter(post => post.category === selectedCategory)
    : allPosts;

  const loading = mockLoading || realLoading;
  const hasMore = posts.length > 0 && posts.length % 20 === 0;

  // Categories for filtering - Focadas em ajudar realmente as mães
  const categories = [
    { id: 'all', name: 'Todos', icon: '📱', color: 'from-gray-500 to-gray-600', count: 0 },
    { id: 'Apoio Emocional', name: 'Apoio Emocional', icon: '🤗', color: 'from-pink-500 to-rose-500', count: 45 },
    { id: 'Dicas Práticas', name: 'Dicas Práticas', icon: '💡', color: 'from-yellow-500 to-orange-500', count: 78 },
    { id: 'Saúde & Bem-estar', name: 'Saúde & Bem-estar', icon: '🏥', color: 'from-green-500 to-emerald-500', count: 92 },
    { id: 'Educação Financeira', name: 'Educação Financeira', icon: '💰', color: 'from-blue-500 to-cyan-500', count: 34 },
    { id: 'Empreendedorismo', name: 'Empreendedorismo', icon: '🚀', color: 'from-purple-500 to-violet-500', count: 56 },
    { id: 'Maternidade', name: 'Maternidade', icon: '👶', color: 'from-pink-400 to-purple-400', count: 123 },
    { id: 'Desabafo', name: 'Desabafo', icon: '💭', color: 'from-indigo-500 to-blue-500', count: 67 },
    { id: 'Conquistas', name: 'Conquistas', icon: '🏆', color: 'from-yellow-400 to-orange-400', count: 89 }
  ];

  // Função para filtrar posts por busca e categoria
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Função para ordenar posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes_count || 0) - (a.likes_count || 0);
      case 'trending':
        return (b.comments_count || 0) - (a.comments_count || 0);
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  const lastPostRef = useInfiniteScroll(loadMore, hasMore);

  const handleLike = useCallback(
    async (postId: string, currentlyLiked: boolean) => {
      if (!user) return;

      triggerHaptic('light');

      // Use mock data if available
      if (mockPosts.length > 0) {
        likePost(postId);
      } else {
        // Fallback to real data
        likePostMutation.mutate(
          { postId, isLiked: currentlyLiked },
          {
            onError: (error) => {
              if (import.meta.env.DEV) {
                console.error('Failed to toggle like:', error);
              }
            },
          }
        );
      }
    },
    [user, mockPosts.length, likePost, likePostMutation, triggerHaptic]
  );

  const handleSavePost = useCallback(
    async (postId: string) => {
      if (!user) return;

      triggerHaptic('medium');
      saveItemMutation.mutate(
        { postId, type: 'post' },
        {
          onError: (error) => {
            if (import.meta.env.DEV) {
              console.error('Failed to save post:', error);
            }
          },
        }
      );
    },
    [user, saveItemMutation, triggerHaptic]
  );

  const handleSharePost = useCallback(
    async (post: Post) => {
      triggerHaptic('light');

      try {
        await share({
          title: `Post de ${post.profiles?.full_name || 'Usuário'} na Nossa Maternidade`,
          text: post.caption,
          url: window.location.origin + `/?post=${post.id}`,
        });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Erro ao compartilhar:', error);
        }
      }
    },
    [share, triggerHaptic]
  );

  const handleCreatePost = useCallback(() => {
    triggerHaptic('medium');
    setShowCreatePost(true);
  }, [triggerHaptic]);

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-full mx-auto px-4 py-4 pb-24">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 h-48 rounded-2xl animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite linear'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Header Melhorado com Estatísticas */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Comunidade</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Conecte-se com outras mães</p>
            </div>

            {/* Estatísticas do usuário */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-3 py-2 rounded-xl">
                <Crown className="w-4 h-4 text-pink-500" aria-hidden="true" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nível {userStats.level}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                aria-label="Criar nova publicação"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Compartilhar</span>
              </motion.button>
            </div>
          </div>

          {/* Barra de busca e filtros */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar posts, usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                aria-label="Buscar na comunidade"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Filtros e ordenação"
            >
              <FilterIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGroups(!showGroups)}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Grupos da comunidade"
            >
              <Users2 className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSupportResources(!showSupportResources)}
              className="p-2.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200 dark:border-red-800 rounded-xl hover:from-red-500/20 hover:to-pink-500/20 transition-colors"
              aria-label="Recursos de apoio"
            >
              <HeartHandshake className="w-4 h-4 text-red-500" aria-hidden="true" />
            </motion.button>
          </div>

          {/* Filtros expandidos */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'trending')}
                      className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="recent">Mais recentes</option>
                      <option value="popular">Mais curtidos</option>
                      <option value="trending">Mais comentados</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categorias Melhoradas */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 relative ${(category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                aria-label={`Filtrar por ${category.name}`}
              >
                <span className="text-sm">{category.icon}</span>
                <span>{category.name}</span>
                {category.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${(category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                    {category.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Grupos da Comunidade */}
      <AnimatePresence>
        {showGroups && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="max-w-full mx-auto px-4 py-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Users2 className="w-5 h-5" aria-hidden="true" />
                Grupos da Comunidade
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {communityGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${activeGroup === group.id
                        ? `border-pink-500 bg-gradient-to-r ${group.color}/10`
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-pink-300 dark:hover:border-pink-600'
                      }`}
                    onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{group.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">{group.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{group.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.isPrivate && <Lock className="w-4 h-4 text-gray-400" aria-hidden="true" />}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatNumber(group.memberCount)} membros
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recursos de Apoio */}
      <AnimatePresence>
        {showSupportResources && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-b border-red-200 dark:border-red-800 shadow-sm"
          >
            <div className="max-w-full mx-auto px-4 py-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-red-500" aria-hidden="true" />
                Recursos de Apoio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {supportResources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${resource.urgent
                        ? 'border-red-300 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${resource.color}`}>
                        <resource.icon className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white">{resource.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{resource.description}</p>
                      </div>
                    </div>
                    {resource.phone && (
                      <div className="mt-2">
                        <a
                          href={`tel:${resource.phone}`}
                          className="text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Ligue: {resource.phone}
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts da Comunidade Melhorados */}
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="space-y-6">
          {sortedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-500"
              ref={index === sortedPosts.length - 1 ? lastPostRef : null}
            >
              <div className="p-4 sm:p-6">
                {/* Header do Post Melhorado */}
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {post.profiles?.avatar_url ? (
                      <div className="relative">
                        <img
                          src={post.profiles.avatar_url}
                          alt={post.profiles.full_name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-pink-100 dark:ring-pink-500/30"
                        />
                        {/* Indicador de nível do usuário */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">5</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          {post.profiles?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">5</span>
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {post.profiles?.full_name || 'Usuário Desconhecido'}
                        </p>
                        {post.has_badge && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-2 py-0.5 rounded-full">
                            <Crown className="w-3 h-3 text-pink-500" aria-hidden="true" />
                            <span className="text-xs font-bold text-pink-600">Verificado</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" aria-hidden="true" />
                          <span>{Math.floor(Math.random() * 1000) + 100} visualizações</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`${getCategoryGradient(post.category)} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white shadow-lg`}
                    >
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <TrendingUpIcon className="w-3 h-3" aria-hidden="true" />
                      <span>#{index + 1} em trending</span>
                    </div>
                  </div>
                </div>

                {post.image_url && (
                  <div className="relative mb-5 overflow-hidden rounded-2xl">
                    <OptimizedImage
                      src={post.image_url}
                      alt="Post"
                      className="w-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    />
                  </div>
                )}

                <div className="mb-5">
                  <p className="text-claude-gray-700 dark:text-claude-gray-300 leading-relaxed text-base">
                    {post.caption.length > 200 ? (
                      <>
                        {post.caption.substring(0, 200)}...
                        <button
                          onClick={() => {
                            // Toggle para mostrar texto completo
                            const element = document.getElementById(`post-${post.id}`);
                            if (element) {
                              element.classList.toggle('line-clamp-3');
                            }
                          }}
                          className="text-pink-600 hover:text-pink-700 font-medium ml-1"
                        >
                          Ver mais
                        </button>
                      </>
                    ) : (
                      post.caption
                    )}
                  </p>
                </div>

                {post.has_badge && (
                  <div className="flex items-center gap-3 mb-5 bg-gradient-to-r from-claude-orange-50 to-claude-orange-100/50 dark:from-claude-orange-500/10 dark:to-claude-orange-500/5 px-5 py-3 rounded-2xl border border-claude-orange-200/50 dark:border-claude-orange-500/20">
                    <Award className="w-5 h-5 text-claude-orange-600 dark:text-claude-orange-500" />
                    <span className="text-sm font-semibold text-claude-orange-700 dark:text-claude-orange-500">
                      Nathy Aprovou
                    </span>
                  </div>
                )}

                {/* Seção de Interações Melhorada com Gamificação */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  {/* Ações Principais com Gamificação */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id, post.user_has_liked || false)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-300 group"
                        aria-label="Curtir post"
                      >
                        <Heart
                          className={`w-6 h-6 ${post.user_has_liked
                            ? 'fill-pink-500 text-pink-500'
                            : 'group-hover:scale-110'
                            } transition-all duration-300`}
                          strokeWidth={2}
                        />
                        <span className="text-sm font-bold">
                          {formatNumber(post.likes_count || 0)}
                        </span>
                        {post.likes_count && post.likes_count > 50 && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-2 py-0.5 rounded-full">
                            <Flame className="w-3 h-3 text-pink-500" aria-hidden="true" />
                            <span className="text-xs font-bold text-pink-600">Hot!</span>
                          </div>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300 group"
                        aria-label="Comentar no post"
                      >
                        <MessageCircle
                          className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                          strokeWidth={2}
                        />
                        <span className="text-sm font-bold">
                          {formatNumber(post.comments_count || 0)}
                        </span>
                      </motion.button>

                      {isShareSupported && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSharePost(post as Post)}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-all duration-300 group"
                          aria-label="Compartilhar post"
                        >
                          <Share2
                            className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
                            strokeWidth={2}
                          />
                          <span className="text-sm font-bold">Compartilhar</span>
                        </motion.button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSavePost(post.id)}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                        aria-label="Salvar post"
                      >
                        <Bookmark className="w-5 h-5" strokeWidth={2} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                        aria-label="Mais opções"
                      >
                        <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Indicadores de Qualidade e Gamificação */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      {post.has_badge && (
                        <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-full">
                          <Crown className="w-4 h-4" aria-hidden="true" />
                          <span className="font-bold">Verificado pela Nath</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4" aria-hidden="true" />
                        <span className="font-bold">#{index + 1} Trending</span>
                      </div>
                    </div>

                    {/* Sistema de Pontos */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 px-2 py-1 rounded-full">
                        <Zap className="w-3 h-3 text-yellow-500" aria-hidden="true" />
                        <span className="text-xs font-bold text-yellow-600">
                          +{Math.floor(Math.random() * 50) + 10} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPost === post.id && <PostComments postId={post.id} />}
            </motion.article>
          ))}

          {/* Seção de Estatísticas da Comunidade */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-pink-200 dark:border-pink-800"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              Estatísticas da Comunidade
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">2.5K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mães ativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Posts hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.2K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conquistas</div>
              </div>
            </div>
          </motion.div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={lastPostRef} className="flex justify-center py-8">
              <LoadingSpinner size="md" text="Carregando mais posts..." />
            </div>
          )}

        </div>
      </div>

      {showCreatePost && (
        <Suspense fallback={<LoadingSpinner text="Carregando editor..." />}>
          <CreatePostModal
            onClose={() => setShowCreatePost(false)}
            onPostCreated={() => {
              setShowCreatePost(false);
              refetch();
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
