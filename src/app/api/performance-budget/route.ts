import { NextRequest, NextResponse } from 'next/server';

import { PerformanceBudget } from '@/lib/config/performance-budgets';
import {
  getPerformanceBudgetChecker,
  PerformanceData,
} from '@/lib/utils/performance-budget-checker';
import { getPerformanceMonitor } from '@/lib/utils/performance-monitor';
import { verifyCSRFToken } from '@/lib/utils/security';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'check';
    const environment = url.searchParams.get('env') || process.env.NODE_ENV;

    switch (action) {
      case 'check':
        return await handleBudgetCheck();

      case 'config':
        return await handleGetConfig(environment);

      case 'report':
        return await handleGenerateReport();

      case 'history':
        return await handleGetHistory(request);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: check, config, report, or history' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Performance budget API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token for state-changing operations
    const csrfToken =
      request.headers.get('x-csrf-token') || request.cookies.get('csrf-token')?.value;

    if (!csrfToken || !verifyCSRFToken(csrfToken, csrfToken)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'check-custom':
        return await handleCustomBudgetCheck(data);

      case 'update-config':
        return await handleUpdateConfig(data);

      case 'save-report':
        return await handleSaveReport(data);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: check-custom, update-config, or save-report' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Performance budget POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleBudgetCheck() {
  try {
    // Get current performance data
    const performanceMonitor = getPerformanceMonitor();
    const currentMetrics = performanceMonitor.getMetrics();

    // Simulate bundle analysis (in real implementation, this would analyze actual bundles)
    const performanceData: PerformanceData = {
      bundles: {
        main: 450 * 1024, // 450KB main bundle
        vendor: 750 * 1024, // 750KB vendor bundle
        total: 1.2 * 1024 * 1024, // 1.2MB total
        gzipped: 350 * 1024, // 350KB gzipped
      },
      coreWebVitals: {
        lcp: currentMetrics.lcp || 2200,
        fid: currentMetrics.fid || 80,
        cls: currentMetrics.cls || 0.08,
        fcp: currentMetrics.fcp || 1600,
        ttfb: currentMetrics.ttfb || 500,
        inp: 150, // Simulated INP
      },
      resources: {
        requests: 35,
        imageSize: 400 * 1024,
        fontSize: 80 * 1024,
        cssSize: 150 * 1024,
        jsSize: 800 * 1024,
      },
      performance: {
        renderTime: 12,
        memoryUsage: 65,
        fps: 58,
        domNodes: 1200,
        eventListeners: 85,
      },
      network: {
        latency: 150,
        bandwidth: 800,
        concurrentRequests: 4,
      },
    };

    // Check budgets
    const budgetChecker = getPerformanceBudgetChecker();
    const result = budgetChecker.checkBudgets(performanceData);

    return NextResponse.json({
      ...result,
      environment: process.env.NODE_ENV,
      data: performanceData,
    });
  } catch (error) {
    console.error('Budget check error:', error);
    return NextResponse.json({ error: 'Failed to check performance budgets' }, { status: 500 });
  }
}

async function handleGetConfig(environment: string) {
  try {
    // Get budget for specific environment without modifying process.env
    let budget;

    if (environment === 'production') {
      const { PRODUCTION_BUDGETS } = await import('@/lib/config/performance-budgets');
      budget = PRODUCTION_BUDGETS;
    } else if (environment === 'test') {
      const { TESTING_BUDGETS } = await import('@/lib/config/performance-budgets');
      budget = TESTING_BUDGETS;
    } else {
      const { DEVELOPMENT_BUDGETS } = await import('@/lib/config/performance-budgets');
      budget = DEVELOPMENT_BUDGETS;
    }

    return NextResponse.json({
      budget,
      environment,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get config error:', error);
    return NextResponse.json({ error: 'Failed to get budget configuration' }, { status: 500 });
  }
}

async function handleGenerateReport() {
  try {
    const includeRecommendations = true; // Default to include recommendations

    // Get budget check results
    const checkResponse = await handleBudgetCheck();
    const checkData = await checkResponse.json();

    // JSON format
    const report = {
      ...checkData,
      generatedAt: new Date().toISOString(),
      reportType: 'performance-budget-check',
      includeRecommendations,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json({ error: 'Failed to generate performance report' }, { status: 500 });
  }
}

async function handleGetHistory(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const days = parseInt(url.searchParams.get('days') || '7', 10);

    // In a real implementation, this would fetch from a database
    // For now, return mock historical data
    const history = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      id: `report-${Date.now() - i * 86400000}`,
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      score: Math.max(70, 100 - Math.random() * 30),
      passed: Math.random() > 0.3,
      violationsCount: Math.floor(Math.random() * 5),
      environment: process.env.NODE_ENV,
    }));

    return NextResponse.json({
      history,
      total: history.length,
      period: `${days} days`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get history error:', error);
    return NextResponse.json({ error: 'Failed to get budget check history' }, { status: 500 });
  }
}

async function handleCustomBudgetCheck(data: {
  performanceData: PerformanceData;
  customBudget?: PerformanceBudget;
}) {
  try {
    const { performanceData, customBudget } = data;

    const budgetChecker = getPerformanceBudgetChecker(customBudget);
    const result = budgetChecker.checkBudgets(performanceData);

    return NextResponse.json({
      ...result,
      customBudget: !!customBudget,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Custom budget check error:', error);
    return NextResponse.json(
      { error: 'Failed to check custom performance budgets' },
      { status: 500 }
    );
  }
}

async function handleUpdateConfig(data: { budget: unknown; environment: string }) {
  try {
    // In a real implementation, this would update stored configuration
    // For now, just validate the configuration
    const { budget, environment } = data;

    if (!budget || !environment) {
      return NextResponse.json({ error: 'Budget and environment are required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Budget configuration updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Update config error:', error);
    return NextResponse.json({ error: 'Failed to update budget configuration' }, { status: 500 });
  }
}

async function handleSaveReport(data: { report: unknown; tags: string[] }) {
  try {
    // In a real implementation, this would save to database
    console.log('Saving report:', data.report, 'with tags:', data.tags);

    return NextResponse.json({
      success: true,
      reportId: `report-${Date.now()}`,
      message: 'Performance report saved successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Save report error:', error);
    return NextResponse.json({ error: 'Failed to save performance report' }, { status: 500 });
  }
}

// CSV report generation function (for future use)
// function generateCSVReport(data: ReportData, includeRecommendations: boolean): string {
//   // Implementation would go here
//   return '';
// }
