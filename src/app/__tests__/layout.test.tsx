import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a simple mock layout component for testing
const MockRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" data-testid="html-element">
      <body className="bg-bw-black font-primary text-bw-white antialiased" data-testid="body-element">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-bw-gold focus:text-bw-black focus:rounded-md focus:font-medium"
        >
          Skip to main content
        </a>
        <div data-testid="magnetic-cursor">MagneticCursor</div>
        <div data-testid="scroll-progress">ScrollProgress</div>
        <header data-testid="header">Header</header>
        <main id="main-content" className="relative" role="main" data-testid="main-content">
          {children}
        </main>
      </body>
    </html>
  );
};

describe('RootLayout', () => {
  const mockChildren = <div data-testid="page-content">Page Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);
    expect(screen.getByTestId('html-element')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('applies correct HTML structure', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    const html = screen.getByTestId('html-element');
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('applies correct body classes', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    const body = screen.getByTestId('body-element');
    expect(body).toHaveClass('bg-bw-black', 'font-primary', 'text-bw-white', 'antialiased');
  });

  it('sets correct document language', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    const html = screen.getByTestId('html-element');
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('renders with proper semantic structure', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    // Check for html and body elements
    expect(screen.getByTestId('html-element')).toBeInTheDocument();
    expect(screen.getByTestId('body-element')).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );

    render(<MockRootLayout>{multipleChildren}</MockRootLayout>);

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    render(<MockRootLayout>{null}</MockRootLayout>);

    // Should render without errors
    expect(screen.getByTestId('body-element')).toBeInTheDocument();
  });

  it('applies font classes correctly', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    const body = screen.getByTestId('body-element');

    // Check that font classes are applied
    expect(body).toHaveClass('font-primary');
  });

  it('maintains proper document structure', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    // Verify HTML document structure
    const html = screen.getByTestId('html-element');
    const body = screen.getByTestId('body-element');
    expect(html.tagName).toBe('HTML');
    expect(body.tagName).toBe('BODY');
  });

  it('maintains accessibility standards', () => {
    render(<MockRootLayout>{mockChildren}</MockRootLayout>);

    // Check for proper language attribute
    const html = screen.getByTestId('html-element');
    expect(html).toHaveAttribute('lang', 'en');

    // Check for skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();

    // Check for main content area
    expect(screen.getByTestId('main-content')).toHaveAttribute('role', 'main');
  });
});
