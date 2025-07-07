'use client';

import { motion } from 'framer-motion';
import React, { Component } from 'react';

import { log } from '@/lib/utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // ErrorBoundary caught an error
    log.error('ErrorBoundary caught an error', error, { errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetError,
}: {
  error: Error | null;
  resetError: () => void;
}) {
  return (
    <motion.div
      className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-bw-dark-gray p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 text-6xl">⚠️</div>
      <h2 className="mb-4 text-display-md text-bw-white">Something went wrong</h2>
      <p className="mb-6 max-w-md text-body-xl text-bw-light-gray">
        We encountered an unexpected error. Please try refreshing the page or contact us if the
        problem persists.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-6 max-w-lg">
          <summary className="cursor-pointer text-sm text-bw-light-gray hover:text-bw-white">
            Error Details (Development)
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-bw-black p-4 text-left text-xs text-red-400">
            {error.message}
            {error.stack}
          </pre>
        </details>
      )}
      <motion.button
        onClick={resetError}
        className="btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
}

export default ErrorBoundary;
