import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { FilmIcon, CameraIcon, CubeIcon } from '@heroicons/react/24/outline';
import { MagneticField, ScrollReveal, StaggeredGrid } from '@/components/interactive';
import { RelatedLinks } from '@/components/seo';
import { PageNavigation } from '@/components/navigation';
import { generateEnhancedOrganizationSchema } from '@/lib/utils/seo';

// SEO-optimized metadata for brand searches
const seoMetadata = {
  title: 'About BlackWoods Creative | Morocco\'s Leading Creative Studio Story',
  description: 'Discover the BlackWoods Creative story - Morocco\'s premier creative studio founded on visual excellence. Learn about BlackWoods\' journey, values, and commitment to exceptional creative services.',
  keywords: [
    'About BlackWoods',
    'BlackWoods Creative story',
    'BlackWoods history',
    'BlackWoods team',
    'BlackWoods Morocco',
    'BlackWoods studio',
    'BlackWoods company',
    'BlackWoods creative agency',
    'BlackWoods background',
    'BlackWoods mission',
    'BlackWoods vision',
    'BlackWoods values',
    'Morocco creative studio',
    'creative agency Morocco',
    'video production company Morocco',
    'photography studio Morocco',
    '3D visualization studio Morocco',
    'visual storytelling Morocco',
    'premium creative services Morocco',
    'professional creative team Morocco'
  ],
  canonical: 'https://blackwoodscreative.com/about',
  openGraph: {
    title: 'About BlackWoods Creative | Morocco\'s Leading Creative Studio',
    description: 'Discover the BlackWoods Creative story - Morocco\'s premier creative studio founded on visual excellence and innovative storytelling.',
    url: 'https://blackwoodscreative.com/about',
    images: [
      {
        url: '/assets/images/about-blackwoods-creative.jpg',
        width: 1200,
        height: 630,
        alt: 'About BlackWoods Creative - Morocco\'s Premier Creative Studio Team',
      },
    ],
  },
};

export const metadata: Metadata = generatePageMetadata(seoMetadata);

// Enhanced Structured Data with comprehensive misspelling coverage

export default function AboutPage() {
  return (
    <>
      {/* Enhanced Structured Data for Misspelling SEO Strategy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateEnhancedOrganizationSchema({
          "@type": ["Organization", "LocalBusiness"],
          "department": [
            {
              "@type": "Organization",
              "name": "BlackWoods Video Production",
              "description": "Professional video production department"
            },
            {
              "@type": "Organization",
              "name": "BlackWoods Photography",
              "description": "Commercial photography department"
            },
            {
              "@type": "Organization",
              "name": "BlackWoods 3D Visualization",
              "description": "3D modeling and visualization department"
            }
          ]
        })}
      />

      <main className="min-h-screen bg-bw-bg-primary">
      {/* Hero Section - Brand Focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bw-bg-primary via-bw-bg-secondary to-bw-bg-primary py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ScrollReveal>
              <h1 className="mb-6 font-display text-display-xl text-bw-text-primary">
                About <span className="text-bw-accent-gold">BlackWoods Creative</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mx-auto max-w-3xl font-primary text-body-xl text-bw-text-secondary">
                Morocco's premier creative studio, founded on the belief that exceptional visual storytelling
                can transform brands, captivate audiences, and drive meaningful results.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Brand Story Section - ASYMMETRICAL LAYOUT per Theme Guide */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <h2 className="mb-8 font-display text-display-lg text-bw-text-primary">
                  The <span className="text-bw-accent-gold">BlackWoods</span> Story
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="space-y-6 font-primary text-body-xl">
                  <p>
                    BlackWoods Creative was born from a passion for visual excellence and a vision to
                    elevate Morocco's creative landscape. Founded by a team of dedicated artists and
                    storytellers, we've grown into Morocco's leading creative studio.
                  </p>
                  <p>
                    What sets BlackWoods apart is our unwavering commitment to quality, innovation,
                    and authentic storytelling. Every project we undertake reflects our core belief
                    that great creative work should not only look exceptional but also drive real
                    business results.
                  </p>
                  <p>
                    From our state-of-the-art facilities in Mohammedia to our collaborative approach
                    with clients across Morocco and beyond, BlackWoods Creative continues to push
                    the boundaries of what's possible in visual storytelling.
                  </p>
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-5 flex items-center justify-center">
              <MagneticField strength={0.1} distance={100}>
                <ScrollReveal delay={0.4}>
                  <div className="card p-8 text-center">
                    <h3 className="mb-6 font-display text-display-md text-bw-text-primary">
                      BlackWoods by the Numbers
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="font-display text-display-lg font-bold text-bw-accent-gold">500+</div>
                        <div className="font-primary text-body-md text-bw-text-secondary">Projects Completed</div>
                      </div>
                      <div>
                        <div className="font-display text-display-lg font-bold text-bw-accent-gold">50+</div>
                        <div className="font-primary text-body-md text-bw-text-secondary">Happy Clients</div>
                      </div>
                      <div>
                        <div className="font-display text-display-lg font-bold text-bw-accent-gold">5+</div>
                        <div className="font-primary text-body-md text-bw-text-secondary">Years Experience</div>
                      </div>
                      <div>
                        <div className="font-display text-display-lg font-bold text-bw-accent-gold">10+</div>
                        <div className="font-primary text-body-md text-bw-text-secondary">Team Members</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </MagneticField>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview - Brand Context */}
      <section className="bg-bw-bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="mb-6 font-display text-display-lg text-bw-text-primary">
                What Makes <span className="text-bw-accent-gold">BlackWoods</span> Different
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="mx-auto max-w-3xl font-primary text-body-xl text-bw-text-secondary">
                BlackWoods Creative offers a comprehensive suite of creative services,
                all unified by our commitment to exceptional quality and innovative storytelling.
              </p>
            </ScrollReveal>
          </div>
          
          <StaggeredGrid
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            staggerDelay={0.15}
          >
            <MagneticField strength={0.2} distance={120}>
              <div className="card group cursor-pointer text-center">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bw-accent-gold/15 text-bw-accent-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-bw-accent-gold group-hover:text-bw-bg-primary">
                    <FilmIcon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="mb-6 font-primary text-display-md">
                  BlackWoods Video Production
                </h3>
                <p className="font-primary text-body-xl">
                  From corporate videos to brand films, BlackWoods delivers cinematic quality
                  that captivates audiences and drives results.
                </p>
              </div>
            </MagneticField>

            <MagneticField strength={0.2} distance={120}>
              <div className="card group cursor-pointer text-center">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bw-accent-gold/15 text-bw-accent-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-bw-accent-gold group-hover:text-bw-bg-primary">
                    <CameraIcon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="mb-6 font-primary text-display-md">
                  BlackWoods Photography
                </h3>
                <p className="font-primary text-body-xl">
                  Professional photography services that capture the essence of your brand
                  with BlackWoods' signature attention to detail.
                </p>
              </div>
            </MagneticField>

            <MagneticField strength={0.2} distance={120}>
              <div className="card group cursor-pointer text-center">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bw-accent-gold/15 text-bw-accent-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-bw-accent-gold group-hover:text-bw-bg-primary">
                    <CubeIcon className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="mb-6 font-primary text-display-md">
                  BlackWoods 3D Visualization
                </h3>
                <p className="font-primary text-body-xl">
                  Cutting-edge 3D modeling and visualization that brings concepts to life
                  with stunning realism and precision.
                </p>
              </div>
            </MagneticField>
          </StaggeredGrid>
        </div>
      </section>

      {/* Related Pages Section */}
      <section className="py-16 bg-bw-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RelatedLinks
            title="Explore More About BlackWoods"
            variant="grid"
            maxLinks={6}
            className="mb-12"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="mb-6 font-display text-display-lg text-bw-text-primary">
              Ready to Experience <span className="text-bw-accent-gold">BlackWoods</span> Creative?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mb-8 font-primary text-body-xl text-bw-text-secondary">
              Discover why leading brands choose BlackWoods Creative for their most important projects.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <MagneticField strength={0.3} distance={100}>
                <a
                  href="/contact"
                  className="btn-primary"
                >
                  Start Your BlackWoods Project
                </a>
              </MagneticField>
              <MagneticField strength={0.3} distance={100}>
                <a
                  href="/portfolio"
                  className="rounded-lg border border-bw-border-subtle px-8 py-3 font-medium text-bw-text-primary transition-all duration-300 hover:bg-bw-border-subtle hover:scale-105"
                >
                  View BlackWoods Portfolio
                </a>
              </MagneticField>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>

    {/* Context-Aware Page Navigation */}
    <PageNavigation />
    </>
  );
}
