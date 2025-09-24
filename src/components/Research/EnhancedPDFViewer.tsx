import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Download, 
  ExternalLink, 
  X, 
  FileText, 
  Sparkles, 
  Brain,
  Calendar,
  Users,
  BarChart3,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { ResearchPaper } from './PaperCard';
import { EnhancedSummarization } from '@/components/AI/EnhancedSummarization';
import { FeedbackButton } from './FeedbackButton';

interface EnhancedPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  paper: ResearchPaper;
}

export const EnhancedPDFViewer: React.FC<EnhancedPDFViewerProps> = ({
  isOpen,
  onClose,
  paper,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pdf');
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleDownload = () => {
    if (paper.pdfUrl) {
      const link = document.createElement('a');
      link.href = paper.pdfUrl;
      link.download = `${paper.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenExternal = () => {
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, '_blank');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-xl font-bold leading-tight line-clamp-2">
                {paper.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{paper.authors.slice(0, 3).join(', ')}</span>
                  {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{paper.year}</span>
                </div>
                {paper.citationCount && (
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{paper.citationCount} citations</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{paper.source}</Badge>
                {paper.journal && <Badge variant="secondary">{paper.journal}</Badge>}
                {paper.impactFactor && (
                  <Badge className="bg-primary/10 text-primary">
                    IF: {paper.impactFactor.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FeedbackButton paperId={paper.id} title={paper.title} />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenExternal}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                External
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pb-4 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pdf" className="gap-2">
                  <FileText className="w-4 h-4" />
                  PDF Viewer
                </TabsTrigger>
                <TabsTrigger value="summary" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Summary
                </TabsTrigger>
                <TabsTrigger value="analysis" className="gap-2">
                  <Brain className="w-4 h-4" />
                  Deep Analysis
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="pdf" className="h-full m-0 p-0">
                <div className="h-full flex flex-col">
                  {/* PDF Controls */}
                  <div className="px-6 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 50}
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-16 text-center">
                          {zoomLevel}%
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 200}
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {isLoading ? 'Loading PDF...' : 'PDF loaded'}
                      </div>
                    </div>
                  </div>

                  {/* PDF Viewer */}
                  <div className="flex-1 bg-muted/20 overflow-hidden">
                    {paper.pdfUrl ? (
                      <div className="relative w-full h-full">
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        )}
                        <iframe
                          src={`${paper.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=${zoomLevel}`}
                          className="w-full h-full border-0"
                          title={paper.title}
                          onLoad={() => setIsLoading(false)}
                          onError={() => setIsLoading(false)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <FileText className="w-16 h-16 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium text-lg">PDF Not Available</h3>
                          <p className="text-sm text-muted-foreground">
                            The PDF for this paper is not accessible through our viewer.
                          </p>
                        </div>
                        {paper.url && (
                          <Button onClick={() => window.open(paper.url, '_blank')} className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            View on Publisher Site
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="h-full m-0 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Abstract</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {paper.abstract}
                    </p>
                  </div>

                  <Separator />

                  {paper.summary && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI-Generated Summary
                      </h3>
                      <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                        <p className="leading-relaxed">{paper.summary}</p>
                      </div>
                    </div>
                  )}

                  {paper.critique && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary" />
                          Critical Analysis
                        </h3>
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <p className="leading-relaxed">{paper.critique}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="h-full m-0 p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <EnhancedSummarization
                    paperId={paper.id}
                    title={paper.title}
                    abstract={paper.abstract || ''}
                    authors={paper.authors || []}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};