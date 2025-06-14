'use client';

import { motion } from 'framer-motion';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import {
  FloatingElement,
  TextReveal,
  PulseGlow,
  MorphingButton
} from '@/components/interactive';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const handleScrollToPortfolio = () => {
    const portfolioSection = document.querySelector('#portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleViewWork = () => {
    const portfolioSection = document.querySelector('#portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleStartProject = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section
      id="hero"
      className={`relative flex h-screen items-center justify-center bg-bw-bg-primary ${className}`}
    >
      {/* Deep Forest Haze Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary aurora-teal orb */}
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-bw-aurora-teal/40 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Secondary aurora-green orb */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-bw-aurora-green/35 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        {/* Bright accent orb for more visibility */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-bw-aurora-bright/30 blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Enhanced Main Content with Advanced Interactions */}
      <div className="relative z-10 text-center px-6 py-12">
        {/* Advanced Text Reveal for Main Title */}
        <div className="mb-8">
          <TextReveal
            text="BlackWoods Creative"
            className="text-gradient-gold text-display-xl drop-shadow-2xl font-display font-bold"
            delay={0.08}
          />
        </div>

        {/* Floating Subtitle with Parallax */}
        <FloatingElement amplitude={5} frequency={4} className="mb-12">
          <motion.p
            className="mx-auto max-w-3xl text-body-xl leading-relaxed drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Crafting Visual Stories That Captivate and Convert
          </motion.p>
        </FloatingElement>

        {/* Advanced Morphing Buttons */}
        <motion.div
          className="flex flex-col justify-center gap-6 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <PulseGlow intensity={0.4} duration={3}>
            <MorphingButton
              className="btn-primary px-8 py-4 text-lg font-semibold"
              onClick={handleViewWork}
              hoverChildren={
                <span className="flex items-center gap-2">
                  Explore Portfolio
                </span>
              }
            >
              <span className="flex items-center gap-2">
                View Our Work
              </span>
            </MorphingButton>
          </PulseGlow>

          <MorphingButton
            className="btn-secondary px-8 py-4 text-lg font-semibold"
            onClick={handleStartProject}
            hoverChildren={
              <span className="flex items-center gap-2">
                Let&apos;s Create
              </span>
            }
          >
            <span className="flex items-center gap-2">
              Start Your Project
            </span>
          </MorphingButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.button
          onClick={handleScrollToPortfolio}
          className="flex flex-col items-center text-bw-light-gray hover:text-bw-white transition-colors duration-300"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm font-medium mb-2">Scroll to explore</span>
          <ArrowDownIcon className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
