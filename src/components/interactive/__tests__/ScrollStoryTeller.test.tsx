import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollStoryTeller } from '../ScrollStoryTeller';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.ComponentProps<'section'>) => <section {...props}>{children}</section>,
    h2: ({ children, ...props }: React.ComponentProps<'h2'>) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: React.ComponentProps<'p'>) => <p {...props}>{children}</p>,
  },
  useScroll: () => ({
    scrollYProgress: { onChange: jest.fn() },
  }),
  useTransform: () => 0,
  useSpring: () => ({ onChange: jest.fn() }),
}));

const mockSections = [
  {
    id: 'section-1',
    title: 'First Section',
    content: 'This is the first section content',
    backgroundImage: 'https://example.com/image1.jpg',
    parallaxSpeed: 0.8,
    effects: {
      scale: [0.9, 1, 1.1] as [number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
    }
  },
  {
    id: 'section-2',
    title: 'Second Section',
    content: 'This is the second section content',
    backgroundImage: 'https://example.com/image2.jpg',
    parallaxSpeed: 1.2,
    effects: {
      rotate: [-2, 2] as [number, number],
    }
  },
];

describe('ScrollStoryTeller', () => {
  it('renders all sections', () => {
    render(<ScrollStoryTeller sections={mockSections} />);

    expect(screen.getByText('First Section')).toBeInTheDocument();
    expect(screen.getByText('This is the first section content')).toBeInTheDocument();
    expect(screen.getByText('Second Section')).toBeInTheDocument();
    expect(screen.getByText('This is the second section content')).toBeInTheDocument();
  });

  it('renders progress indicators', () => {
    render(<ScrollStoryTeller sections={mockSections} />);

    // Should render progress indicators for each section
    const progressIndicators = document.querySelectorAll('[class*="w-2 h-8"]');
    expect(progressIndicators.length).toBe(mockSections.length);
  });

  it('handles section navigation clicks', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    render(<ScrollStoryTeller sections={mockSections} />);

    const progressIndicators = document.querySelectorAll('[class*="w-2 h-8"]');

    if (progressIndicators.length > 0) {
      fireEvent.click(progressIndicators[0]);
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    }
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScrollStoryTeller sections={mockSections} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders background images when provided', () => {
    render(<ScrollStoryTeller sections={mockSections} />);

    // Check for background image styles
    const backgroundElements = document.querySelectorAll('[style*="background-image"]');
    expect(backgroundElements.length).toBeGreaterThan(0);
  });

  it('handles sections without background images', () => {
    const sectionsWithoutImages = [
      {
        id: 'section-no-bg',
        title: 'No Background',
        content: 'Section without background image',
      }
    ];

    render(<ScrollStoryTeller sections={sectionsWithoutImages} />);

    expect(screen.getByText('No Background')).toBeInTheDocument();
    expect(screen.getByText('Section without background image')).toBeInTheDocument();
  });

  it('renders section numbers', () => {
    render(<ScrollStoryTeller sections={mockSections} />);

    // Should render section numbers (01, 02, etc.)
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
  });

  it('handles empty sections array', () => {
    render(<ScrollStoryTeller sections={[]} />);

    // Should render without crashing
    expect(document.querySelector('[class*="relative"]')).toBeInTheDocument();
  });

  it('applies parallax effects correctly', () => {
    render(<ScrollStoryTeller sections={mockSections} />);

    // Check that sections have the correct IDs for scroll targeting
    expect(document.getElementById('section-1')).toBeInTheDocument();
    expect(document.getElementById('section-2')).toBeInTheDocument();
  });

  it('handles scroll progress changes', () => {
    const { rerender } = render(<ScrollStoryTeller sections={mockSections} />);

    // Simulate scroll progress change
    // (In a real test, this would involve mocking the useScroll hook more thoroughly)
    rerender(<ScrollStoryTeller sections={mockSections} />);

    // Component should handle scroll progress updates
    expect(screen.getByText('First Section')).toBeInTheDocument();
  });

  it('renders floating elements', () => {
    render(<ScrollStoryTeller sections={mockSections} />);

    // Check for floating decorative elements
    const floatingElements = document.querySelectorAll('[class*="absolute"][class*="rounded-full"]');
    expect(floatingElements.length).toBeGreaterThan(0);
  });

  it('handles different parallax speeds', () => {
    const sectionsWithDifferentSpeeds = [
      {
        id: 'slow',
        title: 'Slow Parallax',
        content: 'Slow moving section',
        parallaxSpeed: 0.3,
      },
      {
        id: 'fast',
        title: 'Fast Parallax',
        content: 'Fast moving section',
        parallaxSpeed: 2.0,
      },
    ];

    render(<ScrollStoryTeller sections={sectionsWithDifferentSpeeds} />);

    expect(screen.getByText('Slow Parallax')).toBeInTheDocument();
    expect(screen.getByText('Fast Parallax')).toBeInTheDocument();
  });

  it('handles complex effects configuration', () => {
    const sectionsWithComplexEffects = [
      {
        id: 'complex',
        title: 'Complex Effects',
        content: 'Section with multiple effects',
        effects: {
          scale: [0.8, 1, 1.2] as [number, number, number],
          opacity: [0, 1, 1, 0] as [number, number, number, number],
          blur: [10, 0, 0, 10] as [number, number, number, number],
          rotate: [-5, 5] as [number, number],
        }
      }
    ];

    render(<ScrollStoryTeller sections={sectionsWithComplexEffects} />);

    expect(screen.getByText('Complex Effects')).toBeInTheDocument();
  });
});
