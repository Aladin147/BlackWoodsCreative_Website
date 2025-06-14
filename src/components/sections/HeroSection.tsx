'use client';

import { motion } from 'framer-motion';
import { ArrowDownIcon } from '@heroicons/react/24/outline';
import {
  FloatingElement,
  TextReveal,
  PulseGlow,
  MorphingButton,
  MagneticField,
  ParallaxText,
  AtmosphericLayer
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
        {/* Enhanced Deep Forest Haze Background Elements with Atmospheric Layers */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Atmospheric Background Layers */}
          <AtmosphericLayer type="mist" intensity={0.6} color="bw-aurora-teal" />
          <AtmosphericLayer type="particles" intensity={0.4} color="bw-aurora-green" />
          <AtmosphericLayer type="orbs" intensity={0.3} color="bw-aurora-bright" />
          {/* Primary aurora-teal orb - Enhanced */}
          <motion.div
            className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-bw-aurora-teal/50 blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Secondary aurora-green orb - Enhanced */}
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-[700px] w-[700px] rounded-full bg-bw-aurora-green/45 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.3],
              opacity: [0.6, 0.9, 0.6],
              x: [0, -40, 0],
              y: [0, 25, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3,
            }}
          />
          {/* Bright accent orb - Enhanced */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-bw-aurora-bright/35 blur-2xl"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Additional atmospheric layer */}
          <motion.div
            className="absolute top-1/3 right-1/3 h-[400px] w-[400px] rounded-full bg-bw-aurora-teal/25 blur-3xl"
            animate={{
              scale: [1.1, 0.9, 1.1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, -180, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 5,
            }}
          />
        </div>

        {/* Advanced Main Content with Magnetic Interactions */}
        <div className="relative z-10 text-center px-6 py-12">
          {/* Main Title with Magnetic Effect */}
          <MagneticField strength={0.15} distance={200}>
            <div className="mb-8">
              <TextReveal
                text="BlackWoods Creative"
                className="text-heading-1 font-display text-bw-accent-gold drop-shadow-2xl cursor-pointer"
                delay={0.08}
              />
            </div>
          </MagneticField>

          {/* Subtitle with Parallax Text Effect */}
          <ParallaxText speed={0.3} className="mb-12">
            <FloatingElement amplitude={5} frequency={4}>
              <motion.p
                className="mx-auto max-w-3xl text-body-xl drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Crafting Visual Stories That Captivate and Convert
              </motion.p>
            </FloatingElement>
          </ParallaxText>

          {/* CTA Buttons with Magnetic Effects */}
          <motion.div
            className="flex flex-col justify-center gap-6 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <MagneticField strength={0.25} distance={150}>
              <PulseGlow intensity={0.4} duration={3}>
                <MorphingButton
                  className="btn-primary"
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
            </MagneticField>

            <MagneticField strength={0.2} distance={130}>
              <MorphingButton
                className="btn-secondary"
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
            </MagneticField>
          </motion.div>
        </div>

        {/* Magnetic Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <MagneticField strength={0.3} distance={100}>
            <motion.button
              onClick={handleScrollToPortfolio}
              className="flex flex-col items-center text-body-lg hover:text-bw-accent-gold transition-colors duration-300 cursor-pointer"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-sm font-medium mb-2">Scroll to explore</span>
              <ArrowDownIcon className="w-5 h-5" />
            </motion.button>
          </MagneticField>
        </motion.div>
    </section>
  );
}
