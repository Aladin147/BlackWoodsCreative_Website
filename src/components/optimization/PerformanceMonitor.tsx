'use client';

import { useEffect, useState } from 'react';

import { getSimplePerformanceMonitor } from '@/lib/utils/simple-performance-monitor';

interface SimpleMetrics {
  lcp: number;
  fid: number;
  cls: number;
  loadTime: number;
  domReady: number;
}

interface PerformanceStatus {
  score: number;
  issues: string[];
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<SimpleMetrics | null>(null);
  const [status, setStatus] = useState<PerformanceStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const monitor = getSimplePerformanceMonitor();

    // Collect metrics after page load
    const collectMetrics = () => {
      const currentMetrics = monitor.getMetrics();
      setMetrics(currentMetrics);

      // Get performance status
      const performanceStatus = monitor.getPerformanceScore();
      setStatus(performanceStatus);
    };

    // Initial collection after a delay
    const timer = setTimeout(collectMetrics, 3000);

    // Periodic updates
    const interval = setInterval(collectMetrics, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Keyboard shortcut to toggle visibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible || !metrics || !status) {
    return null;
  }

  const formatTime = (time: number) => `${(time / 1000).toFixed(1)}s`;
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-black/90 p-4 text-xs text-white shadow-lg backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-green-400">Performance Monitor</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      {/* Performance Score */}
      <div className="mb-3">
        <h4 className="mb-1 text-yellow-400">Performance Score</h4>
        <div className={`text-lg font-bold ${getScoreColor(status.score)}`}>{status.score}/100</div>
      </div>

      {/* Core Web Vitals */}
      <div className="mb-3">
        <h4 className="mb-1 text-blue-400">Core Web Vitals</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div>LCP: {formatTime(metrics.lcp)}</div>
          <div>FID: {metrics.fid.toFixed(0)}ms</div>
          <div>CLS: {metrics.cls.toFixed(3)}</div>
          <div>Load: {formatTime(metrics.loadTime)}</div>
        </div>
      </div>

      {/* Issues */}
      {status.issues.length > 0 && (
        <div className="mb-2">
          <h4 className="mb-1 text-red-400">Issues</h4>
          <div className="text-xs text-red-300">
            {status.issues.slice(0, 3).map((issue, i) => (
              <div key={i}>• {issue}</div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400">Press Ctrl+Shift+P to toggle</div>
    </div>
  );
}

// Simplified development tools - just the performance monitor
export function DevelopmentPerformanceTools() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <PerformanceMonitor />;
}
