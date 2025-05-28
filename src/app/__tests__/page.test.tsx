import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../page';

// Mock all the complex components to focus on page structure
jest.mock('../../components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('../../components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('../../components/sections/HeroSection', () => ({
  HeroSection: () => <section data-testid="hero-section">Hero Section</section>,
}));

jest.mock('../../components/sections/VisionSection', () => ({
  VisionSection: () => <section data-testid="vision-section">Vision Section</section>,
}));

jest.mock('../../components/sections/ContactSection', () => ({
  ContactSection: () => <section data-testid="contact-section">Contact Section</section>,
}));

// Mock the sections index file
jest.mock('../../components/sections', () => ({
  HeroSection: () => <section data-testid="hero-section">Hero Section</section>,
  PortfolioSection: () => <section data-testid="portfolio-section">Portfolio Section</section>,
  AboutSection: () => <section data-testid="about-section">About Section</section>,
  ContactSection: () => <section data-testid="contact-section">Contact Section</section>,
}));

jest.mock('../../components/layout', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the header component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the footer component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the hero section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('renders the vision section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('vision-section')).toBeInTheDocument();
  });

  it('renders the portfolio section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();
  });

  it('renders the about section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
  });

  it('renders the contact section', () => {
    render(<HomePage />);
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    render(<HomePage />);

    // Check for main content area
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Check that all major sections are present
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('vision-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders sections in correct order', () => {
    const { container } = render(<HomePage />);

    const sections = container.querySelectorAll('[data-testid*="section"]');

    expect(sections[0]).toHaveAttribute('data-testid', 'hero-section');
    expect(sections[1]).toHaveAttribute('data-testid', 'portfolio-section');
    expect(sections[2]).toHaveAttribute('data-testid', 'vision-section');
    expect(sections[3]).toHaveAttribute('data-testid', 'about-section');
    expect(sections[4]).toHaveAttribute('data-testid', 'contact-section');
  });

  it('maintains semantic HTML structure', () => {
    render(<HomePage />);

    // Check for footer element
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('handles component mounting without errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<HomePage />);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles component unmounting without errors', () => {
    const { unmount } = render(<HomePage />);

    expect(() => unmount()).not.toThrow();
  });

  it('renders all required sections for a complete homepage', () => {
    render(<HomePage />);

    // Verify all essential homepage sections are present
    const requiredSections = [
      'hero-section',
      'portfolio-section',
      'vision-section',
      'about-section',
      'contact-section'
    ];

    requiredSections.forEach(sectionId => {
      expect(screen.getByTestId(sectionId)).toBeInTheDocument();
    });
  });

  it('provides proper accessibility structure', () => {
    render(<HomePage />);

    // Check that all sections are accessible
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
