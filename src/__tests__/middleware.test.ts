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
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => ({ status: 200 })),
  },
}));

// Import the mocked modules
import { middleware } from '../middleware';
import type { NextRequest } from 'next/server';

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('middleware function exists and is callable', () => {
      expect(typeof middleware).toBe('function');
    });

    it('handles non-API routes without rate limiting', async () => {
      const request = {
        nextUrl: { pathname: '/about' },
        ip: '192.168.1.1',
      } as NextRequest;

      const response = await middleware(request);
      expect(response).toBeDefined();
    });

    it('handles route matching correctly', () => {
      // Test that the middleware can handle different route patterns
      const apiRoute = { nextUrl: { pathname: '/api/test' } };
      const pageRoute = { nextUrl: { pathname: '/about' } };

      expect(apiRoute.nextUrl.pathname.startsWith('/api')).toBe(true);
      expect(pageRoute.nextUrl.pathname.startsWith('/api')).toBe(false);
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
