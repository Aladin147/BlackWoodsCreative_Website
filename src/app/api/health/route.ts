import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for debugging deployment issues
 */
export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    const url = request.url;
    const headers = Object.fromEntries(request.headers.entries());
    
    // Basic system info
    const healthInfo = {
      status: 'healthy',
      timestamp,
      url,
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.1.0',
      deployment: {
        vercel: !!process.env.VERCEL,
        vercelUrl: process.env.VERCEL_URL || 'not-set',
        vercelEnv: process.env.VERCEL_ENV || 'not-set',
        vercelRegion: process.env.VERCEL_REGION || 'not-set',
      },
      request: {
        method: request.method,
        url: request.url,
        userAgent: headers['user-agent'] || 'unknown',
        host: headers.host || 'unknown',
        origin: headers.origin || 'none',
        referer: headers.referer || 'none',
      },
      features: {
        formspreeConfigured: true,
        logoComponent: true,
        middlewareActive: true,
        csrfProtection: true,
      },
    };

    return NextResponse.json(healthInfo, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'ok',
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Health-Check': 'error',
        },
      }
    );
  }
}
