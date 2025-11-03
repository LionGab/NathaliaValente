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
      error: null,
    }),
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null,
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  },
};

// Mock de produtos para testes
export const mockProducts = [
  {
    id: '1',
    name: 'Bikini Premium Nathália',
    price: 165.0,
    image: 'https://i.imgur.com/L2xyl98.jpg',
    category: 'roupas',
    stock: 30,
    description: 'Bikini premium com design exclusivo da Nathália Valente',
    rating: 4.9,
    reviews: 85,
  },
  {
    id: '2',
    name: 'Conjunto Bikini Nathy',
    price: 165.0,
    image: 'https://i.imgur.com/n2QJJ5y.jpg',
    category: 'roupas',
    stock: 25,
    description: 'Conjunto completo da coleção NAVA',
    rating: 4.8,
    reviews: 120,
  },
  {
    id: '3',
    name: 'Kit Básico NAVA',
    price: 199.9,
    image: 'https://i.imgur.com/TjCevtA.jpg',
    category: 'roupas',
    stock: 50,
    description: 'Kit completo com peças essenciais',
    rating: 4.7,
    reviews: 65,
  },
  {
    id: '4',
    name: 'Produto OLLIN',
    price: 89.9,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
    category: 'cuidados',
    stock: 100,
    description: 'Cuidados especiais para mães',
    rating: 4.6,
    reviews: 200,
  },
];

// Mock de resposta do Supabase para produtos
export const mockSupabaseResponse = {
  data: mockProducts,
  error: null,
};

// Mock de erro do Supabase
export const mockSupabaseError = {
  data: null,
  error: {
    message: 'Erro de conexão',
    code: 'CONNECTION_ERROR',
  },
};

// Helper para criar mock de query com dados específicos
export const createMockQuery = (data: any, error: any = null) => {
  return {
    data,
    error,
    then: vi.fn().mockResolvedValue({ data, error }),
  };
};

// Mock do React Query
export const mockQueryClient = {
  invalidateQueries: vi.fn(),
  setQueryData: vi.fn(),
  getQueryData: vi.fn(),
  refetchQueries: vi.fn(),
};
