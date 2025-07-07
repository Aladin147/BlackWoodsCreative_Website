/**
 * Simplified Performance Budget Configuration
 * 
 * Essential performance thresholds based on Google's Core Web Vitals
 * and practical web performance standards.
 */

// Core Web Vitals thresholds (Google's recommendations)
export const CORE_WEB_VITALS_BUDGET = {
  // Largest Contentful Paint - measures loading performance
  lcp: {
    good: 2500,    // < 2.5s
    needsWork: 4000, // 2.5s - 4s
    // > 4s is poor
  },
  
  // First Input Delay - measures interactivity
  fid: {
    good: 100,     // < 100ms
    needsWork: 300, // 100ms - 300ms
    // > 300ms is poor
  },
  
  // Cumulative Layout Shift - measures visual stability
  cls: {
    good: 0.1,     // < 0.1
    needsWork: 0.25, // 0.1 - 0.25
    // > 0.25 is poor
  },
} as const;

// Additional practical performance budgets
export const PERFORMANCE_BUDGET = {
  // Page load time (total)
  loadTime: {
    good: 3000,    // < 3s
    needsWork: 5000, // 3s - 5s
    // > 5s is poor
  },
  
  // DOM ready time
  domReady: {
    good: 1500,    // < 1.5s
    needsWork: 3000, // 1.5s - 3s
    // > 3s is poor
  },
  
  // Bundle size (total JavaScript)
  bundleSize: {
    good: 200 * 1024,    // < 200KB
    needsWork: 500 * 1024, // 200KB - 500KB
    // > 500KB is poor
  },
} as const;

// Performance scoring function
export function calculatePerformanceScore(metrics: {
  lcp: number;
  fid: number;
  cls: number;
  loadTime: number;
  domReady: number;
}): {
  score: number;
  breakdown: Record<string, { score: number; status: 'good' | 'needs-work' | 'poor' }>;
  issues: string[];
} {
  const breakdown: Record<string, { score: number; status: 'good' | 'needs-work' | 'poor' }> = {};
  const issues: string[] = [];
  
  // Score LCP (25% of total score)
  let lcpScore = 100;
  let lcpStatus: 'good' | 'needs-work' | 'poor' = 'good';
  if (metrics.lcp > CORE_WEB_VITALS_BUDGET.lcp.needsWork) {
    lcpScore = 0;
    lcpStatus = 'poor';
    issues.push(`LCP is poor (${(metrics.lcp / 1000).toFixed(1)}s)`);
  } else if (metrics.lcp > CORE_WEB_VITALS_BUDGET.lcp.good) {
    lcpScore = 50;
    lcpStatus = 'needs-work';
    issues.push(`LCP needs improvement (${(metrics.lcp / 1000).toFixed(1)}s)`);
  }
  breakdown.lcp = { score: lcpScore, status: lcpStatus };
  
  // Score FID (25% of total score)
  let fidScore = 100;
  let fidStatus: 'good' | 'needs-work' | 'poor' = 'good';
  if (metrics.fid > CORE_WEB_VITALS_BUDGET.fid.needsWork) {
    fidScore = 0;
    fidStatus = 'poor';
    issues.push(`FID is poor (${metrics.fid.toFixed(0)}ms)`);
  } else if (metrics.fid > CORE_WEB_VITALS_BUDGET.fid.good) {
    fidScore = 50;
    fidStatus = 'needs-work';
    issues.push(`FID needs improvement (${metrics.fid.toFixed(0)}ms)`);
  }
  breakdown.fid = { score: fidScore, status: fidStatus };
  
  // Score CLS (25% of total score)
  let clsScore = 100;
  let clsStatus: 'good' | 'needs-work' | 'poor' = 'good';
  if (metrics.cls > CORE_WEB_VITALS_BUDGET.cls.needsWork) {
    clsScore = 0;
    clsStatus = 'poor';
    issues.push(`CLS is poor (${metrics.cls.toFixed(3)})`);
  } else if (metrics.cls > CORE_WEB_VITALS_BUDGET.cls.good) {
    clsScore = 50;
    clsStatus = 'needs-work';
    issues.push(`CLS needs improvement (${metrics.cls.toFixed(3)})`);
  }
  breakdown.cls = { score: clsScore, status: clsStatus };
  
  // Score Load Time (25% of total score)
  let loadScore = 100;
  let loadStatus: 'good' | 'needs-work' | 'poor' = 'good';
  if (metrics.loadTime > PERFORMANCE_BUDGET.loadTime.needsWork) {
    loadScore = 0;
    loadStatus = 'poor';
    issues.push(`Load time is poor (${(metrics.loadTime / 1000).toFixed(1)}s)`);
  } else if (metrics.loadTime > PERFORMANCE_BUDGET.loadTime.good) {
    loadScore = 50;
    loadStatus = 'needs-work';
    issues.push(`Load time needs improvement (${(metrics.loadTime / 1000).toFixed(1)}s)`);
  }
  breakdown.loadTime = { score: loadScore, status: loadStatus };
  
  // Calculate overall score (weighted average)
  const totalScore = Math.round((lcpScore + fidScore + clsScore + loadScore) / 4);
  
  return {
    score: totalScore,
    breakdown,
    issues,
  };
}

// Performance recommendations based on issues
export function getPerformanceRecommendations(issues: string[]): string[] {
  const recommendations: string[] = [];
  
  if (issues.some(issue => issue.includes('LCP'))) {
    recommendations.push('Optimize images and critical resources for faster LCP');
    recommendations.push('Consider using a CDN for static assets');
  }
  
  if (issues.some(issue => issue.includes('FID'))) {
    recommendations.push('Reduce JavaScript execution time');
    recommendations.push('Consider code splitting for better interactivity');
  }
  
  if (issues.some(issue => issue.includes('CLS'))) {
    recommendations.push('Set explicit dimensions for images and videos');
    recommendations.push('Avoid inserting content above existing content');
  }
  
  if (issues.some(issue => issue.includes('Load time'))) {
    recommendations.push('Optimize bundle size and reduce dependencies');
    recommendations.push('Enable compression and caching');
  }
  
  return recommendations;
}

// Development utilities
export const PerformanceBudgetUtils = {
  // Check if performance meets budget
  checkBudget: (metrics: {
    lcp: number;
    fid: number;
    cls: number;
    loadTime: number;
    domReady: number;
  }) => {
    const result = calculatePerformanceScore(metrics);
    return {
      passed: result.score >= 70, // 70+ is considered passing
      score: result.score,
      issues: result.issues,
      recommendations: getPerformanceRecommendations(result.issues),
    };
  },
  
  // Log performance budget status
  logBudgetStatus: (metrics: {
    lcp: number;
    fid: number;
    cls: number;
    loadTime: number;
    domReady: number;
  }) => {
    if (process.env.NODE_ENV !== 'development') return;

    const budget = PerformanceBudgetUtils.checkBudget(metrics);

    // Use logger instead of console for consistency
    import('../utils/logger').then(({ logger }) => {
      logger.info('Performance Budget', {
        score: `${budget.score}/100`,
        passed: budget.passed,
        issues: budget.issues,
        recommendations: budget.recommendations,
      });
    });
  },
};

// Export budget constants for external use
export { CORE_WEB_VITALS_BUDGET as CWV_BUDGET, PERFORMANCE_BUDGET as PERF_BUDGET };
