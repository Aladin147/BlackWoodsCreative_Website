import { NextResponse } from 'next/server';

import { generateCSRFToken, generateNonce } from '@/lib/utils/security';

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs';

/**
 * CSRF Token API Endpoint
 * Provides CSRF tokens for client-side form protection
 */

export function GET() {
  try {
    // Generate a new cryptographically secure CSRF token
    const token = generateCSRFToken();

    // Generate a new nonce for CSP
    const nonce = generateNonce();

    // Create response with token for client-side use
    const response = NextResponse.json({
      token,
      success: true,
    });

    // Set the token in an HTTP-only cookie for double submit cookie pattern
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Provide nonce in response headers for client-side CSP compliance
    response.headers.set('x-nonce', nonce);

    return response;
  } catch (error) {
    // Log error for debugging in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      console.error('CSRF token generation failed:', error);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate CSRF token',
      },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight
export function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'GET, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
