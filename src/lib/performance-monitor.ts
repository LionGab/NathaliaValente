/**
 * Nossa Maternidade - Sistema de Monitoramento de Performance
 * Monitoramento completo de performance e métricas
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  type: 'timing' | 'counter' | 'gauge';
  tags?: Record<string, string>;
}

interface WebVitals {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

interface PerformanceConfig {
  enableWebVitals: boolean;
  enableResourceTiming: boolean;
  enableNavigationTiming: boolean;
  enableUserTiming: boolean;
  sampleRate: number; // 0-1
  maxMetrics: number;
  reportInterval: number; // ms
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private config: PerformanceConfig;
  private reportTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      enableWebVitals: true,
      enableResourceTiming: true,
      enableNavigationTiming: true,
      enableUserTiming: true,
      sampleRate: 1.0,
      maxMetrics: 1000,
      reportInterval: 30000, // 30 segundos
    };

    this.initialize();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Configurar Web Vitals
    if (this.config.enableWebVitals) {
      this.setupWebVitals();
    }

    // Configurar Resource Timing
    if (this.config.enableResourceTiming) {
      this.setupResourceTiming();
    }

    // Configurar Navigation Timing
    if (this.config.enableNavigationTiming) {
      this.setupNavigationTiming();
    }

    // Configurar User Timing
    if (this.config.enableUserTiming) {
      this.setupUserTiming();
    }

    // Iniciar relatório periódico
    this.startReporting();
  }

  private setupWebVitals(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime, 'timing');
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime, 'timing');
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', (entry as any).processingStart - entry.startTime, 'timing');
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('CLS', clsValue, 'timing');
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private setupResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          this.recordMetric('resource_load_time', resource.duration, 'timing', {
            type: resource.initiatorType,
            name: resource.name,
          });
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private setupNavigationTiming(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart, 'timing');
      this.recordMetric(
        'DOM_ready',
        navigation.domContentLoadedEventEnd - navigation.navigationStart,
        'timing'
      );
      this.recordMetric(
        'load_complete',
        navigation.loadEventEnd - navigation.navigationStart,
        'timing'
      );
    });
  }

  private setupUserTiming(): void {
    // Interceptar performance.mark e performance.measure
    const originalMark = performance.mark;
    const originalMeasure = performance.measure;

    performance.mark = (name: string, options?: PerformanceMarkOptions) => {
      const result = originalMark.call(performance, name, options);
      this.recordMetric(`mark_${name}`, 0, 'timing');
      return result;
    };

    performance.measure = (name: string, startMark?: string, endMark?: string) => {
      const result = originalMeasure.call(performance, name, startMark, endMark);
      this.recordMetric(`measure_${name}`, result.duration, 'timing');
      return result;
    };
  }

  private startReporting(): void {
    this.reportTimer = setInterval(() => {
      this.reportMetrics();
    }, this.config.reportInterval);
  }

  private stopReporting(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }

  public recordMetric(
    name: string,
    value: number,
    type: 'timing' | 'counter' | 'gauge',
    tags?: Record<string, string>
  ): void {
    // Aplicar sample rate
    if (Math.random() > this.config.sampleRate) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      type,
      tags,
    };

    this.metrics.push(metric);

    // Manter apenas os últimos N métricas
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }

    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('Performance metric:', metric);
    }
  }

  public startTiming(name: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(name, duration, 'timing');
    };
  }

  public measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const endTiming = this.startTiming(name);

    return fn().finally(() => {
      endTiming();
    });
  }

  public measureSync<T>(name: string, fn: () => T): T {
    const endTiming = this.startTiming(name);

    try {
      return fn();
    } finally {
      endTiming();
    }
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((metric) => metric.name === name);
    }
    return [...this.metrics];
  }

  public getWebVitals(): WebVitals | null {
    const fcp = this.metrics.find((m) => m.name === 'FCP')?.value || 0;
    const lcp = this.metrics.find((m) => m.name === 'LCP')?.value || 0;
    const fid = this.metrics.find((m) => m.name === 'FID')?.value || 0;
    const cls = this.metrics.find((m) => m.name === 'CLS')?.value || 0;
    const ttfb = this.metrics.find((m) => m.name === 'TTFB')?.value || 0;

    if (fcp === 0 && lcp === 0 && fid === 0 && cls === 0 && ttfb === 0) {
      return null;
    }

    return { FCP: fcp, LCP: lcp, FID: fid, CLS: cls, TTFB: ttfb };
  }

  public getPerformanceScore(): number {
    const webVitals = this.getWebVitals();
    if (!webVitals) return 0;

    // Calcular score baseado nos Web Vitals
    let score = 100;

    // FCP (First Contentful Paint) - Ideal: < 1.8s
    if (webVitals.FCP > 3000) score -= 20;
    else if (webVitals.FCP > 1800) score -= 10;

    // LCP (Largest Contentful Paint) - Ideal: < 2.5s
    if (webVitals.LCP > 4000) score -= 20;
    else if (webVitals.LCP > 2500) score -= 10;

    // FID (First Input Delay) - Ideal: < 100ms
    if (webVitals.FID > 300) score -= 20;
    else if (webVitals.FID > 100) score -= 10;

    // CLS (Cumulative Layout Shift) - Ideal: < 0.1
    if (webVitals.CLS > 0.25) score -= 20;
    else if (webVitals.CLS > 0.1) score -= 10;

    // TTFB (Time to First Byte) - Ideal: < 600ms
    if (webVitals.TTFB > 1000) score -= 20;
    else if (webVitals.TTFB > 600) score -= 10;

    return Math.max(0, score);
  }

  public getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  public getMetricPercentile(name: string, percentile: number): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sorted = metrics.map((m) => m.value).sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  private async reportMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;

    try {
      // Aqui você pode enviar para seu serviço de analytics
      // Por exemplo: Google Analytics, Mixpanel, etc.

      if (import.meta.env.DEV) {
        console.log('Reporting metrics:', this.metrics);
      }

      // Limpar métricas após reportar
      this.metrics = [];
    } catch (error) {
      console.error('Failed to report metrics:', error);
    }
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.reportInterval) {
      this.stopReporting();
      this.startReporting();
    }
  }

  public destroy(): void {
    this.stopReporting();
    this.clearMetrics();
  }
}

// Instância singleton
export const performanceMonitor = PerformanceMonitor.getInstance();

// Funções utilitárias
export const measurePerformance = <T>(name: string, fn: () => T): T => {
  return performanceMonitor.measureSync(name, fn);
};

export const measureAsyncPerformance = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.measureAsync(name, fn);
};

export const startPerformanceTimer = (name: string) => {
  return performanceMonitor.startTiming(name);
};

export const recordPerformanceMetric = (
  name: string,
  value: number,
  type: 'timing' | 'counter' | 'gauge' = 'timing',
  tags?: Record<string, string>
) => {
  performanceMonitor.recordMetric(name, value, type, tags);
};

// Hook para React
export const usePerformanceMonitor = () => {
  return {
    measurePerformance,
    measureAsyncPerformance,
    startTimer: startPerformanceTimer,
    recordMetric: recordPerformanceMetric,
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getWebVitals: performanceMonitor.getWebVitals.bind(performanceMonitor),
    getPerformanceScore: performanceMonitor.getPerformanceScore.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor),
  };
};
