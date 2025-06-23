import { useState, useEffect, useCallback } from 'react';

export interface MonitoringMetrics {
  requests: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    slowestRequest: number;
    fastestRequest: number;
    requestsByMethod: Record<string, number>;
    requestsByPath: Record<string, number>;
    requestsByStatus: Record<number, number>;
    errorsByType: Record<string, number>;
    securityEvents: number;
  };
  performance: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
    totalSize?: number;
    gzippedSize?: number;
    loadTime?: number;
    chunkCount?: number;
  };
  system: {
    uptime: number;
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
      arrayBuffers: number;
    };
    nodeVersion: string;
    platform: string;
  };
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    responseTime: boolean;
    errorRate: boolean;
    securityEvents: boolean;
  };
  metrics: {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    securityEvents: number;
  };
}

export interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  path: string;
  statusCode?: number;
  responseTime?: number;
  ip: string;
  userAgent: string;
  error?: string;
}

export function useRequestMonitoring() {
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/monitoring?type=metrics');
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring?type=health');
      if (!response.ok) {
        throw new Error(`Failed to fetch health: ${response.statusText}`);
      }

      const data = await response.json();
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
    }
  }, []);

  const fetchLogs = useCallback(async (limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/monitoring?type=logs&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }

      const data = await response.json();
      setLogs(data.logs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchErrorLogs = useCallback(async (limit = 20) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/monitoring?type=errors&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch error logs: ${response.statusText}`);
      }

      const data = await response.json();
      setLogs(data.errors ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch error logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSecurityLogs = useCallback(async (limit = 20) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/monitoring?type=security&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch security logs: ${response.statusText}`);
      }

      const data = await response.json();
      setLogs(data.securityEvents ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/api/monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken ?? '',
        },
        body: JSON.stringify({ action: 'clear-logs' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to clear logs: ${response.statusText}`);
      }

      // Refresh data after clearing
      await fetchMetrics();
      setLogs([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear logs');
    } finally {
      setIsLoading(false);
    }
  }, [fetchMetrics]);

  const exportLogs = useCallback(async (format: 'json' | 'csv' = 'json') => {
    try {
      setIsLoading(true);
      setError(null);

      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/api/monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken ?? '',
        },
        body: JSON.stringify({ action: 'export-logs', format }),
      });

      if (!response.ok) {
        throw new Error(`Failed to export logs: ${response.statusText}`);
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-export-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logCustomEvent = useCallback(async (event: string, data?: unknown) => {
    try {
      // Get CSRF token
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/api/monitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken ?? '',
        },
        body: JSON.stringify({
          action: 'log-custom-event',
          event,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to log custom event: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Failed to log custom event:', err);
    }
  }, []);

  // Auto-refresh health status
  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [fetchHealth]);

  return {
    metrics,
    health,
    logs,
    isLoading,
    error,
    fetchMetrics,
    fetchHealth,
    fetchLogs,
    fetchErrorLogs,
    fetchSecurityLogs,
    clearLogs,
    exportLogs,
    logCustomEvent,
  };
}
