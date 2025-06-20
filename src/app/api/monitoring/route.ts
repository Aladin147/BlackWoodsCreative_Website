import { NextRequest, NextResponse } from 'next/server';

import { getPerformanceMonitor } from '@/lib/utils/performance-monitor';
import { getRequestLogger } from '@/lib/utils/request-logger';
import { verifyCSRFToken } from '@/lib/utils/security';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'metrics';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const format = (url.searchParams.get('format') as 'json' | 'csv') || 'json';

    const requestLogger = getRequestLogger();
    const performanceMonitor = getPerformanceMonitor();

    switch (type) {
      case 'metrics':
        const requestMetrics = requestLogger.getMetrics();
        const performanceMetrics = performanceMonitor.getMetrics();

        return NextResponse.json({
          timestamp: new Date().toISOString(),
          requests: requestMetrics,
          performance: performanceMetrics,
          system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version,
            platform: process.platform,
          },
        });

      case 'logs':
        const logs = requestLogger.getRecentLogs(limit);

        if (format === 'csv') {
          const csvData = requestLogger.exportLogs('csv');
          return new NextResponse(csvData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="request-logs-${Date.now()}.csv"`,
            },
          });
        }

        return NextResponse.json({
          logs,
          total: logs.length,
          timestamp: new Date().toISOString(),
        });

      case 'errors':
        const errorLogs = requestLogger.getErrorLogs(limit);
        return NextResponse.json({
          errors: errorLogs,
          total: errorLogs.length,
          timestamp: new Date().toISOString(),
        });

      case 'security':
        const securityLogs = requestLogger.getSecurityLogs(limit);
        return NextResponse.json({
          securityEvents: securityLogs,
          total: securityLogs.length,
          timestamp: new Date().toISOString(),
        });

      case 'health':
        const metrics = requestLogger.getMetrics();
        const isHealthy =
          metrics.totalRequests > 0
            ? metrics.successfulRequests / metrics.totalRequests > 0.95
            : true;

        return NextResponse.json({
          status: isHealthy ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          checks: {
            responseTime: metrics.averageResponseTime < 1000,
            errorRate:
              metrics.totalRequests > 0
                ? metrics.failedRequests / metrics.totalRequests < 0.05
                : true,
            securityEvents: metrics.securityEvents < 10,
          },
          metrics: {
            totalRequests: metrics.totalRequests,
            successRate:
              metrics.totalRequests > 0
                ? (metrics.successfulRequests / metrics.totalRequests) * 100
                : 100,
            averageResponseTime: metrics.averageResponseTime,
            securityEvents: metrics.securityEvents,
          },
        });

      default:
        return NextResponse.json(
          { error: 'Invalid monitoring type. Use: metrics, logs, errors, security, or health' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Monitoring API error:', error);
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
    const { action } = body;

    const requestLogger = getRequestLogger();

    switch (action) {
      case 'clear-logs':
        requestLogger.clearLogs();
        return NextResponse.json({
          success: true,
          message: 'Logs cleared successfully',
          timestamp: new Date().toISOString(),
        });

      case 'export-logs':
        const format = (body.format as 'json' | 'csv') || 'json';
        const exportData = requestLogger.exportLogs(format);

        return new NextResponse(exportData, {
          headers: {
            'Content-Type': format === 'csv' ? 'text/csv' : 'application/json',
            'Content-Disposition': `attachment; filename="logs-export-${Date.now()}.${format}"`,
          },
        });

      case 'log-custom-event':
        // Allow logging custom monitoring events
        const { event, data } = body;
        console.log(`📊 Custom monitoring event: ${event}`, data);

        return NextResponse.json({
          success: true,
          message: 'Custom event logged',
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: clear-logs, export-logs, or log-custom-event' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Monitoring API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
