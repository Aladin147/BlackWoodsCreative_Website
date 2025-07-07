/**
 * Centralized SEO Types
 *
 * Unified type definitions for all SEO-related functionality
 * to prevent type conflicts across components
 */

// Unified SEO Issue interface
export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category:
    | 'content'
    | 'technical'
    | 'keywords'
    | 'structure'
    | 'images'
    | 'performance'
    | 'local'
    | 'title'
    | 'description';
  message: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

// Content Analysis Result interface (for components that need required fix property)
export interface ContentAnalysisResult {
  score: number;
  issues: Array<SEOIssue & { fix: string }>;
  recommendations: string[];
  metrics: {
    wordCount: number;
    keywordDensity: number;
    readabilityScore: number;
    headingStructure: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
    };
  };
}

// SEO Metrics for monitoring dashboard
export interface SEOMetrics {
  pageScore: number;
  technicalSEO: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    structuredData: boolean;
    openGraph: boolean;
    twitterCard: boolean;
  };
  contentSEO: {
    wordCount: number;
    headingStructure: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
    };
    keywordDensity: number;
    readabilityScore: number;
  };
  localSEO: {
    businessSchema: boolean;
    localKeywords: boolean;
    napConsistency: boolean;
    reviewSchema: boolean;
  };
  performance: {
    loadTime: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
}

// Helper function to ensure SEOIssue has required fix property
export function ensureFixProperty(issue: SEOIssue): SEOIssue & { fix: string } {
  return {
    ...issue,
    fix: issue.fix ?? 'No specific fix available',
  };
}

// Helper function to convert SEOIssue array to format with required fix
export function ensureFixProperties(issues: SEOIssue[]): Array<SEOIssue & { fix: string }> {
  return issues.map(ensureFixProperty);
}
