import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreVertical, Send } from 'lucide-react';
import { useDemoMode, DemoPost, DemoComment } from '../../../hooks/useDemoMode';

export default function DemoFeedPage() {
  const { getDemoPosts, getDemoComments, simulateLike, simulateComment } = useDemoMode();
  const [posts, setPosts] = useState<DemoPost[]>(getDemoPosts());
  const [selectedPost, setSelectedPost] = useState<DemoPost | null>(null);
  const [comments, setComments] = useState<DemoComment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newLiked = simulateLike(postId, post.user_has_liked || false);
          return {
            ...post,
            user_has_liked: newLiked,
            likes_count: newLiked ? post.likes_count + 1 : post.likes_count - 1,
          };
        }
        return post;
      })
    );
  };

  const handleOpenComments = (post: DemoPost) => {
    setSelectedPost(post);
    setComments(getDemoComments(post.id));
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const comment = simulateComment(selectedPost.id, newComment);
    setComments([...comments, comment as DemoComment]);
    setNewComment('');

    // Atualizar contagem de comentários
    setPosts(
      posts.map((post) =>
        post.id === selectedPost.id ? { ...post, comments_count: post.comments_count + 1 } : post
      )
    );
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Agora há pouco';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Look do dia':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
      case 'Desabafo':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Fé':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Dica de mãe':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="card p-6 hover:shadow-lg transition-shadow duration-200 animate-fadeIn"
          >
            {/* Header do Post */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.profiles?.avatar_url || 'https://i.pravatar.cc/150?img=1'}
                  alt={post.profiles?.full_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-200 dark:ring-orange-800"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{post.profiles?.full_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatRelativeTime(post.created_at)}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Categoria */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
            </div>

            {/* Conteúdo */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">{post.caption}</p>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 transition-all duration-200 group ${
                    post.user_has_liked
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      post.user_has_liked ? 'fill-current' : ''
                    }`}
                  />
                  <span className="font-medium text-sm">{post.likes_count}</span>
                </button>

                <button
                  onClick={() => handleOpenComments(post)}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 group"
                >
                  <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-medium text-sm">{post.comments_count}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 transition-all duration-200 group">
                  <Bookmark className="w-5 h-5 transition-transform group-hover:scale-110" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Comentários */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-2xl max-h-[90vh] overflow-hidden animate-slideUp flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Comentários</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Comentários */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum comentário ainda</p>
                  <p className="text-sm">Seja a primeira a comentar!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.profiles?.avatar_url || 'https://i.pravatar.cc/150?img=1'}
                      alt={comment.profiles?.full_name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {comment.profiles?.full_name}
                        </p>
                        <p className="text-gray-700 dark:text-gray-200 text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-4">
                        {formatRelativeTime(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de Comentário */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Escreva um comentário..."
                  className="flex-1 px-4 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
