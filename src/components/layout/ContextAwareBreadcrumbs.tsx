'use client';

import { Breadcrumbs } from '@/components/seo';
import { usePageNavigation } from '@/hooks/useNavigationContext';

export function ContextAwareBreadcrumbs() {
  const { showBreadcrumbs, breadcrumbProps } = usePageNavigation();
  
  if (!showBreadcrumbs) return null;
  
  return (
    <div className="border-b border-bw-border-subtle bg-bw-bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <Breadcrumbs 
          className="text-sm" 
          {...breadcrumbProps}
        />
      </div>
    </div>
  );
}
