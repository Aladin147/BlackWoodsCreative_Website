/**
 * Lead Generation Components
 *
 * Simple, practical components for capturing and managing leads
 */

'use client';

import { useState, useTransition } from 'react';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

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
    <div className="flex flex-col gap-4 sm:flex-row">
      <a
        href="tel:+212-XXX-XXXXXX"
        onClick={handlePhoneClick}
        className={`flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-lg bg-bw-accent-gold px-6 py-3 font-medium text-black transition-colors hover:bg-bw-accent-gold/90 ${deviceInfo.isMobile ? 'active:scale-95' : ''}`}
      >
        <PhoneIcon className="h-5 w-5" />
        Call Now
      </a>
      <a
        href="mailto:hello@blackwoodscreative.com"
        onClick={handleEmailClick}
        className={`hover:bg-bw-bg-secondary flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-lg border border-bw-border-subtle px-6 py-3 font-medium text-bw-text-primary transition-colors ${deviceInfo.isMobile ? 'active:scale-95' : ''}`}
      >
        <EnvelopeIcon className="h-5 w-5" />
        Email Us
      </a>
    </div>
  );
}

// Newsletter signup component
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const { trackBusinessGoal } = useBusinessTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setError('');

    startTransition(async () => {
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
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-green-800">Thank you!</h3>
        <p className="text-green-700">You&apos;ve been subscribed to our newsletter.</p>
      </div>
    );
  }

  return (
    <div className="bg-bw-bg-secondary rounded-lg p-6">
      <h3 className="mb-2 text-lg font-semibold">Stay Updated</h3>
      <p className="mb-4 text-bw-text-secondary">
        Get the latest insights on visual storytelling and creative trends.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-bw-border-subtle px-4 py-3 transition-colors focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold"
            disabled={isPending}
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-bw-accent-gold px-4 py-3 font-medium text-black transition-colors hover:bg-bw-accent-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Subscribing...' : 'Subscribe'}
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { trackConversion, trackBusinessGoal } = useBusinessTracking();
  const deviceInfo = useMobileDevice();

  const handleSubmit = (e: React.FormEvent) => {
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

    startTransition(async () => {
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
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  let buttonClasses =
    'fixed z-40 px-6 py-3 bg-bw-accent-gold text-black rounded-full shadow-lg hover:bg-bw-accent-gold/90 transition-all font-medium';
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
      <button onClick={() => setIsOpen(true)} className={buttonClasses}>
        Get Quote
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          style={{ padding: deviceInfo.hasNotch ? '1rem' : '1rem' }}
        >
          <div className={modalClasses}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Quick Quote Request</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="py-8 text-center">
                <div className="mb-4 text-4xl text-green-600">✓</div>
                <h4 className="mb-2 text-lg font-semibold">Quote Request Sent!</h4>
                <p className="text-gray-600">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                {/* Error display */}
                {errors.length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">
                        {error}
                      </p>
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
                    className="min-h-[48px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold"
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
                    className="min-h-[48px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold"
                  />

                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-bw-accent-gold focus:ring-2 focus:ring-bw-accent-gold"
                  />

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-lg bg-bw-accent-gold px-4 py-3 font-medium text-black transition-colors hover:bg-bw-accent-gold/90 disabled:opacity-50"
                  >
                    {isPending ? 'Sending...' : 'Send Quote Request'}
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
