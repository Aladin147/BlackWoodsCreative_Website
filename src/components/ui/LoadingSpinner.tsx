'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        className={cn(
          'rounded-full border-2 border-bw-medium-gray border-t-bw-gold',
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <motion.p
          className="text-sm text-bw-light-gray"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('rounded-lg bg-bw-dark-gray', className)}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function PortfolioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-bw-dark-gray">
      <LoadingSkeleton className="aspect-[4/3] w-full" />
      <div className="p-6">
        <LoadingSkeleton className="mb-2 h-6 w-3/4" />
        <LoadingSkeleton className="mb-4 h-4 w-full" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <div className="mt-4 flex gap-2">
          <LoadingSkeleton className="h-6 w-16" />
          <LoadingSkeleton className="h-6 w-20" />
          <LoadingSkeleton className="h-6 w-14" />
        </div>
      </div>
    </div>
  );
}
