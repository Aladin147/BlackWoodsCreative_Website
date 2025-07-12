'use client';

import React from 'react';

import { AnimationOptimizerProvider } from '@/lib/animation/performance-optimizer';

interface AnimationProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper for animation-related providers
 * This component handles the client/server boundary for animation providers
 */
export function AnimationProviders({ children }: AnimationProvidersProps) {
  return (
    <AnimationOptimizerProvider>
      {children}
    </AnimationOptimizerProvider>
  );
}
