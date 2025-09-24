import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Download, ExternalLink, Sparkles, Star, Calendar, Users, BarChart3, Eye, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedPDFViewer } from '@/components/Research/EnhancedPDFViewer';
import { EnhancedSummarization } from '@/components/AI/EnhancedSummarization';
import { FeedbackButton } from '@/components/Research/FeedbackButton';

export interface ResearchPaper {
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

interface PaperCardProps {
  paper: ResearchPaper;
  onBookmark?: (paperId: string) => void;
  onSummarize?: (paperId: string) => void;
  onDownload?: (paperId: string) => void;
  className?: string;
}

export const PaperCard = ({ 
  paper, 
  onBookmark, 
  onSummarize, 
  onDownload, 
  className 
}: PaperCardProps) => {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [showEnhancedSummary, setShowEnhancedSummary] = useState(false);
  const sourceBadgeColor = {
    'arXiv': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    'PubMed': 'bg-green-500/10 text-green-600 border-green-500/20',
    'CrossRef': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Semantic Scholar': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    'CORE': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  return (
    <Card className={cn('hover:shadow-glow transition-all duration-200', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {paper.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="line-clamp-1">
                {paper.authors.slice(0, 3).join(', ')}
                {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge 
              className={cn(
                'text-xs font-medium',
                sourceBadgeColor[paper.source as keyof typeof sourceBadgeColor] || 
                'bg-gray-500/10 text-gray-600 border-gray-500/20'
              )}
            >
              {paper.source}
            </Badge>
            {paper.impactFactor && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Star className="w-3 h-3" />
                <span>{paper.impactFactor.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {paper.abstract}
        </p>

        {paper.summary && (
          <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">AI Summary</span>
            </div>
            <p className="text-sm line-clamp-2">{paper.summary}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{paper.year}</span>
            </div>
            {paper.citationCount !== undefined && (
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                <span>{paper.citationCount} citations</span>
              </div>
            )}
            {paper.journal && (
              <span className="font-medium">{paper.journal}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2">
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark(paper.id)}
                className={cn(
                  paper.isBookmarked && 'text-yellow-500 bg-yellow-500/10'
                )}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEnhancedSummary(!showEnhancedSummary)}
            >
              <Brain className="w-4 h-4" />
              AI Analysis
            </Button>

            <FeedbackButton paperId={paper.id} title={paper.title} />

            {onDownload && paper.pdfUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(paper.id)}
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {paper.pdfUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPDFViewerOpen(true)}
              >
                <Eye className="w-4 h-4" />
                PDF
              </Button>
            )}
            
            {paper.url && (
              <Button variant="ghost" size="sm" asChild>
                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  External
                </a>
              </Button>
            )}
          </div>
        </div>

        {showEnhancedSummary && (
          <div className="mt-4">
            <EnhancedSummarization
              paperId={paper.id}
              title={paper.title}
              abstract={paper.abstract || ''}
              authors={paper.authors || []}
            />
          </div>
        )}
      </CardContent>

      {isPDFViewerOpen && (
        <EnhancedPDFViewer
          isOpen={isPDFViewerOpen}
          onClose={() => setIsPDFViewerOpen(false)}
          paper={paper}
        />
      )}
    </Card>
  );
};