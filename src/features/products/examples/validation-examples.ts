/**
 * EXEMPLOS DE VALIDAÇÃO ZOD PARA PRODUTOS - CLUBNATH VIP
 * 
 * Este arquivo contém exemplos práticos de uso dos schemas de validação
 * para demonstrar como aplicar a validação em diferentes cenários.
 */

import { 
  validateProduct,
  validateCreateProduct,
  validateUpdateProduct,
  validateProductFilters,
  safeValidate,
  productSchema,
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  type Product,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductFilters
} from '../validation';

// ============================================================================
// EXEMPLO 1: PRODUTO VÁLIDO
// ============================================================================

export const exemploProdutoValido: Product = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Bikini Premium Nathália',
  price: 89.90,
  originalPrice: 119.90,
  category: 'roupas',
  subcategory: 'bikinis',
  description: 'Bikini confortável e elegante para o verão, com design exclusivo da Nathália Valente',
  shortDescription: 'Bikini premium com design exclusivo',
  status: 'ativo',
  isActive: true,
  isFeatured: true,
  isNew: true,
  isOnSale: true,
  currentStock: 15,
  reservedStock: 2,
  lowStockThreshold: 5,
  allowBackorder: false,
  maxQuantityPerOrder: 3,
  averageRating: 4.8,
  totalReviews: 124,
  ratingDistribution: {
    five: 98,
    four: 20,
    three: 4,
    two: 1,
    one: 1
  },
  ageRange: 'todas',
  safetyCertifications: ['INMETRO', 'CE'],
  material: 'Poliamida 80% / Elastano 20%',
  careInstructions: 'Lavar à mão com água fria. Não usar alvejante.',
  isWashable: true,
  isHypoallergenic: true,
  isBpaFree: true,
  weight: 150,
  freeShipping: true,
  shippingClass: 'standard',
  estimatedDelivery: 3,
  length: 25.5,
  width: 20.0,
  height: 2.0,
  sku: 'BIKINI-PREM-001',
  barcode: '1234567890123',
  tags: ['bikini', 'verão', 'praia', 'conforto', 'premium'],
  image: 'https://example.com/bikini-premium.jpg',
  images: [
    'https://example.com/bikini-premium-1.jpg',
    'https://example.com/bikini-premium-2.jpg',
    'https://example.com/bikini-premium-3.jpg'
  ],
  seoTitle: 'Bikini Premium Nathália - Design Exclusivo',
  seoDescription: 'Bikini confortável e elegante com design exclusivo da Nathália Valente. Perfeito para o verão!',
  seoKeywords: ['bikini', 'verão', 'praia', 'nathália valente', 'premium'],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-20T14:45:00Z'
};

// Validação do produto válido
export const validarProdutoValido = () => {
  try {
    const produtoValidado = validateProduct(exemploProdutoValido);
    console.log('✅ Produto válido:', produtoValidado);
    return { success: true, data: produtoValidado };
  } catch (error: any) {
    console.error('❌ Erro na validação:', error.errors);
    return { success: false, errors: error.errors };
  }
};

// ============================================================================
// EXEMPLO 2: PRODUTO INVÁLIDO (MÚLTIPLOS ERROS)
// ============================================================================

export const exemploProdutoInvalido = {
  id: 'id-invalido', // ❌ Não é UUID
  name: '', // ❌ Nome vazio
  price: -50, // ❌ Preço negativo
  originalPrice: 'abc', // ❌ Preço não numérico
  category: 'categoria_inexistente', // ❌ Categoria inválida
  subcategory: 'A'.repeat(51), // ❌ Subcategoria muito longa
  description: 'A'.repeat(1001), // ❌ Descrição muito longa
  currentStock: -5, // ❌ Estoque negativo
  averageRating: 6.5, // ❌ Avaliação maior que 5
  totalReviews: -10, // ❌ Reviews negativo
  weight: 60000, // ❌ Peso muito alto
  sku: 'sku com espaços', // ❌ SKU com caracteres inválidos
  barcode: '123', // ❌ Código de barras muito curto
  tags: ['A'.repeat(31)], // ❌ Tag muito longa
  image: 'url-invalida', // ❌ URL inválida
  ageRange: 'idade_invalida', // ❌ Faixa etária inválida
  shippingClass: 'invalid_class', // ❌ Classe de envio inválida
  estimatedDelivery: 0, // ❌ Prazo de entrega inválido
  length: -10, // ❌ Dimensão negativa
  createdAt: 'data-invalida', // ❌ Data inválida
  seoTitle: 'A'.repeat(61), // ❌ Título SEO muito longo
  seoDescription: 'A'.repeat(161) // ❌ Descrição SEO muito longa
};

// Validação do produto inválido
export const validarProdutoInvalido = () => {
  const result = safeValidate(productSchema, exemploProdutoInvalido);
  
  if (!result.success) {
    console.log('❌ Produto inválido - Erros encontrados:');
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  return result;
};

// ============================================================================
// EXEMPLO 3: CRIAÇÃO DE PRODUTO
// ============================================================================

export const exemploCriacaoProduto: CreateProductInput = {
  name: 'Conjunto Bikini Nathy',
  price: 129.90,
  originalPrice: 159.90,
  category: 'roupas',
  subcategory: 'conjuntos',
  description: 'Conjunto completo de bikini com top e calcinha, ideal para o verão',
  shortDescription: 'Conjunto completo premium',
  status: 'ativo',
  isActive: true,
  isFeatured: false,
  isNew: false,
  isOnSale: true,
  currentStock: 8,
  reservedStock: 1,
  lowStockThreshold: 3,
  allowBackorder: true,
  maxQuantityPerOrder: 2,
  averageRating: 4.6,
  totalReviews: 89,
  ageRange: 'todas',
  material: 'Poliamida 85% / Elastano 15%',
  careInstructions: 'Lavar à mão com água fria. Secar à sombra.',
  isWashable: true,
  isHypoallergenic: false,
  isBpaFree: true,
  weight: 200,
  freeShipping: false,
  shippingClass: 'express',
  estimatedDelivery: 2,
  length: 30.0,
  width: 25.0,
  height: 3.0,
  sku: 'CONJ-BIKINI-002',
  barcode: '9876543210987',
  tags: ['conjunto', 'bikini', 'verão', 'promoção'],
  image: 'https://example.com/conjunto-bikini.jpg',
  seoTitle: 'Conjunto Bikini Nathy - Promoção',
  seoDescription: 'Conjunto completo de bikini com desconto especial. Aproveite!',
  seoKeywords: ['conjunto', 'bikini', 'promoção', 'verão']
};

// Validação da criação de produto
export const validarCriacaoProduto = () => {
  try {
    const produtoCriado = validateCreateProduct(exemploCriacaoProduto);
    console.log('✅ Produto para criação válido:', produtoCriado);
    return { success: true, data: produtoCriado };
  } catch (error: any) {
    console.error('❌ Erro na validação de criação:', error.errors);
    return { success: false, errors: error.errors };
  }
};

// ============================================================================
// EXEMPLO 4: ATUALIZAÇÃO DE PRODUTO
// ============================================================================

export const exemploAtualizacaoProduto: UpdateProductInput = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  price: 79.90, // Preço reduzido
  isOnSale: true, // Agora está em promoção
  currentStock: 12, // Estoque atualizado
  description: 'Bikini confortável e elegante para o verão, com design exclusivo da Nathália Valente. NOVA COR DISPONÍVEL!',
  tags: ['bikini', 'verão', 'praia', 'conforto', 'premium', 'nova-cor'],
  updatedAt: new Date().toISOString()
};

// Validação da atualização de produto
export const validarAtualizacaoProduto = () => {
  try {
    const produtoAtualizado = validateUpdateProduct(exemploAtualizacaoProduto);
    console.log('✅ Produto para atualização válido:', produtoAtualizado);
    return { success: true, data: produtoAtualizado };
  } catch (error: any) {
    console.error('❌ Erro na validação de atualização:', error.errors);
    return { success: false, errors: error.errors };
  }
};

// ============================================================================
// EXEMPLO 5: FILTROS DE BUSCA
// ============================================================================

export const exemploFiltrosValidos: ProductFilters = {
  search: 'bikini',
  category: 'roupas',
  minPrice: 50,
  maxPrice: 200,
  inStock: true,
  minRating: 4.0,
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 20
};

export const exemploFiltrosInvalidos = {
  search: 'A'.repeat(101), // ❌ Busca muito longa
  category: 'categoria_inexistente', // ❌ Categoria inválida
  minPrice: -10, // ❌ Preço mínimo negativo
  maxPrice: 'abc', // ❌ Preço máximo não numérico
  inStock: 'sim', // ❌ Boolean inválido
  minRating: 6.0, // ❌ Avaliação maior que 5
  sortBy: 'campo_inexistente', // ❌ Campo de ordenação inválido
  sortOrder: 'invalid', // ❌ Ordem inválida
  page: 0, // ❌ Página inválida
  limit: 200 // ❌ Limite muito alto
};

// Validação de filtros
export const validarFiltros = (filtros: unknown) => {
  const result = safeValidate(productFiltersSchema, filtros);
  
  if (result.success) {
    console.log('✅ Filtros válidos:', result.data);
  } else {
    console.log('❌ Filtros inválidos:');
    result.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  return result;
};

// ============================================================================
// EXEMPLO 6: VALIDAÇÃO EM TEMPO REAL (FORMULÁRIO)
// ============================================================================

export const validacaoTempoReal = {
  // Validação de campo individual
  validarCampo: (campo: string, valor: any) => {
    try {
      switch (campo) {
        case 'name':
          productSchema.shape.name.parse(valor);
          break;
        case 'price':
          productSchema.shape.price.parse(valor);
          break;
        case 'currentStock':
          productSchema.shape.currentStock.parse(valor);
          break;
        case 'category':
          productSchema.shape.category.parse(valor);
          break;
        default:
          console.warn('Campo não reconhecido:', campo);
      }
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.errors[0]?.message || 'Erro de validação' };
    }
  },

  // Validação de formulário completo
  validarFormulario: (dados: Partial<Product>) => {
    const result = safeValidate(productSchema, dados);
    
    if (result.success) {
      console.log('✅ Formulário válido');
      return { success: true, data: result.data, errors: [] };
    } else {
      console.log('❌ Formulário inválido:', result.errors);
      return { success: false, data: null, errors: result.errors };
    }
  }
};

// ============================================================================
// EXEMPLO 7: TRATAMENTO DE ERROS ESPECÍFICOS
// ============================================================================

export const tratamentoErros = {
  // Mapear erros para campos específicos
  mapearErrosParaCampos: (errors: string[]) => {
    const errosPorCampo: Record<string, string> = {};
    
    errors.forEach(error => {
      const [campo] = error.split(':');
      if (campo) {
        errosPorCampo[campo.trim()] = error;
      }
    });
    
    return errosPorCampo;
  },

  // Obter mensagem de erro amigável
  obterMensagemAmigavel: (error: string) => {
    const mensagens: Record<string, string> = {
      'Nome é obrigatório': 'Por favor, digite o nome do produto',
      'Preço deve ser positivo': 'O preço deve ser maior que zero',
      'Categoria inválida': 'Selecione uma categoria válida',
      'Estoque não pode ser negativo': 'O estoque deve ser zero ou maior',
      'Nome deve ter no máximo 100 caracteres': 'O nome é muito longo (máx. 100 caracteres)',
      'Preço máximo é R$ 999.999,99': 'O preço é muito alto (máx. R$ 999.999,99)'
    };
    
    return mensagens[error] || error;
  },

  // Validar e retornar erros formatados
  validarComMensagensAmigaveis: (dados: unknown) => {
    const result = safeValidate(productSchema, dados);
    
    if (result.success) {
      return { success: true, data: result.data, errors: [] };
    } else {
      const errosAmigaveis = result.errors.map(erro => 
        tratamentoErros.obterMensagemAmigavel(erro)
      );
      
      return { success: false, data: null, errors: errosAmigaveis };
    }
  }
};

// ============================================================================
// EXEMPLO 8: EXECUÇÃO DE TODOS OS EXEMPLOS
// ============================================================================

export const executarTodosExemplos = () => {
  console.log('🚀 EXECUTANDO EXEMPLOS DE VALIDAÇÃO ZOD - CLUBNATH VIP');
  console.log('='.repeat(60));
  
  console.log('\n1️⃣ PRODUTO VÁLIDO:');
  validarProdutoValido();
  
  console.log('\n2️⃣ PRODUTO INVÁLIDO:');
  validarProdutoInvalido();
  
  console.log('\n3️⃣ CRIAÇÃO DE PRODUTO:');
  validarCriacaoProduto();
  
  console.log('\n4️⃣ ATUALIZAÇÃO DE PRODUTO:');
  validarAtualizacaoProduto();
  
  console.log('\n5️⃣ FILTROS VÁLIDOS:');
  validarFiltros(exemploFiltrosValidos);
  
  console.log('\n6️⃣ FILTROS INVÁLIDOS:');
  validarFiltros(exemploFiltrosInvalidos);
  
  console.log('\n7️⃣ VALIDAÇÃO EM TEMPO REAL:');
  console.log('Campo nome válido:', validacaoTempoReal.validarCampo('name', 'Bikini Teste'));
  console.log('Campo preço inválido:', validacaoTempoReal.validarCampo('price', -10));
  
  console.log('\n8️⃣ TRATAMENTO DE ERROS:');
  const resultadoErros = tratamentoErros.validarComMensagensAmigaveis(exemploProdutoInvalido);
  console.log('Erros amigáveis:', resultadoErros.errors);
  
  console.log('\n✅ EXEMPLOS CONCLUÍDOS!');
};
