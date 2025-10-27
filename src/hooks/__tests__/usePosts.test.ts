import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '../usePosts';
import { supabase } from '../../lib/supabase';

// Mock do Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    rpc: vi.fn(),
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            eq: vi.fn(),
          })),
          eq: vi.fn(),
        })),
        eq: vi.fn(),
      })),
    })),
  },
}));

// Mock data para testes
const mockPosts = [
  {
    id: '1',
    content: 'Test post 1',
    user_id: 'user1',
    created_at: '2024-01-01T00:00:00Z',
    profiles: {
      full_name: 'Test User 1',
      avatar_url: 'https://example.com/avatar1.jpg',
    },
    likes: [{ count: 5 }],
    comments: [{ count: 2 }],
  },
  {
    id: '2',
    content: 'Test post 2',
    user_id: 'user2',
    created_at: '2024-01-02T00:00:00Z',
    profiles: {
      full_name: 'Test User 2',
      avatar_url: 'https://example.com/avatar2.jpg',
    },
    likes: [{ count: 10 }],
    comments: [{ count: 3 }],
  },
];

const mockUser = {
  id: 'current-user',
  email: 'test@example.com',
};

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Happy Path - Carrega posts com paginaÃ§Ã£o', () => {
    it('deve carregar posts do feed com sucesso', async () => {
      // Mock do usuÃ¡rio autenticado
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock do RPC para feed
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      const { result } = renderHook(() => usePosts({ limit: 20 }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
      expect(supabase.rpc).toHaveBeenCalledWith('get_posts_with_user_likes', {
        p_user_id: 'current-user',
        p_limit: 20,
        p_offset: 0,
      });
    });

    it('deve carregar posts por categoria', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      const { result } = renderHook(() => usePosts({ category: 'Maternidade' }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(supabase.rpc).toHaveBeenCalledWith('get_posts_by_category', {
        p_category: 'Maternidade',
        p_user_id: 'current-user',
        p_limit: 20,
      });
    });

    it('deve carregar posts de usuÃ¡rio especÃ­fico', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      const { result } = renderHook(() => usePosts({ userId: 'user123' }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(supabase.rpc).toHaveBeenCalledWith('get_user_posts_with_stats', {
        p_user_id: 'user123',
        p_current_user_id: 'current-user',
      });
    });
  });

  describe('Error Path - Trata erro de rede', () => {
    it('deve tratar erro de RPC e usar fallback', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock de erro no RPC
      vi.mocked(supabase.rpc).mockRejectedValue(new Error('RPC function not found'));

      // Mock do fallback query - configurar corretamente
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      // Mock da resposta do fallback
      mockQuery.select.mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
      expect(mockQuery.select).toHaveBeenCalled();
    });

    it('deve tratar erro de rede e definir posts vazios', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock de erro em ambos RPC e fallback
      vi.mocked(supabase.rpc).mockRejectedValue(new Error('Network error'));
      
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);
      mockQuery.select.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  describe('Edge Cases - Posts vazios', () => {
    it('deve retornar array vazio quando nÃ£o hÃ¡ posts', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: [],
        error: null,
      });

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('deve retornar array vazio quando data Ã© null', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: null,
      });

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('RPC Fallback - Simular falha de RPC', () => {
    it('deve usar fallback quando RPC falha com erro especÃ­fico', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock de erro especÃ­fico do RPC
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: 'function get_posts_with_user_likes() does not exist' },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      mockQuery.select.mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.posts).toEqual(mockPosts);
      expect(supabase.from).toHaveBeenCalledWith('posts');
    });

    it('deve usar fallback com filtros corretos para categoria', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockRejectedValue(new Error('RPC failed'));

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      mockQuery.select.mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => usePosts({ category: 'Gravidez' }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockQuery.eq).toHaveBeenCalledWith('category', 'Gravidez');
    });

    it('deve usar fallback com filtros corretos para userId', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockRejectedValue(new Error('RPC failed'));

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      mockQuery.select.mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const { result } = renderHook(() => usePosts({ userId: 'user123' }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user123');
    });
  });

  describe('ConfiguraÃ§Ãµes e OpÃ§Ãµes', () => {
    it('deve respeitar o limite de posts', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      renderHook(() => usePosts({ limit: 10 }));

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith(
          'get_posts_with_user_likes',
          expect.objectContaining({
            p_limit: 10,
          })
        );
      });
    });

    it('nÃ£o deve carregar posts quando enabled Ã© false', async () => {
      const { result } = renderHook(() => usePosts({ enabled: false }));

      // Aguardar um pouco para garantir que nÃ£o hÃ¡ chamadas
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual([]);
      expect(supabase.rpc).not.toHaveBeenCalled();
    });

    it('deve chamar refetch corretamente', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockPosts,
        error: null,
      });

      const { result } = renderHook(() => usePosts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Limpar mocks
      vi.clearAllMocks();

      // Chamar refetch
      await result.current.refetch();

      expect(supabase.rpc).toHaveBeenCalled();
    });
  });
});
