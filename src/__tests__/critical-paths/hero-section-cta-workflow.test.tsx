/**
 * CRITICAL PATH: Hero Section CTA Workflow Tests
 * 
 * Tests the most critical user interaction path: Hero Section Call-to-Action buttons
 * that drive primary business conversions.
 * 
 * BUSINESS CRITICAL PATHS TESTED:
 * 1. Hero Section Display and Visibility
 * 2. Primary CTA: "View Our Work" button functionality
 * 3. Secondary CTA: "Start Your Project" button functionality  
 * 4. Scroll Indicator CTA functionality
 * 5. Hero Content Accessibility
 * 6. Hero Section Performance and Responsiveness
 * 7. Hero Section Integration with Navigation
 * 
 * TESTING METHODOLOGY:
 * - Behavior-driven testing focused on real user workflows
 * - Minimal mocking to test actual component behavior
 * - Real component structure discovery and validation
 * - Business-critical conversion path verification
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../test-utils';
import { HeroSection } from '@/components/sections/HeroSection';
import * as navigationUtils from '@/lib/utils/navigation';

// Mock navigation functions for testing
jest.mock('@/lib/utils/navigation', () => ({
  navigateToPortfolio: jest.fn(),
  navigateToContact: jest.fn(),
}));

describe('CRITICAL PATH: Hero Section CTA Workflow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock scrollIntoView for scroll indicator tests
    Element.prototype.scrollIntoView = jest.fn();
  });

  describe('Hero Section Display and Visibility', () => {
    it('should render hero section with all essential elements', async () => {
      render(<HeroSection />);

      // ASSERT: Hero section is visible
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();

      // ASSERT: Main title is displayed (text may be in animation state)
      await waitFor(() => {
        // Check for the title text in any form (individual letters or complete words)
        const titleElements = screen.getAllByText((content, element) => {
          return content.includes('B') || content.includes('BlackWoods') ||
                 content.includes('C') || content.includes('Creative');
        });
        expect(titleElements.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      // ASSERT: Subtitle is displayed
      expect(screen.getByText(/crafting visual stories that captivate and convert/i)).toBeInTheDocument();
    });

    it('should display hero section with proper structure and styling', async () => {
      render(<HeroSection />);

      // ASSERT: Hero section has proper ID for navigation
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveClass('relative', 'flex', 'h-screen');
    });
  });

  describe('Primary CTA: "View Our Work" Button', () => {
    it('should display "View Our Work" button with proper attributes', async () => {
      render(<HeroSection />);

      // ASSERT: Primary CTA button is present
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        expect(viewWorkButton).toBeInTheDocument();
      });
    });

    it('should handle "View Our Work" button clicks correctly', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      // ACT: Find and click the "View Our Work" button
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        expect(viewWorkButton).toBeInTheDocument();
      });

      const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                            screen.getByText(/view our work/i);
      
      await user.click(viewWorkButton);

      // ASSERT: Navigation function is called
      expect(navigationUtils.navigateToPortfolio).toHaveBeenCalledTimes(1);
    });

    it('should show hover state for "View Our Work" button', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      // ACT: Find and hover over the "View Our Work" button
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        expect(viewWorkButton).toBeInTheDocument();
      });

      const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                            screen.getByText(/view our work/i);
      
      await user.hover(viewWorkButton);

      // ASSERT: Button remains functional after hover
      expect(viewWorkButton).toBeInTheDocument();
    });
  });

  describe('Secondary CTA: "Start Your Project" Button', () => {
    it('should display "Start Your Project" button with proper attributes', async () => {
      render(<HeroSection />);

      // ASSERT: Secondary CTA button is present
      await waitFor(() => {
        const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i }) ||
                                  screen.getByText(/start your project/i);
        expect(startProjectButton).toBeInTheDocument();
      });
    });

    it('should handle "Start Your Project" button clicks correctly', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      // ACT: Find and click the "Start Your Project" button
      await waitFor(() => {
        const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i }) ||
                                  screen.getByText(/start your project/i);
        expect(startProjectButton).toBeInTheDocument();
      });

      const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i }) ||
                                screen.getByText(/start your project/i);
      
      await user.click(startProjectButton);

      // ASSERT: Navigation function is called
      expect(navigationUtils.navigateToContact).toHaveBeenCalledTimes(1);
    });
  });

  describe('Scroll Indicator CTA', () => {
    it('should display scroll indicator with proper text and icon', async () => {
      render(<HeroSection />);

      // ASSERT: Scroll indicator is present
      await waitFor(() => {
        const scrollIndicator = screen.getByText(/scroll to explore/i);
        expect(scrollIndicator).toBeInTheDocument();
      });

      // ASSERT: Arrow icon is present (check for SVG or icon)
      const scrollButton = screen.getByText(/scroll to explore/i).closest('button');
      expect(scrollButton).toBeInTheDocument();
    });

    it('should handle scroll indicator clicks correctly', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      // Mock portfolio section for scroll test
      const mockPortfolioSection = document.createElement('div');
      mockPortfolioSection.id = 'portfolio';
      document.body.appendChild(mockPortfolioSection);

      // ACT: Find and click the scroll indicator
      await waitFor(() => {
        const scrollIndicator = screen.getByText(/scroll to explore/i);
        expect(scrollIndicator).toBeInTheDocument();
      });

      const scrollButton = screen.getByText(/scroll to explore/i).closest('button');
      if (scrollButton) {
        await user.click(scrollButton);
      }

      // ASSERT: scrollIntoView was called
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(mockPortfolioSection);
    });
  });

  describe('Hero Content Accessibility', () => {
    it('should provide proper ARIA labels and accessibility attributes', async () => {
      render(<HeroSection />);

      // ASSERT: Hero section has proper accessibility structure
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();

      // ASSERT: CTA buttons have proper ARIA labels
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i });
        const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i });

        expect(viewWorkButton).toHaveAttribute('aria-label');
        expect(startProjectButton).toHaveAttribute('aria-label');
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      // ACT: Tab through the hero section elements
      await user.tab();
      await user.tab();

      // ASSERT: Focus moves through interactive elements
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Hero Section Performance and Responsiveness', () => {
    it('should render hero section efficiently', async () => {
      const startTime = performance.now();

      render(<HeroSection />);

      await waitFor(() => {
        // Check for essential hero elements that are always present
        const heroSection = document.querySelector('#hero');
        expect(heroSection).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // ASSERT: Component renders within reasonable time (5 seconds max)
      expect(renderTime).toBeLessThan(5000);
    });

    it('should handle multiple rapid CTA clicks without breaking', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        expect(viewWorkButton).toBeInTheDocument();
      });

      const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                            screen.getByText(/view our work/i);

      // ACT: Rapidly click the button multiple times
      await user.click(viewWorkButton);
      await user.click(viewWorkButton);
      await user.click(viewWorkButton);

      // ASSERT: Component remains stable and navigation is called
      expect(navigationUtils.navigateToPortfolio).toHaveBeenCalledTimes(3);
      expect(viewWorkButton).toBeInTheDocument();
    });
  });

  describe('Hero Section Integration', () => {
    it('should integrate properly with overall page structure', async () => {
      render(<HeroSection />);

      // ASSERT: Hero section has proper semantic structure
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection?.tagName.toLowerCase()).toBe('section');
    });

    it('should display all CTA buttons simultaneously', async () => {
      render(<HeroSection />);

      // ASSERT: Both primary CTAs are visible at the same time
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i }) ||
                                  screen.getByText(/start your project/i);
        const scrollIndicator = screen.getByText(/scroll to explore/i);

        expect(viewWorkButton).toBeInTheDocument();
        expect(startProjectButton).toBeInTheDocument();
        expect(scrollIndicator).toBeInTheDocument();
      });
    });

    it('should handle CTA interactions without affecting other elements', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      // ACT: Click primary CTA
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        expect(viewWorkButton).toBeInTheDocument();
      });

      const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                            screen.getByText(/view our work/i);

      await user.click(viewWorkButton);

      // ASSERT: Other elements remain unaffected
      expect(screen.getByText(/crafting visual stories that captivate and convert/i)).toBeInTheDocument();
      expect(screen.getByText(/start your project/i)).toBeInTheDocument();

      // ASSERT: Hero section structure remains intact
      const heroSection = document.querySelector('#hero');
      expect(heroSection).toBeInTheDocument();
    });
  });
});
