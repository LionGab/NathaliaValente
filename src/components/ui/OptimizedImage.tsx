import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  placeholder = 'empty',
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Gerar srcSet para diferentes tamanhos
  const generateSrcSet = (baseSrc: string) => {
    const sizes = [320, 640, 1024, 1280];
    return sizes
      .map(size => `${baseSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">Erro ao carregar</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && placeholder === 'blur' && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        style={{ width, height }}
      />
    </div>
  );
};