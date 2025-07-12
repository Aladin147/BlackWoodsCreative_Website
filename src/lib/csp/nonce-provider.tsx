/**
 * Enhanced CSP Nonce Provider for Next.js 15
 * Provides secure nonce distribution for better Framer Motion compatibility
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface NonceContextType {
  nonce: string | null;
  isLoading: boolean;
  error: string | null;
  refreshNonce: () => Promise<void>;
}

const NonceContext = createContext<NonceContextType>({
  nonce: null,
  isLoading: true,
  error: null,
  refreshNonce: async () => {
    // Default implementation - will be overridden by provider
  },
});

interface NonceProviderProps {
  children: React.ReactNode;
  initialNonce?: string;
}

export function NonceProvider({ children, initialNonce }: NonceProviderProps) {
  const [nonce, setNonce] = useState<string | null>(initialNonce ?? null);
  const [isLoading, setIsLoading] = useState(!initialNonce);
  const [error, setError] = useState<string | null>(null);

  const refreshNonce = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get nonce from server headers (set by middleware)
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch nonce: ${response.status}`);
      }

      // Extract nonce from response headers
      const nonceFromHeader = response.headers.get('x-nonce');
      if (nonceFromHeader) {
        setNonce(nonceFromHeader);
      } else {
        // Fallback: generate client-side nonce (less secure but functional)
        const clientNonce = generateClientNonce();
        setNonce(clientNonce);

        if (process.env.NODE_ENV !== 'production') {
          console.warn('CSP: Using client-side nonce generation as fallback');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);

      if (process.env.NODE_ENV !== 'production') {
        console.error('CSP Nonce Provider error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialNonce) {
      refreshNonce();
    }
  }, [initialNonce, refreshNonce]);

  // Auto-refresh nonce periodically for enhanced security
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const interval = setInterval(refreshNonce, 30 * 60 * 1000); // 30 minutes
      return () => clearInterval(interval);
    }
    return undefined;
  }, [refreshNonce]);

  const contextValue: NonceContextType = {
    nonce,
    isLoading,
    error,
    refreshNonce,
  };

  return <NonceContext.Provider value={contextValue}>{children}</NonceContext.Provider>;
}

// Hook to use nonce in components
export function useNonce() {
  const context = useContext(NonceContext);
  if (!context) {
    throw new Error('useNonce must be used within a NonceProvider');
  }
  return context;
}

// Enhanced hook specifically for Framer Motion components
export function useFramerNonce() {
  const { nonce, isLoading } = useNonce();

  // Return nonce for use in Framer Motion style attributes
  return {
    nonce,
    isLoading,
    // Helper to create nonce-compatible style objects
    createNonceStyle: (styles: React.CSSProperties) => ({
      ...styles,
      // Add nonce as data attribute for CSP compliance
      ...(nonce && { 'data-nonce': nonce }),
    }),
    // Helper to create nonce-compatible motion props
    createMotionProps: (props: Record<string, unknown>) => ({
      ...props,
      // Add nonce to motion component props
      ...(nonce && { 'data-motion-nonce': nonce }),
    }),
  };
}

// Client-side nonce generation (fallback only)
function generateClientNonce(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(24);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, Array.from(array)))
        .replace(/[+/]/g, char => (char === '+' ? '-' : '_'))
        .replace(/=/g, '');
    }

    // Fallback for environments without crypto
    const fallbackArray = new Uint8Array(24);
    for (let i = 0; i < fallbackArray.length; i++) {
      fallbackArray[i] = Math.floor(Math.random() * 256);
    }
    return btoa(String.fromCharCode.apply(null, Array.from(fallbackArray)))
      .replace(/[+/]/g, char => {
        // Safe character replacement with validation
        return char === '+' ? '-' : (char === '/' ? '_' : char);
      })
      .replace(/=/g, '');
  } catch {
    // Last resort: timestamp-based nonce (not cryptographically secure)
    return btoa(`fallback-${Date.now()}-${Math.random()}`)
      .replace(/[+/]/g, char => (char === '+' ? '-' : '_'))
      .replace(/=/g, '');
  }
}

// Server-side nonce extraction utility
export function extractNonceFromHeaders(headers: Headers): string | null {
  return headers.get('x-nonce') ?? null;
}

// Utility to validate nonce format
export function isValidNonce(nonce: string): boolean {
  // Check if nonce is a valid base64url string with appropriate length
  const base64urlPattern = /^[A-Za-z0-9_-]+$/;
  return base64urlPattern.test(nonce) && nonce.length >= 16 && nonce.length <= 64;
}

// Enhanced CSP meta tag generator for server-side rendering
export function generateCSPMetaTag(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' ${isDevelopment ? "'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}' 'unsafe-hashes' https://fonts.googleapis.com ${isDevelopment ? "'unsafe-inline'" : ''}`,
    "img-src 'self' data: blob: https://images.unsplash.com https://www.blackwoodscreative.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.resend.com https://formspree.io",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://formspree.io",
    "frame-ancestors 'none'",
    'block-all-mixed-content',
    'upgrade-insecure-requests',
  ];

  return cspDirectives.join('; ');
}
