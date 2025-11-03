/**
 * Performance Monitoring for Nossa Maternidade
 * Tracks app performance metrics and sends to analytics
 */

import { trackAppPerformance, trackError } from './analytics';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializePerformanceMonitoring();
  }

  private initializePerformanceMonitoring() {
    // Monitor page load performance
    this.observePageLoad();

    // Monitor navigation performance
    this.observeNavigation();

    // Monitor resource loading
    this.observeResources();

    // Monitor long tasks
    this.observeLongTasks();

    // Monitor memory usage
    this.observeMemoryUsage();
  }

  private observePageLoad() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;

          if (navigation) {
            // First Contentful Paint
            const fcp = performance.getEntriesByName('first-contentful-paint')[0];
            if (fcp) {
              this.recordMetric('first_contentful_paint', fcp.startTime, 'ms');
            }

            // Largest Contentful Paint
            const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
            if (lcp) {
              this.recordMetric('largest_contentful_paint', lcp.startTime, 'ms');
            }

            // Time to Interactive
            const tti = navigation.loadEventEnd - navigation.fetchStart;
            this.recordMetric('time_to_interactive', tti, 'ms');

            // Total page load time
            const loadTime = navigation.loadEventEnd - navigation.navigationStart;
            this.recordMetric('page_load_time', loadTime, 'ms');

            // DOM Content Loaded
            const domContentLoaded =
              navigation.domContentLoadedEventEnd - navigation.navigationStart;
            this.recordMetric('dom_content_loaded', domContentLoaded, 'ms');
          }
        }, 0);
      });
    }
  }

  private observeNavigation() {
    // Track route changes (for SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.recordMetric('route_change', Date.now(), 'timestamp');
      }
    }).observe(document, { subtree: true, childList: true });
  }

  private observeResources() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming;

            // Track slow resources (> 1 second)
            if (resource.duration > 1000) {
              this.recordMetric('slow_resource', resource.duration, 'ms', {
                name: resource.name,
                type: resource.initiatorType,
              });
            }

            // Track failed resources
            if (resource.transferSize === 0 && resource.decodedBodySize > 0) {
              this.recordMetric('failed_resource', 1, 'count', {
                name: resource.name,
                type: resource.initiatorType,
              });
            }
          }
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource monitoring not supported:', error);
      }
    }
  }

  private observeLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('long_task', entry.duration, 'ms');
          }
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task monitoring not supported:', error);
      }
    }
  }

  private observeMemoryUsage() {
    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;

      setInterval(() => {
        this.recordMetric('memory_used', memory.usedJSHeapSize, 'bytes');
        this.recordMetric('memory_total', memory.totalJSHeapSize, 'bytes');
        this.recordMetric('memory_limit', memory.jsHeapSizeLimit, 'bytes');
      }, 30000); // Every 30 seconds
    }
  }

  public recordMetric(name: string, value: number, unit: string = 'ms', metadata?: any) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    };

    this.metrics.set(name, metric);

    // Send to analytics
    trackAppPerformance(name as any, value, unit);

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`📊 Performance Metric: ${name} = ${value}${unit}`, metadata);
    }
  }

  public getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  public getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  public getPerformanceScore(): number {
    const fcp = this.getMetric('first_contentful_paint');
    const lcp = this.getMetric('largest_contentful_paint');
    const tti = this.getMetric('time_to_interactive');

    let score = 100;

    // FCP scoring (0-2.5s is good)
    if (fcp && fcp.value > 2500) {
      score -= 20;
    }

    // LCP scoring (0-2.5s is good)
    if (lcp && lcp.value > 2500) {
      score -= 30;
    }

    // TTI scoring (0-3.8s is good)
    if (tti && tti.value > 3800) {
      score -= 30;
    }

    return Math.max(0, score);
  }

  public reportError(error: Error, context?: any) {
    console.error('🚨 Performance Error:', error, context);

    // Send to analytics
    trackError(error.message, false);

    // Send to Sentry if available
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: context });
    }
  }

  public cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for easy use
export const trackPageLoad = (pageName: string) => {
  performanceMonitor.recordMetric('page_load', Date.now(), 'timestamp', { page: pageName });
};

export const trackApiCall = (endpoint: string, duration: number, success: boolean) => {
  performanceMonitor.recordMetric('api_call', duration, 'ms', { endpoint, success });
};

export const trackImageLoad = (src: string, duration: number, success: boolean) => {
  performanceMonitor.recordMetric('image_load', duration, 'ms', { src, success });
};

export const trackUserInteraction = (action: string, element: string) => {
  performanceMonitor.recordMetric('user_interaction', Date.now(), 'timestamp', { action, element });
};

// Declare Sentry global
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: any) => void;
    };
  }
}
