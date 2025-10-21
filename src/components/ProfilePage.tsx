import { useState, useEffect } from 'react';
import { supabase, SavedItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../hooks';
import { Gem, Grid, Bookmark, Heart, MessageCircle } from 'lucide-react';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const { profile, user } = useAuth();

  // Use optimized hook for user posts
  const { posts: userPosts, loading: loadingPosts } = usePosts({
    userId: user?.id,
    enabled: !!user,
  });

  const loading = loadingPosts || loadingSaved;

  const fetchSavedItems = async () => {
    if (!user) return;

    setLoadingSaved(true);
    const { data } = await supabase
      .from('saved_items')
      .select(
        `
        *,
        posts(*, profiles(*))
      `
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setSavedItems(data);
    }
    setLoadingSaved(false);
  };

  useEffect(() => {
    fetchSavedItems();
  }, [user]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'Look do dia': 'from-pink-400 to-rose-400',
      Desabafo: 'from-purple-400 to-indigo-400',
      Fé: 'from-blue-400 to-cyan-400',
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
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {profile?.full_name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {profile?.full_name}
            </h2>
            {profile?.bio && <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{userPosts.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Publicações</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {userPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Curtidas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{savedItems.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Salvos</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all ${
            activeTab === 'posts'
              ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Grid className="w-5 h-5 inline-block mr-2" />
          Minhas Publicações
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all ${
            activeTab === 'saved'
              ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Gem className="w-5 h-5 inline-block mr-2" />
          Meus Tesouros
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {post.image_url && (
                <img src={post.image_url} alt="Post" className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
                      post.category
                    )}`}
                  >
                    {post.category}
                  </span>

                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4" />
                      {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {userPosts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Você ainda não fez nenhuma publicação
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all"
            >
              {item.type === 'post' && item.posts ? (
                <div className="flex gap-4">
                  {item.posts.image_url && (
                    <img
                      src={item.posts.image_url}
                      alt="Post"
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.posts.profiles?.avatar_url ? (
                        <img
                          src={item.posts.profiles.avatar_url}
                          alt={item.posts.profiles.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {item.posts.profiles?.full_name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {item.posts.profiles?.full_name}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                      {item.posts.caption}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
                        item.posts.category
                      )}`}
                    >
                      {item.posts.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <Bookmark className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {item.type === 'quote' ? 'Frase salva' : 'Versículo salvo'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.content || 'Conteúdo não disponível'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {savedItems.length === 0 && (
            <div className="text-center py-12">
              <Gem className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Você ainda não salvou nenhum tesouro
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
