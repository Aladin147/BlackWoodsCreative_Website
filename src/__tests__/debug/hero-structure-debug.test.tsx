/**
 * DEBUG TEST: Hero Section Structure Analysis
 * 
 * This test helps us understand the actual structure of the HeroSection
 * component so we can write accurate tests.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { HeroSection } from '@/components/sections/HeroSection';

describe('DEBUG: Hero Section Structure', () => {
  it('should render and show actual DOM structure', async () => {
    render(<HeroSection />);

    // Wait a moment for any async rendering and animations
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Log the actual DOM structure
    const heroSection = document.querySelector('#hero');
    console.log('=== HERO SECTION DOM STRUCTURE ===');
    if (heroSection) {
      console.log(heroSection.innerHTML);
    }

    // Check what text content is actually available
    console.log('=== AVAILABLE TEXT CONTENT ===');
    const allTextElements = document.querySelectorAll('*');
    allTextElements.forEach(el => {
      if (el.textContent && el.textContent.trim().length > 0) {
        console.log(`- ${el.tagName}: "${el.textContent.trim()}"`);
      }
    });

    // Check for CTA buttons
    console.log('=== CTA BUTTONS ===');
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      console.log(`- Button ${index}: "${button.textContent?.trim()}" - aria-label: "${button.getAttribute('aria-label')}"`);
    });

    // Check for loading states
    console.log('=== LOADING STATES ===');
    const loadingElements = document.querySelectorAll('.animate-pulse, .opacity-0');
    console.log(`Found ${loadingElements.length} elements with loading states`);

    // Basic assertion to make test pass
    expect(heroSection).toBeInTheDocument();
  });
});
