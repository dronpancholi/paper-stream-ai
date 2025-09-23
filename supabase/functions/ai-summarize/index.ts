import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SummarizeRequest {
  paperId: string;
  text: string;
  apiProvider?: 'openai' | 'together' | 'huggingface';
  apiKey?: string;
  enhanced?: boolean;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function summarizeWithOpenAI(text: string, apiKey: string, enhanced: boolean = false) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: enhanced ? 
            `You are a senior research analyst specializing in academic paper evaluation. 
            Provide a comprehensive, professional analysis of the given research paper.
            
            Format your response as follows:
            
            **SUMMARY:**
            [4-5 sentences providing executive summary of findings, methodology, and significance]
            
            **KEY CONTRIBUTIONS:**
            • [Main contribution 1 with specific details]
            • [Main contribution 2 with impact assessment]
            • [Main contribution 3 with novelty evaluation]
            
            **METHODOLOGY:**
            [Detailed analysis of research approach, data collection, and analytical methods]
            
            **CRITIQUE:**
            [In-depth evaluation covering strengths, weaknesses, and methodological rigor]
            
            **LIMITATIONS:**
            • [Specific limitation 1 with implications]
            • [Specific limitation 2 with suggested improvements]
            • [Sample size, scope, or methodological concerns]
            
            **RECOMMENDATIONS:**
            • [Future research direction 1]
            • [Methodological improvement 1]
            • [Practical application suggestion]
            
            **IMPACT:**
            [Assessment of potential academic and practical impact, including citation potential and field advancement]` :
            `You are a research assistant specializing in academic paper analysis. 
            Provide a comprehensive summary and critique of the given research paper text.
            
            Format your response as follows:
            
            **SUMMARY:**
            [3-4 sentences summarizing the main findings, methodology, and conclusions]
            
            **KEY CONTRIBUTIONS:**
            • [Main contribution 1]
            • [Main contribution 2]
            • [Main contribution 3]
            
            **METHODOLOGY:**
            [Brief description of the research methodology]
            
            **CRITIQUE:**
            **Strengths:**
            • [Strength 1]
            • [Strength 2]
            
            **Limitations:**
            • [Limitation 1]
            • [Limitation 2]
            
            **PEER REVIEW ASSESSMENT:**
            [Assessment of the paper's rigor, novelty, and potential impact]`
        },
        {
          role: 'user',
          content: `Please analyze this research paper:\n\nTitle and Abstract: ${text}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
  }
  
  return data.choices[0].message.content;
}

async function summarizeWithTogether(text: string, apiKey: string) {
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-2-70b-chat-hf',
      messages: [
        {
          role: 'system',
          content: 'You are a research assistant. Provide a concise summary and critique of the given research paper.'
        },
        {
          role: 'user',
          content: `Summarize and critique this research paper: ${text}`
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Together API error: ${data.error?.message || 'Unknown error'}`);
  }
  
  return data.choices[0].message.content;
}

async function summarizeWithHuggingFace(text: string) {
  // Use a free HuggingFace model for basic summarization
  const model = 'facebook/bart-large-cnn';
  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        max_length: 300,
        min_length: 50,
        do_sample: false,
      },
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${JSON.stringify(data)}`);
  }
  
  // Format the response to match our expected structure
  const summary = Array.isArray(data) ? data[0]?.summary_text || data[0]?.generated_text : data.summary_text || data.generated_text;
  
  return `**SUMMARY:**\n${summary}\n\n**NOTE:** This is a basic AI-generated summary. For detailed analysis including critique and methodology assessment, please provide an OpenAI or Together.ai API key in your settings.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paperId, text, apiProvider = 'huggingface', apiKey, enhanced = false }: SummarizeRequest = await req.json();
    
    if (!paperId || !text) {
      return new Response(
        JSON.stringify({ error: 'Paper ID and text are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Summarizing paper ${paperId} using ${apiProvider}`);

    let summary: string;
    let critique: string = '';

    try {
      if (apiProvider === 'openai' && apiKey) {
        const result = await summarizeWithOpenAI(text, apiKey, enhanced);
        // Split summary and critique from the structured response
        const parts = result.split('**CRITIQUE:**');
        summary = parts[0]?.replace('**SUMMARY:**', '').trim() || result;
        critique = parts[1]?.trim() || '';
      } else if (apiProvider === 'together' && apiKey) {
        const result = await summarizeWithTogether(text, apiKey);
        summary = result;
        critique = 'Detailed critique available with OpenAI integration.';
      } else {
        // Fallback to HuggingFace free tier
        summary = await summarizeWithHuggingFace(text);
        critique = 'Detailed critique requires API key configuration.';
      }
    } catch (aiError) {
      console.error('AI API error:', aiError);
      // Fallback to basic processing
      summary = `**SUMMARY:**\n${text.substring(0, 300)}...\n\n**NOTE:** AI summarization temporarily unavailable. Showing truncated abstract.`;
      critique = 'AI critique unavailable due to API error.';
    }

    // Update the paper in the database with the summary and critique
    const { error: updateError } = await supabase
      .from('research_papers')
      .update({ 
        summary: summary,
        critique: critique,
        updated_at: new Date().toISOString()
      })
      .eq('id', paperId);

    if (updateError) {
      console.error('Database update error:', updateError);
      // Continue even if DB update fails
    }

    const response = {
      paperId,
      summary,
      critique,
      apiProvider,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Summarize error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});