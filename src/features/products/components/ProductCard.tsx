import React from 'react';
import {
  validateProduct,
  safeValidate,
  isProductInStock,
  canAddToCart,
  type Product,
} from '../validation';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  onViewDetails: (productId: string) => void;
  onEdit?: (productId: string) => void;
  onDelete?: (productId: string) => void;
  showAdminActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  onEdit,
  onDelete,
  showAdminActions = false,
}) => {
  // Validação do produto antes de renderizar
  const validationResult = safeValidate(validateProduct, product);

  if (!validationResult.success) {
    console.error('Produto inválido:', validationResult.errors);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Erro no produto</h3>
        <p className="text-red-600 text-sm">Dados do produto são inválidos</p>
        {showAdminActions && (
          <button
            onClick={() => onEdit?.(product.id || '')}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Corrigir dados
          </button>
        )}
      </div>
    );
  }

  const validatedProduct = validationResult.data;
  const inStock = isProductInStock(validatedProduct);
  const canAdd = canAddToCart(validatedProduct, 1);

  const handleAddToCart = () => {
    if (canAdd) {
      onAddToCart(validatedProduct.id || '', 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (validatedProduct.originalPrice && validatedProduct.originalPrice > validatedProduct.price) {
      const discount =
        ((validatedProduct.originalPrice - validatedProduct.price) /
          validatedProduct.originalPrice) *
        100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
      {/* Imagem do produto */}
      <div className="relative aspect-square overflow-hidden">
        {validatedProduct.image ? (
          <img
            src={validatedProduct.image}
            alt={validatedProduct.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">📦</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {validatedProduct.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              NOVO
            </span>
          )}
          {validatedProduct.isOnSale && discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              -{discountPercentage}%
            </span>
          )}
          {!inStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              ESGOTADO
            </span>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onViewDetails(validatedProduct.id || '')}
            className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm transition-colors"
            title="Ver detalhes"
          >
            👁️
          </button>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Categoria */}
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {validatedProduct.category}
        </div>

        {/* Nome do produto */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{validatedProduct.name}</h3>

        {/* Descrição curta */}
        {validatedProduct.shortDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {validatedProduct.shortDescription}
          </p>
        )}

        {/* Preços */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(validatedProduct.price)}
            </span>
            {validatedProduct.originalPrice &&
              validatedProduct.originalPrice > validatedProduct.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(validatedProduct.originalPrice)}
                </span>
              )}
          </div>
        </div>

        {/* Avaliação */}
        {validatedProduct.averageRating && validatedProduct.totalReviews && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.floor(validatedProduct.averageRating!) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-sm text-gray-600">({validatedProduct.totalReviews})</span>
          </div>
        )}

        {/* Estoque */}
        <div className="text-sm text-gray-600 mb-3">
          {inStock ? (
            <span className="text-green-600">{validatedProduct.currentStock} em estoque</span>
          ) : (
            <span className="text-red-600">Esgotado</span>
          )}
        </div>

        {/* Tags */}
        {validatedProduct.tags && validatedProduct.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {validatedProduct.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {validatedProduct.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{validatedProduct.tags.length - 3} mais
              </span>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(validatedProduct.id || '')}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Ver Detalhes
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
              canAdd
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canAdd ? 'Adicionar' : 'Indisponível'}
          </button>
        </div>

        {/* Ações administrativas */}
        {showAdminActions && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
            <button
              onClick={() => onEdit?.(validatedProduct.id || '')}
              className="flex-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete?.(validatedProduct.id || '')}
              className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
