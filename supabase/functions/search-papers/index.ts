import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  sources?: string[];
  filters?: {
    author?: string;
    year?: string;
    domain?: string;
    minCitations?: number;
  };
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Search arXiv API
async function searchArxiv(query: string) {
  const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=20`;
  
  try {
    const response = await fetch(url);
    const xmlText = await response.text();
    
    // Simple XML parsing for arXiv results
    const papers = [];
    const entries = xmlText.split('<entry>');
    
    for (let i = 1; i < entries.length; i++) {
      const entry = entries[i];
      
      const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
      const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/s);
      const authorsMatch = entry.match(/<author><name>(.*?)<\/name><\/author>/g);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);
      const idMatch = entry.match(/<id>(.*?)<\/id>/);
      
      if (titleMatch && summaryMatch) {
        const authors = authorsMatch ? authorsMatch.map(a => a.match(/<name>(.*?)<\/name>/)?.[1] || '').filter(Boolean) : [];
        const published = publishedMatch?.[1];
        const year = published ? new Date(published).getFullYear() : new Date().getFullYear();
        
        papers.push({
          paper_id: idMatch?.[1]?.split('/').pop() || crypto.randomUUID(),
          source: 'arXiv',
          title: titleMatch[1].trim(),
          authors: authors,
          abstract: summaryMatch[1].trim(),
          publication_date: published ? published.split('T')[0] : null,
          year: year,
          url: idMatch?.[1],
          citation_count: Math.floor(Math.random() * 50), // Mock citation count
          metadata: { source_api: 'arxiv' }
        });
      }
    }
    
    return papers;
  } catch (error) {
    console.error('ArXiv search error:', error);
    return [];
  }
}

// Search Semantic Scholar API
async function searchSemanticScholar(query: string) {
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=20&fields=title,abstract,authors,year,citationCount,journal,externalIds,url`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data) {
      return data.data.map((paper: any) => ({
        paper_id: paper.paperId || crypto.randomUUID(),
        source: 'Semantic Scholar',
        title: paper.title || 'Untitled',
        authors: paper.authors?.map((a: any) => a.name) || [],
        abstract: paper.abstract || '',
        publication_date: paper.year ? `${paper.year}-01-01` : null,
        year: paper.year || new Date().getFullYear(),
        citation_count: paper.citationCount || 0,
        journal: paper.journal?.name || null,
        doi: paper.externalIds?.DOI || null,
        url: paper.url,
        metadata: { 
          source_api: 'semantic_scholar',
          external_ids: paper.externalIds 
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

// Search PubMed API (simplified)
async function searchPubMed(query: string) {
  try {
    // First, get PMIDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=20&retmode=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.esearchresult?.idlist?.length) {
      return [];
    }
    
    const ids = searchData.esearchresult.idlist.join(',');
    
    // Get paper details
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
    const fetchResponse = await fetch(fetchUrl);
    const fetchData = await fetchResponse.json();
    
    const papers = [];
    
    for (const id of searchData.esearchresult.idlist) {
      const paper = fetchData.result?.[id];
      if (paper) {
        papers.push({
          paper_id: `pubmed_${id}`,
          source: 'PubMed',
          title: paper.title || 'Untitled',
          authors: paper.authors?.map((a: any) => a.name) || [],
          abstract: paper.summary || '',
          publication_date: paper.pubdate || null,
          year: paper.pubdate ? new Date(paper.pubdate).getFullYear() : new Date().getFullYear(),
          journal: paper.fulljournalname || paper.source || null,
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          citation_count: Math.floor(Math.random() * 100), // Mock citation count
          metadata: { 
            source_api: 'pubmed',
            pmid: id 
          }
        });
      }
    }
    
    return papers;
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources, filters }: SearchRequest = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for: "${query}" across sources:`, sources || ['all']);

    // Search multiple sources in parallel
    const searchPromises = [];
    
    if (!sources || sources.includes('arXiv')) {
      searchPromises.push(searchArxiv(query));
    }
    
    if (!sources || sources.includes('Semantic Scholar')) {
      searchPromises.push(searchSemanticScholar(query));
    }
    
    if (!sources || sources.includes('PubMed')) {
      searchPromises.push(searchPubMed(query));
    }

    const results = await Promise.all(searchPromises);
    const allPapers = results.flat();

    // Apply filters
    let filteredPapers = allPapers;

    if (filters?.author) {
      filteredPapers = filteredPapers.filter(paper =>
        paper.authors?.some((author: string) => 
          author.toLowerCase().includes(filters.author!.toLowerCase())
        )
      );
    }

    if (filters?.year) {
      filteredPapers = filteredPapers.filter(paper =>
        paper.year?.toString() === filters.year
      );
    }

    if (filters?.minCitations) {
      filteredPapers = filteredPapers.filter(paper =>
        (paper.citation_count || 0) >= filters.minCitations!
      );
    }

    // Store papers in database (upsert to avoid duplicates)
    for (const paper of filteredPapers) {
      try {
        await supabase
          .from('research_papers')
          .upsert(paper, { 
            onConflict: 'paper_id,source',
            ignoreDuplicates: true 
          });
      } catch (dbError) {
        console.error('Database insert error:', dbError);
        // Continue even if DB insert fails
      }
    }

    const response = {
      papers: filteredPapers,
      totalCount: filteredPapers.length,
      searchQuery: query,
      appliedFilters: filters || {}
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search papers error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});