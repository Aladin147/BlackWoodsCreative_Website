import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Custom fallback component for testing
const CustomFallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
  <div>
    <h2>Custom Error Fallback</h2>
    <p>Error: {error?.message}</p>
    <button onClick={resetError}>Custom Reset</button>
  </div>
);

describe('ErrorBoundary', () => {
  // Mock console.error to avoid noise in test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders default error fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Fallback')).toBeInTheDocument();
    expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Reset' })).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('hides error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('resets error state when reset button is clicked', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // Error should be displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Fix the component before clicking reset
    shouldThrow = false;

    // Click reset button
    const resetButton = screen.getByRole('button', { name: 'Try Again' });
    await user.click(resetButton);

    // Component should now render successfully
    await waitFor(() => {
      expect(screen.getByText('No error')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('logs error information', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('handles errors in event handlers', async () => {
    const user = userEvent.setup();

    const ComponentWithErrorInHandler = () => {
      const handleClick = () => {
        throw new Error('Event handler error');
      };

      return <button onClick={handleClick}>Click to error</button>;
    };

    render(
      <ErrorBoundary>
        <ComponentWithErrorInHandler />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: 'Click to error' });

    // Event handler errors are not caught by error boundaries
    // This test ensures the boundary doesn't interfere with normal error handling
    expect(() => user.click(button)).not.toThrow();
  });

  it('handles multiple error resets', async () => {
    const user = userEvent.setup();
    let throwError = true;

    const TestComponent = () => {
      if (throwError) {
        throw new Error('Test error');
      }
      return <div>Component working</div>;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // First error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Reset
    throwError = false;
    await user.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText('Component working')).toBeInTheDocument();

    // Cause another error
    throwError = true;
    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('maintains error boundary isolation', () => {
    render(
      <div>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      </div>
    );

    // First boundary should show error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Second boundary should show normal content
    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
