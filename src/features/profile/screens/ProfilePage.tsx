import { useState, useEffect } from 'react';
import { supabase, SavedItem } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { usePosts } from '../../../hooks';
import { getCategoryColor } from '../../../constants/colors';
import { Gem, Grid, Bookmark, Heart, MessageCircle, Settings, Edit3, Share2, MoreHorizontal, Star, Award, Users, Calendar, Palette, X, Shield, Baby, Camera, HelpCircle, LogOut } from 'lucide-react';
import { useMockData } from '../../../hooks/useMockData';
import { Avatar, AvatarType } from '../../../components/ui/Avatar';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'achievements'>('posts');
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [userAvatar, setUserAvatar] = useState<AvatarType>('radiante');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { profile, user, signOut } = useAuth();

  // Mock achievements data
  const achievements = [
    { id: 1, title: "Primeira Postagem", description: "Compartilhou sua primeira experiência", icon: "🌟", unlocked: true },
    { id: 2, title: "Mãe Ativa", description: "5 posts sobre maternidade", icon: "💪", unlocked: true },
    { id: 3, title: "Comunidade", description: "Interagiu com 10 posts", icon: "👥", unlocked: false },
    { id: 4, title: "Inspiradora", description: "Recebeu 50 curtidas", icon: "✨", unlocked: false },
    { id: 5, title: "Sábia", description: "Compartilhou 20 dicas úteis", icon: "🧠", unlocked: false }
  ];

  // Use mock data for better experience
  const { posts: mockPosts, loading: mockLoading } = useMockData();

  // Fallback to real data if needed
  const { posts: realUserPosts, loading: realLoadingPosts } = usePosts({
    userId: user?.id,
    enabled: !!user,
  });

  // Use mock data if available, otherwise real data
  const userPosts = mockPosts.length > 0 ? mockPosts.filter(post => post.user_id === user?.id) : realUserPosts;
  const loadingPosts = mockLoading || realLoadingPosts;

  const loading = loadingPosts || loadingSaved;

  const handleLogout = async () => {
    try {
      await signOut();
      setShowMoreMenu(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 mobile-bottom-nav">
      {/* Profile Header Mobile-First */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4 mb-4">
        {/* Profile Info */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4 lg:mb-6">
          <div className="relative">
            <Avatar
              type={userAvatar}
              size="lg"
              onClick={() => {
                setShowAvatarSelector(true);
              }}
              className="ring-4 ring-white dark:ring-gray-700 shadow-lg"
              aria-label={`Avatar de ${profile?.full_name || 'usuário'}`}
            />
            <button
              onClick={() => {
                setShowAvatarSelector(true);
              }}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors"
              aria-label="Alterar avatar"
            >
              <Palette className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-800 dark:text-white mobile-text-lg">
                {profile?.full_name}
              </h2>
              {/* Verified badge - implement when needed */}
              {false && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
                </div>
              )}
            </div>
            {profile?.bio && (
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 leading-relaxed mobile-text-sm">
                {profile.bio}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow touch-target"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* More Menu Dropdown */}
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-large border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                    Mais Recursos
                  </div>

                  <button className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Segurança & SOS</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Recursos de emergência</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Baby className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Saúde & Bem-estar</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Dicas de saúde materno-infantil</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Camera className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Produtos NAVA</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Moda exclusiva da Nathália</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Baby className="w-5 h-5 text-teal-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Cuidados OLLIN</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Beleza natural para mães</div>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                  <button className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Configurações</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Privacidade e notificações</div>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Ajuda & Suporte</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Central de ajuda</div>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium text-red-600 dark:text-red-400">Sair da Conta</div>
                      <div className="text-sm text-red-500 dark:text-red-400">Fazer logout</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats - Mobile Optimized Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-lg font-bold text-gray-800 dark:text-white">{userPosts.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Publicações</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {userPosts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Curtidas</p>
          </div>
          <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-lg font-bold text-gray-800 dark:text-white">{savedItems.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Salvos</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 mt-4">
          <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all touch-target">
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Editar Perfil
          </button>
          <button className="p-2.5 sm:p-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl shadow-md hover:shadow-lg transition-all touch-target">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-2.5 sm:p-3 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl shadow-md hover:shadow-lg transition-all touch-target">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Mobile-First */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all touch-target ${activeTab === 'posts'
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg'
            }`}
        >
          <Grid className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
          <span className="text-sm sm:text-base">Publicações</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-medium transition-all touch-target ${activeTab === 'saved'
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg'
            }`}
        >
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
          <span className="text-sm sm:text-base">Salvos</span>
        </button>
      </div>

      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              {post.image_url && (
                <div className="relative">
                  <img src={post.image_url} alt="Post" className="w-full h-40 sm:h-48 object-cover" />
                  {post.has_badge && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-1.5 rounded-full shadow-lg">
                      <Award className="w-3 h-3" />
                    </div>
                  )}
                </div>
              )}
              <div className="p-3 sm:p-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-3 line-clamp-3 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getCategoryColor(
                      post.category
                    )}`}
                  >
                    {post.category}
                  </span>

                  <div className="flex items-center gap-2 sm:gap-3 text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 text-xs sm:text-sm">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1 text-xs sm:text-sm">
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      {post.comments_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {userPosts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Crie sua primeira memória agora!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Compartilhe sua experiência e inspire outras mães da comunidade
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }))}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Compartilhar Experiência
                </button>
              </div>
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
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gem className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  Descubra conteúdo incrível!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Explore a comunidade e salve posts que te inspiram
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'feed' } }))}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Explorar Comunidade
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Escolher Avatar
              </h3>
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {(['exausta', 'oracao', 'radiante', 'vulneravel', 'pensativa', 'determinada', 'gravida', 'amamentando', 'hijab', 'blackpower', 'asiatica', 'cadeirante'] as AvatarType[]).map((avatarType) => (
                <button
                  key={avatarType}
                  onClick={() => {
                    setUserAvatar(avatarType);
                    setShowAvatarSelector(false);
                  }}
                  className={`p-2 rounded-lg border-2 transition-all ${userAvatar === avatarType
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                    }`}
                >
                  <Avatar type={avatarType} size="md" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
