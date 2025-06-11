import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, LoadingSkeleton, PortfolioCardSkeleton } from '../LoadingSpinner';

// Mock framer-motion
interface MockMotionProps {
  children?: React.ReactNode;
  className?: string;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  initial?: Record<string, unknown>;
  [key: string]: unknown;
}

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, animate, transition, initial, ...props }: MockMotionProps) => (
      <div
        className={className}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        data-initial={JSON.stringify(initial)}
        {...props}
      >
        {children}
      </div>
    ),
    p: ({ children, className, animate, transition, initial, ...props }: MockMotionProps) => (
      <p
        className={className}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
        data-initial={JSON.stringify(initial)}
        {...props}
      >
        {children}
      </p>
    ),
  },
}));

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(' '),
}));

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);

    const container = document.querySelector('.flex.flex-col.items-center.justify-center.gap-4');
    expect(container).toBeInTheDocument();
  });

  it('applies default size (md)', () => {
    render(<LoadingSpinner />);

    const spinner = document.querySelector('.rounded-full.border-2');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies small size when specified', () => {
    render(<LoadingSpinner size="sm" />);

    const spinner = document.querySelector('.rounded-full.border-2');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('applies large size when specified', () => {
    render(<LoadingSpinner size="lg" />);

    const spinner = document.querySelector('.rounded-full.border-2');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('applies custom className', () => {
    const customClass = 'custom-spinner-class';
    render(<LoadingSpinner className={customClass} />);

    const container = document.querySelector('.flex.flex-col.items-center.justify-center.gap-4');
    expect(container).toHaveClass(customClass);
  });

  it('has correct default styling', () => {
    render(<LoadingSpinner />);

    const container = document.querySelector('.flex.flex-col.items-center.justify-center.gap-4');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'gap-4');
  });

  it('has correct spinner styling', () => {
    render(<LoadingSpinner />);

    const spinner = document.querySelector('.rounded-full.border-2');
    expect(spinner).toHaveClass('rounded-full', 'border-2', 'border-bw-medium-gray', 'border-t-bw-gold');
  });

  it('has correct animation properties', () => {
    render(<LoadingSpinner />);

    const spinner = document.querySelector('.rounded-full.border-2');
    expect(spinner).toHaveAttribute('data-animate', JSON.stringify({ rotate: 360 }));
    expect(spinner).toHaveAttribute('data-transition', JSON.stringify({
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }));
  });

  it('does not render text when not provided', () => {
    render(<LoadingSpinner />);
    
    const text = screen.queryByText(/./);
    expect(text).not.toBeInTheDocument();
  });

  it('renders text when provided', () => {
    const testText = 'Loading...';
    render(<LoadingSpinner text={testText} />);
    
    const text = screen.getByText(testText);
    expect(text).toBeInTheDocument();
  });

  it('applies correct text styling', () => {
    const testText = 'Loading...';
    render(<LoadingSpinner text={testText} />);
    
    const text = screen.getByText(testText);
    expect(text).toHaveClass('text-sm', 'text-bw-light-gray');
  });

  it('has correct text animation properties', () => {
    const testText = 'Loading...';
    render(<LoadingSpinner text={testText} />);
    
    const text = screen.getByText(testText);
    expect(text).toHaveAttribute('data-initial', JSON.stringify({ opacity: 0 }));
    expect(text).toHaveAttribute('data-animate', JSON.stringify({ opacity: 1 }));
    expect(text).toHaveAttribute('data-transition', JSON.stringify({ delay: 0.2 }));
  });

  it('combines custom className with default classes', () => {
    const customClass = 'my-custom-class';
    render(<LoadingSpinner className={customClass} />);

    const container = document.querySelector('.flex.flex-col.items-center.justify-center.gap-4');
    expect(container).toHaveClass(customClass);
    expect(container).toHaveClass('flex');
  });

  it('handles all size variants correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const expectedClasses = ['h-4 w-4', 'h-8 w-8', 'h-12 w-12'];

    sizes.forEach((size, index) => {
      const { unmount } = render(<LoadingSpinner size={size} />);
      const spinner = document.querySelector('.rounded-full.border-2');
      const [heightClass, widthClass] = expectedClasses[index].split(' ');

      expect(spinner).toHaveClass(heightClass, widthClass);
      unmount();
    });
  });
});

describe('LoadingSkeleton', () => {
  it('renders without crashing', () => {
    render(<LoadingSkeleton />);

    const skeleton = document.querySelector('.rounded-lg.bg-bw-dark-gray');
    expect(skeleton).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-skeleton-class';
    render(<LoadingSkeleton className={customClass} />);

    const skeleton = document.querySelector('.rounded-lg.bg-bw-dark-gray');
    expect(skeleton).toHaveClass(customClass);
  });

  it('has correct default styling', () => {
    render(<LoadingSkeleton />);

    const skeleton = document.querySelector('.rounded-lg.bg-bw-dark-gray');
    expect(skeleton).toHaveClass('rounded-lg', 'bg-bw-dark-gray');
  });

  it('has correct animation properties', () => {
    render(<LoadingSkeleton />);

    const skeleton = document.querySelector('.rounded-lg.bg-bw-dark-gray');
    expect(skeleton).toHaveAttribute('data-animate', JSON.stringify({
      opacity: [0.5, 1, 0.5],
    }));
    expect(skeleton).toHaveAttribute('data-transition', JSON.stringify({
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }));
  });

  it('works without className prop', () => {
    render(<LoadingSkeleton />);

    const skeleton = document.querySelector('.rounded-lg.bg-bw-dark-gray');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('combines custom className with default classes', () => {
    const customClass = 'my-custom-skeleton';
    render(<LoadingSkeleton className={customClass} />);

    const skeleton = document.querySelector('.rounded-lg.bg-bw-dark-gray');
    expect(skeleton).toHaveClass(customClass);
    expect(skeleton).toHaveClass('rounded-lg');
  });
});

describe('PortfolioCardSkeleton', () => {
  it('renders without crashing', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    expect(container).toBeInTheDocument();
  });

  it('has correct container styling', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    expect(container).toHaveClass('overflow-hidden', 'rounded-lg', 'bg-bw-dark-gray');
  });

  it('contains image skeleton with correct aspect ratio', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const imageSkeleton = container?.querySelector('.aspect-\\[4\\/3\\]');

    expect(imageSkeleton).toBeInTheDocument();
    expect(imageSkeleton).toHaveClass('aspect-[4/3]', 'w-full');
  });

  it('contains content area with padding', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const contentArea = container?.querySelector('.p-6');

    expect(contentArea).toBeInTheDocument();
    expect(contentArea).toHaveClass('p-6');
  });

  it('contains title skeleton', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const titleSkeleton = container?.querySelector('.mb-2.h-6.w-3\\/4');

    expect(titleSkeleton).toBeInTheDocument();
  });

  it('contains description skeleton', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const descriptionSkeleton = container?.querySelector('.mb-4.h-4.w-full');

    expect(descriptionSkeleton).toBeInTheDocument();
  });

  it('contains category skeleton', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const categorySkeleton = container?.querySelector('.h-4.w-1\\/2');

    expect(categorySkeleton).toBeInTheDocument();
  });

  it('contains tags area with multiple tag skeletons', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const tagsArea = container?.querySelector('.mt-4.flex.gap-2');

    expect(tagsArea).toBeInTheDocument();
    expect(tagsArea).toHaveClass('mt-4', 'flex', 'gap-2');

    // Should have 3 tag skeletons
    const tagSkeletons = tagsArea?.querySelectorAll('.h-6');
    expect(tagSkeletons).toHaveLength(3);
  });

  it('has correct tag skeleton sizes', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const tagsArea = container?.querySelector('.mt-4.flex.gap-2');
    const tagSkeletons = tagsArea?.querySelectorAll('.h-6');

    expect(tagSkeletons?.[0]).toHaveClass('w-16');
    expect(tagSkeletons?.[1]).toHaveClass('w-20');
    expect(tagSkeletons?.[2]).toHaveClass('w-14');
  });

  it('maintains proper structure hierarchy', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');

    // Should have image skeleton and content area
    expect(container?.children).toHaveLength(2);

    // Content area should have multiple skeleton elements
    const contentArea = container?.querySelector('.p-6');
    expect(contentArea?.children.length).toBeGreaterThan(3);
  });

  it('uses LoadingSkeleton components internally', () => {
    render(<PortfolioCardSkeleton />);

    // Should contain multiple LoadingSkeleton instances
    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');
    const skeletonElements = container?.querySelectorAll('.rounded-lg.bg-bw-dark-gray');

    expect(skeletonElements?.length).toBeGreaterThan(0);
  });

  it('has consistent spacing and layout', () => {
    render(<PortfolioCardSkeleton />);

    const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-dark-gray');

    // Check for proper margin classes
    expect(container?.querySelector('.mb-2')).toBeInTheDocument();
    expect(container?.querySelector('.mb-4')).toBeInTheDocument();
    expect(container?.querySelector('.mt-4')).toBeInTheDocument();
  });
});
