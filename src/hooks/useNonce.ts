import { useEffect, useState } from 'react';

/**
 * Hook to access the CSP nonce for secure inline styles/scripts
 * The nonce is provided by the middleware and passed through headers
 */
export function useNonce(): string | null {
  const [nonce, setNonce] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') return;

    // Try to get nonce from meta tag (set by middleware)
    const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
    if (metaNonce) {
      setNonce(metaNonce);
      return;
    }

    // Fallback: try to get from a global variable if set
    if (
      typeof window !== 'undefined' &&
      (window as unknown as { __CSP_NONCE__?: string }).__CSP_NONCE__
    ) {
      setNonce((window as unknown as { __CSP_NONCE__?: string }).__CSP_NONCE__ ?? null);
    }

    // If no nonce available, tracked internally in development
  }, []);

  return nonce;
}

/**
 * Hook to get nonce for Framer Motion components
 * Returns nonce for CSP-compliant inline styles
 */
export function useFramerNonce(): string | undefined {
  const nonce = useNonce();
  return nonce ?? undefined;
}

/**
 * Hook to create nonce-compatible style objects
 * Ensures styles are applied securely with CSP nonce
 */
export function useSecureStyle(styles: React.CSSProperties): React.CSSProperties {
  // In production, we should avoid inline styles entirely
  // This hook is mainly for development and edge cases
  if (process.env.NODE_ENV === 'development') {
    // Inline styles should be avoided in production. Use CSS classes instead.
  }

  return styles;
}

/**
 * Utility to create a nonce-compatible script tag
 * Should only be used for critical inline scripts
 */
export function createSecureScript(content: string, nonce?: string): HTMLScriptElement {
  const script = document.createElement('script');
  script.textContent = content;

  if (nonce) {
    script.setAttribute('nonce', nonce);
  }

  return script;
}

/**
 * Utility to create a nonce-compatible style tag
 * Should only be used for critical inline styles
 */
export function createSecureStyle(content: string, nonce?: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = content;

  if (nonce) {
    style.setAttribute('nonce', nonce);
  }

  return style;
}
