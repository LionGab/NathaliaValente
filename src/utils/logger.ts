/**
 * Logger Service - Centralized logging utility
 * Only logs in development, prevents console pollution in production
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private isDev = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `[${timestamp}] ${level.toUpperCase()} ${context} ${message}`;
  }

  log(message: string, options?: LogOptions): void {
    if (this.isDev) {
      console.log(this.formatMessage('log', message, options), options?.data || '');
    }
  }

  info(message: string, options?: LogOptions): void {
    if (this.isDev) {
      console.info(this.formatMessage('info', message, options), options?.data || '');
    }
  }

  warn(message: string, options?: LogOptions): void {
    if (this.isDev) {
      console.warn(this.formatMessage('warn', message, options), options?.data || '');
    }
  }

  error(message: string, options?: LogOptions): void {
    // Errors are always logged, even in production
    console.error(this.formatMessage('error', message, options), options?.data || '');

    // Send to error tracking service in production
    if (!this.isDev) {
      this.sendToErrorTracking(message, options);
    }
  }

  debug(message: string, options?: LogOptions): void {
    if (this.isDev) {
      console.debug(this.formatMessage('debug', message, options), options?.data || '');
    }
  }

  // Group logging for better organization
  group(label: string): void {
    if (this.isDev) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.isDev) {
      console.groupEnd();
    }
  }

  // Performance logging
  time(label: string): void {
    if (this.isDev) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDev) {
      console.timeEnd(label);
    }
  }

  /**
   * Send error to tracking service
   */
  private sendToErrorTracking(message: string, options?: LogOptions): void {
    try {
      const errorData = {
        message,
        level: 'error',
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        data: options?.data,
        context: options?.context
      };

      // Send to error tracking endpoint
      if (typeof window !== 'undefined' && window.navigator.sendBeacon) {
        window.navigator.sendBeacon(
          '/api/errors',
          JSON.stringify(errorData)
        );
      }
    } catch (trackingError) {
      // Don't log tracking errors to avoid infinite loops
      console.error('Failed to send error to tracking service:', trackingError);
    }
  }
}

export const logger = new Logger();

// Convenience exports
export const log = logger.log.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);
export const debug = logger.debug.bind(logger);
