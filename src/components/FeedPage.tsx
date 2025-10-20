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
      'Look do dia': 'bg-peanut-coral text-white',
      'Desabafo': 'bg-purple-400 text-white',
      'Fé': 'bg-blue-400 text-white',
      'Dica de mãe': 'bg-emerald-400 text-white',
    };
    return colors[category as keyof typeof colors] || 'bg-peanut-gray-400 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-peanut-coral border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
      <button
        onClick={() => setShowCreatePost(true)}
        className="w-full mb-5 bg-peanut-coral text-white py-4 px-6 rounded-3xl font-semibold hover:bg-peanut-coral-light shadow-peanut hover:shadow-peanut-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        Criar nova publicação
      </button>

      <div className="space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white dark:bg-peanut-gray-800 rounded-3xl shadow-peanut overflow-hidden transition-all duration-300 hover:shadow-peanut-lg"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.full_name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-peanut-gray-100 dark:ring-peanut-gray-700"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-peanut-coral flex items-center justify-center text-white font-semibold text-base">
                      {post.profiles?.full_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-peanut-gray-800 dark:text-white text-[15px]">
                      {post.profiles?.full_name}
                    </p>
                    <p className="text-xs text-peanut-gray-400 dark:text-peanut-gray-500">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(
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
                  className="w-full rounded-2xl mb-4 object-cover max-h-96"
                />
              )}

              <p className="text-peanut-gray-700 dark:text-peanut-gray-300 mb-4 leading-relaxed">{post.caption}</p>

              {post.has_badge && (
                <div className="flex items-center gap-2 mb-4 bg-peanut-peach/30 dark:bg-peanut-coral/10 px-4 py-2.5 rounded-2xl">
                  <Award className="w-5 h-5 text-peanut-coral" />
                  <span className="text-sm font-semibold text-peanut-coral">
                    Nathy Aprovou
                  </span>
                </div>
              )}

              <div className="flex items-center gap-5 pt-3 border-t border-peanut-gray-100 dark:border-peanut-gray-700">
                <button
                  onClick={() => handleLike(post.id, post.user_has_liked || false)}
                  className="flex items-center gap-2 text-peanut-gray-500 dark:text-peanut-gray-400 hover:text-peanut-coral transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      post.user_has_liked ? 'fill-peanut-coral text-peanut-coral' : ''
                    }`}
                    strokeWidth={2}
                  />
                  <span className="text-sm font-semibold">{post.likes_count}</span>
                </button>

                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-peanut-gray-500 dark:text-peanut-gray-400 hover:text-peanut-coral transition-colors"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={2} />
                  <span className="text-sm font-semibold">{post.comments_count}</span>
                </button>

                <button
                  onClick={() => handleSavePost(post.id)}
                  className="flex items-center gap-2 text-peanut-gray-500 dark:text-peanut-gray-400 hover:text-peanut-coral transition-colors ml-auto"
                >
                  <Bookmark className="w-5 h-5" strokeWidth={2} />
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
