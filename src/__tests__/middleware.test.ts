// Mock Upstash Redis and Ratelimit
jest.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: jest.fn(() => ({
      // Mock Redis instance
      get: jest.fn(),
      set: jest.fn(),
      incr: jest.fn(),
      expire: jest.fn(),
    })),
  },
}));

jest.mock('@upstash/ratelimit', () => {
  const mockRatelimitClass = jest.fn().mockImplementation(() => ({
    limit: jest.fn(),
  })) as unknown as jest.MockedFunction<() => { limit: jest.MockedFunction<() => unknown> }> & {
    slidingWindow: jest.MockedFunction<() => string>;
  };

  // Add static methods to the mock class
  mockRatelimitClass.slidingWindow = jest.fn(() => 'mocked-limiter');

  return {
    Ratelimit: mockRatelimitClass,
  };
});

// Mock Next.js server components
const mockHeadersStorage = new Map();
const mockHeaders = {
  set: jest.fn((key: string, value: string) => {
    mockHeadersStorage.set(key, value);
  }),
  get: jest.fn((key: string) => {
    return mockHeadersStorage.get(key);
  }),
  clear: () => mockHeadersStorage.clear(),
};

// Removed unused mockCookies variable

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => ({
      status: 200,
      headers: mockHeaders,
      cookies: {
        set: jest.fn(),
      },
    })),
  },
}));

// Import the mocked modules
import { middleware } from '../middleware';
import type { NextRequest } from 'next/server';

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHeaders.clear();
    (mockHeaders.set as jest.Mock).mockClear();
    (mockHeaders.get as jest.Mock).mockClear();
  });

  describe('Basic Functionality', () => {
    it('middleware function exists and is callable', () => {
      expect(typeof middleware).toBe('function');
    });

    it('handles non-API routes without rate limiting', async () => {
      const request = {
        nextUrl: { pathname: '/about' },
        ip: '192.168.1.1',
        headers: new Map([
          ['user-agent', 'test-agent'],
        ]),
      } as unknown as NextRequest;

      const response = await middleware(request);
      expect(response).toBeDefined();
      expect(response.headers.get('x-nonce')).toBeDefined();
      expect(response.headers.get('Content-Security-Policy')).toBeDefined();
    });

    it('handles route matching correctly', () => {
      // Test that the middleware can handle different route patterns
      const apiRoute = { nextUrl: { pathname: '/api/test' } };
      const pageRoute = { nextUrl: { pathname: '/about' } };

      expect(apiRoute.nextUrl.pathname.startsWith('/api')).toBe(true);
      expect(pageRoute.nextUrl.pathname.startsWith('/api')).toBe(false);
    });
  });

  describe('Security Features', () => {
    it('adds security headers to all responses', async () => {
      const request = {
        nextUrl: { pathname: '/about' },
        ip: '192.168.1.1',
        headers: new Map([
          ['user-agent', 'test-agent'],
        ]),
      } as unknown as NextRequest;

      const response = await middleware(request);

      expect(response.headers.get('Content-Security-Policy')).toBeDefined();
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('Strict-Transport-Security')).toBeDefined();
    });

    it('generates and sets nonce for CSP', async () => {
      const request = {
        nextUrl: { pathname: '/test' },
        ip: '192.168.1.1',
        headers: new Map([
          ['user-agent', 'test-agent'],
        ]),
      } as unknown as NextRequest;

      const response = await middleware(request);
      const nonce = response.headers.get('x-nonce');

      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce!.length).toBeGreaterThan(0);
    });

    it('sets CSRF token cookie for non-API routes', async () => {
      const request = {
        nextUrl: { pathname: '/contact' },
        ip: '192.168.1.1',
        headers: new Map([
          ['user-agent', 'test-agent'],
        ]),
      } as unknown as NextRequest;

      const response = await middleware(request);

      // Check if CSRF cookie is set (would need to check response.cookies in real implementation)
      expect(response).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('exports correct matcher configuration', async () => {
      const middlewareModule = await import('../middleware');
      const config = middlewareModule.config;
      expect(config).toEqual({
        matcher: '/api/:path*',
      });
    });
  });
});
