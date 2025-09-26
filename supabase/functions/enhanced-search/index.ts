import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  query: string;
  sources?: string[];
  filters?: any;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources = ['arxiv', 'semantic-scholar'], filters = {}, limit = 20 }: SearchParams = await req.json();
    
    console.log('Search request:', { query, sources, limit });

    // Enhance query with Grok if available
    const enhancedQuery = await enhanceQueryWithGrok(query);
    console.log('Enhanced query:', enhancedQuery);

    // Search multiple sources concurrently
    const searchPromises = sources.map(source => searchSource(source, enhancedQuery, filters, Math.min(limit, 10)));
    const sourceResults = await Promise.allSettled(searchPromises);

    // Aggregate results
    let allPapers: any[] = [];
    sourceResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        console.log(`${sources[index]} returned ${result.value.length} results`);
        allPapers = allPapers.concat(result.value);
      } else {
        console.error(`${sources[index]} search failed:`, result.status === 'rejected' ? result.reason : 'No results');
      }
    });

    // Deduplicate and sort results
    const deduplicatedPapers = deduplicatePapers(allPapers);
    const sortedPapers = deduplicatedPapers
      .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, limit);

    console.log(`Returning ${sortedPapers.length} deduplicated results`);

    return new Response(JSON.stringify({
      papers: sortedPapers,
      total: sortedPapers.length,
      enhancedQuery,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ 
      error: 'Search failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function enhanceQueryWithGrok(query: string): Promise<string> {
  const grokApiKey = Deno.env.get('GROK_API_KEY');
  
  if (!grokApiKey) {
    console.log('No Grok API key, using original query');
    return query;
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a research query optimizer. Enhance academic search queries by adding relevant keywords, synonyms, and technical terms. Return only the enhanced query, no explanation.'
          },
          {
            role: 'user',
            content: `Enhance this research query: "${query}"`
          }
        ],
        model: 'grok-beta',
        max_tokens: 100
      })
    });

    if (response.ok) {
      const data = await response.json();
      const enhanced = data.choices?.[0]?.message?.content?.trim();
      return enhanced || query;
    }
  } catch (error) {
    console.error('Grok enhancement failed:', error);
  }

  return query;
}

async function searchSource(source: string, query: string, filters: any, limit: number): Promise<any[]> {
  switch (source) {
    case 'arxiv':
      return searchArxiv(query, filters, limit);
    case 'semantic-scholar':
      return searchSemanticScholar(query, filters, limit);
    default:
      return [];
  }
}

async function searchArxiv(query: string, filters: any, limit: number): Promise<any[]> {
  try {
    const searchQuery = encodeURIComponent(query);
    const url = `http://export.arxiv.org/api/query?search_query=all:${searchQuery}&start=0&max_results=${limit}&sortBy=relevance&sortOrder=descending`;
    
    const response = await fetch(url);
    const xmlText = await response.text();
    
    return parseArxivXML(xmlText);
  } catch (error) {
    console.error('ArXiv search error:', error);
    return [];
  }
}

async function searchSemanticScholar(query: string, filters: any, limit: number): Promise<any[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&limit=${limit}&fields=paperId,title,abstract,authors,year,citationCount,journal,externalIds`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return (data.data || []).map((paper: any) => ({
      id: paper.paperId || `ss-${Date.now()}-${Math.random()}`,
      title: paper.title || 'Untitled',
      authors: paper.authors?.map((a: any) => a.name) || [],
      abstract: paper.abstract || '',
      source: 'Semantic Scholar',
      year: paper.year || new Date().getFullYear(),
      citationCount: paper.citationCount || 0,
      journal: paper.journal?.name || '',
      doi: paper.externalIds?.DOI || '',
      url: paper.paperId ? `https://www.semanticscholar.org/paper/${paper.paperId}` : '',
      pdfUrl: null
    }));
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

function parseArxivXML(xmlText: string): any[] {
  const papers: any[] = [];
  
  try {
    // Simple XML parsing for arXiv entries
    const entryRegex = /<entry>(.*?)<\/entry>/gs;
    const entries = xmlText.match(entryRegex) || [];
    
    entries.forEach(entry => {
      const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
      const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/s);
      const authorMatches = entry.match(/<name>(.*?)<\/name>/g) || [];
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const idMatch = entry.match(/<id>(.*?)<\/id>/);
      
      const authors = authorMatches.map(match => match.replace(/<\/?name>/g, '').trim());
      const arxivId = idMatch?.[1]?.split('/').pop()?.split('v')[0] || '';
      
      papers.push({
        id: arxivId || `arxiv-${Date.now()}-${Math.random()}`,
        title: titleMatch?.[1]?.trim().replace(/\s+/g, ' ') || 'Untitled',
        authors,
        abstract: summaryMatch?.[1]?.trim().replace(/\s+/g, ' ') || '',
        source: 'arXiv',
        year: publishedMatch?.[1] ? new Date(publishedMatch[1]).getFullYear() : new Date().getFullYear(),
        citationCount: 0,
        journal: 'arXiv preprint',
        doi: '',
        url: idMatch?.[1] || '',
        pdfUrl: idMatch?.[1]?.replace('abs', 'pdf') + '.pdf' || null
      });
    });
  } catch (error) {
    console.error('ArXiv XML parsing error:', error);
  }
  
  return papers;
}

function deduplicatePapers(papers: any[]): any[] {
  const seen = new Set();
  const unique: any[] = [];
  
  papers.forEach(paper => {
    const key = paper.title?.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    if (key && key.length > 10 && !seen.has(key)) {
      seen.add(key);
      unique.push(paper);
    }
  });
  
  return unique;
}