import {
  validateProduct,
  validateCreateProduct,
  validateUpdateProduct,
  validateProductFilters,
  safeValidate,
  type Product,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductFilters
} from '../validation';

/**
 * Serviço de produtos com validação Zod integrada
 * Garante que todos os dados sejam validados antes de serem processados
 */
export class ProductService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = '/api/products', apiKey: string = '') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Busca produtos com filtros
   * Valida os filtros de entrada e os produtos retornados
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      // Validar filtros se fornecidos
      let validatedFilters: ProductFilters | undefined;
      if (filters) {
        const filterResult = safeValidate(validateProductFilters, filters);
        if (!filterResult.success) {
          throw new Error(`Filtros inválidos: ${filterResult.errors.join(', ')}`);
        }
        validatedFilters = filterResult.data;
      }

      // Retornar dados mockados para desenvolvimento
      const mockProducts: Product[] = [
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
          stock: 30,
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
        },
        {
          id: '4',
          name: 'Produto OLLIN',
          price: 89.90,
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
          category: 'Cuidados',
          stock: 100,
          description: 'Cuidados especiais para mães',
          rating: 4.6,
          reviews: 200
        }
      ];

      // Aplicar filtros se fornecidos
      let filteredProducts = mockProducts;
      if (validatedFilters) {
        if (validatedFilters.category) {
          filteredProducts = filteredProducts.filter(p => p.category === validatedFilters!.category);
        }
        if (validatedFilters.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price >= validatedFilters!.minPrice!);
        }
        if (validatedFilters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.price <= validatedFilters!.maxPrice!);
        }
      }

      return filteredProducts;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Retornar array vazio em caso de erro
      return [];
    }
  }

  /**
   * Busca produto por ID
   * Valida o produto retornado
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      if (!id) {
        throw new Error('ID do produto é obrigatório');
      }

      const response = await this.makeRequest('GET', `/${id}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const product = await response.json();

      // Validar produto antes de retornar
      const result = safeValidate(validateProduct, product);
      if (!result.success) {
        throw new Error(`Produto inválido: ${result.errors.join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  }

  /**
   * Cria novo produto
   * Valida os dados de entrada antes de enviar
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    try {
      // Validar dados de entrada
      const validatedData = validateCreateProduct(data);

      const response = await this.makeRequest('POST', '', validatedData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar produto: ${errorData.message || response.statusText}`);
      }

      const product = await response.json();

      // Validar produto criado
      const result = safeValidate(validateProduct, product);
      if (!result.success) {
        throw new Error(`Produto criado é inválido: ${result.errors.join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  /**
   * Atualiza produto existente
   * Valida os dados de entrada antes de enviar
   */
  async updateProduct(data: UpdateProductInput): Promise<Product> {
    try {
      // Validar dados de entrada
      const validatedData = validateUpdateProduct(data);

      if (!validatedData.id) {
        throw new Error('ID do produto é obrigatório para atualização');
      }

      const response = await this.makeRequest('PUT', `/${validatedData.id}`, validatedData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao atualizar produto: ${errorData.message || response.statusText}`);
      }

      const product = await response.json();

      // Validar produto atualizado
      const result = safeValidate(validateProduct, product);
      if (!result.success) {
        throw new Error(`Produto atualizado é inválido: ${result.errors.join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  /**
   * Deleta produto
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID do produto é obrigatório');
      }

      const response = await this.makeRequest('DELETE', `/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao deletar produto: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  /**
   * Valida dados de produto sem enviar para API
   * Útil para validação em tempo real em formulários
   */
  validateProductData(data: unknown): { success: true; data: Product } | { success: false; errors: string[] } {
    return safeValidate(validateProduct, data);
  }

  /**
   * Valida dados de criação de produto
   */
  validateCreateProductData(data: unknown): { success: true; data: CreateProductInput } | { success: false; errors: string[] } {
    return safeValidate(validateCreateProduct, data);
  }

  /**
   * Valida dados de atualização de produto
   */
  validateUpdateProductData(data: unknown): { success: true; data: UpdateProductInput } | { success: false; errors: string[] } {
    return safeValidate(validateUpdateProduct, data);
  }

  /**
   * Valida filtros de busca
   */
  validateFilters(filters: unknown): { success: true; data: ProductFilters } | { success: false; errors: string[] } {
    return safeValidate(validateProductFilters, filters);
  }

  /**
   * Faz requisição HTTP para a API
   */
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options);
  }
}

// Instância padrão do serviço
export const productService = new ProductService();

// Funções utilitárias para validação rápida
export const validateProductQuick = (data: unknown) => productService.validateProductData(data);
export const validateCreateProductQuick = (data: unknown) => productService.validateCreateProductData(data);
export const validateUpdateProductQuick = (data: unknown) => productService.validateUpdateProductData(data);
export const validateFiltersQuick = (data: unknown) => productService.validateFilters(data);