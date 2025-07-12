/**
 * SEO Content Analyzer
 *
 * Analyzes content for SEO optimization opportunities
 * including keyword density, heading structure, and readability
 */

import { SEOIssue } from './types';

// Content analysis types
export interface ContentAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  keywordAnalysis: KeywordAnalysis;
  headingStructure: HeadingAnalysis;
  readability: ReadabilityAnalysis;
  technicalSEO: TechnicalSEOAnalysis;
}

export interface KeywordAnalysis {
  primaryKeyword: string | undefined;
  keywordDensity: number;
  keywordVariations: string[];
  relatedKeywords: string[];
  keywordPlacement: {
    inTitle: boolean;
    inHeadings: boolean;
    inFirstParagraph: boolean;
    inMetaDescription: boolean;
  };
}

export interface HeadingAnalysis {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  structure: Array<{
    level: number;
    text: string;
    hasKeyword: boolean;
  }>;
  issues: string[];
}

export interface ReadabilityAnalysis {
  fleschScore: number;
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;
  readingLevel: string;
  suggestions: string[];
}

export interface TechnicalSEOAnalysis {
  wordCount: number;
  imageCount: number;
  imagesWithAlt: number;
  internalLinks: number;
  externalLinks: number;
  metaDescriptionLength: number;
  titleLength: number;
}

// Morocco-specific keywords for BlackWoods Creative
export const MOROCCO_KEYWORDS = {
  primary: [
    'video production morocco',
    'photography morocco',
    '3d visualization morocco',
    'creative studio morocco',
  ],
  secondary: [
    'film production casablanca',
    'corporate video morocco',
    'architectural visualization morocco',
    'brand film morocco',
    'commercial photography morocco',
    'product photography morocco',
  ],
  local: ['mohammedia', 'casablanca', 'rabat', 'marrakech', 'morocco', 'maroc'],
  services: [
    'video production',
    'photography',
    '3d visualization',
    'filmmaking',
    'corporate video',
    'brand film',
    'commercial',
    'architectural visualization',
  ],
};

// Content Analyzer Class
export class SEOContentAnalyzer {
  private content: string;
  private metadata: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  constructor(
    content: string,
    metadata: { title?: string; description?: string; keywords?: string[] } = {}
  ) {
    this.content = content;
    this.metadata = metadata;
  }

  // Main analysis method
  analyze(targetKeyword?: string): ContentAnalysis {
    const issues: SEOIssue[] = [];
    const recommendations: string[] = [];

    // Analyze different aspects
    const keywordAnalysis = this.analyzeKeywords(targetKeyword);
    const headingStructure = this.analyzeHeadings();
    const readability = this.analyzeReadability();
    const technicalSEO = this.analyzeTechnicalSEO();

    // Calculate overall score
    let score = 100;

    // Deduct points for issues
    if (headingStructure.h1Count !== 1) {
      score -= 10;
      issues.push({
        type: 'error',
        category: 'structure',
        message: `Found ${headingStructure.h1Count} H1 tags. Should have exactly 1.`,
        impact: 'high',
        fix: 'Ensure there is exactly one H1 tag per page.',
      });
    }

    if (technicalSEO.wordCount < 300) {
      score -= 15;
      issues.push({
        type: 'warning',
        category: 'content',
        message: `Content is too short (${technicalSEO.wordCount} words). Minimum 300 words recommended.`,
        impact: 'medium',
        fix: 'Add more valuable content to reach at least 300 words.',
      });
    }

    if (keywordAnalysis.keywordDensity < 0.5 || keywordAnalysis.keywordDensity > 3) {
      score -= 10;
      issues.push({
        type: 'warning',
        category: 'keywords',
        message: `Keyword density is ${keywordAnalysis.keywordDensity.toFixed(1)}%. Optimal range is 0.5-3%.`,
        impact: 'medium',
        fix: 'Adjust keyword usage to achieve optimal density.',
      });
    }

    if (technicalSEO.imageCount > 0 && technicalSEO.imagesWithAlt / technicalSEO.imageCount < 0.8) {
      score -= 8;
      issues.push({
        type: 'warning',
        category: 'technical',
        message: `${technicalSEO.imageCount - technicalSEO.imagesWithAlt} images missing alt text.`,
        impact: 'medium',
        fix: 'Add descriptive alt text to all images.',
      });
    }

    // Generate recommendations
    if (keywordAnalysis.primaryKeyword && !keywordAnalysis.keywordPlacement.inTitle) {
      recommendations.push('Include the primary keyword in the page title.');
    }

    if (keywordAnalysis.primaryKeyword && !keywordAnalysis.keywordPlacement.inFirstParagraph) {
      recommendations.push('Include the primary keyword in the first paragraph.');
    }

    if (technicalSEO.internalLinks < 3) {
      recommendations.push('Add more internal links to improve site navigation and SEO.');
    }

    if (readability.fleschScore < 60) {
      recommendations.push('Improve readability by using shorter sentences and simpler words.');
    }

    // Morocco-specific recommendations
    const hasLocalKeywords = this.hasLocalKeywords();
    if (!hasLocalKeywords) {
      recommendations.push('Include Morocco-specific keywords to improve local search visibility.');
    }

    return {
      score: Math.max(0, score),
      issues,
      recommendations,
      keywordAnalysis,
      headingStructure,
      readability,
      technicalSEO,
    };
  }

  // Analyze keywords
  private analyzeKeywords(targetKeyword?: string): KeywordAnalysis {
    const words = this.extractWords(this.content);
    const totalWords = words.length;

    const primaryKeyword = targetKeyword;
    let keywordDensity = 0;

    if (primaryKeyword) {
      const keywordOccurrences = this.countKeywordOccurrences(this.content, primaryKeyword);
      keywordDensity = (keywordOccurrences / totalWords) * 100;
    }

    // Find keyword variations and related keywords
    const keywordVariations = this.findKeywordVariations(primaryKeyword ?? '');
    const relatedKeywords = this.findRelatedKeywords();

    // Check keyword placement
    const keywordPlacement = {
      inTitle: primaryKeyword
        ? (this.metadata.title?.toLowerCase().includes(primaryKeyword.toLowerCase()) ?? false)
        : false,
      inHeadings: primaryKeyword ? this.hasKeywordInHeadings(primaryKeyword) : false,
      inFirstParagraph: primaryKeyword ? this.hasKeywordInFirstParagraph(primaryKeyword) : false,
      inMetaDescription: primaryKeyword
        ? (this.metadata.description?.toLowerCase().includes(primaryKeyword.toLowerCase()) ?? false)
        : false,
    };

    return {
      primaryKeyword,
      keywordDensity,
      keywordVariations,
      relatedKeywords,
      keywordPlacement,
    };
  }

  // Analyze heading structure
  private analyzeHeadings(): HeadingAnalysis {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = [];
    let match;

    let h1Count = 0;
    let h2Count = 0;
    let h3Count = 0;

    while ((match = headingRegex.exec(this.content)) !== null) {
      const level = parseInt(match[1] ?? '1', 10);
      const text = (match[2] ?? '').replace(/<[^>]*>/g, '').trim();

      headings.push({
        level,
        text,
        hasKeyword: false, // Will be updated based on keyword analysis
      });

      if (level === 1) h1Count++;
      if (level === 2) h2Count++;
      if (level === 3) h3Count++;
    }

    const issues = [];
    if (h1Count === 0) {
      issues.push('Missing H1 tag');
    } else if (h1Count > 1) {
      issues.push('Multiple H1 tags found');
    }

    return {
      h1Count,
      h2Count,
      h3Count,
      structure: headings,
      issues,
    };
  }

  // Analyze readability
  private analyzeReadability(): ReadabilityAnalysis {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = this.extractWords(this.content);

    const averageWordsPerSentence = words.length / sentences.length;
    const averageSyllablesPerWord = this.calculateAverageSyllables(words);

    // Flesch Reading Ease Score
    const fleschScore = 206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord;

    let readingLevel = 'Graduate';
    if (fleschScore >= 90) readingLevel = 'Very Easy';
    else if (fleschScore >= 80) readingLevel = 'Easy';
    else if (fleschScore >= 70) readingLevel = 'Fairly Easy';
    else if (fleschScore >= 60) readingLevel = 'Standard';
    else if (fleschScore >= 50) readingLevel = 'Fairly Difficult';
    else if (fleschScore >= 30) readingLevel = 'Difficult';

    const suggestions = [];
    if (averageWordsPerSentence > 20) {
      suggestions.push('Use shorter sentences (aim for 15-20 words per sentence)');
    }
    if (fleschScore < 60) {
      suggestions.push('Use simpler words and shorter sentences to improve readability');
    }

    return {
      fleschScore,
      averageWordsPerSentence,
      averageSyllablesPerWord,
      readingLevel,
      suggestions,
    };
  }

  // Analyze technical SEO factors
  private analyzeTechnicalSEO(): TechnicalSEOAnalysis {
    const words = this.extractWords(this.content);
    const imageRegex = /<img[^>]*>/gi;
    const altRegex = /alt\s*=\s*["'][^"']*["']/i;
    const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi;

    const images = this.content.match(imageRegex) ?? [];
    const imagesWithAlt = images.filter(img => altRegex.test(img));

    let internalLinks = 0;
    let externalLinks = 0;
    let match;

    while ((match = linkRegex.exec(this.content)) !== null) {
      const href = match[1];
      if (href && href.startsWith('http') && !href.includes('blackwoodscreative.com')) {
        externalLinks++;
      } else if (href && (href.startsWith('/') || href.includes('blackwoodscreative.com'))) {
        internalLinks++;
      }
    }

    return {
      wordCount: words.length,
      imageCount: images.length,
      imagesWithAlt: imagesWithAlt.length,
      internalLinks,
      externalLinks,
      metaDescriptionLength: this.metadata.description?.length ?? 0,
      titleLength: this.metadata.title?.length ?? 0,
    };
  }

  // Helper methods
  private extractWords(text: string): string[] {
    return (
      text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .toLowerCase()
        .match(/\b\w+\b/g) ?? []
    );
  }

  private countKeywordOccurrences(text: string, keyword: string): number {
    // Validate keyword length and content for security
    if (!keyword || keyword.length > 100 || !/^[a-zA-Z0-9\s\-_]+$/.test(keyword)) {
      return 0;
    }

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(escapedKeyword, 'gi');
    return (text.match(regex) ?? []).length;
  }

  private findKeywordVariations(keyword: string): string[] {
    // Simple keyword variation logic
    const variations = [];
    if (keyword.includes('video production')) {
      variations.push('video production', 'film production', 'videography');
    }
    if (keyword.includes('morocco')) {
      variations.push('morocco', 'maroc', 'moroccan');
    }
    return variations;
  }

  private findRelatedKeywords(): string[] {
    const content = this.content.toLowerCase();
    const relatedKeywords: string[] = [];

    // Check for Morocco-specific keywords
    MOROCCO_KEYWORDS.primary.forEach(keyword => {
      if (content.includes(keyword)) {
        relatedKeywords.push(keyword);
      }
    });

    return relatedKeywords;
  }

  private hasKeywordInHeadings(keyword: string): boolean {
    const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    let match;
    while ((match = headingRegex.exec(this.content)) !== null) {
      if (match[1]?.toLowerCase().includes(keyword.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  private hasKeywordInFirstParagraph(keyword: string): boolean {
    const paragraphs = this.content.split(/<\/p>/i);
    if (paragraphs.length > 0 && paragraphs[0]) {
      const firstParagraph = paragraphs[0].replace(/<[^>]*>/g, '');
      return firstParagraph.toLowerCase().includes(keyword.toLowerCase());
    }
    return false;
  }

  private hasLocalKeywords(): boolean {
    const content = this.content.toLowerCase();
    return MOROCCO_KEYWORDS.local.some(keyword => content.includes(keyword));
  }

  private calculateAverageSyllables(words: string[]): number {
    const totalSyllables = words.reduce((total, word) => {
      return total + this.countSyllables(word);
    }, 0);
    return totalSyllables / words.length;
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }
}
