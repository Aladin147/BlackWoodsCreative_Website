import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { AdvancedPortfolioFilter } from '../AdvancedPortfolioFilter';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    input: ({ children, ...props }: any) => <input {...props}>{children}</input>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  LayoutGroup: ({ children }: any) => <>{children}</>,
}));

// Mock MagneticField
jest.mock('../ParallaxContainer', () => ({
  MagneticField: ({ children }: any) => <div data-testid="magnetic-field">{children}</div>,
}));

// Mock useDeviceAdaptation hook
jest.mock('@/hooks/useDeviceAdaptation', () => ({
  useDeviceAdaptation: () => ({
    getAdaptiveMagneticProps: jest.fn(() => ({ strength: 0.1, radius: 80 })),
  }),
}));

const mockItems = [
  {
    id: '1',
    title: 'Project Alpha',
    category: 'Photography',
    image: '/images/project1.jpg',
    tags: ['portrait', 'studio', 'commercial'],
    featured: true,
  },
  {
    id: '2',
    title: 'Project Beta',
    category: 'Filmmaking',
    image: '/images/project2.jpg',
    tags: ['documentary', 'nature', 'wildlife'],
    featured: false,
  },
  {
    id: '3',
    title: 'Project Gamma',
    category: '3D Visualization',
    image: '/images/project3.jpg',
    tags: ['architecture', 'interior', 'rendering'],
    featured: true,
  },
  {
    id: '4',
    title: 'Project Delta',
    category: 'Photography',
    image: '/images/project4.jpg',
    tags: ['landscape', 'outdoor', 'nature'],
    featured: false,
  },
];

const mockCategories = ['Photography', 'Filmmaking', '3D Visualization'];

describe('AdvancedPortfolioFilter', () => {
  const mockOnItemClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all portfolio items initially', () => {
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
    expect(screen.getByText('Project Delta')).toBeInTheDocument();
  });

  it('renders search input with proper accessibility', () => {
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const searchInput = screen.getByLabelText('Search portfolio projects');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search portfolio...');
    expect(searchInput).toHaveAttribute('aria-describedby', 'search-results-count');
  });

  it('renders category filter buttons', () => {
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    expect(screen.getByLabelText('Filter by All category')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Photography category')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Filmmaking category')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by 3D Visualization category')).toBeInTheDocument();
  });

  it('filters items by category', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    // Click Photography category
    await user.click(screen.getByLabelText('Filter by Photography category'));

    // Should show only photography projects
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Project Delta')).toBeInTheDocument();
    expect(screen.queryByText('Project Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Project Gamma')).not.toBeInTheDocument();
  });

  it('filters items by search term', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const searchInput = screen.getByLabelText('Search portfolio projects');
    await user.type(searchInput, 'Alpha');

    // Should show only Project Alpha
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Project Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Project Gamma')).not.toBeInTheDocument();
    expect(screen.queryByText('Project Delta')).not.toBeInTheDocument();
  });

  it('searches by tags', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const searchInput = screen.getByLabelText('Search portfolio projects');
    await user.type(searchInput, 'nature');

    // Should show projects with 'nature' tag
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Delta')).toBeInTheDocument();
    expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('Project Gamma')).not.toBeInTheDocument();
  });

  it('sorts items by title', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    await user.click(screen.getByText('Title'));

    // Items should be sorted alphabetically by title
    const projectTitles = screen.getAllByText(/Project/).map(el => el.textContent);
    expect(projectTitles).toEqual([
      'Project Alpha',
      'Project Beta',
      'Project Delta',
      'Project Gamma',
    ]);
  });

  it('sorts items by category', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    await user.click(screen.getByText('Category'));

    // Should sort by category, then by title within category
    const projectElements = screen.getAllByText(/Project/);
    expect(projectElements).toHaveLength(4);
  });

  it('sorts items by featured status', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    // Click the Featured sort button (not the featured badges)
    const sortButtons = screen.getAllByText('Featured');
    const featuredSortButton = sortButtons.find(
      button => button.tagName === 'BUTTON' && button.getAttribute('data-cursor') === 'button'
    );

    await user.click(featuredSortButton!);

    // Featured items should come first - check for featured badges
    const featuredBadges = screen
      .getAllByText('Featured')
      .filter(el => el.className.includes('absolute right-3 top-3'));
    expect(featuredBadges).toHaveLength(2); // Project Alpha and Gamma are featured
  });

  it('displays results count', () => {
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    expect(screen.getByText('4 projects found')).toBeInTheDocument();
  });

  it('displays singular form for single result', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const searchInput = screen.getByLabelText('Search portfolio projects');
    await user.type(searchInput, 'Alpha');

    expect(screen.getByText('1 project found')).toBeInTheDocument();
  });

  it('shows empty state when no items match filters', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const searchInput = screen.getByLabelText('Search portfolio projects');
    await user.type(searchInput, 'nonexistent');

    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria')).toBeInTheDocument();
  });

  it('calls onItemClick when item is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    await user.click(screen.getByText('Project Alpha'));

    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('handles keyboard navigation for items', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const projectAlpha = screen.getByLabelText(
      'View Project Alpha project in Photography category'
    );
    projectAlpha.focus();
    await user.keyboard('{Enter}');

    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('handles space key for item activation', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const projectAlpha = screen.getByLabelText(
      'View Project Alpha project in Photography category'
    );
    projectAlpha.focus();
    await user.keyboard(' ');

    expect(mockOnItemClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('displays featured badges for featured items', () => {
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    // Filter to only get the featured badges (not the sort button)
    const featuredBadges = screen
      .getAllByText('Featured')
      .filter(el => el.className.includes('absolute right-3 top-3'));
    expect(featuredBadges).toHaveLength(2);
  });

  it('displays project tags', () => {
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    // Tags should be visible on hover, but we can check they're in the DOM
    expect(screen.getByText('portrait')).toBeInTheDocument();
    expect(screen.getByText('studio')).toBeInTheDocument();
    expect(screen.getByText('commercial')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('does not change category when clicking the same category', async () => {
    const user = userEvent.setup();
    render(
      <AdvancedPortfolioFilter
        items={mockItems}
        categories={mockCategories}
        onItemClick={mockOnItemClick}
      />
    );

    const allButton = screen.getByText('All');

    // All should be active by default
    expect(allButton).toHaveAttribute('aria-pressed', 'true');

    // Click All again
    await user.click(allButton);

    // Should still be active and show all items
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('4 projects found')).toBeInTheDocument();
  });
});
