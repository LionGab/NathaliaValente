import { useState } from 'react';
import { ShoppingBag, ExternalLink, Star, Filter } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types/products';
import { ProductCard } from './ui/ProductCard';
import { OptimizedImage } from './ui/OptimizedImage';

export const StorePage = () => {
  const [selectedBrand, setSelectedBrand] = useState<'ALL' | 'NAVA' | 'OLLIN'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter(product => {
    if (selectedBrand !== 'ALL' && product.brand !== selectedBrand) return false;
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    return true;
  });

  const featuredProducts = products.filter(product => product.isFeatured);

  const handleViewDetails = (product: Product) => {
    if (product.isExternal && product.link) {
      window.open(product.link, '_blank');
    } else {
      // Show product details modal
      console.log('View product details:', product);
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
  };

  const handleToggleFavorite = (productId: string) => {
    console.log('Toggle favorite:', productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold gradient-text">Loja</h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Produtos exclusivos da Nathália Valente
        </p>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            ⭐ Destaques
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                variant="featured"
              />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        
        {/* Brand Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedBrand('ALL')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedBrand === 'ALL'
                ? 'bg-primary-500 text-white shadow-medium'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-950/30'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedBrand('NAVA')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedBrand === 'NAVA'
                ? 'bg-pink-500 text-white shadow-medium'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-pink-50 dark:hover:bg-pink-950/30'
            }`}
          >
            NAVA
          </button>
          <button
            onClick={() => setSelectedBrand('OLLIN')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedBrand === 'OLLIN'
                ? 'bg-green-500 text-white shadow-medium'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-green-50 dark:hover:bg-green-950/30'
            }`}
          >
            OLLIN
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Nenhum produto encontrado
          </p>
        </div>
      )}
    </div>
  );
};
