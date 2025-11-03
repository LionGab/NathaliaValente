import { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadingOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

interface LazyLoadingReturn {
  isVisible: boolean;
  ref: React.RefObject<HTMLElement>;
  hasBeenVisible: boolean;
}

export const useLazyLoading = (options: LazyLoadingOptions = {}): LazyLoadingReturn => {
  const { root = null, rootMargin = '0px', threshold = 0.1, triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        if (!hasBeenVisible) {
          setHasBeenVisible(true);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [hasBeenVisible, triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, root, rootMargin, threshold]);

  return { isVisible, ref, hasBeenVisible };
};

// Hook for lazy loading images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { isVisible, ref } = useLazyLoading();

  useEffect(() => {
    if (isVisible && src) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoading(false);
        setHasError(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      img.src = src;
    }
  }, [isVisible, src]);

  return { imageSrc, isLoading, hasError, ref };
};

// Hook for lazy loading components
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isVisible, ref } = useLazyLoading();

  useEffect(() => {
    if (isVisible && !Component && !isLoading) {
      setIsLoading(true);
      setHasError(false);

      importFunc()
        .then((module) => {
          setComponent(() => module.default);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error loading component:', error);
          setHasError(true);
          setIsLoading(false);
        });
    }
  }, [isVisible, Component, isLoading, importFunc]);

  return { Component, isLoading, hasError, ref };
};

// Hook for virtual scrolling
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef: setContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
};

// Hook for debounced search
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttled scroll
export const useThrottle = <T extends (...args: any[]) => any>(callback: T, delay: number): T => {
  const [isThrottled, setIsThrottled] = useState(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!isThrottled) {
        callback(...args);
        setIsThrottled(true);
        setTimeout(() => setIsThrottled(false), delay);
      }
    },
    [callback, delay, isThrottled]
  ) as T;

  return throttledCallback;
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const [renderTime, setRenderTime] = useState<number>(0);
  const [mountTime, setMountTime] = useState<number>(0);
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    setMountTime(startTime);

    return () => {
      const endTime = performance.now();
      console.log(`${componentName} mounted for ${endTime - startTime}ms`);
    };
  }, [componentName]);

  useEffect(() => {
    renderStartTime.current = performance.now();

    return () => {
      const endTime = performance.now();
      const renderDuration = endTime - renderStartTime.current;
      setRenderTime(renderDuration);

      if (renderDuration > 16) {
        // More than one frame
        console.warn(`${componentName} render took ${renderDuration}ms`);
      }
    };
  });

  return { renderTime, mountTime };
};

// Hook for memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Hook for image optimization
export const useImageOptimization = (src: string, sizes?: string) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setHasError(false);

    // For now, just use the original src without optimization
    // In production, you would integrate with a service like Cloudinary, ImageKit, etc.
    setOptimizedSrc(src);

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = src;
  }, [src, sizes]);

  return { optimizedSrc, isLoading, hasError };
};
