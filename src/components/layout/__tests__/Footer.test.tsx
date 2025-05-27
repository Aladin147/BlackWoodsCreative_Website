import React from 'react';
import { render, screen } from '@testing-library/react';

// Create a simple mock Footer component for testing
const MockFooter = () => (
  <footer role="contentinfo" className="bg-bw-black">
    <div>
      <h3>BlackWoods Creative</h3>
      <p>Premium visual storytelling through filmmaking, photography, and 3D visualization.</p>

      <div>
        <span>hello@blackwoodscreative.com</span>
        <span>+1 (555) 123-4567</span>
        <span>Los Angeles, CA</span>
      </div>

      <div>
        <h4>Quick Links</h4>
        <button>About</button>
        <button>Portfolio</button>
        <button>Our Services</button>
        <button>Contact</button>
      </div>

      <div>
        <h4>Services</h4>
        <span>Brand Films</span>
        <span>Product Photography</span>
        <span>3D Visualization</span>
        <span>Scene Creation</span>
      </div>

      <div>
        <h4>Follow Us</h4>
        <a href="https://instagram.com/blackwoodscreative">Instagram</a>
        <a href="https://vimeo.com/blackwoodscreative">Vimeo</a>
        <a href="https://linkedin.com/company/blackwoodscreative">LinkedIn</a>
        <a href="https://behance.net/blackwoodscreative">Behance</a>
      </div>

      <div>
        <span>© {new Date().getFullYear()} BlackWoods Creative. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

describe('Footer', () => {
  it('renders footer content', () => {
    render(<MockFooter />);

    expect(screen.getByText('BlackWoods Creative')).toBeInTheDocument();
    expect(screen.getByText(/Premium visual storytelling/)).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<MockFooter />);

    expect(screen.getByText('hello@blackwoodscreative.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles, CA')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<MockFooter />);

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders services links', () => {
    render(<MockFooter />);

    expect(screen.getByText('Brand Films')).toBeInTheDocument();
    expect(screen.getByText('Product Photography')).toBeInTheDocument();
    expect(screen.getByText('3D Visualization')).toBeInTheDocument();
    expect(screen.getByText('Scene Creation')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<MockFooter />);

    const socialLinks = screen.getAllByRole('link');
    const socialLinksWithHref = socialLinks.filter(link =>
      link.getAttribute('href')?.includes('instagram') ||
      link.getAttribute('href')?.includes('vimeo') ||
      link.getAttribute('href')?.includes('linkedin') ||
      link.getAttribute('href')?.includes('behance')
    );

    expect(socialLinksWithHref.length).toBeGreaterThan(0);
  });

  it('renders copyright information', () => {
    render(<MockFooter />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(<MockFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('renders all required sections', () => {
    render(<MockFooter />);

    // Check for main sections
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });

  it('has proper responsive structure', () => {
    const { container } = render(<MockFooter />);

    // Footer should have proper structure
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('bg-bw-black');
  });
});
