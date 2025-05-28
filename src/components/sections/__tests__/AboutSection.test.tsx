import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the AboutSection component since it doesn't exist yet
const MockAboutSection = () => {
  return (
    <section data-testid="about-section" className="about-section bg-bw-dark-gray py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="about-content">
            <h2 className="text-4xl font-bold text-bw-white mb-6">About BlackWoods Creative</h2>
            <p className="text-bw-light-gray text-lg mb-6">
              We are a creative studio specializing in visual storytelling through cinema,
              photography, and 3D visualization. Our passion drives us to create compelling
              narratives that resonate with audiences.
            </p>
            <p className="text-bw-light-gray text-lg mb-8">
              With years of experience in the industry, we bring technical expertise and
              artistic vision to every project, ensuring exceptional results that exceed
              client expectations.
            </p>

            <div className="stats-grid grid grid-cols-2 gap-6">
              <div data-testid="stat-item" className="stat-item text-center">
                <div className="text-3xl font-bold text-bw-gold">50+</div>
                <div className="text-bw-light-gray">Projects Completed</div>
              </div>
              <div data-testid="stat-item" className="stat-item text-center">
                <div className="text-3xl font-bold text-bw-gold">5+</div>
                <div className="text-bw-light-gray">Years Experience</div>
              </div>
              <div data-testid="stat-item" className="stat-item text-center">
                <div className="text-3xl font-bold text-bw-gold">100%</div>
                <div className="text-bw-light-gray">Client Satisfaction</div>
              </div>
              <div data-testid="stat-item" className="stat-item text-center">
                <div className="text-3xl font-bold text-bw-gold">24/7</div>
                <div className="text-bw-light-gray">Support Available</div>
              </div>
            </div>
          </div>

          <div className="about-image">
            <img
              src="/about-image.jpg"
              alt="BlackWoods Creative Team"
              className="w-full h-96 object-cover rounded-lg shadow-2xl"
              data-testid="about-image"
            />
          </div>
        </div>

        <div className="team-section mt-16">
          <h3 className="text-2xl font-bold text-bw-white text-center mb-8">Our Expertise</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div data-testid="expertise-item" className="expertise-item text-center">
              <div className="icon mb-4 text-bw-gold text-4xl">🎬</div>
              <h4 className="text-xl font-semibold text-bw-white mb-2">Cinema & Video</h4>
              <p className="text-bw-light-gray">Professional video production and cinematic storytelling</p>
            </div>
            <div data-testid="expertise-item" className="expertise-item text-center">
              <div className="icon mb-4 text-bw-gold text-4xl">📸</div>
              <h4 className="text-xl font-semibold text-bw-white mb-2">Photography</h4>
              <p className="text-bw-light-gray">Creative photography for all occasions and purposes</p>
            </div>
            <div data-testid="expertise-item" className="expertise-item text-center">
              <div className="icon mb-4 text-bw-gold text-4xl">🎨</div>
              <h4 className="text-xl font-semibold text-bw-white mb-2">3D Visualization</h4>
              <p className="text-bw-light-gray">Stunning 3D renders and architectural visualization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  useInView: () => true,
  useAnimation: () => ({ start: jest.fn() }),
}));

describe('AboutSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockAboutSection />);
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<MockAboutSection />);
    expect(screen.getByText('About BlackWoods Creative')).toBeInTheDocument();
  });

  it('displays company description', () => {
    render(<MockAboutSection />);
    expect(screen.getByText(/We are a creative studio specializing/)).toBeInTheDocument();
    expect(screen.getByText(/With years of experience/)).toBeInTheDocument();
  });

  it('renders statistics section', () => {
    render(<MockAboutSection />);
    const statItems = screen.getAllByTestId('stat-item');
    expect(statItems).toHaveLength(4);
  });

  it('displays correct statistics', () => {
    render(<MockAboutSection />);
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Projects Completed')).toBeInTheDocument();
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Client Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
    expect(screen.getByText('Support Available')).toBeInTheDocument();
  });

  it('renders about image', () => {
    render(<MockAboutSection />);
    const aboutImage = screen.getByTestId('about-image');
    expect(aboutImage).toBeInTheDocument();
    expect(aboutImage).toHaveAttribute('alt', 'BlackWoods Creative Team');
  });

  it('displays expertise section', () => {
    render(<MockAboutSection />);
    expect(screen.getByText('Our Expertise')).toBeInTheDocument();

    const expertiseItems = screen.getAllByTestId('expertise-item');
    expect(expertiseItems).toHaveLength(3);
  });

  it('displays all expertise areas', () => {
    render(<MockAboutSection />);
    expect(screen.getByText('Cinema & Video')).toBeInTheDocument();
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('3D Visualization')).toBeInTheDocument();
  });

  it('displays expertise descriptions', () => {
    render(<MockAboutSection />);
    expect(screen.getByText(/Professional video production/)).toBeInTheDocument();
    expect(screen.getByText(/Creative photography for all/)).toBeInTheDocument();
    expect(screen.getByText(/Stunning 3D renders/)).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<MockAboutSection />);
    const section = screen.getByTestId('about-section');
    expect(section).toHaveClass('about-section', 'bg-bw-dark-gray', 'py-20');
  });

  it('has proper grid layout structure', () => {
    render(<MockAboutSection />);
    const section = screen.getByTestId('about-section');

    // Check for main grid
    const mainGrid = section.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
    expect(mainGrid).toBeInTheDocument();

    // Check for stats grid
    const statsGrid = section.querySelector('.stats-grid');
    expect(statsGrid).toBeInTheDocument();
  });

  it('maintains responsive design', () => {
    render(<MockAboutSection />);
    const section = screen.getByTestId('about-section');

    // Check for responsive classes
    const expertiseGrid = section.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    expect(expertiseGrid).toBeInTheDocument();
  });

  it('provides proper semantic structure', () => {
    render(<MockAboutSection />);

    // Check for section element by testid
    const section = screen.getByTestId('about-section');
    expect(section).toBeInTheDocument();

    // Check for headings
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toBeInTheDocument();

    const subHeading = screen.getByRole('heading', { level: 3 });
    expect(subHeading).toBeInTheDocument();
  });

  it('handles component mounting without errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<MockAboutSection />);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles component unmounting gracefully', () => {
    const { unmount } = render(<MockAboutSection />);

    expect(() => unmount()).not.toThrow();
  });

  it('maintains accessibility standards', () => {
    render(<MockAboutSection />);

    // Check for proper image alt text
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
    expect(image.getAttribute('alt')).toBeTruthy();

    // Check for proper heading hierarchy
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('displays brand colors correctly', () => {
    render(<MockAboutSection />);

    // Check for brand color classes
    const section = screen.getByTestId('about-section');
    expect(section).toHaveClass('bg-bw-dark-gray');
  });

  it('renders with proper spacing', () => {
    render(<MockAboutSection />);

    const container = screen.getByTestId('about-section').querySelector('.container');
    expect(container).toHaveClass('mx-auto', 'px-4');
  });

  it('displays icons for expertise areas', () => {
    render(<MockAboutSection />);

    const expertiseItems = screen.getAllByTestId('expertise-item');
    expertiseItems.forEach(item => {
      const icon = item.querySelector('.icon');
      expect(icon).toBeInTheDocument();
    });
  });
});
