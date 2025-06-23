'use client';

import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

import {
  ScrollReveal,
  MagneticField,
  AtmosphericLayer,
  ParallaxText,
} from '@/components/interactive';
import { MotionA, MotionDiv, MotionButton } from '@/components/interactive/MotionWrapper';
import { useCSRFProtection } from '@/hooks/useCSRFProtection';
import { validateEmail } from '@/lib/utils';
import { sanitizeFormData } from '@/lib/utils/sanitize';

interface ContactSectionProps {
  className?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}

interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'hello@blackwoodscreative.com',
    href: 'mailto:hello@blackwoodscreative.com',
  },
  {
    icon: PhoneIcon,
    label: 'Phone',
    value: '+212 625 55 37 68',
    href: 'tel:+212625553768',
  },
  {
    icon: MapPinIcon,
    label: 'Location',
    value: 'MFADEL Business Center, Building O, Floor 5. Mohammedia Morocco',
    href: '#',
  },
];

const projectTypes = [
  'Brand Film',
  'Product Photography',
  '3D Visualization',
  'Scene Creation',
  'Documentary',
  'Commercial',
  'Other',
];

const budgetRanges = [
  '$5K - $10K',
  '$10K - $25K',
  '$25K - $50K',
  '$50K - $100K',
  '$100K+',
  'Let&apos;s discuss',
];

export function ContactSection({ className }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // CSRF Protection
  const { csrfToken, isLoading: csrfLoading, makeProtectedRequest } = useCSRFProtection();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name as keyof ContactFormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      errors.message = 'Project details are required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Please provide more details about your project';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    // Sanitize user inputs to prevent XSS attacks
    const sanitizedData = sanitizeFormData(formData as unknown as Record<string, unknown>);

    setIsSubmitting(true);

    try {
      // Submit form data to API endpoint with CSRF protection
      const response = await makeProtectedRequest('/api/contact', {
        method: 'POST',
        body: JSON.stringify(sanitizedData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Handle validation errors from server
          setFormErrors(result.errors);
        } else {
          // Handle other errors (rate limiting, server errors, etc.)
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormErrors({});
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: '',
          budget: '',
          message: '',
        });
      }, 3000);
    } catch {
      // Network error - logged internally
      setIsSubmitting(false);
      // Could show a user-friendly error message here
    }
  };

  return (
    <section id="contact" className={`relative bg-bw-bg-primary px-4 py-24 ${className}`}>
      {/* Atmospheric Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <AtmosphericLayer type="mist" intensity={0.4} color="bw-aurora-teal" />
        <AtmosphericLayer type="orbs" intensity={0.2} color="bw-aurora-green" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Enhanced Section Header with Parallax Text */}
        <ScrollReveal className="mb-16 text-center" direction="up" distance={60} delay={0.2}>
          <ParallaxText speed={0.2}>
            <h2 className="mb-6 font-display text-display-lg">
              Ready to Create Something <span className="text-bw-accent-gold">Amazing</span>?
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <p className="mx-auto max-w-2xl font-primary text-body-xl">
              Let&apos;s discuss your vision and bring it to life with our expertise in visual
              storytelling.
            </p>
          </ScrollReveal>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Advanced Contact Form with Magnetic Effects */}
          <ScrollReveal direction="left" distance={50} delay={0.3}>
            <MagneticField strength={0.1} distance={200}>
              <div className="card">
                <h3 className="mb-6 font-primary text-heading-3">Start Your Project</h3>

                {csrfLoading ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-bw-accent-gold border-t-transparent" />
                    <p className="font-primary text-body-text opacity-85">
                      Initializing secure form...
                    </p>
                  </div>
                ) : !csrfToken ? (
                  <div className="py-12 text-center">
                    <ExclamationTriangleIcon className="mx-auto mb-4 h-16 w-16 text-red-400" />
                    <h4 className="mb-2 font-primary text-heading-3 text-red-400">
                      Security Error
                    </h4>
                    <p className="mb-4 font-primary text-body-text opacity-85">
                      Unable to initialize secure form. Please refresh the page.
                    </p>
                    <button onClick={() => window.location.reload()} className="btn-secondary">
                      Refresh Page
                    </button>
                  </div>
                ) : isSubmitted ? (
                  <MotionDiv
                    className="py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="mb-4 flex justify-center">
                      <CheckCircleIcon className="h-16 w-16 text-bw-accent-gold" />
                    </div>
                    <h4 className="mb-2 font-primary text-heading-3 text-bw-accent-gold">
                      Thank You!
                    </h4>
                    <p className="font-primary text-body-text opacity-85">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </MotionDiv>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                    aria-label="Contact form"
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-bw-text-primary"
                        >
                          Name *
                        </label>
                        <MagneticField strength={0.05} distance={80}>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            aria-invalid={formErrors.name ? 'true' : 'false'}
                            aria-describedby={formErrors.name ? 'name-error' : undefined}
                            className={`input-field ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                            placeholder="Your full name"
                          />
                        </MagneticField>
                        {formErrors.name && (
                          <MotionDiv
                            id="name-error"
                            className="mt-2 flex items-center gap-2 text-sm text-red-400"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            role="alert"
                            aria-live="polite"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                            {formErrors.name}
                          </MotionDiv>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-medium text-bw-text-primary"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          aria-invalid={formErrors.email ? 'true' : 'false'}
                          aria-describedby={formErrors.email ? 'email-error' : undefined}
                          className={`input-field ${formErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                          placeholder="your@email.com"
                        />
                        {formErrors.email && (
                          <MotionDiv
                            id="email-error"
                            className="mt-2 flex items-center gap-2 text-sm text-red-400"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            role="alert"
                            aria-live="polite"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                            {formErrors.email}
                          </MotionDiv>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-sm font-medium text-bw-text-secondary"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Your company name"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="projectType"
                          className="mb-2 block text-sm font-medium text-bw-text-secondary"
                        >
                          Project Type
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className="input-field"
                        >
                          <option value="">Select project type</option>
                          {projectTypes.map(type => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="budget"
                          className="mb-2 block text-sm font-medium text-bw-text-secondary"
                        >
                          Budget Range
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="input-field"
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map(range => (
                            <option key={range} value={range}>
                              {range}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-bw-text-secondary"
                      >
                        Project Details *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        aria-invalid={formErrors.message ? 'true' : 'false'}
                        aria-describedby={formErrors.message ? 'message-error' : undefined}
                        className={`input-field resize-none ${formErrors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Tell us about your project vision, goals, and any specific requirements..."
                      />
                      {formErrors.message && (
                        <MotionDiv
                          id="message-error"
                          className="mt-2 flex items-center gap-2 text-sm text-red-400"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          role="alert"
                          aria-live="polite"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                          {formErrors.message}
                        </MotionDiv>
                      )}
                    </div>

                    <MotionButton
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex w-full items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-bw-black border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </MotionButton>
                  </form>
                )}
              </div>
            </MagneticField>
          </ScrollReveal>

          {/* Contact Information */}
          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 font-primary text-heading-3">Get in Touch</h3>
                <p className="mb-8 font-primary text-body-text opacity-85">
                  Ready to bring your vision to life? We&apos;re here to help you create something
                  extraordinary. Reach out to discuss your project and let&apos;s start crafting
                  your story.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <MotionA
                    key={info.label}
                    href={info.href}
                    aria-label={`${info.label}: ${info.value}`}
                    className="group flex items-center gap-4 rounded-lg bg-bw-dark-gray p-4 transition-all duration-300 hover:bg-bw-medium-gray focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bw-gold/10 text-bw-gold transition-all duration-300 group-hover:bg-bw-gold group-hover:text-bw-black">
                      <info.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-bw-light-gray">{info.label}</p>
                      <p className="font-medium text-bw-white">{info.value}</p>
                    </div>
                  </MotionA>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-bw-gold/20 bg-gradient-to-br from-bw-gold/10 to-bw-silver/5 p-6">
                <h4 className="mb-3 font-semibold text-bw-white">Response Time</h4>
                <p className="text-bw-light-gray">
                  We typically respond to all inquiries within 24 hours. For urgent projects, please
                  call us directly.
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
