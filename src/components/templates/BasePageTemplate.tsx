'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { Footer, Header } from '@/components/layout';
import { SEOMetadata } from '@/lib/utils/metadata';

// Content block types for reusable page sections
export interface ContentBlock {
  id: string;
  type: 'hero' | 'content' | 'cta' | 'faq' | 'testimonials' | 'services' | 'pricing';
  data: any;
  styling?: {
    background?: 'primary' | 'secondary' | 'gradient' | 'transparent';
    spacing?: 'tight' | 'normal' | 'loose';
    alignment?: 'left' | 'center' | 'right';
  };
  animations?: {
    enabled: boolean;
    type?: 'fade' | 'slide' | 'scale' | 'parallax';
    delay?: number;
  };
}

// Page template configuration
export interface PageTemplateProps {
  metadata: SEOMetadata;
  content?: ContentBlock[];
  layout?: 'default' | 'service' | 'landing' | 'content';
  features?: {
    showHeader?: boolean;
    showFooter?: boolean;
    enableAnimations?: boolean;
    enableWebGL?: boolean;
    enableMagneticCursor?: boolean;
  };
  className?: string;
  children?: ReactNode;
}

// Default features configuration
const defaultFeatures = {
  showHeader: true,
  showFooter: true,
  enableAnimations: true,
  enableWebGL: false,
  enableMagneticCursor: true,
};

/**
 * Base Page Template Component
 * 
 * Provides consistent layout, SEO optimization, and performance features
 * for all pages while maintaining the existing design system.
 */
export function BasePageTemplate({
  metadata,
  content = [],
  layout = 'default',
  features = defaultFeatures,
  className = '',
  children,
}: PageTemplateProps) {
  const mergedFeatures = { ...defaultFeatures, ...features };

  // Generate enhanced structured data for AI-first SEO
  const enhancedStructuredData = {
    '@context': 'https://schema.org',
    '@type': metadata.localBusiness ? 'LocalBusiness' : 'WebPage',
    name: metadata.title,
    description: metadata.description,
    url: metadata.canonicalUrl,
    ...(metadata.localBusiness && {
      serviceType: metadata.localBusiness.service,
      areaServed: metadata.localBusiness.location,
      priceRange: metadata.localBusiness.priceRange,
    }),
    ...(metadata.featuredSnippet && {
      mainEntity: {
        '@type': 'Question',
        name: metadata.featuredSnippet.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: metadata.featuredSnippet.answer,
        },
      },
    }),
    ...metadata.structuredData,
  };

  return (
    <>
      {/* Enhanced structured data for AI optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(enhancedStructuredData) }}
      />

      {/* Page layout with consistent structure */}
      <div className={`min-h-screen bg-bw-bg-primary text-bw-text-primary ${className}`}>
        {/* Header */}
        {mergedFeatures.showHeader && <Header />}

        {/* Main content area */}
        <main 
          id="main-content" 
          role="main" 
          className={`relative ${getLayoutClasses(layout)}`}
          aria-label="Main content"
        >
          {/* Featured snippet optimization section */}
          {metadata.featuredSnippet && (
            <section className="sr-only" aria-hidden="true">
              <h1>{metadata.featuredSnippet.question}</h1>
              <p>{metadata.featuredSnippet.answer}</p>
            </section>
          )}

          {/* Content blocks */}
          {content.map((block, index) => (
            <ContentBlockRenderer
              key={block.id}
              block={block}
              index={index}
              enableAnimations={mergedFeatures.enableAnimations}
            />
          ))}

          {/* Custom children content */}
          {children}
        </main>

        {/* Footer */}
        {mergedFeatures.showFooter && <Footer />}
      </div>
    </>
  );
}

/**
 * Content Block Renderer
 * 
 * Renders different types of content blocks with consistent styling
 * and animation support.
 */
function ContentBlockRenderer({
  block,
  index,
  enableAnimations,
}: {
  block: ContentBlock;
  index: number;
  enableAnimations: boolean;
}) {
  const baseClasses = getBlockClasses(block);
  const animationProps = enableAnimations && block.animations?.enabled
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: block.animations.delay ?? index * 0.1 },
        viewport: { once: true },
      }
    : {};

  // Dynamic render based on block type
  return (
    <motion.section className={baseClasses} {...animationProps}>
      <div className="mx-auto max-w-7xl">
        {/* Content will be rendered based on block type */}
        <div data-block-type={block.type} data-block-id={block.id}>
          {/* Placeholder for now - will be enhanced with specific block components */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">{block.type.toUpperCase()} Block</h2>
            <p className="text-bw-text-secondary">Block ID: {block.id}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/**
 * Utility functions for styling
 */
function getLayoutClasses(layout: string): string {
  switch (layout) {
    case 'service':
      return 'pt-20'; // Account for fixed header
    case 'landing':
      return 'pt-0'; // Full-screen landing
    case 'content':
      return 'pt-20 max-w-4xl mx-auto px-6';
    default:
      return 'pt-20';
  }
}

function getBlockClasses(block: ContentBlock): string {
  const { styling } = block;
  let classes = 'relative ';

  // Background
  switch (styling?.background) {
    case 'secondary':
      classes += 'bg-bw-bg-secondary ';
      break;
    case 'gradient':
      classes += 'bg-gradient-to-br from-bw-aurora-teal to-bw-aurora-green ';
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
      classes += 'py-16 px-6 ';
      break;
    case 'loose':
      classes += 'py-32 px-6 ';
      break;
    default:
      classes += 'py-24 px-6 ';
  }

  // Alignment
  switch (styling?.alignment) {
    case 'center':
      classes += 'text-center ';
      break;
    case 'right':
      classes += 'text-right ';
      break;
    default:
      classes += 'text-left ';
  }

  return classes;
}


