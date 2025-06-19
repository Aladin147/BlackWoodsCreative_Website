'use client';

import { useState } from 'react';
import { sanitizeFormData } from '@/lib/utils/sanitize';
import { motion } from 'framer-motion';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { validateEmail } from '@/lib/utils';
import {
  ScrollReveal,
  MagneticField,
  AtmosphericLayer,
  ParallaxText
} from '@/components/interactive';

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
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
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
      // Submit form data to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Handle validation errors from server
          setFormErrors(result.errors);
        } else {
          // Handle other errors (rate limiting, server errors, etc.)
          console.error('Form submission error:', result.message);
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
    } catch (error) {
      console.error('Network error:', error);
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
        <ScrollReveal className="text-center mb-16" direction="up" distance={60} delay={0.2}>
          <ParallaxText speed={0.2}>
            <h2 className="mb-6 text-display-lg font-display">
              Ready to Create Something <span className="text-bw-accent-gold">Amazing</span>?
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" distance={40} delay={0.4}>
            <p className="mx-auto max-w-2xl text-body-xl font-primary">
              Let&apos;s discuss your vision and bring it to life with our expertise in visual storytelling.
            </p>
          </ScrollReveal>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Advanced Contact Form with Magnetic Effects */}
          <ScrollReveal direction="left" distance={50} delay={0.3}>
            <MagneticField strength={0.1} distance={200}>
              <div className="card">
              <h3 className="mb-6 text-heading-3 font-primary">
                Start Your Project
              </h3>

              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-4 flex justify-center">
                    <CheckCircleIcon className="h-16 w-16 text-bw-accent-gold" />
                  </div>
                  <h4 className="mb-2 text-heading-3 font-primary text-bw-accent-gold">
                    Thank You!
                  </h4>
                  <p className="text-body-text font-primary opacity-85">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label="Contact form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-bw-text-primary mb-2">
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
                        <motion.div
                          id="name-error"
                          className="mt-2 flex items-center gap-2 text-red-400 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          role="alert"
                          aria-live="polite"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                          {formErrors.name}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-bw-text-primary mb-2">
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
                        <motion.div
                          id="email-error"
                          className="mt-2 flex items-center gap-2 text-red-400 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          role="alert"
                          aria-live="polite"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                          {formErrors.email}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-bw-text-secondary mb-2">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium text-bw-text-secondary mb-2">
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
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-bw-text-secondary mb-2">
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
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-bw-text-secondary mb-2">
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
                      <motion.div
                        id="message-error"
                        className="mt-2 flex items-center gap-2 text-red-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        role="alert"
                        aria-live="polite"
                      >
                        <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />
                        {formErrors.message}
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-bw-black border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
              </div>
            </MagneticField>
          </ScrollReveal>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-heading-3 font-primary">
                  Get in Touch
                </h3>
                <p className="text-body-text font-primary opacity-85 mb-8">
                  Ready to bring your vision to life? We&apos;re here to help you create something extraordinary.
                  Reach out to discuss your project and let&apos;s start crafting your story.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    aria-label={`${info.label}: ${info.value}`}
                    className="flex items-center gap-4 p-4 rounded-lg bg-bw-dark-gray hover:bg-bw-medium-gray focus:outline-none focus:ring-2 focus:ring-bw-gold focus:ring-opacity-50 transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bw-gold/10 text-bw-gold group-hover:bg-bw-gold group-hover:text-bw-black transition-all duration-300">
                      <info.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm text-bw-light-gray">{info.label}</p>
                      <p className="font-medium text-bw-white">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-bw-gold/10 to-bw-silver/5 border border-bw-gold/20">
                <h4 className="mb-3 font-semibold text-bw-white">
                  Response Time
                </h4>
                <p className="text-bw-light-gray">
                  We typically respond to all inquiries within 24 hours. For urgent projects,
                  please call us directly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
