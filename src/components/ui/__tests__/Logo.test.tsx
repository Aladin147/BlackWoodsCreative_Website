import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { Logo } from '../Logo';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, onLoad, className, 'data-testid': testId, priority, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        onLoad={onLoad}
        data-testid={testId}
        data-priority={priority ? 'true' : 'false'}
        {...props}
      />
    );
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('Logo Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo image with default props', () => {
    render(<Logo />);

    const logoImage = screen.getByTestId('logo-image-main');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('alt', 'BlackWoods Creative');
  });

  it('renders with custom size classes', () => {
    render(<Logo size="xl" />);

    const logoImage = screen.getByTestId('logo-image-main');
    expect(logoImage).toHaveClass('h-16');
  });

  it('calls onClick handler when clicked', () => {
    render(<Logo onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<Logo onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'BlackWoods Creative - Go to homepage');
    expect(button).toHaveAttribute('title', 'BlackWoods Creative - Go to homepage');
  });

  it('shows loading state initially', () => {
    render(<Logo />);
    
    // Should show loading placeholder
    const loadingElement = screen.getByText('BWC');
    expect(loadingElement).toBeInTheDocument();
  });

  it('handles image load success', async () => {
    render(<Logo />);

    const logoImage = screen.getByTestId('logo-image-main');

    // Simulate successful image load
    fireEvent.load(logoImage);

    await waitFor(() => {
      const button = screen.getByTestId('logo-button');
      expect(button).toHaveClass('opacity-100');
    });
  });

  it('falls back to text logo on image error', async () => {
    render(<Logo />);

    const logoImage = screen.getByTestId('logo-image-main');

    // Simulate image error
    fireEvent.error(logoImage);

    await waitFor(() => {
      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
    });
  });

  it('shows abbreviated text for icon variant fallback', async () => {
    render(<Logo variant="icon" />);

    const logoImage = screen.getByTestId('logo-image-main');

    // Simulate image error
    fireEvent.error(logoImage);

    await waitFor(() => {
      expect(screen.getByText('BWC')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    render(<Logo className="custom-class" />);

    const container = screen.getByTestId('logo-image-main').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('uses correct image URLs', () => {
    render(<Logo />);

    const logoImage = screen.getByTestId('logo-image-main');
    expect(logoImage).toHaveAttribute('src', '/assets/icons/BLKWDS Creative Logo_Inverted.svg');
  });

  it('sets priority prop correctly', () => {
    render(<Logo priority />);

    const logoImage = screen.getByTestId('logo-image-main');
    expect(logoImage).toHaveAttribute('data-priority', 'true');
  });

  it('renders different sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    const expectedClasses = ['h-8', 'h-10', 'h-12', 'h-16'];

    sizes.forEach((size, index) => {
      const { unmount } = render(<Logo size={size} />);

      const logoImage = screen.getByTestId('logo-image-main');
      expect(logoImage).toHaveClass(expectedClasses[index]);

      unmount();
    });
  });
});
