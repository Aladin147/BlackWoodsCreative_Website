import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'BlackWoods Creative - Premium visual storytelling through filmmaking, photography, and 3D visualization.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-bw-black via-bw-charcoal to-bw-black">
        <div className="text-center z-10">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-gradient-gold">
            BlackWoods Creative
          </h1>
          <p className="text-xl md:text-2xl text-bw-platinum mb-8 max-w-2xl mx-auto">
            Crafting Visual Stories That Captivate and Convert
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              View Our Work
            </button>
            <button className="btn-secondary">
              Start Your Project
            </button>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-bw-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bw-silver/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-24 px-4 bg-bw-charcoal">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">
            Our <span className="text-gradient-gold">Expertise</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Film', 'Photography', '3D Visualization', 'Scene Creation'].map((category) => (
              <div key={category} className="card group cursor-pointer">
                <div className="aspect-square bg-bw-dark-gray rounded-lg mb-4 flex items-center justify-center group-hover:bg-bw-medium-gray transition-colors duration-300">
                  <span className="text-4xl text-bw-gold">🎬</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <p className="text-bw-light-gray">
                  Professional {category.toLowerCase()} services that tell your story with impact.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 bg-bw-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Ready to Create Something <span className="text-gradient-gold">Amazing</span>?
          </h2>
          <p className="text-xl text-bw-light-gray mb-12 max-w-2xl mx-auto">
            Let&apos;s discuss your vision and bring it to life with our expertise in visual storytelling.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
              <p className="text-bw-light-gray mb-4">
                Ready to start your project? We&apos;d love to hear from you.
              </p>
              <button className="btn-primary w-full">
                Contact Us
              </button>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4">View Portfolio</h3>
              <p className="text-bw-light-gray mb-4">
                Explore our latest work and creative projects.
              </p>
              <button className="btn-secondary w-full">
                See Our Work
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
