'use client';

import React, { useEffect, useState } from 'react';

import {
  getHashCollector,
  startHashCollection,
  stopHashCollection,
  exportHashesForCSP,
  getCollectionStats,
} from '@/lib/utils/hash-collector';

type CollectionStats = ReturnType<typeof getCollectionStats>;

/**
 * Hook for managing hash collection in development mode
 */
export function useHashCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [stats, setStats] = useState<CollectionStats>({
    totalHashes: 0,
    byComponent: {},
    mostFrequent: [],
  });

  // Auto-start collection in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      try {
        startHashCollection();
        setIsCollecting(true);

        // Update stats periodically
        const interval = setInterval(() => {
          const currentStats = getCollectionStats();
          setStats(currentStats);
        }, 2000);

        return () => {
          clearInterval(interval);
        };
      } catch {
        // Failed to start hash collection - logged internally
        return () => {
          // Cleanup function - no action needed
        };
      }
    }

    return () => {
      // Cleanup function - no action needed
    };
  }, []);

  const startCollection = () => {
    try {
      startHashCollection();
      setIsCollecting(true);
    } catch {
      // Failed to start hash collection - logged internally
    }
  };

  const stopCollection = () => {
    try {
      const hashes = stopHashCollection();
      setIsCollecting(false);
      return hashes;
    } catch {
      return [];
    }
  };

  const exportHashes = () => {
    try {
      return exportHashesForCSP();
    } catch {
      return [];
    }
  };

  const clearHashes = () => {
    try {
      const collector = getHashCollector();
      collector.clearHashes();
      setStats({
        totalHashes: 0,
        byComponent: {},
        mostFrequent: [],
      });
    } catch {
      // Failed to clear hashes
    }
  };

  const downloadHashes = () => {
    try {
      const hashes = exportHashesForCSP();
      const data = {
        timestamp: new Date().toISOString(),
        hashes,
        stats: getCollectionStats(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `framer-motion-hashes-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Failed to download hashes
    }
  };

  return {
    isCollecting,
    stats,
    startCollection,
    stopCollection,
    exportHashes,
    clearHashes,
    downloadHashes,
    isEnabled: process.env.NODE_ENV === 'development',
  };
}

/**
 * Development-only hash collection debug component
 */
export function HashCollectionDebug() {
  const {
    isCollecting,
    stats,
    startCollection,
    stopCollection,
    clearHashes,
    downloadHashes,
    isEnabled,
  } = useHashCollection();

  if (!isEnabled) return null;

  const debugStyle: React.CSSProperties = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    zIndex: 9999,
    minWidth: '200px',
    border: '1px solid #333',
  };

  return (
    <div style={debugStyle}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🔍 Hash Collection</div>

      <div style={{ marginBottom: '8px' }}>
        Status: {isCollecting ? '🟢 Active' : '🔴 Inactive'}
      </div>

      <div style={{ marginBottom: '8px' }}>Hashes: {stats.totalHashes}</div>

      {Object.keys(stats.byComponent).length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <div>By Component:</div>
          {Object.entries(stats.byComponent).map(([component, count]) => (
            <div key={component} style={{ fontSize: '10px', marginLeft: '8px' }}>
              {component}: {count}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        <button
          onClick={isCollecting ? stopCollection : startCollection}
          className="cursor-pointer rounded border-none px-2 py-1 text-xs text-white"
          style={{
            background: isCollecting ? '#dc3545' : '#28a745',
          }}
        >
          {isCollecting ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={downloadHashes}
          className="cursor-pointer rounded border-none px-2 py-1 text-xs text-white"
          style={{ background: '#007bff' }}
        >
          Export
        </button>

        <button
          onClick={clearHashes}
          className="cursor-pointer rounded border-none px-2 py-1 text-xs text-black"
          style={{ background: '#ffc107' }}
        >
          Clear
        </button>
      </div>

      <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
        💡 Interact with the page to collect motion hashes
      </div>
    </div>
  );
}
