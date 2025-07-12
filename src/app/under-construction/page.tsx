import React from 'react';
import { Metadata } from 'next';
import Head from 'next/head';

import { motion } from 'framer-motion';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'BlackWoods Creative - Coming Soon | Professional Video Production & 3D Services',
  description: 'BlackWoods Creative is upgrading our website to serve you better. Professional video production, 3D modeling, and creative services. Contact us at (+212) 625 55 37 68',
  keywords: 'blackwoods creative, video production, 3D modeling, film production, creative services, Morocco',
  robots: 'index, follow',
  openGraph: {
    title: 'BlackWoods Creative - Coming Soon',
    description: 'Professional video production and 3D services. Website under construction - contact us directly.',
    type: 'website',
    url: 'https://blackwoodscreative.com',
  },
  alternates: {
    canonical: 'https://blackwoodscreative.com',
  },
};

const UnderConstructionPage: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BlackWoods Creative",
    "alternateName": ["BLKWDS Creative", "Blackwood Creative", "Black Woods Creative"],
    "url": "https://blackwoodscreative.com",
    "telephone": "+212625553768",
    "description": "Professional video production, 3D modeling, and creative services",
    "serviceArea": {
      "@type": "Place",
      "name": "Morocco"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Creative Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Video Production"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "3D Modeling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Film Production"
          }
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                BLKWDS
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light">
              Creative
            </p>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Something Amazing is Coming
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re upgrading our digital presence to better showcase our
              <span className="text-emerald-400 font-semibold"> video production</span>,
              <span className="text-blue-400 font-semibold"> 3D modeling</span>, and
              <span className="text-purple-400 font-semibold"> creative services</span>.
            </p>
          </motion.div>

          {/* Services Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-emerald-400 text-2xl mb-3">🎬</div>
              <h3 className="text-white font-semibold mb-2">Video Production</h3>
              <p className="text-slate-400 text-sm">Professional filming and editing services</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-blue-400 text-2xl mb-3">🎯</div>
              <h3 className="text-white font-semibold mb-2">3D Modeling</h3>
              <p className="text-slate-400 text-sm">Cutting-edge 3D design and visualization</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-purple-400 text-2xl mb-3">✨</div>
              <h3 className="text-white font-semibold mb-2">Creative Direction</h3>
              <p className="text-slate-400 text-sm">Bringing your vision to life</p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Ready to Start Your Project?</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a 
                href="tel:+212625553768"
                className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>📞</span>
                (+212) 625 55 37 68
              </a>
              <a 
                href="mailto:contact@blackwoodscreative.com"
                className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>✉️</span>
                Get in Touch
              </a>
            </div>
            <p className="text-slate-400 mt-4 text-sm">
              Our team is ready to discuss your creative vision
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12"
          >
            <p className="text-slate-500 text-sm mb-4">Website Enhancement Progress</p>
            <div className="w-full bg-slate-700 rounded-full h-2 max-w-md mx-auto">
              <motion.div
                className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </div>
            <p className="text-slate-400 text-xs mt-2">Expected completion: Soon</p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <p className="text-slate-500 text-sm">
            © 2024 BlackWoods Creative. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default UnderConstructionPage;
