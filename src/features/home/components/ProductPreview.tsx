import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';
import { ProductCardSkeleton } from '../../../components/ui/skeletons/ProductCardSkeleton';
import { useLazyLoading } from '../../../hooks/useLazyLoading';
import { ChevronRight, Eye, Star, ShoppingBag, Heart } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductPreview: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const [visibleCount, setVisibleCount] = useState(2);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const { ref, isVisible } = useLazyLoading({ threshold: 0.1 });

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  const handleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-6 mb-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-0 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Produtos em Destaque
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Coleção exclusiva NAVA
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-pink-600 hover:text-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900/30 px-4 py-2 rounded-xl font-medium transition-all duration-300"
          >
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6" ref={ref}>
          <AnimatePresence>
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
                data-testid={`product-preview-${product.id}`}
              >
                <div className="relative overflow-hidden rounded-2xl mb-3 bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Aspect Ratio Container - Perfect for bikini photos */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={250}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      priority={index < 2}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(product.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          likedProducts.has(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/80 text-gray-700 rounded-full backdrop-blur-sm hover:bg-pink-500 hover:text-white transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Badge for New Products */}
                    {index === 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NOVO
                      </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Últimas unidades
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.reviews} avaliações
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Comprar
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisibleCount(prev => Math.min(prev + 2, products.length))}
              className="text-pink-600 border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 px-8 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105"
            >
              Ver mais produtos
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Motivational CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl text-center"
        >
          <p className="text-pink-700 dark:text-pink-400 font-medium">
            ✨ Descubra peças que realçam sua beleza natural ✨
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
};
