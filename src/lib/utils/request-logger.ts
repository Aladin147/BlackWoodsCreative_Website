import { NextRequest, NextResponse } from 'next/server';

export interface RequestLogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  ip: string;
  userAgent: string;
  referer?: string;
  statusCode?: number;
  responseTime?: number;
  responseSize?: number;
  error?: string;
  userId?: string;
  sessionId?: string;
  csrfToken?: string;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    reset: number;
  };
  securityFlags?: {
    suspiciousActivity: boolean;
    rateLimited: boolean;
    csrfFailure: boolean;
    invalidInput: boolean;
  };
}

export interface RequestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  slowestRequest: number;
  fastestRequest: number;
  requestsByMethod: Record<string, number>;
  requestsByPath: Record<string, number>;
  requestsByStatus: Record<number, number>;
  errorsByType: Record<string, number>;
  securityEvents: number;
}

class RequestLogger {
  private logs: RequestLogEntry[] = [];
  private metrics: RequestMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    slowestRequest: 0,
    fastestRequest: Infinity,
    requestsByMethod: {},
    requestsByPath: {},
    requestsByStatus: {},
    errorsByType: {},
    securityEvents: 0,
  };
  private maxLogEntries = 1000; // Keep last 1000 requests in memory

  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logRequest(request: NextRequest, additionalData?: Partial<RequestLogEntry>): string {
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();
    const url = new URL(request.url);

    // Extract query parameters
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    // Extract relevant headers (excluding sensitive ones)
    const headers: Record<string, string> = {};
    const allowedHeaders = [
      'accept',
      'accept-language',
      'content-type',
      'content-length',
      'cache-control',
      'connection',
      'host',
      'origin',
      'user-agent',
      'sec-fetch-dest',
      'sec-fetch-mode',
      'sec-fetch-site',
    ];

    allowedHeaders.forEach(header => {
      const value = request.headers.get(header);
      if (value) {
        headers[header] = value;
      }
    });

    const referer = request.headers.get('referer');
    const logEntry: RequestLogEntry = {
      id: requestId,
      timestamp,
      method: request.method,
      url: request.url,
      path: url.pathname,
      query,
      headers,
      ip: request.ip ?? '127.0.0.1',
      userAgent: request.headers.get('user-agent') ?? '',
      ...(referer && { referer }),
      ...additionalData,
    };

    // Add to logs
    this.logs.push(logEntry);

    // Maintain log size limit
    if (this.logs.length > this.maxLogEntries) {
      this.logs.shift();
    }

    // Update metrics
    this.updateMetrics(logEntry);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Request [${requestId}]: ${request.method} ${url.pathname}`);
    }

    return requestId;
  }

  updateRequestResponse(
    requestId: string,
    response: NextResponse,
    responseTime: number,
    error?: string
  ): void {
    const logIndex = this.logs.findIndex(log => log.id === requestId);
    if (logIndex === -1) return;

    const logEntry = this.logs[logIndex];
    if (!logEntry) return;

    logEntry.statusCode = response.status;
    logEntry.responseTime = responseTime;
    if (error) {
      logEntry.error = error;
    }

    // Try to get response size from headers
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      logEntry.responseSize = parseInt(contentLength, 10);
    }

    // Update metrics
    this.updateResponseMetrics(logEntry);

    // Log completion in development
    if (process.env.NODE_ENV === 'development') {
      const status = response.status >= 400 ? '❌' : '✅';
      console.log(
        `${status} Request [${requestId}] completed: ${response.status} in ${responseTime.toFixed(2)}ms`
      );
    }
  }

  private updateMetrics(logEntry: RequestLogEntry): void {
    this.metrics.totalRequests++;

    // Update method counts
    this.metrics.requestsByMethod[logEntry.method] =
      (this.metrics.requestsByMethod[logEntry.method] ?? 0) + 1;

    // Update path counts
    this.metrics.requestsByPath[logEntry.path] =
      (this.metrics.requestsByPath[logEntry.path] ?? 0) + 1;

    // Check for security events
    if (logEntry.securityFlags) {
      if (Object.values(logEntry.securityFlags).some(flag => flag)) {
        this.metrics.securityEvents++;
      }
    }
  }

  private updateResponseMetrics(logEntry: RequestLogEntry): void {
    if (!logEntry.statusCode || !logEntry.responseTime) return;

    // Update status counts
    this.metrics.requestsByStatus[logEntry.statusCode] =
      (this.metrics.requestsByStatus[logEntry.statusCode] ?? 0) + 1;

    // Update success/failure counts
    if (logEntry.statusCode >= 200 && logEntry.statusCode < 400) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;

      // Track error types
      if (logEntry.error) {
        this.metrics.errorsByType[logEntry.error] =
          (this.metrics.errorsByType[logEntry.error] ?? 0) + 1;
      }
    }

    // Update response time metrics
    const responseTime = logEntry.responseTime;
    this.metrics.slowestRequest = Math.max(this.metrics.slowestRequest, responseTime);
    this.metrics.fastestRequest = Math.min(this.metrics.fastestRequest, responseTime);

    // Calculate average response time
    const totalResponseTime = this.logs
      .filter(log => log.responseTime)
      .reduce((sum, log) => sum + (log.responseTime ?? 0), 0);
    const completedRequests = this.logs.filter(log => log.responseTime).length;
    this.metrics.averageResponseTime =
      completedRequests > 0 ? totalResponseTime / completedRequests : 0;
  }

  getMetrics(): RequestMetrics {
    return { ...this.metrics };
  }

  getRecentLogs(limit = 50): RequestLogEntry[] {
    return this.logs.slice(-limit);
  }

  getLogsByPath(path: string, limit = 20): RequestLogEntry[] {
    return this.logs.filter(log => log.path === path).slice(-limit);
  }

  getErrorLogs(limit = 20): RequestLogEntry[] {
    return this.logs.filter(log => log.statusCode && log.statusCode >= 400).slice(-limit);
  }

  getSecurityLogs(limit = 20): RequestLogEntry[] {
    return this.logs
      .filter(log => log.securityFlags && Object.values(log.securityFlags).some(flag => flag))
      .slice(-limit);
  }

  clearLogs(): void {
    this.logs = [];
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      slowestRequest: 0,
      fastestRequest: Infinity,
      requestsByMethod: {},
      requestsByPath: {},
      requestsByStatus: {},
      errorsByType: {},
      securityEvents: 0,
    };
  }

  // Export logs for external analysis
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = [
        'id',
        'timestamp',
        'method',
        'path',
        'statusCode',
        'responseTime',
        'ip',
        'userAgent',
        'error',
      ];
      const csvRows = [
        headers.join(','),
        ...this.logs.map(log =>
          [
            log.id,
            log.timestamp,
            log.method,
            log.path,
            log.statusCode ?? '',
            log.responseTime ?? '',
            log.ip,
            `"${log.userAgent.replace(/"/g, '""')}"`,
            log.error ?? '',
          ].join(',')
        ),
      ];
      return csvRows.join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
let requestLogger: RequestLogger | null = null;

export function getRequestLogger(): RequestLogger {
  requestLogger ??= new RequestLogger();
  return requestLogger;
}

export { RequestLogger };
