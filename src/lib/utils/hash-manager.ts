/**
 * Hash Management System for CSP Configuration
 * Manages loading, updating, and integrating collected hashes
 */

import fs from 'fs';
import path from 'path';

interface CSPHashData {
  version: string;
  lastUpdated: number;
  description: string;
  hashes: {
    common: string[];
    collected: string[];
    manual: string[];
  };
  components: Record<string, string[]>;
  stats: {
    totalCollected: number;
    lastCollectionRun: number;
    collectionDuration: number;
  };
}

// Define secure file path as a constant to avoid security warnings
const HASH_FILE_NAME = 'csp-hashes.json';
const HASH_FILE_DIR = 'src/lib/utils';

class HashManager {
  private readonly hashFilePath: string;
  private hashData: CSPHashData;

  constructor() {
    // Use a fixed path relative to the project root for security
    const projectRoot = path.resolve(__dirname, '../../../..');
    this.hashFilePath = path.join(projectRoot, HASH_FILE_DIR, HASH_FILE_NAME);

    // Validate that the path is within expected directory for security
    if (!this.hashFilePath.includes(path.join(HASH_FILE_DIR, HASH_FILE_NAME))) {
      throw new Error('Invalid hash file path for security reasons');
    }

    this.hashData = this.loadHashData();
  }

  /**
   * Load hash data from file
   */
  private loadHashData(): CSPHashData {
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      if (fs.existsSync(this.hashFilePath)) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const fileContent = fs.readFileSync(this.hashFilePath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch {
      // Failed to load hash data, using defaults
    }

    // Return default structure
    return {
      version: '1.0.0',
      lastUpdated: 0,
      description: 'Automatically collected CSP hashes for Framer Motion styles',
      hashes: {
        common: [
          "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
          "'sha256-tTgjrFAQDNcRW/9ebtwfDewCTgZMFnKpGa9tcHFyvcs='",
          "'sha256-E+XKxe8E3U03Zx3+QBwIsPqhP7hTQb0/u8HHYp6Kmoo='",
          "'sha256-yjeIWbfkHCqakGNfgINzQek4xBo2zW5+69GgakTPbVY='",
          "'sha256-HGYbL7c7YTMNrtcUQBvASpkCpnhcLdlW/2pKHJ8sJ98='",
        ],
        collected: [],
        manual: [],
      },
      components: {},
      stats: {
        totalCollected: 0,
        lastCollectionRun: 0,
        collectionDuration: 0,
      },
    };
  }

  /**
   * Save hash data to file
   */
  private saveHashData(): void {
    try {
      const jsonContent = JSON.stringify(this.hashData, null, 2);
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      fs.writeFileSync(this.hashFilePath, jsonContent, 'utf-8');
    } catch {
      // Failed to save hash data
    }
  }

  /**
   * Update collected hashes from browser storage
   */
  updateCollectedHashes(collectedHashes: string[]): void {
    const uniqueHashes = Array.from(new Set(collectedHashes));
    const newHashes = uniqueHashes.filter(
      hash =>
        !this.hashData.hashes.collected.includes(hash) &&
        !this.hashData.hashes.common.includes(hash)
    );

    if (newHashes.length > 0) {
      this.hashData.hashes.collected.push(...newHashes);
      this.hashData.lastUpdated = Date.now();
      this.hashData.stats.totalCollected = this.hashData.hashes.collected.length;
      this.hashData.stats.lastCollectionRun = Date.now();

      this.saveHashData();
    }
  }

  /**
   * Add manual hash (for specific cases)
   */
  addManualHash(hash: string, _description?: string): void {
    const formattedHash = hash.startsWith("'") ? hash : `'${hash}'`;

    if (!this.hashData.hashes.manual.includes(formattedHash)) {
      this.hashData.hashes.manual.push(formattedHash);
      this.hashData.lastUpdated = Date.now();

      this.saveHashData();
    }
  }

  /**
   * Remove hash from collection
   */
  removeHash(hash: string): void {
    const formattedHash = hash.startsWith("'") ? hash : `'${hash}'`;

    ['collected', 'manual'].forEach(category => {
      const index =
        this.hashData.hashes[category as keyof typeof this.hashData.hashes].indexOf(formattedHash);
      if (index > -1) {
        this.hashData.hashes[category as keyof typeof this.hashData.hashes].splice(index, 1);
      }
    });

    this.hashData.lastUpdated = Date.now();
    this.saveHashData();
  }

  /**
   * Get all hashes for CSP configuration
   */
  getAllHashes(): string[] {
    return this.hashData.hashes.common
      .concat(this.hashData.hashes.collected)
      .concat(this.hashData.hashes.manual);
  }

  /**
   * Get hashes by category
   */
  getHashesByCategory(): {
    common: string[];
    collected: string[];
    manual: string[];
    total: number;
  } {
    return {
      common: this.hashData.hashes.common.slice(),
      collected: this.hashData.hashes.collected.slice(),
      manual: this.hashData.hashes.manual.slice(),
      total: this.getAllHashes().length,
    };
  }

  /**
   * Clean up duplicate hashes
   */
  deduplicateHashes(): void {
    const allHashes = new Set<string>();
    let removedCount = 0;

    // Process each category
    ['common', 'collected', 'manual'].forEach(category => {
      const categoryHashes = this.hashData.hashes[category as keyof typeof this.hashData.hashes];
      const uniqueHashes: string[] = [];

      categoryHashes.forEach(hash => {
        if (!allHashes.has(hash)) {
          allHashes.add(hash);
          uniqueHashes.push(hash);
        } else {
          removedCount++;
        }
      });

      this.hashData.hashes[category as keyof typeof this.hashData.hashes] = uniqueHashes;
    });

    if (removedCount > 0) {
      this.hashData.lastUpdated = Date.now();
      this.saveHashData();
    }
  }

  /**
   * Get collection statistics
   */
  getStats(): {
    totalHashes: number;
    byCategory: Record<string, number>;
    lastUpdated: Date;
    lastCollectionRun: Date;
  } {
    const byCategory = {
      common: this.hashData.hashes.common.length,
      collected: this.hashData.hashes.collected.length,
      manual: this.hashData.hashes.manual.length,
    };

    return {
      totalHashes: this.getAllHashes().length,
      byCategory,
      lastUpdated: new Date(this.hashData.lastUpdated),
      lastCollectionRun: new Date(this.hashData.stats.lastCollectionRun),
    };
  }

  /**
   * Export hashes for development debugging
   */
  exportForDebugging(): {
    hashData: CSPHashData;
    formattedHashes: string;
    cspDirective: string;
  } {
    const allHashes = this.getAllHashes();
    const formattedHashes = allHashes.join(',\n      ');
    const cspDirective = `style-src 'self' 'nonce-{nonce}' https://fonts.googleapis.com 'unsafe-hashes' ${allHashes.join(' ')};`;

    return {
      hashData: this.hashData,
      formattedHashes,
      cspDirective,
    };
  }

  /**
   * Reset all collected hashes (keep common and manual)
   */
  resetCollectedHashes(): void {
    this.hashData.hashes.collected = [];
    this.hashData.stats.totalCollected = 0;
    this.hashData.lastUpdated = Date.now();

    this.saveHashData();
  }

  /**
   * Validate hash format
   */
  private isValidHash(hash: string): boolean {
    const hashPattern = /^'sha256-[A-Za-z0-9+/]+=*'$/;
    return hashPattern.test(hash);
  }

  /**
   * Validate and clean hash collection
   */
  validateAndCleanHashes(): void {
    let cleanedCount = 0;

    ['common', 'collected', 'manual'].forEach(category => {
      const categoryHashes = this.hashData.hashes[category as keyof typeof this.hashData.hashes];
      const validHashes = categoryHashes.filter(hash => {
        const isValid = this.isValidHash(hash);
        if (!isValid) {
          cleanedCount++;
        }
        return isValid;
      });

      this.hashData.hashes[category as keyof typeof this.hashData.hashes] = validHashes;
    });

    if (cleanedCount > 0) {
      this.hashData.lastUpdated = Date.now();
      this.saveHashData();
    }
  }
}

// Global instance
let hashManager: HashManager | null = null;

/**
 * Get or create the global hash manager instance
 */
export function getHashManager(): HashManager {
  hashManager ??= new HashManager();
  return hashManager;
}

/**
 * Load all hashes for CSP configuration
 */
export function loadCSPHashes(): string[] {
  return getHashManager().getAllHashes();
}

/**
 * Update hashes from collection
 */
export function updateHashCollection(collectedHashes: string[]): void {
  getHashManager().updateCollectedHashes(collectedHashes);
}

/**
 * Get hash collection statistics
 */
export function getHashStats() {
  return getHashManager().getStats();
}
