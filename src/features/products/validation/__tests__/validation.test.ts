import { describe, it, expect } from 'vitest';
import { 
  validateProduct, 
  validateCreateProduct, 
  validateUpdateProduct,
  validateProductFilters,
  safeValidate 
} from '../validation';
import { mockProducts } from '../../../../test/mocks/supabase';

describe('Product Validation', () => {
  describe('validateProduct', () => {
    it('deve validar produto com dados corretos', () => {
      const validProduct = mockProducts[0];
      const result = validateProduct.safeParse(validProduct);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validProduct);
      }
    });

    it('deve rejeitar produto sem ID', () => {
      const invalidProduct = { ...mockProducts[0], id: '' };
      const result = validateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });

    it('deve rejeitar produto com preÃ§o negativo', () => {
      const invalidProduct = { ...mockProducts[0], price: -10 };
      const result = validateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });

    it('deve rejeitar produto com estoque negativo', () => {
      const invalidProduct = { ...mockProducts[0], stock: -5 };
      const result = validateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });

    it('deve rejeitar produto com rating fora do range 0-5', () => {
      const invalidProduct = { ...mockProducts[0], rating: 6 };
      const result = validateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });

    it('deve rejeitar produto com reviews negativo', () => {
      const invalidProduct = { ...mockProducts[0], reviews: -1 };
      const result = validateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });
  });

  describe('validateCreateProduct', () => {
    it('deve validar criaÃ§Ã£o de produto com dados corretos', () => {
      const validCreateProduct = {
        name: 'Novo Produto',
        price: 99.99,
        image: 'https://example.com/image.jpg',
        category: 'Roupas',
        stock: 10,
        description: 'DescriÃ§Ã£o do produto'
      };
      const result = validateCreateProduct.safeParse(validCreateProduct);

      expect(result.success).toBe(true);
    });

    it('deve rejeitar criaÃ§Ã£o sem nome', () => {
      const invalidProduct = {
        price: 99.99,
        image: 'https://example.com/image.jpg',
        category: 'Roupas',
        stock: 10
      };
      const result = validateCreateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });

    it('deve rejeitar criaÃ§Ã£o com preÃ§o invÃ¡lido', () => {
      const invalidProduct = {
        name: 'Produto',
        price: 'invalid',
        image: 'https://example.com/image.jpg',
        category: 'Roupas',
        stock: 10
      };
      const result = validateCreateProduct.safeParse(invalidProduct);

      expect(result.success).toBe(false);
    });
  });

  describe('validateUpdateProduct', () => {
    it('deve validar atualizaÃ§Ã£o de produto com dados corretos', () => {
      const validUpdate = {
        id: '1',
        name: 'Produto Atualizado',
        price: 149.99
      };
      const result = validateUpdateProduct.safeParse(validUpdate);

      expect(result.success).toBe(true);
    });

    it('deve rejeitar atualizaÃ§Ã£o sem ID', () => {
      const invalidUpdate = {
        name: 'Produto Atualizado'
      };
      const result = validateUpdateProduct.safeParse(invalidUpdate);

      expect(result.success).toBe(false);
    });
  });

  describe('validateProductFilters', () => {
    it('deve validar filtros corretos', () => {
      const validFilters = {
        category: 'Roupas',
        minPrice: 100,
        maxPrice: 200
      };
      const result = validateProductFilters.safeParse(validFilters);

      expect(result.success).toBe(true);
    });

    it('deve rejeitar filtros com preÃ§o mÃ­nimo maior que mÃ¡ximo', () => {
      const invalidFilters = {
        minPrice: 200,
        maxPrice: 100
      };
      const result = validateProductFilters.safeParse(invalidFilters);

      expect(result.success).toBe(false);
    });

    it('deve rejeitar filtros com preÃ§os negativos', () => {
      const invalidFilters = {
        minPrice: -10,
        maxPrice: -5
      };
      const result = validateProductFilters.safeParse(invalidFilters);

      expect(result.success).toBe(false);
    });
  });

  describe('safeValidate', () => {
    it('deve retornar sucesso para dados vÃ¡lidos', () => {
      const validProduct = mockProducts[0];
      const result = safeValidate(validateProduct, validProduct);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validProduct);
      }
    });

    it('deve retornar erro para dados invÃ¡lidos', () => {
      const invalidProduct = { ...mockProducts[0], price: -10 };
      const result = safeValidate(validateProduct, invalidProduct);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
