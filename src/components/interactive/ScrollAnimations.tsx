'use client';

import { useEffect, useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollFadeIn({ children, className = '', delay = 0 }: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state per theme guide
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity 0.8s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Visible state per theme guide
            const htmlElement = entry.target as HTMLElement;
            htmlElement.style.opacity = '1';
            htmlElement.style.transform = 'translateY(0)';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function StaggeredScrollFadeIn({ 
  children, 
  className = '', 
  staggerDelay = 100 
}: StaggeredAnimationProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollFadeIn key={index} delay={index * staggerDelay}>
          {child}
        </ScrollFadeIn>
      ))}
    </div>
  );
}

interface SectionAnimationProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionScrollAnimation({ children, className = '', id }: SectionAnimationProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Find all animatable elements within the section
    const animatableElements = section.querySelectorAll(
      '.card, .btn-primary, .btn-secondary, h1, h2, h3, p, img'
    );

    // Set initial state for all elements
    animatableElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.opacity = '0';
      htmlElement.style.transform = 'translateY(20px)';
      htmlElement.style.transition = `opacity 1.0s ease-out ${index * 150}ms, transform 0.8s ease-out ${index * 150}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(
              '.card, .btn-primary, .btn-secondary, h1, h2, h3, p, img'
            );
            
            elements.forEach((element) => {
              const htmlElement = element as HTMLElement;
              htmlElement.style.opacity = '1';
              htmlElement.style.transform = 'translateY(0)';
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={className} id={id}>
      {children}
    </section>
  );
}
