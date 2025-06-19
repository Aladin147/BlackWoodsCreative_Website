import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm } from '@/lib/utils';
import { sanitizeFormData } from '@/lib/utils/sanitize';
import { sendContactEmail, sendAutoReplyEmail } from '@/lib/services';
import { verifyCSRFToken, logSecurityEvent } from '@/lib/utils/security';

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
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
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

async function sendEmail(formData: ContactFormData): Promise<boolean> {
  try {
    // Send notification email to BlackWoods Creative
    const contactResult = await sendContactEmail(formData);

    if (!contactResult.success) {
      console.error('Failed to send contact email:', contactResult.error);
      return false;
    }

    // Send auto-reply to the user (optional, don't fail if this fails)
    const autoReplyResult = await sendAutoReplyEmail(formData);
    if (!autoReplyResult.success) {
      console.warn('Failed to send auto-reply email:', autoReplyResult.error);
      // Don't return false here - the main email was sent successfully
    }

    console.log('📧 Contact email sent successfully');
    return true;

  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactFormResponse>> {
  try {
    // Check rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      const resetTime = rateLimit.resetTime || Date.now();
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
    const ip = request.ip ?? '127.0.0.1';
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
    const sanitizedData = sanitizeFormData(body as unknown as Record<string, unknown>) as unknown as ContactFormData;

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
    if (sanitizedData.company && typeof sanitizedData.company === 'string' && sanitizedData.company.length > 100) {
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

    // Send email
    const emailSent = await sendEmail(sanitizedData);
    
    if (!emailSent) {
      console.error('Failed to send contact form email');
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
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    
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
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
