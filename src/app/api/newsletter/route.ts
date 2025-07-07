/**
 * Newsletter Signup API Route
 * 
 * Simple API endpoint for newsletter subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/utils/logger';

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the subscription (in production, you'd integrate with an email service)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? 'unknown' : (realIp ?? 'unknown');

    logger.info('Newsletter subscription', {
      email: email.toLowerCase().trim(),
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
        message: 'Successfully subscribed to newsletter' 
      },
      { status: 200 }
    );

  } catch (error) {
    logger.error('Newsletter subscription error', { error });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
