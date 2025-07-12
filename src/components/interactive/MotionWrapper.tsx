'use client';

import React, { forwardRef, useEffect, useCallback, useState } from 'react';

import { useFramerNonce } from '@/lib/csp/nonce-provider';
import { motion } from '@/lib/motion';
import { getHashCollector } from '@/lib/utils/hash-collector';

/**
 * Enhanced CSP-compliant wrapper for Framer Motion components
 * Handles both style elements and inline style attributes with proper nonce injection
 */

/**
 * Enhanced CSP-compliant motion component factory
 */
function createMotionComponent(element: keyof typeof motion) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionComponent = forwardRef<HTMLElement, any>((props, ref) => {
    const { nonce } = useFramerNonce();
    const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

    // Initialize hash collection in development mode
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        const collector = getHashCollector();
        if (!collector) return;

        // Start collection if not already running
        try {
          collector.startCollection();
        } catch {
          // Failed to start hash collection
        }
      }
    }, []);

    // Enhanced nonce application for both style elements and style attributes
    const applyNonceToStyles = useCallback(() => {
      if (!nonce) return;

      // Handle style elements in document head
      const styleElements = document.querySelectorAll('style:not([nonce])');
      styleElements.forEach(styleEl => {
        const content = styleEl.textContent ?? '';
        if (
          content.includes('transform') ||
          content.includes('opacity') ||
          content.includes('scale')
        ) {
          styleEl.setAttribute('nonce', nonce);
        }
      });

      // Handle inline style attributes on the current element
      if (elementRef) {
        const element = elementRef;
        const style = element.getAttribute('style');
        if (style && !element.hasAttribute('data-nonce-applied')) {
          // Mark element as processed to avoid infinite loops
          element.setAttribute('data-nonce-applied', 'true');

          // For CSP compliance, we'll create a style element with nonce
          // instead of using inline styles
          if (style.includes('transform') || style.includes('opacity') || style.includes('scale')) {
            const elementId = element.id ?? `motion-${Math.random().toString(36).substr(2, 9)}`;
            if (!element.id) {
              element.id = elementId;
            }

            // Create a style element with nonce
            let styleElement = document.querySelector(
              `style[data-motion-id="${elementId}"]`
            ) as HTMLStyleElement;
            if (!styleElement) {
              styleElement = document.createElement('style');
              styleElement.setAttribute('nonce', nonce);
              styleElement.setAttribute('data-motion-id', elementId);
              document.head.appendChild(styleElement);
            }

            // Apply the styles via the style element
            styleElement.textContent = `#${elementId} { ${style} }`;

            // Remove the inline style to prevent CSP violation
            element.removeAttribute('style');
            element.setAttribute('data-motion-nonce', nonce);
          }
        }
      }
    }, [nonce, elementRef]);

    useEffect(() => {
      applyNonceToStyles();

      // Set up mutation observer for dynamic style changes
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            applyNonceToStyles();
          }
        });
      });

      if (elementRef) {
        observer.observe(elementRef, {
          attributes: true,
          attributeFilter: ['style'],
        });
      }

      // Also observe document head for new style elements
      const headObserver = new MutationObserver(applyNonceToStyles);
      headObserver.observe(document.head, { childList: true });

      return () => {
        observer.disconnect();
        headObserver.disconnect();
      };
    }, [applyNonceToStyles, elementRef]);

    // Safe object access for motion components
    const allowedElements = ['div', 'button', 'p', 'span', 'a', 'section'] as const;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionComponent = (allowedElements.includes(element as any) ? motion[element] : null) as React.ComponentType<any> | undefined;

    if (!MotionComponent) {
      // Fallback to div if element is not allowed
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const FallbackComponent = motion.div as React.ComponentType<any>;
      return <FallbackComponent {...props} ref={ref} />;
    }

    return (
      <MotionComponent
        ref={(node: HTMLElement | null) => {
          setElementRef(node);
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        {...props}
        style={{
          ...props.style,
          // Add CSS custom property for nonce reference
          ...(nonce && { '--motion-nonce': nonce }),
        }}
        // Add data attribute to help identify motion components during hash collection
        data-motion-component={element}
      />
    );
  });

  MotionComponent.displayName = `Motion${element.charAt(0).toUpperCase() + element.slice(1)}`;
  return MotionComponent;
}

export const MotionDiv = createMotionComponent('div');
MotionDiv.displayName = 'MotionDiv';

export const MotionButton = createMotionComponent('button');
MotionButton.displayName = 'MotionButton';

export const MotionP = createMotionComponent('p');
MotionP.displayName = 'MotionP';

export const MotionSpan = createMotionComponent('span');
MotionSpan.displayName = 'MotionSpan';

export const MotionA = createMotionComponent('a');
MotionA.displayName = 'MotionA';

export const MotionSection = createMotionComponent('section');
MotionSection.displayName = 'MotionSection';
