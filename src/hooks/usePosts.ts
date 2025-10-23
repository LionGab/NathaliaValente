import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Post } from './useOptimisticLike';

interface UsePostsOptions {
  userId?: string | null;
  category?: string;
  limit?: number;
  enabled?: boolean;
}

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching posts with optimized queries
 * Uses database functions to avoid N+1 query problem
 */
export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const { userId, category, limit = 20, enabled = true } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      let data: Post[] | null = null;

      if (category && category !== 'Todos') {
        // Use optimized function for category filtering
        const { data: categoryData, error: categoryError } = await supabase.rpc(
          'get_posts_by_category',
          {
            p_category: category,
            p_user_id: currentUserId || null,
            p_limit: limit,
          }
        );

        if (categoryError) throw categoryError;
        data = categoryData;
      } else if (userId) {
        // Use optimized function for user posts
        const { data: userPostsData, error: userPostsError } = await supabase.rpc(
          'get_user_posts_with_stats',
          {
            p_user_id: userId,
            p_current_user_id: currentUserId || null,
          }
        );

        if (userPostsError) throw userPostsError;
        data = userPostsData;
      } else {
        // Use optimized function for feed
        const { data: feedData, error: feedError } = await supabase.rpc(
          'get_posts_with_user_likes',
          {
            p_user_id: currentUserId || null,
            p_limit: limit,
            p_offset: 0,
          }
        );

        if (feedError) throw feedError;
        data = feedData;
      }

      setPosts(data || []);
    } catch (err) {
      setError(err as Error);
      if (import.meta.env.DEV) {
        console.error('Error fetching posts:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, category, limit, enabled]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
  };
}
