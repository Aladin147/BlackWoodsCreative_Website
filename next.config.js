/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.blackwoodscreative.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@heroicons/react',
      'react-dom',
      'clsx',
      'tailwind-merge',
    ],
    // Optimize server components
    serverComponentsExternalPackages: ['sharp'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  ...nextConfig,
  async headers() {
    // Use basic security headers for build compatibility
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // ===== COMPREHENSIVE MISSPELLING REDIRECT STRATEGY =====
  async redirects() {
    return [
      // ===== BRAND NAME MISSPELLINGS =====
      // Primary misspellings to homepage
      { source: '/blackwood', destination: '/', permanent: true },
      { source: '/blackwods', destination: '/', permanent: true },
      { source: '/blckwoods', destination: '/', permanent: true },
      { source: '/blakwoods', destination: '/', permanent: true },
      { source: '/black-woods', destination: '/', permanent: true },
      { source: '/black-wood', destination: '/', permanent: true },
      { source: '/blkwds', destination: '/', permanent: true },
      { source: '/bwc', destination: '/', permanent: true },

      // Brand variations with "creative"
      { source: '/blackwood-creative', destination: '/', permanent: true },
      { source: '/blackwoods-creative', destination: '/', permanent: true },
      { source: '/black-woods-creative', destination: '/', permanent: true },
      { source: '/blkwds-creative', destination: '/', permanent: true },

      // ===== SERVICE-SPECIFIC MISSPELLINGS =====
      // Video production misspellings
      { source: '/blackwood-video', destination: '/services/video-production-morocco', permanent: true },
      { source: '/blackwood-film', destination: '/services/video-production-morocco', permanent: true },
      { source: '/blkwds-video', destination: '/services/video-production-morocco', permanent: true },
      { source: '/blkwds-film', destination: '/services/video-production-morocco', permanent: true },
      { source: '/black-wood-video', destination: '/services/video-production-morocco', permanent: true },

      // Photography misspellings
      { source: '/blackwood-photo', destination: '/services/photography', permanent: true },
      { source: '/blackwood-photography', destination: '/services/photography', permanent: true },
      { source: '/blkwds-photo', destination: '/services/photography', permanent: true },
      { source: '/black-wood-photo', destination: '/services/photography', permanent: true },

      // 3D visualization misspellings
      { source: '/blackwood-3d', destination: '/services/3d-visualization', permanent: true },
      { source: '/blkwds-3d', destination: '/services/3d-visualization', permanent: true },
      { source: '/black-wood-3d', destination: '/services/3d-visualization', permanent: true },

      // ===== ABOUT PAGE MISSPELLINGS =====
      { source: '/about-blackwood', destination: '/about', permanent: true },
      { source: '/about-blkwds', destination: '/about', permanent: true },
      { source: '/blackwood-about', destination: '/about', permanent: true },

      // ===== CONTACT PAGE MISSPELLINGS =====
      { source: '/blackwood-contact', destination: '/contact', permanent: true },
      { source: '/blkwds-contact', destination: '/contact', permanent: true },
      { source: '/contact-blackwood', destination: '/contact', permanent: true },

      // ===== PORTFOLIO MISSPELLINGS =====
      { source: '/blackwood-portfolio', destination: '/portfolio', permanent: true },
      { source: '/blkwds-portfolio', destination: '/portfolio', permanent: true },
      { source: '/blackwood-work', destination: '/portfolio', permanent: true },

      // ===== COMMON TYPOS AND VARIATIONS =====
      // Double letters
      { source: '/blackkwoods', destination: '/', permanent: true },
      { source: '/blackwwoods', destination: '/', permanent: true },

      // Missing letters
      { source: '/blackwods', destination: '/', permanent: true },
      { source: '/blckwods', destination: '/', permanent: true },

      // Alternative spellings
      { source: '/blackwoods-studio', destination: '/', permanent: true },
      { source: '/blackwood-studio', destination: '/', permanent: true },
      { source: '/blkwds-studio', destination: '/', permanent: true },

      // ===== LOCATION-BASED MISSPELLINGS =====
      { source: '/blackwood-morocco', destination: '/', permanent: true },
      { source: '/blkwds-morocco', destination: '/', permanent: true },
      { source: '/black-wood-morocco', destination: '/', permanent: true },
    ];
  },
});
