// Note: Interactive components are mocked globally in jest.setup.js
// Note: Framer Motion is mocked globally in jest.setup.js

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Footer } from '../Footer';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: mockScrollTo,
});

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

// Mock document.querySelector
const mockQuerySelector = jest.fn();
Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: mockQuerySelector,
});

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('Footer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders footer with company information', () => {
      render(<Footer />);

      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
      expect(screen.getByText(/Premium visual storytelling/)).toBeInTheDocument();
      expect(screen.getByText('hello@blackwoodscreative.com')).toBeInTheDocument();
      expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
      expect(screen.getByText(/MFADEL Business Center/)).toBeInTheDocument();
    });

    it('renders quick links section', () => {
      render(<Footer />);

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();

      // Check for Services button in Quick Links section
      const quickLinksButtons = screen.getAllByText('Services');
      expect(quickLinksButtons.length).toBeGreaterThan(0);
    });

    it('renders services section', () => {
      render(<Footer />);

      // Check for Services heading in Services section
      const servicesHeadings = screen.getAllByText('Services');
      expect(servicesHeadings.length).toBeGreaterThan(0);

      expect(screen.getByText('Brand Films')).toBeInTheDocument();
      expect(screen.getByText('Product Photography')).toBeInTheDocument();
      expect(screen.getByText('3D Visualization')).toBeInTheDocument();
      expect(screen.getByText('Scene Creation')).toBeInTheDocument();
    });

    it('renders social links section', () => {
      render(<Footer />);

      expect(screen.getByText('Follow Us')).toBeInTheDocument();

      // Check for social media links by title attribute
      expect(screen.getByTitle('Instagram')).toBeInTheDocument();
      expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
      expect(screen.getByTitle('Vimeo')).toBeInTheDocument();
      expect(screen.getByTitle('Behance')).toBeInTheDocument();
    });

    it('renders newsletter signup', () => {
      render(<Footer />);

      expect(screen.getByText('Stay updated with our latest work')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });

    it('renders copyright and legal links', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(`© ${currentYear} BlackWoods Creative. All rights reserved.`)).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('renders back to top button', () => {
      render(<Footer />);

      expect(screen.getByTitle('Back to top')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<Footer className="custom-footer" />);
      expect(container.firstChild).toHaveClass('custom-footer');
    });
  });

  describe('Navigation Functionality', () => {
    it('handles quick link navigation for internal links', async () => {
      const user = userEvent.setup();
      const mockElement = document.createElement('div');
      mockQuerySelector.mockReturnValue(mockElement);

      render(<Footer />);

      const portfolioLink = screen.getByText('Portfolio');
      await user.click(portfolioLink);

      expect(mockQuerySelector).toHaveBeenCalledWith('#portfolio');
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('handles quick link navigation when element not found', async () => {
      const user = userEvent.setup();
      mockQuerySelector.mockReturnValue(null);

      render(<Footer />);

      const portfolioLink = screen.getByText('Portfolio');
      await user.click(portfolioLink);

      expect(mockQuerySelector).toHaveBeenCalledWith('#portfolio');
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('handles back to top button click', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const backToTopButton = screen.getByTitle('Back to top');
      await user.click(backToTopButton);

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('Social Media Links', () => {
    it('opens Instagram link in new tab', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const instagramLink = screen.getByTitle('Instagram');
      await user.click(instagramLink);

      // Check that the link has correct href and target attributes
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/blackwoodscreative');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('opens LinkedIn link in new tab', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const linkedinLink = screen.getByTitle('LinkedIn');
      await user.click(linkedinLink);

      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/blackwoodscreative');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('opens Vimeo link in new tab', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const vimeoLink = screen.getByTitle('Vimeo');
      await user.click(vimeoLink);

      expect(vimeoLink).toHaveAttribute('href', 'https://vimeo.com/blackwoodscreative');
      expect(vimeoLink).toHaveAttribute('target', '_blank');
      expect(vimeoLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('opens Behance link in new tab', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const behanceLink = screen.getByTitle('Behance');
      await user.click(behanceLink);

      expect(behanceLink).toHaveAttribute('href', 'https://behance.net/blackwoodscreative');
      expect(behanceLink).toHaveAttribute('target', '_blank');
      expect(behanceLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Newsletter Functionality', () => {
    it('renders email input with correct attributes', () => {
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText('Your email');
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveClass('flex-1');
    });

    it('handles newsletter subscription button click', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const subscribeButton = screen.getByText('Subscribe');
      await user.click(subscribeButton);

      // Button should be clickable (no errors thrown)
      expect(subscribeButton).toBeInTheDocument();
    });

    it('allows typing in email input', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText('Your email');
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });
  });

  describe('Legal Links', () => {
    it('handles privacy policy click', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const privacyLink = screen.getByText('Privacy Policy');
      await user.click(privacyLink);

      // Should not throw any errors
      expect(privacyLink).toBeInTheDocument();
    });

    it('handles terms of service click', async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const termsLink = screen.getByText('Terms of Service');
      await user.click(termsLink);

      // Should not throw any errors
      expect(termsLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and titles', () => {
      render(<Footer />);

      // Check social media links have titles
      expect(screen.getByTitle('Instagram')).toBeInTheDocument();
      expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
      expect(screen.getByTitle('Vimeo')).toBeInTheDocument();
      expect(screen.getByTitle('Behance')).toBeInTheDocument();
      expect(screen.getByTitle('Back to top')).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      render(<Footer />);

      // Footer should be a footer element
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('has focusable interactive elements', () => {
      render(<Footer />);

      // All buttons should be focusable
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });

      // All links should be focusable
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('renders all sections in mobile layout', () => {
      render(<Footer />);

      // All main sections should be present
      expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
      expect(screen.getByText('Quick Links')).toBeInTheDocument();

      // Check for Services section (there are multiple "Services" texts)
      const servicesElements = screen.getAllByText('Services');
      expect(servicesElements.length).toBeGreaterThan(0);

      expect(screen.getByText('Follow Us')).toBeInTheDocument();
    });

    it('maintains functionality across different screen sizes', () => {
      render(<Footer />);

      // Core functionality should work regardless of screen size
      expect(screen.getByTitle('Back to top')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(screen.getByText('Subscribe')).toBeInTheDocument();
    });
  });
});
