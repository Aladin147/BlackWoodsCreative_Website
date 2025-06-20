import { NextResponse } from 'next/server';

import { generateCSRFToken } from '@/lib/utils/security';

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs';

/**
 * CSRF Token API Endpoint
 * Provides CSRF tokens for client-side form protection
 */

export async function GET() {
  try {
    // Generate a new CSRF token
    const token = generateCSRFToken();

    // Create response with token
    const response = NextResponse.json({
      token,
      success: true,
    });

    // Set the token in an HTTP-only cookie
    response.cookies.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error generating CSRF token:', error);

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
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: 'GET, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
