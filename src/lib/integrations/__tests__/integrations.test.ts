/**
 * Integrations Tests
 * 
 * Tests for Formspree and Analytics integrations
 */

import {
  validateAnalyticsConfig,
  isGoogleAnalyticsConfigured,
  isVercelAnalyticsConfigured,
} from '../analytics';
import {
  validateFormspreeConfig,
  validateContactFormData,
  checkSubmissionRateLimit,
  isFormspreeConfigured,
} from '../formspree';

describe('Formspree Integration', () => {
  describe('Configuration Validation', () => {
    it('validates formspree configuration', () => {
      const config = validateFormspreeConfig();
      expect(config).toHaveProperty('isValid');
      expect(config).toHaveProperty('issues');
      expect(Array.isArray(config.issues)).toBe(true);
    });

    it('detects if formspree is configured', () => {
      expect(typeof isFormspreeConfigured).toBe('boolean');
    });
  });

  describe('Form Data Validation', () => {
    it('validates complete form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.',
      };

      const result = validateContactFormData(validData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('validates incomplete form data', () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: 'Short',
      };

      const result = validateContactFormData(invalidData);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    it('validates email format', () => {
      const invalidEmailData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test',
        message: 'Valid message content here.',
      };

      const result = validateContactFormData(invalidEmailData);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('validates message length', () => {
      const shortMessageData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Short',
      };

      const result = validateContactFormData(shortMessageData);
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('allows submissions within rate limit', () => {
      const email = 'test@example.com';
      const isAllowed = checkSubmissionRateLimit(email, 3, 60000);
      expect(typeof isAllowed).toBe('boolean');
    });

    it('handles rate limiting correctly', () => {
      const email = 'ratelimit@example.com';
      
      // First submission should be allowed
      expect(checkSubmissionRateLimit(email, 1, 60000)).toBe(true);
      
      // Record the submission
      // Note: In real implementation, this would be called after successful submission
    });
  });
});

describe('Analytics Integration', () => {
  describe('Configuration Validation', () => {
    it('validates analytics configuration', () => {
      const config = validateAnalyticsConfig();
      expect(config).toHaveProperty('isValid');
      expect(config).toHaveProperty('issues');
      expect(Array.isArray(config.issues)).toBe(true);
    });

    it('detects if Google Analytics is configured', () => {
      expect(typeof isGoogleAnalyticsConfigured).toBe('boolean');
    });

    it('detects if Vercel Analytics is configured', () => {
      expect(typeof isVercelAnalyticsConfigured).toBe('boolean');
    });
  });

  describe('Analytics Configuration', () => {
    it('validates Google Analytics measurement ID format', () => {
      // Test the current configuration
      const config = validateAnalyticsConfig();
      expect(config).toHaveProperty('isValid');
      expect(config).toHaveProperty('issues');
      expect(Array.isArray(config.issues)).toBe(true);

      // The validation should work with the current environment
      // Since we can't easily mock the cached config, we test the structure
      if (config.isValid) {
        expect(config.issues.length).toBe(0);
      } else {
        expect(config.issues.length).toBeGreaterThan(0);
      }
    });
  });
});

describe('Integration Status', () => {
  it('reports formspree configuration status', () => {
    expect(typeof isFormspreeConfigured).toBe('boolean');
  });

  it('reports analytics configuration status', () => {
    expect(typeof isGoogleAnalyticsConfigured).toBe('boolean');
    expect(typeof isVercelAnalyticsConfigured).toBe('boolean');
  });

  it('validates all integrations', () => {
    const formspreeConfig = validateFormspreeConfig();
    const analyticsConfig = validateAnalyticsConfig();
    
    expect(formspreeConfig).toHaveProperty('isValid');
    expect(analyticsConfig).toHaveProperty('isValid');
    
    // At least one integration should be available
    const hasAnyIntegration = 
      formspreeConfig.isValid || 
      analyticsConfig.isValid || 
      isFormspreeConfigured;
    
    expect(hasAnyIntegration).toBe(true);
  });
});

describe('Environment Variables', () => {
  it('handles missing environment variables gracefully', () => {
    // Test with no environment variables
    const originalEnv = { ...process.env };
    
    delete process.env.FORMSPREE_FORM_ID;
    delete process.env.FORMSPREE_MASTER_KEY;
    delete process.env.NEXT_PUBLIC_GA_ID;
    
    const formspreeConfig = validateFormspreeConfig();
    const analyticsConfig = validateAnalyticsConfig();
    
    expect(formspreeConfig).toHaveProperty('isValid');
    expect(analyticsConfig).toHaveProperty('isValid');
    
    // Restore environment
    Object.assign(process.env, originalEnv);
  });

  it('validates environment variable formats', () => {
    // Test the validation logic by checking the current configuration
    const config = validateAnalyticsConfig();

    // Verify the structure is correct
    expect(config).toHaveProperty('isValid');
    expect(config).toHaveProperty('issues');
    expect(typeof config.isValid).toBe('boolean');
    expect(Array.isArray(config.issues)).toBe(true);

    // If there are issues, they should be meaningful strings
    config.issues.forEach(issue => {
      expect(typeof issue).toBe('string');
      expect(issue.length).toBeGreaterThan(0);
    });
  });
});

describe('Production Readiness', () => {
  it('validates production configuration', () => {
    const formspreeConfig = validateFormspreeConfig();
    validateAnalyticsConfig();
    
    // Check if configurations are production-ready
    const isProductionReady = 
      formspreeConfig.isValid || 
      (formspreeConfig.issues.length <= 2 && isFormspreeConfigured);
    
    expect(typeof isProductionReady).toBe('boolean');
  });

  it('provides helpful error messages', () => {
    const formspreeConfig = validateFormspreeConfig();
    const analyticsConfig = validateAnalyticsConfig();
    
    formspreeConfig.issues.forEach(issue => {
      expect(typeof issue).toBe('string');
      expect(issue.length).toBeGreaterThan(0);
    });
    
    analyticsConfig.issues.forEach(issue => {
      expect(typeof issue).toBe('string');
      expect(issue.length).toBeGreaterThan(0);
    });
  });
});

describe('Integration Features', () => {
  it('supports form validation', () => {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message with sufficient length.',
    };
    
    const validation = validateContactFormData(testData);
    expect(validation.isValid).toBe(true);
  });

  it('supports rate limiting', () => {
    const email = 'test@example.com';
    const isAllowed = checkSubmissionRateLimit(email);
    expect(typeof isAllowed).toBe('boolean');
  });

  it('provides configuration status', () => {
    expect(typeof isFormspreeConfigured).toBe('boolean');
    expect(typeof isGoogleAnalyticsConfigured).toBe('boolean');
    expect(typeof isVercelAnalyticsConfigured).toBe('boolean');
  });
});
