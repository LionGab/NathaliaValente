import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
}

// Generate WebP URL from original image
const getWebPUrl = (src: string): string => {
  // If already WebP, return as is
  if (src.includes('.webp')) return src;
  
  // If it's a local image, try to find WebP version
  if (src.startsWith('/')) {
    const basePath = src.replace(/\.[^/.]+$/, '');
    return `${basePath}.webp`;
  }
  
  // For external URLs, return original (they should be optimized)
  return src;
};

// Generate thumbnail URL
const getThumbnailUrl = (src: string, size: number): string => {
  if (src.startsWith('/')) {
    const basePath = src.replace(/\.[^/.]+$/, '');
    return `${basePath}-${size}.webp`;
  }
  return src;
};

// Generate blur placeholder (base64)
const generateBlurPlaceholder = (width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a simple gradient blur
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
  onLoad,
  onError,
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [blurDataURL, setBlurDataURL] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate blur placeholder on mount
  useEffect(() => {
    if (!placeholder) {
      setBlurDataURL(generateBlurPlaceholder(400, 300));
    } else {
      setBlurDataURL(placeholder);
    }
  }, [placeholder]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const webpSrc = getWebPUrl(src);
  const fallbackSrc = src; // Original as fallback

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
      )}

      {/* Loading spinner */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">Erro ao carregar</div>
          </div>
        </div>
      )}

      {/* Optimized image with WebP support */}
      {isInView && (
        <picture>
          <source
            srcSet={webpSrc}
            type="image/webp"
            sizes={sizes}
          />
          <img
            src={fallbackSrc}
            alt={alt}
            className={`transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            sizes={sizes}
          />
        </picture>
      )}
    </div>
  );
};

// Hook for preloading images
export const useImagePreload = (srcs: string[]) => {
  useEffect(() => {
    srcs.forEach(src => {
      const img = new Image();
      img.src = getWebPUrl(src);
    });
  }, [srcs]);
};

// Utility function to get responsive image URLs
export const getResponsiveImageUrls = (baseSrc: string) => {
  return {
    thumbnail: getThumbnailUrl(baseSrc, 100),
    small: getThumbnailUrl(baseSrc, 300),
    medium: getThumbnailUrl(baseSrc, 600),
    large: getThumbnailUrl(baseSrc, 1200),
    original: baseSrc,
    webp: getWebPUrl(baseSrc)
  };
};
