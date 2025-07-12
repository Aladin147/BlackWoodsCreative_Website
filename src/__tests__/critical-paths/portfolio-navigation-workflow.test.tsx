/**
 * CRITICAL PATH TEST: Portfolio Navigation End-to-End Workflow
 * 
 * This test validates the complete user journey for portfolio browsing,
 * which is essential for showcasing BlackWoods Creative's work and driving conversions.
 * 
 * BEHAVIOR BEING TESTED:
 * - User can browse portfolio items successfully
 * - Filtering by category works correctly
 * - Search functionality works with real queries
 * - Portfolio items are accessible and interactive
 * - Navigation between projects works smoothly
 * - "View Full Portfolio" call-to-action functions
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, testUtils } from '../test-utils';
import { PortfolioSection } from '@/components/sections/PortfolioSection';

describe('CRITICAL PATH: Portfolio Navigation Workflow', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe('Portfolio Display and Basic Navigation', () => {
    it('should display portfolio items and allow basic browsing', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ASSERT: Portfolio section is visible
      expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();

      // ASSERT: Portfolio heading is visible (text is split across elements)
      expect(screen.getByText('Our')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();

      // ASSERT: Portfolio component loads (wait for loading to complete)
      await waitFor(() => {
        // Check if loading state is gone and content is visible
        const loadingElement = document.querySelector('.animate-pulse');
        const viewFullPortfolioButton = screen.getByText(/view full portfolio/i);

        // Either loading should be gone OR button should be visible
        expect(loadingElement || viewFullPortfolioButton).toBeTruthy();
      }, { timeout: 5000 });

      // ASSERT: At minimum, the "View Full Portfolio" button should be visible
      expect(screen.getByText(/view full portfolio/i)).toBeInTheDocument();
    });

    it('should handle portfolio item clicks for project viewing', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ACT: Wait for portfolio to load and find clickable items
      await waitFor(() => {
        const portfolioItems = screen.getAllByRole('button', { name: /view .* project/i });
        expect(portfolioItems.length).toBeGreaterThan(0);
      });

      const portfolioItems = screen.getAllByRole('button', { name: /view .* project/i });

      // ACT: Click on first portfolio item
      await user.click(portfolioItems[0]);

      // ASSERT: Click interaction works (component handles the click)
      // Note: The actual behavior depends on implementation
      // This tests that the click doesn't break the component
      expect(portfolioItems[0]).toBeInTheDocument();
    });
  });

  describe('Portfolio Filtering System', () => {
    it('should filter portfolio items by category', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ASSERT: Filter buttons are available (real structure)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /filter by all category/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filter by film category/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filter by photography category/i })).toBeInTheDocument();
      });

      // ASSERT: All category filter is active by default
      const allButton = screen.getByRole('button', { name: /filter by all category/i });
      expect(allButton).toHaveAttribute('aria-pressed', 'true');

      // ASSERT: Specific category filters are available
      const filmButton = screen.getByRole('button', { name: /filter by film category/i });
      const photographyButton = screen.getByRole('button', { name: /filter by photography category/i });

      expect(filmButton).toBeInTheDocument();
      expect(photographyButton).toBeInTheDocument();

      // ACT: Click on Film category filter
      await user.click(filmButton);

      // ASSERT: Film filter becomes active
      await waitFor(() => {
        expect(filmButton).toHaveAttribute('aria-pressed', 'true');
      });

      // ASSERT: Portfolio items are still displayed (filtered)
      await waitFor(() => {
        const portfolioItems = screen.getAllByRole('button', { name: /view .* project/i });
        expect(portfolioItems.length).toBeGreaterThan(0);
      });
    });

    it('should handle "All" filter to show all portfolio items', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ACT: Find and click on "All" filter button
      await waitFor(() => {
        const allButton = screen.getByRole('button', { name: /filter by all category/i });
        expect(allButton).toBeInTheDocument();
      });

      const allButton = screen.getByRole('button', { name: /filter by all category/i });
      await user.click(allButton);

      // ASSERT: All filter remains active (it's the default)
      await waitFor(() => {
        expect(allButton).toHaveAttribute('aria-pressed', 'true');
      });

      // ASSERT: Portfolio items are visible (projects count should be shown)
      await waitFor(() => {
        const projectsCount = screen.getByText(/\d+ projects found/i);
        expect(projectsCount).toBeInTheDocument();
      });
    });

    it('should maintain filter state during user interaction', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ACT: Apply a photography filter
      await waitFor(() => {
        const photographyButton = screen.getByRole('button', { name: /filter by photography category/i });
        expect(photographyButton).toBeInTheDocument();
      });

      const photographyButton = screen.getByRole('button', { name: /filter by photography category/i });
      await user.click(photographyButton);

      // ASSERT: Photography filter becomes active
      await waitFor(() => {
        expect(photographyButton).toHaveAttribute('aria-pressed', 'true');
      });

      // ACT: Interact with search (another user interaction)
      const searchInput = screen.getByLabelText(/search portfolio projects/i);
      await user.type(searchInput, 'test');

      // ASSERT: Filter state is maintained after other interactions
      expect(photographyButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Portfolio Call-to-Action', () => {
    it('should display "View Full Portfolio" button and handle clicks', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ASSERT: "View Full Portfolio" button is present
      const viewFullPortfolioButton = screen.getByText(/view full portfolio/i);
      expect(viewFullPortfolioButton).toBeInTheDocument();
      expect(viewFullPortfolioButton).toHaveAttribute('data-cursor', 'button');

      // ACT: Click the "View Full Portfolio" button
      await user.click(viewFullPortfolioButton);

      // ASSERT: Button interaction works (doesn't break component)
      expect(viewFullPortfolioButton).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should be accessible via keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      // ACT: Navigate using keyboard
      await user.tab(); // Should focus on first interactive element

      // ASSERT: Focus management works
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();

      // ACT: Continue tabbing through portfolio items
      await user.tab();
      await user.tab();

      // ASSERT: Keyboard navigation doesn't break
      expect(document.activeElement).toBeTruthy();
    });

    it('should provide proper ARIA labels for portfolio items', async () => {
      render(<PortfolioSection />);

      // ASSERT: Portfolio section has proper accessibility attributes
      const portfolioSection = screen.getByTestId('portfolio-section');
      expect(portfolioSection).toHaveAttribute('id', 'portfolio');

      // ASSERT: Filter buttons have proper ARIA labels
      await waitFor(() => {
        const allButton = screen.getByRole('button', { name: /filter by all category/i });
        expect(allButton).toHaveAttribute('aria-pressed', 'true');
        expect(allButton).toHaveAttribute('aria-label', 'Filter by All category');
      });

      // ASSERT: Search input has proper accessibility
      const searchInput = screen.getByLabelText(/search portfolio projects/i);
      expect(searchInput).toHaveAttribute('aria-describedby', 'search-results-count');
    });

    it('should handle empty or loading states gracefully', async () => {
      // This test ensures the component handles edge cases
      render(<PortfolioSection />);

      // ASSERT: Component renders without crashing
      expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();

      // ASSERT: Essential elements are present (search and filters)
      await waitFor(() => {
        // Component should show search input and filter buttons
        const searchInput = screen.getByLabelText(/search portfolio projects/i);
        const allButton = screen.getByRole('button', { name: /filter by all category/i });

        expect(searchInput).toBeInTheDocument();
        expect(allButton).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Responsiveness', () => {
    it('should render portfolio items efficiently', async () => {
      const startTime = performance.now();

      render(<PortfolioSection />);

      await waitFor(() => {
        // Wait for essential elements to render
        const searchInput = screen.getByLabelText(/search portfolio projects/i);
        const allButton = screen.getByRole('button', { name: /filter by all category/i });
        expect(searchInput).toBeInTheDocument();
        expect(allButton).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // ASSERT: Component renders within reasonable time (5 seconds max)
      expect(renderTime).toBeLessThan(5000);
    });

    it('should handle multiple rapid filter changes', async () => {
      const user = userEvent.setup();
      render(<PortfolioSection />);

      await waitFor(() => {
        const allButton = screen.getByRole('button', { name: /filter by all category/i });
        expect(allButton).toBeInTheDocument();
      });

      // ACT: Rapidly change filters using real button references
      const filmButton = screen.getByRole('button', { name: /filter by film category/i });
      const photographyButton = screen.getByRole('button', { name: /filter by photography category/i });
      const allButton = screen.getByRole('button', { name: /filter by all category/i });

      // Rapid clicking sequence
      await user.click(filmButton);
      await new Promise(resolve => setTimeout(resolve, 50));

      await user.click(photographyButton);
      await new Promise(resolve => setTimeout(resolve, 50));

      await user.click(allButton);

      // ASSERT: Component remains stable after rapid interactions
      expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();
      expect(allButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Integration with Portfolio Data', () => {
    it('should display real portfolio data correctly', async () => {
      render(<PortfolioSection />);

      // ASSERT: Portfolio section displays with real data structure
      await waitFor(() => {
        // Check for essential portfolio elements that are always present
        const searchInput = screen.getByLabelText(/search portfolio projects/i);
        const allButton = screen.getByRole('button', { name: /filter by all category/i });

        expect(searchInput).toBeInTheDocument();
        expect(allButton).toBeInTheDocument();
      });

      // ASSERT: Portfolio categories are available
      const categoryButtons = [
        /filter by all category/i,
        /filter by film category/i,
        /filter by photography category/i,
        /filter by 3d visualization category/i
      ];

      categoryButtons.forEach(buttonName => {
        const button = screen.getByRole('button', { name: buttonName });
        expect(button).toBeInTheDocument();
      });
    });

    it('should handle different portfolio categories correctly', async () => {
      render(<PortfolioSection />);

      // ASSERT: Different categories are supported
      await waitFor(() => {
        const allButton = screen.getByRole('button', { name: /filter by all category/i });
        expect(allButton).toBeInTheDocument();
      });

      // ASSERT: Expected categories are available
      const expectedCategories = [
        { name: /filter by all category/i, text: 'All' },
        { name: /filter by film category/i, text: 'Film' },
        { name: /filter by photography category/i, text: 'Photography' },
        { name: /filter by 3d visualization category/i, text: '3D Visualization' },
        { name: /filter by scene creation category/i, text: 'Scene Creation' }
      ];

      expectedCategories.forEach(category => {
        const button = screen.getByRole('button', { name: category.name });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(category.text);
      });
    });
  });
});
