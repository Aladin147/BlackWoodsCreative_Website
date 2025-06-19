/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { useCSRFProtection } from '../useCSRFProtection';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock console methods
const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

describe('useCSRFProtection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    
    // Clear any existing meta tags
    const existingMeta = document.querySelector('meta[name="csrf-token"]');
    if (existingMeta) {
      existingMeta.remove();
    }
  });

  describe('Token Retrieval', () => {
    it('retrieves CSRF token from meta tag when available', async () => {
      // Add meta tag to document
      const metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      metaTag.content = 'meta-token-123';
      document.head.appendChild(metaTag);

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBe('meta-token-123');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches CSRF token from API when meta tag not available', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'api-token-456' }),
      });

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBe('api-token-456');
      expect(mockFetch).toHaveBeenCalledWith('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
      });
    });

    it('handles API fetch failure gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to retrieve CSRF token');
    });

    it('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error retrieving CSRF token:',
        expect.any(Error)
      );
    });
  });

  describe('Protected Request Helper', () => {
    it('makes protected requests with CSRF token', async () => {
      // Setup token
      const metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      metaTag.content = 'test-token-789';
      document.head.appendChild(metaTag);

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // Make protected request
      await result.current.makeProtectedRequest('/api/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: expect.any(Headers),
        credentials: 'include',
      });

      // Check headers
      const callArgs = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const headers = callArgs[1].headers;
      expect(headers.get('X-CSRF-Token')).toBe('test-token-789');
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('throws error when token not available', async () => {
      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Token should be null since no meta tag and no API response
      expect(result.current.csrfToken).toBeNull();

      await expect(
        result.current.makeProtectedRequest('/api/test')
      ).rejects.toThrow('CSRF token not available');
    });

    it('preserves existing headers in protected requests', async () => {
      // Setup token
      const metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      metaTag.content = 'test-token-abc';
      document.head.appendChild(metaTag);

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      mockFetch.mockResolvedValue({ ok: true });

      // Make request with custom headers
      await result.current.makeProtectedRequest('/api/test', {
        method: 'POST',
        headers: {
          'Custom-Header': 'custom-value',
          'Authorization': 'Bearer token',
        },
      });

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1].headers;
      
      expect(headers.get('X-CSRF-Token')).toBe('test-token-abc');
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Custom-Header')).toBe('custom-value');
      expect(headers.get('Authorization')).toBe('Bearer token');
    });
  });

  describe('Protected Headers Helper', () => {
    it('returns headers with CSRF token', async () => {
      // Setup token
      const metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      metaTag.content = 'header-token-123';
      document.head.appendChild(metaTag);

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const headers = result.current.getProtectedHeaders();

      expect(headers).toEqual({
        'X-CSRF-Token': 'header-token-123',
        'Content-Type': 'application/json',
      });
    });

    it('throws error when token not available', async () => {
      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(() => result.current.getProtectedHeaders()).toThrow(
        'CSRF token not available'
      );
    });
  });

  describe('Loading States', () => {
    it('starts with loading state', () => {
      const { result } = renderHook(() => useCSRFProtection());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.csrfToken).toBeNull();
    });

    it('updates loading state after token retrieval', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'loading-test-token' }),
      });

      const { result } = renderHook(() => useCSRFProtection());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBe('loading-test-token');
    });

    it('updates loading state even on error', async () => {
      mockFetch.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useCSRFProtection());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty meta tag content', async () => {
      const metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      metaTag.content = '';
      document.head.appendChild(metaTag);

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ token: 'fallback-token' }),
      });

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should fall back to API since meta tag is empty
      expect(result.current.csrfToken).toBe('fallback-token');
      expect(mockFetch).toHaveBeenCalled();
    });

    it('handles malformed API response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ invalidField: 'no-token' }),
      });

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBeNull();
    });

    it('handles JSON parsing errors', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const { result } = renderHook(() => useCSRFProtection());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.csrfToken).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
