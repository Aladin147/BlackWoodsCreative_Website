/**
 * Lead Generation Components
 * 
 * Simple, practical components for capturing and managing leads
 */

'use client';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { useBusinessTracking } from '@/components/analytics/GoogleAnalytics';
import { useMobileDevice } from '@/lib/utils/mobile-optimization';

// Quick contact buttons with mobile optimization
export function QuickContactButtons() {
  const { trackBusinessGoal } = useBusinessTracking();
  const deviceInfo = useMobileDevice();

  const handlePhoneClick = () => {
    trackBusinessGoal('phone_click');
  };

  const handleEmailClick = () => {
    trackBusinessGoal('email_click');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a
        href="tel:+212-XXX-XXXXXX"
        onClick={handlePhoneClick}
        className={`flex items-center justify-center gap-2 px-6 py-3 bg-bw-accent-gold text-black rounded-lg hover:bg-bw-accent-gold/90 transition-colors font-medium min-h-[48px] min-w-[48px] ${deviceInfo.isMobile ? 'active:scale-95' : ''}`}
      >
        <PhoneIcon className="w-5 h-5" />
        Call Now
      </a>
      <a
        href="mailto:hello@blackwoodscreative.com"
        onClick={handleEmailClick}
        className={`flex items-center justify-center gap-2 px-6 py-3 border border-bw-border-subtle text-bw-text-primary rounded-lg hover:bg-bw-bg-secondary transition-colors font-medium min-h-[48px] min-w-[48px] ${deviceInfo.isMobile ? 'active:scale-95' : ''}`}
      >
        <EnvelopeIcon className="w-5 h-5" />
        Email Us
      </a>
    </div>
  );
}

// Newsletter signup component
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { trackBusinessGoal } = useBusinessTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simple newsletter signup - can be integrated with email service later
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
        trackBusinessGoal('newsletter_signup');
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Thank you!</h3>
        <p className="text-green-700">You&apos;ve been subscribed to our newsletter.</p>
      </div>
    );
  }

  return (
    <div className="bg-bw-bg-secondary p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
      <p className="text-bw-text-secondary mb-4">
        Get the latest insights on visual storytelling and creative trends.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-bw-border-subtle rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold transition-colors"
            disabled={isSubmitting}
          />
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-bw-accent-gold text-black rounded-lg hover:bg-bw-accent-gold/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}

// Quick quote request component with mobile optimization
export function QuickQuoteRequest() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { trackConversion, trackBusinessGoal } = useBusinessTracking();
  const deviceInfo = useMobileDevice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple form validation
    const validationErrors: string[] = [];
    if (!formData.name.trim()) validationErrors.push('Name is required');
    if (!formData.email.trim()) validationErrors.push('Email is required');
    if (!formData.projectType.trim()) validationErrors.push('Project type is required');

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: 'Quick Quote Request',
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        trackConversion('quote_request');
        trackBusinessGoal('quote_request');

        // Reset form after delay
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
          setFormData({
            name: '',
            email: '',
            projectType: '',
            budget: '',
            message: '',
          });
          setErrors([]);
        }, 3000);
      } else {
        setErrors(['Failed to send request. Please try again.']);
      }
    } catch {
      setErrors(['Something went wrong. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  let buttonClasses = 'fixed z-40 px-6 py-3 bg-bw-accent-gold text-black rounded-full shadow-lg hover:bg-bw-accent-gold/90 transition-all font-medium';
  let modalClasses = 'bg-white rounded-lg w-full overflow-y-auto';

  if (deviceInfo.isMobile) {
    buttonClasses += ' bottom-4 right-4 active:scale-95 min-h-[56px] min-w-[56px]';
    modalClasses += ' max-w-sm max-h-[85vh] p-4 mx-4';
  } else {
    buttonClasses += ' bottom-6 right-6 hover:scale-105 min-h-[48px] min-w-[48px]';
    modalClasses += ' max-w-md max-h-[90vh] p-6';
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClasses}
      >
        Get Quote
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" style={{ padding: deviceInfo.hasNotch ? '1rem' : '1rem' }}>
          <div className={modalClasses}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Quick Quote Request</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h4 className="text-lg font-semibold mb-2">Quote Request Sent!</h4>
                <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
              {/* Error display */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  autoComplete="name"
                  style={{ fontSize: '16px' }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold min-h-[48px]"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  autoComplete="email"
                  style={{ fontSize: '16px' }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold min-h-[48px]"
                />
                
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold"
                >
                  <option value="">Select Project Type</option>
                  <option value="video-production">Video Production</option>
                  <option value="photography">Photography</option>
                  <option value="3d-visualization">3D Visualization</option>
                  <option value="other">Other</option>
                </select>
                
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold"
                >
                  <option value="">Budget Range (Optional)</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-15k">$5,000 - $15,000</option>
                  <option value="15k-50k">$15,000 - $50,000</option>
                  <option value="50k-plus">$50,000+</option>
                </select>
                
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Brief project description"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold"
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-bw-accent-gold text-black rounded-lg hover:bg-bw-accent-gold/90 transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Quote Request'}
                </button>
              </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
