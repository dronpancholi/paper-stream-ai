import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ProfessionalPDFViewer } from '@/components/Research/ProfessionalPDFViewer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PaperViewerPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paperId) {
      navigate('/search');
      return;
    }

    loadPaper();
  }, [paperId]);

  const loadPaper = async () => {
    try {
      setLoading(true);
      
      // Try to load from research_papers table first
      const { data: dbPaper, error: dbError } = await supabase
        .from('research_papers')
        .select('*')
        .eq('paper_id', paperId)
        .single();

      if (dbPaper && !dbError) {
        setPaper({
          id: dbPaper.paper_id,
          title: dbPaper.title,
          authors: dbPaper.authors || [],
          abstract: dbPaper.abstract || '',
          journal: dbPaper.journal || '',
          year: dbPaper.publication_date ? new Date(dbPaper.publication_date).getFullYear() : new Date().getFullYear(),
          pdfUrl: dbPaper.pdf_url || dbPaper.url,
          doi: dbPaper.doi,
          citationCount: dbPaper.citation_count || 0,
          source: dbPaper.source
        });
      } else {
        // Fallback: try to construct paper from URL params or location state
        const state = location.state as any;
        if (state?.paper) {
          setPaper(state.paper);
        } else {
          toast.error('Paper not found');
          navigate('/search');
          return;
        }
      }
    } catch (error) {
      console.error('Error loading paper:', error);
      toast.error('Failed to load paper');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get('from');
    
    if (from) {
      navigate(from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/search');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading paper...</span>
        </div>
      </div>
    );
  }

  if (!paper) {
    return null;
  }

  return (
    <ProfessionalPDFViewer
      isOpen={true}
      onClose={handleClose}
      paper={paper}
    />
  );
}