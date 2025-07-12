/**
 * Newsletter Signup API Route
 *
 * Simple API endpoint for newsletter subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/utils/logger';
import { verifyCSRFToken, sanitizeEmail } from '@/lib/utils/security';

export async function POST(request: NextRequest) {
  try {
    // Verify CSRF token for security
    const csrfToken =
      request.headers.get('x-csrf-token') ?? request.cookies.get('csrf-token')?.value;
    const sessionToken = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || !sessionToken || !verifyCSRFToken(csrfToken, sessionToken)) {
      return NextResponse.json(
        { error: 'Security validation failed. Please refresh the page and try again.' },
        { status: 403 }
      );
    }

    const { email } = await request.json();

    // Validate and sanitize email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Log the subscription (in production, you'd integrate with an email service)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? (forwarded.split(',')[0]?.trim() ?? 'unknown') : (realIp ?? 'unknown');

    logger.info('Newsletter subscription', {
      email: sanitizedEmail,
      timestamp: new Date().toISOString(),
      ip,
    });

    // TODO: Integrate with email service (Mailchimp, ConvertKit, etc.)
    // For now, just simulate success

    // In production, you would do something like:
    // await emailService.subscribe(email);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Newsletter subscription error', { error });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle unsupported methods
export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
