'use client';

import { motion } from 'framer-motion';

import { ScrollReveal, MagneticField } from '@/components/interactive';
import { SEOMetadata } from '@/lib/utils/metadata';

import { BasePageTemplate } from './BasePageTemplate';

// Service page specific data structure
export interface ServicePageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
    cta: {
      primary: { text: string; href: string };
      secondary?: { text: string; href: string };
    };
  };
  featuredAnswer: {
    question: string;
    answer: string; // 40-55 words for featured snippet
    details?: string[];
  };
  services?:
    | {
        title: string;
        description: string;
        offerings?: Array<{
          name: string;
          features: string[];
          popular?: boolean;
        }>;
      }
    | Array<{
        title: string;
        description: string;
        features: string[];
        benefits?: string[];
      }>;
  process?:
    | {
        title: string;
        steps: Array<{
          number: string;
          title: string;
          description: string;
        }>;
      }
    | Array<{
        step: number;
        title: string;
        description: string;
      }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    company: string;
    image?: string;
  }>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ServicePageTemplateProps {
  metadata: SEOMetadata;
  data: ServicePageData;
  className?: string;
}

/**
 * Service Page Template
 *
 * Specialized template for money question pages and service landing pages.
 * Optimized for featured snippets and local SEO.
 */
export function ServicePageTemplate({ metadata, data, className = '' }: ServicePageTemplateProps) {
  return (
    <BasePageTemplate metadata={metadata} layout="service" className={className}>
      {/* Hero Section */}
      <HeroSection data={data.hero} />

      {/* Featured Answer Section - Optimized for Featured Snippets */}
      <FeaturedAnswerSection data={data.featuredAnswer} />

      {/* Services Section */}
      {data.services && <ServicesSection data={data.services} />}

      {/* Process Section */}
      {data.process && <ProcessSection data={data.process} />}

      {/* Testimonials Section */}
      {data.testimonials && <TestimonialsSection data={data.testimonials} />}

      {/* FAQ Section */}
      {data.faq && <FAQSection data={data.faq} />}

      {/* CTA Section */}
      <CTASection />
    </BasePageTemplate>
  );
}

/**
 * Hero Section Component
 */
function HeroSection({ data }: { data: ServicePageData['hero'] }) {
  return (
    <section className="relative bg-bw-bg-primary px-6 py-32">
      <div className="mx-auto max-w-7xl text-center">
        <ScrollReveal direction="up" distance={60}>
          <h1 className="mb-6 font-display text-display-xl">{data.title}</h1>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} delay={0.2}>
          <p className="mx-auto mb-8 max-w-3xl text-body-xl text-bw-text-secondary">
            {data.subtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} delay={0.3}>
          <p className="mx-auto mb-12 max-w-4xl text-body-lg">{data.description}</p>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={30} delay={0.4}>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <MagneticField strength={0.2} distance={100}>
              <motion.a
                href={data.cta.primary.href}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {data.cta.primary.text}
              </motion.a>
            </MagneticField>

            {data.cta.secondary && (
              <MagneticField strength={0.15} distance={80}>
                <motion.a
                  href={data.cta.secondary.href}
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {data.cta.secondary.text}
                </motion.a>
              </MagneticField>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/**
 * Featured Answer Section - Optimized for Featured Snippets
 */
function FeaturedAnswerSection({ data }: { data: ServicePageData['featuredAnswer'] }) {
  return (
    <section className="relative bg-bw-bg-primary px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal direction="up" distance={40}>
          <div className="rounded-2xl bg-bw-border-subtle/20 p-8 lg:p-12">
            <h2 className="mb-6 text-center font-display text-display-lg">{data.question}</h2>

            {/* Featured snippet optimized answer */}
            <div className="mb-8 text-center">
              <p className="text-body-xl font-medium leading-relaxed">{data.answer}</p>
            </div>

            {/* Additional details */}
            {data.details && (
              <div className="space-y-4">
                {data.details.map((detail, index) => (
                  <ScrollReveal key={index} direction="up" distance={20} delay={index * 0.1}>
                    <div className="flex items-start gap-3">
                      <div className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-bw-accent-gold" />
                      <p className="text-body-lg">{detail}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/**
 * Services Section Component
 */
function ServicesSection({ data }: { data: ServicePageData['services'] }) {
  if (!data) return null;

  // Handle array format (legacy)
  if (Array.isArray(data)) {
    return (
      <section className="relative bg-bw-bg-primary px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.map((service, index) => (
              <ScrollReveal key={service.title} direction="up" distance={40} delay={index * 0.1}>
                <div className="rounded-2xl border border-bw-border-subtle bg-bw-border-subtle/10 p-8">
                  <h3 className="mb-4 font-display text-display-md">{service.title}</h3>
                  <p className="mb-6 text-body-lg text-bw-text-secondary">{service.description}</p>
                  {service.features && (
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-bw-accent-gold" />
                          <span className="text-body-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle object format (new)
  return (
    <section className="relative bg-bw-bg-primary px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up" distance={40} className="mb-16 text-center">
          <h2 className="mb-6 font-display text-display-lg">{data.title}</h2>
          <p className="mx-auto max-w-3xl text-body-xl text-bw-text-secondary">
            {data.description}
          </p>
        </ScrollReveal>

        {data.offerings && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.offerings.map((offering, index) => (
              <ScrollReveal key={offering.name} direction="up" distance={40} delay={index * 0.1}>
                <MagneticField strength={0.1} distance={120}>
                  <div
                    className={`relative rounded-2xl border p-8 ${
                      offering.popular
                        ? 'border-bw-accent-gold bg-bw-accent-gold/5'
                        : 'border-bw-border-subtle bg-bw-border-subtle/10'
                    }`}
                  >
                    {offering.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                        <span className="rounded-full bg-bw-accent-gold px-4 py-2 text-sm font-medium text-bw-bg-primary">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-8 text-center">
                      <h3 className="mb-4 font-display text-display-md">{offering.name}</h3>
                    </div>

                    <ul className="mb-8 space-y-3">
                      {offering.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-bw-accent-gold" />
                          <span className="text-body-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      className="w-full rounded-lg bg-bw-border-subtle px-6 py-3 font-medium text-bw-text-primary transition-colors hover:bg-bw-accent-gold hover:text-bw-bg-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </MagneticField>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Process Section Component
 */
function ProcessSection({ data }: { data: ServicePageData['process'] }) {
  if (!data) return null;

  // Handle array format (legacy)
  if (Array.isArray(data)) {
    return (
      <section className="relative bg-bw-bg-primary px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {data.map((step, index) => (
              <ScrollReveal key={step.step} direction="up" distance={40} delay={index * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bw-accent-gold/20">
                    <span className="text-display-md font-bold text-bw-accent-gold">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-display-sm mb-4 font-display">{step.title}</h3>
                  <p className="text-body-lg text-bw-text-secondary">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle object format (new)
  return (
    <section className="relative bg-bw-bg-primary px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up" distance={40} className="mb-16 text-center">
          <h2 className="mb-6 font-display text-display-lg">{data.title}</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((step, index) => (
            <ScrollReveal key={step.number} direction="up" distance={40} delay={index * 0.1}>
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bw-accent-gold/20">
                  <span className="text-display-md font-bold text-bw-accent-gold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-display-sm mb-4 font-display">{step.title}</h3>
                <p className="text-body-lg text-bw-text-secondary">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Placeholder components for other sections
 */
function TestimonialsSection({ data }: { data: ServicePageData['testimonials'] }) {
  if (!data) return null;

  return (
    <section className="relative bg-bw-bg-primary px-6 py-24">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-12 font-display text-display-lg">What Our Clients Say</h2>
        {/* Testimonials implementation - data available: {JSON.stringify(data)} */}
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: ServicePageData['faq'] }) {
  if (!data) return null;

  return (
    <section className="relative bg-bw-bg-primary px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center font-display text-display-lg">
          Frequently Asked Questions
        </h2>
        {/* FAQ implementation - data available: {JSON.stringify(data)} */}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative bg-bw-bg-primary px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 font-display text-display-lg">Ready to Get Started?</h2>
        <p className="mb-8 text-body-xl text-bw-text-secondary">
          Contact us today to discuss your project and get a custom quote.
        </p>
        <motion.a
          href="#contact"
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Project
        </motion.a>
      </div>
    </section>
  );
}
