/**
 * BEHAVIOR TEST: PortfolioCard Component
 * 
 * Tests the PortfolioCard component's behavior from a user perspective,
 * focusing on real interactions and business requirements.
 * 
 * TESTING METHODOLOGY:
 * - Behavior-driven testing focused on user interactions
 * - Minimal mocking to test actual component behavior
 * - Real accessibility and usability validation
 * - Business-critical functionality verification
 */

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../__tests__/test-utils';
import { PortfolioCard } from '../PortfolioCard';
import type { PortfolioProject } from '@/lib/types/portfolio';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, whileHover, whileTap, transition, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, fill, sizes, className, role, ...props }: any) {
    return <img src={src} alt={alt} className={className} role={role} {...props} />;
  };
});

// Sample portfolio projects for testing
const mockVideoProject: PortfolioProject = {
  id: 'video-1',
  title: 'Epic Film Project',
  description: 'A stunning cinematic experience showcasing our film production capabilities.',
  category: 'Film',
  type: 'video',
  image: '/images/portfolio/video-project.jpg',
  video: '/videos/epic-film.mp4',
  tags: ['Cinematography', 'Post-Production', 'Color Grading'],
  client: 'Test Client',
  year: 2024,
  featured: true,
  duration: '2:30',
  software: ['Adobe Premiere', 'DaVinci Resolve']
};

const mockImageProject: PortfolioProject = {
  id: 'image-1',
  title: 'Professional Photography',
  description: 'High-quality photography showcasing our visual storytelling expertise.',
  category: 'Photography',
  type: 'image',
  image: '/images/portfolio/photo-project.jpg',
  tags: ['Portrait', 'Commercial', 'Studio'],
  client: 'Photo Client',
  year: 2024,
  featured: false,
  dimensions: '4000x3000',
  software: ['Adobe Lightroom', 'Photoshop']
};

const mockProjectWithManyTags: PortfolioProject = {
  id: 'many-tags',
  title: 'Complex 3D Project',
  description: 'Advanced 3D visualization with multiple techniques and tools.',
  category: '3D Visualization',
  type: 'image',
  image: '/images/portfolio/3d-project.jpg',
  tags: ['3D Modeling', 'Texturing', 'Lighting', 'Rendering', 'Animation', 'Compositing'],
  year: 2024
};

describe('BEHAVIOR: PortfolioCard Component', () => {
  describe('Basic Portfolio Card Rendering', () => {
    it('should render portfolio card with project information', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      // Check title
      expect(screen.getByText('Epic Film Project')).toBeInTheDocument();
      
      // Check description
      expect(screen.getByText(/stunning cinematic experience/i)).toBeInTheDocument();
      
      // Check category badge
      expect(screen.getByText('Film')).toBeInTheDocument();
      
      // Check image container (Next.js Image may not render as expected in test environment)
      const imageContainer = screen.getByRole('img', { name: /project: epic film project/i });
      expect(imageContainer).toBeInTheDocument();
    });

    it('should render project tags correctly', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      // Check first 3 tags are displayed
      expect(screen.getByText('Cinematography')).toBeInTheDocument();
      expect(screen.getByText('Post-Production')).toBeInTheDocument();
      expect(screen.getByText('Color Grading')).toBeInTheDocument();
    });

    it('should handle projects with many tags by showing only first 3 plus count', () => {
      render(<PortfolioCard project={mockProjectWithManyTags} />);
      
      // Check first 3 tags
      expect(screen.getByText('3D Modeling')).toBeInTheDocument();
      expect(screen.getByText('Texturing')).toBeInTheDocument();
      expect(screen.getByText('Lighting')).toBeInTheDocument();
      
      // Check "+more" indicator
      expect(screen.getByText('+3 more')).toBeInTheDocument();
      
      // Ensure remaining tags are not displayed
      expect(screen.queryByText('Animation')).not.toBeInTheDocument();
      expect(screen.queryByText('Compositing')).not.toBeInTheDocument();
    });
  });

  describe('Video Project Interactions', () => {
    it('should show play button for video projects', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      const playButton = screen.getByRole('button', { name: /view epic film project project details/i });
      expect(playButton).toBeInTheDocument();
      
      // Check for play icon
      expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    });

    it('should handle play button clicks for video projects', async () => {
      const user = userEvent.setup();
      render(<PortfolioCard project={mockVideoProject} />);
      
      const playButton = screen.getByRole('button', { name: /view epic film project project details/i });
      
      // Click should not throw error (handleViewProject is a placeholder)
      await user.click(playButton);
      
      // Button should still be present after click
      expect(playButton).toBeInTheDocument();
    });
  });

  describe('Image Project Interactions', () => {
    it('should show view button for image projects', () => {
      render(<PortfolioCard project={mockImageProject} />);
      
      const viewButton = screen.getByRole('button');
      expect(viewButton).toBeInTheDocument();
      
      // Should have eye icon (not play icon)
      expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();
    });

    it('should handle view button clicks for image projects', async () => {
      const user = userEvent.setup();
      render(<PortfolioCard project={mockImageProject} />);
      
      const viewButton = screen.getByRole('button');
      
      // Click should not throw error
      await user.click(viewButton);
      
      // Button should still be present after click
      expect(viewButton).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      // Check image container has proper role and aria-label
      const imageContainer = screen.getByRole('img', { name: /project: epic film project/i });
      expect(imageContainer).toBeInTheDocument();
      
      // Check button has proper aria-label
      const button = screen.getByRole('button', { name: /view epic film project project details/i });
      expect(button).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Epic Film Project');
    });

    it('should have proper description association', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      const title = screen.getByText('Epic Film Project');
      const description = screen.getByText(/stunning cinematic experience/i);
      
      // Title should have an ID
      expect(title).toHaveAttribute('id', 'project-title-video-1');
      
      // Description should reference the title
      expect(description).toHaveAttribute('aria-describedby', 'project-title-video-1');
    });
  });

  describe('Custom Props and Styling', () => {
    it('should apply custom className', () => {
      render(<PortfolioCard project={mockVideoProject} className="custom-class" />);
      
      const card = screen.getByText('Epic Film Project').closest('.card-elevated');
      expect(card).toHaveClass('custom-class');
    });

    it('should apply custom test ID', () => {
      render(<PortfolioCard project={mockVideoProject} data-testid="custom-portfolio-card" />);
      
      expect(screen.getByTestId('custom-portfolio-card')).toBeInTheDocument();
    });

    it('should have cursor data attribute for magnetic cursor integration', () => {
      render(<PortfolioCard project={mockVideoProject} />);
      
      const card = screen.getByText('Epic Film Project').closest('[data-cursor]');
      expect(card).toHaveAttribute('data-cursor', 'portfolio');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle projects without tags gracefully', () => {
      const projectWithoutTags = { ...mockVideoProject, tags: undefined };
      
      render(<PortfolioCard project={projectWithoutTags} />);
      
      // Should render without tags section
      expect(screen.getByText('Epic Film Project')).toBeInTheDocument();
      expect(screen.queryByText('Cinematography')).not.toBeInTheDocument();
    });

    it('should handle projects with empty tags array', () => {
      const projectWithEmptyTags = { ...mockVideoProject, tags: [] };
      
      render(<PortfolioCard project={projectWithEmptyTags} />);
      
      // Should render without tags section
      expect(screen.getByText('Epic Film Project')).toBeInTheDocument();
      expect(screen.queryByText('Cinematography')).not.toBeInTheDocument();
    });

    it('should handle very long project titles gracefully', () => {
      const projectWithLongTitle = {
        ...mockVideoProject,
        title: 'This is an extremely long project title that should be handled gracefully by the component'
      };
      
      render(<PortfolioCard project={projectWithLongTitle} />);
      
      const title = screen.getByText(/extremely long project title/i);
      expect(title).toBeInTheDocument();
    });

    it('should handle very long descriptions gracefully', () => {
      const projectWithLongDescription = {
        ...mockVideoProject,
        description: 'This is an extremely long project description that should be truncated or handled gracefully by the component to maintain proper layout and user experience across different screen sizes and devices.'
      };
      
      render(<PortfolioCard project={projectWithLongDescription} />);
      
      const description = screen.getByText(/extremely long project description/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('line-clamp-2');
    });
  });
});
