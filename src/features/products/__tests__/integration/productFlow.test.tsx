import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from '../../components/ProductList';
import { ProductFilters } from '../../components/ProductFilters';
import { CartProvider } from '../../../../contexts/CartContext';
import { mockProducts } from '../../../../test/mocks/supabase';

// Mock do productService
vi.mock('../../services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
  },
}));

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
    </QueryClientProvider>
  );
};

describe('Product Integration Tests', () => {
  const { productService } = require('../../services/productService');

  beforeEach(() => {
    vi.clearAllMocks();
    productService.getProducts.mockResolvedValue(mockProducts);
  });

  describe('Fluxo: Listar â†’ Filtrar â†’ Adicionar ao Carrinho', () => {
    it('deve listar produtos, filtrar por categoria e adicionar ao carrinho', async () => {
      render(
        <div>
          <ProductFilters />
          <ProductList />
        </div>,
        { wrapper: createTestWrapper() }
      );

      // Aguardar produtos carregarem
      await waitFor(() => {
        expect(screen.getByText('Kit BÃ¡sico NAVA')).toBeInTheDocument();
      });

      // Aplicar filtro por categoria
      const categoryFilter = screen.getByLabelText(/categoria/i);
      fireEvent.change(categoryFilter, { target: { value: 'Roupas' } });

      // Aguardar filtro ser aplicado
      await waitFor(() => {
        expect(screen.getByText('Kit BÃ¡sico NAVA')).toBeInTheDocument();
        expect(screen.queryByText('Bikini Premium NathÃ¡lia')).not.toBeInTheDocument();
      });

      // Adicionar produto ao carrinho
      const addButton = screen.getByText(/adicionar/i);
      fireEvent.click(addButton);

      // Verificar se produto foi adicionado (atravÃ©s de mudanÃ§a no botÃ£o)
      await waitFor(() => {
        expect(screen.getByText(/remover/i)).toBeInTheDocument();
      });
    });

    it('deve filtrar por preÃ§o e mostrar produtos corretos', async () => {
      render(
        <div>
          <ProductFilters />
          <ProductList />
        </div>,
        { wrapper: createTestWrapper() }
      );

      // Aguardar produtos carregarem
      await waitFor(() => {
        expect(screen.getByText('Kit BÃ¡sico NAVA')).toBeInTheDocument();
      });

      // Aplicar filtro de preÃ§o mÃ­nimo
      const minPriceFilter = screen.getByLabelText(/preÃ§o mÃ­nimo/i);
      fireEvent.change(minPriceFilter, { target: { value: '150' } });

      // Aguardar filtro ser aplicado
      await waitFor(() => {
        expect(screen.getByText('Kit BÃ¡sico NAVA')).toBeInTheDocument();
        expect(screen.getByText('Bikini Premium NathÃ¡lia')).toBeInTheDocument();
        expect(screen.queryByText('Conjunto Nathy')).not.toBeInTheDocument();
      });
    });

    it('deve mostrar mensagem quando nÃ£o hÃ¡ produtos apÃ³s filtro', async () => {
      productService.getProducts.mockResolvedValue([]);

      render(
        <div>
          <ProductFilters />
          <ProductList />
        </div>,
        { wrapper: createTestWrapper() }
      );

      // Aplicar filtro que nÃ£o retorna resultados
      const categoryFilter = screen.getByLabelText(/categoria/i);
      fireEvent.change(categoryFilter, { target: { value: 'CategoriaInexistente' } });

      // Aguardar mensagem de "nenhum produto encontrado"
      await waitFor(() => {
        expect(screen.getByText(/nenhum produto encontrado/i)).toBeInTheDocument();
      });
    });

    it('deve mostrar loading durante carregamento', () => {
      productService.getProducts.mockImplementation(() => new Promise(() => {}));

      render(<ProductList />, { wrapper: createTestWrapper() });

      expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it('deve mostrar erro quando falha ao carregar produtos', async () => {
      productService.getProducts.mockRejectedValue(new Error('Erro de conexÃ£o'));

      render(<ProductList />, { wrapper: createTestWrapper() });

      await waitFor(() => {
        expect(screen.getByText(/erro ao carregar produtos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Fluxo de Carrinho', () => {
    it('deve adicionar e remover produto do carrinho', async () => {
      render(<ProductList />, { wrapper: createTestWrapper() });

      // Aguardar produtos carregarem
      await waitFor(() => {
        expect(screen.getByText('Kit BÃ¡sico NAVA')).toBeInTheDocument();
      });

      // Adicionar produto
      const addButton = screen.getByText(/adicionar/i);
      fireEvent.click(addButton);

      // Verificar mudanÃ§a para botÃ£o de remover
      await waitFor(() => {
        expect(screen.getByText(/remover/i)).toBeInTheDocument();
      });

      // Remover produto
      const removeButton = screen.getByText(/remover/i);
      fireEvent.click(removeButton);

      // Verificar mudanÃ§a de volta para botÃ£o de adicionar
      await waitFor(() => {
        expect(screen.getByText(/adicionar/i)).toBeInTheDocument();
      });
    });
  });
});
