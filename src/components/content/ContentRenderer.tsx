/**
 * Content Renderer Components
 * 
 * React components for rendering content with placeholder fallbacks
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ReactNode } from 'react';

import {
  useContent,
  useTextContent,
  useImageContent,
  useVideoContent,
  UseContentOptions 
} from '@/lib/content/hooks';
import {
  PortfolioContent,
  TestimonialContent,
  ServiceContent,
  TeamContent,
} from '@/lib/content/placeholder-system';

// Base content renderer props
interface ContentRendererProps {
  id: string;
  className?: string;
  fallback?: ReactNode;
  showPlaceholderIndicator?: boolean;
  options?: UseContentOptions;
}

// Loading component
const ContentLoading = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

// Placeholder indicator
const PlaceholderIndicator = ({ type, id }: { type: string; id: string }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded z-10">
      📝 {type}: {id}
    </div>
  );
};

// Text content renderer
export function TextRenderer({ 
  id, 
  className = '', 
  fallback, 
  showPlaceholderIndicator = true,
  options 
}: ContentRendererProps) {
  const { content, loading, error, isPlaceholder } = useTextContent(id, options);

  if (loading) {
    return <ContentLoading className={className} />;
  }

  if (error || !content) {
    return fallback ?? <div className={className}>Content not available</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Text" id={id} />
      )}
      {typeof content.content === 'string' ? (
        content.format === 'html' ? (
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        ) : (
          <div className="whitespace-pre-wrap">{content.content}</div>
        )
      ) : (
        content.content
      )}
    </div>
  );
}

// Image content renderer
export function ImageRenderer({ 
  id, 
  className = '', 
  fallback, 
  showPlaceholderIndicator = true,
  options,
  ...imageProps 
}: ContentRendererProps & {
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const { content, loading, error, isPlaceholder } = useImageContent(id, options);

  if (loading) {
    return <ContentLoading className={`aspect-video ${className}`} />;
  }

  if (error || !content) {
    return fallback ?? (
      <div className={`bg-gray-200 aspect-video flex items-center justify-center ${className}`}>
        Image not available
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Image" id={id} />
      )}
      <Image
        src={content.src}
        alt={content.alt}
        width={imageProps.width ?? content.width ?? 800}
        height={imageProps.height ?? content.height ?? 600}
        priority={imageProps.priority ?? content.priority}
        sizes={imageProps.sizes ?? content.sizes}
        placeholder={content.blurDataURL ? 'blur' : 'empty'}
        blurDataURL={content.blurDataURL}
        className="w-full h-full object-cover"
      />
      {content.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
          {content.caption}
        </div>
      )}
    </div>
  );
}

// Video content renderer
export function VideoRenderer({ 
  id, 
  className = '', 
  fallback, 
  showPlaceholderIndicator = true,
  options 
}: ContentRendererProps) {
  const { content, loading, error, isPlaceholder } = useVideoContent(id, options);

  if (loading) {
    return <ContentLoading className={`aspect-video ${className}`} />;
  }

  if (error || !content) {
    return fallback ?? (
      <div className={`bg-gray-200 aspect-video flex items-center justify-center ${className}`}>
        Video not available
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Video" id={id} />
      )}
      <video
        src={content.src}
        poster={content.poster}
        autoPlay={content.autoplay}
        muted={content.muted}
        controls={content.controls}
        className="w-full h-full object-cover"
      >
        <track kind="captions" src="" label="English" default />
        Your browser does not support the video tag.
      </video>
      {content.duration && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-sm rounded">
          {content.duration}
        </div>
      )}
    </div>
  );
}

// Portfolio item renderer
export function PortfolioRenderer({ 
  content, 
  className = '',
  showPlaceholderIndicator = true 
}: { 
  content: PortfolioContent; 
  className?: string;
  showPlaceholderIndicator?: boolean;
}) {
  const isPlaceholder = content.status === 'placeholder';

  return (
    <motion.div
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Portfolio" id={content.id} />
      )}
      
      {/* Main image */}
      {content.images.length > 0 && content.images[0] && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={content.images[0].src}
            alt={content.images[0].alt}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
            {content.category}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{content.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{content.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {content.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta info */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{content.client}</span>
          <span>{content.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Testimonial renderer
export function TestimonialRenderer({ 
  content, 
  className = '',
  showPlaceholderIndicator = true 
}: { 
  content: TestimonialContent; 
  className?: string;
  showPlaceholderIndicator?: boolean;
}) {
  const isPlaceholder = content.status === 'placeholder';

  return (
    <div className={`relative bg-white p-6 rounded-lg shadow-lg ${className}`}>
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Testimonial" id={content.id} />
      )}
      
      {/* Quote */}
      <div className="mb-4">
        <div className="text-4xl text-gray-300 mb-2">&ldquo;</div>
        <p className="text-gray-700 italic">{content.content}</p>
      </div>

      {/* Rating */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < content.rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center">
        {content.image && (
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image
              src={content.image.src}
              alt={content.image.alt}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="font-semibold">{content.name}</div>
          <div className="text-sm text-gray-600">
            {content.role} at {content.company}
          </div>
        </div>
      </div>
    </div>
  );
}

// Service renderer
export function ServiceRenderer({ 
  content, 
  className = '',
  showPlaceholderIndicator = true 
}: { 
  content: ServiceContent; 
  className?: string;
  showPlaceholderIndicator?: boolean;
}) {
  const isPlaceholder = content.status === 'placeholder';

  return (
    <div className={`relative bg-white p-6 rounded-lg shadow-lg ${className}`}>
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Service" id={content.id} />
      )}
      
      {/* Icon */}
      {content.icon && (
        <div className="text-4xl mb-4">{content.icon}</div>
      )}

      {/* Title and description */}
      <h3 className="text-xl font-bold mb-2">{content.name}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-4">
        {content.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Pricing */}
      {content.pricing && (
        <div className="text-lg font-semibold text-blue-600">
          {content.pricing.startingPrice}
        </div>
      )}

      {/* Popular badge */}
      {content.popular && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          Popular
        </div>
      )}
    </div>
  );
}

// Team member renderer
export function TeamRenderer({ 
  content, 
  className = '',
  showPlaceholderIndicator = true 
}: { 
  content: TeamContent; 
  className?: string;
  showPlaceholderIndicator?: boolean;
}) {
  const isPlaceholder = content.status === 'placeholder';

  return (
    <div className={`relative bg-white p-6 rounded-lg shadow-lg text-center ${className}`}>
      {showPlaceholderIndicator && isPlaceholder && (
        <PlaceholderIndicator type="Team" id={content.id} />
      )}
      
      {/* Photo */}
      {content.image && (
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Name and role */}
      <h3 className="text-xl font-bold mb-1">{content.name}</h3>
      <p className="text-blue-600 font-medium mb-3">{content.role}</p>

      {/* Bio */}
      <p className="text-gray-600 text-sm mb-4">{content.bio}</p>

      {/* Skills */}
      {content.skills && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {content.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Social links */}
      {content.social && (
        <div className="flex justify-center space-x-3">
          {content.social.linkedin && (
            <a href={content.social.linkedin} className="text-blue-600 hover:text-blue-800">
              LinkedIn
            </a>
          )}
          {content.social.instagram && (
            <a href={content.social.instagram} className="text-pink-600 hover:text-pink-800">
              Instagram
            </a>
          )}
          {content.social.website && (
            <a href={content.social.website} className="text-gray-600 hover:text-gray-800">
              Website
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Generic content renderer
export function ContentRenderer({ 
  id, 
  className = '', 
  fallback, 
  showPlaceholderIndicator = true,
  options 
}: ContentRendererProps) {
  const { content, loading, error, isPlaceholder } = useContent(id, options);

  if (loading) {
    return <ContentLoading className={className} />;
  }

  if (error || !content) {
    return fallback ?? <div className={className}>Content not available</div>;
  }

  // Render based on content type
  switch (content.type) {
    case 'text':
      return (
        <TextRenderer
          id={id}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
          {...(options && { options })}
        />
      );
    
    case 'image':
      return (
        <ImageRenderer
          id={id}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
          {...(options && { options })}
        />
      );
    
    case 'video':
      return (
        <VideoRenderer
          id={id}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
          {...(options && { options })}
        />
      );
    
    case 'portfolio':
      return (
        <PortfolioRenderer 
          content={content}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
        />
      );
    
    case 'testimonial':
      return (
        <TestimonialRenderer 
          content={content}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
        />
      );
    
    case 'service':
      return (
        <ServiceRenderer 
          content={content}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
        />
      );
    
    case 'team':
      return (
        <TeamRenderer 
          content={content}
          className={className}
          showPlaceholderIndicator={showPlaceholderIndicator}
        />
      );
    
    default:
      return (
        <div className={`relative ${className}`}>
          {showPlaceholderIndicator && isPlaceholder && (
            <PlaceholderIndicator type="Unknown" id={id} />
          )}
          <div>Unsupported content type: {content.type}</div>
        </div>
      );
  }
}
