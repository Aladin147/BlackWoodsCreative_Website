'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const UnderConstructionPage: React.FC = () => {

  return (
    <div className="min-h-screen bg-bw-bg-primary relative overflow-hidden">
      {/* Elegant Navigation Header */}
      <motion.header
        className="absolute top-0 left-0 right-0 z-50 px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-display text-2xl font-black text-bw-accent-gold group-hover:text-primary-400 transition-colors duration-300">
              BLKWDS
            </span>
            <span className="font-primary text-lg font-light text-bw-text-secondary ml-2 group-hover:text-bw-text-primary transition-colors duration-300">
              Creative
            </span>
          </Link>

          {/* Contact Info */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+212625553768"
              className="font-primary text-sm text-bw-text-secondary hover:text-bw-accent-gold transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (+212) 625 55 37 68
            </a>
            <a
              href="mailto:contact@blackwoodscreative.com"
              className="font-primary text-sm text-bw-text-secondary hover:text-bw-accent-gold transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </a>
          </div>
        </div>
      </motion.header>

      {/* Main Content Container */}
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Sophisticated Forest Haze Background - Subtle & Elegant */}
        <div className="absolute inset-0">
          {/* Primary aurora layer - very subtle */}
          <motion.div
            className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-bw-aurora-green/30 blur-3xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.4, 0.3],
              x: [0, 8, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
          {/* Secondary aurora layer */}
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-[700px] w-[700px] rounded-full bg-bw-aurora-teal/25 blur-3xl"
            animate={{
              scale: [1, 1.03, 1],
              opacity: [0.25, 0.35, 0.25],
              x: [0, -12, 0],
              y: [0, 8, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 6,
            }}
          />
          {/* Accent gold layer - very subtle */}
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-bw-accent-gold/8 blur-2xl"
            animate={{
              rotate: [0, 360],
              scale: [0.95, 1.02, 0.95],
              opacity: [0.08, 0.12, 0.08],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 3,
            }}
          />
        </div>

        {/* Main Content - Sophisticated Typography */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Logo/Brand - Elegant & Refined */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="mb-12"
          >
            <h1 className="font-display text-display-xl text-bw-text-primary mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-bw-accent-gold via-bw-accent-gold to-primary-400 bg-clip-text text-transparent drop-shadow-2xl">
                BlackWoods
              </span>
            </h1>
            <p className="font-primary text-body-xl text-bw-text-secondary font-light tracking-wide">
              Creative
            </p>
          </motion.div>

          {/* Main Message - Sophisticated & Elegant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="mb-16"
          >
            <h2 className="font-display text-display-lg text-bw-text-primary mb-8 tracking-tight">
              Crafting Excellence
            </h2>
            <p className="font-primary text-body-xl text-bw-text-secondary max-w-3xl mx-auto leading-relaxed">
              We&apos;re enhancing our digital presence to better showcase our
              <span className="text-bw-accent-gold font-medium"> cinematic storytelling</span>,
              <span className="text-primary-400 font-medium"> immersive 3D experiences</span>, and
              <span className="text-bw-aurora-bright font-medium"> creative vision</span>.
            </p>
          </motion.div>

          {/* Services Preview - Sophisticated Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div
              className="card bg-bw-aurora-green/10 backdrop-blur-sm border border-bw-border-subtle hover:border-primary-400/30 transition-all duration-300 group cursor-pointer p-6 rounded-xl"
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-bw-aurora-green/20 flex items-center justify-center mb-4 group-hover:bg-bw-aurora-green/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="font-primary text-display-md text-bw-text-primary mb-3">Cinematic Production</h3>
              <p className="font-primary text-body-lg text-bw-text-secondary leading-relaxed">Professional storytelling through film and video</p>
            </motion.div>

            <motion.div
              className="card bg-bw-aurora-teal/10 backdrop-blur-sm border border-bw-border-subtle hover:border-bw-accent-gold/30 transition-all duration-300 group cursor-pointer p-6 rounded-xl"
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-bw-aurora-teal/20 flex items-center justify-center mb-4 group-hover:bg-bw-aurora-teal/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-bw-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <h3 className="font-primary text-display-md text-bw-text-primary mb-3">3D Visualization</h3>
              <p className="font-primary text-body-lg text-bw-text-secondary leading-relaxed">Immersive design and architectural visualization</p>
            </motion.div>

            <motion.div
              className="card bg-bw-aurora-bright/10 backdrop-blur-sm border border-bw-border-subtle hover:border-bw-aurora-bright/30 transition-all duration-300 group cursor-pointer p-6 rounded-xl"
              whileHover={{
                y: -4,
                transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            >
              <div className="w-12 h-12 rounded-lg bg-bw-aurora-bright/20 flex items-center justify-center mb-4 group-hover:bg-bw-aurora-bright/30 transition-colors duration-300">
                <svg className="w-6 h-6 text-bw-aurora-bright" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103-.212-.207-.424-.315-.636m.315.636a3.383 3.383 0 0 1-.315-.636m0 0a56.697 56.697 0 0 1-1.907-.884c-.376-.194-.753-.389-1.126-.587M7.5 14.25v5.25c0 .414.336.75.75.75h4.992a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75H8.25a.75.75 0 0 0-.75.75Z" />
                </svg>
              </div>
              <h3 className="font-primary text-display-md text-bw-text-primary mb-3">Creative Direction</h3>
              <p className="font-primary text-body-lg text-bw-text-secondary leading-relaxed">Strategic vision and artistic guidance</p>
            </motion.div>
          </motion.div>

          {/* Contact Information - Sophisticated & Elegant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="card-elevated max-w-2xl mx-auto"
          >
            <h3 className="font-display text-display-lg text-bw-text-primary mb-8 text-center">Ready to Create Together?</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="tel:+212625553768"
                className="btn-primary inline-flex items-center gap-3 group"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <span className="font-primary font-medium">(+212) 625 55 37 68</span>
              </motion.a>
              <motion.a
                href="mailto:contact@blackwoodscreative.com"
                className="bg-bw-aurora-teal/30 hover:bg-bw-aurora-teal/40 text-bw-text-primary border border-bw-border-subtle hover:border-bw-accent-gold/30 px-6 py-3 rounded-lg font-primary font-medium transition-all duration-300 inline-flex items-center gap-3 group"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <span className="font-primary font-medium">Get in Touch</span>
              </motion.a>
            </div>
            <p className="font-primary text-body-lg text-bw-text-secondary mt-6 text-center leading-relaxed">
              Our team is ready to bring your creative vision to life
            </p>
          </motion.div>

          {/* Progress Indicator - Sophisticated & Subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="mt-16"
          >
            <p className="font-primary caption text-bw-text-secondary mb-6 tracking-wide">Enhancement Progress</p>
            <div className="w-full bg-bw-border-subtle/30 rounded-full h-1 max-w-sm mx-auto overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-bw-accent-gold/80 to-primary-400/80 h-1 rounded-full"
                initial={{ width: 0, opacity: 0.6 }}
                animate={{ width: "78%", opacity: 0.8 }}
                transition={{
                  duration: 2.5,
                  delay: 2,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            </div>
            <motion.p
              className="font-primary caption text-bw-text-secondary/70 mt-4 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              Launching Soon
            </motion.p>
          </motion.div>
        </div>

        {/* Footer - Elegant & Minimal */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 2.5,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <p className="font-primary caption text-bw-text-secondary/60 tracking-wide">
            © 2024 BlackWoods Creative
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
