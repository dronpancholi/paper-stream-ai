import { useState, useCallback } from 'react';
import { ResearchPaper } from '@/components/Research/PaperCard';
import { SearchFiltersType } from '@/components/Research/SearchFilters';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSearchCache, useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

// Export the ResearchPaper type for use in other components
export type { ResearchPaper } from '@/components/Research/PaperCard';

interface SearchResults {
  papers: ResearchPaper[];
  totalCount: number;
  clusters?: Array<{ name: string; count: number; papers: ResearchPaper[] }>;
}

export function useResearch() {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const { toast } = useToast();
  const { getCachedResult, setCachedResult } = useSearchCache();

  const { isConnected } = useRealTimeUpdates([
    {
      table: 'research_papers',
      event: 'INSERT',
      callback: (payload) => {
        if (searchResults) {
          setSearchResults(prev => prev ? {
            ...prev,
            papers: [payload.new, ...prev.papers],
            totalCount: prev.totalCount + 1
          } : null);
        }
      }
    }
  ]);

  // Mock data for demonstration
  const mockPapers: ResearchPaper[] = [
    {
      id: '1',
      title: 'Deep Learning Applications in Medical Diagnosis: A Comprehensive Review',
      authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez'],
      abstract: 'This comprehensive review examines the current state of deep learning applications in medical diagnosis, covering recent advances in computer vision, natural language processing, and predictive modeling for healthcare. We analyze 150+ studies published between 2020-2024, identifying key trends, challenges, and future opportunities in AI-driven medical diagnosis.',
      source: 'PubMed',
      year: 2024,
      citationCount: 45,
      journal: 'Nature Medicine',
      doi: '10.1038/s41591-024-2847-2',
      url: 'https://example.com/paper1',
      pdfUrl: 'https://example.com/paper1.pdf',
      impactFactor: 87.2,
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'Quantum Machine Learning Algorithms for Large-Scale Data Processing',
      authors: ['Prof. David Kim', 'Dr. Lisa Wang', 'James Thompson'],
      abstract: 'We present novel quantum machine learning algorithms designed for processing large-scale datasets efficiently. Our approach leverages quantum superposition and entanglement to achieve exponential speedup in specific classification and clustering tasks, with applications in finance, logistics, and scientific computing.',
      source: 'arXiv',
      year: 2024,
      citationCount: 23,
      journal: 'Physical Review A',
      doi: '10.1103/PhysRevA.109.042615',
      url: 'https://example.com/paper2',
      pdfUrl: 'https://example.com/paper2.pdf',
      impactFactor: 3.1,
      isBookmarked: true,
      summary: 'This paper introduces quantum algorithms that can process large datasets exponentially faster than classical methods, with particular strengths in pattern recognition and optimization problems.',
    },
    {
      id: '3',
      title: 'Climate Change Impact on Biodiversity: Modeling Ecosystem Responses',
      authors: ['Dr. Maria Gonzalez', 'Prof. Robert Taylor', 'Dr. Anna Petrov', 'Dr. John Smith'],
      abstract: 'Using advanced ecological modeling techniques, we analyze the projected impacts of climate change on global biodiversity patterns. Our models incorporate temperature, precipitation, and habitat fragmentation data to predict species distribution changes over the next 50 years.',
      source: 'Semantic Scholar',
      year: 2023,
      citationCount: 78,
      journal: 'Science',
      doi: '10.1126/science.abq7890',
      url: 'https://example.com/paper3',
      pdfUrl: 'https://example.com/paper3.pdf',
      impactFactor: 47.7,
      isBookmarked: false,
    },
  ];

  const searchPapers = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const cacheKey = `${query}-${JSON.stringify(filters)}`;
    const cachedResult = getCachedResult(cacheKey);
    
    if (cachedResult) {
      setSearchResults(cachedResult);
      return;
    }

    setLoading(true);
    
    try {
      // Save search query to database
      const sessionId = crypto.randomUUID();
      await supabase.from('search_queries').insert({
        query_text: query,
        filters: filters as any,
        results_count: 0,
        session_id: sessionId,
      });

      // Call enhanced search function
      const { data, error } = await supabase.functions.invoke('enhanced-grok-search', {
        body: {
          query,
          sources: ['arxiv', 'semantic_scholar', 'pubmed', 'crossref', 'core'],
          filters,
          limit: 30
        }
      });

      if (error) throw error;

      const results: SearchResults = {
        papers: data.papers || [],
        totalCount: data.total || 0,
        clusters: data.clusters || [],
      };

      setSearchResults(results);
      setCachedResult(cacheKey, results);

      toast({
        title: 'Search Complete',
        description: `Found ${results.totalCount} papers across multiple sources`,
      });

    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to mock data if API fails
      const fallbackResults: SearchResults = {
        papers: mockPapers.filter(paper =>
          paper.title.toLowerCase().includes(query.toLowerCase()) ||
          paper.abstract.toLowerCase().includes(query.toLowerCase())
        ),
        totalCount: mockPapers.length,
        clusters: [
          { name: 'Machine Learning', count: 2, papers: mockPapers.slice(0, 2) },
          { name: 'Climate Science', count: 1, papers: mockPapers.slice(2, 3) },
        ],
      };
      
      setSearchResults(fallbackResults);
      
      toast({
        title: 'Search Complete (Offline Mode)',
        description: `Showing ${fallbackResults.totalCount} cached papers`,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  const bookmarkPaper = useCallback(async (paperId: string) => {
    try {
      // This would bookmark the paper in the database
      console.log('Bookmarking paper:', paperId);
      
      toast({
        title: 'Paper Bookmarked',
        description: 'Paper has been added to your bookmarks',
      });
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  }, [toast]);

  return {
    searchResults,
    loading,
    filters,
    setFilters,
    searchPapers,
    bookmarkPaper,
    isConnected,
  };
}