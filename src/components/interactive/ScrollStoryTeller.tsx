'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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
    const unsubscribe = smoothProgress.onChange(latest => {
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
        className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 transform lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col gap-4">
          {sections.map((_, index) => (
            <motion.div
              key={index}
              className={`h-8 w-2 rounded-full transition-all duration-500 ${
                index === activeSection
                  ? 'bg-bw-gold shadow-gold-glow'
                  : 'bg-bw-medium-gray hover:bg-bw-light-gray'
              }`}
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                const section = sections[index];
                if (section) {
                  const element = document.getElementById(section.id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }
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
  scrollProgress: MotionValue<number>;
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

  const sectionProgress = useTransform(scrollProgress, [sectionStart, sectionEnd], [0, 1]);

  // Advanced parallax transforms
  const y = useTransform(sectionProgress, [0, 1], [0, -100 * (section.parallaxSpeed || 1)]);

  const scale = useTransform(sectionProgress, [0, 0.5, 1], section.effects?.scale || [0.8, 1, 1.2]);

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

  const rotate = useTransform(sectionProgress, [0, 1], section.effects?.rotate || [0, 0]);

  // Pre-calculate transforms to avoid conditional hooks
  const backgroundOpacity = useTransform(opacity, value => value * 0.7);
  const backgroundFilter = useTransform(blur, value => `blur(${value}px)`);
  const contentScale = useTransform(scale, value => value * 0.9 + 0.1);
  const sectionOpacity = useTransform(opacity, value => value * 0.3);

  return (
    <motion.div
      ref={sectionRef}
      id={section.id}
      className="relative flex h-screen items-center justify-center overflow-hidden"
      style={{ y }}
    >
      {/* Background Image with Parallax */}
      {section.backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale,
            opacity: backgroundOpacity,
            filter: backgroundFilter,
          }}
        >
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
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
        className="relative z-10 max-w-4xl px-6 text-center"
        style={{
          opacity,
          rotate,
          scale: contentScale,
        }}
      >
        <motion.h2
          className="mb-8 text-display-lg text-bw-white drop-shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {section.title}
        </motion.h2>

        <motion.p
          className="text-body-lg leading-relaxed text-bw-pearl drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {section.content}
        </motion.p>

        {/* Floating Elements */}
        <motion.div
          className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-bw-gold/10 blur-2xl"
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
        className="absolute bottom-8 right-8 font-display text-6xl font-bold text-bw-gold/50"
        style={{ opacity: sectionOpacity }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>
    </motion.div>
  );
}
