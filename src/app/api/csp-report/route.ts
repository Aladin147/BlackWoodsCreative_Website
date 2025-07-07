import { NextRequest, NextResponse } from 'next/server';

import { logSecurityEvent } from '@/lib/utils/security';

/**
 * CSP Violation Reporting Endpoint
 *
 * This endpoint receives Content Security Policy violation reports
 * and logs them for security monitoring and debugging.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract CSP violation details
    const violation = body['csp-report'];

    if (!violation) {
      return NextResponse.json({ error: 'Invalid CSP report format' }, { status: 400 });
    }

    // Log the security event
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? 'unknown' : (realIp ?? 'unknown');

    logSecurityEvent({
      type: 'csp_violation',
      ip,
      userAgent: request.headers.get('user-agent') ?? 'unknown',
      details: {
        documentUri: violation['document-uri'],
        referrer: violation.referrer,
        violatedDirective: violation['violated-directive'],
        effectiveDirective: violation['effective-directive'],
        originalPolicy: violation['original-policy'],
        disposition: violation.disposition,
        blockedUri: violation['blocked-uri'],
        lineNumber: violation['line-number'],
        columnNumber: violation['column-number'],
        sourceFile: violation['source-file'],
        statusCode: violation['status-code'],
        scriptSample: violation['script-sample'],
      },
    });

    // In production, you might want to:
    // 1. Store violations in a database
    // 2. Send alerts for critical violations
    // 3. Aggregate violation data for analysis
    // 4. Send to external monitoring services (Sentry, etc.)

    return NextResponse.json({ success: true, message: 'CSP violation reported' }, { status: 200 });
  } catch {
    // CSP report processing error - logged internally

    return NextResponse.json({ error: 'Failed to process CSP report' }, { status: 500 });
  }
}

// Handle preflight requests
export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
