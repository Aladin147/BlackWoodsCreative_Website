import React, { useEffect, useState } from 'react';

/**
 * Hook for CSRF protection in forms and API calls
 * Automatically handles CSRF token retrieval and inclusion in requests
 */
export function useCSRFProtection() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get CSRF token from meta tag or API endpoint
    const getCSRFToken = async () => {
      try {
        // First try to get from meta tag (if set by server)
        const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (metaToken) {
          setCSRFToken(metaToken);
          setIsLoading(false);
          return;
        }

        // If not in meta tag, get from API endpoint
        const response = await fetch('/api/csrf-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCSRFToken(data.token || null);
        } else {
          console.warn('Failed to retrieve CSRF token');
          setCSRFToken(null);
        }
      } catch (error) {
        console.error('Error retrieving CSRF token:', error);
        setCSRFToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    getCSRFToken();
  }, []);

  // Helper function to make CSRF-protected API calls
  const makeProtectedRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    const headers = new Headers(options.headers);
    headers.set('X-CSRF-Token', csrfToken);
    headers.set('Content-Type', 'application/json');

    return fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  };

  // Helper function to get headers with CSRF token
  const getProtectedHeaders = (): Record<string, string> => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    return {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    };
  };

  return {
    csrfToken,
    isLoading,
    makeProtectedRequest,
    getProtectedHeaders,
  };
}

/**
 * Higher-order component for CSRF protection
 */
export function withCSRFProtection<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function CSRFProtectedComponent(props: T) {
    const { csrfToken, isLoading } = useCSRFProtection();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bw-accent-gold"></div>
        </div>
      );
    }

    if (!csrfToken) {
      return (
        <div className="text-red-500 p-4">
          Security token unavailable. Please refresh the page.
        </div>
      );
    }

    return <Component {...props} />;
  };
}
