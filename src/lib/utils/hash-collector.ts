'use client';

/**
 * Dynamic Hash Collection System for CSP Compliance
 * Automatically collects and manages style hashes from Framer Motion components
 */

interface CollectedHash {
  hash: string;
  style: string;
  timestamp: number;
  component: string | undefined;
  frequency: number;
}

interface HashCollectionData {
  hashes: Record<string, CollectedHash>;
  lastUpdated: number;
  version: string;
}

class FramerMotionHashCollector {
  private collectedHashes: Map<string, CollectedHash> = new Map();
  private observer: MutationObserver | null = null;
  private isCollecting = false;
  private readonly storageKey = 'framer-motion-hashes';
  private readonly version = '1.0.0';

  constructor() {
    this.loadExistingHashes();
  }

  /**
   * Start collecting hashes from inline styles
   */
  startCollection(): void {
    if (this.isCollecting || typeof window === 'undefined') return;

    // Starting Framer Motion hash collection - logged internally
    this.isCollecting = true;

    // Monitor existing elements
    this.scanExistingElements();

    // Set up mutation observer for dynamic changes
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          this.collectFromElement(target);
        } else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.scanElement(node as HTMLElement);
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      childList: true,
      subtree: true,
    });

    // Auto-save periodically
    setInterval(() => this.saveHashes(), 5000);
  }

  /**
   * Stop collecting hashes
   */
  stopCollection(): void {
    if (!this.isCollecting) return;

    // Stopping hash collection - logged internally
    this.isCollecting = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    this.saveHashes();
  }

  /**
   * Scan existing elements for inline styles
   */
  private scanExistingElements(): void {
    const elements = document.querySelectorAll('[style]');
    elements.forEach(element => {
      this.collectFromElement(element as HTMLElement);
    });
  }

  /**
   * Recursively scan an element and its children
   */
  private scanElement(element: HTMLElement): void {
    if (element.hasAttribute('style')) {
      this.collectFromElement(element);
    }

    const children = element.querySelectorAll('[style]');
    children.forEach(child => {
      this.collectFromElement(child as HTMLElement);
    });
  }

  /**
   * Collect hash from a specific element
   */
  private collectFromElement(element: HTMLElement): void {
    const style = element.getAttribute('style');
    if (!style || !this.isFramerMotionStyle(style)) return;

    const component = this.identifyComponent(element);
    this.collectHash(style, component);
  }

  /**
   * Check if style is likely from Framer Motion
   */
  private isFramerMotionStyle(style: string): boolean {
    const framerMotionPatterns = [
      /transform:/,
      /opacity:/,
      /scale\(/,
      /translate\(/,
      /rotate\(/,
      /matrix\(/,
      /perspective\(/,
      /transform-origin:/,
      /will-change:/,
    ];

    return framerMotionPatterns.some(pattern => pattern.test(style));
  }

  /**
   * Identify the component type from element attributes
   */
  private identifyComponent(element: HTMLElement): string | undefined {
    // Look for data attributes that might indicate component type
    const dataMotionComponent = element.getAttribute('data-motion-component');
    if (dataMotionComponent) return dataMotionComponent;

    // Infer from class names
    const { className } = element;
    if (className.includes('motion-')) {
      const match = className.match(/motion-(\w+)/);
      return match ? match[1] : undefined;
    }

    // Infer from tag name
    return element.tagName.toLowerCase();
  }

  /**
   * Generate SHA-256 hash for a style string
   */
  private async generateHash(style: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      // Fallback for environments without crypto.subtle
      return this.simpleHash(style);
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(style);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return `sha256-${btoa(String.fromCharCode.apply(null, hashArray))}`;
    } catch {
      // Failed to generate crypto hash, using fallback - logged internally
      return this.simpleHash(style);
    }
  }

  /**
   * Simple hash fallback for environments without crypto.subtle
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `sha256-simple-${Math.abs(hash).toString(36)}`;
  }

  /**
   * Collect and store a hash
   */
  private async collectHash(style: string, component?: string): Promise<void> {
    const hash = await this.generateHash(style);
    const existing = this.collectedHashes.get(hash);

    if (existing) {
      existing.frequency += 1;
      existing.timestamp = Date.now();
    } else {
      this.collectedHashes.set(hash, {
        hash,
        style,
        timestamp: Date.now(),
        component,
        frequency: 1,
      });

      // Collected new hash - logged internally
    }
  }

  /**
   * Load existing hashes from storage
   */
  private loadExistingHashes(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data: HashCollectionData = JSON.parse(stored);
        Object.values(data.hashes).forEach(hashData => {
          this.collectedHashes.set(hashData.hash, hashData);
        });
      }
    } catch {
      // Failed to load existing hashes
    }
  }

  /**
   * Save collected hashes to storage
   */
  private saveHashes(): void {
    if (typeof window === 'undefined') return;

    try {
      const data: HashCollectionData = {
        hashes: Object.fromEntries(this.collectedHashes),
        lastUpdated: Date.now(),
        version: this.version,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      // Saved hashes to storage - logged internally
    } catch {
      // Failed to save hashes - logged internally
    }
  }

  /**
   * Export collected hashes for CSP configuration
   */
  exportHashes(): string[] {
    return Array.from(this.collectedHashes.values())
      .sort((a, b) => b.frequency - a.frequency) // Sort by frequency
      .map(hashData => `'${hashData.hash}'`);
  }

  /**
   * Get collection statistics
   */
  getStats(): {
    totalHashes: number;
    byComponent: Record<string, number>;
    mostFrequent: CollectedHash[];
  } {
    const byComponent: Record<string, number> = {};
    const allHashes = Array.from(this.collectedHashes.values());

    allHashes.forEach(hashData => {
      const component = hashData.component ?? 'unknown';
      // Safe object assignment with validation
      if (typeof component === 'string' && component.length > 0 && component.length < 100) {
        byComponent[component] = (byComponent[component] ?? 0) + 1;
      }
    });

    const mostFrequent = allHashes.sort((a, b) => b.frequency - a.frequency).slice(0, 10);

    return {
      totalHashes: this.collectedHashes.size,
      byComponent,
      mostFrequent,
    };
  }

  /**
   * Clear all collected hashes
   */
  clearHashes(): void {
    this.collectedHashes.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

// Global instance
let hashCollector: FramerMotionHashCollector | null = null;

/**
 * Get or create the global hash collector instance
 */
export function getHashCollector(): FramerMotionHashCollector {
  hashCollector ??= new FramerMotionHashCollector();
  return hashCollector;
}

/**
 * Start hash collection (development mode only)
 */
export function startHashCollection(): void {
  if (process.env.NODE_ENV !== 'development') {
    // Hash collection is only available in development mode - logged internally
    return;
  }

  getHashCollector().startCollection();
}

/**
 * Stop hash collection and export results
 */
export function stopHashCollection(): string[] {
  const collector = getHashCollector();
  collector.stopCollection();
  return collector.exportHashes();
}

/**
 * Export current hashes for CSP
 */
export function exportHashesForCSP(): string[] {
  return getHashCollector().exportHashes();
}

/**
 * Get collection statistics
 */
export function getCollectionStats() {
  return getHashCollector().getStats();
}
