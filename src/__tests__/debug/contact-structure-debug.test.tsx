/**
 * DEBUG TEST: Contact Section Structure Analysis
 * 
 * This test helps us understand the actual structure of the ContactSection
 * component so we can write accurate tests.
 */

import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import { ContactSection } from '@/components/sections/ContactSection';

describe('DEBUG: Contact Section Structure', () => {
  it('should render and show actual DOM structure', async () => {
    render(<ContactSection />);

    // Wait a moment for any async rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the actual DOM structure
    const contactSection = screen.getByTestId('contact-section');
    console.log('=== CONTACT SECTION DOM STRUCTURE ===');
    console.log(contactSection.innerHTML);

    // Check what form elements actually exist
    console.log('=== FORM ELEMENTS ===');
    const formElements = contactSection.querySelectorAll('input, textarea, select, button');
    formElements.forEach((el, index) => {
      console.log(`- ${index}: ${el.tagName} - id: "${el.id}" - name: "${el.getAttribute('name')}" - type: "${el.getAttribute('type')}" - placeholder: "${el.getAttribute('placeholder')}"`);
    });

    // Check for labels
    console.log('=== FORM LABELS ===');
    const labels = contactSection.querySelectorAll('label');
    labels.forEach((label, index) => {
      console.log(`- Label ${index}: "${label.textContent}" - for: "${label.getAttribute('for')}"`);
    });

    // Check for buttons
    console.log('=== BUTTONS ===');
    const buttons = contactSection.querySelectorAll('button');
    buttons.forEach((button, index) => {
      console.log(`- Button ${index}: "${button.textContent?.trim()}" - type: "${button.getAttribute('type')}"`);
    });

    // Check for contact info elements
    console.log('=== CONTACT INFO ELEMENTS ===');
    const contactLinks = contactSection.querySelectorAll('a[href*="mailto"], a[href*="tel"]');
    contactLinks.forEach((link, index) => {
      console.log(`- Contact ${index}: "${link.textContent?.trim()}" - href: "${link.getAttribute('href')}"`);
    });

    // Basic assertion to make test pass
    expect(contactSection).toBeInTheDocument();
  });
});
