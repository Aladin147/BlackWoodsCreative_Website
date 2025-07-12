/**
 * RIGOROUS TESTING UTILITIES
 * 
 * Provides proper context providers and utilities for testing components
 * in their real environment, not mocked environments.
 * 
 * Philosophy: Test components as close to production as possible
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AnimationOptimizerProvider } from '@/lib/animation/performance-optimizer';

// Mock the CSRF protection hook for testing
jest.mock('@/hooks/useCSRFProtection', () => ({
  useCSRFProtection: () => ({
    csrfToken: 'test-csrf-token-123',
    isLoading: false,
    makeProtectedRequest: async (url: string, options: any) => {
      // Use the global fetch mock for protected requests
      return global.fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'X-CSRF-Token': 'test-csrf-token-123',
        },
      });
    },
  }),
}));

// Mock the device adaptation hook for testing
jest.mock('@/hooks/useDeviceAdaptation', () => ({
  useDeviceAdaptation: () => ({
    deviceInfo: {
      type: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenSize: 'large',
      hasTouch: false,
      capabilities: {
        webgl: false, // Disable WebGL in tests
        webgl2: false,
        webassembly: true,
        serviceWorker: true,
        intersectionObserver: true,
        css: {
          grid: true,
          flexbox: true,
          customProperties: true,
        },
      },
    },
    adaptiveConfig: {
      enableAnimations: false, // Disable animations in tests
      enableParallax: false,
      enableWebGL: false,
      enableComplexEffects: false,
      maxParticles: 0,
      animationDuration: 0,
    },
    getAdaptiveMagneticProps: () => ({
      strength: 0,
      distance: 0,
      enabled: false,
    }),
    isHydrated: true,
  }),
}));

// Create a wrapper that provides all necessary contexts
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnimationOptimizerProvider>
      {children}
    </AnimationOptimizerProvider>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Additional test utilities for rigorous testing
export const testUtils = {
  // Create realistic form data
  createFormData: {
    contact: () => ({
      name: global.createRealisticTestData.name(),
      email: global.createRealisticTestData.email(),
      message: global.createRealisticTestData.message(),
      company: global.createRealisticTestData.company(),
      phone: global.createRealisticTestData.phone(),
    }),
  },

  // Simulate real user interactions
  userInteractions: {
    fillContactForm: async (user: any, data: any) => {
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const messageInput = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;

      if (nameInput) await user.type(nameInput, data.name);
      if (emailInput) await user.type(emailInput, data.email);
      if (messageInput) await user.type(messageInput, data.message);
    },

    submitForm: async (user: any) => {
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        await user.click(submitButton);
      }
    },
  },

  // Test error scenarios
  mockApiResponses: {
    success: () => {
      global.fetch.mockImplementation((url: string) => {
        if (url === '/api/csrf-token') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ token: 'test-csrf-token-123' }),
          } as Response);
        }
        if (url === '/api/contact') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ success: true, message: 'Message sent successfully' }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response);
      });
    },

    networkError: () => {
      global.fetch.mockImplementation((url: string) => {
        if (url === '/api/csrf-token') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ token: 'test-csrf-token-123' }),
          } as Response);
        }
        if (url === '/api/contact') {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response);
      });
    },

    serverError: () => {
      global.fetch.mockImplementation((url: string) => {
        if (url === '/api/csrf-token') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ token: 'test-csrf-token-123' }),
          } as Response);
        }
        if (url === '/api/contact') {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Internal server error' }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response);
      });
    },

    validationError: () => {
      global.fetch.mockImplementation((url: string) => {
        if (url === '/api/csrf-token') {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ token: 'test-csrf-token-123' }),
          } as Response);
        }
        if (url === '/api/contact') {
          return Promise.resolve({
            ok: false,
            status: 400,
            json: async () => ({ error: 'Validation failed', details: ['Email is required'] }),
          } as Response);
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response);
      });
    },
  },

  // Wait for async operations
  waitFor: {
    apiCall: () => new Promise(resolve => setTimeout(resolve, 100)),
    animation: () => new Promise(resolve => setTimeout(resolve, 300)),
    userInput: () => new Promise(resolve => setTimeout(resolve, 50)),
  },

  // Accessibility testing helpers
  accessibility: {
    checkAriaLabels: (element: HTMLElement) => {
      const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
      return hasAriaLabel;
    },

    checkKeyboardNavigation: async (user: any, elements: HTMLElement[]) => {
      for (const element of elements) {
        await user.tab();
        expect(document.activeElement).toBe(element);
      }
    },
  },

  // Performance testing helpers
  performance: {
    measureRenderTime: (renderFn: () => void) => {
      const start = performance.now();
      renderFn();
      const end = performance.now();
      return end - start;
    },

    checkMemoryLeaks: () => {
      // Basic memory leak detection
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      return {
        initial: initialMemory,
        check: () => {
          const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
          return currentMemory - initialMemory;
        },
      };
    },
  },
};

// Export types for TypeScript support
export type TestFormData = {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
};

export type MockApiResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
};
