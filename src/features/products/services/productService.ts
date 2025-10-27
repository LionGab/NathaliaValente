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

      // Simular chamada para API
      const response = await this.makeRequest('GET', '', validatedFilters);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Validar cada produto retornado
      const validatedProducts: Product[] = [];
      for (const product of data.products || []) {
        const result = safeValidate(validateProduct, product);
        if (result.success) {
          validatedProducts.push(result.data);
        } else {
          console.warn('Produto inválido ignorado:', product.id, result.errors);
        }
      }

      return validatedProducts;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
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