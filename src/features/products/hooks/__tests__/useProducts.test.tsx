import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../useProducts';
import {
  mockProducts,
  mockSupabaseResponse,
  mockSupabaseError,
} from '../../../../test/mocks/supabase';

// Mock do productService
vi.mock('../../services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  const { productService } = require('../../services/productService');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar produtos com sucesso', async () => {
    productService.getProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProducts);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve retornar erro quando falha ao buscar produtos', async () => {
    const error = new Error('Erro ao buscar produtos');
    productService.getProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('deve mostrar loading inicial', () => {
    productService.getProducts.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('deve chamar productService.getProducts com filtros corretos', async () => {
    const filters = { category: 'Roupas', minPrice: 100 };
    productService.getProducts.mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(productService.getProducts).toHaveBeenCalledWith(filters);
  });

  it('deve retornar dados vazios quando nÃ£o hÃ¡ produtos', async () => {
    productService.getProducts.mockResolvedValue([]);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });
});
