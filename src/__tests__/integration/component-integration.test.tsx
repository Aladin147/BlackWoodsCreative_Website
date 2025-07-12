/**
 * INTEGRATION TEST: Component Integration
 * 
 * Tests how multiple components work together in real scenarios,
 * focusing on component interactions and data flow.
 * 
 * TESTING METHODOLOGY:
 * - Integration-focused testing of component interactions
 * - Real component behavior with minimal mocking
 * - Business workflow validation across components
 * - State management and prop passing verification
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import { Button } from '@/components/ui/Button';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { PortfolioProject } from '@/lib/types/portfolio';

// Mock framer-motion for consistent testing
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    p: React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => (
      <p ref={ref} {...props}>{children}</p>
    )),
  },
}));

// Mock Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Sample data for integration testing
const mockProjects: PortfolioProject[] = [
  {
    id: 'project-1',
    title: 'Epic Film Production',
    description: 'A stunning cinematic experience showcasing our film production capabilities.',
    category: 'Film',
    type: 'video',
    image: '/images/portfolio/film-1.jpg',
    tags: ['Cinematography', 'Post-Production', 'Color Grading'],
    featured: true
  },
  {
    id: 'project-2',
    title: 'Professional Photography',
    description: 'High-quality photography showcasing our visual storytelling expertise.',
    category: 'Photography',
    type: 'image',
    image: '/images/portfolio/photo-1.jpg',
    tags: ['Portrait', 'Commercial', 'Studio'],
    featured: false
  }
];

describe('INTEGRATION: Component Integration Tests', () => {
  describe('Button and Loading State Integration', () => {
    it('should integrate Button with LoadingSpinner for form submission workflow', async () => {
      const MockFormComponent = () => {
        const [isLoading, setIsLoading] = React.useState(false);
        const [isSubmitted, setIsSubmitted] = React.useState(false);

        const handleSubmit = async () => {
          setIsLoading(true);
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 100));
          setIsLoading(false);
          setIsSubmitted(true);
        };

        if (isSubmitted) {
          return <div data-testid="success-message">Form submitted successfully!</div>;
        }

        return (
          <div>
            {isLoading ? (
              <LoadingSpinner text="Submitting form..." />
            ) : (
              <Button onClick={handleSubmit} data-testid="submit-button">
                Submit Form
              </Button>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<MockFormComponent />);

      // Initial state: Button should be visible
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeInTheDocument();
      expect(screen.queryByText('Submitting form...')).not.toBeInTheDocument();

      // Click button to trigger loading state
      await user.click(submitButton);

      // Loading state: Spinner should be visible, button should be hidden
      expect(screen.getByText('Submitting form...')).toBeInTheDocument();
      expect(screen.queryByTestId('submit-button')).not.toBeInTheDocument();

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      // Final state: Success message should be visible
      expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
      expect(screen.queryByText('Submitting form...')).not.toBeInTheDocument();
    });

    it('should handle Button loading prop integration correctly', async () => {
      const MockLoadingButton = () => {
        const [isLoading, setIsLoading] = React.useState(false);

        const handleClick = () => {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 100);
        };

        return (
          <Button 
            loading={isLoading} 
            onClick={handleClick}
            data-testid="loading-button"
          >
            {isLoading ? 'Processing...' : 'Click Me'}
          </Button>
        );
      };

      const user = userEvent.setup();
      render(<MockLoadingButton />);

      const button = screen.getByTestId('loading-button');
      
      // Initial state
      expect(button).not.toBeDisabled();
      expect(screen.getByText('Click Me')).toBeInTheDocument();

      // Click to trigger loading
      await user.click(button);

      // Loading state
      expect(button).toBeDisabled();
      expect(button.querySelector('.animate-spin')).toBeInTheDocument();

      // Wait for loading to complete
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('PortfolioCard and Button Integration', () => {
    it('should integrate PortfolioCard with interactive buttons correctly', async () => {
      const MockPortfolioGrid = () => {
        const [selectedProject, setSelectedProject] = React.useState<string | null>(null);

        return (
          <div>
            <div className="grid grid-cols-2 gap-4">
              {mockProjects.map(project => (
                <div key={project.id} onClick={() => setSelectedProject(project.id)}>
                  <PortfolioCard project={project} />
                </div>
              ))}
            </div>
            
            {selectedProject && (
              <div data-testid="project-modal">
                <h2>Selected Project: {selectedProject}</h2>
                <Button 
                  onClick={() => setSelectedProject(null)}
                  data-testid="close-modal"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<MockPortfolioGrid />);

      // Initial state: No modal should be visible
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();

      // Both portfolio cards should be visible
      expect(screen.getByText('Epic Film Production')).toBeInTheDocument();
      expect(screen.getByText('Professional Photography')).toBeInTheDocument();

      // Click on first portfolio card
      const firstCard = screen.getByText('Epic Film Production').closest('[data-cursor="portfolio"]');
      expect(firstCard).toBeInTheDocument();
      
      await user.click(firstCard!);

      // Modal should appear
      await waitFor(() => {
        expect(screen.getByTestId('project-modal')).toBeInTheDocument();
      });
      expect(screen.getByText('Selected Project: project-1')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByTestId('close-modal');
      await user.click(closeButton);

      // Modal should disappear
      await waitFor(() => {
        expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
      });
    });

    it('should handle PortfolioCard video/image type integration with different buttons', async () => {
      const videoProject = mockProjects[0]; // Film project (video type)
      const imageProject = mockProjects[1]; // Photography project (image type)

      const MockProjectComparison = () => (
        <div>
          <div data-testid="video-project">
            <PortfolioCard project={videoProject} />
          </div>
          <div data-testid="image-project">
            <PortfolioCard project={imageProject} />
          </div>
        </div>
      );

      render(<MockProjectComparison />);

      // Video project should have play button
      const videoSection = screen.getByTestId('video-project');
      const playButton = videoSection.querySelector('button[aria-label*="View Epic Film Production project details"]');
      expect(playButton).toBeInTheDocument();

      // Image project should have view button (different from play button)
      const imageSection = screen.getByTestId('image-project');
      const viewButton = imageSection.querySelector('button');
      expect(viewButton).toBeInTheDocument();
      
      // Buttons should be different (video has play icon, image has eye icon)
      expect(videoSection.querySelector('[data-testid="play-icon"]')).toBeInTheDocument();
      expect(imageSection.querySelector('[data-testid="play-icon"]')).not.toBeInTheDocument();
    });
  });

  describe('Multi-Component State Management Integration', () => {
    it('should handle complex state interactions between multiple components', async () => {
      const MockComplexWorkflow = () => {
        const [step, setStep] = React.useState(1);
        const [isLoading, setIsLoading] = React.useState(false);
        const [selectedProjects, setSelectedProjects] = React.useState<string[]>([]);

        const handleNext = async () => {
          setIsLoading(true);
          await new Promise(resolve => setTimeout(resolve, 100));
          setStep(step + 1);
          setIsLoading(false);
        };

        const toggleProject = (projectId: string) => {
          setSelectedProjects(prev => 
            prev.includes(projectId) 
              ? prev.filter(id => id !== projectId)
              : [...prev, projectId]
          );
        };

        return (
          <div>
            <div data-testid="step-indicator">Step {step} of 3</div>
            
            {step === 1 && (
              <div data-testid="step-1">
                <h2>Select Projects</h2>
                {mockProjects.map(project => (
                  <div key={project.id}>
                    <PortfolioCard project={project} />
                    <Button 
                      onClick={() => toggleProject(project.id)}
                      variant={selectedProjects.includes(project.id) ? 'primary' : 'outline'}
                      data-testid={`select-${project.id}`}
                    >
                      {selectedProjects.includes(project.id) ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                ))}
                <Button 
                  onClick={handleNext}
                  disabled={selectedProjects.length === 0}
                  data-testid="next-step"
                >
                  Next Step
                </Button>
              </div>
            )}

            {step === 2 && (
              <div data-testid="step-2">
                {isLoading ? (
                  <LoadingSpinner text="Processing selection..." />
                ) : (
                  <div>
                    <h2>Review Selection</h2>
                    <p>Selected {selectedProjects.length} projects</p>
                    <Button onClick={handleNext} data-testid="confirm">
                      Confirm
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div data-testid="step-3">
                <h2>Complete!</h2>
                <p>Successfully processed {selectedProjects.length} projects</p>
              </div>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<MockComplexWorkflow />);

      // Step 1: Initial state
      expect(screen.getByTestId('step-indicator')).toHaveTextContent('Step 1 of 3');
      expect(screen.getByTestId('step-1')).toBeInTheDocument();
      
      // Next button should be disabled initially
      const nextButton = screen.getByTestId('next-step');
      expect(nextButton).toBeDisabled();

      // Select a project
      const selectButton = screen.getByTestId('select-project-1');
      await user.click(selectButton);

      // Button should change to "Selected"
      expect(selectButton).toHaveTextContent('Selected');
      expect(nextButton).not.toBeDisabled();

      // Go to next step
      await user.click(nextButton);

      // Wait for step 2 content (loading happens too fast to reliably test)
      await waitFor(() => {
        expect(screen.getByTestId('step-2')).toBeInTheDocument();
      });
      expect(screen.getByText('Selected 1 projects')).toBeInTheDocument();

      // Confirm selection
      const confirmButton = screen.getByTestId('confirm');
      await user.click(confirmButton);

      // Step 3: Final state
      await waitFor(() => {
        expect(screen.getByTestId('step-3')).toBeInTheDocument();
      });
      expect(screen.getByText('Successfully processed 1 projects')).toBeInTheDocument();
    });
  });
});
