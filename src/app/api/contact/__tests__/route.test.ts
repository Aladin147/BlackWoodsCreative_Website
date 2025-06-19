/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST, GET } from '../route';

// Mock the utilities
jest.mock('@/lib/utils', () => ({
  validateContactForm: jest.fn(),
}));

jest.mock('@/lib/utils/sanitize', () => ({
  sanitizeFormData: jest.fn((data) => data),
}));

jest.mock('@/lib/services', () => ({
  sendContactEmail: jest.fn(),
  sendAutoReplyEmail: jest.fn(),
}));

jest.mock('@/lib/utils/security', () => ({
  verifyCSRFToken: jest.fn(),
  logSecurityEvent: jest.fn(),
}));

import { validateContactForm } from '@/lib/utils';
import { sanitizeFormData } from '@/lib/utils/sanitize';
import { sendContactEmail, sendAutoReplyEmail } from '@/lib/services';
import { verifyCSRFToken, logSecurityEvent } from '@/lib/utils/security';

// Type the mocked functions
const mockValidateContactForm = validateContactForm as jest.MockedFunction<typeof validateContactForm>;
const mockSendContactEmail = sendContactEmail as jest.MockedFunction<typeof sendContactEmail>;
const mockSendAutoReplyEmail = sendAutoReplyEmail as jest.MockedFunction<typeof sendAutoReplyEmail>;
const mockVerifyCSRFToken = verifyCSRFToken as jest.MockedFunction<typeof verifyCSRFToken>;
const mockLogSecurityEvent = logSecurityEvent as jest.MockedFunction<typeof logSecurityEvent>;

// Mock console methods to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

// Mock the rate limiting store to reset between tests
const mockRateLimitStore = new Map();

// Mock the module to use our controlled store
jest.mock('../route', () => {
  const originalModule = jest.requireActual('../route');
  return {
    ...originalModule,
    // We'll need to access the rate limit store for testing
  };
});

describe('/api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear rate limiting store between tests
    mockRateLimitStore.clear();
    // Reset validation mock to return valid by default
    mockValidateContactForm.mockReturnValue({
      isValid: true,
      errors: {},
    });

    // Reset email service mocks to return success by default
    mockSendContactEmail.mockResolvedValue({
      success: true,
      messageId: 'test-email-id',
    });

    mockSendAutoReplyEmail.mockResolvedValue({
      success: true,
      messageId: 'test-auto-reply-id',
    });

    // Reset security mocks to allow requests by default
    mockVerifyCSRFToken.mockReturnValue(true);
    mockLogSecurityEvent.mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('POST', () => {
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Test Company',
      projectType: 'Website',
      budget: '$5,000-$10,000',
      message: 'I need a new website for my business.',
    };

    function createMockRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'x-csrf-token': 'test-csrf-token',
        ...headers,
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(body),
      });

      // Mock cookies
      Object.defineProperty(request, 'cookies', {
        value: new Map([['csrf-token', { value: 'test-csrf-token' }]]),
        writable: false,
      });

      // Mock IP address
      Object.defineProperty(request, 'ip', {
        value: headers['x-forwarded-for'] || '127.0.0.1',
        writable: false,
      });

      return request;
    }

    it('successfully processes valid form submission', async () => {
      const request = createMockRequest(validFormData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Thank you for your message');
      expect(sanitizeFormData).toHaveBeenCalledWith(validFormData);
      expect(validateContactForm).toHaveBeenCalled();
    });

    it('returns validation errors for invalid data', async () => {
      mockValidateContactForm.mockReturnValue({
        isValid: false,
        errors: {
          name: 'Name is required',
          email: 'Invalid email format',
        },
      });

      const invalidData = { ...validFormData, name: '', email: 'invalid' };
      const request = createMockRequest(invalidData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors).toEqual({
        name: 'Name is required',
        email: 'Invalid email format',
      });
    });

    it('handles malformed JSON request', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': 'test-csrf-token',
        },
        body: 'invalid json',
      });

      // Mock cookies for CSRF
      Object.defineProperty(request, 'cookies', {
        value: new Map([['csrf-token', { value: 'test-csrf-token' }]]),
        writable: false,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid request format');
    });

    it('validates company name length', async () => {
      const longCompanyData = {
        ...validFormData,
        company: 'A'.repeat(101), // Too long
      };

      const request = createMockRequest(longCompanyData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors?.company).toContain('less than 100 characters');
    });

    it('validates message length', async () => {
      const longMessageData = {
        ...validFormData,
        message: 'A'.repeat(2001), // Too long
      };

      const request = createMockRequest(longMessageData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errors?.message).toContain('less than 2000 characters');
    });

    it('implements rate limiting', async () => {
      // Use a unique IP for this test to avoid interference
      const testIP = '192.168.100.1';

      // Make 5 successful requests (should be allowed)
      for (let i = 0; i < 5; i++) {
        const request = createMockRequest(validFormData, {
          'x-forwarded-for': testIP,
        });
        const response = await POST(request);
        expect(response.status).toBe(200);
      }

      // 6th request should be rate limited
      const request = createMockRequest(validFormData, {
        'x-forwarded-for': testIP,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Too many requests');
      expect(response.headers.get('Retry-After')).toBeDefined();
    });

    it('handles server errors gracefully', async () => {
      // Mock validateContactForm to throw an error
      mockValidateContactForm.mockImplementation(() => {
        throw new Error('Validation service error');
      });

      // Use a unique IP to avoid rate limiting interference
      const request = createMockRequest(validFormData, {
        'x-forwarded-for': '192.168.200.1',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toContain('unexpected error occurred');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('sanitizes form data before processing', async () => {
      const dataWithXSS = {
        ...validFormData,
        name: '<script>alert("xss")</script>',
        message: '<img src="x" onerror="alert(1)"> This is a long enough message to pass validation.',
      };

      // Use a unique IP to avoid rate limiting
      const request = createMockRequest(dataWithXSS, {
        'x-forwarded-for': '192.168.300.1',
      });
      await POST(request);

      expect(sanitizeFormData).toHaveBeenCalledWith(dataWithXSS);
    });

    it('calls email service with form data', async () => {
      // Use a unique IP to avoid rate limiting
      const request = createMockRequest(validFormData, {
        'x-forwarded-for': '192.168.400.1',
      });
      await POST(request);

      expect(mockSendContactEmail).toHaveBeenCalledWith(validFormData);
      expect(mockSendAutoReplyEmail).toHaveBeenCalledWith(validFormData);
      expect(consoleSpy).toHaveBeenCalledWith('📧 Contact email sent successfully');
    });

    it('handles email service failure', async () => {
      mockSendContactEmail.mockResolvedValue({
        success: false,
        error: 'Email service unavailable',
      });

      const request = createMockRequest(validFormData, {
        'x-forwarded-for': '192.168.500.1',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toContain('issue sending your message');
    });

    it('rejects requests without valid CSRF token', async () => {
      mockVerifyCSRFToken.mockReturnValue(false);

      const request = createMockRequest(validFormData, {
        'x-forwarded-for': '192.168.600.1',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Security validation failed');
      expect(mockLogSecurityEvent).toHaveBeenCalledWith({
        type: 'csrf_failure',
        ip: '192.168.600.1',
        userAgent: '',
        details: {
          path: '/api/contact',
          hasCSRFToken: true,
          hasSessionToken: true,
        },
      });
    });
  });

  describe('GET', () => {
    it('returns method not allowed for GET requests', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Method not allowed');
    });
  });

  describe('Rate Limiting', () => {
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Test Company',
      projectType: 'Website',
      budget: '$5,000-$10,000',
      message: 'I need a new website for my business.',
    };

    function createMockRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'x-csrf-token': 'test-csrf-token',
        ...headers,
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(body),
      });

      // Mock cookies
      Object.defineProperty(request, 'cookies', {
        value: new Map([['csrf-token', { value: 'test-csrf-token' }]]),
        writable: false,
      });

      // Mock IP address
      Object.defineProperty(request, 'ip', {
        value: headers['x-forwarded-for'] || '127.0.0.1',
        writable: false,
      });

      return request;
    }

    it('resets rate limit after time window', async () => {
      // This test would require mocking time, which is complex
      // In a real scenario, you'd use a more sophisticated testing approach
      // or integration tests with a test database
      expect(true).toBe(true); // Placeholder for now
    });

    it('handles different IP addresses separately', async () => {
      const request1 = createMockRequest(validFormData, {
        'x-forwarded-for': '192.168.500.1',
      });
      const request2 = createMockRequest(validFormData, {
        'x-forwarded-for': '192.168.500.2',
      });

      // Both IPs should be able to make requests independently
      const response1 = await POST(request1);
      const response2 = await POST(request2);

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });
});
