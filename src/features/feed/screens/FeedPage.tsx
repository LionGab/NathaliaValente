import { useState, Suspense, lazy, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { usePosts, useLikePost, useSaveItem } from '../../../hooks/useQueries';
import { useWebShare } from '../../../hooks';
import { getCategoryGradient } from '../../../constants/colors';
import { Heart, MessageCircle, Award, Plus, Bookmark, Share2, Filter, Users, Star, HelpCircle, Calendar, TrendingUp, Shield, Baby, Lightbulb, Coffee, Clock, Target, CheckCircle, AlertCircle, ThumbsUp, MessageSquare, Share, Flag, MoreHorizontal } from 'lucide-react';
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
  const { user } = useAuth();
  const { triggerHaptic } = useHapticFeedback();

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
    { id: 'all', name: 'Todos', icon: '📱', color: 'from-gray-500 to-gray-600' },
    { id: 'Apoio Emocional', name: 'Apoio Emocional', icon: '🤗', color: 'from-pink-500 to-rose-500' },
    { id: 'Dicas Práticas', name: 'Dicas Práticas', icon: '💡', color: 'from-yellow-500 to-orange-500' },
    { id: 'Saúde & Bem-estar', name: 'Saúde & Bem-estar', icon: '🏥', color: 'from-green-500 to-emerald-500' },
    { id: 'Educação Financeira', name: 'Educação Financeira', icon: '💰', color: 'from-blue-500 to-cyan-500' },
    { id: 'Empreendedorismo', name: 'Empreendedorismo', icon: '🚀', color: 'from-purple-500 to-violet-500' },
    { id: 'Maternidade', name: 'Maternidade', icon: '👶', color: 'from-pink-400 to-purple-400' },
    { id: 'Desabafo', name: 'Desabafo', icon: '💭', color: 'from-indigo-500 to-blue-500' },
    { id: 'Conquistas', name: 'Conquistas', icon: '🏆', color: 'from-yellow-400 to-orange-400' }
  ];

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
    <div className="max-w-full mx-auto px-4 py-4 pb-24 mobile-padding">
      {/* Header Fixo e Simplificado */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Comunidade</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Conecte-se com outras mães</p>
          </div>
          <button
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>

      {/* Filtros Fixos e Simplificados */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 -mx-4 px-4 py-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${(category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <span className="text-sm">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts da Comunidade */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-pink-100 dark:ring-pink-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm sm:text-lg shadow-lg">
                      {post.profiles?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-claude-gray-900 dark:text-white text-sm sm:text-base">
                      {post.profiles?.full_name || 'Usuário Desconhecido'}
                    </p>
                    <p className="text-xs text-claude-gray-500 dark:text-claude-gray-400 mt-0.5">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>

                <span
                  className={`${getCategoryGradient(post.category)} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white shadow-lg`}
                >
                  {post.category}
                </span>
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

              {/* Seção de Interações Simplificada */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                {/* Ações Principais Agrupadas */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id, post.user_has_liked || false)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-300 group"
                    >
                      <Heart
                        className={`w-5 h-5 ${post.user_has_liked
                          ? 'fill-pink-500 text-pink-500'
                          : 'group-hover:scale-110'
                          } transition-all duration-300`}
                        strokeWidth={2}
                      />
                      <span className="text-sm font-medium">
                        {formatNumber(post.likes_count || 0)}
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-300 group"
                    >
                      <MessageCircle
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-medium">
                        {formatNumber(post.comments_count || 0)}
                      </span>
                    </button>

                    {isShareSupported && (
                      <button
                        onClick={() => handleSharePost(post as Post)}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-all duration-300 group"
                        aria-label="Compartilhar post"
                      >
                        <Share2
                          className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                          strokeWidth={2}
                        />
                        <span className="text-sm font-medium">Compartilhar</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSavePost(post.id)}
                      className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
                      aria-label="Salvar post"
                    >
                      <Bookmark className="w-5 h-5" strokeWidth={2} />
                    </button>

                    <button
                      className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                      aria-label="Mais opções"
                    >
                      <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Indicadores de Qualidade do Post */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  {post.has_badge && (
                    <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">Verificado pela Nath</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Popular</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedPost === post.id && <PostComments postId={post.id} />}
          </article>
        ))}

        {/* Infinite scroll trigger */}
        {hasMore && (
          <div ref={lastPostRef} className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Carregando mais posts..." />
          </div>
        )}

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
