/**
 * Simplified Content Hooks
 * 
 * Simple React hooks for content management without over-engineering
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

import { 
  ContentItem, 
  PortfolioItem, 
  TestimonialItem, 
  ServiceItem, 
  TeamMember,
  contentStore 
} from './simple-content';

// Simple content hook
export function useContent(id: string) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const item = contentStore.get(id);
    setContent(item);
    setLoading(false);
  }, [id]);

  const refresh = useCallback(() => {
    const item = contentStore.get(id);
    setContent(item);
  }, [id]);

  const update = useCallback((updates: Partial<ContentItem>) => {
    const success = contentStore.update(id, updates);
    if (success) {
      refresh();
    }
    return success;
  }, [id, refresh]);

  return {
    content,
    loading,
    refresh,
    update,
    isPlaceholder: content?.isPlaceholder ?? true,
  };
}

// Content by type hook
export function useContentByType<T extends ContentItem>(type: string) {
  const [content, setContent] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const items = contentStore.getByType<T>(type);
    setContent(items);
    setLoading(false);
  }, [type]);

  const refresh = useCallback(() => {
    const items = contentStore.getByType<T>(type);
    setContent(items);
  }, [type]);

  return {
    content,
    loading,
    refresh,
    hasPlaceholders: content.some(item => item.isPlaceholder),
    placeholderCount: content.filter(item => item.isPlaceholder).length,
    realContentCount: content.filter(item => !item.isPlaceholder).length,
  };
}

// Specialized hooks for different content types
export function useTextContent(id: string) {
  return useContent(id);
}

export function useImageContent(id: string) {
  return useContent(id);
}

export function usePortfolioItems() {
  return useContentByType<PortfolioItem>('portfolio');
}

export function usePortfolioItem(id: string) {
  const result = useContent(id);
  return {
    ...result,
    portfolio: result.content as PortfolioItem | null,
  };
}

export function useTestimonials() {
  return useContentByType<TestimonialItem>('testimonial');
}

export function useTestimonial(id: string) {
  const result = useContent(id);
  return {
    ...result,
    testimonial: result.content as TestimonialItem | null,
  };
}

export function useServices() {
  return useContentByType<ServiceItem>('service');
}

export function useService(id: string) {
  const result = useContent(id);
  return {
    ...result,
    service: result.content as ServiceItem | null,
  };
}

export function useTeamMembers() {
  return useContentByType<TeamMember>('team');
}

export function useTeamMember(id: string) {
  const result = useContent(id);
  return {
    ...result,
    teamMember: result.content as TeamMember | null,
  };
}

// Content statistics hook
export function useContentStats() {
  const [stats, setStats] = useState({
    total: 0,
    placeholders: 0,
    realContent: 0,
    byType: {} as Record<string, number>,
  });

  const refresh = useCallback(() => {
    const allContent = contentStore.getAll();
    const placeholders = allContent.filter(item => item.isPlaceholder);
    const realContent = allContent.filter(item => !item.isPlaceholder);
    
    const byType: Record<string, number> = {};
    allContent.forEach(item => {
      byType[item.type] = (byType[item.type] ?? 0) + 1;
    });

    setStats({
      total: allContent.length,
      placeholders: placeholders.length,
      realContent: realContent.length,
      byType,
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    stats,
    refresh,
  };
}

// Content search hook
export function useContentSearch(query: string) {
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const allContent = contentStore.getAll();
    const filtered = allContent.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase()) ||
      item.metadata?.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    setResults(filtered);
    setLoading(false);
  }, [query]);

  return {
    results,
    loading,
    count: results.length,
  };
}

// Portfolio category hook
export function usePortfolioByCategory(category?: 'film' | 'photography' | '3d' | 'scenes') {
  const { content: allPortfolio, loading, refresh } = usePortfolioItems();

  const filteredContent = category 
    ? allPortfolio.filter(item => item.category === category)
    : allPortfolio;

  return {
    content: filteredContent,
    loading,
    refresh,
    hasPlaceholders: filteredContent.some(item => item.isPlaceholder),
    categories: ['film', 'photography', '3d', 'scenes'] as const,
  };
}

// Featured portfolio hook
export function useFeaturedPortfolio() {
  const { content: allPortfolio, loading, refresh } = usePortfolioItems();

  const featuredContent = allPortfolio.filter(item => item.featured);

  return {
    content: featuredContent,
    loading,
    refresh,
    hasPlaceholders: featuredContent.some(item => item.isPlaceholder),
  };
}

// Content management hook for admin/editing
export function useContentManagement() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    const content = contentStore.getAll();
    setAllContent(content);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addContent = useCallback((item: ContentItem) => {
    contentStore.add(item);
    refresh();
  }, [refresh]);

  const updateContent = useCallback((id: string, updates: Partial<ContentItem>) => {
    const success = contentStore.update(id, updates);
    if (success) {
      refresh();
    }
    return success;
  }, [refresh]);

  const removeContent = useCallback((id: string) => {
    const success = contentStore.remove(id);
    if (success) {
      refresh();
    }
    return success;
  }, [refresh]);

  const exportContent = useCallback(() => {
    return contentStore.export();
  }, []);

  const importContent = useCallback((data: Record<string, ContentItem>) => {
    contentStore.import(data);
    refresh();
  }, [refresh]);

  return {
    content: allContent,
    loading,
    refresh,
    addContent,
    updateContent,
    removeContent,
    exportContent,
    importContent,
  };
}
