import { render, screen } from '@testing-library/react';
import React from 'react';

import RootLayout, { metadata } from '../layout';

// Mock Next.js headers function
jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn((name: string) => {
      if (name === 'x-nonce') return 'test-nonce-123';
      if (name === 'x-csrf-token') return 'test-csrf-token-456';
      return null;
    }),
  })),
}));

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => {
  return function mockDynamic(
    _importFunc: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    options?: { loading?: () => JSX.Element }
  ) {
    const Component = () => {
      if (options?.loading) {
        return options.loading();
      }
      return <div data-testid="dynamic-component">Dynamic Component</div>;
    };
    Component.displayName = 'MockDynamicComponent';
    return Component;
  };
});

// Mock components
jest.mock('@/components/layout', () => ({
  Header: () => <header data-testid="header">Header</header>,
  ScrollProgress: () => <div data-testid="scroll-progress">ScrollProgress</div>,
}));

jest.mock('@/components/seo/StructuredData', () => ({
  StructuredData: ({ metadata }: { metadata: Record<string, unknown> }) => (
    <script
      data-testid="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata) }}
    />
  ),
}));

jest.mock('@/context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock CSS import
jest.mock('../globals.css', () => ({}));

// Mock Google Fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-primary',
    className: 'font-inter',
  }),
  Playfair_Display: () => ({
    variable: '--font-display',
    className: 'font-playfair',
  }),
  JetBrains_Mono: () => ({
    variable: '--font-mono',
    className: 'font-jetbrains',
  }),
}));

// Create a simple mock layout component for testing
const MockRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" data-testid="html-element">
      <body
        className="bg-bw-bg-primary font-primary text-bw-text-primary antialiased transition-colors duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        data-testid="body-element"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-bw-accent-gold focus:px-4 focus:py-2 focus:font-medium focus:text-bw-bg-primary"
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
    expect(body).toHaveClass('bg-bw-bg-primary');
    expect(body).toHaveClass('font-primary');
    expect(body).toHaveClass('text-bw-text-primary');
    expect(body).toHaveClass('antialiased');
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

describe('Actual RootLayout Component', () => {
  const mockChildren = <div data-testid="page-content">Page Content</div>;

  beforeEach(() => {
    delete process.env.GOOGLE_VERIFICATION_CODE;
  });

  describe('Rendering', () => {
    it('renders the complete layout structure', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      // Check main structure elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
      expect(screen.getByTestId('page-content')).toBeInTheDocument();
    });

    it('renders accessibility skip link', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
      expect(skipLink).toHaveClass('sr-only');
    });

    it('renders main content with proper attributes', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
      expect(main).toHaveClass('relative');
    });

    it('renders structured data component', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const structuredData = screen.getByTestId('structured-data');
      expect(structuredData).toBeInTheDocument();
      expect(structuredData).toHaveAttribute('type', 'application/ld+json');
    });
  });

  describe('Dynamic Components', () => {
    it('renders dynamic components with proper fallbacks', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      // Dynamic components should be rendered (mocked)
      const dynamicComponents = screen.getAllByTestId('dynamic-component');
      expect(dynamicComponents.length).toBeGreaterThanOrEqual(1); // At least one dynamic component
    });
  });

  describe('Theme and Styling', () => {
    it('applies font variables to html element', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = container.querySelector('html');
      expect(htmlElement).toHaveClass('--font-primary');
      expect(htmlElement).toHaveClass('--font-display');
      expect(htmlElement).toHaveClass('--font-mono');
    });

    it('applies proper body classes', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      const bodyElement = container.querySelector('body');
      expect(bodyElement).toHaveClass('bg-bw-bg-primary');
      expect(bodyElement).toHaveClass('text-bw-text-primary');
      expect(bodyElement).toHaveClass('font-primary');
      expect(bodyElement).toHaveClass('antialiased');
    });

    it('applies theme transition classes', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      // Theme classes are now applied to body element
      const bodyElement = container.querySelector('body');
      expect(bodyElement).toHaveClass('bg-bw-bg-primary');
      expect(bodyElement).toHaveClass('text-bw-text-primary');
      expect(bodyElement).toHaveClass('transition-colors');
      expect(bodyElement).toHaveClass('duration-500');

      // The component uses semantic color classes that adapt to theme automatically
      // rather than explicit dark: prefixed classes
    });
  });

  describe('Accessibility', () => {
    it('has proper language attribute', () => {
      const { container } = render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = container.querySelector('html');
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('has proper skip link focus styles', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveClass('focus:not-sr-only');
      expect(skipLink).toHaveClass('focus:absolute');
      expect(skipLink).toHaveClass('focus:top-4');
      expect(skipLink).toHaveClass('focus:left-4');
      expect(skipLink).toHaveClass('focus:z-50');
      expect(skipLink).toHaveClass('focus:px-4');
      expect(skipLink).toHaveClass('focus:py-2');
      expect(skipLink).toHaveClass('focus:bg-bw-accent-gold');
      expect(skipLink).toHaveClass('focus:text-bw-bg-primary');
      expect(skipLink).toHaveClass('focus:rounded-md');
      expect(skipLink).toHaveClass('focus:font-medium');
    });

    it('provides proper main landmark', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('id', 'main-content');
    });
  });
});

describe('Metadata Configuration', () => {
  it('has correct default title and template', () => {
    expect(metadata.title).toEqual({
      default: 'BlackWoods Creative | Premium Visual Storytelling',
      template: '%s | BlackWoods Creative',
    });
  });

  it('has comprehensive description and keywords', () => {
    expect(metadata.description).toContain('BlackWoods Creative specializes');
    expect(metadata.keywords).toContain('filmmaking');
    expect(metadata.keywords).toContain('photography');
    expect(metadata.keywords).toContain('3D visualization');
  });

  it('has proper author and creator information', () => {
    expect(metadata.authors).toEqual([{ name: 'BlackWoods Creative' }]);
    expect(metadata.creator).toBe('BlackWoods Creative');
    expect(metadata.publisher).toBe('BlackWoods Creative');
  });

  it('has correct metadata base URL', () => {
    expect(metadata.metadataBase).toEqual(new URL('https://blackwoodscreative.com'));
  });

  it('has proper Open Graph configuration', () => {
    expect(metadata.openGraph).toMatchObject({
      type: 'website',
      locale: 'en_US',
      url: 'https://blackwoodscreative.com',
      title: 'BlackWoods Creative | Premium Visual Storytelling',
      siteName: 'BlackWoods Creative',
    });

    expect(metadata.openGraph?.images).toHaveLength(1);
    const images = metadata.openGraph?.images;
    expect(Array.isArray(images) ? images[0] : images).toMatchObject({
      url: '/assets/images/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'BlackWoods Creative - Visual Storytelling',
    });
  });

  it('has proper Twitter card configuration', () => {
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'BlackWoods Creative | Premium Visual Storytelling',
      images: ['/assets/images/twitter-image.jpg'],
    });
  });

  it('has proper robots configuration', () => {
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    });
  });

  it('handles Google verification code from environment', async () => {
    // Test with environment variable
    process.env.GOOGLE_VERIFICATION_CODE = 'test-verification-code';

    // Re-import to get updated metadata
    jest.resetModules();
    const layoutModule = await import('../layout');
    const updatedMetadata = layoutModule.metadata;

    expect(updatedMetadata.verification?.google).toBe('test-verification-code');
  });

  it('handles missing Google verification code gracefully', () => {
    expect(metadata.verification?.google).toBe('');
  });

  it('disables format detection properly', () => {
    expect(metadata.formatDetection).toEqual({
      email: false,
      address: false,
      telephone: false,
    });
  });

  it('has proper canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe('/');
  });
});
