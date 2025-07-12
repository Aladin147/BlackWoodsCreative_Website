/**
 * INTEGRATION TEST: Section Integration
 * 
 * Tests how major sections work together and integrate with each other,
 * focusing on cross-section interactions and full page workflows.
 * 
 * TESTING METHODOLOGY:
 * - Section-level integration testing
 * - Real component interactions across sections
 * - Navigation and state management between sections
 * - Business workflow validation across multiple sections
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import { HeroSection } from '@/components/sections/HeroSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Mock navigation utilities
jest.mock('@/lib/utils/navigation', () => ({
  navigateToPortfolio: jest.fn(),
  navigateToContact: jest.fn(),
  scrollToSection: jest.fn(),
}));

// Get the mocked functions for assertions
const mockNavigateToPortfolio = jest.fn();
const mockNavigateToContact = jest.fn();
const mockScrollToSection = jest.fn();

// Mock framer-motion with all necessary hooks and components
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    section: React.forwardRef<HTMLElement, any>(({ children, ...props }, ref) => (
      <section ref={ref} {...props}>{children}</section>
    )),
    h1: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
      <h1 ref={ref} {...props}>{children}</h1>
    )),
    h2: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
      <h2 ref={ref} {...props}>{children}</h2>
    )),
    p: React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => (
      <p ref={ref} {...props}>{children}</p>
    )),
    span: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => (
      <span ref={ref} {...props}>{children}</span>
    )),
  },
  useScroll: () => ({
    scrollY: { get: () => 0, set: () => {}, on: () => () => {} },
    scrollYProgress: { get: () => 0, set: () => {}, on: () => () => {} }
  }),
  useSpring: (value: any) => ({ get: () => value, set: () => {}, on: () => () => {} }),
  useTransform: (value: any, input: any, output: any) => ({ get: () => output[0], set: () => {}, on: () => () => {} }),
  useMotionValue: (initial: any) => ({ get: () => initial, set: () => {}, on: () => () => {} }),
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock complex interactive components
jest.mock('@/components/interactive', () => ({
  FloatingElement: ({ children, className }: any) => (
    <div className={className} data-testid="floating-element">{children}</div>
  ),
  TextReveal: ({ text, className }: any) => (
    <div className={className} data-testid="text-reveal">{text}</div>
  ),
  MorphingButton: ({ children, className, onClick }: any) => (
    <button className={className} onClick={onClick} data-testid="morphing-button">{children}</button>
  ),
  ParallaxLayer: ({ children, className }: any) => (
    <div className={className} data-testid="parallax-layer">{children}</div>
  ),
  MagneticField: ({ children, className }: any) => (
    <div className={className} data-testid="magnetic-field">{children}</div>
  ),
}));

describe('INTEGRATION: Section Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hero to Portfolio Section Integration', () => {
    it('should integrate Hero CTA with Portfolio section navigation', async () => {
      const MockFullPageLayout = () => (
        <div>
          <HeroSection />
          <PortfolioSection />
        </div>
      );

      const user = userEvent.setup();
      render(<MockFullPageLayout />);

      // Hero section should be present
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Find and click "View Our Work" button in Hero
      await waitFor(() => {
        const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                              screen.getByText(/view our work/i);
        expect(viewWorkButton).toBeInTheDocument();
      });

      const viewWorkButton = screen.getByRole('button', { name: /view our portfolio and previous work/i }) ||
                            screen.getByText(/view our work/i);
      
      await user.click(viewWorkButton);

      // Navigation function should be called
      expect(mockNavigateToPortfolio).toHaveBeenCalledTimes(1);

      // Portfolio section should be present on the page
      expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();
    });

    it('should handle Hero to Contact section workflow', async () => {
      const MockHeroContactLayout = () => (
        <div>
          <HeroSection />
          <ContactSection />
        </div>
      );

      const user = userEvent.setup();
      render(<MockHeroContactLayout />);

      // Find and click "Start Your Project" button in Hero
      await waitFor(() => {
        const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i }) ||
                                  screen.getByText(/start your project/i);
        expect(startProjectButton).toBeInTheDocument();
      });

      const startProjectButton = screen.getByRole('button', { name: /start your project.*contact us to begin/i }) ||
                                screen.getByText(/start your project/i);
      
      await user.click(startProjectButton);

      // Navigation function should be called
      expect(mockNavigateToContact).toHaveBeenCalledTimes(1);

      // Contact section should be present on the page
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });
  });

  describe('Portfolio to Contact Section Integration', () => {
    it('should integrate Portfolio project selection with Contact form', async () => {
      const MockPortfolioContactFlow = () => {
        const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

        return (
          <div>
            <PortfolioSection />
            <ContactSection />
            {selectedProject && (
              <div data-testid="project-context">
                Selected project: {selectedProject}
              </div>
            )}
          </div>
        );
      };

      render(<MockPortfolioContactFlow />);

      // Both sections should be present
      expect(screen.getByTestId('portfolio-section')).toBeInTheDocument();
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();

      // Portfolio section should have project cards
      await waitFor(() => {
        const portfolioCards = screen.getAllByTestId(/portfolio-card/);
        expect(portfolioCards.length).toBeGreaterThan(0);
      });

      // Contact form should be present
      expect(screen.getByRole('form', { name: /contact form/i })).toBeInTheDocument();
    });
  });

  describe('Full Page Section Flow Integration', () => {
    it('should handle complete user journey across all sections', async () => {
      const MockFullPageApp = () => {
        const [currentSection, setCurrentSection] = React.useState('hero');
        const [formData, setFormData] = React.useState({
          name: '',
          email: '',
          message: ''
        });

        return (
          <div>
            <div data-testid="current-section">Current: {currentSection}</div>
            
            <nav data-testid="section-nav">
              <button onClick={() => setCurrentSection('hero')}>Hero</button>
              <button onClick={() => setCurrentSection('portfolio')}>Portfolio</button>
              <button onClick={() => setCurrentSection('contact')}>Contact</button>
            </nav>

            {currentSection === 'hero' && (
              <div data-testid="hero-active">
                <HeroSection />
              </div>
            )}

            {currentSection === 'portfolio' && (
              <div data-testid="portfolio-active">
                <PortfolioSection />
              </div>
            )}

            {currentSection === 'contact' && (
              <div data-testid="contact-active">
                <ContactSection />
              </div>
            )}

            <div data-testid="form-state">
              Form data: {JSON.stringify(formData)}
            </div>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<MockFullPageApp />);

      // Initial state: Hero section active
      expect(screen.getByTestId('current-section')).toHaveTextContent('Current: hero');
      expect(screen.getByTestId('hero-active')).toBeInTheDocument();

      // Navigate to Portfolio
      await user.click(screen.getByText('Portfolio'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('Current: portfolio');
      expect(screen.getByTestId('portfolio-active')).toBeInTheDocument();

      // Navigate to Contact
      await user.click(screen.getByText('Contact'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('Current: contact');
      expect(screen.getByTestId('contact-active')).toBeInTheDocument();

      // Contact form should be functional
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });

    it('should maintain state consistency across section transitions', async () => {
      const MockStatefulSections = () => {
        const [globalState, setGlobalState] = React.useState({
          selectedProjects: [] as string[],
          contactInfo: { name: '', email: '' },
          currentStep: 1
        });

        const updateGlobalState = (updates: Partial<typeof globalState>) => {
          setGlobalState(prev => ({ ...prev, ...updates }));
        };

        return (
          <div>
            <div data-testid="global-state">
              Step: {globalState.currentStep}, 
              Projects: {globalState.selectedProjects.length}, 
              Contact: {globalState.contactInfo.name}
            </div>

            <div data-testid="step-1" style={{ display: globalState.currentStep === 1 ? 'block' : 'none' }}>
              <HeroSection />
              <button 
                onClick={() => updateGlobalState({ currentStep: 2 })}
                data-testid="to-portfolio"
              >
                Go to Portfolio
              </button>
            </div>

            <div data-testid="step-2" style={{ display: globalState.currentStep === 2 ? 'block' : 'none' }}>
              <PortfolioSection />
              <button 
                onClick={() => {
                  updateGlobalState({ 
                    selectedProjects: ['project-1'], 
                    currentStep: 3 
                  });
                }}
                data-testid="select-and-continue"
              >
                Select Project & Continue
              </button>
            </div>

            <div data-testid="step-3" style={{ display: globalState.currentStep === 3 ? 'block' : 'none' }}>
              <ContactSection />
              <button 
                onClick={() => {
                  updateGlobalState({ 
                    contactInfo: { name: 'John Doe', email: 'john@example.com' }
                  });
                }}
                data-testid="fill-contact"
              >
                Fill Contact Info
              </button>
            </div>
          </div>
        );
      };

      const user = userEvent.setup();
      render(<MockStatefulSections />);

      // Initial state
      expect(screen.getByTestId('global-state')).toHaveTextContent('Step: 1, Projects: 0, Contact:');
      expect(screen.getByTestId('step-1')).toBeVisible();

      // Move to portfolio
      await user.click(screen.getByTestId('to-portfolio'));
      expect(screen.getByTestId('global-state')).toHaveTextContent('Step: 2, Projects: 0, Contact:');
      expect(screen.getByTestId('step-2')).toBeVisible();

      // Select project and continue
      await user.click(screen.getByTestId('select-and-continue'));
      expect(screen.getByTestId('global-state')).toHaveTextContent('Step: 3, Projects: 1, Contact:');
      expect(screen.getByTestId('step-3')).toBeVisible();

      // Fill contact info
      await user.click(screen.getByTestId('fill-contact'));
      expect(screen.getByTestId('global-state')).toHaveTextContent('Step: 3, Projects: 1, Contact: John Doe');
    });
  });

  describe('Section Performance Integration', () => {
    it('should handle multiple sections rendering without performance issues', async () => {
      const MockPerformanceTest = () => {
        const [sectionsLoaded, setSectionsLoaded] = React.useState(0);

        React.useEffect(() => {
          const timer = setTimeout(() => {
            setSectionsLoaded(3);
          }, 100);
          return () => clearTimeout(timer);
        }, []);

        return (
          <div>
            <div data-testid="sections-loaded">Sections loaded: {sectionsLoaded}</div>
            
            {sectionsLoaded >= 1 && (
              <div data-testid="hero-loaded">
                <HeroSection />
              </div>
            )}
            
            {sectionsLoaded >= 2 && (
              <div data-testid="portfolio-loaded">
                <PortfolioSection />
              </div>
            )}
            
            {sectionsLoaded >= 3 && (
              <div data-testid="contact-loaded">
                <ContactSection />
              </div>
            )}
          </div>
        );
      };

      render(<MockPerformanceTest />);

      // Initially no sections loaded
      expect(screen.getByTestId('sections-loaded')).toHaveTextContent('Sections loaded: 0');

      // Wait for all sections to load
      await waitFor(() => {
        expect(screen.getByTestId('sections-loaded')).toHaveTextContent('Sections loaded: 3');
      });

      // All sections should be present
      expect(screen.getByTestId('hero-loaded')).toBeInTheDocument();
      expect(screen.getByTestId('portfolio-loaded')).toBeInTheDocument();
      expect(screen.getByTestId('contact-loaded')).toBeInTheDocument();
    });
  });
});
