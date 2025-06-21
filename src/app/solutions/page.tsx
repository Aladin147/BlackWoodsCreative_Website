import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/utils/metadata';

// SEO-optimized metadata for "BlackWoods + interest" searches
const seoMetadata = {
  title: 'BlackWoods Creative Solutions | Video, Photography & 3D for Every Industry',
  description: 'Discover BlackWoods Creative solutions for every industry and interest. From BlackWoods video production to BlackWoods photography and 3D visualization - find your perfect creative solution.',
  keywords: [
    'BlackWoods solutions',
    'BlackWoods creative solutions',
    'BlackWoods video solutions',
    'BlackWoods photography solutions',
    'BlackWoods 3D solutions',
    'BlackWoods business solutions',
    'BlackWoods marketing solutions',
    'BlackWoods advertising',
    'BlackWoods branding',
    'BlackWoods design',
    'BlackWoods animation',
    'BlackWoods production',
    'BlackWoods studio',
    'BlackWoods agency',
    'BlackWoods Morocco solutions',
    'creative solutions Morocco',
    'video solutions Morocco',
    'photography solutions Morocco',
    '3D solutions Morocco',
    'visual solutions Morocco',
    'marketing solutions Morocco',
    'advertising solutions Morocco',
    'branding solutions Morocco',
    'design solutions Morocco'
  ],
  canonical: 'https://blackwoodscreative.com/solutions',
  openGraph: {
    title: 'BlackWoods Creative Solutions | Complete Visual Solutions for Every Need',
    description: 'Explore BlackWoods Creative solutions tailored to your industry and interests. Professional video, photography, and 3D visualization services.',
    url: 'https://blackwoodscreative.com/solutions',
    images: [
      {
        url: '/assets/images/blackwoods-solutions.jpg',
        width: 1200,
        height: 630,
        alt: 'BlackWoods Creative Solutions - Video, Photography & 3D Services',
      },
    ],
  },
};

export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-bw-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bw-bg-primary via-bw-bg-secondary to-bw-bg-primary py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 font-display text-display-2xl text-bw-text-primary">
              <span className="text-bw-accent-gold">BlackWoods</span> Creative Solutions
            </h1>
            <p className="mx-auto max-w-3xl text-body-xl text-bw-text-secondary">
              Whatever your creative needs, BlackWoods has the perfect solution. Explore our comprehensive 
              range of video, photography, and 3D services tailored to every industry and interest.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions by Interest */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-6 font-display text-display-lg text-bw-text-primary">
              <span className="text-bw-accent-gold">BlackWoods</span> Solutions by Interest
            </h2>
            <p className="mx-auto max-w-3xl text-body-lg text-bw-text-secondary">
              Find the perfect BlackWoods solution for your specific needs and interests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Business Solutions */}
            <div className="rounded-lg bg-bw-bg-secondary p-8">
              <div className="mb-4 text-display-md text-bw-accent-gold">💼</div>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                BlackWoods Business Solutions
              </h3>
              <p className="mb-6 text-body-md text-bw-text-secondary">
                Professional video production, corporate photography, and business presentations 
                that elevate your company's image and communication.
              </p>
              <ul className="space-y-2 text-body-sm text-bw-text-secondary">
                <li>• Corporate video production</li>
                <li>• Executive photography</li>
                <li>• Business presentations</li>
                <li>• Training videos</li>
              </ul>
            </div>

            {/* Marketing Solutions */}
            <div className="rounded-lg bg-bw-bg-secondary p-8">
              <div className="mb-4 text-display-md text-bw-accent-gold">📈</div>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                BlackWoods Marketing Solutions
              </h3>
              <p className="mb-6 text-body-md text-bw-text-secondary">
                Creative marketing content that drives engagement, builds brand awareness, 
                and converts prospects into customers.
              </p>
              <ul className="space-y-2 text-body-sm text-bw-text-secondary">
                <li>• Brand films and commercials</li>
                <li>• Social media content</li>
                <li>• Product photography</li>
                <li>• Marketing campaigns</li>
              </ul>
            </div>

            {/* Real Estate Solutions */}
            <div className="rounded-lg bg-bw-bg-secondary p-8">
              <div className="mb-4 text-display-md text-bw-accent-gold">🏢</div>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                BlackWoods Real Estate Solutions
              </h3>
              <p className="mb-6 text-body-md text-bw-text-secondary">
                Stunning architectural visualization, property photography, and virtual tours 
                that showcase properties in their best light.
              </p>
              <ul className="space-y-2 text-body-sm text-bw-text-secondary">
                <li>• 3D architectural visualization</li>
                <li>• Property photography</li>
                <li>• Virtual tours</li>
                <li>• Development presentations</li>
              </ul>
            </div>

            {/* E-commerce Solutions */}
            <div className="rounded-lg bg-bw-bg-secondary p-8">
              <div className="mb-4 text-display-md text-bw-accent-gold">🛒</div>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                BlackWoods E-commerce Solutions
              </h3>
              <p className="mb-6 text-body-md text-bw-text-secondary">
                Professional product photography and videos that increase sales and 
                improve customer experience in online stores.
              </p>
              <ul className="space-y-2 text-body-sm text-bw-text-secondary">
                <li>• Product photography</li>
                <li>• Product videos</li>
                <li>• 360° product views</li>
                <li>• Lifestyle photography</li>
              </ul>
            </div>

            {/* Event Solutions */}
            <div className="rounded-lg bg-bw-bg-secondary p-8">
              <div className="mb-4 text-display-md text-bw-accent-gold">🎉</div>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                BlackWoods Event Solutions
              </h3>
              <p className="mb-6 text-body-md text-bw-text-secondary">
                Comprehensive event coverage including live streaming, photography, 
                and post-event content creation.
              </p>
              <ul className="space-y-2 text-body-sm text-bw-text-secondary">
                <li>• Event videography</li>
                <li>• Live streaming</li>
                <li>• Event photography</li>
                <li>• Highlight reels</li>
              </ul>
            </div>

            {/* Education Solutions */}
            <div className="rounded-lg bg-bw-bg-secondary p-8">
              <div className="mb-4 text-display-md text-bw-accent-gold">🎓</div>
              <h3 className="mb-4 font-display text-display-sm text-bw-text-primary">
                BlackWoods Education Solutions
              </h3>
              <p className="mb-6 text-body-md text-bw-text-secondary">
                Educational content creation including training videos, course materials, 
                and interactive learning experiences.
              </p>
              <ul className="space-y-2 text-body-sm text-bw-text-secondary">
                <li>• Training videos</li>
                <li>• Educational content</li>
                <li>• Interactive presentations</li>
                <li>• Course materials</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="bg-bw-bg-secondary py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-6 font-display text-display-lg text-bw-text-primary">
              Industries We Serve
            </h2>
            <p className="mx-auto max-w-3xl text-body-lg text-bw-text-secondary">
              BlackWoods Creative solutions are trusted by leading companies across diverse industries in Morocco.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Technology</h4>
              <p className="text-body-sm text-bw-text-secondary">Software, SaaS, Tech startups</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Real Estate</h4>
              <p className="text-body-sm text-bw-text-secondary">Developers, Agencies, Architects</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Healthcare</h4>
              <p className="text-body-sm text-bw-text-secondary">Hospitals, Clinics, Medical devices</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Finance</h4>
              <p className="text-body-sm text-bw-text-secondary">Banks, Insurance, Fintech</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Education</h4>
              <p className="text-body-sm text-bw-text-secondary">Universities, Schools, Training</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Retail</h4>
              <p className="text-body-sm text-bw-text-secondary">E-commerce, Fashion, Consumer goods</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Tourism</h4>
              <p className="text-body-sm text-bw-text-secondary">Hotels, Travel, Hospitality</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-bw-text-primary">Manufacturing</h4>
              <p className="text-body-sm text-bw-text-secondary">Industrial, Automotive, Production</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-6 font-display text-display-lg text-bw-text-primary">
            Find Your Perfect <span className="text-bw-accent-gold">BlackWoods</span> Solution
          </h2>
          <p className="mb-8 text-body-lg text-bw-text-secondary">
            Ready to discover how BlackWoods Creative can solve your specific challenges? 
            Let's discuss your needs and create a custom solution.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="rounded-lg bg-bw-accent-gold px-8 py-3 font-medium text-bw-bg-primary transition-colors hover:bg-bw-accent-gold/90"
            >
              Get Your Custom BlackWoods Solution
            </a>
            <a
              href="/services"
              className="rounded-lg border border-bw-border-subtle px-8 py-3 font-medium text-bw-text-primary transition-colors hover:bg-bw-border-subtle"
            >
              Explore All BlackWoods Services
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
