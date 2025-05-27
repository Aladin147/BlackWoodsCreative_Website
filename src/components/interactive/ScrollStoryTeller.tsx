'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ScrollStorySection {
  id: string;
  title: string;
  content: string;
  backgroundImage?: string;
  parallaxSpeed?: number;
  effects?: {
    scale?: [number, number, number];
    opacity?: [number, number, number, number];
    blur?: [number, number, number, number];
    rotate?: [number, number];
  };
}

interface ScrollStoryTellerProps {
  sections: ScrollStorySection[];
  className?: string;
}

export function ScrollStoryTeller({ sections, className }: ScrollStoryTellerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Calculate which section is currently active
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange((latest) => {
      const sectionIndex = Math.floor(latest * sections.length);
      const clampedIndex = Math.max(0, Math.min(sections.length - 1, sectionIndex));
      setActiveSection(clampedIndex);
    });

    return unsubscribe;
  }, [smoothProgress, sections.length]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Progress Indicator */}
      <motion.div
        className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col gap-4">
          {sections.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-8 rounded-full transition-all duration-500 ${
                index === activeSection
                  ? 'bg-bw-gold shadow-gold-glow'
                  : 'bg-bw-medium-gray hover:bg-bw-light-gray'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                const element = document.getElementById(sections[index].id);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Story Sections */}
      {sections.map((section, index) => (
        <ScrollStorySection
          key={section.id}
          section={section}
          index={index}
          isActive={index === activeSection}
          scrollProgress={smoothProgress}
          totalSections={sections.length}
        />
      ))}
    </div>
  );
}

interface ScrollStorySectionProps {
  section: ScrollStorySection;
  index: number;
  isActive: boolean;
  scrollProgress: any;
  totalSections: number;
}

function ScrollStorySection({
  section,
  index,
  isActive,
  scrollProgress,
  totalSections,
}: ScrollStorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Calculate section-specific progress
  const sectionStart = index / totalSections;
  const sectionEnd = (index + 1) / totalSections;

  const sectionProgress = useTransform(
    scrollProgress,
    [sectionStart, sectionEnd],
    [0, 1]
  );

  // Advanced parallax transforms
  const y = useTransform(
    sectionProgress,
    [0, 1],
    [0, -100 * (section.parallaxSpeed || 1)]
  );

  const scale = useTransform(
    sectionProgress,
    [0, 0.5, 1],
    section.effects?.scale || [0.8, 1, 1.2]
  );

  const opacity = useTransform(
    sectionProgress,
    [0, 0.2, 0.8, 1],
    section.effects?.opacity || [0, 1, 1, 0]
  );

  const blur = useTransform(
    sectionProgress,
    [0, 0.2, 0.8, 1],
    section.effects?.blur || [10, 0, 0, 10]
  );

  const rotate = useTransform(
    sectionProgress,
    [0, 1],
    section.effects?.rotate || [0, 0]
  );

  return (
    <motion.div
      ref={sectionRef}
      id={section.id}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ y }}
    >
      {/* Background Image with Parallax */}
      {section.backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale,
            opacity: useTransform(opacity, (value) => value * 0.7),
            filter: useTransform(blur, (value) => `blur(${value}px)`),
          }}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${section.backgroundImage})`,
              transform: `translateY(${-50 * (section.parallaxSpeed || 1)}px)`,
            }}
          />
          <div className="absolute inset-0 bg-bw-black/60" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl"
        style={{
          opacity,
          rotate,
          scale: useTransform(scale, (value) => value * 0.9 + 0.1),
        }}
      >
        <motion.h2
          className="text-display-lg mb-8 text-bw-white drop-shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {section.title}
        </motion.h2>

        <motion.p
          className="text-body-lg text-bw-pearl leading-relaxed drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {section.content}
        </motion.p>

        {/* Floating Elements */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-bw-gold/10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Section Number */}
      <motion.div
        className="absolute bottom-8 right-8 text-bw-gold/50 font-display text-6xl font-bold"
        style={{ opacity: useTransform(opacity, (value) => value * 0.3) }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>
    </motion.div>
  );
}
