/**
 * Content Optimization Tool
 *
 * Interactive tool for optimizing blog posts and content
 * using the SEO content analyzer for BlackWoods Creative
 */

'use client';

import { useState } from 'react';

import { SEOContentAnalyzer, MOROCCO_KEYWORDS } from '@/lib/seo/content-analyzer';
import { ContentAnalysisResult, ensureFixProperties } from '@/lib/seo/types';

export function ContentOptimizationTool() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeContent = () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const analyzer = new SEOContentAnalyzer(content, {
        title,
        description,
      });

      const result = analyzer.analyze(targetKeyword || undefined);

      setAnalysis({
        score: result.score,
        issues: ensureFixProperties(result.issues),
        recommendations: result.recommendations,
        metrics: {
          wordCount: result.technicalSEO.wordCount,
          keywordDensity: result.keywordAnalysis.keywordDensity,
          readabilityScore: result.readability.fleschScore,
          headingStructure: {
            h1Count: result.headingStructure.h1Count,
            h2Count: result.headingStructure.h2Count,
            h3Count: result.headingStructure.h3Count,
          },
        },
      });
    } catch (error) {
      console.error('Content analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const suggestedKeywords = [...MOROCCO_KEYWORDS.primary, ...MOROCCO_KEYWORDS.secondary];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold">Content Optimization Tool</h1>
        <p className="mb-6 text-gray-600">
          Optimize your content for SEO with real-time analysis and Morocco-specific
          recommendations.
        </p>

        {/* Content Input Form */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="content-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="content-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your content title..."
              />
            </div>

            <div>
              <label
                htmlFor="meta-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Meta Description
              </label>
              <textarea
                id="meta-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta description..."
              />
            </div>

            <div>
              <label
                htmlFor="target-keyword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Target Keyword
              </label>
              <input
                id="target-keyword"
                type="text"
                value={targetKeyword}
                onChange={e => setTargetKeyword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., video production morocco"
              />
              <div className="mt-2">
                <p className="mb-2 text-sm text-gray-600">Suggested Morocco keywords:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedKeywords.slice(0, 6).map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => setTargetKeyword(keyword)}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 transition-colors hover:bg-blue-200"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="content-text"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content-text"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={12}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your content here... Include headings with # ## ### for better analysis."
              />
            </div>

            <button
              onClick={analyzeContent}
              disabled={loading || !content.trim()}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? 'Analyzing...' : 'Analyze Content'}
            </button>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-4">
            {analysis ? (
              <>
                {/* Score */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <div className="text-sm text-gray-600">SEO Score</div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${analysis.score >= 90 ? 'bg-green-500' : analysis.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${analysis.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-semibold">Content Metrics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Words:</span>
                      <span className="ml-2 font-medium">{analysis.metrics.wordCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Keyword Density:</span>
                      <span className="ml-2 font-medium">
                        {analysis.metrics.keywordDensity.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Readability:</span>
                      <span className="ml-2 font-medium">
                        {analysis.metrics.readabilityScore.toFixed(0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Headings:</span>
                      <span className="ml-2 font-medium">
                        H1:{analysis.metrics.headingStructure.h1Count} H2:
                        {analysis.metrics.headingStructure.h2Count} H3:
                        {analysis.metrics.headingStructure.h3Count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {analysis.issues.length > 0 && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold">Issues</h3>
                    <div className="space-y-2">
                      {analysis.issues.map((issue, index) => (
                        <div
                          key={index}
                          className={`rounded p-2 text-sm ${
                            issue.type === 'error'
                              ? 'bg-red-100 text-red-800'
                              : issue.type === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <div className="font-medium">{issue.message}</div>
                          <div className="mt-1 text-xs">{issue.fix}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold">Recommendations</h3>
                    <ul className="space-y-1 text-sm">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-green-600">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
                Enter content and click &quot;Analyze Content&quot; to see SEO recommendations
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Morocco SEO Tips</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-800">Local Keywords</h3>
            <p className="text-sm text-blue-700">
              Include Morocco-specific terms like &ldquo;Casablanca&rdquo;, &ldquo;Rabat&rdquo;,
              &ldquo;Mohammedia&rdquo; in your content.
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <h3 className="mb-2 font-medium text-green-800">Service Focus</h3>
            <p className="text-sm text-green-700">
              Emphasize &ldquo;video production morocco&rdquo;, &ldquo;photography morocco&rdquo;,
              &ldquo;3d visualization morocco&rdquo;.
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <h3 className="mb-2 font-medium text-purple-800">Content Length</h3>
            <p className="text-sm text-purple-700">
              Aim for 300+ words with proper heading structure (H1, H2, H3).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
