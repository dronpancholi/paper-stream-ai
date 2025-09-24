import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const { query, sources = ['arxiv', 'semantic_scholar', 'pubmed'], filters = {}, limit = 20 }: SearchParams = await req.json();
    
    console.log('Enhanced search request:', { query, sources, filters, limit });

    const enhancedQuery = await enhanceQueryWithGrok(query);
    console.log('Enhanced query:', enhancedQuery);

    const searchPromises = sources.map(source => searchSource(source, enhancedQuery, filters, Math.ceil(limit / sources.length)));
    const results = await Promise.allSettled(searchPromises);
    
    let allPapers: any[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allPapers = [...allPapers, ...result.value];
        console.log(`${sources[index]} returned ${result.value.length} papers`);
      } else {
        console.error(`Error from ${sources[index]}:`, result.reason);
      }
    });

    const deduplicatedPapers = deduplicatePapers(allPapers);
    const sortedPapers = deduplicatedPapers
      .sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
      .slice(0, limit);

    const clusters = await generateClusters(sortedPapers);

    return new Response(JSON.stringify({
      papers: sortedPapers,
      total: sortedPapers.length,
      clusters,
      enhanced_query: enhancedQuery,
      sources_used: sources
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ 
      error: 'Search failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function enhanceQueryWithGrok(query: string): Promise<string> {
  const grokApiKey = Deno.env.get('GROK_API_KEY');
  if (!grokApiKey) {
    console.log('Grok API key not found, using original query');
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
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that enhances academic search queries. Improve the given query by adding relevant synonyms, technical terms, and related keywords that would help find more comprehensive research papers. Return only the enhanced query, nothing else.'
          },
          {
            role: 'user',
            content: `Enhance this research query: "${query}"`
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedQuery = data.choices[0]?.message?.content?.trim() || query;
    
    return enhancedQuery;
  } catch (error) {
    console.error('Grok enhancement error:', error);
    return query;
  }
}

async function searchSource(source: string, query: string, filters: any, limit: number) {
  switch (source) {
    case 'arxiv':
      return await searchArxiv(query, filters, limit);
    case 'semantic_scholar':
      return await searchSemanticScholar(query, filters, limit);
    case 'pubmed':
      return await searchPubMed(query, filters, limit);
    case 'crossref':
      return await searchCrossRef(query, filters, limit);
    case 'core':
      return await searchCore(query, filters, limit);
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
    return parseArxivXML(xmlText);
  } catch (error) {
    console.error('ArXiv search error:', error);
    return [];
  }
}

async function searchSemanticScholar(query: string, filters: any, limit: number) {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${limit}&fields=paperId,title,abstract,authors,year,citationCount,journal,url,openAccessPdf`;
    
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data?.map((paper: any) => ({
      id: paper.paperId || Math.random().toString(36),
      paper_id: paper.paperId || Math.random().toString(36),
      title: paper.title || 'Untitled',
      authors: paper.authors?.map((a: any) => a.name) || [],
      abstract: paper.abstract || '',
      source: 'Semantic Scholar',
      year: paper.year || new Date().getFullYear(),
      citationCount: paper.citationCount || 0,
      journal: paper.journal?.name || '',
      url: paper.url || '',
      pdfUrl: paper.openAccessPdf?.url || '',
    })) || [];
  } catch (error) {
    console.error('Semantic Scholar search error:', error);
    return [];
  }
}

async function searchPubMed(query: string, filters: any, limit: number) {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.esearchresult?.idlist?.length) return [];
    
    const ids = searchData.esearchresult.idlist.join(',');
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();
    
    return Object.values(summaryData.result || {})
      .filter((item: any) => item.uid)
      .map((paper: any) => ({
        id: paper.uid,
        paper_id: paper.uid,
        title: paper.title || 'Untitled',
        authors: paper.authors?.map((a: any) => a.name) || [],
        abstract: '',
        source: 'PubMed',
        year: parseInt(paper.pubdate?.substring(0, 4)) || new Date().getFullYear(),
        citationCount: 0,
        journal: paper.source || '',
        url: `https://pubmed.ncbi.nlm.nih.gov/${paper.uid}/`,
        pdfUrl: ''
      }));
  } catch (error) {
    console.error('PubMed search error:', error);
    return [];
  }
}

async function searchCrossRef(query: string, filters: any, limit: number) {
  try {
    const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${limit}&sort=relevance&order=desc`;
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.message?.items?.map((paper: any) => ({
      id: paper.DOI || Math.random().toString(36),
      paper_id: paper.DOI || Math.random().toString(36),
      title: paper.title?.[0] || 'Untitled',
      authors: paper.author?.map((a: any) => `${a.given} ${a.family}`) || [],
      abstract: paper.abstract || '',
      source: 'CrossRef',
      year: paper.published?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
      citationCount: paper['is-referenced-by-count'] || 0,
      journal: paper['container-title']?.[0] || '',
      doi: paper.DOI || '',
      url: paper.URL || `https://doi.org/${paper.DOI}`,
      pdfUrl: ''
    })) || [];
  } catch (error) {
    console.error('CrossRef search error:', error);
    return [];
  }
}

async function searchCore(query: string, filters: any, limit: number) {
  try {
    const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results?.map((paper: any) => ({
      id: paper.id || Math.random().toString(36),
      paper_id: paper.id || Math.random().toString(36),
      title: paper.title || 'Untitled',
      authors: paper.authors?.map((a: any) => a.name) || [],
      abstract: paper.abstract || '',
      source: 'CORE',
      year: parseInt(paper.yearPublished) || new Date().getFullYear(),
      citationCount: 0,
      journal: paper.journals?.[0]?.title || '',
      url: paper.links?.[0]?.url || '',
      pdfUrl: paper.downloadUrl || ''
    })) || [];
  } catch (error) {
    console.error('CORE search error:', error);
    return [];
  }
}

function parseArxivXML(xmlText: string) {
  const papers: any[] = [];
  const entries = xmlText.split('<entry>').slice(1);
  
  entries.forEach(entry => {
    try {
      const id = entry.match(/<id>(.*?)<\/id>/)?.[1]?.split('/').pop() || Math.random().toString(36);
      const title = entry.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/\n\s+/g, ' ').trim() || 'Untitled';
      const summary = entry.match(/<summary>(.*?)<\/summary>/s)?.[1]?.replace(/\n\s+/g, ' ').trim() || '';
      const published = entry.match(/<published>(.*?)<\/published>/)?.[1] || '';
      const year = published ? parseInt(published.substring(0, 4)) : new Date().getFullYear();
      
      const authors: string[] = [];
      const authorMatches = entry.matchAll(/<name>(.*?)<\/name>/g);
      for (const match of authorMatches) {
        authors.push(match[1]);
      }
      
      const pdfUrl = `https://arxiv.org/pdf/${id}.pdf`;
      const url = `https://arxiv.org/abs/${id}`;
      
      papers.push({
        id,
        paper_id: id,
        title,
        authors,
        abstract: summary,
        source: 'arXiv',
        year,
        citationCount: 0,
        journal: 'arXiv',
        url,
        pdfUrl
      });
    } catch (error) {
      console.error('Error parsing arXiv entry:', error);
    }
  });
  
  return papers;
}

function deduplicatePapers(papers: any[]) {
  const seen = new Set();
  return papers.filter(paper => {
    const normalizedTitle = paper.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

async function generateClusters(papers: any[]) {
  const keywordCounts: { [key: string]: string[] } = {};
  
  papers.forEach(paper => {
    const words = paper.title.toLowerCase()
      .split(/\W+/)
      .filter((word: string) => word.length > 3)
      .slice(0, 5);
    
    words.forEach((word: string) => {
      if (!keywordCounts[word]) {
        keywordCounts[word] = [];
      }
      keywordCounts[word].push(paper.id);
    });
  });
  
  const clusters = Object.entries(keywordCounts)
    .filter(([, paperIds]) => paperIds.length >= 2)
    .slice(0, 5)
    .map(([keyword, paperIds]) => ({
      name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      papers: paperIds.length,
      keyword
    }));
  
  return clusters;
}