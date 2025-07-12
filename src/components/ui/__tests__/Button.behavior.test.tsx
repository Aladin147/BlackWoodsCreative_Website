/**
 * BEHAVIOR TEST: Button Component
 * 
 * Tests the Button component's behavior from a user perspective,
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
import { Button, ButtonGroup, IconButton } from '../Button';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
      <button ref={ref} {...props}>{children}</button>
    )),
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    )),
  },
}));

describe('BEHAVIOR: Button Component', () => {
  describe('Basic Button Functionality', () => {
    it('should render button with correct text content', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should handle click events correctly', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: /disabled button/i });
      expect(button).toBeDisabled();
      
      // Try to click - should not trigger handler
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Button Variants', () => {
    it('should render primary variant with correct styling', () => {
      render(<Button variant="primary">Primary Button</Button>);
      
      const button = screen.getByRole('button', { name: /primary button/i });
      expect(button).toHaveClass('bg-primary-600', 'text-white');
    });

    it('should render secondary variant with correct styling', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button', { name: /secondary button/i });
      expect(button).toHaveClass('bg-secondary-500', 'text-white');
    });

    it('should render outline variant with correct styling', () => {
      render(<Button variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button', { name: /outline button/i });
      expect(button).toHaveClass('bg-transparent', 'text-primary-600', 'border-primary-600');
    });

    it('should render destructive variant with correct styling', () => {
      render(<Button variant="destructive">Delete</Button>);
      
      const button = screen.getByRole('button', { name: /delete/i });
      expect(button).toHaveClass('bg-red-600', 'text-white');
    });
  });

  describe('Button Sizes', () => {
    it('should render small size with correct classes', () => {
      render(<Button size="sm">Small Button</Button>);
      
      const button = screen.getByRole('button', { name: /small button/i });
      expect(button).toHaveClass('px-3', 'py-2', 'text-sm');
    });

    it('should render large size with correct classes', () => {
      render(<Button size="lg">Large Button</Button>);
      
      const button = screen.getByRole('button', { name: /large button/i });
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Check for loading spinner (animated div)
      const spinner = button.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should hide button text when loading', () => {
      render(<Button loading>Submit Form</Button>);
      
      const button = screen.getByRole('button');
      const textSpan = button.querySelector('.sr-only');
      expect(textSpan).toBeInTheDocument();
      expect(textSpan).toHaveTextContent('Submit Form');
    });

    it('should not trigger click handler when loading', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      
      render(<Button loading onClick={handleClick}>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icons and Content', () => {
    it('should render left icon correctly', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      
      render(
        <Button leftIcon={<LeftIcon />}>
          Button with Left Icon
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Button with Left Icon');
    });

    it('should render right icon correctly', () => {
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      
      render(
        <Button rightIcon={<RightIcon />}>
          Button with Right Icon
        </Button>
      );
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Button with Right Icon');
    });

    it('should not show icons when loading', () => {
      const LeftIcon = () => <span data-testid="left-icon">←</span>;
      const RightIcon = () => <span data-testid="right-icon">→</span>;
      
      render(
        <Button loading leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
          Loading Button
        </Button>
      );
      
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
    });
  });

  describe('Full Width and Styling Options', () => {
    it('should render full width when fullWidth is true', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      
      const button = screen.getByRole('button', { name: /full width button/i });
      expect(button).toHaveClass('w-full');
    });

    it('should render rounded when rounded is true', () => {
      render(<Button rounded>Rounded Button</Button>);
      
      const button = screen.getByRole('button', { name: /rounded button/i });
      expect(button).toHaveClass('rounded-full');
    });

    it('should render elevated styling when elevated is true', () => {
      render(<Button elevated>Elevated Button</Button>);
      
      const button = screen.getByRole('button', { name: /elevated button/i });
      expect(button).toHaveClass('shadow-lg');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Accessible Button</Button>);

      const button = screen.getByRole('button', { name: /accessible button/i });

      // Focus the button
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Press Space to activate
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should have proper focus styles', () => {
      render(<Button>Focus Test</Button>);

      const button = screen.getByRole('button', { name: /focus test/i });
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-offset-2');
    });
  });
});

describe('BEHAVIOR: ButtonGroup Component', () => {
  it('should render multiple buttons in horizontal layout', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );

    expect(screen.getByRole('button', { name: /first/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /second/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /third/i })).toBeInTheDocument();
  });

  it('should render buttons in vertical layout when specified', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>Top</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
    );

    const container = screen.getByRole('button', { name: /top/i }).parentElement;
    expect(container).toHaveClass('flex-col');
  });

  it('should apply correct spacing between buttons', () => {
    render(
      <ButtonGroup spacing="lg">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );

    const container = screen.getByRole('button', { name: /button 1/i }).parentElement;
    expect(container).toHaveClass('gap-4');
  });
});

describe('BEHAVIOR: IconButton Component', () => {
  it('should render icon button with proper accessibility', () => {
    const TestIcon = () => <span data-testid="test-icon">🔍</span>;

    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Search"
      />
    );

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should handle click events correctly', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    const TestIcon = () => <span>✓</span>;

    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Confirm"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button', { name: /confirm/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct size classes for icon buttons', () => {
    const TestIcon = () => <span>📝</span>;

    render(
      <IconButton
        icon={<TestIcon />}
        aria-label="Edit"
        size="lg"
      />
    );

    const button = screen.getByRole('button', { name: /edit/i });
    expect(button).toHaveClass('w-12', 'h-12', 'aspect-square');
  });
});
