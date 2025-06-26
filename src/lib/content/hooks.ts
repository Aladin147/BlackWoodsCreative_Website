/**
 * Content Integration Hooks
 * 
 * React hooks for seamless content integration with placeholder fallbacks
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { logger } from '../utils/logger';

import {
  Content,
  ContentType,
  ContentStatus,
  contentManager,
  ContentUtils,
  TextContent,
  ImageContent,
  VideoContent,
  PortfolioContent,
  TestimonialContent,
  ServiceContent,
  TeamContent,
  BlogContent,
  PageContent
} from './placeholder-system';

// Hook options
export interface UseContentOptions {
  fallback?: Content;
  enableCache?: boolean;
  refreshInterval?: number;
  onError?: (error: Error) => void;
  onLoading?: (loading: boolean) => void;
}

// Content hook result
export interface UseContentResult<T extends Content> {
  content: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  update: (updates: Partial<T>) => Promise<boolean>;
  isPlaceholder: boolean;
  isProductionReady: boolean;
}

// Content array hook result
export interface UseContentArrayResult<T extends Content> {
  content: T[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  update: () => Promise<boolean>;
  isPlaceholder: boolean;
  isProductionReady: boolean;
}

// Main content hook
export function useContent<T extends Content>(
  id: string,
  options: UseContentOptions = {}
): UseContentResult<T> {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { fallback, refreshInterval, onError, onLoading } = options;

  // Load content function
  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      onLoading?.(true);
      setError(null);

      // Try to get content from manager
      let foundContent = contentManager.get<T>(id);

      // If not found and fallback provided, use fallback
      if (!foundContent && fallback) {
        foundContent = fallback as T;
        contentManager.register(foundContent);
      }

      setContent(foundContent);
      await Promise.resolve(); // Make function properly async
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load content');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  }, [id, fallback, onError, onLoading]);

  // Refresh content
  const refresh = useCallback(async () => {
    await loadContent();
  }, [loadContent]);

  // Update content
  const update = useCallback((updates: Partial<T>): Promise<boolean> => {
    try {
      const success = contentManager.update(id, updates);
      if (success) {
        const updatedContent = contentManager.get<T>(id);
        setContent(updatedContent);
      }
      return Promise.resolve(success);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update content');
      setError(error);
      onError?.(error);
      return Promise.resolve(false);
    }
  }, [id, onError]);

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Set up refresh interval if specified
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(refresh, refreshInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [refresh, refreshInterval]);

  // Memoized computed values
  const isPlaceholder = useMemo(() => {
    return content ? ContentUtils.isPlaceholder(content) : false;
  }, [content]);

  const isProductionReady = useMemo(() => {
    return content ? ContentUtils.isProductionReady(content) : false;
  }, [content]);

  return {
    content,
    loading,
    error,
    refresh,
    update,
    isPlaceholder,
    isProductionReady,
  };
}

// Hook for multiple content items by type
export function useContentByType<T extends Content>(
  type: ContentType,
  options: UseContentOptions = {}
): UseContentArrayResult<T> {
  const [content, setContent] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { onError, onLoading } = options;

  const loadContent = useCallback(() => {
    try {
      setLoading(true);
      onLoading?.(true);
      setError(null);

      const foundContent = contentManager.getByType<T>(type);
      setContent(foundContent);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load content');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  }, [type, onError, onLoading]);

  const refresh = useCallback(async () => {
    await loadContent();
  }, [loadContent]);

  const update = useCallback(async (): Promise<boolean> => {
    // For array updates, refresh the entire list
    await refresh();
    return true;
  }, [refresh]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const isPlaceholder = useMemo(() => {
    return content.some(item => ContentUtils.isPlaceholder(item));
  }, [content]);

  const isProductionReady = useMemo(() => {
    return content.every(item => ContentUtils.isProductionReady(item));
  }, [content]);

  return {
    content,
    loading,
    error,
    refresh,
    update,
    isPlaceholder,
    isProductionReady,
  };
}

// Specialized hooks for different content types
export function useTextContent(id: string, options?: UseContentOptions) {
  return useContent<TextContent>(id, options);
}

export function useImageContent(id: string, options?: UseContentOptions) {
  return useContent<ImageContent>(id, options);
}

export function useVideoContent(id: string, options?: UseContentOptions) {
  return useContent<VideoContent>(id, options);
}

export function usePortfolioContent(id?: string, options?: UseContentOptions) {
  const singleContent = useContent<PortfolioContent>(id ?? '', options);
  const typeContent = useContentByType<PortfolioContent>('portfolio', options);

  return id ? singleContent : typeContent;
}

export function useTestimonialContent(id?: string, options?: UseContentOptions) {
  const singleContent = useContent<TestimonialContent>(id ?? '', options);
  const typeContent = useContentByType<TestimonialContent>('testimonial', options);

  return id ? singleContent : typeContent;
}

export function useServiceContent(id?: string, options?: UseContentOptions) {
  const singleContent = useContent<ServiceContent>(id ?? '', options);
  const typeContent = useContentByType<ServiceContent>('service', options);

  return id ? singleContent : typeContent;
}

export function useTeamContent(id?: string, options?: UseContentOptions) {
  const singleContent = useContent<TeamContent>(id ?? '', options);
  const typeContent = useContentByType<TeamContent>('team', options);

  return id ? singleContent : typeContent;
}

export function useBlogContent(id?: string, options?: UseContentOptions) {
  const singleContent = useContent<BlogContent>(id ?? '', options);
  const typeContent = useContentByType<BlogContent>('blog', options);

  return id ? singleContent : typeContent;
}

export function usePageContent(id: string, options?: UseContentOptions) {
  return useContent<PageContent>(id, options);
}

// Hook for content status filtering
export function useContentByStatus(status: ContentStatus, options?: UseContentOptions) {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { onError, onLoading } = options ?? {};

  const loadContent = useCallback(() => {
    try {
      setLoading(true);
      onLoading?.(true);
      setError(null);

      const foundContent = contentManager.getByStatus(status);
      setContent(foundContent);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load content');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  }, [status, onError, onLoading]);

  const refresh = useCallback(async () => {
    await Promise.resolve();
    loadContent();
  }, [loadContent]);

  const update = useCallback(async (): Promise<boolean> => {
    await refresh();
    return true;
  }, [refresh]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const isPlaceholder = useMemo(() => {
    return status === 'placeholder';
  }, [status]);

  const isProductionReady = useMemo(() => {
    return status === 'published' || status === 'approved';
  }, [status]);

  return {
    content,
    loading,
    error,
    refresh,
    update,
    isPlaceholder,
    isProductionReady,
  };
}

// Hook for content search
export function useContentSearch(query: string, type?: ContentType) {
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    try {
      let allContent = contentManager.getAll();
      
      // Filter by type if specified
      if (type) {
        allContent = allContent.filter(content => content.type === type);
      }

      // Simple text search in metadata and content
      const searchResults = allContent.filter(content => {
        const searchText = query.toLowerCase();
        
        // Search in metadata
        if (content.metadata?.title?.toLowerCase().includes(searchText)) return true;
        if (content.metadata?.description?.toLowerCase().includes(searchText)) return true;
        if (content.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchText))) return true;
        
        // Search in content-specific fields
        if ('content' in content && typeof content.content === 'string') {
          return content.content.toLowerCase().includes(searchText);
        }
        
        if ('title' in content && typeof content.title === 'string') {
          return content.title.toLowerCase().includes(searchText);
        }
        
        if ('description' in content && typeof content.description === 'string') {
          return content.description.toLowerCase().includes(searchText);
        }
        
        return false;
      });

      setResults(searchResults);
    } catch (error) {
      logger.error('Content search error', { error });
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, type]);

  useEffect(() => {
    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  return { results, loading, search };
}

// Hook for content statistics
export function useContentStats() {
  const [stats, setStats] = useState({
    total: 0,
    byType: {} as Record<ContentType, number>,
    byStatus: {} as Record<ContentStatus, number>,
    placeholders: 0,
    published: 0,
  });

  const updateStats = useCallback(() => {
    const allContent = contentManager.getAll();
    
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    
    allContent.forEach(content => {
      byType[content.type] = (byType[content.type] ?? 0) + 1;
      byStatus[content.status] = (byStatus[content.status] ?? 0) + 1;
    });

    setStats({
      total: allContent.length,
      byType: byType as Record<ContentType, number>,
      byStatus: byStatus as Record<ContentStatus, number>,
      placeholders: byStatus.placeholder ?? 0,
      published: byStatus.published ?? 0,
    });
  }, []);

  useEffect(() => {
    updateStats();
    
    // Update stats periodically
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [updateStats]);

  return { stats, refresh: updateStats };
}
