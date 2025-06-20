'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

import {
  TextReveal,
  MagneticField,
  ScrollReveal,
  WebGLEnhancedBackground,
} from '@/components/interactive';

interface VisionSectionProps {
  className?: string;
}

// Enhanced story data with optimized effects and timing
const visionStoryData = [
  {
    id: 'vision',
    title: 'Our Vision',
    subtitle: 'Visual Storytelling',
    content:
      'We believe in the power of visual storytelling to transform brands and captivate audiences. Every frame tells a story, every moment captures emotion.',
    backgroundImage:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&q=80',
    parallaxSpeed: 0.6,
    effects: {
      scale: [0.85, 1, 1, 1.15] as [number, number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
      blur: [12, 0, 0, 12] as [number, number, number, number],
      rotate: [0, 0] as [number, number],
    },
    color: 'from-bw-aurora-teal/30 to-bw-aurora-green/20',
    accent: 'text-bw-accent-gold',
  },
  {
    id: 'craft',
    title: 'Our Craft',
    subtitle: 'Meticulous Excellence',
    content:
      'From concept to completion, we meticulously craft each project with attention to detail that sets us apart. Our expertise spans multiple disciplines.',
    backgroundImage:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=1080&fit=crop&q=80',
    parallaxSpeed: 0.8,
    effects: {
      scale: [1.1, 1, 1, 0.9] as [number, number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
      blur: [8, 0, 0, 8] as [number, number, number, number],
      rotate: [-1, 1] as [number, number],
    },
    color: 'from-bw-aurora-green/30 to-bw-aurora-bright/20',
    accent: 'text-bw-accent-gold',
  },
  {
    id: 'impact',
    title: 'Our Impact',
    subtitle: 'Results That Matter',
    content:
      'We create visual experiences that not only look stunning but drive real results. Our work speaks for itself through the success of our clients.',
    backgroundImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop&q=80',
    parallaxSpeed: 0.4,
    effects: {
      scale: [0.75, 1, 1, 1.25] as [number, number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
      blur: [15, 0, 0, 15] as [number, number, number, number],
      rotate: [0, 0] as [number, number],
    },
    color: 'from-bw-aurora-bright/30 to-bw-aurora-teal/20',
    accent: 'text-bw-accent-gold',
  },
];

// Enhanced Cinematic Finale Section
function CinematicFinale() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: backgroundScale,
          transformOrigin: 'center center',
        }}
      >
        <div className="h-full w-full bg-bw-bg-primary" />
      </motion.div>

      {/* Enhanced Atmospheric Layers */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
      >
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-bw-aurora-teal/20 blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
      >
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-bw-aurora-green/15 blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute inset-0 z-10"
        style={{ x: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
      >
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-bw-aurora-bright/15 blur-2xl" />
      </motion.div>

      {/* Enhanced Content with Magnetic Effects */}
      <motion.div
        className="relative z-20 flex h-full items-center justify-center px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <MagneticField strength={0.1} distance={250}>
          <div className="max-w-4xl">
            <ScrollReveal direction="up" distance={60} delay={0.2}>
              <TextReveal
                text="Experience the Difference"
                className="mb-8 cursor-pointer font-display text-display-xl text-bw-accent-gold"
                delay={0.05}
              />
            </ScrollReveal>
            <ScrollReveal direction="up" distance={40} delay={0.4}>
              <motion.p
                className="text-body-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                Our commitment to excellence and innovation creates immersive experiences that
                engage your audience and leave lasting impressions. Every project is carefully
                crafted for maximum impact.
              </motion.p>
            </ScrollReveal>
          </div>
        </MagneticField>
      </motion.div>
    </div>
  );
}

// Main Vision Section Component
export function VisionSection({ className }: VisionSectionProps) {
  return (
    <WebGLEnhancedBackground
      effectType="aurora"
      intensity={0.3}
      className={`relative ${className}`}
    >
      <section className="relative bg-bw-bg-primary/80">
        {/* Simplified Scroll-Based Storytelling */}
        <div className="relative min-h-[300vh]">
          <SimpleScrollStoryTeller sections={visionStoryData} />
        </div>

        {/* Cinematic Finale */}
        <CinematicFinale />
      </section>
    </WebGLEnhancedBackground>
  );
}

// Simplified but optimized scroll storyteller
function SimpleScrollStoryTeller({ sections }: { sections: typeof visionStoryData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', latest => {
      const sectionIndex = Math.floor(latest * sections.length);
      const clampedIndex = Math.max(0, Math.min(sections.length - 1, sectionIndex));
      setActiveSection(clampedIndex);
    });

    return unsubscribe;
  }, [smoothProgress, sections.length]);

  return (
    <div ref={containerRef} className="relative">
      {/* Progress Indicator */}
      <motion.div
        className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 transform lg:flex lg:flex-col lg:items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className={`h-12 w-1 cursor-pointer rounded-full transition-all duration-500 ${
                index === activeSection
                  ? 'bg-bw-accent-gold shadow-[0_0_20px_rgba(195,163,88,0.6)]'
                  : 'bg-bw-border-subtle hover:bg-bw-accent-gold/30'
              }`}
              whileHover={{ scale: 1.02, x: 1 }}
              onClick={() => {
                const element = document.getElementById(section.id);
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Story Sections */}
      {sections.map((section, index) => (
        <SimpleStorySection
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

// Simplified story section
interface SimpleStorySectionProps {
  section: (typeof visionStoryData)[0];
  index: number;
  isActive: boolean;
  scrollProgress: MotionValue<number>;
  totalSections: number;
}

function SimpleStorySection({
  section,
  index,
  isActive,
  scrollProgress,
  totalSections,
}: SimpleStorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const sectionStart = index / totalSections;
  const sectionEnd = (index + 1) / totalSections;

  const sectionProgress = useTransform(scrollProgress, [sectionStart, sectionEnd], [0, 1]);

  const y = useTransform(
    scrollProgress,
    [sectionStart, sectionEnd],
    [0, -100 * (section.parallaxSpeed || 1)]
  );

  const scale = useTransform(sectionProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  const opacity = useTransform(sectionProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Pre-calculate transforms to avoid conditional hooks
  const backgroundOpacity = useTransform(opacity, value => value * 0.7);
  const sectionNumberOpacity = useTransform(opacity, value => value * 0.3);

  return (
    <motion.div
      ref={sectionRef}
      id={section.id}
      className="relative flex h-screen items-center justify-center overflow-hidden"
      style={{ y }}
    >
      {/* Background */}
      {section.backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale,
            opacity: backgroundOpacity,
          }}
        >
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${section.backgroundImage})`,
            }}
          />
          <div className="absolute inset-0 bg-bw-bg-primary/60" />
        </motion.div>
      )}

      {/* Content */}
      <motion.div className="relative z-20 max-w-4xl px-6 text-center" style={{ opacity }}>
        <motion.div
          className={`mb-4 text-sm font-medium uppercase tracking-wider ${section.accent}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {section.subtitle}
        </motion.div>

        <motion.div className="mb-8">
          <TextReveal
            text={section.title}
            className="font-display text-display-xl text-bw-accent-gold drop-shadow-2xl"
            delay={isActive ? 0.05 : 0}
          />
        </motion.div>

        <motion.p
          className="text-body-xl drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {section.content}
        </motion.p>
      </motion.div>

      {/* Section Number */}
      <motion.div
        className="absolute bottom-8 right-8 font-display text-6xl font-bold text-bw-accent-gold/30"
        style={{ opacity: sectionNumberOpacity }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>
    </motion.div>
  );
}
