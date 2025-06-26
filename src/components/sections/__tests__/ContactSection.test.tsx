import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContactSection } from '../ContactSection';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock interactive components
jest.mock('@/components/interactive', () => ({
  ScrollReveal: ({ children, className }: any) => (
    <div className={className} data-testid="scroll-reveal">
      {children}
    </div>
  ),
  MagneticField: ({ children }: any) => <div data-testid="magnetic-field">{children}</div>,
  AtmosphericLayer: ({ type, intensity, color }: any) => (
    <div
      data-testid="atmospheric-layer"
      data-type={type}
      data-intensity={intensity}
      data-color={color}
    />
  ),
  ParallaxText: ({ children }: any) => <div data-testid="parallax-text">{children}</div>,
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  EnvelopeIcon: ({ className }: any) => <div className={className} data-testid="envelope-icon" />,
  PhoneIcon: ({ className }: any) => <div className={className} data-testid="phone-icon" />,
  MapPinIcon: ({ className }: any) => <div className={className} data-testid="map-pin-icon" />,
  PaperAirplaneIcon: ({ className }: any) => (
    <div className={className} data-testid="paper-airplane-icon" />
  ),
  ExclamationTriangleIcon: ({ className }: any) => (
    <div className={className} data-testid="exclamation-triangle-icon" />
  ),
  CheckCircleIcon: ({ className }: any) => (
    <div className={className} data-testid="check-circle-icon" />
  ),
}));

// Mock the sanitizeFormData function
jest.mock('@/lib/utils/sanitize', () => ({
  sanitizeFormData: jest.fn((data: any) => data),
}));

// Mock the validateEmail function
jest.mock('@/lib/utils', () => ({
  validateEmail: jest.fn((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }),
}));

// Mock the useCSRFProtection hook
const mockMakeProtectedRequest = jest.fn();
const mockUseCSRFProtection = jest.fn();

jest.mock('@/hooks/useCSRFProtection', () => ({
  useCSRFProtection: () => mockUseCSRFProtection(),
}));

describe('ContactSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default CSRF protection mock
    mockMakeProtectedRequest.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Message sent successfully' }),
    });

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

  it('renders contact section with all elements', () => {
    render(<ContactSection />);

    expect(screen.getByText(/Ready to Create Something/)).toBeInTheDocument();
    expect(screen.getByText(/Amazing/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email \*/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Details/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/ })).toBeInTheDocument();
  });

  it('displays contact information', () => {
    render(<ContactSection />);

    expect(screen.getByText('hello@blackwoodscreative.com')).toBeInTheDocument();
    expect(screen.getByText('+212 625 55 37 68')).toBeInTheDocument();
    expect(
      screen.getByText('MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco')
    ).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    // Submit empty form to trigger validation
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Project details are required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const emailInput = screen.getByLabelText(/Email \*/);
    const messageInput = screen.getByLabelText(/Project Details/);
    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    // Fill required fields but with invalid email
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'invalid-email');
    await user.type(messageInput, 'This is a detailed project description.');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('validates message length', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const emailInput = screen.getByLabelText(/Email \*/);
    const messageInput = screen.getByLabelText(/Project Details/);
    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    // Fill required fields but with short message
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Short');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please provide more details about your project')
      ).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    // Trigger validation error by submitting empty form
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.type(nameInput, 'John');
    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    // Mock successful API response with a delay to test loading state
    mockMakeProtectedRequest.mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({
                  success: true,
                  message: "Thank you for your message! We'll get back to you within 24 hours.",
                }),
              }),
            100
          )
        )
    );

    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const emailInput = screen.getByLabelText(/Email \*/);
    const messageInput = screen.getByLabelText(/Project Details/);
    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a detailed project description that is long enough.');

    await user.click(submitButton);

    // Check for loading state
    await waitFor(
      () => {
        expect(screen.getByText(/Sending/)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Check for success state
    await waitFor(
      () => {
        expect(screen.getByText(/Thank You!/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Verify API was called correctly
    expect(mockMakeProtectedRequest).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      body: expect.stringContaining('John Doe'),
    });
  });

  it('handles form submission error gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock makeProtectedRequest to simulate error
    mockMakeProtectedRequest.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const emailInput = screen.getByLabelText(/Email \*/);
    const messageInput = screen.getByLabelText(/Project Details/);
    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a detailed project description.');

    await user.click(submitButton);

    // Wait for error handling - the form should return to normal state
    await waitFor(
      () => {
        expect(screen.queryByText(/Sending/)).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // The form should still be present and functional
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();

    consoleSpy.mockRestore();
  });

  it('updates form data correctly', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const emailInput = screen.getByLabelText(/Email \*/);
    const companyInput = screen.getByLabelText(/Company/);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(companyInput, 'Test Company');

    expect((nameInput as HTMLInputElement).value).toBe('John Doe');
    expect((emailInput as HTMLInputElement).value).toBe('john@example.com');
    expect((companyInput as HTMLInputElement).value).toBe('Test Company');
  });

  it('handles select field changes', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const projectTypeSelect = screen.getByLabelText(/Project Type/);
    const budgetSelect = screen.getByLabelText(/Budget Range/);

    await user.selectOptions(projectTypeSelect, 'Brand Film');
    await user.selectOptions(budgetSelect, '$10K - $25K');

    expect((projectTypeSelect as HTMLSelectElement).value).toBe('Brand Film');
    expect((budgetSelect as HTMLSelectElement).value).toBe('$10K - $25K');
  });
});
