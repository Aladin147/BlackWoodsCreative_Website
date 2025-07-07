import { Metadata } from 'next';

import {
  ContentPageTemplate,
  type ContentPageData,
  type SEOMetadata,
  generatePageMetadata,
} from '@/components/templates';

// SEO metadata
const seoMetadata: SEOMetadata = {
  title: 'Contact BlackWoods Creative | Video Production Services Morocco',
  description:
    'Contact BlackWoods Creative for professional video production, photography, and 3D visualization services in Morocco. Get your free consultation today.',
  keywords: [
    'contact BlackWoods Creative',
    'video production consultation Morocco',
    'get quote video production',
    'contact video company Morocco',
    'Mohammedia video production',
    'Casablanca video services',
    'free consultation Morocco',
  ],
  canonicalUrl: '/contact',
  openGraph: {
    title: 'Contact BlackWoods Creative | Professional Video Production Morocco',
    description:
      "Get in touch with Morocco's premier video production company. Free consultation and custom quotes available.",
    type: 'website',
  },
};

// Page content data
const pageData: ContentPageData = {
  hero: {
    title: 'Contact Us',
    subtitle: 'Ready to bring your vision to life?',
    description:
      "Get in touch with Morocco's premier video production team. We're here to discuss your project and provide expert guidance on achieving your goals.",
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  sections: [
    {
      id: 'contact-info',
      type: 'text',
      data: {
        title: 'Get In Touch',
        content: `
          <div class="grid md:grid-cols-2 gap-12">
            <div>
              <h3 class="text-xl font-bold mb-6 text-bw-accent-gold">Contact Information</h3>
              
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-6 h-6 mt-1">
                    <svg class="w-6 h-6 text-bw-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">Email</p>
                    <p class="text-bw-text-secondary">hello@blackwoodscreative.com</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-6 h-6 mt-1">
                    <svg class="w-6 h-6 text-bw-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">Phone</p>
                    <p class="text-bw-text-secondary">+212 625 55 37 68</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-6 h-6 mt-1">
                    <svg class="w-6 h-6 text-bw-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold">Address</p>
                    <p class="text-bw-text-secondary">MFADEL Business Center<br>Building O, Floor 5<br>Mohammedia, Morocco</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-8">
                <h4 class="font-bold mb-3">Business Hours</h4>
                <div class="space-y-1 text-sm text-bw-text-secondary">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                  <p><strong>Sunday:</strong> By appointment only</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-bold mb-6 text-bw-accent-gold">Send Us a Message</h3>
              
              <form class="space-y-6" action="https://formspree.io/f/mzzgagbb" method="POST">
                <div>
                  <label for="name" class="block text-sm font-medium mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    class="w-full px-4 py-3 border border-bw-border-subtle rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    class="w-full px-4 py-3 border border-bw-border-subtle rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label for="phone" class="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    class="w-full px-4 py-3 border border-bw-border-subtle rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold transition-colors"
                    placeholder="+212 XXX XXX XXX"
                  />
                </div>
                
                <div>
                  <label for="service" class="block text-sm font-medium mb-2">Service Interest</label>
                  <select 
                    id="service" 
                    name="service" 
                    class="w-full px-4 py-3 border border-bw-border-subtle rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="video-production">Video Production</option>
                    <option value="corporate-video">Corporate Video</option>
                    <option value="photography">Photography</option>
                    <option value="3d-visualization">3D Visualization</option>
                    <option value="brand-film">Brand Film</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label for="message" class="block text-sm font-medium mb-2">Project Details *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    class="w-full px-4 py-3 border border-bw-border-subtle rounded-lg focus:ring-2 focus:ring-bw-accent-gold focus:border-bw-accent-gold transition-colors resize-vertical"
                    placeholder="Tell us about your project, timeline, and goals..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  class="w-full bg-bw-accent-gold text-bw-bg-primary font-semibold py-3 px-6 rounded-lg hover:bg-bw-accent-gold/90 transition-colors focus:ring-2 focus:ring-bw-accent-gold focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        `,
      },
      styling: {
        background: 'primary',
        spacing: 'loose',
        maxWidth: 'wide',
      },
    },
    {
      id: 'why-choose-us',
      type: 'values',
      data: {
        title: 'Why Choose BlackWoods Creative?',
        description: "What sets us apart as Morocco's premier video production company",
        values: [
          {
            title: 'Free Consultation',
            description:
              'We provide detailed project consultation at no cost, helping you understand the best approach for your goals.',
            icon: 'HandRaisedIcon',
          },
          {
            title: 'Fast Response',
            description:
              'We respond to all inquiries within 24 hours, often much sooner. Your time is valuable, and we respect that.',
            icon: 'RocketLaunchIcon',
          },
          {
            title: 'Custom Solutions',
            description:
              'Every project is unique. We create tailored solutions that fit your specific needs, timeline, and budget.',
            icon: 'StarIcon',
          },
        ],
      },
      styling: {
        background: 'secondary',
        spacing: 'normal',
      },
    },
    {
      id: 'next-steps',
      type: 'text',
      data: {
        title: 'What Happens Next?',
        content: `
          <div class="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="w-12 h-12 bg-bw-accent-gold text-bw-bg-primary rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h4 class="font-bold mb-2">Initial Consultation</h4>
              <p class="text-sm text-bw-text-secondary">We discuss your project goals, timeline, and requirements in detail.</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-bw-accent-gold text-bw-bg-primary rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h4 class="font-bold mb-2">Custom Proposal</h4>
              <p class="text-sm text-bw-text-secondary">We create a detailed proposal with timeline, deliverables, and transparent pricing.</p>
            </div>
            <div>
              <div class="w-12 h-12 bg-bw-accent-gold text-bw-bg-primary rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">3</div>
              <h4 class="font-bold mb-2">Project Kickoff</h4>
              <p class="text-sm text-bw-text-secondary">Once approved, we begin production with regular updates throughout the process.</p>
            </div>
          </div>
        `,
      },
      styling: {
        background: 'accent',
        spacing: 'normal',
      },
    },
  ],
};

// Generate Next.js metadata using type-safe helper
export const metadata: Metadata = generatePageMetadata(seoMetadata);

export default function ContactPage() {
  return <ContentPageTemplate metadata={seoMetadata} data={pageData} />;
}
