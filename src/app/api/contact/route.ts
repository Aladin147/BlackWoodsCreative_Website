import { NextRequest, NextResponse } from 'next/server';

import { formspreeConfig } from '@/lib/config/formspree';
import { validateContactForm } from '@/lib/utils';
import { log } from '@/lib/utils/logger';
import { sanitizeFormData } from '@/lib/utils/sanitize';
import { verifyCSRFToken, logSecurityEvent } from '@/lib/utils/security';

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 submissions per 10 minutes per IP

// In-memory rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

interface ContactFormResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? 'unknown' : (realIp ?? 'unknown');
  return `contact_${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, resetTime: record.resetTime };
  }

  // Increment count
  record.count += 1;
  rateLimitStore.set(key, record);
  return { allowed: true };
}

async function sendToFormspree(formData: ContactFormData): Promise<boolean> {
  try {
    // Prepare form data for Formspree (optimized to avoid spam detection)
    const formspreeData = {
      name: formData.name,
      email: formData.email,
      company: formData.company ?? '',
      projectType: formData.projectType ?? '',
      budget: formData.budget ?? '',
      message: formData.message,
      _subject: formspreeConfig.settings.subjectTemplate.replace('{name}', formData.name),
      _replyto: formData.email,
      _next: formspreeConfig.settings.thankYouUrl,
      // Using JSON format (default) for better deliverability and spam protection
    };

    // Send to Formspree
    const response = await fetch(formspreeConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'BlackWoods-Creative-Website/1.0',
      },
      body: JSON.stringify(formspreeData),
    });

    if (!response.ok) {
      await response.json().catch(() => ({}));
      // Formspree submission failed - logged internally
      return false;
    }

    const result = await response.json();
    log.api.success('/api/contact', { formspree: result });
    return true;
  } catch {
    // Formspree submission error - logged internally
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactFormResponse>> {
  try {
    // Check rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime ?? Date.now();
      const waitTime = Math.ceil((resetTime - Date.now()) / 1000 / 60); // minutes

      return NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please try again in ${waitTime} minutes.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Verify CSRF token
    const csrfToken = request.headers.get('x-csrf-token');
    const sessionToken = request.cookies.get('csrf-token')?.value;
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded ? forwarded.split(',')[0]?.trim() ?? '127.0.0.1' : (realIp ?? '127.0.0.1');
    const userAgent = request.headers.get('user-agent') ?? '';

    if (!csrfToken || !sessionToken || !verifyCSRFToken(csrfToken, sessionToken)) {
      // Log security event
      logSecurityEvent({
        type: 'csrf_failure',
        ip,
        userAgent,
        details: {
          path: '/api/contact',
          hasCSRFToken: !!csrfToken,
          hasSessionToken: !!sessionToken,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Security validation failed. Please refresh the page and try again.',
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    let body: ContactFormData;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format. Please check your data and try again.',
        },
        { status: 400 }
      );
    }

    // Sanitize input data
    const sanitizedData = sanitizeFormData(
      body as unknown as Record<string, unknown>
    ) as unknown as ContactFormData;

    // Validate form data
    const validation = validateContactForm({
      name: sanitizedData.name,
      email: sanitizedData.email,
      message: sanitizedData.message,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please correct the errors below.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Additional validation for optional fields
    if (
      sanitizedData.company &&
      typeof sanitizedData.company === 'string' &&
      sanitizedData.company.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Company name is too long.',
          errors: { company: 'Company name must be less than 100 characters' },
        },
        { status: 400 }
      );
    }

    if (typeof sanitizedData.message === 'string' && sanitizedData.message.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message is too long.',
          errors: { message: 'Message must be less than 2000 characters' },
        },
        { status: 400 }
      );
    }

    // Send to Formspree
    const formSubmitted = await sendToFormspree(sanitizedData);

    if (!formSubmitted) {
      // Failed to submit contact form to Formspree - logged internally
      return NextResponse.json(
        {
          success: false,
          message: 'We encountered an issue sending your message. Please try again later.',
        },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! We'll get back to you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    log.api.error('/api/contact', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export function GET(): NextResponse {
  return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
}

export function PUT(): NextResponse {
  return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
}

export function DELETE(): NextResponse {
  return NextResponse.json({ success: false, message: 'Method not allowed' }, { status: 405 });
}
