/**
 * Formspree Integration
 *
 * Comprehensive integration with Formspree for contact form handling
 */

// Formspree configuration
export const FORMSPREE_CONFIG = {
  formId: process.env.FORMSPREE_FORM_ID ?? 'mzzgagbb',
  masterKey: process.env.FORMSPREE_MASTER_KEY,
  readonlyKey: process.env.FORMSPREE_READONLY_KEY,
  endpoint: 'https://formspree.io/f/',
  apiEndpoint: 'https://formspree.io/api/0/forms/',
} as const;

// Form submission types
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
}

export interface FormspreeResponse {
  ok: boolean;
  next?: string;
  errors?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

export interface FormspreeSubmission {
  id: string;
  email: string;
  data: Record<string, unknown>;
  date: string;
  _subject?: string;
}

// Form submission function
export async function submitContactForm(data: ContactFormData): Promise<FormspreeResponse> {
  try {
    const response = await fetch(`${FORMSPREE_CONFIG.endpoint}${FORMSPREE_CONFIG.formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company ?? '',
        phone: data.phone ?? '',
        subject: data.subject,
        message: data.message,
        projectType: data.projectType ?? '',
        budget: data.budget ?? '',
        timeline: data.timeline ?? '',
        _subject: `New Contact Form Submission from ${data.name}`,
        _replyto: data.email,
      }),
    });

    const result = await response.json();

    return {
      ok: response.ok,
      next: result.next,
      errors: result.errors,
    };
  } catch {
    // Formspree submission error - handled gracefully
    return {
      ok: false,
      errors: [
        {
          field: 'general',
          code: 'NETWORK_ERROR',
          message: 'Network error occurred. Please try again.',
        },
      ],
    };
  }
}

// Get form submissions (requires API key)
export async function getFormSubmissions(): Promise<FormspreeSubmission[]> {
  if (!FORMSPREE_CONFIG.readonlyKey) {
    // Formspree readonly key not configured - returning empty array
    return [];
  }

  try {
    const response = await fetch(
      `${FORMSPREE_CONFIG.apiEndpoint}${FORMSPREE_CONFIG.formId}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${FORMSPREE_CONFIG.readonlyKey}`,
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Formspree API error: ${response.status}`);
    }

    const result = await response.json();
    return result.submissions ?? [];
  } catch {
    // Error fetching form submissions - handled gracefully
    return [];
  }
}

// Get form analytics
export async function getFormAnalytics() {
  if (!FORMSPREE_CONFIG.readonlyKey) {
    // Formspree readonly key not configured - returning null
    return null;
  }

  try {
    const response = await fetch(`${FORMSPREE_CONFIG.apiEndpoint}${FORMSPREE_CONFIG.formId}`, {
      headers: {
        Authorization: `Bearer ${FORMSPREE_CONFIG.readonlyKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Formspree API error: ${response.status}`);
    }

    const result = await response.json();
    return {
      totalSubmissions: result.submission_count ?? 0,
      lastSubmission: result.last_submission ?? null,
      isActive: result.disabled === false,
    };
  } catch {
    // Error fetching form analytics - handled gracefully
    return null;
  }
}

// Validate form configuration
export function validateFormspreeConfig(): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!FORMSPREE_CONFIG.formId) {
    issues.push('Formspree Form ID is not configured');
  }

  if (!FORMSPREE_CONFIG.masterKey) {
    issues.push('Formspree Master Key is not configured (optional for basic functionality)');
  }

  if (!FORMSPREE_CONFIG.readonlyKey) {
    issues.push('Formspree Readonly Key is not configured (optional for analytics)');
  }

  const isValid = issues.length === 0 || (issues.length <= 2 && Boolean(FORMSPREE_CONFIG.formId));

  return {
    isValid,
    issues,
  };
}

// Form validation helpers
export function validateContactFormData(data: Partial<ContactFormData>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Required fields
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.subject?.trim()) {
    errors.subject = 'Subject is required';
  }

  if (!data.message?.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }

  // Optional field validation
  if (data.phone && !/^[+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-()]/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (data.email && data.email.length > 254) {
    errors.email = 'Email address is too long';
  }

  if (data.name && data.name.length > 100) {
    errors.name = 'Name is too long';
  }

  if (data.subject && data.subject.length > 200) {
    errors.subject = 'Subject is too long';
  }

  if (data.message && data.message.length > 5000) {
    errors.message = 'Message is too long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Rate limiting for form submissions
const submissionTracker = new Map<string, number[]>();

export function checkSubmissionRateLimit(
  email: string,
  maxSubmissions = 3,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const submissions = submissionTracker.get(email) ?? [];

  // Remove old submissions outside the window
  const recentSubmissions = submissions.filter(time => now - time < windowMs);

  // Update tracker
  submissionTracker.set(email, recentSubmissions);

  // Check if under limit
  return recentSubmissions.length < maxSubmissions;
}

export function recordSubmission(email: string): void {
  const submissions = submissionTracker.get(email) ?? [];
  submissions.push(Date.now());
  submissionTracker.set(email, submissions);
}

// Export configuration for use in components
export const isFormspreeConfigured = Boolean(FORMSPREE_CONFIG.formId);
export const hasFormspreeAnalytics = Boolean(FORMSPREE_CONFIG.readonlyKey);

// Default export
const formspreeModule = {
  submitContactForm,
  getFormSubmissions,
  getFormAnalytics,
  validateFormspreeConfig,
  validateContactFormData,
  checkSubmissionRateLimit,
  recordSubmission,
  isFormspreeConfigured,
  hasFormspreeAnalytics,
  FORMSPREE_CONFIG,
};

export default formspreeModule;
