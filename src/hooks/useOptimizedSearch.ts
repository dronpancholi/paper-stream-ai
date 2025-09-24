import { useState, useCallback, useMemo } from 'react';
import { debounce } from '@/utils/performance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  source: string;
  year: number;
  citationCount?: number;
  journal?: string;
  doi?: string;
  url?: string;
  pdfUrl?: string;
  summary?: string;
  critique?: string;
  impactFactor?: number;
  isBookmarked?: boolean;
}

export const useOptimizedSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const searchFunction = useCallback(async (query: string, sources: string[] = ['arxiv', 'semantic_scholar']) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-grok-search', {
        body: {
          query: query.trim(),
          sources,
          limit: 30
        }
      });

      if (error) throw error;

      const papers = data.papers?.map((paper: any) => ({
        id: paper.id || paper.paper_id || Math.random().toString(36),
        title: paper.title || 'Untitled',
        authors: Array.isArray(paper.authors) ? paper.authors : [],
        abstract: paper.abstract || '',
        source: paper.source || 'Unknown',
        year: paper.year || new Date().getFullYear(),
        citationCount: paper.citationCount || 0,
        journal: paper.journal || '',
        doi: paper.doi || '',
        url: paper.url || '',
        pdfUrl: paper.pdfUrl || '',
        impactFactor: paper.impactFactor,
        isBookmarked: false
      })) || [];

      setResults(papers);
      setTotal(data.total || papers.length);

    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search papers. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const debouncedSearch = useMemo(
    () => debounce(searchFunction, 300),
    [searchFunction]
  );

  const search = useCallback((query: string, sources?: string[]) => {
    debouncedSearch(query, sources);
  }, [debouncedSearch]);

  return {
    results,
    loading,
    total,
    search,
    clearResults: () => setResults([])
  };
};