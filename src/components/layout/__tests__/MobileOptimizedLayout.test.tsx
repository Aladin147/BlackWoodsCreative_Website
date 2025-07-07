/**
 * Mobile Optimized Layout Tests
 *
 * Tests for mobile-optimized layout components and responsive behavior
 */

import { render, screen } from '@testing-library/react';

import {
  MobileOptimizedLayout,
  MobileContainer,
  MobileGrid,
  MobileCard
} from '../MobileOptimizedLayout';

// Mock the mobile optimization hook
jest.mock('@/lib/utils/mobile-optimization', () => ({
  useMobileDevice: () => ({
    isMobile: true,
    isTablet: false,
    isIOS: true,
    isAndroid: false,
    screenSize: 'sm',
    orientation: 'portrait',
    hasNotch: true,
    supportsHover: false,
    touchPoints: 5,
    pixelRatio: 3,
  }),
  MobileStyles: {
    spacing: {
      mobileX: 'px-4 lg:px-6',
    },
  },
}));

// Mock the mobile navigation components
jest.mock('@/components/navigation/MobileOptimizedNavigation', () => ({
  MobileOptimizedNavigation: () => <nav data-testid="mobile-nav">Mobile Navigation</nav>,
  MobileBreadcrumbs: () => <nav data-testid="mobile-breadcrumbs">Mobile Breadcrumbs</nav>,
  MobileFooterNavigation: () => <nav data-testid="mobile-footer">Mobile Footer</nav>,
}));

describe('MobileOptimizedLayout', () => {
  const defaultProps = {
    children: <div data-testid="content">Test Content</div>,
  };

  it('renders without crashing', () => {
    render(<MobileOptimizedLayout {...defaultProps} />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('includes mobile navigation by default', () => {
    render(<MobileOptimizedLayout {...defaultProps} />);
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();
  });

  it('includes breadcrumbs by default', () => {
    render(<MobileOptimizedLayout {...defaultProps} />);
    expect(screen.getByTestId('mobile-breadcrumbs')).toBeInTheDocument();
  });

  it('includes footer navigation by default', () => {
    render(<MobileOptimizedLayout {...defaultProps} />);
    expect(screen.getByTestId('mobile-footer')).toBeInTheDocument();
  });

  it('can hide footer navigation', () => {
    render(<MobileOptimizedLayout {...defaultProps} showFooterNav={false} />);
    expect(screen.queryByTestId('mobile-footer')).not.toBeInTheDocument();
  });

  it('can hide breadcrumbs', () => {
    render(<MobileOptimizedLayout {...defaultProps} showBreadcrumbs={false} />);
    expect(screen.queryByTestId('mobile-breadcrumbs')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <MobileOptimizedLayout {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies mobile-specific styles', () => {
    const { container } = render(<MobileOptimizedLayout {...defaultProps} />);
    const mainElement = container.querySelector('main');
    
    // Should have mobile-specific padding for footer navigation
    expect(mainElement).toHaveClass('pb-20');
  });

  it('applies safe area styles for devices with notches', () => {
    const { container } = render(<MobileOptimizedLayout {...defaultProps} />);
    const mainElement = container.querySelector('main');
    
    // Should have safe area padding for notched devices
    expect(mainElement).toHaveClass('px-safe-left pr-safe-right');
  });
});

describe('MobileContainer', () => {
  const defaultProps = {
    children: <div data-testid="container-content">Container Content</div>,
  };

  it('renders without crashing', () => {
    render(<MobileContainer {...defaultProps} />);
    expect(screen.getByTestId('container-content')).toBeInTheDocument();
  });

  it('applies default size correctly', () => {
    const { container } = render(<MobileContainer {...defaultProps} />);
    const containerDiv = container.firstChild as HTMLElement;
    
    // On mobile, default should be max-w-full
    expect(containerDiv).toHaveClass('max-w-full');
  });

  it('applies small size correctly', () => {
    const { container } = render(<MobileContainer {...defaultProps} size="small" />);
    const containerDiv = container.firstChild as HTMLElement;
    
    expect(containerDiv).toHaveClass('max-w-sm');
  });

  it('applies large size correctly', () => {
    const { container } = render(<MobileContainer {...defaultProps} size="large" />);
    const containerDiv = container.firstChild as HTMLElement;
    
    // On mobile, large should be max-w-full
    expect(containerDiv).toHaveClass('max-w-full');
  });

  it('applies full size correctly', () => {
    const { container } = render(<MobileContainer {...defaultProps} size="full" />);
    const containerDiv = container.firstChild as HTMLElement;
    
    expect(containerDiv).toHaveClass('max-w-full');
  });

  it('applies mobile-optimized horizontal padding', () => {
    const { container } = render(<MobileContainer {...defaultProps} />);
    const containerDiv = container.firstChild as HTMLElement;
    
    expect(containerDiv).toHaveClass('px-4 lg:px-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <MobileContainer {...defaultProps} className="custom-container" />
    );
    expect(container.firstChild).toHaveClass('custom-container');
  });
});

describe('MobileGrid', () => {
  const defaultProps = {
    children: [
      <div key="1" data-testid="grid-item-1">Item 1</div>,
      <div key="2" data-testid="grid-item-2">Item 2</div>,
    ],
  };

  it('renders without crashing', () => {
    render(<MobileGrid {...defaultProps} />);
    expect(screen.getByTestId('grid-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item-2')).toBeInTheDocument();
  });

  it('applies default grid columns', () => {
    const { container } = render(<MobileGrid {...defaultProps} />);
    const gridDiv = container.firstChild as HTMLElement;
    
    // Default should be 1 column on mobile
    expect(gridDiv).toHaveClass('grid-cols-1');
  });

  it('applies custom columns', () => {
    const { container } = render(
      <MobileGrid {...defaultProps} columns={2} />
    );
    const gridDiv = container.firstChild as HTMLElement;

    expect(gridDiv).toHaveClass('grid-cols-1 sm:grid-cols-2');
  });

  it('applies 4 columns correctly', () => {
    const { container } = render(
      <MobileGrid {...defaultProps} columns={4} />
    );
    const gridDiv = container.firstChild as HTMLElement;

    expect(gridDiv).toHaveClass('grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
  });

  it('applies mobile-optimized gap', () => {
    const { container } = render(<MobileGrid {...defaultProps} />);
    const gridDiv = container.firstChild as HTMLElement;
    
    expect(gridDiv).toHaveClass('gap-4');
  });

  it('applies custom className', () => {
    const { container } = render(
      <MobileGrid {...defaultProps} className="custom-grid" />
    );
    expect(container.firstChild).toHaveClass('custom-grid');
  });
});

describe('MobileCard', () => {
  const defaultProps = {
    children: <div data-testid="card-content">Card Content</div>,
  };

  it('renders without crashing', () => {
    render(<MobileCard {...defaultProps} />);
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('applies default padding', () => {
    const { container } = render(<MobileCard {...defaultProps} />);
    const cardDiv = container.firstChild as HTMLElement;
    
    // Normal padding on mobile should be p-4
    expect(cardDiv).toHaveClass('p-4');
  });

  it('applies small padding', () => {
    const { container } = render(<MobileCard {...defaultProps} padding="small" />);
    const cardDiv = container.firstChild as HTMLElement;
    
    expect(cardDiv).toHaveClass('p-3');
  });

  it('applies large padding', () => {
    const { container } = render(<MobileCard {...defaultProps} padding="large" />);
    const cardDiv = container.firstChild as HTMLElement;
    
    expect(cardDiv).toHaveClass('p-6');
  });

  it('applies interactive styles when interactive', () => {
    const { container } = render(<MobileCard {...defaultProps} interactive />);
    const cardDiv = container.firstChild as HTMLElement;
    
    expect(cardDiv).toHaveClass('active:scale-98 transition-transform cursor-pointer');
  });

  it('does not apply interactive styles when not interactive', () => {
    const { container } = render(<MobileCard {...defaultProps} interactive={false} />);
    const cardDiv = container.firstChild as HTMLElement;
    
    expect(cardDiv).not.toHaveClass('active:scale-98');
    expect(cardDiv).not.toHaveClass('cursor-pointer');
  });

  it('applies base card styles', () => {
    const { container } = render(<MobileCard {...defaultProps} />);
    const cardDiv = container.firstChild as HTMLElement;
    
    expect(cardDiv).toHaveClass('bg-bw-bg-secondary border border-bw-border-subtle rounded-lg');
  });

  it('applies custom className', () => {
    const { container } = render(
      <MobileCard {...defaultProps} className="custom-card" />
    );
    expect(container.firstChild).toHaveClass('custom-card');
  });
});

describe('Responsive Behavior', () => {
  it('adapts layout based on device type', () => {
    // This test would require mocking different device types
    // and verifying that the components adapt accordingly
    
    const { container } = render(
      <MobileOptimizedLayout>
        <MobileContainer>
          <MobileGrid>
            <MobileCard>Content</MobileCard>
          </MobileGrid>
        </MobileContainer>
      </MobileOptimizedLayout>
    );

    // Verify the nested structure renders correctly
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(container.querySelector('.bg-bw-bg-secondary')).toBeInTheDocument();
  });

  it('handles orientation changes gracefully', () => {
    const { container } = render(<MobileOptimizedLayout {...{ children: <div>Content</div> }} />);
    
    // The layout should be stable regardless of orientation
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('provides proper touch targets', () => {
    render(
      <MobileCard interactive>
        <button>Touch Target</button>
      </MobileCard>
    );

    const card = screen.getByRole('button').closest('div');
    expect(card).toHaveClass('cursor-pointer');
  });
});

describe('Accessibility', () => {
  it('maintains proper semantic structure', () => {
    render(
      <MobileOptimizedLayout>
        <div>Content</div>
      </MobileOptimizedLayout>
    );

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(3); // Nav, breadcrumbs, footer
  });

  it('provides proper focus management', () => {
    render(
      <MobileCard interactive>
        <button>Focusable Content</button>
      </MobileCard>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Interactive cards should not interfere with focus
    button.focus();
    expect(button).toHaveFocus();
  });
});

describe('Performance', () => {
  it('renders efficiently with minimal DOM nodes', () => {
    const { container } = render(
      <MobileContainer>
        <div>Simple content</div>
      </MobileContainer>
    );

    // Should have minimal wrapper elements
    const allElements = container.querySelectorAll('*');
    expect(allElements.length).toBeLessThan(5); // Container + content + minimal wrappers
  });

  it('applies styles without inline styles', () => {
    const { container } = render(
      <MobileCard>
        <div>Content</div>
      </MobileCard>
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.style.length).toBe(0); // No inline styles
  });
});
