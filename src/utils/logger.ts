/**
 * Logger Service - Centralized logging utility
 *
 * Use this instead of console.log/warn/error for better control
 * and production safety.
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger';
 *
 * // Development only logs
 * logger.dev('[Component] Rendered', { props });
 *
 * // Always logged (production too)
 * logger.error('[API] Request failed', error);
 * logger.warn('[Performance] Slow render detected');
 * ```
 */

type LogLevel = 'dev' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private history: LogEntry[] = [];
  private maxHistorySize = 100;

  /**
   * Log only in development mode
   * Automatically removed in production builds
   */
  dev(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, data ?? '');
      this.addToHistory('dev', message, data);
    }
  }

  /**
   * Log information (shown in all environments)
   * Use sparingly in production
   */
  info(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}] ℹ️ ${message}`, data ?? '');
    this.addToHistory('info', message, data);
  }

  /**
   * Log warnings (shown in all environments)
   */
  warn(message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ⚠️  ${message}`, data ?? '');
    this.addToHistory('warn', message, data);

    // TODO: Send to monitoring service in production
    if (!this.isDevelopment) {
      this.sendToMonitoring('warn', message, data);
    }
  }

  /**
   * Log errors (shown in all environments)
   * Automatically sent to error tracking in production
   */
  error(message: string, error?: unknown): void {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${message}`, error ?? '');
    this.addToHistory('error', message, error);

    // Send to error tracking service in production
    if (!this.isDevelopment) {
      this.sendToMonitoring('error', message, error);
    }
  }

  /**
   * Get recent log history (useful for debugging)
   */
  getHistory(): LogEntry[] {
    return [...this.history];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Add log entry to history
   */
  private addToHistory(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.history.push(entry);

    // Keep only last N entries
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  /**
   * Send logs to monitoring service (Sentry, LogRocket, etc)
   */
  private sendToMonitoring(level: LogLevel, message: string, data?: unknown): void {
    // TODO: Integrate with Sentry or other monitoring service
    // For now, just ensure it's logged to console in production

    if (typeof window !== 'undefined' && (window as any).Sentry) {
      try {
        if (level === 'error') {
          (window as any).Sentry.captureException(data instanceof Error ? data : new Error(message));
        } else {
          (window as any).Sentry.captureMessage(message, level);
        }
      } catch (err) {
        // Fail silently if Sentry is not available
      }
    }
  }

  /**
   * Group logs together (useful for debugging complex flows)
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Log a table (useful for arrays of objects)
   */
  table(data: unknown): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  /**
   * Start a timer
   */
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  /**
   * End a timer and log elapsed time
   */
  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing
export { Logger };
