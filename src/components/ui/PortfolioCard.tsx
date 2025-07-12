'use client';

import Image from 'next/image';

import { PlayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

import type { PortfolioProject } from '@/lib/types/portfolio';

interface PortfolioCardProps {
  project: PortfolioProject;
  className?: string;
  'data-testid'?: string;
}

export function PortfolioCard({ project, className, 'data-testid': testId }: PortfolioCardProps) {
  const handleViewProject = () => {
    // TODO: Implement project modal or navigation
    // Project view interaction tracked
  };

  return (
    <motion.div
      className={`card-elevated group relative cursor-pointer overflow-hidden transition-all duration-500 ${className}`}
      whileHover={{
        y: -12,
        scale: 1.03,
        rotateX: 5,
        rotateY: 5,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      data-testid={testId}
      data-cursor="portfolio"
    >
      {/* Project Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        role="img"
        aria-label={`Project: ${project.title}`}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          role="presentation"
        />

        {/* Deep Forest Haze Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bw-bg-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Play Button for Videos */}
        {project.type === 'video' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleViewProject}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-bw-accent-gold/90 text-bw-bg-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-bw-accent-gold"
              aria-label={`View ${project.title} project details`}
            >
              <PlayIcon className="ml-1 h-8 w-8" data-testid="play-icon" />
            </button>
          </motion.div>
        )}

        {/* View Button for Images */}
        {project.type === 'image' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleViewProject}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-bw-accent-gold/90 text-bw-bg-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-bw-accent-gold"
            >
              <EyeIcon className="h-8 w-8" />
            </button>
          </motion.div>
        )}

        {/* Deep Forest Haze Category Badge */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-bw-bg-primary/70 px-3 py-1 text-sm font-medium text-bw-accent-gold backdrop-blur-sm">
            {project.category}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6 text-center">
        <h3
          className="mb-2 text-display-md transition-colors duration-300 group-hover:text-bw-accent-gold"
          id={`project-title-${project.id}`}
        >
          {project.title}
        </h3>
        <p
          className="mb-4 line-clamp-2 text-body-xl"
          aria-describedby={`project-title-${project.id}`}
        >
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-md bg-bw-border-subtle px-2 py-1 text-xs text-bw-text-primary opacity-60"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="rounded-md bg-bw-border-subtle px-2 py-1 text-xs text-bw-text-primary opacity-60">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Deep Forest Haze Hover Border Effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-300 group-hover:border-bw-accent-gold/30" />
    </motion.div>
  );
}
