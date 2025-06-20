import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  HoverMagnify,
  TiltCard,
  FloatingElement,
  PulseGlow,
  MorphingButton,
  RippleEffect,
  StaggeredReveal,
  TextReveal,
} from '../MicroInteractions';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ComponentProps<'button'>) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: React.ComponentProps<'span'>) => (
      <span {...props}>{children}</span>
    ),
  },
  useMotionValue: () => ({
    set: jest.fn(),
  }),
  useSpring: () => ({
    set: jest.fn(),
  }),
  useTransform: () => 0,
}));

describe('MicroInteractions', () => {
  describe('HoverMagnify', () => {
    it('renders children correctly', () => {
      render(
        <HoverMagnify>
          <div>Test Content</div>
        </HoverMagnify>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <HoverMagnify className="custom-class">
          <div>Test</div>
        </HoverMagnify>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('handles hover events', async () => {
      const user = userEvent.setup();

      render(
        <HoverMagnify>
          <div>Hover me</div>
        </HoverMagnify>
      );

      const element = screen.getByText('Hover me').parentElement;

      if (element) {
        await user.hover(element);
        await user.unhover(element);
      }

      // Component should handle hover events without crashing
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });
  });

  describe('TiltCard', () => {
    it('renders children correctly', () => {
      render(
        <TiltCard>
          <div>Tilt Content</div>
        </TiltCard>
      );

      expect(screen.getByText('Tilt Content')).toBeInTheDocument();
    });

    it('handles mouse movement', () => {
      render(
        <TiltCard>
          <div>Tilt me</div>
        </TiltCard>
      );

      const element = screen.getByText('Tilt me').parentElement;

      if (element) {
        fireEvent.mouseMove(element, { clientX: 100, clientY: 100 });
        fireEvent.mouseLeave(element);
      }

      expect(screen.getByText('Tilt me')).toBeInTheDocument();
    });

    it('applies custom maxTilt', () => {
      render(
        <TiltCard maxTilt={20}>
          <div>Custom Tilt</div>
        </TiltCard>
      );

      expect(screen.getByText('Custom Tilt')).toBeInTheDocument();
    });
  });

  describe('FloatingElement', () => {
    it('renders with floating animation', () => {
      render(
        <FloatingElement>
          <div>Floating Content</div>
        </FloatingElement>
      );

      expect(screen.getByText('Floating Content')).toBeInTheDocument();
    });

    it('accepts custom amplitude and frequency', () => {
      render(
        <FloatingElement amplitude={20} frequency={3}>
          <div>Custom Float</div>
        </FloatingElement>
      );

      expect(screen.getByText('Custom Float')).toBeInTheDocument();
    });
  });

  describe('PulseGlow', () => {
    it('renders with pulse effect', () => {
      render(
        <PulseGlow>
          <div>Glowing Content</div>
        </PulseGlow>
      );

      expect(screen.getByText('Glowing Content')).toBeInTheDocument();
    });

    it('accepts custom color and intensity', () => {
      render(
        <PulseGlow color="blue" intensity={0.5} duration={3}>
          <div>Custom Glow</div>
        </PulseGlow>
      );

      expect(screen.getByText('Custom Glow')).toBeInTheDocument();
    });
  });

  describe('MorphingButton', () => {
    it('renders default content', () => {
      render(
        <MorphingButton>
          <span>Default Content</span>
        </MorphingButton>
      );

      expect(screen.getByText('Default Content')).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <MorphingButton onClick={handleClick}>
          <span>Click me</span>
        </MorphingButton>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows hover content on hover', async () => {
      const user = userEvent.setup();

      render(
        <MorphingButton hoverChildren={<span>Hover Content</span>}>
          <span>Default Content</span>
        </MorphingButton>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      expect(screen.getByText('Hover Content')).toBeInTheDocument();
    });
  });

  describe('RippleEffect', () => {
    it('renders children correctly', () => {
      render(
        <RippleEffect>
          <div>Ripple Content</div>
        </RippleEffect>
      );

      expect(screen.getByText('Ripple Content')).toBeInTheDocument();
    });

    it('creates ripple on click', async () => {
      const user = userEvent.setup();

      render(
        <RippleEffect>
          <div>Click for ripple</div>
        </RippleEffect>
      );

      const element = screen.getByText('Click for ripple').parentElement;

      if (element) {
        await user.click(element);
      }

      // Ripple effect should be created
      expect(screen.getByText('Click for ripple')).toBeInTheDocument();
    });

    it('accepts custom color', () => {
      render(
        <RippleEffect color="rgba(255, 0, 0, 0.3)">
          <div>Red Ripple</div>
        </RippleEffect>
      );

      expect(screen.getByText('Red Ripple')).toBeInTheDocument();
    });
  });

  describe('StaggeredReveal', () => {
    it('renders all children', () => {
      const children = [
        <div key="1">Item 1</div>,
        <div key="2">Item 2</div>,
        <div key="3">Item 3</div>,
      ];

      render(<StaggeredReveal>{children}</StaggeredReveal>);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('accepts custom delay', () => {
      const children = [<div key="1">Delayed Item 1</div>, <div key="2">Delayed Item 2</div>];

      render(<StaggeredReveal delay={0.2}>{children}</StaggeredReveal>);

      expect(screen.getByText('Delayed Item 1')).toBeInTheDocument();
      expect(screen.getByText('Delayed Item 2')).toBeInTheDocument();
    });
  });

  describe('TextReveal', () => {
    it('renders text correctly', () => {
      render(<TextReveal text="Hello World" />);

      // Text is split into individual characters, so we need to check for the container
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Hello';
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'World';
        })
      ).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<TextReveal text="Styled Text" className="custom-text" />);

      expect(container.firstChild).toHaveClass('custom-text');
    });

    it('accepts custom delay', () => {
      render(<TextReveal text="Slow Reveal" delay={0.1} />);

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Slow';
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Reveal';
        })
      ).toBeInTheDocument();
    });

    it('handles special characters', () => {
      render(<TextReveal text="Hello, World!" />);

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'Hello,';
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === 'World!';
        })
      ).toBeInTheDocument();
    });

    it('handles empty text', () => {
      const { container } = render(<TextReveal text="" />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
