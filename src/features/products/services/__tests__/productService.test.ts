import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductService } from '../productService';
import { mockProducts } from '../../../../test/mocks/supabase';

// Mock do fetch global
global.fetch = vi.fn();

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    vi.clearAllMocks();
    productService = new ProductService();
  });

  describe('getProducts', () => {
    it('deve retornar produtos mockados com sucesso', async () => {
      const result = await productService.getProducts();

      expect(result).toEqual(mockProducts);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('deve retornar produtos filtrados por categoria', async () => {
      const filters = { category: 'Roupas' };
      const result = await productService.getProducts(filters);

      expect(result).toEqual(
        mockProducts.filter(p => p.category === 'Roupas')
      );
    });

    it('deve retornar produtos filtrados por preÃ§o mÃ­nimo', async () => {
      const filters = { minPrice: 150 };
      const result = await productService.getProducts(filters);

      expect(result).toEqual(
        mockProducts.filter(p => p.price >= 150)
      );
    });

    it('deve retornar produtos filtrados por preÃ§o mÃ¡ximo', async () => {
      const filters = { maxPrice: 180 };
      const result = await productService.getProducts(filters);

      expect(result).toEqual(
        mockProducts.filter(p => p.price <= 180)
      );
    });

    it('deve retornar produtos com mÃºltiplos filtros', async () => {
      const filters = { 
        category: 'Bikinis', 
        minPrice: 100, 
        maxPrice: 200 
      };
      const result = await productService.getProducts(filters);

      expect(result).toEqual(
        mockProducts.filter(p => 
          p.category === 'Bikinis' && 
          p.price >= 100 && 
          p.price <= 200
        )
      );
    });

    it('deve retornar array vazio quando nÃ£o hÃ¡ produtos que atendem aos filtros', async () => {
      const filters = { category: 'CategoriaInexistente' };
      const result = await productService.getProducts(filters);

      expect(result).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('deve retornar produto por ID', async () => {
      const productId = '1';
      const result = await productService.getProductById(productId);

      expect(result).toEqual(mockProducts.find(p => p.id === productId));
    });

    it('deve retornar null quando produto nÃ£o existe', async () => {
      const productId = '999';
      const result = await productService.getProductById(productId);

      expect(result).toBeNull();
    });
  });

  describe('validaÃ§Ã£o de dados', () => {
    it('deve validar dados de produto corretamente', () => {
      const validProduct = mockProducts[0];
      const result = productService.validateProductData(validProduct);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validProduct);
      }
    });

    it('deve rejeitar produto com dados invÃ¡lidos', () => {
      const invalidProduct = {
        id: '',
        name: '',
        price: -10,
        image: '',
        category: '',
        stock: -5
      };
      const result = productService.validateProductData(invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
