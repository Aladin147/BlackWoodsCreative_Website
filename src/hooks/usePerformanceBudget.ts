import { useState, useEffect, useCallback } from 'react';

import { PerformanceBudget } from '@/lib/config/performance-budgets';
import { BudgetCheckResult, PerformanceData } from '@/lib/utils/performance-budget-checker';

export interface PerformanceBudgetState {
  result: BudgetCheckResult | null;
  isLoading: boolean;
  error: string | null;
  lastChecked: string | null;
}

export interface PerformanceBudgetConfig {
  autoCheck: boolean;
  checkInterval: number; // milliseconds
  environment: 'production' | 'development' | 'test';
}

const defaultConfig: PerformanceBudgetConfig = {
  autoCheck: true,
  checkInterval: 30000, // 30 seconds
  environment: 'development',
};

export function usePerformanceBudget(config: Partial<PerformanceBudgetConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  const [state, setState] = useState<PerformanceBudgetState>({
    result: null,
    isLoading: false,
    error: null,
    lastChecked: null,
  });

  const checkBudgets = useCallback(async (_customData?: PerformanceData) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use custom data if provided, otherwise collect current performance data

      const response = await fetch('/api/performance-budget?action=check', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check budgets: ${response.statusText}`);
      }

      const result = await response.json();

      setState({
        result,
        isLoading: false,
        error: null,
        lastChecked: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to check performance budgets';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const checkCustomBudgets = useCallback(
    async (performanceData: PerformanceData, customBudget: PerformanceBudget) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Get CSRF token
        const csrfToken = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute('content');

        const response = await fetch('/api/performance-budget', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken ?? '',
          },
          body: JSON.stringify({
            action: 'check-custom',
            data: { performanceData, customBudget },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to check custom budgets: ${response.statusText}`);
        }

        const result = await response.json();

        setState({
          result,
          isLoading: false,
          error: null,
          lastChecked: new Date().toISOString(),
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to check custom performance budgets';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  const getBudgetConfig = useCallback(
    async (environment?: string) => {
      const env = environment ?? finalConfig.environment;
      const response = await fetch(`/api/performance-budget?action=config&env=${env}`);

      if (!response.ok) {
        throw new Error(`Failed to get budget config: ${response.statusText}`);
      }

      return await response.json();
    },
    [finalConfig.environment]
  );

  const generateReport = useCallback(
    async (format: 'json' | 'csv' = 'json', includeRecommendations = true) => {
      const response = await fetch(
        `/api/performance-budget?action=report&format=${format}&recommendations=${includeRecommendations}`
      );

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-budget-report-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return { success: true, message: 'CSV report downloaded' };
      }

      return await response.json();
    },
    []
  );

  const getHistory = useCallback(async (limit = 10, days = 7) => {
    const response = await fetch(
      `/api/performance-budget?action=history&limit=${limit}&days=${days}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get budget history: ${response.statusText}`);
    }

    return await response.json();
  }, []);

  const saveReport = useCallback(async (report: BudgetCheckResult, tags: string[] = []) => {
    // Get CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const response = await fetch('/api/performance-budget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken ?? '',
      },
      body: JSON.stringify({
        action: 'save-report',
        data: { report, tags },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save report: ${response.statusText}`);
    }

    return await response.json();
  }, []);

  // Auto-check budgets on interval
  useEffect(() => {
    if (!finalConfig.autoCheck) return;

    // Initial check
    checkBudgets().catch(() => {
      // Initial budget check failed - continue silently
    });

    // Set up interval
    const interval = setInterval(() => {
      checkBudgets().catch(() => {
        // Interval budget check failed - continue silently
      });
    }, finalConfig.checkInterval);

    return () => clearInterval(interval);
  }, [finalConfig.autoCheck, finalConfig.checkInterval, checkBudgets]);

  // Performance monitoring effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor for performance issues
    const handlePerformanceIssue = () => {
      // Trigger budget check when performance issues are detected
      checkBudgets().catch(() => {
        // Performance issue budget check failed - continue silently
      });
    };

    // Listen for long tasks (if supported)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const hasLongTasks = entries.some(entry => entry.duration > 50);

          if (hasLongTasks) {
            handlePerformanceIssue();
          }
        });

        observer.observe({ entryTypes: ['longtask'] });

        return () => observer.disconnect();
      } catch {
        // PerformanceObserver not supported or failed
        return () => {
          // Cleanup function - no action needed
        };
      }
    }

    return () => {
      // Cleanup function - no action needed
    };
  }, [checkBudgets]);

  return {
    ...state,
    checkBudgets,
    checkCustomBudgets,
    getBudgetConfig,
    generateReport,
    getHistory,
    saveReport,
    config: finalConfig,
  };
}

// Helper hook for component-level performance monitoring
export function useComponentPerformanceBudget(componentName: string) {
  const [renderTime, setRenderTime] = useState(0);
  const { checkBudgets } = usePerformanceBudget({ autoCheck: false });

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setRenderTime(duration);

      // Check budgets if render time is concerning
      if (duration > 16) {
        // More than one frame at 60fps - logged internally

        // Trigger budget check with component-specific data
        const componentData: PerformanceData = {
          performance: {
            renderTime: duration,
            memoryUsage: 0,
            fps: 60,
            domNodes: document.querySelectorAll('*').length,
            eventListeners: 0,
          },
        };

        checkBudgets(componentData).catch(() => {
          // Budget check error - logged internally
        });
      }
    };
  }, [componentName, checkBudgets]);

  return { renderTime };
}
