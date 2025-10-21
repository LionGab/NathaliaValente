import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { usePosts, usePost, usePostComments, useCurrentProfile } from '../useQueries';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            limit: vi.fn(),
          })),
        })),
        order: vi.fn(() => ({
          limit: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    profile: { id: 'test-user-id', full_name: 'Test User' },
  }),
}));

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('usePosts', () => {
    it('should fetch posts successfully', async () => {
      const mockPosts = [
        {
          id: '1',
          user_id: 'user1',
          caption: 'Test post',
          category: 'Look do dia',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          profiles: {
            id: 'user1',
            full_name: 'Test User',
            avatar_url: null,
          },
          post_likes: [],
        },
      ];

      const mockQuery = {
        data: mockPosts,
        error: null,
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockQuery),
          }),
        }),
      } as any);

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([
        {
          ...mockPosts[0],
          likes_count: 0,
          user_has_liked: false,
        },
      ]);
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Failed to fetch posts');

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      } as any);

      const { result } = renderHook(() => usePosts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('usePost', () => {
    it('should fetch single post successfully', async () => {
      const mockPost = {
        id: '1',
        user_id: 'user1',
        caption: 'Test post',
        category: 'Look do dia',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        profiles: {
          id: 'user1',
          full_name: 'Test User',
          avatar_url: null,
        },
        post_likes: [],
      };

      const mockQuery = {
        data: mockPost,
        error: null,
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockQuery),
          }),
        }),
      } as any);

      const { result } = renderHook(() => usePost('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        ...mockPost,
        likes_count: 0,
        user_has_liked: false,
      });
    });

    it('should not fetch when postId is empty', () => {
      const { result } = renderHook(() => usePost(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('usePostComments', () => {
    it('should fetch comments successfully', async () => {
      const mockComments = [
        {
          id: '1',
          post_id: '1',
          user_id: 'user1',
          content: 'Great post!',
          created_at: '2023-01-01T00:00:00Z',
          profiles: {
            id: 'user1',
            full_name: 'Test User',
            avatar_url: null,
          },
        },
      ];

      const mockQuery = {
        data: mockComments,
        error: null,
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue(mockQuery),
          }),
        }),
      } as any);

      const { result } = renderHook(() => usePostComments('1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockComments);
    });
  });

  describe('useCurrentProfile', () => {
    it('should fetch current user profile successfully', async () => {
      const mockProfile = {
        id: 'test-user-id',
        full_name: 'Test User',
        avatar_url: null,
        bio: 'Test bio',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        onboarding_completed: true,
      };

      const mockQuery = {
        data: mockProfile,
        error: null,
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue(mockQuery),
          }),
        }),
      } as any);

      const { result } = renderHook(() => useCurrentProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProfile);
    });
  });
});
