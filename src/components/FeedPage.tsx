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
      .select(`
        *,
        profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (postsData) {
      const postsWithStats = await Promise.all(
        postsData.map(async (post) => {
          const [likesResult, commentsResult, badgeResult, userLikeResult] = await Promise.all([
            supabase.from('likes').select('id', { count: 'exact' }).eq('post_id', post.id),
            supabase.from('comments').select('id', { count: 'exact' }).eq('post_id', post.id),
            supabase.from('nathy_badges').select('id').eq('post_id', post.id).maybeSingle(),
            user ? supabase.from('likes').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle() : null,
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Look do dia': 'from-pink-400 to-rose-400',
      'Desabafo': 'from-purple-400 to-indigo-400',
      'Fé': 'from-blue-400 to-cyan-400',
      'Dica de mãe': 'from-green-400 to-emerald-400',
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <button
        onClick={() => setShowCreatePost(true)}
        className="w-full mb-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-4 px-6 rounded-2xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Criar nova publicação
      </button>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-medium">
                      {post.profiles?.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {post.profiles?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
                    post.category
                  )}`}
                >
                  {post.category}
                </span>
              </div>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full rounded-2xl mb-3 object-cover max-h-96"
                />
              )}

              <p className="text-gray-700 dark:text-gray-300 mb-4">{post.caption}</p>

              {post.has_badge && (
                <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 px-3 py-2 rounded-xl">
                  <Award className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                    Nathy Aprovou
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleLike(post.id, post.user_has_liked || false)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      post.user_has_liked ? 'fill-pink-500 text-pink-500' : ''
                    }`}
                  />
                  <span className="text-sm font-medium">{post.likes_count}</span>
                </button>

                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments_count}</span>
                </button>

                <button
                  onClick={() => handleSavePost(post.id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors ml-auto"
                >
                  <Bookmark className="w-5 h-5" />
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
