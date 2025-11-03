// Image Cache Utility
class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50; // Maximum number of images to cache
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Generate cache key
  private getCacheKey(url: string, width?: number, height?: number): string {
    return `${url}_${width || 'auto'}_${height || 'auto'}`;
  }

  // Check if image is cached and not expired
  private isCached(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    try {
      const data = JSON.parse(cached);
      const now = Date.now();
      return now - data.timestamp < this.maxAge;
    } catch {
      return false;
    }
  }

  // Get cached image
  get(url: string, width?: number, height?: number): string | null {
    const key = this.getCacheKey(url, width, height);

    if (this.isCached(key)) {
      const data = JSON.parse(this.cache.get(key)!);
      return data.url;
    }

    return null;
  }

  // Set cached image
  set(url: string, cachedUrl: string, width?: number, height?: number): void {
    const key = this.getCacheKey(url, width, height);

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(
      key,
      JSON.stringify({
        url: cachedUrl,
        timestamp: Date.now(),
      })
    );
  }

  // Clear cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }
}

// Create singleton instance
export const imageCache = new ImageCache();

// Image optimization utility
export const optimizeImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // Check cache first
  const cached = imageCache.get(url, width, height);
  if (cached) return cached;

  // For Supabase storage URLs, we can optimize them
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    const optimizedUrl = new URL(url);

    // Add transformation parameters if supported by your image service
    if (width) optimizedUrl.searchParams.set('width', width.toString());
    if (height) optimizedUrl.searchParams.set('height', height.toString());
    optimizedUrl.searchParams.set('quality', quality.toString());
    optimizedUrl.searchParams.set('format', 'webp');

    const finalUrl = optimizedUrl.toString();
    imageCache.set(url, finalUrl, width, height);
    return finalUrl;
  }

  // For other URLs, return as-is but cache them
  imageCache.set(url, url, width, height);
  return url;
};

// Preload images
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
          img.src = url;
        })
    )
  );
};

// Compress image on client side
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Get image dimensions
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

// Generate responsive image URLs
export const generateResponsiveUrls = (baseUrl: string) => {
  const sizes = [320, 640, 1024, 1920];

  return sizes.map((size) => ({
    url: optimizeImageUrl(baseUrl, size),
    width: size,
  }));
};
