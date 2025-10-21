import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePosts } from '../usePosts';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    rpc: vi.fn(),
  },
}));

describe('usePosts', () => {
  const mockUser = { id: 'user-123' };
  const mockPosts = [
    {
      id: 'post-1',
      user_id: 'user-123',
      caption: 'Test post 1',
      category: 'Fé',
      created_at: new Date().toISOString(),
      full_name: 'Test User',
      likes_count: 5,
      comments_count: 2,
      user_has_liked: false,
    },
    {
      id: 'post-2',
      user_id: 'user-456',
      caption: 'Test post 2',
      category: 'Desabafo',
      created_at: new Date().toISOString(),
      full_name: 'Another User',
      likes_count: 10,
      comments_count: 5,
      user_has_liked: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    (supabase.auth.getUser as any).mockResolvedValue({ data: { user: mockUser } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch posts successfully', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: mockPosts, error: null });

    const { result } = renderHook(() => usePosts());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.posts).toEqual([]);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts).toEqual(mockPosts);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Failed to fetch posts');
    (supabase.rpc as any).mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should use optimized feed query by default', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: mockPosts, error: null });

    renderHook(() => usePosts());

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith('get_optimized_feed', expect.any(Object));
    });
  });

  it('should fallback to old function if optimized one fails', async () => {
    // First call fails (new function doesn't exist)
    (supabase.rpc as any)
      .mockResolvedValueOnce({ data: null, error: new Error('Function not found') })
      // Second call succeeds (fallback)
      .mockResolvedValueOnce({ data: mockPosts, error: null });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts).toEqual(mockPosts);
    expect(supabase.rpc).toHaveBeenCalledTimes(2);
    expect(supabase.rpc).toHaveBeenNthCalledWith(1, 'get_optimized_feed', expect.any(Object));
    expect(supabase.rpc).toHaveBeenNthCalledWith(2, 'get_posts_with_user_likes', expect.any(Object));
  });

  it('should filter by category when provided', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: mockPosts, error: null });

    renderHook(() => usePosts({ category: 'Fé' }));

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith(
        'get_posts_by_category',
        expect.objectContaining({ p_category: 'Fé' })
      );
    });
  });

  it('should filter by userId when provided', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: mockPosts, error: null });

    renderHook(() => usePosts({ userId: 'user-123' }));

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith(
        'get_user_posts_with_stats',
        expect.objectContaining({ p_user_id: 'user-123' })
      );
    });
  });

  it('should respect limit option', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: mockPosts, error: null });

    renderHook(() => usePosts({ limit: 10 }));

    await waitFor(() => {
      expect(supabase.rpc).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ p_limit: 10 })
      );
    });
  });

  it('should not fetch when enabled is false', async () => {
    renderHook(() => usePosts({ enabled: false }));

    // Wait a bit to ensure no call is made
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('should refetch when refetch is called', async () => {
    (supabase.rpc as any).mockResolvedValue({ data: mockPosts, error: null });

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCallCount = (supabase.rpc as any).mock.calls.length;

    // Call refetch
    await result.current.refetch();

    expect((supabase.rpc as any).mock.calls.length).toBeGreaterThan(initialCallCount);
  });
});
