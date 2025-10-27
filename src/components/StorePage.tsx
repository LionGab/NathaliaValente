import { useState } from 'react';
import { ShoppingBag, ExternalLink, Star, Filter, User, Search, PlusCircle, TestTube2, PersonStanding } from 'lucide-react';
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

  const handleAction = () => {
    console.log('Action clicked');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 pb-24 space-y-12">
      {/* NAVA LOOKS Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden text-white flex items-center justify-center shadow-2xl">
        <OptimizedImage
          src="/images/products/nava/nava-bikini-showcase.jpg"
          alt="NAVA LOOKS"
          className="w-full h-full object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center p-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2 drop-shadow-2xl">
            NAVA LOOKS
          </h1>
          <p className="mt-2 text-lg md:text-xl drop-shadow-lg">
            Vista-se de você
          </p>
          <button
            onClick={() => window.open('https://loja.nathaliavalente.com', '_blank')}
            className="mt-6 bg-white text-neutral-900 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-100 transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto"
          >
            <PersonStanding className="w-5 h-5" />
            Acessar Provador Virtual
          </button>
        </div>
      </div>

      {/* Babytest Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border-2 border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="grid md:grid-cols-2 items-center gap-6">
          <div className="p-4 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <TestTube2 className="h-8 w-8 text-primary-500" />
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white">
                Babytest
              </h3>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-6">
              O teste que revela o futuro do seu bebê está no DNA. Entenda predisposições genéticas e cuide da saúde desde os primeiros dias.
            </p>
            <button
              onClick={() => window.open('https://ollin.com.br/babytest', '_blank')}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-all duration-200 shadow-medium"
            >
              Saiba mais e compre
            </button>
          </div>
          <div className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden">
            <OptimizedImage
              src="/images/products/ollin/ollin-product-1.jpg"
              alt="Babytest OLLIN"
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Produtos
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Explore nossa seleção exclusiva
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 shadow-medium"
          >
            <PlusCircle className="h-5 w-5" />
            Vender um item
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 items-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </section>
    </div>
  );
};
