'use client';

import { motion } from 'framer-motion';
import {
  FilmIcon,
  CameraIcon,
  CubeIcon,
  SparklesIcon,
  CheckBadgeIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import {
  SectionScrollAnimation,
  ScrollFadeIn,
  ScrollReveal,
  StaggeredGrid,
  MagneticField,
  AtmosphericLayer,
  ParallaxText,
  CountUp
} from '@/components/interactive';

interface AboutSectionProps {
  className?: string;
}

const services = [
  {
    icon: FilmIcon,
    title: 'Filmmaking',
    description: 'Cinematic storytelling that captures emotion and drives engagement through compelling visual narratives.',
  },
  {
    icon: CameraIcon,
    title: 'Photography',
    description: 'Professional photography services from product shoots to editorial work with meticulous attention to detail.',
  },
  {
    icon: CubeIcon,
    title: '3D Visualization',
    description: 'Photorealistic 3D renders and animations that bring concepts to life with stunning accuracy.',
  },
  {
    icon: SparklesIcon,
    title: 'Scene Creation',
    description: 'Immersive environments and scenes for VR, gaming, and interactive experiences.',
  },
];

const achievements = [
  { icon: TrophyIcon, text: 'Award-Winning Projects', count: 50 },
  { icon: CheckBadgeIcon, text: 'Satisfied Clients', count: 100 },
  { icon: CheckBadgeIcon, text: 'Years of Excellence', count: 5 },
];

export function AboutSection({ className }: AboutSectionProps) {
  return (
    <section id="about" className={`relative bg-bw-bg-primary px-6 py-32 ${className}`}>
      {/* Atmospheric Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <AtmosphericLayer type="gradient" intensity={0.3} color="bw-aurora-green" />
        <AtmosphericLayer type="particles" intensity={0.2} color="bw-aurora-teal" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Enhanced Section Header with Parallax Text */}
        <ScrollReveal className="text-center mb-20" direction="up" distance={60}>
          <ParallaxText speed={0.2}>
            <h2 className="mb-8 text-heading-2 font-display">
              About <span className="text-bw-accent-gold">BlackWoods Creative</span>
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" distance={40} delay={0.3}>
            <p className="mx-auto max-w-4xl text-body-text font-primary opacity-85">
              We are a premium creative studio specializing in visual storytelling that captivates audiences
              and drives results. Our expertise spans filmmaking, photography, 3D visualization, and immersive scene creation.
            </p>
          </ScrollReveal>
        </ScrollReveal>

        {/* Services Grid with Advanced Staggered Animation */}
        <StaggeredGrid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          staggerDelay={0.15}
        >
          {services.map((service, index) => (
            <MagneticField key={service.title} strength={0.2} distance={120}>
              <div className="card group text-center cursor-pointer">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bw-accent-gold/15 text-bw-accent-gold transition-all duration-300 group-hover:bg-bw-accent-gold group-hover:text-bw-bg-primary group-hover:scale-110">
                    <service.icon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="mb-6 text-heading-3 font-primary">
                  {service.title}
                </h3>
                <p className="text-body-text font-primary opacity-85">
                  {service.description}
                </p>
              </div>
            </MagneticField>
          ))}
        </StaggeredGrid>

        {/* Company Story - ASYMMETRICAL LAYOUT per Theme Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-4">
            <h3 className="mb-6 text-heading-2 font-display">
              Our <span className="text-bw-accent-gold">Story</span>
            </h3>
            <div className="space-y-4 text-body-text font-primary opacity-85">
              <p>
                Founded with a passion for visual excellence, BlackWoods Creative has evolved into a
                premier creative studio that bridges the gap between artistic vision and commercial success.
              </p>
              <p>
                Our team combines technical expertise with creative innovation to deliver projects that
                not only meet but exceed client expectations. From concept to completion, we ensure
                every frame tells a compelling story.
              </p>
              <p>
                We believe in the power of visual storytelling to transform brands, engage audiences,
                and create lasting impressions that drive real business results.
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-7 lg:col-start-6">
            <div className="card aspect-square flex items-center justify-center">
              <div className="text-center">
                <FilmIcon className="h-16 w-16 text-bw-accent-gold mx-auto mb-4" />
                <p className="text-body-lg">
                  Studio Image Placeholder
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Achievements with CountUp Animation */}
        <ScrollReveal className="text-center" direction="up" distance={50} delay={0.2}>
          <ParallaxText speed={0.15}>
            <h3 className="mb-8 text-heading-2 font-display">
              Our <span className="text-bw-accent-gold">Achievements</span>
            </h3>
          </ParallaxText>
          <StaggeredGrid className="flex flex-wrap justify-center gap-8" staggerDelay={0.2}>
            {achievements.map((achievement, index) => (
              <MagneticField key={index} strength={0.15} distance={80}>
                <div className="flex flex-col items-center gap-3 text-center cursor-pointer">
                  <achievement.icon className="h-8 w-8 text-bw-accent-gold" />
                  <div className="text-heading-3 font-primary font-bold text-bw-accent-gold">
                    <CountUp end={achievement.count} duration={2} delay={index * 0.3} />+
                  </div>
                  <span className="text-body-text font-primary font-medium">{achievement.text}</span>
                </div>
              </MagneticField>
            ))}
          </StaggeredGrid>
        </ScrollReveal>
      </div>
    </section>
  );
}
