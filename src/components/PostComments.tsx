import { useState, useEffect } from 'react';
import { supabase, Comment } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send } from 'lucide-react';

type PostCommentsProps = {
  postId: string;
};

export const PostComments = ({ postId }: PostCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            {comment.profiles?.avatar_url ? (
              <img
                src={comment.profiles.avatar_url}
                alt={comment.profiles.full_name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {comment.profiles?.full_name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {comment.profiles?.full_name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="p-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
