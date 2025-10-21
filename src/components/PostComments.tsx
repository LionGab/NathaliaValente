import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePostComments, useCreateComment } from '../hooks/useQueries';
import { Send } from 'lucide-react';

type PostCommentsProps = {
  postId: string;
};

export const PostComments = ({ postId }: PostCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  
  // Use React Query hooks
  const { data: comments = [], isLoading } = usePostComments(postId);
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    createCommentMutation.mutate(
      { postId, content: newComment.trim() },
      {
        onSuccess: () => {
          setNewComment('');
        },
        onError: (error) => {
          console.error('Error posting comment:', error);
        },
      }
    );
  };

  return (
    <div className="border-t border-claude-gray-100 dark:border-claude-gray-800 p-6 bg-claude-cream-100/50 dark:bg-claude-gray-900/50">
      <div className="space-y-3 mb-5 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-center text-sm text-claude-gray-500 dark:text-claude-gray-400 py-4">
            Seja o primeiro a comentar
          </p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="flex gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {comment.profiles?.avatar_url ? (
                <img
                  src={comment.profiles.avatar_url}
                  alt={comment.profiles.full_name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-claude-gray-200 dark:ring-claude-gray-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-claude-orange-500 to-claude-orange-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-claude-sm">
                  {comment.profiles?.full_name.charAt(0)}
                </div>
              )}
              <div className="flex-1 bg-white dark:bg-claude-gray-800 px-4 py-3 rounded-2xl shadow-claude-sm">
                <p className="text-sm font-semibold text-claude-gray-900 dark:text-white mb-1">
                  {comment.profiles?.full_name}
                </p>
                <p className="text-sm text-claude-gray-700 dark:text-claude-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 px-5 py-3 rounded-full border border-claude-gray-200 dark:border-claude-gray-700 bg-white dark:bg-claude-gray-800 text-claude-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-claude-orange-500/20 focus:border-claude-orange-500 transition-all placeholder:text-claude-gray-400"
        />
        <button
          type="submit"
          disabled={createCommentMutation.isPending || !newComment.trim()}
          className="p-3 bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white rounded-full hover:shadow-claude-md shadow-claude-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
};
