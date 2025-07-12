/**
 * BEHAVIOR TEST: LoadingSpinner Components
 * 
 * Tests the LoadingSpinner, LoadingSkeleton, and PortfolioCardSkeleton components
 * from a user perspective, focusing on real interactions and business requirements.
 * 
 * TESTING METHODOLOGY:
 * - Behavior-driven testing focused on user experience
 * - Minimal mocking to test actual component behavior
 * - Real accessibility and usability validation
 * - Business-critical functionality verification
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../__tests__/test-utils';
import { LoadingSpinner, LoadingSkeleton, PortfolioCardSkeleton } from '../LoadingSpinner';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, animate, transition, initial, ...props }, ref) => (
      <div ref={ref} data-testid="motion-div" {...props}>{children}</div>
    )),
    p: React.forwardRef<HTMLParagraphElement, any>(({ children, animate, transition, initial, ...props }, ref) => (
      <p ref={ref} data-testid="motion-p" {...props}>{children}</p>
    )),
  },
}));

describe('BEHAVIOR: LoadingSpinner Component', () => {
  describe('Basic LoadingSpinner Functionality', () => {
    it('should render loading spinner with default size', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('motion-div');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('h-8', 'w-8'); // Default md size
    });

    it('should render loading spinner with custom text', () => {
      render(<LoadingSpinner text="Loading content..." />);
      
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('should not render text when text prop is not provided', () => {
      render(<LoadingSpinner />);
      
      // Should only have the spinner div, not the text paragraph
      const motionElements = screen.getAllByTestId('motion-div');
      expect(motionElements).toHaveLength(1); // Only the spinner
      expect(screen.queryByTestId('motion-p')).not.toBeInTheDocument();
    });
  });

  describe('LoadingSpinner Sizes', () => {
    it('should render small size spinner correctly', () => {
      render(<LoadingSpinner size="sm" />);
      
      const spinner = screen.getByTestId('motion-div');
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    it('should render medium size spinner correctly', () => {
      render(<LoadingSpinner size="md" />);
      
      const spinner = screen.getByTestId('motion-div');
      expect(spinner).toHaveClass('h-8', 'w-8');
    });

    it('should render large size spinner correctly', () => {
      render(<LoadingSpinner size="lg" />);
      
      const spinner = screen.getByTestId('motion-div');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });

    it('should fallback to medium size for invalid size', () => {
      // @ts-ignore - Testing runtime behavior with invalid prop
      render(<LoadingSpinner size="invalid" />);
      
      const spinner = screen.getByTestId('motion-div');
      expect(spinner).toHaveClass('h-8', 'w-8'); // Should fallback to md
    });
  });

  describe('LoadingSpinner Styling and Props', () => {
    it('should apply custom className', () => {
      render(<LoadingSpinner className="custom-spinner-class" />);
      
      const container = screen.getByTestId('motion-div').parentElement;
      expect(container).toHaveClass('custom-spinner-class');
    });

    it('should have proper spinner styling classes', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByTestId('motion-div');
      expect(spinner).toHaveClass(
        'rounded-full',
        'border-2',
        'border-bw-border-subtle',
        'border-t-bw-accent-gold'
      );
    });

    it('should have proper text styling when text is provided', () => {
      render(<LoadingSpinner text="Loading..." />);
      
      const text = screen.getByText('Loading...');
      expect(text).toHaveClass('text-sm', 'text-bw-text-primary', 'opacity-60');
    });
  });

  describe('LoadingSpinner Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(<LoadingSpinner text="Loading content" />);
      
      // Text should be readable by screen readers
      const text = screen.getByText('Loading content');
      expect(text).toBeInTheDocument();
    });

    it('should have proper container structure for accessibility', () => {
      render(<LoadingSpinner text="Loading..." />);
      
      const container = screen.getByTestId('motion-div').parentElement;
      expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
    });
  });
});

describe('BEHAVIOR: LoadingSkeleton Component', () => {
  describe('Basic LoadingSkeleton Functionality', () => {
    it('should render loading skeleton', () => {
      render(<LoadingSkeleton />);
      
      const skeleton = screen.getByTestId('motion-div');
      expect(skeleton).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<LoadingSkeleton className="custom-skeleton-class" />);
      
      const skeleton = screen.getByTestId('motion-div');
      expect(skeleton).toHaveClass('custom-skeleton-class');
    });

    it('should have proper skeleton styling', () => {
      render(<LoadingSkeleton />);
      
      const skeleton = screen.getByTestId('motion-div');
      expect(skeleton).toHaveClass('rounded-lg', 'bg-bw-border-subtle');
    });
  });
});

describe('BEHAVIOR: PortfolioCardSkeleton Component', () => {
  describe('Basic PortfolioCardSkeleton Functionality', () => {
    it('should render portfolio card skeleton structure', () => {
      render(<PortfolioCardSkeleton />);
      
      // Should have multiple skeleton elements for different parts of the card
      const skeletons = screen.getAllByTestId('motion-div');
      expect(skeletons.length).toBeGreaterThan(1);
    });

    it('should have proper card structure', () => {
      render(<PortfolioCardSkeleton />);

      // Check for main container by finding the outer div with specific classes
      const container = document.querySelector('.overflow-hidden.rounded-lg.bg-bw-border-subtle');
      expect(container).toBeInTheDocument();
    });

    it('should have image skeleton with correct aspect ratio', () => {
      render(<PortfolioCardSkeleton />);
      
      // First skeleton should be the image with aspect ratio
      const imageSkeletons = screen.getAllByTestId('motion-div');
      const imageSkeleton = imageSkeletons[0];
      expect(imageSkeleton).toHaveClass('aspect-[4/3]', 'w-full');
    });

    it('should have content area with multiple skeleton elements', () => {
      render(<PortfolioCardSkeleton />);
      
      // Should have multiple skeleton elements for title, description, and tags
      const skeletons = screen.getAllByTestId('motion-div');
      expect(skeletons.length).toBeGreaterThanOrEqual(6); // Image + title + description + subtitle + 3 tags
    });

    it('should have proper spacing and layout structure', () => {
      render(<PortfolioCardSkeleton />);

      // Check for content padding area
      const contentArea = document.querySelector('.p-6');
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe('PortfolioCardSkeleton Layout Validation', () => {
    it('should have title skeleton with proper width', () => {
      render(<PortfolioCardSkeleton />);
      
      // Title skeleton should be 3/4 width
      const skeletons = screen.getAllByTestId('motion-div');
      const titleSkeleton = skeletons.find(skeleton => 
        skeleton.classList.contains('w-3/4')
      );
      expect(titleSkeleton).toBeInTheDocument();
    });

    it('should have description skeleton with full width', () => {
      render(<PortfolioCardSkeleton />);
      
      // Description skeleton should be full width
      const skeletons = screen.getAllByTestId('motion-div');
      const descriptionSkeleton = skeletons.find(skeleton => 
        skeleton.classList.contains('w-full') && skeleton.classList.contains('h-4')
      );
      expect(descriptionSkeleton).toBeInTheDocument();
    });

    it('should have tag skeletons with varied widths', () => {
      render(<PortfolioCardSkeleton />);
      
      // Should have tag skeletons with different widths
      const skeletons = screen.getAllByTestId('motion-div');
      const tagSkeletons = skeletons.filter(skeleton => 
        skeleton.classList.contains('h-6') && 
        (skeleton.classList.contains('w-16') || 
         skeleton.classList.contains('w-20') || 
         skeleton.classList.contains('w-14'))
      );
      expect(tagSkeletons.length).toBe(3);
    });
  });
});

describe('BEHAVIOR: Loading Components Integration', () => {
  describe('Real-world Usage Scenarios', () => {
    it('should work together in a loading state scenario', () => {
      const LoadingPage = () => (
        <div>
          <LoadingSpinner text="Loading portfolio..." />
          <div className="grid grid-cols-3 gap-4 mt-8">
            <PortfolioCardSkeleton />
            <PortfolioCardSkeleton />
            <PortfolioCardSkeleton />
          </div>
        </div>
      );
      
      render(<LoadingPage />);
      
      // Should have spinner with text
      expect(screen.getByText('Loading portfolio...')).toBeInTheDocument();
      
      // Should have multiple portfolio card skeletons
      const skeletons = screen.getAllByTestId('motion-div');
      expect(skeletons.length).toBeGreaterThan(10); // Spinner + multiple card skeletons
    });

    it('should handle different loading states appropriately', () => {
      const MultiStateLoading = () => (
        <div>
          <LoadingSpinner size="sm" text="Quick load" />
          <LoadingSpinner size="lg" text="Heavy content loading" />
          <LoadingSkeleton className="h-20 w-full mb-4" />
        </div>
      );
      
      render(<MultiStateLoading />);
      
      expect(screen.getByText('Quick load')).toBeInTheDocument();
      expect(screen.getByText('Heavy content loading')).toBeInTheDocument();
      
      // Should have different sized spinners
      const spinners = screen.getAllByTestId('motion-div');
      const smallSpinner = spinners.find(s => s.classList.contains('h-4'));
      const largeSpinner = spinners.find(s => s.classList.contains('h-12'));
      
      expect(smallSpinner).toBeInTheDocument();
      expect(largeSpinner).toBeInTheDocument();
    });
  });
});
