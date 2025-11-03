import { z } from 'zod';

/**
 * SCHEMA ZOD COMPLETO PARA PRODUTOS - CLUBNATH VIP
 *
 * Este arquivo contém todos os schemas de validação para o módulo de produtos,
 * seguindo as regras de negócio específicas da comunidade de mães ClubNath VIP.
 *
 * Características principais:
 * - Validação rigorosa de dados de entrada
 * - Mensagens de erro em português
 * - Regras específicas para produtos de maternidade
 * - Suporte a diferentes tipos de produtos (roupas, cuidados, acessórios, brinquedos)
 * - Validação de preços, estoque, dimensões e características específicas
 */

// ============================================================================
// ENUMS E CONSTANTES
// ============================================================================

/**
 * Categorias de produtos disponíveis no ClubNath VIP
 * Baseadas nas necessidades específicas de mães e bebês
 */
export const PRODUCT_CATEGORIES = {
  ROUPAS: 'roupas',
  CUIDADOS: 'cuidados',
  ACESSORIOS: 'acessorios',
  BRINQUEDOS: 'brinquedos',
  MATERNIDADE: 'maternidade',
  NUTRICAO: 'nutricao',
  SEGURANCA: 'seguranca',
} as const;

/**
 * Status de disponibilidade do produto
 */
export const PRODUCT_STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  ESGOTADO: 'esgotado',
  PRE_VENDA: 'pre_venda',
  DESCONTINUADO: 'descontinuado',
} as const;

/**
 * Faixas etárias para produtos infantis
 */
export const AGE_RANGES = {
  RECEM_NASCIDO: '0-3m',
  BEBE: '3-12m',
  CRIANCA_PEQUENA: '1-3a',
  CRIANCA: '3-6a',
  TODAS_IDADES: 'todas',
} as const;

// ============================================================================
// SCHEMAS BASE
// ============================================================================

/**
 * Schema para dimensões de produtos
 * Validação específica para produtos físicos
 */
const dimensionsSchema = z
  .object({
    length: z
      .number()
      .positive('Comprimento deve ser positivo')
      .max(200, 'Comprimento máximo é 200cm')
      .multipleOf(0.1, 'Comprimento deve ter 1 casa decimal'),
    width: z
      .number()
      .positive('Largura deve ser positiva')
      .max(200, 'Largura máxima é 200cm')
      .multipleOf(0.1, 'Largura deve ter 1 casa decimal'),
    height: z
      .number()
      .positive('Altura deve ser positiva')
      .max(200, 'Altura máxima é 200cm')
      .multipleOf(0.1, 'Altura deve ter 1 casa decimal'),
  })
  .optional();

/**
 * Schema para informações de peso e envio
 */
const shippingInfoSchema = z
  .object({
    weight: z
      .number()
      .positive('Peso deve ser positivo')
      .max(50000, 'Peso máximo é 50kg')
      .multipleOf(0.1, 'Peso deve ter 1 casa decimal'),
    freeShipping: z.boolean().default(false),
    shippingClass: z.enum(['standard', 'express', 'overnight']).default('standard'),
    estimatedDelivery: z
      .number()
      .int('Prazo de entrega deve ser inteiro')
      .min(1, 'Prazo mínimo é 1 dia')
      .max(30, 'Prazo máximo é 30 dias'),
  })
  .optional();

/**
 * Schema para informações de avaliação e reviews
 */
const ratingInfoSchema = z
  .object({
    averageRating: z
      .number()
      .min(0, 'Avaliação não pode ser negativa')
      .max(5, 'Avaliação máxima é 5')
      .multipleOf(0.1, 'Avaliação deve ter 1 casa decimal'),
    totalReviews: z
      .number()
      .int('Total de avaliações deve ser inteiro')
      .nonnegative('Total de avaliações não pode ser negativo')
      .max(99999, 'Total de avaliações muito alto'),
    ratingDistribution: z
      .object({
        five: z.number().int().min(0).max(99999),
        four: z.number().int().min(0).max(99999),
        three: z.number().int().min(0).max(99999),
        two: z.number().int().min(0).max(99999),
        one: z.number().int().min(0).max(99999),
      })
      .optional(),
  })
  .optional();

/**
 * Schema para informações específicas de produtos infantis
 */
const babyProductInfoSchema = z
  .object({
    ageRange: z.enum(Object.values(AGE_RANGES) as [string, ...string[]]),
    safetyCertifications: z.array(z.string()).max(5, 'Máximo 5 certificações'),
    material: z.string().max(100, 'Material deve ter no máximo 100 caracteres'),
    careInstructions: z
      .string()
      .max(500, 'Instruções de cuidado devem ter no máximo 500 caracteres'),
    isWashable: z.boolean().optional(),
    isHypoallergenic: z.boolean().optional(),
    isBpaFree: z.boolean().optional(),
  })
  .optional();

/**
 * Schema para informações de estoque e disponibilidade
 */
const inventorySchema = z
  .object({
    currentStock: z
      .number()
      .int('Estoque deve ser inteiro')
      .nonnegative('Estoque não pode ser negativo')
      .max(9999, 'Estoque máximo é 9999'),
    reservedStock: z
      .number()
      .int('Estoque reservado deve ser inteiro')
      .nonnegative('Estoque reservado não pode ser negativo')
      .max(9999, 'Estoque reservado máximo é 9999'),
    lowStockThreshold: z
      .number()
      .int('Limite de estoque baixo deve ser inteiro')
      .nonnegative('Limite de estoque baixo não pode ser negativo')
      .max(100, 'Limite de estoque baixo máximo é 100'),
    allowBackorder: z.boolean().default(false),
    maxQuantityPerOrder: z
      .number()
      .int('Quantidade máxima por pedido deve ser inteira')
      .positive('Quantidade máxima por pedido deve ser positiva')
      .max(99, 'Quantidade máxima por pedido é 99'),
  })
  .optional();

// ============================================================================
// SCHEMA PRINCIPAL DE PRODUTO
// ============================================================================

/**
 * Schema principal para validação de produtos
 * Inclui todas as validações específicas para o ClubNath VIP
 */
export const productSchema = z.object({
  // Identificação básica
  id: z.string().uuid('ID deve ser um UUID válido').optional(),

  // Informações básicas do produto
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(
      /^[a-zA-Z0-9\s\-_áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]+$/,
      'Nome contém caracteres inválidos. Use apenas letras, números, espaços, hífens e underscores'
    )
    .transform((name) => name.trim()), // Remove espaços extras

  // Preço e informações financeiras
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .max(999999.99, 'Preço máximo é R$ 999.999,99')
    .multipleOf(0.01, 'Preço deve ter no máximo 2 casas decimais'),

  originalPrice: z
    .number()
    .positive('Preço original deve ser positivo')
    .max(999999.99, 'Preço original máximo é R$ 999.999,99')
    .multipleOf(0.01, 'Preço original deve ter no máximo 2 casas decimais')
    .optional(),

  // Categoria e classificação
  category: z.enum(Object.values(PRODUCT_CATEGORIES) as [string, ...string[]], {
    errorMap: () => ({
      message:
        'Categoria inválida. Escolha entre: roupas, cuidados, acessórios, brinquedos, maternidade, nutrição, segurança',
    }),
  }),

  subcategory: z.string().max(50, 'Subcategoria deve ter no máximo 50 caracteres').optional(),

  // Imagens e mídia
  image: z.string().url('URL da imagem principal inválida').optional().or(z.literal('')),

  images: z
    .array(z.string().url('URL de imagem inválida'))
    .max(10, 'Máximo 10 imagens por produto')
    .optional(),

  // Descrição e conteúdo
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),

  shortDescription: z
    .string()
    .max(200, 'Descrição curta deve ter no máximo 200 caracteres')
    .optional(),

  // Tags e palavras-chave
  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag não pode ser vazia')
        .max(30, 'Tag deve ter no máximo 30 caracteres')
        .regex(
          /^[a-zA-Z0-9\s\-_áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ]+$/,
          'Tag contém caracteres inválidos'
        )
    )
    .max(15, 'Máximo 15 tags por produto')
    .optional(),

  // Status e disponibilidade
  status: z
    .enum(Object.values(PRODUCT_STATUS) as [string, ...string[]])
    .default(PRODUCT_STATUS.ATIVO),

  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),

  // Informações de estoque
  ...inventorySchema.shape,

  // Informações de avaliação
  ...ratingInfoSchema.shape,

  // Informações específicas de produtos infantis
  ...babyProductInfoSchema.shape,

  // Informações de envio
  ...shippingInfoSchema.shape,

  // Dimensões físicas
  ...dimensionsSchema.shape,

  // Metadados
  sku: z
    .string()
    .min(1, 'SKU é obrigatório')
    .max(50, 'SKU deve ter no máximo 50 caracteres')
    .regex(
      /^[A-Z0-9\-_]+$/,
      'SKU deve conter apenas letras maiúsculas, números, hífens e underscores'
    )
    .optional(),

  barcode: z
    .string()
    .length(13, 'Código de barras deve ter exatamente 13 dígitos')
    .regex(/^\d+$/, 'Código de barras deve conter apenas números')
    .optional(),

  // Timestamps
  createdAt: z.string().datetime('Data de criação deve ser um datetime válido').optional(),

  updatedAt: z.string().datetime('Data de atualização deve ser um datetime válido').optional(),

  // Informações de SEO
  seoTitle: z.string().max(60, 'Título SEO deve ter no máximo 60 caracteres').optional(),

  seoDescription: z.string().max(160, 'Descrição SEO deve ter no máximo 160 caracteres').optional(),

  seoKeywords: z.array(z.string().max(50)).max(10, 'Máximo 10 palavras-chave SEO').optional(),
});

// Schema para criação de produto (sem ID)
export const createProductSchema = productSchema.omit({ id: true });

// Schema para atualização de produto (todos campos opcionais exceto ID)
export const updateProductSchema = productSchema.partial().required({ id: true });

// Schema para busca/filtros de produtos
export const productFiltersSchema = z.object({
  search: z.string().min(1).max(100).optional(),
  category: z.enum(['roupas', 'cuidados', 'acessorios', 'brinquedos']).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(['name', 'price', 'rating', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Schema para validação de carrinho
export const cartItemSchema = z.object({
  productId: z.string().uuid('ID do produto inválido'),
  quantity: z
    .number()
    .int('Quantidade deve ser inteira')
    .positive('Quantidade deve ser positiva')
    .max(99, 'Quantidade máxima por item é 99'),
  selectedOptions: z.record(z.string(), z.string()).optional(),
});

// Schema para validação de avaliação de produto
export const productReviewSchema = z.object({
  productId: z.string().uuid('ID do produto inválido'),
  rating: z
    .number()
    .int('Avaliação deve ser inteira')
    .min(1, 'Avaliação mínima é 1')
    .max(5, 'Avaliação máxima é 5'),
  comment: z
    .string()
    .min(10, 'Comentário deve ter pelo menos 10 caracteres')
    .max(1000, 'Comentário deve ter no máximo 1000 caracteres')
    .optional(),
  isAnonymous: z.boolean().default(false),
});

// Tipos TypeScript derivados dos schemas
export type Product = z.infer<typeof productSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ProductReview = z.infer<typeof productReviewSchema>;

// Funções de validação utilitárias
export const validateProduct = (data: unknown): Product => {
  return productSchema.parse(data);
};

export const validateCreateProduct = (data: unknown): CreateProductInput => {
  return createProductSchema.parse(data);
};

export const validateUpdateProduct = (data: unknown): UpdateProductInput => {
  return updateProductSchema.parse(data);
};

export const validateProductFilters = (data: unknown): ProductFilters => {
  return productFiltersSchema.parse(data);
};

export const validateCartItem = (data: unknown): CartItem => {
  return cartItemSchema.parse(data);
};

export const validateProductReview = (data: unknown): ProductReview => {
  return productReviewSchema.parse(data);
};

// Função para validação com tratamento de erros
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
      };
    }
    return {
      success: false,
      errors: ['Erro de validação desconhecido'],
    };
  }
};

// Validações específicas de negócio
export const isProductInStock = (product: Product): boolean => {
  return product.stock > 0;
};

export const isProductOnSale = (product: Product, saleThreshold: number = 0.2): boolean => {
  // Lógica para determinar se produto está em promoção
  return false; // Implementar lógica de promoção
};

export const canAddToCart = (product: Product, quantity: number): boolean => {
  return isProductInStock(product) && product.stock >= quantity;
};

// Constantes de validação
export const VALIDATION_LIMITS = {
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_PRODUCT_DESCRIPTION_LENGTH: 500,
  MAX_PRODUCT_PRICE: 999999.99,
  MAX_PRODUCT_STOCK: 9999,
  MAX_PRODUCT_TAGS: 10,
  MAX_PRODUCT_WEIGHT: 50000,
  MAX_CART_QUANTITY: 99,
  MAX_REVIEW_COMMENT_LENGTH: 1000,
  MIN_REVIEW_COMMENT_LENGTH: 10,
} as const;
