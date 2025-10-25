import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../../types/products';
import { OptimizedImage } from './OptimizedImage';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  variant = 'default'
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'NAVA':
        return 'from-pink-500 to-purple-600';
      case 'OLLIN':
        return 'from-green-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBrandBadge = (brand: string) => {
    switch (brand) {
      case 'NAVA':
        return { text: 'NAVA', bg: 'bg-pink-500' };
      case 'OLLIN':
        return { text: 'OLLIN', bg: 'bg-green-500' };
      default:
        return { text: brand, bg: 'bg-gray-500' };
    }
  };

  const badge = getBrandBadge(product.brand);

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="relative">
          <OptimizedImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-32 object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className={`absolute top-2 left-2 ${badge.bg} text-white text-xs font-bold px-2 py-1 rounded-full`}>
            {badge.text}
          </div>
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4 inline mr-1" />
            Adicionar
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <OptimizedImage
            src={product.images[imageIndex]}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className={`absolute top-3 left-3 ${badge.bg} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
            {badge.text}
          </div>
          {product.discount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
              -{product.discount}%
            </div>
          )}
          {product.isNew && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NOVO
            </div>
          )}
          
          {/* Hover Actions */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => onViewDetails(product)}
              className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-900'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviews} avaliações)
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {!product.inStock && (
              <span className="text-sm text-red-500 font-medium">Esgotado</span>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              product.inStock
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5 inline mr-2" />
            {product.inStock ? 'Adicionar ao Carrinho' : 'Produto Esgotado'}
          </button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative">
        <OptimizedImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className={`absolute top-2 left-2 ${badge.bg} text-white text-xs font-bold px-2 py-1 rounded-full`}>
          {badge.text}
        </div>
        {product.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4 inline mr-1" />
          Adicionar
        </button>
      </div>
    </div>
  );
};