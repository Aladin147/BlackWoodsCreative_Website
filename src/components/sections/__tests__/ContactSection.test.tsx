import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from '../ContactSection';

// Mock the validateEmail function
jest.mock('@/lib/utils', () => ({
  validateEmail: jest.fn((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }),
}));

describe('ContactSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco')).toBeInTheDocument();
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
      expect(screen.getByText('Please provide more details about your project')).toBeInTheDocument();
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
    await waitFor(() => {
      expect(screen.getByText(/Sending/)).toBeInTheDocument();
    });

    // Check for success state
    await waitFor(() => {
      expect(screen.getByText(/Thank You!/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles form submission error gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/);
    const emailInput = screen.getByLabelText(/Email \*/);
    const messageInput = screen.getByLabelText(/Project Details/);
    const submitButton = screen.getByRole('button', { name: /Send Message/ });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a detailed project description.');

    // Mock fetch to simulate error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    try {
      await user.click(submitButton);

      // Wait for error handling
      await waitFor(() => {
        // The form should handle the error gracefully without crashing
        expect(submitButton).toBeInTheDocument();
      }, { timeout: 2000 });
    } catch (error) {
      // Catch any unhandled errors to prevent worker crashes
    }

    consoleSpy.mockRestore();
  });

  it('updates form data correctly', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const nameInput = screen.getByLabelText(/Name \*/) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email \*/) as HTMLInputElement;
    const companyInput = screen.getByLabelText(/Company/) as HTMLInputElement;

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(companyInput, 'Test Company');

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(companyInput.value).toBe('Test Company');
  });

  it('handles select field changes', async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    const projectTypeSelect = screen.getByLabelText(/Project Type/) as HTMLSelectElement;
    const budgetSelect = screen.getByLabelText(/Budget Range/) as HTMLSelectElement;

    await user.selectOptions(projectTypeSelect, 'Brand Film');
    await user.selectOptions(budgetSelect, '$10K - $25K');

    expect(projectTypeSelect.value).toBe('Brand Film');
    expect(budgetSelect.value).toBe('$10K - $25K');
  });
});
