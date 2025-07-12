/**
 * DEBUG TEST: Portfolio Component Structure Analysis
 * 
 * This test helps us understand the actual structure of the PortfolioSection
 * component so we can write accurate tests.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { PortfolioSection } from '@/components/sections/PortfolioSection';

describe('DEBUG: Portfolio Component Structure', () => {
  it('should render and show actual DOM structure', async () => {
    render(<PortfolioSection />);

    // Wait a moment for any async rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the actual DOM structure
    const portfolioSection = screen.getByTestId('portfolio-section');
    console.log('=== PORTFOLIO SECTION DOM STRUCTURE ===');
    console.log(portfolioSection.innerHTML);

    // Check what elements actually exist
    console.log('=== AVAILABLE TEST IDS ===');
    const allElements = portfolioSection.querySelectorAll('[data-testid]');
    allElements.forEach(el => {
      console.log(`- ${el.getAttribute('data-testid')}: ${el.tagName}`);
    });

    // Check for portfolio-related elements
    console.log('=== PORTFOLIO-RELATED ELEMENTS ===');
    const portfolioElements = portfolioSection.querySelectorAll('[class*="portfolio"], [id*="portfolio"]');
    portfolioElements.forEach(el => {
      console.log(`- ${el.tagName}.${el.className} #${el.id}`);
    });

    // Check for filter-related elements
    console.log('=== FILTER-RELATED ELEMENTS ===');
    const filterElements = portfolioSection.querySelectorAll('button, input[type="text"], select');
    filterElements.forEach(el => {
      console.log(`- ${el.tagName}: ${el.textContent || el.getAttribute('placeholder') || 'no text'}`);
    });

    // Check for grid/item containers
    console.log('=== GRID/CONTAINER ELEMENTS ===');
    const gridElements = portfolioSection.querySelectorAll('[class*="grid"], [class*="flex"], [class*="container"]');
    gridElements.forEach(el => {
      console.log(`- ${el.tagName}.${el.className}: ${el.children.length} children`);
    });

    // Basic assertion to make test pass
    expect(portfolioSection).toBeInTheDocument();
  });
});
