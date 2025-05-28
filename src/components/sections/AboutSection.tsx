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
    <section id="about" className={`bg-gradient-to-br from-bw-dark-gray via-bw-medium-gray to-bw-dark-gray px-6 py-32 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-8 text-display-lg drop-shadow-xl">
            About <span className="text-gradient-gold">BlackWoods Creative</span>
          </h2>
          <p className="mx-auto max-w-4xl text-body-lg text-bw-pearl leading-relaxed">
            We are a premium creative studio specializing in visual storytelling that captivates audiences
            and drives results. Our expertise spans filmmaking, photography, 3D visualization, and immersive scene creation.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="card-elevated group text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="mb-8 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bw-gold/15 text-bw-gold transition-all duration-500 group-hover:bg-bw-gold group-hover:text-bw-black group-hover:scale-110 shadow-depth-1 group-hover:shadow-gold-glow">
                  <service.icon className="h-10 w-10" />
                </div>
              </div>
              <h3 className="mb-6 font-display text-xl font-semibold text-bw-white">
                {service.title}
              </h3>
              <p className="text-bw-pearl leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Story */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="mb-6 font-display text-3xl font-bold text-bw-white">
              Our <span className="text-gradient-gold">Story</span>
            </h3>
            <div className="space-y-4 text-bw-light-gray">
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
            <div className="aspect-square rounded-lg bg-gradient-to-br from-bw-gold/20 to-bw-silver/10 p-8">
              <div className="h-full w-full rounded-lg bg-bw-charcoal flex items-center justify-center">
                <div className="text-center">
                  <FilmIcon className="h-16 w-16 text-bw-gold mx-auto mb-4" />
                  <p className="text-bw-light-gray">
                    Studio Image Placeholder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="mb-8 font-display text-2xl font-bold text-bw-white">
            Our <span className="text-gradient-gold">Achievements</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-bw-light-gray"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <achievement.icon className="h-6 w-6 text-bw-gold" />
                <span className="font-medium">{achievement.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
