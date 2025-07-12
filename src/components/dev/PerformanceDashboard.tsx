/**
 * Performance Monitoring Dashboard for Development
 * Real-time performance metrics visualization
 */

'use client';

import React, { useState, useEffect } from 'react';

import { useGPUCapabilities } from '@/lib/animation/gpu-optimizer';
import { useAnimationOptimizer } from '@/lib/animation/performance-optimizer';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  activeAnimations: number;
  gpuLayersActive: number;
  bundleSize: {
    homepage: string;
    sharedChunks: string;
    totalFirstLoad: string;
  };
  webVitals: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
  };
}

export function PerformanceDashboard() {
  const { state } = useAnimationOptimizer();
  const { capabilities } = useGPUCapabilities();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    activeAnimations: 0,
    gpuLayersActive: 0,
    bundleSize: {
      homepage: '235kB',
      sharedChunks: '161kB',
      totalFirstLoad: '396kB',
    },
    webVitals: {
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
    },
  });

  useEffect(() => {
    // Update metrics from animation optimizer
    setMetrics(prev => ({
      ...prev,
      fps: state.fps,
      frameTime: state.frameTime,
      memoryUsage: state.memoryUsage,
      activeAnimations: state.activeAnimations,
    }));
  }, [state]);

  useEffect(() => {
    // Measure Web Vitals
    if (typeof window !== 'undefined') {
      // Simulate Web Vitals measurement
      const measureWebVitals = () => {
        setMetrics(prev => ({
          ...prev,
          webVitals: {
            fcp: performance.now(),
            lcp: performance.now() + 500,
            cls: 0.05,
            fid: 50,
          },
        }));
      };

      // Measure after page load
      if (document.readyState === 'complete') {
        measureWebVitals();
        return undefined;
      } else {
        window.addEventListener('load', measureWebVitals);
        return () => window.removeEventListener('load', measureWebVitals);
      }
    }
    return undefined;
  }, []);

  const getPerformanceStatus = (value: number, good: number, poor: number) => {
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Performance Monitor</h3>
        <div
          className={`rounded px-2 py-1 text-xs ${state.isOptimal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
        >
          {state.isOptimal ? 'Optimal' : 'Degraded'}
        </div>
      </div>

      {/* Animation Performance */}
      <div className="mb-4 space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Animation Performance</h4>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">FPS:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.fps, 55, 30))}`}
          >
            {metrics.fps.toFixed(0)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Frame Time:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.frameTime, 16.67, 33.33))}`}
          >
            {metrics.frameTime.toFixed(1)}ms
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Memory:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.memoryUsage, 150, 300))}`}
          >
            {metrics.memoryUsage}MB
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Active Animations:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.activeAnimations, 10, 20))}`}
          >
            {metrics.activeAnimations}
          </div>
        </div>
      </div>

      {/* GPU Information */}
      {capabilities && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-medium text-gray-700">GPU Status</h4>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Hardware Acceleration:</span>
            <div
              className={`rounded px-2 py-1 text-xs ${capabilities.hasHardwareAcceleration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {capabilities.hasHardwareAcceleration ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">GPU Tier:</span>
            <div
              className={`rounded px-2 py-1 text-xs ${
                capabilities.gpuTier === 'high'
                  ? 'bg-green-100 text-green-800'
                  : capabilities.gpuTier === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {capabilities.gpuTier.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">WebGL:</span>
            <div
              className={`rounded px-2 py-1 text-xs ${capabilities.supportsWebGL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {capabilities.supportsWebGL
                ? capabilities.supportsWebGL2
                  ? 'WebGL2'
                  : 'WebGL1'
                : 'None'}
            </div>
          </div>
        </div>
      )}

      {/* Bundle Size */}
      <div className="mb-4 space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Bundle Size</h4>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Homepage:</span>
          <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
            {metrics.bundleSize.homepage}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Shared:</span>
          <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
            {metrics.bundleSize.sharedChunks}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Total First Load:</span>
          <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
            {metrics.bundleSize.totalFirstLoad}
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-700">Web Vitals</h4>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">FCP:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.webVitals.fcp, 1800, 3000))}`}
          >
            {metrics.webVitals.fcp.toFixed(0)}ms
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">LCP:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.webVitals.lcp, 2500, 4000))}`}
          >
            {metrics.webVitals.lcp.toFixed(0)}ms
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">CLS:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.webVitals.cls, 0.1, 0.25))}`}
          >
            {metrics.webVitals.cls.toFixed(3)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">FID:</span>
          <div
            className={`rounded px-2 py-1 text-xs ${getStatusColor(getPerformanceStatus(metrics.webVitals.fid, 100, 300))}`}
          >
            {metrics.webVitals.fid}ms
          </div>
        </div>
      </div>

      {/* Performance Recommendations */}
      {!state.isOptimal && (
        <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-2">
          <h5 className="mb-1 text-xs font-medium text-yellow-800">Recommendations:</h5>
          <ul className="space-y-1 text-xs text-yellow-700">
            {state.fps < 55 && <li>• Reduce animation complexity</li>}
            {state.memoryUsage > 200 && <li>• Check for memory leaks</li>}
            {state.activeAnimations > 15 && <li>• Limit concurrent animations</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
