'use client';

import { ArrowDownIcon } from '@heroicons/react/24/outline';

import {
  FloatingElement,
  TextReveal,
  PulseGlow,
  MorphingButton,
  MagneticField,
  ParallaxText,
  AtmosphericLayer,
} from '@/components/interactive';
import { MotionDiv, MotionButton, MotionP } from '@/components/interactive/MotionWrapper';
import { navigateToPortfolio, navigateToContact } from '@/lib/utils/navigation';

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
    navigateToPortfolio();
  };

  const handleStartProject = () => {
    navigateToContact();
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
        {/* Primary aurora-green orb - Enhanced Forest Prominence */}
        <MotionDiv
          className="absolute left-1/4 top-1/4 h-[700px] w-[700px] rounded-full bg-bw-aurora-green/60 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
            x: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Secondary aurora-green orb - Enhanced */}
        <MotionDiv
          className="absolute bottom-1/4 right-1/4 h-[800px] w-[800px] rounded-full bg-bw-aurora-green/55 blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
            x: [0, -20, 0],
            y: [0, 12, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
        {/* Forest green accent orb - Enhanced */}
        <MotionDiv
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-bw-aurora-green/40 blur-2xl"
          animate={{
            rotate: [0, 360],
            scale: [0.9, 1.1, 0.9],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {/* Additional forest green atmospheric layer */}
        <MotionDiv
          className="absolute right-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-bw-aurora-green/30 blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 6,
          }}
        />
      </div>

      {/* Advanced Main Content with Magnetic Interactions */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-12 text-center">
        {/* Main Title with Magnetic Effect */}
        <MagneticField strength={0.08} distance={150}>
          <div className="mb-8">
            <TextReveal
              text="BlackWoods Creative"
              className="cursor-pointer font-display text-display-xl text-bw-accent-gold drop-shadow-2xl"
              delay={0.08}
            />
          </div>
        </MagneticField>

        {/* Subtitle with Parallax Text Effect */}
        <ParallaxText speed={0.3} className="mb-12">
          <FloatingElement amplitude={3} frequency={6}>
            <MotionP
              className="mx-auto max-w-3xl text-body-xl drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Crafting Visual Stories That Captivate and Convert
            </MotionP>
          </FloatingElement>
        </ParallaxText>

        {/* CTA Buttons with Magnetic Effects */}
        <MotionDiv
          className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MagneticField strength={0.12} distance={120}>
            <PulseGlow intensity={0.4} duration={3}>
              <MorphingButton
                className="btn-primary"
                onClick={handleViewWork}
                aria-label="View our portfolio and previous work"
                hoverChildren={<span className="flex items-center gap-2">Explore Portfolio</span>}
              >
                <span className="flex items-center gap-2">View Our Work</span>
              </MorphingButton>
            </PulseGlow>
          </MagneticField>

          <MagneticField strength={0.1} distance={100}>
            <MorphingButton
              className="btn-secondary"
              onClick={handleStartProject}
              aria-label="Start your project - Contact us to begin"
              hoverChildren={<span className="flex items-center gap-2">Let&apos;s Create</span>}
            >
              <span className="flex items-center gap-2">Start Your Project</span>
            </MorphingButton>
          </MagneticField>
        </MotionDiv>
      </div>

      {/* Magnetic Scroll Indicator */}
      <MotionDiv
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform flex-col items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <MagneticField strength={0.15} distance={80}>
          <MotionButton
            onClick={handleScrollToPortfolio}
            className="flex cursor-pointer flex-col items-center text-body-lg transition-colors duration-300 hover:text-bw-accent-gold"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="mb-2 text-sm font-medium">Scroll to explore</span>
            <ArrowDownIcon className="h-5 w-5" />
          </MotionButton>
        </MagneticField>
      </MotionDiv>
    </section>
  );
}
