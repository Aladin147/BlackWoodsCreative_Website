/**
 * Production-ready logging utility
 * Provides structured logging with different levels and conditional output
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): string {
    const timestamp = new Date().toISOString();
    const prefix = this.getLogPrefix(level);

    let formattedMessage = `${prefix} [${timestamp}] ${message}`;

    if (context && Object.keys(context).length > 0) {
      formattedMessage += ` | Context: ${JSON.stringify(context)}`;
    }

    return formattedMessage;
  }

  private getLogPrefix(level: LogLevel): string {
    switch (level) {
      case 'debug':
        return '🐛';
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📝';
    }
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors for critical issues
    if (process.env.NODE_ENV === 'production') {
      return level === 'error';
    }

    // In test environment, only log errors and warnings to avoid noise
    if (this.isTest) {
      return level === 'error' || level === 'warn';
    }

    // In development, log everything except debug (unless explicitly enabled)
    if (level === 'debug') {
      return this.isDevelopment;
    }

    // Log info and warn in development
    return level === 'info' || level === 'warn' || level === 'error';
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      const formattedMessage = this.formatMessage('error', message, context);

      if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(formattedMessage, error);
      } else if (error) {
        // eslint-disable-next-line no-console
        console.error(formattedMessage, error);
      } else {
        // eslint-disable-next-line no-console
        console.error(formattedMessage);
      }
    }
  }

  // API-specific logging methods
  apiSuccess(endpoint: string, context?: Record<string, unknown>): void {
    this.info(`API Success: ${endpoint}`, context);
  }

  apiError(endpoint: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    this.error(`API Error: ${endpoint}`, error, context);
  }

  // Security logging
  security(event: string, context?: Record<string, unknown>): void {
    this.warn(`Security Event: ${event}`, context);
  }

  // Performance logging
  performance(metric: string, value: number, context?: Record<string, unknown>): void {
    this.info(`Performance: ${metric} = ${value}ms`, context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience methods
export const log = {
  debug: (message: string, context?: Record<string, unknown>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, unknown>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, unknown>) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) =>
    logger.error(message, error, context),

  // Specialized logging
  api: {
    success: (endpoint: string, context?: Record<string, unknown>) =>
      logger.apiSuccess(endpoint, context),
    error: (endpoint: string, error?: Error | unknown, context?: Record<string, unknown>) =>
      logger.apiError(endpoint, error, context),
  },

  security: (event: string, context?: Record<string, unknown>) => logger.security(event, context),

  performance: (metric: string, value: number, context?: Record<string, unknown>) =>
    logger.performance(metric, value, context),
};
