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
  
  // API keys (should be moved to environment variables in production)
  keys: {
    // Master API key for full access (use environment variable in production)
    master: process.env.FORMSPREE_MASTER_KEY || 'a0e79422e82347dbacc2b2f3b35982ed',
    
    // Read-only API key for accessing submissions (use environment variable in production)
    readonly: process.env.FORMSPREE_READONLY_KEY || 'f3d00a4b0e093a74eba8322a20da53c50a5db6b4',
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
  
  if (!formspreeConfig.keys.master && !process.env.FORMSPREE_MASTER_KEY) {
    errors.push('Formspree master API key is missing');
  }
  
  if (!formspreeConfig.keys.readonly && !process.env.FORMSPREE_READONLY_KEY) {
    errors.push('Formspree readonly API key is missing');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
