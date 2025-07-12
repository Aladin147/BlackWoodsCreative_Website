/**
 * Simple Content Renderer
 *
 * Simplified content rendering components without over-engineering
 */

'use client';

import { ReactNode } from 'react';

import Image from 'next/image';

import {
  useTextContent,
  useImageContent,
  usePortfolioItems,
  useTestimonials,
  useServices,
  useTeamMembers,
} from '@/lib/content/simple-hooks';

// Base content renderer props
interface ContentRendererProps {
  id: string;
  className?: string;
  fallback?: ReactNode;
  showPlaceholderIndicator?: boolean;
}

// Text content renderer
export function TextRenderer({
  id,
  className = '',
  fallback = 'Loading...',
  showPlaceholderIndicator = false,
}: ContentRendererProps) {
  const { content, loading, isPlaceholder } = useTextContent(id);

  if (loading) {
    return <div className={className}>{fallback}</div>;
  }

  if (!content) {
    return <div className={className}>Content not found</div>;
  }

  return (
    <div className={className}>
      {content.content}
      {showPlaceholderIndicator && isPlaceholder && (
        <span className="ml-2 text-xs text-yellow-500">[Placeholder]</span>
      )}
    </div>
  );
}

// Image content renderer
export function ImageRenderer({
  id,
  className = '',
  fallback = 'Loading...',
  showPlaceholderIndicator = false,
}: ContentRendererProps) {
  const { content, loading, isPlaceholder } = useImageContent(id);

  if (loading) {
    return <div className={className}>{fallback}</div>;
  }

  if (!content?.image) {
    return <div className={className}>Image not found</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <Image src={content.image} alt={content.alt ?? content.title} fill className="object-cover" />
      {showPlaceholderIndicator && isPlaceholder && (
        <div className="absolute right-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs text-black">
          Placeholder
        </div>
      )}
    </div>
  );
}

// Portfolio grid renderer
export function PortfolioGrid({
  className = '',
  showPlaceholderIndicator = false,
  limit,
  category,
}: {
  className?: string;
  showPlaceholderIndicator?: boolean;
  limit?: number;
  category?: 'film' | 'photography' | '3d' | 'scenes';
}) {
  const { content: portfolioItems, loading } = usePortfolioItems();

  if (loading) {
    return <div className={className}>Loading portfolio...</div>;
  }

  let filteredItems = portfolioItems;

  if (category) {
    filteredItems = portfolioItems.filter(item => item.category === category);
  }

  if (limit) {
    filteredItems = filteredItems.slice(0, limit);
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {filteredItems.map(item => (
        <div key={item.id} className="group relative">
          <div className="aspect-video overflow-hidden rounded-lg bg-gray-200">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                {item.title}
              </div>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.content}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs capitalize text-gray-500">{item.category}</span>
              {showPlaceholderIndicator && item.isPlaceholder && (
                <span className="text-xs text-yellow-500">[Placeholder]</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Testimonials renderer
export function TestimonialsGrid({
  className = '',
  showPlaceholderIndicator = false,
  limit,
}: {
  className?: string;
  showPlaceholderIndicator?: boolean;
  limit?: number;
}) {
  const { content: testimonials, loading } = useTestimonials();

  if (loading) {
    return <div className={className}>Loading testimonials...</div>;
  }

  const displayedTestimonials = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {displayedTestimonials.map(testimonial => (
        <div key={testimonial.id} className="rounded-lg bg-white p-6 shadow-md">
          <blockquote className="mb-4 text-gray-700">
            &ldquo;{testimonial.content}&rdquo;
          </blockquote>
          <div className="flex items-center">
            <div>
              <div className="font-semibold">{testimonial.author}</div>
              {testimonial.position && (
                <div className="text-sm text-gray-500">{testimonial.position}</div>
              )}
              {testimonial.company && (
                <div className="text-sm text-gray-500">{testimonial.company}</div>
              )}
            </div>
            {showPlaceholderIndicator && testimonial.isPlaceholder && (
              <span className="ml-auto text-xs text-yellow-500">[Placeholder]</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Services grid renderer
export function ServicesGrid({
  className = '',
  showPlaceholderIndicator = false,
}: {
  className?: string;
  showPlaceholderIndicator?: boolean;
}) {
  const { content: services, loading } = useServices();

  if (loading) {
    return <div className={className}>Loading services...</div>;
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {services.map(service => (
        <div key={service.id} className="rounded-lg bg-white p-6 text-center shadow-md">
          {service.icon && <div className="mb-4 text-4xl">{service.icon}</div>}
          <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
          <p className="text-sm text-gray-600">{service.content}</p>
          {service.features && (
            <ul className="mt-4 text-sm text-gray-500">
              {service.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          )}
          {showPlaceholderIndicator && service.isPlaceholder && (
            <div className="mt-2">
              <span className="text-xs text-yellow-500">[Placeholder]</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Team grid renderer
export function TeamGrid({
  className = '',
  showPlaceholderIndicator = false,
}: {
  className?: string;
  showPlaceholderIndicator?: boolean;
}) {
  const { content: teamMembers, loading } = useTeamMembers();

  if (loading) {
    return <div className={className}>Loading team...</div>;
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {teamMembers.map(member => (
        <div key={member.id} className="text-center">
          <div className="mx-auto mb-4 aspect-square h-32 w-32 overflow-hidden rounded-full bg-gray-200">
            {member.image ? (
              <Image src={member.image} alt={member.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                {member.title.charAt(0)}
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold">{member.title}</h3>
          <p className="text-sm text-gray-600">{member.position}</p>
          {member.bio && <p className="mt-2 text-xs text-gray-500">{member.bio}</p>}
          {showPlaceholderIndicator && member.isPlaceholder && (
            <div className="mt-2">
              <span className="text-xs text-yellow-500">[Placeholder]</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Generic content renderer
export function ContentRenderer({
  id,
  type,
  className = '',
  showPlaceholderIndicator = false,
}: ContentRendererProps & { type: 'text' | 'image' }) {
  if (type === 'text') {
    return (
      <TextRenderer
        id={id}
        className={className}
        showPlaceholderIndicator={showPlaceholderIndicator}
      />
    );
  }

  if (type === 'image') {
    return (
      <ImageRenderer
        id={id}
        className={className}
        showPlaceholderIndicator={showPlaceholderIndicator}
      />
    );
  }

  return <div>Unknown content type</div>;
}
