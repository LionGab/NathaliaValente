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
    <div className="border-t border-peanut-gray-100 dark:border-peanut-gray-700 p-5 bg-peanut-sand/30 dark:bg-peanut-gray-900/30">
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            {comment.profiles?.avatar_url ? (
              <img
                src={comment.profiles.avatar_url}
                alt={comment.profiles.full_name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-peanut-gray-100 dark:ring-peanut-gray-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-peanut-coral flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {comment.profiles?.full_name.charAt(0)}
              </div>
            )}
            <div className="flex-1 bg-white dark:bg-peanut-gray-800 px-3 py-2 rounded-2xl">
              <p className="text-sm font-semibold text-peanut-gray-800 dark:text-white mb-0.5">
                {comment.profiles?.full_name}
              </p>
              <p className="text-sm text-peanut-gray-600 dark:text-peanut-gray-400 leading-relaxed">{comment.content}</p>
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
          className="flex-1 px-4 py-2.5 rounded-full border border-peanut-gray-200 dark:border-peanut-gray-700 bg-white dark:bg-peanut-gray-800 text-peanut-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-peanut-coral focus:border-transparent transition-all placeholder:text-peanut-gray-400"
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="p-2.5 bg-peanut-coral text-white rounded-full hover:bg-peanut-coral-light shadow-peanut-sm hover:shadow-peanut transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </button>
      </form>
    </div>
  );
};
