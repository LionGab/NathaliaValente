/**
 * Monitoring configuration
 * Centralized config for analytics, error tracking, and performance monitoring
 */

export const MONITORING_CONFIG = {
  // Web Vitals
  webVitals: {
    enabled: true,
    sampleRate: 1.0, // 100% of sessions (reduce in production if needed)
    reportAllChanges: false, // Only report final metrics
  },

  // Error Tracking
  errorTracking: {
    enabled: true,
    sampleRate: 1.0, // 100% of errors
    ignoreErrors: [
      // Errors to ignore
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // Add browser-specific errors to ignore
    ],
    beforeSend: (error: any) => {
      // Filter out errors from browser extensions
      if (error.stack && error.stack.includes('chrome-extension://')) {
        return null;
      }
      return error;
    },
  },

  // Analytics
  analytics: {
    enabled: true,
    trackPageViews: true,
    trackUserInteractions: true,
    trackPerformance: true,
  },

  // Session Tracking
  session: {
    enabled: true,
    timeout: 30 * 60 * 1000, // 30 minutes
  },

  // Endpoints (configure based on your backend)
  endpoints: {
    webVitals: '/api/analytics/web-vitals',
    errors: '/api/analytics/errors',
    events: '/api/analytics/events',
  },

  // Development mode
  dev: {
    logToConsole: import.meta.env.DEV,
    verboseLogging: import.meta.env.DEV,
  },
} as const;

export type MonitoringConfig = typeof MONITORING_CONFIG;
