// Page Templates Barrel Export
// This file exports all page templates for clean imports

export { BasePageTemplate, type ContentBlock, type PageTemplateProps } from './BasePageTemplate';

export { type SEOMetadata, generatePageMetadata } from '@/lib/utils/metadata';

export {
  ServicePageTemplate,
  type ServicePageData,
  type ServicePageTemplateProps,
} from './ServicePageTemplate';

export {
  ContentPageTemplate,
  type ContentPageData,
  type ContentPageTemplateProps,
  type ContentSection,
  type HeroData,
  type TextData,
  type TimelineData,
  type ValuesData,
} from './ContentPageTemplate';

// Future template exports:
// export { LandingPageTemplate } from './LandingPageTemplate';
// export { BlogPageTemplate } from './BlogPageTemplate';
