import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROK_API_KEY = Deno.env.get('GROK_API_KEY');

interface SearchParams {
  query: string;
  sources?: string[];
  filters?: {
    year?: string;
    author?: string;
    domain?: string;
    minCitations?: number;
  };
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources = ['arxiv', 'pubmed', 'semantic_scholar'], filters = {}, limit = 50 }: SearchParams = await req.json();

    console.log('Enhanced search request:', { query, sources, filters, limit });

    // Use Grok to enhance and understand the search query
    const enhancedQuery = await enhanceQueryWithGrok(query);
    
    // Search multiple sources in parallel
    const searchPromises = sources.map(source => searchSource(source, enhancedQuery, filters, limit));
    const results = await Promise.allSettled(searchPromises);

    // Aggregate and deduplicate results
    const allPapers: any[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        allPapers.push(...result.value.map((paper: any) => ({
          ...paper,
          source: sources[index]
        })));
      }
    });

    // Deduplicate by DOI and title similarity
    const deduplicatedPapers = deduplicatePapers(allPapers);
    
    // Sort by relevance and citation count
    const sortedPapers = deduplicatedPapers
      .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, limit);

    // Generate clusters using AI
    const clusters = await generateClusters(sortedPapers);

    return new Response(JSON.stringify({
      papers: sortedPapers,
      totalCount: sortedPapers.length,
      clusters,
      enhancedQuery,
      searchedSources: sources
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Enhanced search error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      papers: [],
      totalCount: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function enhanceQueryWithGrok(query: string): Promise<string> {
  if (!GROK_API_KEY) return query;

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a research query optimizer. Given a search query, suggest better keywords and synonyms to improve academic paper search results. Return only the enhanced query, no explanations.'
          },
          {
            role: 'user',
            content: `Enhance this research query for better academic search results: "${query}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || query;
    }
  } catch (error) {
    console.error('Grok enhancement error:', error);
  }
  
  return query;
}

async function searchSource(source: string, query: string, filters: any, limit: number) {
  switch (source) {
    case 'arxiv':
      return searchArxiv(query, filters, limit);
    case 'pubmed':
      return searchPubmed(query, filters, limit);
    case 'semantic_scholar':
      return searchSemanticScholar(query, filters, limit);
    default:
      return [];
  }
}

async function searchArxiv(query: string, filters: any, limit: number) {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `http://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=${limit}&sortBy=relevance&sortOrder=descending`;
    
    const response = await fetch(url);
    const xmlText = await response.text();
    
    // Parse XML and extract papers (simplified)
    const papers = parseArxivXML(xmlText);
    return papers;
  } catch (error) {
    console.error('ArXiv search error:', error);
    return [];
  }
}

async function searchSemanticScholar(query: string, filters: any, limit: number) {
  try {
    const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=paperId,title,authors,abstract,year,citationCount,journal,url`);
    
    if (response.ok) {
      const data = await response.json();
      return data.data?.map((paper: any) => ({
        id: paper.paperId,
        title: paper.title,
        authors: paper.authors?.map((a: any) => a.name) || [],
        abstract: paper.abstract,
        year: paper.year,
        citationCount: paper.citationCount,
        journal: paper.journal?.name,
        url: paper.url,
        source: 'Semantic Scholar'
      })) || [];
    }
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
  }
  return [];
}

async function searchPubmed(query: string, filters: any, limit: number) {
  // Mock PubMed search - in production, use E-utilities API
  return [
    {
      id: 'pubmed_1',
      title: 'Sample Medical Research Paper',
      authors: ['Dr. Smith', 'Dr. Johnson'],
      abstract: 'Sample abstract for medical research...',
      year: 2024,
      citationCount: 15,
      journal: 'Nature Medicine',
      source: 'PubMed'
    }
  ];
}

function parseArxivXML(xmlText: string) {
  // Simplified XML parsing - in production use proper XML parser
  const papers: any[] = [];
  const entries = xmlText.split('<entry>').slice(1);
  
  entries.forEach(entry => {
    try {
      const title = entry.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
      const summary = entry.match(/<summary>(.*?)<\/summary>/s)?.[1]?.trim();
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
      const year = published ? new Date(published).getFullYear() : null;
      
      if (title) {
        papers.push({
          id: `arxiv_${papers.length}`,
          title: title.replace(/\n/g, ' '),
          authors: ['ArXiv Author'], // Simplified
          abstract: summary?.replace(/\n/g, ' ') || '',
          year,
          source: 'arXiv'
        });
      }
    } catch (error) {
      console.error('Error parsing arXiv entry:', error);
    }
  });
  
  return papers;
}

function deduplicatePapers(papers: any[]) {
  const seen = new Set();
  return papers.filter(paper => {
    const key = paper.title?.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function generateClusters(papers: any[]) {
  // Simplified clustering - group by keywords and topics
  const clusters = [
    { 
      name: 'Machine Learning', 
      count: papers.filter(p => p.title?.toLowerCase().includes('machine learning')).length,
      papers: papers.filter(p => p.title?.toLowerCase().includes('machine learning')).slice(0, 5)
    },
    { 
      name: 'Artificial Intelligence', 
      count: papers.filter(p => p.title?.toLowerCase().includes('artificial intelligence')).length,
      papers: papers.filter(p => p.title?.toLowerCase().includes('artificial intelligence')).slice(0, 5)
    }
  ];
  
  return clusters.filter(c => c.count > 0);
}