'use client';

import dynamic from 'next/dynamic';

// Simplified development monitoring - only essential tools
const DevelopmentMonitors = dynamic(
  () => {
    if (process.env.NODE_ENV !== 'development') {
      return Promise.resolve({ default: () => null });
    }
    // Only load essential monitoring in development
    return import('@/components/optimization/PerformanceMonitor').then(mod => ({
      default: mod.DevelopmentPerformanceTools || (() => null),
    }));
  },
  { ssr: false }
);

export default DevelopmentMonitors;
