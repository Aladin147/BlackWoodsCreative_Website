'use client';

import { useEffect, useState } from 'react';

// ✅ Direct imports to avoid webpack factory issues with dynamic imports
import { AtmosphericParticles } from '@/components/interactive/AtmosphericParticles';
import { MagneticCursor } from '@/components/interactive/MagneticCursor';

/**
 * Client-only wrapper for interactive components
 * Prevents hydration mismatches by only rendering on client-side
 * Uses dynamic imports to prevent webpack module factory issues
 */
export function ClientOnlyInteractives() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <>
      <AtmosphericParticles />
      <MagneticCursor />
    </>
  );
}
