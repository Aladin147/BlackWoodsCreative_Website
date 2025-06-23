/**
 * Formspree Configuration
 * Contains API endpoints and configuration for form submissions
 */

export const formspreeConfig = {
  // Form endpoint
  endpoint: 'https://formspree.io/f/mzzgagbb',
  
  // Form hash ID
  hashId: 'mzzgagbb',
  
  // API endpoints for programmatic access
  api: {
    base: 'https://formspree.io/api/0',
    submissions: 'https://formspree.io/api/0/forms/mzzgagbb/submissions',
  },
  
  // API keys - MUST be provided via environment variables
  keys: {
    // Master API key for full access - REQUIRED environment variable
    master: process.env.FORMSPREE_MASTER_KEY,

    // Read-only API key for accessing submissions - REQUIRED environment variable
    readonly: process.env.FORMSPREE_READONLY_KEY,
  },
  
  // Form configuration to avoid spam detection
  settings: {
    // Use JSON format (default) instead of plain text
    format: 'json',
    
    // Enable spam protection
    spamProtection: true,
    
    // Custom subject line template
    subjectTemplate: 'New Contact Form Submission from {name}',
    
    // Thank you page redirect
    thankYouUrl: 'https://blackwoodscreative.com/thank-you',
  },
} as const;

/**
 * Get Formspree headers for API requests
 */
export function getFormspreeHeaders(useReadonly = false): Record<string, string> {
  const apiKey = useReadonly ? formspreeConfig.keys.readonly : formspreeConfig.keys.master;

  if (!apiKey) {
    throw new Error(
      `Missing Formspree API key. Please set ${useReadonly ? 'FORMSPREE_READONLY_KEY' : 'FORMSPREE_MASTER_KEY'} environment variable.`
    );
  }

  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

/**
 * Validate Formspree configuration
 */
export function validateFormspreeConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!formspreeConfig.hashId) {
    errors.push('Formspree hash ID is missing');
  }

  if (!formspreeConfig.endpoint) {
    errors.push('Formspree endpoint is missing');
  }

  if (!formspreeConfig.keys.master) {
    errors.push('FORMSPREE_MASTER_KEY environment variable is required but not set');
  }

  if (!formspreeConfig.keys.readonly) {
    errors.push('FORMSPREE_READONLY_KEY environment variable is required but not set');
  }

  // Validate API key format (basic check)
  if (formspreeConfig.keys.master && formspreeConfig.keys.master.length < 20) {
    errors.push('FORMSPREE_MASTER_KEY appears to be invalid (too short)');
  }

  if (formspreeConfig.keys.readonly && formspreeConfig.keys.readonly.length < 20) {
    errors.push('FORMSPREE_READONLY_KEY appears to be invalid (too short)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
