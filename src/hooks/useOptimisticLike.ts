import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  category: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  full_name: string;
  avatar_url: string | null;
  likes_count: number;
  comments_count: number;
  has_badge: boolean;
  user_has_liked: boolean;
}

export function useOptimisticLike() {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, boolean>>(new Map());

  /**
   * Toggle like with optimistic UI update
   * Updates UI immediately, then syncs with server
   */
  const toggleLike = async (
    postId: string,
    userId: string,
    currentLikeStatus: boolean,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    // Store optimistic state
    const newLikeStatus = !currentLikeStatus;
    setOptimisticUpdates((prev) => new Map(prev).set(postId, newLikeStatus));

    try {
      if (currentLikeStatus) {
        // Unlike: delete the like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Like: insert new like
        const { error } = await supabase.from('likes').insert({
          post_id: postId,
          user_id: userId,
        });

        if (error) throw error;
      }

      // Clear optimistic state on success
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(postId);
        return newMap;
      });

      onSuccess?.();
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.delete(postId);
        return newMap;
      });

      onError?.(error as Error);
      console.error('Error toggling like:', error);
    }
  };

  /**
   * Apply optimistic updates to a post
   */
  const applyOptimisticUpdate = (post: Post): Post => {
    const optimisticLikeStatus = optimisticUpdates.get(post.id);

    if (optimisticLikeStatus !== undefined) {
      const likesAdjustment = optimisticLikeStatus ? 1 : -1;
      return {
        ...post,
        user_has_liked: optimisticLikeStatus,
        likes_count: Math.max(0, post.likes_count + likesAdjustment),
      };
    }

    return post;
  };

  /**
   * Apply optimistic updates to a list of posts
   */
  const applyOptimisticUpdates = (posts: Post[]): Post[] => {
    return posts.map(applyOptimisticUpdate);
  };

  return {
    toggleLike,
    applyOptimisticUpdate,
    applyOptimisticUpdates,
    hasOptimisticUpdate: (postId: string) => optimisticUpdates.has(postId),
  };
}
