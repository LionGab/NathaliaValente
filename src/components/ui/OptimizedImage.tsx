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

  // If it's a Supabase storage URL, add transformation params
  if (src.includes('supabase.co/storage')) {
    try {
      const url = new URL(src);
      url.searchParams.set('format', 'webp');
      url.searchParams.set('quality', '85');
      return url.toString();
    } catch {
      return src;
    }
  }

  // If it's Unsplash, add format param
  if (src.includes('unsplash.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('q', '85');
      return url.toString();
    } catch {
      return src;
    }
  }

  // If it's a local image, try to find WebP version
  if (src.startsWith('/')) {
    const basePath = src.replace(/\.[^/.]+$/, '');
    return `${basePath}.webp`;
  }

  // For external URLs, return original (they should be optimized)
  return src;
};

// Generate thumbnail URL for responsive images
const getThumbnailUrl = (src: string, size: number): string => {
  // Supabase storage URLs
  if (src.includes('supabase.co/storage')) {
    try {
      const url = new URL(src);
      url.searchParams.set('width', size.toString());
      url.searchParams.set('height', size.toString());
      url.searchParams.set('resize', 'cover');
      url.searchParams.set('format', 'webp');
      return url.toString();
    } catch {
      return src;
    }
  }

  // Unsplash URLs
  if (src.includes('unsplash.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('w', size.toString());
      url.searchParams.set('h', size.toString());
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('fm', 'webp');
      return url.toString();
    } catch {
      return src;
    }
  }

  // Local images
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
  placeholder,
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

  // Intersection Observer for lazy loading (mobile-optimized)
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
        threshold: 0.01, // Lower threshold for mobile (load sooner)
        rootMargin: '100px', // Larger root margin for mobile (preload earlier)
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

  const fallbackSrc = src; // Original as fallback

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Loading spinner (mobile optimized) */}
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 animate-spin" />
            <div className="text-xs text-gray-500 dark:text-gray-400">Carregando...</div>
          </div>
        </div>
      )}

      {/* Error state (mobile optimized) */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <div className="text-3xl sm:text-4xl mb-2">📷</div>
            <div className="text-xs sm:text-sm font-medium">Imagem indisponível</div>
          </div>
        </div>
      )}

      {/* Optimized image with WebP support and responsive srcset */}
      {isInView && (
        <picture>
          <source
            srcSet={`
              ${getThumbnailUrl(src, 320)} 320w,
              ${getThumbnailUrl(src, 640)} 640w,
              ${getThumbnailUrl(src, 1024)} 1024w,
              ${getThumbnailUrl(src, 1920)} 1920w
            `}
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
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </picture>
      )}
    </div>
  );
};

// Hook for preloading images
export const useImagePreload = (srcs: string[]) => {
  useEffect(() => {
    srcs.forEach((src) => {
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
    webp: getWebPUrl(baseSrc),
  };
};
