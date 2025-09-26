import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Eye, 
  ExternalLink,
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize,
  FileText,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedSummarization } from '@/components/AI/EnhancedSummarization';
import { FeedbackModal } from '@/components/Research/FeedbackModal';
import { useLikes } from '@/hooks/useLikes';
import { useRatings } from '@/hooks/useRatings';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal?: string;
  year: number;
  pdfUrl?: string;
  url?: string;
  doi?: string;
  source: string;
  citationCount?: number;
}

interface UnifiedPaperViewerProps {
  paper: Paper;
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedPaperViewer: React.FC<UnifiedPaperViewerProps> = ({
  paper,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('viewer');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const { getPaperCounts, getUserVote, toggleLike } = useLikes();
  const { getUserRating } = useRatings();
  
  const likeCounts = getPaperCounts(paper.id);
  const userVote = getUserVote(paper.id);
  const userRating = getUserRating(paper.id);

  useEffect(() => {
    if (isOpen) {
      setZoom(100);
      setActiveTab('viewer');
    }
  }, [isOpen]);

  const handleBack = () => {
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get('from') || '/search';
    
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(from);
    }
  };

  const handleDownload = async () => {
    if (!paper.pdfUrl) {
      toast.error('PDF not available for download');
      return;
    }

    try {
      // Use server-side proxy for download to avoid CORS issues
      const response = await fetch(`/api/papers/${paper.id}/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title.substring(0, 50)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started');
    } catch (error) {
      // Fallback: direct link
      if (paper.pdfUrl) {
        window.open(paper.pdfUrl, '_blank');
        toast.info('Opening PDF in new tab');
      } else {
        toast.error('Download failed');
      }
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/papers/${paper.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: paper.title,
          text: paper.abstract.substring(0, 200) + '...',
          url: shareUrl
        });
        toast.success('Shared successfully');
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleLike = async (isLike: boolean) => {
    try {
      await toggleLike(paper.id, isLike ? 'like' : 'dislike');
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-subtle">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="glass-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold line-clamp-1">{paper.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {paper.authors.slice(0, 3).join(', ')}
                  {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Viewer Controls */}
              {activeTab === 'viewer' && (
                <>
                  <Button variant="ghost" size="sm" onClick={zoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{zoom}%</span>
                  <Button variant="ghost" size="sm" onClick={zoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Action Buttons */}
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              {paper.url && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={paper.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="viewer" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Viewer
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="viewer" className="flex-1 m-0">
                <div className="h-full flex">
                  {/* PDF Viewer */}
                  <div className="flex-1 bg-muted/10">
                    {paper.pdfUrl ? (
                      <iframe
                        src={paper.pdfUrl}
                        className="w-full h-full border-0"
                        style={{ 
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: 'top left',
                          width: `${10000 / zoom}%`,
                          height: `${10000 / zoom}%`
                        }}
                        title="PDF Viewer"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Card className="max-w-md">
                          <CardContent className="text-center p-6">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">PDF Not Available</h3>
                            <p className="text-muted-foreground mb-4">
                              The PDF version of this paper is not available for viewing.
                            </p>
                            {paper.url && (
                              <Button asChild>
                                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                  View Source
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Side Panel */}
                  <div className="w-80 border-l p-4 space-y-4 overflow-y-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Paper Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Badge variant="secondary">{paper.source}</Badge>
                          <Badge variant="outline" className="ml-2">{paper.year}</Badge>
                        </div>
                        
                        {paper.journal && (
                          <p className="text-sm"><strong>Journal:</strong> {paper.journal}</p>
                        )}
                        
                        {paper.citationCount !== undefined && (
                          <p className="text-sm"><strong>Citations:</strong> {paper.citationCount}</p>
                        )}

                        {userRating && (
                          <p className="text-sm"><strong>Your Rating:</strong> {userRating.rating}/5</p>
                        )}

                        <p className="text-sm"><strong>Likes:</strong> {likeCounts.likes} | <strong>Dislikes:</strong> {likeCounts.dislikes}</p>
                      </CardContent>
                    </Card>

                    {/* Engagement */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Engagement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={userVote === 'like' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleLike(true)}
                          >
                            👍 {likeCounts.likes}
                          </Button>
                          <Button
                            variant={userVote === 'dislike' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleLike(false)}
                          >
                            👎 {likeCounts.dislikes}
                          </Button>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setFeedbackOpen(true)}
                        >
                          Rate & Review
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary" className="flex-1 m-0 p-4">
                <div className="h-full overflow-y-auto">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Abstract</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed">{paper.abstract}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="flex-1 m-0 p-4">
                <div className="h-full overflow-y-auto">
                  <EnhancedSummarization
                    paperId={paper.id}
                    title={paper.title}
                    abstract={paper.abstract}
                    authors={paper.authors}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
          paperId={paper.id}
          paperTitle={paper.title}
        />
      </DialogContent>
    </Dialog>
  );
};