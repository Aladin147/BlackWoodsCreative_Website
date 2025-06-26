import { NextRequest, NextResponse } from 'next/server';

import { RequestLogger, getRequestLogger } from '../request-logger';

// Mock NextRequest
function createMockRequest(
  options: {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    ip?: string;
  } = {}
): NextRequest {
  const {
    method = 'GET',
    url = 'https://example.com/test',
    headers = {},
    ip = '127.0.0.1',
  } = options;

  const request = {
    method,
    url,
    ip,
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
    nextUrl: new URL(url),
  } as unknown as NextRequest;

  return request;
}

// Mock NextResponse
function createMockResponse(status = 200): NextResponse {
  const response = {
    status,
    headers: {
      get: (name: string) => (name === 'content-length' ? '1024' : null),
    },
  } as unknown as NextResponse;

  return response;
}

describe('RequestLogger', () => {
  let logger: RequestLogger;

  beforeEach(() => {
    logger = new RequestLogger();
  });

  describe('logRequest', () => {
    it('logs a basic request correctly', () => {
      const request = createMockRequest({
        method: 'POST',
        url: 'https://example.com/api/test?param=value',
        headers: {
          'user-agent': 'Test Browser',
          'content-type': 'application/json',
        },
        ip: '192.168.1.1',
      });

      const requestId = logger.logRequest(request);

      expect(requestId).toMatch(/^req_\d+_[a-z0-9]+$/);

      const logs = logger.getRecentLogs(1);
      expect(logs).toHaveLength(1);

      const logEntry = logs[0]!;
      expect(logEntry.id).toBe(requestId);
      expect(logEntry.method).toBe('POST');
      expect(logEntry.path).toBe('/api/test');
      expect(logEntry.query).toEqual({ param: 'value' });
      expect(logEntry.ip).toBe('192.168.1.1');
      expect(logEntry.userAgent).toBe('Test Browser');
      expect(logEntry.headers['content-type']).toBe('application/json');
    });

    it('includes additional data when provided', () => {
      const request = createMockRequest();
      const additionalData = {
        userId: 'user123',
        sessionId: 'session456',
        securityFlags: {
          suspiciousActivity: true,
          rateLimited: false,
          csrfFailure: false,
          invalidInput: false,
        },
      };

      logger.logRequest(request, additionalData);
      const logs = logger.getRecentLogs(1);
      const logEntry = logs[0]!;

      expect(logEntry.userId).toBe('user123');
      expect(logEntry.sessionId).toBe('session456');
      expect(logEntry.securityFlags?.suspiciousActivity).toBe(true);
    });

    it('filters sensitive headers', () => {
      const request = createMockRequest({
        headers: {
          authorization: 'Bearer secret-token',
          cookie: 'session=secret',
          'content-type': 'application/json',
          'user-agent': 'Test Browser',
        },
      });

      logger.logRequest(request);
      const logs = logger.getRecentLogs(1);
      const logEntry = logs[0]!;

      expect(logEntry.headers['content-type']).toBe('application/json');
      expect(logEntry.headers['user-agent']).toBe('Test Browser');
      expect(logEntry.headers['authorization']).toBeUndefined();
      expect(logEntry.headers['cookie']).toBeUndefined();
    });
  });

  describe('updateRequestResponse', () => {
    it('updates request with response information', () => {
      const request = createMockRequest();
      const response = createMockResponse(200);
      const responseTime = 150;

      const requestId = logger.logRequest(request);
      logger.updateRequestResponse(requestId, response, responseTime);

      const logs = logger.getRecentLogs(1);
      const logEntry = logs[0]!;

      expect(logEntry.statusCode).toBe(200);
      expect(logEntry.responseTime).toBe(150);
      expect(logEntry.responseSize).toBe(1024);
    });

    it('handles error responses', () => {
      const request = createMockRequest();
      const response = createMockResponse(500);
      const responseTime = 250;
      const error = 'Internal server error';

      const requestId = logger.logRequest(request);
      logger.updateRequestResponse(requestId, response, responseTime, error);

      const logs = logger.getRecentLogs(1);
      const logEntry = logs[0]!;

      expect(logEntry.statusCode).toBe(500);
      expect(logEntry.responseTime).toBe(250);
      expect(logEntry.error).toBe('Internal server error');
    });

    it('ignores updates for non-existent request IDs', () => {
      const response = createMockResponse(200);
      const responseTime = 100;

      // Should not throw error
      logger.updateRequestResponse('non-existent-id', response, responseTime);
    });
  });

  describe('metrics calculation', () => {
    beforeEach(() => {
      // Add some test requests
      const requests = [
        { method: 'GET', status: 200, responseTime: 100 },
        { method: 'POST', status: 201, responseTime: 150 },
        { method: 'GET', status: 404, responseTime: 50 },
        { method: 'POST', status: 500, responseTime: 300, error: 'Database error' },
      ];

      requests.forEach(({ method, status, responseTime, error }) => {
        const request = createMockRequest({ method });
        const response = createMockResponse(status);
        const requestId = logger.logRequest(request);
        logger.updateRequestResponse(requestId, response, responseTime, error);
      });
    });

    it('calculates metrics correctly', () => {
      const metrics = logger.getMetrics();

      expect(metrics.totalRequests).toBe(4);
      expect(metrics.successfulRequests).toBe(2);
      expect(metrics.failedRequests).toBe(2);
      expect(metrics.averageResponseTime).toBe(150); // (100+150+50+300)/4
      expect(metrics.slowestRequest).toBe(300);
      expect(metrics.fastestRequest).toBe(50);

      expect(metrics.requestsByMethod).toEqual({
        GET: 2,
        POST: 2,
      });

      expect(metrics.requestsByStatus).toEqual({
        200: 1,
        201: 1,
        404: 1,
        500: 1,
      });

      expect(metrics.errorsByType).toEqual({
        'Database error': 1,
      });
    });
  });

  describe('log filtering and retrieval', () => {
    beforeEach(() => {
      // Add test data
      const testData = [
        { path: '/api/users', status: 200 },
        { path: '/api/posts', status: 404 },
        { path: '/api/users', status: 500, error: 'Server error' },
        { path: '/api/auth', status: 200, securityFlags: { suspiciousActivity: true } },
      ];

      testData.forEach(({ path, status, error, securityFlags }) => {
        const request = createMockRequest({ url: `https://example.com${path}` });
        const response = createMockResponse(status);
        const additionalData = securityFlags ? { securityFlags: {
          suspiciousActivity: securityFlags.suspiciousActivity,
          rateLimited: false,
          csrfFailure: false,
          invalidInput: false,
        } } : {};
        const requestId = logger.logRequest(request, additionalData);
        logger.updateRequestResponse(requestId, response, 100, error);
      });
    });

    it('filters logs by path', () => {
      const userLogs = logger.getLogsByPath('/api/users');
      expect(userLogs).toHaveLength(2);
      expect(userLogs.every(log => log.path === '/api/users')).toBe(true);
    });

    it('filters error logs', () => {
      const errorLogs = logger.getErrorLogs();
      expect(errorLogs).toHaveLength(2);
      expect(errorLogs.every(log => log.statusCode && log.statusCode >= 400)).toBe(true);
    });

    it('filters security logs', () => {
      const securityLogs = logger.getSecurityLogs();
      expect(securityLogs).toHaveLength(1);
      expect(securityLogs[0]?.path).toBe('/api/auth');
    });
  });

  describe('log export', () => {
    beforeEach(() => {
      const request = createMockRequest({
        method: 'POST',
        url: 'https://example.com/api/test',
        headers: { 'user-agent': 'Test Browser' },
      });
      const response = createMockResponse(200);
      const requestId = logger.logRequest(request);
      logger.updateRequestResponse(requestId, response, 100);
    });

    it('exports logs as JSON', () => {
      const jsonExport = logger.exportLogs('json');
      const parsed = JSON.parse(jsonExport);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]?.method).toBe('POST');
      expect(parsed[0]?.path).toBe('/api/test');
    });

    it('exports logs as CSV', () => {
      const csvExport = logger.exportLogs('csv');
      const lines = csvExport.split('\n');

      expect(lines[0]).toContain('id,timestamp,method,path');
      expect(lines[1]).toContain('POST,/api/test');
    });
  });

  describe('clearLogs', () => {
    it('clears all logs and resets metrics', () => {
      const request = createMockRequest();
      logger.logRequest(request);

      expect(logger.getRecentLogs()).toHaveLength(1);
      expect(logger.getMetrics().totalRequests).toBe(1);

      logger.clearLogs();

      expect(logger.getRecentLogs()).toHaveLength(0);
      expect(logger.getMetrics().totalRequests).toBe(0);
    });
  });

  describe('singleton instance', () => {
    it('returns the same instance', () => {
      const logger1 = getRequestLogger();
      const logger2 = getRequestLogger();

      expect(logger1).toBe(logger2);
    });
  });
});
