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
import { SectionScrollAnimation, ScrollFadeIn } from '@/components/interactive';

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
  { icon: TrophyIcon, text: '50+ Award-Winning Projects' },
  { icon: CheckBadgeIcon, text: '100+ Satisfied Clients' },
  { icon: CheckBadgeIcon, text: '5+ Years of Excellence' },
];

export function AboutSection({ className }: AboutSectionProps) {
  return (
    <section id="about" className={`bg-bw-bg-primary px-6 py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Deep Forest Haze Section Header */}
        <div className="text-center mb-20">
          <h2 className="mb-8 text-display-lg">
            About <span className="text-bw-accent-gold">BlackWoods Creative</span>
          </h2>
          <p className="mx-auto max-w-4xl text-body-xl">
            We are a premium creative studio specializing in visual storytelling that captivates audiences
            and drives results. Our expertise spans filmmaking, photography, 3D visualization, and immersive scene creation.
          </p>
        </div>

        {/* Services Grid - Deep Forest Haze Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="card group text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bw-accent-gold/15 text-bw-accent-gold transition-all duration-300 group-hover:bg-bw-accent-gold group-hover:text-bw-bg-primary group-hover:scale-110">
                  <service.icon className="h-10 w-10" />
                </div>
              </div>
              <h3 className="mb-6 text-display-md">
                {service.title}
              </h3>
              <p className="text-body-xl">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Company Story - Deep Forest Haze Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="mb-6 text-display-lg">
              Our <span className="text-bw-accent-gold">Story</span>
            </h3>
            <div className="space-y-4 text-body-xl">
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

          <div className="relative">
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

        {/* Achievements - Deep Forest Haze Style */}
        <div className="text-center">
          <h3 className="mb-8 text-display-lg">
            Our <span className="text-bw-accent-gold">Achievements</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-body-xl"
              >
                <achievement.icon className="h-6 w-6 text-bw-accent-gold" />
                <span className="font-medium">{achievement.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
