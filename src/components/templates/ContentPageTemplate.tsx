'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import {
  UserIcon,
  BriefcaseIcon,
  FilmIcon,
  CameraIcon,
  CubeIcon,
  SpeakerWaveIcon,
  ChartBarIcon,
  StarIcon,
  RocketLaunchIcon,
  HandRaisedIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

import { BasePageTemplate } from './BasePageTemplate';
import { SEOMetadata } from '@/lib/utils/metadata';
import { ScrollReveal } from '@/components/interactive';
import { handleNavigationClick } from '@/lib/utils/navigation';

// Content section types for rich content pages
export interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'timeline' | 'values' | 'team' | 'process' | 'gallery' | 'cta';
  data: any;
  styling?: {
    background?: 'primary' | 'secondary' | 'accent' | 'transparent';
    spacing?: 'tight' | 'normal' | 'loose';
    alignment?: 'left' | 'center' | 'right';
    maxWidth?: 'narrow' | 'normal' | 'wide' | 'full';
  };
}

// Hero section data
export interface HeroData {
  title: string;
  subtitle?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}

// Text content section
export interface TextData {
  title?: string;
  content: string | ReactNode;
  columns?: 1 | 2;
  highlight?: boolean;
}

// Timeline section for company history
export interface TimelineData {
  title: string;
  events: Array<{
    year: string;
    title: string;
    description: string;
    highlight?: boolean;
  }>;
}

// Values/principles section
export interface ValuesData {
  title: string;
  description?: string;
  values: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

// Icon mapping for consistent Heroicons usage
const iconMap: Record<string, React.ComponentType<any>> = {
  UserIcon,
  BriefcaseIcon,
  FilmIcon,
  CameraIcon,
  CubeIcon,
  SpeakerWaveIcon,
  ChartBarIcon,
  StarIcon,
  RocketLaunchIcon,
  HandRaisedIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
};

// Content page configuration
export interface ContentPageData {
  hero: HeroData;
  sections: ContentSection[];
}

export interface ContentPageTemplateProps {
  metadata: SEOMetadata;
  data: ContentPageData;
  className?: string;
}

/**
 * Content Page Template
 * 
 * Specialized template for content-heavy pages like Our Story, Our Workflow, etc.
 * Optimized for readability, entity recognition, and structured data.
 */
export function ContentPageTemplate({
  metadata,
  data,
  className = '',
}: ContentPageTemplateProps) {
  return (
    <BasePageTemplate
      metadata={metadata}
      layout="content"
      className={className}
    >
      {/* Hero Section */}
      <ContentHeroSection data={data.hero} />

      {/* Content Sections */}
      {data.sections.map((section) => (
        <ContentSectionRenderer
          key={section.id}
          section={section}
        />
      ))}
    </BasePageTemplate>
  );
}

/**
 * Content Hero Section
 */
function ContentHeroSection({ data }: { data: HeroData }) {
  return (
    <section className="relative bg-bw-bg-primary py-24 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumbs */}
        {data.breadcrumbs && (
          <ScrollReveal direction="up" distance={20}>
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-bw-text-secondary">
                {data.breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    <a 
                      href={crumb.href}
                      className="hover:text-bw-accent-gold transition-colors"
                    >
                      {crumb.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </ScrollReveal>
        )}

        {/* Hero Content */}
        <div className="text-center">
          <ScrollReveal direction="up" distance={60}>
            <h1 className="mb-6 font-display text-display-xl">
              {data.title}
            </h1>
          </ScrollReveal>
          
          {data.subtitle && (
            <ScrollReveal direction="up" distance={40} delay={0.2}>
              <p className="mb-8 text-body-xl text-bw-text-secondary">
                {data.subtitle}
              </p>
            </ScrollReveal>
          )}

          {data.description && (
            <ScrollReveal direction="up" distance={40} delay={0.3}>
              <p className="mb-12 text-body-lg max-w-3xl mx-auto">
                {data.description}
              </p>
            </ScrollReveal>
          )}
        </div>

        {/* Hero Image */}
        {data.image && (
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <div className="mt-12 rounded-2xl overflow-hidden">
              <img
                src={data.image.src}
                alt={data.image.alt}
                className="w-full h-auto"
              />
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

/**
 * Content Section Renderer
 */
function ContentSectionRenderer({
  section,
}: {
  section: ContentSection;
}) {
  const baseClasses = getContentSectionClasses(section);

  switch (section.type) {
    case 'text':
      return (
        <section className={baseClasses}>
          <TextSection data={section.data} styling={section.styling} />
        </section>
      );

    case 'timeline':
      return (
        <section className={baseClasses}>
          <TimelineSection data={section.data} />
        </section>
      );

    case 'values':
      return (
        <section className={baseClasses}>
          <ValuesSection data={section.data} />
        </section>
      );

    case 'cta':
      return (
        <section className={baseClasses}>
          <CTASection data={section.data} />
        </section>
      );

    default:
      return (
        <section className={baseClasses}>
          <div className="text-center py-8">
            <p>Unknown section type: {section.type}</p>
          </div>
        </section>
      );
  }
}

/**
 * Text Content Section
 */
function TextSection({ 
  data, 
  styling 
}: { 
  data: TextData; 
  styling?: ContentSection['styling'];
}) {
  const maxWidth = getMaxWidthClass(styling?.maxWidth);
  
  return (
    <div className={`mx-auto ${maxWidth}`}>
      <ScrollReveal direction="up" distance={40}>
        {data.title && (
          <h2 className="mb-8 font-display text-display-lg text-center">
            {data.title}
          </h2>
        )}
        
        <div className={`prose prose-lg max-w-none ${
          data.columns === 2 ? 'columns-2 gap-8' : ''
        } ${data.highlight ? 'bg-bw-border-subtle/10 p-8 rounded-2xl' : ''}`}>
          {typeof data.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: data.content }} />
          ) : (
            data.content
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}

/**
 * Timeline Section
 */
function TimelineSection({ data }: { data: TimelineData }) {
  return (
    <div className="mx-auto max-w-4xl">
      <ScrollReveal direction="up" distance={40}>
        <h2 className="mb-12 font-display text-display-lg text-center">
          {data.title}
        </h2>
      </ScrollReveal>

      <div className="space-y-8">
        {data.events.map((event, index) => (
          <ScrollReveal key={event.year} direction="up" distance={40} delay={index * 0.1}>
            <div className={`flex gap-6 p-6 rounded-2xl ${
              event.highlight 
                ? 'bg-bw-accent-gold/10 border border-bw-accent-gold/20' 
                : 'bg-bw-border-subtle/10'
            }`}>
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold ${
                  event.highlight 
                    ? 'bg-bw-accent-gold text-bw-bg-primary' 
                    : 'bg-bw-border-subtle text-bw-text-primary'
                }`}>
                  {event.year}
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-display text-display-sm">{event.title}</h3>
                <p className="text-body-lg text-bw-text-secondary">{event.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

/**
 * Values Section
 */
function ValuesSection({ data }: { data: ValuesData }) {
  return (
    <div className="mx-auto max-w-6xl">
      <ScrollReveal direction="up" distance={40}>
        <div className="text-center mb-16">
          <h2 className="mb-6 font-display text-display-lg">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-body-xl text-bw-text-secondary max-w-3xl mx-auto">
              {data.description}
            </p>
          )}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.values.map((value, index) => {
          const IconComponent = value.icon ? iconMap[value.icon] : null;

          return (
            <ScrollReveal key={value.title} direction="up" distance={40} delay={index * 0.1}>
              <div className="p-8 bg-bw-border-subtle/10 rounded-2xl text-center">
                {IconComponent && (
                  <div className="mb-6 flex justify-center">
                    <IconComponent className="h-12 w-12 text-bw-accent-gold" />
                  </div>
                )}
                <h3 className="mb-4 font-display text-display-sm">{value.title}</h3>
                <p className="text-body-lg text-bw-text-secondary whitespace-pre-line">{value.description}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

/**
 * CTA Section
 */
function CTASection({ data }: { data: any }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <ScrollReveal direction="up" distance={40}>
        <h2 className="mb-6 font-display text-display-lg">{data.title}</h2>
        <p className="mb-8 text-body-xl text-bw-text-secondary">{data.description}</p>
        <motion.button
          onClick={() => handleNavigationClick(data.href)}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {data.text}
        </motion.button>
      </ScrollReveal>
    </div>
  );
}

/**
 * Utility functions
 */
function getContentSectionClasses(section: ContentSection): string {
  const { styling } = section;
  let classes = 'relative py-24 px-6 ';

  // Background
  switch (styling?.background) {
    case 'secondary':
      classes += 'bg-bw-bg-secondary ';
      break;
    case 'accent':
      classes += 'bg-bw-accent-gold/5 ';
      break;
    case 'transparent':
      classes += 'bg-transparent ';
      break;
    default:
      classes += 'bg-bw-bg-primary ';
  }

  // Spacing
  switch (styling?.spacing) {
    case 'tight':
      classes += 'py-16 ';
      break;
    case 'loose':
      classes += 'py-32 ';
      break;
    default:
      classes += 'py-24 ';
  }

  return classes;
}

function getMaxWidthClass(maxWidth?: string): string {
  switch (maxWidth) {
    case 'narrow':
      return 'max-w-2xl';
    case 'wide':
      return 'max-w-6xl';
    case 'full':
      return 'max-w-full';
    default:
      return 'max-w-4xl';
  }
}
