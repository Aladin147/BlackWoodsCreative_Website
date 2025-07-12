/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporarily disable ESLint during builds for under construction deployment
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  typescript: {
    // TypeScript validation enabled during builds for type safety
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@heroicons/react',
      'react-spring',
      'react-dom',
      'clsx',
      'tailwind-merge',
    ],
    // Enable modern JavaScript features for Next.js 15
    esmExternals: true,
    // Enable advanced optimizations for Next.js 15
    optimizeServerReact: true,
    serverMinification: true,
    // after API is now stable in Next.js 15 - no config needed
    // Enable static generation optimizations
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
    // Enable Server Components HMR cache for better dev performance
    serverComponentsHmrCache: true,
  },
  // Enable bundle analyzer for development
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-analyzer-report.html',
          })
        );
      }
      return config;
    },
  }),
  webpack: (config, { isServer }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Split framer-motion into its own chunk
          framerMotion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            chunks: 'all',
            priority: 30,
          },
          // Split large UI libraries
          uiLibraries: {
            name: 'ui-libraries',
            test: /[\\/]node_modules[\\/](@heroicons|@headlessui|@radix-ui)[\\/]/,
            chunks: 'all',
            priority: 25,
          },
          // Split animation libraries
          animations: {
            name: 'animations',
            test: /[\\/]node_modules[\\/](react-spring|@react-spring|motion)[\\/]/,
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }
    return config;
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
    // Enable SWC minification for better performance
    styledComponents: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Error handling improvements for development
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Stable in Next.js 15 - external packages configuration
  serverExternalPackages: ['sharp'],

  // Bundle optimization for better performance
  bundlePagesRouterDependencies: true,

  // Cache control for self-hosting improvements
  expireTime: 31536000, // 1 year in seconds
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Enhanced webpack optimizations for Next.js 15
  webpack: (config, { dev, isServer }) => {
    // Only apply client-side optimizations in production
    if (!dev && !isServer) {
      // Advanced chunk splitting for optimal performance
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // React and React-DOM in separate chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 30,
            reuseExistingChunk: true,
          },
          // Framer Motion in separate chunk for better caching
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Other UI libraries
          uiLibs: {
            test: /[\\/]node_modules[\\/](@heroicons|clsx|tailwind-merge)[\\/]/,
            name: 'ui-libs',
            priority: 20,
            reuseExistingChunk: true,
          },
          // General vendor chunk
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };

      // Enable tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Enable module concatenation for better minification
      config.optimization.concatenateModules = true;
    }

    // SVG optimization (both client and server)
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

// Bundle analyzer configuration - conditional import for Vercel compatibility
let withBundleAnalyzer;
try {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
} catch (error) {
  // Fallback if bundle analyzer is not available
  withBundleAnalyzer = config => config;
}

module.exports = withBundleAnalyzer({
  ...nextConfig,
  async headers() {
    // Enhanced security headers for Next.js 15 - comprehensive configuration
    return [
      {
        source: '/(.*)',
        headers: [
          // Core security headers (middleware handles CSP with nonce)
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
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
          {
            key: 'X-Download-Options',
            value: 'noopen',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
          // Enhanced Permissions Policy for Next.js 15
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=(), fullscreen=(self), picture-in-picture=(), web-share=(), clipboard-read=(), clipboard-write=(self)',
          },
          // Cross-Origin Policies for enhanced security
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // HSTS for production (conditional)
          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
      // Static assets caching
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Next.js static files
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images
      {
        source: '/assets/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // Fonts
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
      {
        source: '/blackwood-video',
        destination: '/services/video-production-morocco',
        permanent: true,
      },
      {
        source: '/blackwood-film',
        destination: '/services/video-production-morocco',
        permanent: true,
      },
      {
        source: '/blkwds-video',
        destination: '/services/video-production-morocco',
        permanent: true,
      },
      {
        source: '/blkwds-film',
        destination: '/services/video-production-morocco',
        permanent: true,
      },
      {
        source: '/black-wood-video',
        destination: '/services/video-production-morocco',
        permanent: true,
      },

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
