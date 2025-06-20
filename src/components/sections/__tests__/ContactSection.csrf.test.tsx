import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import { ContactSection } from '../ContactSection';

// Mock the CSRF protection hook
const mockMakeProtectedRequest = jest.fn();
const mockUseCSRFProtection = jest.fn();

jest.mock('@/hooks/useCSRFProtection', () => ({
  useCSRFProtection: () => mockUseCSRFProtection(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  ScrollReveal: ({ children }: any) => <div>{children}</div>,
  MagneticField: ({ children }: any) => <div>{children}</div>,
  AtmosphericLayer: () => <div data-testid="atmospheric-layer" />,
  ParallaxText: ({ children }: any) => <div>{children}</div>,
}));

// Mock utilities
jest.mock('@/lib/utils/sanitize', () => ({
  sanitizeFormData: jest.fn(data => data),
}));

jest.mock('@/lib/utils', () => ({
  validateEmail: jest.fn(email => email.includes('@')),
}));

describe('ContactSection CSRF Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMakeProtectedRequest.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Message sent successfully' }),
    });

    // Default mock implementation
    mockUseCSRFProtection.mockReturnValue({
      csrfToken: 'test-csrf-token-123',
      isLoading: false,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(() => ({
        'X-CSRF-Token': 'test-csrf-token-123',
        'Content-Type': 'application/json',
      })),
    });
  });

  it('shows loading state while CSRF token is being fetched', () => {
    mockUseCSRFProtection.mockReturnValue({
      csrfToken: null,
      isLoading: true,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(),
    });

    render(<ContactSection />);

    expect(screen.getByText('Initializing secure form...')).toBeInTheDocument();
  });

  it('shows error state when CSRF token is unavailable', () => {
    mockUseCSRFProtection.mockReturnValue({
      csrfToken: null,
      isLoading: false,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(),
    });

    render(<ContactSection />);

    expect(screen.getByText('Security Error')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to initialize secure form. Please refresh the page.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh page/i })).toBeInTheDocument();
  });

  it('renders form when CSRF token is available', () => {
    mockUseCSRFProtection.mockReturnValue({
      csrfToken: 'test-csrf-token-123',
      isLoading: false,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(),
    });

    render(<ContactSection />);

    expect(screen.getByRole('form', { name: /contact form/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('uses CSRF-protected request when submitting form', async () => {
    mockUseCSRFProtection.mockReturnValue({
      csrfToken: 'test-csrf-token-123',
      isLoading: false,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(),
    });

    render(<ContactSection />);

    // Fill out the form using more specific selectors
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/project details/i), {
      target: { value: 'I need a website for my business' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(mockMakeProtectedRequest).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          company: '',
          projectType: '',
          budget: '',
          message: 'I need a website for my business',
        }),
      });
    });
  });

  it('handles CSRF protection errors gracefully', async () => {
    // Mock CSRF error
    mockMakeProtectedRequest.mockRejectedValue(new Error('CSRF token not available'));

    mockUseCSRFProtection.mockReturnValue({
      csrfToken: 'test-csrf-token-123',
      isLoading: false,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(),
    });

    render(<ContactSection />);

    // Fill out and submit form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/project details/i), {
      target: { value: 'Test message' },
    });

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(mockMakeProtectedRequest).toHaveBeenCalled();
    });

    // Form should remain in submittable state (not show success message)
    expect(screen.queryByText('Thank You!')).not.toBeInTheDocument();
  });

  it('refreshes page when refresh button is clicked', () => {
    // Mock window.location.reload
    const originalLocation = window.location;
    const mockReload = jest.fn();

    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        reload: mockReload,
      },
      writable: true,
    });

    mockUseCSRFProtection.mockReturnValue({
      csrfToken: null,
      isLoading: false,
      makeProtectedRequest: mockMakeProtectedRequest,
      getProtectedHeaders: jest.fn(),
    });

    render(<ContactSection />);

    fireEvent.click(screen.getByRole('button', { name: /refresh page/i }));

    expect(mockReload).toHaveBeenCalled();

    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });
});
