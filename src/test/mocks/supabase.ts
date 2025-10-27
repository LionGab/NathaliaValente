import { vi } from 'vitest';

// Mock do Supabase client
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue({
      data: [],
      error: null
    })
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  }
};

// Mock de produtos para testes
export const mockProducts = [
  {
    id: '1',
    name: 'Kit Básico NAVA',
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    category: 'Roupas',
    stock: 50,
    description: 'Kit completo com peças essenciais',
    rating: 4.8,
    reviews: 120
  },
  {
    id: '2',
    name: 'Bikini Premium Nathália',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    category: 'Bikinis',
    stock: 0, // Esgotado para teste
    description: 'Bikini de alta qualidade',
    rating: 4.9,
    reviews: 85
  },
  {
    id: '3',
    name: 'Conjunto Nathy',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    category: 'Conjuntos',
    stock: 25,
    description: 'Conjunto completo da coleção',
    rating: 4.7,
    reviews: 65
  }
];

// Mock de resposta do Supabase para produtos
export const mockSupabaseResponse = {
  data: mockProducts,
  error: null
};

// Mock de erro do Supabase
export const mockSupabaseError = {
  data: null,
  error: {
    message: 'Erro de conexão',
    code: 'CONNECTION_ERROR'
  }
};

// Helper para criar mock de query com dados específicos
export const createMockQuery = (data: any, error: any = null) => {
  return {
    data,
    error,
    then: vi.fn().mockResolvedValue({ data, error })
  };
};

// Mock do React Query
export const mockQueryClient = {
  invalidateQueries: vi.fn(),
  setQueryData: vi.fn(),
  getQueryData: vi.fn(),
  refetchQueries: vi.fn()
};