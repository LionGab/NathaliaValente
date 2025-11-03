import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkRequests: number;
  cacheHitRate: number;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    cacheHitRate: 0,
  });

  useEffect(() => {
    const measurePerformance = () => {
      // Measure page load time
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;

      // Measure memory usage (if available)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB

      // Count network requests
      const networkRequests = performance.getEntriesByType('resource').length;

      // Calculate cache hit rate
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const cachedResources = resources.filter((resource) => resource.transferSize === 0);
      const cacheHitRate =
        resources.length > 0 ? (cachedResources.length / resources.length) * 100 : 0;

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: 0, // Will be measured by React components
        memoryUsage: Math.round(memoryUsage * 100) / 100,
        networkRequests,
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      });
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Monitor performance periodically
    const interval = setInterval(measurePerformance, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('load', measurePerformance);
      clearInterval(interval);
    };
  }, []);

  const measureRenderTime = (componentName: string, startTime: number) => {
    const renderTime = performance.now() - startTime;

    // Log slow renders (> 16ms for 60fps)
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    setMetrics((prev) => ({
      ...prev,
      renderTime: Math.round(renderTime * 100) / 100,
    }));

    return renderTime;
  };

  const logPerformanceIssue = (issue: string, details?: any) => {
    console.warn(`Performance Issue: ${issue}`, details);

    // In production, you might want to send this to an analytics service
    if (import.meta.env.PROD) {
      // Example: send to analytics
      // analytics.track('performance_issue', { issue, details, metrics });
    }
  };

  return {
    metrics,
    measureRenderTime,
    logPerformanceIssue,
  };
};
