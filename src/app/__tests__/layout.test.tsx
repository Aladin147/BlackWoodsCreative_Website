import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

// Mock Next.js font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-font',
  }),
  Playfair_Display: () => ({
    className: 'playfair-font',
  }),
  JetBrains_Mono: () => ({
    className: 'jetbrains-font',
  }),
}));

// Mock the metadata export
jest.mock('../layout', () => {
  const ActualLayout = jest.requireActual('../layout').default;
  return {
    __esModule: true,
    default: ActualLayout,
    metadata: {
      title: 'BlackWoods Creative',
      description: 'Professional video production and creative services',
    },
  };
});

describe('RootLayout', () => {
  const mockChildren = <div data-testid="page-content">Page Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    expect(screen.getByRole('document')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
  });

  it('applies correct HTML structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');
  });

  it('applies correct body classes', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const body = document.body;
    expect(body).toHaveClass('inter-font', 'playfair-font');
  });

  it('sets correct document language', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const html = document.documentElement;
    expect(html.lang).toBe('en');
  });

  it('renders with proper semantic structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check for html and body elements
    expect(document.documentElement).toBeInTheDocument();
    expect(document.body).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );

    render(<RootLayout>{multipleChildren}</RootLayout>);

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    render(<RootLayout>{null}</RootLayout>);

    // Should render without errors
    expect(document.body).toBeInTheDocument();
  });

  it('applies font classes correctly', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    const body = document.body;

    // Check that font classes are applied
    expect(body.className).toContain('inter-font');
    expect(body.className).toContain('playfair-font');
  });

  it('maintains proper document structure', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Verify HTML document structure
    expect(document.documentElement.tagName).toBe('HTML');
    expect(document.body.tagName).toBe('BODY');
  });

  it('maintains accessibility standards', () => {
    render(<RootLayout>{mockChildren}</RootLayout>);

    // Check for proper language attribute
    const html = document.documentElement;
    expect(html).toHaveAttribute('lang', 'en');
  });
});
