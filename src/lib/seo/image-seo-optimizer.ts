/**
 * Image SEO Optimizer
 *
 * Utilities for optimizing images for search engines
 * including alt text generation and image schema markup
 */

// Image SEO types
export interface ImageSEOData {
  src: string;
  alt: string;
  title?: string | undefined;
  caption?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  format?: string | undefined;
  fileSize?: number | undefined;
  keywords?: string[] | undefined;
}

export interface ImageSchemaMarkup {
  '@context': string;
  '@type': string;
  contentUrl: string;
  name: string;
  description: string;
  width?: number;
  height?: number;
  encodingFormat?: string;
  keywords?: string;
  creator?: {
    '@type': string;
    name: string;
  };
}

// Morocco-specific image keywords
export const MOROCCO_IMAGE_KEYWORDS = {
  locations: ['morocco', 'casablanca', 'rabat', 'mohammedia', 'marrakech', 'moroccan'],
  services: [
    'video production',
    'photography',
    '3d visualization',
    'filmmaking',
    'corporate video',
    'brand film',
    'commercial photography',
    'architectural visualization',
  ],
  business: ['blackwoods creative', 'creative studio', 'professional', 'premium', 'high quality'],
};

// Image SEO Optimizer Class
export class ImageSEOOptimizer {
  private baseUrl: string;

  constructor(baseUrl = 'https://blackwoodscreative.com') {
    this.baseUrl = baseUrl;
  }

  // Generate SEO-optimized alt text
  generateAltText(
    imageContext: {
      type: 'portfolio' | 'service' | 'team' | 'general';
      subject: string;
      location?: string | undefined;
      service?: string | undefined;
      client?: string | undefined;
    },
    options: {
      includeLocation?: boolean;
      includeService?: boolean;
      includeBrand?: boolean;
      maxLength?: number;
    } = {}
  ): string {
    const {
      includeLocation = true,
      includeService = true,
      includeBrand = true,
      maxLength = 125,
    } = options;

    let altText = '';

    // Start with the main subject
    altText = imageContext.subject;

    // Add service context
    if (includeService && imageContext.service) {
      altText = `${imageContext.service} - ${altText}`;
    }

    // Add location context for Morocco market
    if (includeLocation && imageContext.location) {
      altText += ` in ${imageContext.location}`;
    } else if (includeLocation) {
      altText += ' in Morocco';
    }

    // Add client context for portfolio items
    if (imageContext.client) {
      altText += ` for ${imageContext.client}`;
    }

    // Add brand context
    if (includeBrand) {
      altText = `${altText} by BlackWoods Creative`;
    }

    // Ensure it's not too long
    if (altText.length > maxLength) {
      altText = `${altText.substring(0, maxLength - 3)}...`;
    }

    return altText;
  }

  // Generate image schema markup
  generateImageSchema(imageData: ImageSEOData): ImageSchemaMarkup {
    const schema: ImageSchemaMarkup = {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: imageData.src.startsWith('http')
        ? imageData.src
        : `${this.baseUrl}${imageData.src}`,
      name: imageData.title ?? imageData.alt,
      description: imageData.caption ?? imageData.alt,
    };

    // Add optional properties
    if (imageData.width) schema.width = imageData.width;
    if (imageData.height) schema.height = imageData.height;
    if (imageData.format) schema.encodingFormat = imageData.format;
    if (imageData.keywords) schema.keywords = imageData.keywords.join(', ');

    // Add creator information
    schema.creator = {
      '@type': 'Organization',
      name: 'BlackWoods Creative',
    };

    return schema;
  }

  // Optimize portfolio image alt text
  optimizePortfolioImageAlt(
    projectTitle: string,
    category: 'film' | 'photography' | '3d' | 'scenes',
    client?: string,
    location?: string
  ): string {
    const serviceMap = {
      film: 'Video Production',
      photography: 'Photography',
      '3d': '3D Visualization',
      scenes: 'Scene Creation',
    };

    return this.generateAltText(
      {
        type: 'portfolio',
        subject: projectTitle,
        service: serviceMap[category],
        client,
        location,
      },
      {
        includeLocation: true,
        includeService: true,
        includeBrand: true,
      }
    );
  }

  // Optimize service page image alt text
  optimizeServiceImageAlt(
    serviceName: string,
    imageDescription: string,
    location = 'Morocco'
  ): string {
    return this.generateAltText(
      {
        type: 'service',
        subject: imageDescription,
        service: serviceName,
        location,
      },
      {
        includeLocation: true,
        includeService: true,
        includeBrand: true,
      }
    );
  }

  // Optimize team member image alt text
  optimizeTeamImageAlt(memberName: string, role: string, includeCompany = true): string {
    let altText = `${memberName}, ${role}`;

    if (includeCompany) {
      altText = `${altText} at BlackWoods Creative`;
    }

    return altText;
  }

  // Generate comprehensive image SEO data
  generateComprehensiveImageSEO(
    src: string,
    context: {
      type: 'portfolio' | 'service' | 'team' | 'general';
      title: string;
      description?: string | undefined;
      category?: string | undefined;
      location?: string | undefined;
      client?: string | undefined;
      keywords?: string[] | undefined;
    }
  ): ImageSEOData {
    // Generate optimized alt text
    let alt = '';
    switch (context.type) {
      case 'portfolio':
        alt = this.optimizePortfolioImageAlt(
          context.title,
          context.category as 'film' | 'photography' | '3d' | 'scenes',
          context.client,
          context.location
        );
        break;
      case 'service':
        alt = this.optimizeServiceImageAlt(
          context.category ?? 'Creative Services',
          context.title,
          context.location
        );
        break;
      case 'team':
        alt = this.optimizeTeamImageAlt(context.title, context.description ?? 'Team Member');
        break;
      default:
        alt = this.generateAltText({
          type: 'general',
          subject: context.title,
          location: context.location,
        });
    }

    // Generate keywords
    const keywords = this.generateImageKeywords(context);

    return {
      src,
      alt,
      title: context.title,
      caption: context.description,
      keywords,
    };
  }

  // Generate relevant keywords for images
  private generateImageKeywords(context: {
    type: string;
    category?: string | undefined;
    location?: string | undefined;
    keywords?: string[] | undefined;
  }): string[] {
    const keywords: string[] = [];

    // Add base keywords
    keywords.push(...MOROCCO_IMAGE_KEYWORDS.business);

    // Add location keywords
    if (context.location) {
      keywords.push(context.location.toLowerCase());
    }
    keywords.push(...MOROCCO_IMAGE_KEYWORDS.locations);

    // Add service keywords based on category
    if (context.category) {
      const categoryLower = context.category.toLowerCase();
      if (categoryLower.includes('video') || categoryLower.includes('film')) {
        keywords.push('video production', 'filmmaking', 'corporate video');
      }
      if (categoryLower.includes('photo')) {
        keywords.push('photography', 'commercial photography', 'professional photography');
      }
      if (categoryLower.includes('3d')) {
        keywords.push('3d visualization', 'architectural visualization', '3d modeling');
      }
    }

    // Add custom keywords
    if (context.keywords) {
      keywords.push(...context.keywords);
    }

    // Remove duplicates and return
    return Array.from(new Set(keywords));
  }

  // Validate image SEO
  validateImageSEO(imageData: ImageSEOData): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check alt text
    if (!imageData.alt) {
      issues.push('Missing alt text');
    } else {
      if (imageData.alt.length < 10) {
        issues.push('Alt text too short (minimum 10 characters)');
      }
      if (imageData.alt.length > 125) {
        issues.push('Alt text too long (maximum 125 characters)');
      }
      if (
        !imageData.alt.toLowerCase().includes('morocco') &&
        !imageData.alt.toLowerCase().includes('blackwoods')
      ) {
        recommendations.push('Consider including location or brand keywords in alt text');
      }
    }

    // Check title
    if (!imageData.title) {
      recommendations.push('Add title attribute for better accessibility');
    }

    // Check dimensions
    if (!imageData.width || !imageData.height) {
      recommendations.push('Include width and height attributes for better performance');
    }

    // Check keywords
    if (!imageData.keywords || imageData.keywords.length === 0) {
      recommendations.push('Add relevant keywords for better search visibility');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
    };
  }

  // Generate image sitemap entry
  generateImageSitemapEntry(imageData: ImageSEOData, pageUrl: string): object {
    return {
      loc: pageUrl,
      image: {
        loc: imageData.src.startsWith('http') ? imageData.src : `${this.baseUrl}${imageData.src}`,
        caption: imageData.caption ?? imageData.alt,
        title: imageData.title ?? imageData.alt,
        ...(imageData.keywords && { keywords: imageData.keywords.join(', ') }),
      },
    };
  }
}

// Export singleton instance
export const imageSEOOptimizer = new ImageSEOOptimizer();

// Utility functions for common use cases
export function optimizePortfolioImage(
  src: string,
  title: string,
  category: 'film' | 'photography' | '3d' | 'scenes',
  client?: string,
  location?: string
): ImageSEOData {
  return imageSEOOptimizer.generateComprehensiveImageSEO(src, {
    type: 'portfolio',
    title,
    category,
    client,
    location,
  });
}

export function optimizeServiceImage(
  src: string,
  title: string,
  serviceName: string,
  location = 'Morocco'
): ImageSEOData {
  return imageSEOOptimizer.generateComprehensiveImageSEO(src, {
    type: 'service',
    title,
    category: serviceName,
    location,
  });
}

export function optimizeTeamImage(src: string, name: string, role: string): ImageSEOData {
  return imageSEOOptimizer.generateComprehensiveImageSEO(src, {
    type: 'team',
    title: name,
    description: role,
  });
}
