/** @type {import('next').NextConfig} */
const nextConfig = {
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
    optimizePackageImports: ['framer-motion', '@heroicons/react'],
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
    try {
      // Import security utilities with proper path resolution
      const path = require('path');
      const securityPath = path.resolve(__dirname, 'src/lib/utils/security');
      const { getSecurityHeaders } = require(securityPath);

      // Get comprehensive security headers
      const securityHeaders = getSecurityHeaders();

      return [
        {
          source: '/(.*)',
          headers: Object.entries(securityHeaders).map(([key, value]) => ({
            key,
            value,
          })),
        },
      ];
    } catch (error) {
      console.warn('Security headers not available during build:', error.message);
      // Fallback to basic security headers
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
          ],
        },
      ];
    }
  },
});
