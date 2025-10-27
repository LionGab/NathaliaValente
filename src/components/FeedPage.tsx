import { useState, Suspense, lazy, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts, useLikePost, useSaveItem } from '../hooks/useQueries';
import { useWebShare } from '../hooks';
import { getCategoryGradient } from '../constants/colors';
import { Heart, MessageCircle, Award, Plus, Bookmark, Share2, Sparkles } from 'lucide-react';
import { PostComments } from './PostComments';
import { LoadingSpinner, PostSkeleton } from './ui/LoadingSpinner';
import { useMockData } from '../hooks/useMockData';
import { Button } from './ui/Button';
import { useInfiniteScroll, useHapticFeedback } from '../hooks/useGestures';
import { formatNumber, formatDate } from '../lib/utils';
import { DailyVerseCard } from './DailyVerseCard';
import { OptimizedImage } from './ui/OptimizedImage';
import { NAVAHeroSection } from './NAVAHeroSection';
import { RoutineCalendar } from './RoutineCalendar';
// import { HeroCard } from '../features/home/components/HeroCard';
// import { QuickActions } from '../features/home/components/QuickActions';
// import { ProductPreview } from '../features/home/components/ProductPreview';
// import { CollapsibleVerse } from '../features/home/components/CollapsibleVerse';
// import { RoutinePreview } from '../features/home/components/RoutinePreview';
import type { Post } from '../lib/supabase';

// Lazy load the CreatePostModal since it's only shown when needed
const CreatePostModal = lazy(() =>
  import('./CreatePostModal').then((module) => ({ default: module.CreatePostModal }))
);

export const FeedPage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [page, setPage] = useState(0);
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
  const posts = mockPosts.length > 0 ? mockPosts : realPosts;
  const loading = mockLoading || realLoading;
  const hasMore = posts.length > 0 && posts.length % 20 === 0;

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
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-4 pb-24 mobile-padding">
      {/* Hero Card Refatorado */}
      <HeroCard />

      {/* Quick Actions */}
      <QuickActions />

      {/* Versículo Colapsável */}
      <CollapsibleVerse verse={{
        text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
        reference: "Jeremias 29:11",
        date: "27 de Janeiro, 2025"
      }} />

      {/* NAVA Hero Section */}
      <NAVAHeroSection />

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">2.5K</div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">Mães ativas</div>
        </div>
        <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15K</div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">Posts hoje</div>
        </div>
        <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98%</div>
          <div className="text-xs text-claude-gray-500 dark:text-claude-gray-400">Satisfação</div>
        </div>
      </div>

      {/* Preview da Rotina */}
      <RoutinePreview />

      {/* Preview de Produtos */}
      <ProductPreview />

      {/* Calendário de Rotina Completo */}
      <RoutineCalendar />

      {/* Posts removidos - substituídos pelo Calendário de Rotina */}
      {false && <div className="space-y-6">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="group bg-white dark:bg-claude-gray-800 rounded-3xl shadow-sm border border-claude-gray-200/50 dark:border-claude-gray-700/50 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
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

              <p className="text-claude-gray-700 dark:text-claude-gray-300 mb-5 leading-relaxed text-base">
                {post.caption}
              </p>

              {post.has_badge && (
                <div className="flex items-center gap-3 mb-5 bg-gradient-to-r from-claude-orange-50 to-claude-orange-100/50 dark:from-claude-orange-500/10 dark:to-claude-orange-500/5 px-5 py-3 rounded-2xl border border-claude-orange-200/50 dark:border-claude-orange-500/20">
                  <Award className="w-5 h-5 text-claude-orange-600 dark:text-claude-orange-500" />
                  <span className="text-sm font-semibold text-claude-orange-700 dark:text-claude-orange-500">
                    Nathy Aprovou
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-claude-gray-100 dark:border-claude-gray-800">
                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => handleLike(post.id, post.user_has_liked || false)}
                    className="flex items-center gap-2 sm:gap-2.5 text-claude-gray-600 dark:text-claude-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-200 group touch-target"
                  >
                    <Heart
                      className={`w-5 h-5 ${post.user_has_liked
                        ? 'fill-pink-500 text-pink-500 scale-110'
                        : 'group-hover:scale-110'
                        } transition-all duration-200`}
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold">
                      {formatNumber(post.likes_count || 0)}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    className="flex items-center gap-2 sm:gap-2.5 text-claude-gray-600 dark:text-claude-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-200 group touch-target"
                  >
                    <MessageCircle
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                      strokeWidth={2}
                    />
                    <span className="text-sm font-semibold">
                      {formatNumber(post.comments_count || 0)}
                    </span>
                  </button>

                  {isShareSupported && (
                    <button
                      onClick={() => handleSharePost(post as Post)}
                      className="flex items-center gap-2 text-claude-gray-600 dark:text-claude-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-200 group touch-target"
                      aria-label="Compartilhar post"
                    >
                      <Share2
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                        strokeWidth={2}
                      />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleSavePost(post.id)}
                  className="flex items-center gap-2 text-claude-gray-600 dark:text-claude-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-200 group touch-target"
                  aria-label="Salvar post"
                >
                  <Bookmark
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                    strokeWidth={2}
                  />
                </button>
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
      </div>}

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
