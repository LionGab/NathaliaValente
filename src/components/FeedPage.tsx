import { useState, Suspense, lazy } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts, useLikePost, useCreateComment, useSaveItem } from '../hooks/useQueries';
import { useWebShare } from '../hooks';
import { getCategoryGradient } from '../constants/colors';
import { Heart, MessageCircle, Award, Plus, Bookmark, Share2 } from 'lucide-react';
import { PostComments } from './PostComments';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load the CreatePostModal since it's only shown when needed
const CreatePostModal = lazy(() => import('./CreatePostModal').then(module => ({ default: module.CreatePostModal })));

export const FeedPage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { user } = useAuth();

  // Use optimized React Query hooks
  const { data: posts = [], isLoading: loading, refetch } = usePosts();
  const likePostMutation = useLikePost();
  const saveItemMutation = useSaveItem();
  const { share, isSupported: isShareSupported } = useWebShare();

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    likePostMutation.mutate(
      { postId, isLiked: currentlyLiked },
      {
        onError: (error) => {
          console.error('Failed to toggle like:', error);
        },
      }
    );
  };

  const handleSavePost = async (postId: string) => {
    if (!user) return;

    saveItemMutation.mutate(
      { postId, type: 'post' },
      {
        onError: (error) => {
          console.error('Failed to save post:', error);
        },
      }
    );
  };

  const handleSharePost = async (post: { caption: string; full_name: string; id: string }) => {
    try {
      await share({
        title: `Post de ${post.full_name} no ClubNath`,
        text: post.caption,
        url: window.location.origin + `/?post=${post.id}`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner text="Carregando posts..." />
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-4 pb-24 mobile-padding">
      <button
        onClick={() => setShowCreatePost(true)}
        className="btn-primary w-full mb-6 py-4 text-base flex items-center justify-center gap-2.5 group touch-target"
      >
        <Plus
          className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
          strokeWidth={2.5}
        />
        <span className="mobile-text-sm">Compartilhar sua jornada</span>
      </button>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <article
            key={post.id}
            className="card overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  {post.avatar_url ? (
                    <img
                      src={post.avatar_url}
                      alt={post.full_name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-claude-gray-100 dark:ring-claude-gray-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-claude-orange-500 to-claude-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-claude-sm">
                      {post.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-claude-gray-900 dark:text-white text-base">
                      {post.full_name}
                    </p>
                    <p className="text-xs text-claude-gray-500 dark:text-claude-gray-400 mt-0.5">
                      {new Date(post.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <span
                  className={`${getCategoryGradient(post.category)} px-4 py-2 rounded-full text-xs font-semibold text-white shadow-claude-sm`}
                >
                  {post.category}
                </span>
              </div>

              {post.image_url && (
                <div className="relative mb-5 overflow-hidden rounded-2xl">
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-500"
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

              <div className="flex items-center gap-6 pt-4 border-t border-claude-gray-100 dark:border-claude-gray-800">
                <button
                  onClick={() => handleLike(post.id, post.user_has_liked || false)}
                  className="flex items-center gap-2.5 text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-orange-600 dark:hover:text-claude-orange-500 transition-all duration-200 group"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      post.user_has_liked
                        ? 'fill-claude-orange-500 text-claude-orange-500 scale-110'
                        : 'group-hover:scale-110'
                    } transition-all duration-200`}
                    strokeWidth={2}
                  />
                  <span className="text-sm font-semibold">{post.likes_count}</span>
                </button>

                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="flex items-center gap-2.5 text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-orange-600 dark:hover:text-claude-orange-500 transition-all duration-200 group"
                >
                  <MessageCircle
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                    strokeWidth={2}
                  />
                  <span className="text-sm font-semibold">{post.comments_count}</span>
                </button>

                {isShareSupported && (
                  <button
                    onClick={() => handleSharePost(post)}
                    className="flex items-center gap-2 text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-orange-600 dark:hover:text-claude-orange-500 transition-all duration-200 group"
                    aria-label="Compartilhar post"
                  >
                    <Share2
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                      strokeWidth={2}
                    />
                  </button>
                )}

                <button
                  onClick={() => handleSavePost(post.id)}
                  className="flex items-center gap-2 text-claude-gray-600 dark:text-claude-gray-400 hover:text-claude-orange-600 dark:hover:text-claude-orange-500 transition-all duration-200 ml-auto group"
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
