import { useState, useEffect } from 'react';
import { supabase, Post } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, Award, Plus, Bookmark } from 'lucide-react';
import { CreatePostModal } from './CreatePostModal';
import { PostComments } from './PostComments';

export const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from('posts')
      .select(
        `
        *,
        profiles(*)
      `
      )
      .order('created_at', { ascending: false });

    if (postsData) {
      const postsWithStats = await Promise.all(
        postsData.map(async (post) => {
          const [likesResult, commentsResult, badgeResult, userLikeResult] = await Promise.all([
            supabase.from('likes').select('id', { count: 'exact' }).eq('post_id', post.id),
            supabase.from('comments').select('id', { count: 'exact' }).eq('post_id', post.id),
            supabase.from('nathy_badges').select('id').eq('post_id', post.id).maybeSingle(),
            user
              ? supabase
                  .from('likes')
                  .select('id')
                  .eq('post_id', post.id)
                  .eq('user_id', user.id)
                  .maybeSingle()
              : null,
          ]);

          return {
            ...post,
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
            has_badge: !!badgeResult.data,
            user_has_liked: !!userLikeResult?.data,
          };
        })
      );

      setPosts(postsWithStats);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) return;

    if (currentlyLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
    }

    fetchPosts();
  };

  const handleSavePost = async (postId: string) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .eq('type', 'post')
      .maybeSingle();

    if (existing) {
      await supabase.from('saved_items').delete().eq('id', existing.id);
    } else {
      await supabase.from('saved_items').insert({
        user_id: user.id,
        post_id: postId,
        type: 'post',
      });
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      'Look do dia': 'gradient-orange',
      Desabafo: 'gradient-purple',
      Fé: 'gradient-blue',
      'Dica de mãe': 'gradient-green',
    };
    return gradients[category as keyof typeof gradients] || 'bg-claude-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-claude-orange-500 border-t-transparent"></div>
          <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400 animate-pulse">
            Carregando posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 pb-28">
      <button
        onClick={() => setShowCreatePost(true)}
        className="btn-primary w-full mb-8 py-4 text-base flex items-center justify-center gap-2.5 group"
      >
        <Plus
          className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
          strokeWidth={2.5}
        />
        Criar nova publicação
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
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-claude-gray-100 dark:ring-claude-gray-800"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-claude-orange-500 to-claude-orange-600 flex items-center justify-center text-white font-semibold text-lg shadow-claude-sm">
                      {post.profiles?.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-claude-gray-900 dark:text-white text-base">
                      {post.profiles?.full_name}
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
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
};
