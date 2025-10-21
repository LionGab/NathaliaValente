import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Post, Profile, Comment, DailyQuote, SavedItem } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Query Keys - Centralized for consistency
export const queryKeys = {
  posts: ['posts'] as const,
  post: (id: string) => ['posts', id] as const,
  postComments: (postId: string) => ['posts', postId, 'comments'] as const,
  profile: (userId: string) => ['profiles', userId] as const,
  currentProfile: ['profiles', 'current'] as const,
  dailyQuotes: ['daily-quotes'] as const,
  savedItems: (userId: string) => ['saved-items', userId] as const,
  postLikes: (postId: string) => ['posts', postId, 'likes'] as const,
} as const;

// Posts Queries
export const usePosts = () => {
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            id,
            full_name,
            avatar_url,
            avatar_emoji
          ),
          post_likes!left (
            user_id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform the data to match our Post type
      return data?.map(post => ({
        ...post,
        profiles: post.profiles,
        likes_count: post.post_likes?.length || 0,
        user_has_liked: false, // Will be set by the component based on current user
      })) || [];
    },
    // Cache posts for 2 minutes (they change frequently)
    staleTime: 2 * 60 * 1000,
    // Keep in cache for 5 minutes
    gcTime: 5 * 60 * 1000,
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.post(postId),
    queryFn: async (): Promise<Post | null> => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            id,
            full_name,
            avatar_url,
            avatar_emoji
          ),
          post_likes!left (
            user_id
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      return data ? {
        ...data,
        profiles: data.profiles,
        likes_count: data.post_likes?.length || 0,
        user_has_liked: false,
      } : null;
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.postComments(postId),
    queryFn: async (): Promise<Comment[]> => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles!comments_user_id_fkey (
            id,
            full_name,
            avatar_url,
            avatar_emoji
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(comment => ({
        ...comment,
        profiles: comment.profiles,
      })) || [];
    },
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // Comments change more frequently
  });
};

// Profile Queries
export const useCurrentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.currentProfile,
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Profile doesn't change often
  });
};

export const useProfile = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

// Daily Quotes Query
export const useDailyQuotes = () => {
  return useQuery({
    queryKey: queryKeys.dailyQuotes,
    queryFn: async (): Promise<DailyQuote[]> => {
      const { data, error } = await supabase
        .from('daily_quotes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // Quotes don't change often
  });
};

// Saved Items Query
export const useSavedItems = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.savedItems(user?.id || ''),
    queryFn: async (): Promise<SavedItem[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_items')
        .select(`
          *,
          posts!saved_items_post_id_fkey (
            id,
            caption,
            category,
            image_url,
            created_at,
            profiles!posts_user_id_fkey (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 3 * 60 * 1000,
  });
};

// Mutations
export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, { postId }) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: queryKeys.posts });
      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { postId }) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: queryKeys.postComments(postId) });
      // Also invalidate the post to update comment count
      queryClient.invalidateQueries({ queryKey: queryKeys.post(postId) });
    },
  });
};

export const useSaveItem = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ postId, type }: { postId?: string; type: 'post' | 'quote' | 'verse'; content?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('saved_items')
        .insert({
          user_id: user.id,
          post_id,
          type,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate saved items
      queryClient.invalidateQueries({ queryKey: queryKeys.savedItems(user?.id || '') });
    },
  });
};
