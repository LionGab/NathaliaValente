import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLazyImage, useImageOptimization } from '../hooks/useLazyLoading';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  quality = 80,
  format = 'webp',
  onLoad,
  onError,
  fallback,
  loading = 'lazy',
  objectFit = 'cover',
  objectPosition = 'center',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden mobile-image ${className}`}
      style={{
        width: width || '100%',
        height: height || 'auto',
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && (placeholder || blurDataURL) && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={placeholder || blurDataURL}
            alt=""
            className="w-full h-full object-cover filter blur-sm"
            style={{ objectFit, objectPosition }}
          />
        </motion.div>
      )}

      {/* Loading Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={`w-full h-full transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectFit, objectPosition }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// Lazy loaded component wrapper
export const LazyComponent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  triggerOnce?: boolean;
}> = ({ children, fallback, className = '', triggerOnce = true }) => {
  const { isVisible, ref } = useLazyLoading({ triggerOnce });

  return (
    <div ref={ref} className={className}>
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        ) : (
          fallback || (
            <div className="flex items-center justify-center p-8">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

// Virtual list component
export const VirtualList: React.FC<{
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}> = ({ items, itemHeight, containerHeight, renderItem, overscan = 5, className = '' }) => {
  const { containerRef, visibleItems, totalHeight, offsetY, handleScroll, startIndex } =
    useVirtualScroll(items, itemHeight, containerHeight, overscan);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
