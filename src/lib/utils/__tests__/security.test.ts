/**
 * @jest-environment node
 */
import {
  generateNonce,
  generateCSRFToken,
  verifyCSRFToken,
  buildCSP,
  getSecurityHeaders,
  sanitizeInput,
  sanitizeEmail,
  auditSecurity,
  logSecurityEvent,
} from '../security';

// Mock console methods
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

describe('Security Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateNonce', () => {
    it('generates a valid base64 nonce', () => {
      const nonce = generateNonce();
      
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
      expect(Buffer.from(nonce, 'base64').toString('base64')).toBe(nonce);
    });

    it('generates unique nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();
      
      expect(nonce1).not.toBe(nonce2);
    });

    it('generates nonces of consistent length', () => {
      const nonces = Array.from({ length: 10 }, () => generateNonce());
      const lengths = nonces.map(n => n.length);
      
      expect(new Set(lengths).size).toBe(1); // All same length
    });
  });

  describe('generateCSRFToken', () => {
    it('generates a valid hex CSRF token', () => {
      const token = generateCSRFToken();
      
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('generates unique CSRF tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyCSRFToken', () => {
    it('verifies matching tokens', () => {
      const token = generateCSRFToken();
      
      expect(verifyCSRFToken(token, token)).toBe(true);
    });

    it('rejects non-matching tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      expect(verifyCSRFToken(token1, token2)).toBe(false);
    });

    it('rejects empty tokens', () => {
      const token = generateCSRFToken();
      
      expect(verifyCSRFToken('', token)).toBe(false);
      expect(verifyCSRFToken(token, '')).toBe(false);
      expect(verifyCSRFToken('', '')).toBe(false);
    });

    it('handles invalid hex tokens gracefully', () => {
      const validToken = generateCSRFToken();
      const invalidToken = 'invalid-hex-token';
      
      expect(() => verifyCSRFToken(validToken, invalidToken)).not.toThrow();
      expect(verifyCSRFToken(validToken, invalidToken)).toBe(false);
    });
  });

  describe('buildCSP', () => {
    it('builds basic CSP without nonce', () => {
      const csp = buildCSP();
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain('block-all-mixed-content');
      expect(csp).toContain('upgrade-insecure-requests');
    });

    it('includes nonce in script-src when provided', () => {
      const nonce = 'test-nonce-123';
      const csp = buildCSP({ nonce });
      
      expect(csp).toContain(`'nonce-${nonce}'`);
    });

    it('includes unsafe-eval in development mode', () => {
      const csp = buildCSP({ isDevelopment: true });
      
      expect(csp).toContain("'unsafe-eval'");
    });

    it('excludes unsafe-eval in production mode', () => {
      const csp = buildCSP({ isDevelopment: false });
      
      expect(csp).not.toContain("'unsafe-eval'");
    });

    it('includes development-specific connect-src in dev mode', () => {
      const csp = buildCSP({ isDevelopment: true });
      
      expect(csp).toContain('ws://localhost:*');
      expect(csp).toContain('wss://localhost:*');
    });

    it('excludes development connect-src in production', () => {
      const csp = buildCSP({ isDevelopment: false });
      
      expect(csp).not.toContain('ws://localhost:*');
      expect(csp).not.toContain('wss://localhost:*');
    });
  });

  describe('getSecurityHeaders', () => {
    it('returns comprehensive security headers', () => {
      const headers = getSecurityHeaders();
      
      expect(headers).toHaveProperty('Content-Security-Policy');
      expect(headers).toHaveProperty('X-Content-Type-Options', 'nosniff');
      expect(headers).toHaveProperty('X-Frame-Options', 'DENY');
      expect(headers).toHaveProperty('X-XSS-Protection', '1; mode=block');
      expect(headers).toHaveProperty('Referrer-Policy', 'strict-origin-when-cross-origin');
      expect(headers).toHaveProperty('Strict-Transport-Security');
      expect(headers).toHaveProperty('Permissions-Policy');
    });

    it('includes nonce in CSP when provided', () => {
      const nonce = 'test-nonce-456';
      const headers = getSecurityHeaders(nonce);
      
      expect(headers['Content-Security-Policy']).toContain(`'nonce-${nonce}'`);
    });

    it('includes HSTS header with proper configuration', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['Strict-Transport-Security']).toContain('max-age=63072000');
      expect(headers['Strict-Transport-Security']).toContain('includeSubDomains');
      expect(headers['Strict-Transport-Security']).toContain('preload');
    });
  });

  describe('sanitizeInput', () => {
    it('removes HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('alert("xss")Hello');
    });

    it('removes javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('alert("xss")');
    });

    it('removes event handlers', () => {
      const input = 'onclick=alert("xss") Hello';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe('alert("xss") Hello');
    });

    it('trims whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeInput(input);
      
      expect(sanitized).toBe('Hello World');
    });

    it('limits input length', () => {
      const input = 'a'.repeat(2000);
      const sanitized = sanitizeInput(input);
      
      expect(sanitized.length).toBe(1000);
    });

    it('handles non-string input', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
      expect(sanitizeInput(123 as any)).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('sanitizes valid email addresses', () => {
      const email = '  TEST@EXAMPLE.COM  ';
      const sanitized = sanitizeEmail(email);
      
      expect(sanitized).toBe('test@example.com');
    });

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        '.test@example.com',
        'test.@example.com',
        '',
      ];

      invalidEmails.forEach(email => {
        expect(sanitizeEmail(email)).toBe('');
      });
    });

    it('handles non-string input', () => {
      expect(sanitizeEmail(null as any)).toBe('');
      expect(sanitizeEmail(undefined as any)).toBe('');
      expect(sanitizeEmail(123 as any)).toBe('');
    });
  });

  describe('auditSecurity', () => {
    it('returns audit results with score', () => {
      const audit = auditSecurity();
      
      expect(audit).toHaveProperty('passed');
      expect(audit).toHaveProperty('score');
      expect(audit).toHaveProperty('issues');
      expect(audit).toHaveProperty('recommendations');
      expect(typeof audit.score).toBe('number');
      expect(audit.score).toBeGreaterThanOrEqual(0);
      expect(audit.score).toBeLessThanOrEqual(100);
    });

    it('detects non-HTTPS requests in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const mockRequest = {
        url: 'http://example.com/test',
        headers: new Map(),
      } as any;
      
      const audit = auditSecurity(mockRequest);
      
      const httpsIssue = audit.issues.find(issue => 
        issue.category === 'transport' && issue.description.includes('HTTPS')
      );
      expect(httpsIssue).toBeDefined();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('calculates score based on issue severity', () => {
      // Mock a request with missing headers to trigger issues
      const mockRequest = {
        url: 'https://example.com/test',
        headers: new Map(),
      } as any;
      
      const audit = auditSecurity(mockRequest);
      
      // Should have medium severity issues for missing headers
      const mediumIssues = audit.issues.filter(issue => issue.severity === 'medium');
      expect(mediumIssues.length).toBeGreaterThan(0);
      expect(audit.score).toBeLessThan(100);
    });
  });

  describe('logSecurityEvent', () => {
    it('logs security events with proper format', () => {
      const event = {
        type: 'csp_violation' as const,
        ip: '192.168.1.1',
        userAgent: 'test-agent',
        details: { violation: 'script-src' },
      };

      logSecurityEvent(event);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '🔒 Security Event:',
        expect.stringContaining('csp_violation')
      );
    });

    it('includes timestamp in log entries', () => {
      const event = {
        type: 'rate_limit' as const,
        ip: '192.168.1.1',
      };
      
      logSecurityEvent(event);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '🔒 Security Event:',
        expect.stringContaining('"timestamp"')
      );
    });

    it('handles events without optional fields', () => {
      const event = {
        type: 'suspicious_activity' as const,
      };
      
      expect(() => logSecurityEvent(event)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
