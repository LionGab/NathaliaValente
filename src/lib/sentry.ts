import * as Sentry from '@sentry/react';

// Initialize Sentry
export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || 'https://your-sentry-dsn@sentry.io/project-id',
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration({
          // Set sampling rate for performance monitoring
          tracePropagationTargets: ['localhost', 'clubnath.netlify.app', /^\//],
        }),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      // User context
      beforeSend(event) {
        // Filter out sensitive data
        if (event.user) {
          delete event.user.email;
        }
        return event;
      },
    });
  }
};

// Error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Performance monitoring
export const startTransaction = (name: string, op: string) => {
  return Sentry.startSpan({ name, op }, () => {});
};

// Custom error reporting
export const reportError = (error: Error, context?: Record<string, unknown>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key]);
      });
    }
    Sentry.captureException(error);
  });
};

// Performance metrics
export const trackPerformance = (name: string, value: number, unit: string = 'ms') => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `${name}: ${value}${unit}`,
    level: 'info',
  });
};

// User context
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
};

// Clear user context
export const clearUserContext = () => {
  Sentry.setUser(null);
};
