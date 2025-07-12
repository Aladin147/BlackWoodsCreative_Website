/**
 * SEO Monitoring Dashboard
 *
 * Comprehensive SEO performance tracking and monitoring system
 * for BlackWoods Creative website optimization
 */

'use client';

import { useEffect, useState } from 'react';

import { SEOContentAnalyzer } from '@/lib/seo/content-analyzer';
import { SEOIssue, SEOMetrics, ensureFixProperties } from '@/lib/seo/types';

// SEO Metrics Types are now imported from centralized types

export function SEOMonitoringDashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [issues, setIssues] = useState<Array<SEOIssue & { fix: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzePage();
  }, []);

  const analyzePage = () => {
    try {
      setLoading(true);

      // Get page content for analysis
      const pageContent = document.documentElement.outerHTML;
      const metaTitle = document.querySelector('title')?.textContent ?? '';
      const metaDescription =
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

      // Initialize content analyzer
      const analyzer = new SEOContentAnalyzer(pageContent, {
        title: metaTitle,
        description: metaDescription,
      });

      // Analyze content
      const analysis = analyzer.analyze('video production morocco');

      // Check technical SEO elements
      const technicalSEO = {
        metaTitle,
        metaDescription,
        canonicalUrl: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
        structuredData: !!document.querySelector('script[type="application/ld+json"]'),
        openGraph: !!document.querySelector('meta[property^="og:"]'),
        twitterCard: !!document.querySelector('meta[name^="twitter:"]'),
      };

      // Check local SEO elements
      const localSEO = {
        businessSchema:
          pageContent.includes('LocalBusiness') || pageContent.includes('Organization'),
        localKeywords: pageContent.toLowerCase().includes('morocco'),
        napConsistency: pageContent.includes('+212625553768') && pageContent.includes('Mohammedia'),
        reviewSchema: pageContent.includes('AggregateRating') || pageContent.includes('Review'),
      };

      // Mock performance data (in real implementation, use Web Vitals API)
      // Using deterministic values to prevent hydration issues
      const performance = {
        loadTime: 2.3, // Fixed mock value
        coreWebVitals: {
          lcp: 2.1, // Fixed mock value
          fid: 85, // Fixed mock value
          cls: 0.12, // Fixed mock value
        },
      };

      const seoMetrics: SEOMetrics = {
        pageScore: analysis.score,
        technicalSEO,
        contentSEO: {
          wordCount: analysis.technicalSEO.wordCount,
          headingStructure: {
            h1Count: analysis.headingStructure.h1Count,
            h2Count: analysis.headingStructure.h2Count,
            h3Count: analysis.headingStructure.h3Count,
          },
          keywordDensity: analysis.keywordAnalysis.keywordDensity,
          readabilityScore: analysis.readability.fleschScore,
        },
        localSEO,
        performance,
      };

      setMetrics(seoMetrics);
      setIssues(ensureFixProperties(analysis.issues));
    } catch (error) {
      console.error('SEO analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-1/4 rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-3 rounded bg-gray-200" />
            <div className="h-3 w-5/6 rounded bg-gray-200" />
            <div className="h-3 w-4/6 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <p className="text-red-600">Failed to load SEO metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">SEO Performance Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(metrics.pageScore)}`}>
              {metrics.pageScore}
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${metrics.pageScore >= 90 ? 'bg-green-500' : metrics.pageScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${metrics.pageScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Technical SEO */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Technical SEO</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Meta Title:</span>
              <span className={metrics.technicalSEO.metaTitle ? 'text-green-600' : 'text-red-600'}>
                {metrics.technicalSEO.metaTitle ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Meta Description:</span>
              <span
                className={metrics.technicalSEO.metaDescription ? 'text-green-600' : 'text-red-600'}
              >
                {metrics.technicalSEO.metaDescription ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Canonical URL:</span>
              <span
                className={metrics.technicalSEO.canonicalUrl ? 'text-green-600' : 'text-red-600'}
              >
                {metrics.technicalSEO.canonicalUrl ? '✓' : '✗'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Structured Data:</span>
              <span
                className={metrics.technicalSEO.structuredData ? 'text-green-600' : 'text-red-600'}
              >
                {metrics.technicalSEO.structuredData ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Open Graph:</span>
              <span className={metrics.technicalSEO.openGraph ? 'text-green-600' : 'text-red-600'}>
                {metrics.technicalSEO.openGraph ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Twitter Card:</span>
              <span
                className={metrics.technicalSEO.twitterCard ? 'text-green-600' : 'text-red-600'}
              >
                {metrics.technicalSEO.twitterCard ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content SEO */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Content SEO</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.contentSEO.wordCount}</div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.contentSEO.headingStructure.h1Count}/
              {metrics.contentSEO.headingStructure.h2Count}/
              {metrics.contentSEO.headingStructure.h3Count}
            </div>
            <div className="text-sm text-gray-600">H1/H2/H3</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.contentSEO.keywordDensity.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Keyword Density</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.contentSEO.readabilityScore.toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Readability</div>
          </div>
        </div>
      </div>

      {/* Local SEO */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Local SEO (Morocco)</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Business Schema:</span>
              <span className={metrics.localSEO.businessSchema ? 'text-green-600' : 'text-red-600'}>
                {metrics.localSEO.businessSchema ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Local Keywords:</span>
              <span className={metrics.localSEO.localKeywords ? 'text-green-600' : 'text-red-600'}>
                {metrics.localSEO.localKeywords ? '✓' : '✗'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>NAP Consistency:</span>
              <span className={metrics.localSEO.napConsistency ? 'text-green-600' : 'text-red-600'}>
                {metrics.localSEO.napConsistency ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Review Schema:</span>
              <span className={metrics.localSEO.reviewSchema ? 'text-green-600' : 'text-red-600'}>
                {metrics.localSEO.reviewSchema ? '✓' : '✗'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold">SEO Issues & Recommendations</h3>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className={`rounded-lg p-3 ${getIssueColor(issue.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{issue.message}</div>
                    <div className="mt-1 text-sm">{issue.fix}</div>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      issue.impact === 'high'
                        ? 'bg-red-100 text-red-800'
                        : issue.impact === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {issue.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={analyzePage}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Refresh Analysis
        </button>
      </div>
    </div>
  );
}
