'use client';

import { motion } from 'framer-motion';
import {
  ScrollStoryTeller,
  CinematicParallax,
  TiltCard,
  FloatingElement,
  StaggeredReveal,
  TextReveal,
  DepthOfField,
  ParallaxLayer
} from '@/components/interactive';

interface AdvancedShowcaseProps {
  className?: string;
}

const storyData = [
  {
    id: 'vision',
    title: 'Our Vision',
    content: 'We believe in the power of visual storytelling to transform brands and captivate audiences. Every frame tells a story, every moment captures emotion.',
    backgroundImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    parallaxSpeed: 0.8,
    effects: {
      scale: [0.9, 1, 1.1] as [number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
      blur: [5, 0, 0, 5] as [number, number, number, number],
    }
  },
  {
    id: 'craft',
    title: 'Our Craft',
    content: 'From concept to completion, we meticulously craft each project with attention to detail that sets us apart. Our expertise spans multiple disciplines.',
    backgroundImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=1080&fit=crop',
    parallaxSpeed: 1.2,
    effects: {
      scale: [1.1, 1, 0.9] as [number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
      rotate: [-2, 0] as [number, number],
    }
  },
  {
    id: 'impact',
    title: 'Our Impact',
    content: 'We create visual experiences that not only look stunning but drive real results. Our work speaks for itself through the success of our clients.',
    backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
    parallaxSpeed: 0.6,
    effects: {
      scale: [0.8, 1, 1.2] as [number, number, number],
      opacity: [0, 1, 1, 0] as [number, number, number, number],
      blur: [8, 0, 0, 8] as [number, number, number, number],
    }
  }
];

export function AdvancedShowcase({ className }: AdvancedShowcaseProps) {
  return (
    <section className={`relative bg-bw-black ${className}`}>
      {/* Scroll-Based Storytelling Section */}
      <div className="relative min-h-[300vh]">
        <ScrollStoryTeller sections={storyData} />
      </div>

      {/* Cinematic Parallax Section */}
      <CinematicParallax className="relative">
        <div className="relative z-20 text-center px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <TextReveal
              text="Experience the Difference"
              className="text-display-lg text-bw-white mb-8 font-display font-bold"
              delay={0.1}
            />
            <motion.p
              className="text-body-lg text-bw-pearl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Our advanced interactive features create immersive experiences that engage your audience
              and leave lasting impressions. Every interaction is carefully crafted for maximum impact.
            </motion.p>
          </motion.div>
        </div>
      </CinematicParallax>

      {/* Interactive Cards Showcase */}
      <div className="relative bg-gradient-to-br from-bw-charcoal to-bw-dark-gray py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-lg text-bw-white mb-6">
              Interactive <span className="text-gradient-gold">Features</span>
            </h2>
            <p className="text-body-lg text-bw-pearl max-w-3xl mx-auto">
              Explore our advanced interaction capabilities that bring websites to life
            </p>
          </motion.div>

          <StaggeredReveal delay={0.2}>
            {[
              {
                title: 'Magnetic Interactions',
                description: 'Elements that respond to cursor movement with realistic physics',
                icon: '🧲',
              },
              {
                title: 'Scroll Storytelling',
                description: 'Narrative experiences that unfold as users scroll through content',
                icon: '📖',
              },
              {
                title: 'Cinematic Parallax',
                description: 'Multi-layer depth effects that create immersive visual experiences',
                icon: '🎬',
              },
              {
                title: 'Advanced Animations',
                description: 'Smooth, performance-optimized animations that delight users',
                icon: '✨',
              },
            ].map((feature, index) => (
              <div key={feature.title} className="mb-8">
                <TiltCard maxTilt={8} className="h-full">
                  <div className="bg-gradient-to-br from-bw-dark-gray to-bw-charcoal p-8 rounded-2xl border border-bw-medium-gray/30 hover:border-bw-gold/30 transition-all duration-300">
                    <FloatingElement amplitude={3} frequency={3 + index}>
                      <div className="text-4xl mb-4">{feature.icon}</div>
                    </FloatingElement>
                    <h3 className="text-xl font-semibold text-bw-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-bw-light-gray leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </StaggeredReveal>
        </div>
      </div>

      {/* Depth of Field Demo */}
      <div className="relative py-32 bg-bw-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-lg text-bw-white mb-6">
              Depth & <span className="text-gradient-gold">Focus</span>
            </h2>
            <p className="text-body-lg text-bw-pearl max-w-3xl mx-auto">
              Advanced depth of field effects that guide attention and create visual hierarchy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0.2, 0.5, 0.8].map((focusDistance, index) => (
              <DepthOfField
                key={index}
                focusDistance={focusDistance}
                className="aspect-square"
              >
                <div className="w-full h-full bg-gradient-to-br from-bw-gold/20 to-bw-pearl/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {index === 0 ? '🎯' : index === 1 ? '🔍' : '👁️'}
                    </div>
                    <h3 className="text-xl font-semibold text-bw-white">
                      Focus {index + 1}
                    </h3>
                  </div>
                </div>
              </DepthOfField>
            ))}
          </div>
        </div>

        {/* Background Parallax Layers */}
        <ParallaxLayer speed={0.3} direction="up" className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-bw-gold/5 rounded-full blur-3xl" />
        </ParallaxLayer>

        <ParallaxLayer speed={0.7} direction="down" className="absolute inset-0 -z-10">
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bw-pearl/3 rounded-full blur-3xl" />
        </ParallaxLayer>
      </div>
    </section>
  );
}
