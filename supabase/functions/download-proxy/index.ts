import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const paperUrl = url.searchParams.get('url');
    
    if (!paperUrl) {
      return new Response(JSON.stringify({ error: 'URL parameter required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate URL is from allowed domains
    const allowedDomains = [
      'arxiv.org',
      'semanticscholar.org', 
      'ncbi.nlm.nih.gov',
      'doi.org',
      'core.ac.uk'
    ];
    
    const urlObj = new URL(paperUrl);
    const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));
    
    if (!isAllowed) {
      return new Response(JSON.stringify({ error: 'Domain not allowed' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Fetch the PDF
    const response = await fetch(paperUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get content type and filename
    const contentType = response.headers.get('content-type') || 'application/pdf';
    const contentDisposition = response.headers.get('content-disposition');
    
    let filename = 'paper.pdf';
    if (contentDisposition && contentDisposition.includes('filename=')) {
      filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
    }

    // Stream the response
    const headers = new Headers({
      ...corsHeaders,
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600'
    });

    return new Response(response.body, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Download proxy error:', error);
    return new Response(JSON.stringify({ 
      error: 'Download failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});