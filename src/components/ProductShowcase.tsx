import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Eye } from 'lucide-react';
import { ProductCard } from './ui/ProductCard';
import { ProductDetailModal } from './ui/ProductDetailModal';
import { useCart } from '../contexts/CartContext';
import { getFeaturedProducts, getNewProducts, getProductsByBrand } from '../data/products';
import { Product } from '../types/products';

interface ProductShowcaseProps {
  variant?: 'featured' | 'new' | 'nava' | 'ollin';
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  variant = 'featured',
  title,
  subtitle,
  maxItems = 4,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();

  const getProducts = () => {
    switch (variant) {
      case 'featured':
        return getFeaturedProducts();
      case 'new':
        return getNewProducts();
      case 'nava':
        return getProductsByBrand('NAVA');
      case 'ollin':
        return getProductsByBrand('OLLIN');
      default:
        return getFeaturedProducts();
    }
  };

  const getDefaultTitle = () => {
    switch (variant) {
      case 'featured':
        return 'Produtos em Destaque';
      case 'new':
        return 'Novidades';
      case 'nava':
        return 'Coleção NAVA';
      case 'ollin':
        return 'Cuidados OLLIN';
      default:
        return 'Produtos';
    }
  };

  const getDefaultSubtitle = () => {
    switch (variant) {
      case 'featured':
        return 'Os favoritos das nossas mães';
      case 'new':
        return 'Acabaram de chegar';
      case 'nava':
        return 'Moda exclusiva da Nathália';
      case 'ollin':
        return 'Beleza natural para mães';
      default:
        return 'Produtos selecionados';
    }
  };

  const products = getProducts().slice(0, maxItems);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      images: product.images,
      quantity: 1,
      link: product.link,
      isExternal: product.isExternal,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {title || getDefaultTitle()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{subtitle || getDefaultSubtitle()}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.has(product.id)}
            variant="default"
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl">
          <ShoppingBag className="w-5 h-5" />
          Ver Todos os Produtos
        </button>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

// Componente para produtos em destaque no feed
export const FeaturedProductsCard: React.FC = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 2);

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-2xl p-6 mb-6 border border-pink-200/50 dark:border-pink-800/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Produtos em Destaque</h3>
          <p className="text-sm text-pink-600 dark:text-pink-400">Coleção exclusiva da Nathália</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/80x80/FF69B4/FFFFFF?text=NAVA';
                  }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button className="text-pink-600 hover:text-pink-700 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
