/**
 * Monitoring and Analytics Service
 * Web Vitals, Error Tracking, User Analytics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// ============================================
// WEB VITALS MONITORING
// ============================================

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

/**
 * Initialize Web Vitals monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */
export const initWebVitals = (onMetric?: (metric: WebVitalsMetric) => void) => {
  const sendToAnalytics = (metric: Metric) => {
    const vitalsMetric: WebVitalsMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: Math.round(metric.value),
        rating: metric.rating,
      });
    }

    // Send to callback if provided
    if (onMetric) {
      onMetric(vitalsMetric);
    }

    // Send to analytics endpoint
    sendWebVital(vitalsMetric);
  };

  // Track all Core Web Vitals
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
};

/**
 * Send Web Vital to analytics endpoint
 */
const sendWebVital = (metric: WebVitalsMetric) => {
  // Use Navigator.sendBeacon for reliable delivery
  if (navigator.sendBeacon) {
    const body = JSON.stringify({
      type: 'web-vital',
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Send to your analytics endpoint
    const endpoint = '/api/analytics/web-vitals';
    navigator.sendBeacon(endpoint, body);
  }
};

/**
 * Get Web Vitals thresholds
 */
export const getWebVitalsThresholds = () => ({
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 }, // First Input Delay
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
});

// ============================================
// ERROR TRACKING
// ============================================

export interface ErrorEvent {
  message: string;
  stack?: string;
  componentStack?: string;
  source: 'javascript' | 'react' | 'network' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  metadata?: Record<string, any>;
}

/**
 * Initialize error tracking
 */
export const initErrorTracking = () => {
  // Global JavaScript error handler
  window.addEventListener('error', (event) => {
    logError({
      message: event.message,
      stack: event.error?.stack,
      source: 'javascript',
      severity: 'high',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logError({
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      source: 'javascript',
      severity: 'high',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata: {
        promise: event.promise,
        reason: event.reason,
      },
    });
  });

  if (import.meta.env.DEV) {
    console.log('[Monitoring] Error tracking initialized');
  }
};

/**
 * Log error to tracking service
 */
export const logError = (error: ErrorEvent) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('[Error Tracking]', error);
  }

  // Send to error tracking endpoint
  if (navigator.sendBeacon) {
    const body = JSON.stringify({
      type: 'error',
      ...error,
    });

    const endpoint = '/api/analytics/errors';
    navigator.sendBeacon(endpoint, body);
  }

  // You can also send to Sentry, LogRocket, etc.
  // if (window.Sentry) {
  //   window.Sentry.captureException(new Error(error.message), {
  //     extra: error.metadata,
  //   });
  // }
};

/**
 * React Error Boundary error logger
 */
export const logReactError = (error: Error, errorInfo: { componentStack: string }) => {
  logError({
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    source: 'react',
    severity: 'high',
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  });
};

// ============================================
// PERFORMANCE MONITORING
// ============================================

export interface PerformanceMetrics {
  dns: number;
  tcp: number;
  request: number;
  response: number;
  domParsing: number;
  domContentLoaded: number;
  resourcesLoaded: number;
  totalLoadTime: number;
}

/**
 * Get page load performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetrics | null => {
  if (!window.performance || !window.performance.timing) {
    return null;
  }

  const timing = window.performance.timing;
  const navigationStart = timing.navigationStart;

  return {
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    request: timing.responseStart - timing.requestStart,
    response: timing.responseEnd - timing.responseStart,
    domParsing: timing.domInteractive - timing.domLoading,
    domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
    resourcesLoaded: timing.loadEventEnd - timing.loadEventStart,
    totalLoadTime: timing.loadEventEnd - navigationStart,
  };
};

/**
 * Monitor resource loading times
 */
export const monitorResourcePerformance = () => {
  if (!window.performance || !window.performance.getEntriesByType) {
    return;
  }

  const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  const slowResources = resources
    .filter((resource) => resource.duration > 1000) // Resources taking > 1s
    .map((resource) => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize,
      type: resource.initiatorType,
    }));

  if (slowResources.length > 0 && import.meta.env.DEV) {
    console.warn('[Performance] Slow resources detected:', slowResources);
  }

  return slowResources;
};

// ============================================
// USER ANALYTICS
// ============================================

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

/**
 * Track custom analytics event
 */
export const trackEvent = (event: AnalyticsEvent) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event);
  }

  // Send to analytics endpoint
  if (navigator.sendBeacon) {
    const body = JSON.stringify({
      ...event,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    const endpoint = '/api/analytics/events';
    navigator.sendBeacon(endpoint, body);
  }

  // You can also send to Google Analytics, Mixpanel, etc.
  // if (window.gtag) {
  //   window.gtag('event', event.action, {
  //     event_category: event.category,
  //     event_label: event.label,
  //     value: event.value,
  //   });
  // }
};

/**
 * Track page view
 */
export const trackPageView = (path: string) => {
  trackEvent({
    event: 'page_view',
    category: 'navigation',
    action: 'view',
    label: path,
    metadata: {
      title: document.title,
      referrer: document.referrer,
    },
  });
};

/**
 * Track user interaction
 */
export const trackInteraction = (element: string, action: string, metadata?: Record<string, any>) => {
  trackEvent({
    event: 'user_interaction',
    category: 'engagement',
    action,
    label: element,
    metadata,
  });
};

// ============================================
// SESSION TRACKING
// ============================================

let sessionId: string | null = null;
let sessionStart: number | null = null;

/**
 * Initialize session tracking
 */
export const initSessionTracking = () => {
  // Generate or retrieve session ID
  sessionId = sessionStorage.getItem('session_id');

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('session_id', sessionId);
  }

  sessionStart = Date.now();

  // Track session start
  trackEvent({
    event: 'session_start',
    category: 'session',
    action: 'start',
    metadata: {
      sessionId,
      isNewSession: !sessionStorage.getItem('session_id'),
    },
  });

  // Track session end on page unload
  window.addEventListener('beforeunload', () => {
    if (sessionStart) {
      const duration = Date.now() - sessionStart;

      trackEvent({
        event: 'session_end',
        category: 'session',
        action: 'end',
        value: duration,
        metadata: {
          sessionId,
          durationMs: duration,
        },
      });
    }
  });
};

/**
 * Generate unique session ID
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current session ID
 */
export const getSessionId = (): string | null => {
  return sessionId;
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize all monitoring services
 */
export const initMonitoring = () => {
  try {
    initWebVitals();
    initErrorTracking();
    initSessionTracking();

    if (import.meta.env.DEV) {
      console.log('[Monitoring] All services initialized successfully');
    }
  } catch (error) {
    console.error('[Monitoring] Failed to initialize:', error);
  }
};
