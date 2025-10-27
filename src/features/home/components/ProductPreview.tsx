import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';
import { ProductCardSkeleton } from '../../../components/ui/skeletons/ProductCardSkeleton';
import { useLazyLoading } from '../../../hooks/useLazyLoading';
import { ChevronRight, Eye } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

export const ProductPreview: React.FC = () => {
  const { products, isLoading } = useProducts();
  const [visibleCount, setVisibleCount] = useState(2);
  const { ref, isVisible } = useLazyLoading({ threshold: 0.1 });

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  if (isLoading) {
    return (
      <Card className="p-4 mb-6">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Produtos em Destaque
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-600 hover:text-primary-700"
        >
          Ver todos
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4" ref={ref}>
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            data-testid={`product-preview-${product.id}`}
          >
            <div className="relative overflow-hidden rounded-lg mb-2">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                width={160}
                height={128}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="w-full h-32 group-hover:scale-105 transition-transform duration-200"
                priority={false}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
              {product.name}
            </h4>
            <p className="text-sm text-primary-600 font-semibold">
              R$ {product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount(prev => Math.min(prev + 2, products.length))}
            className="text-primary-600 border-primary-600 hover:bg-primary-50"
          >
            Ver mais produtos
          </Button>
        </div>
      )}
    </Card>
  );
};
