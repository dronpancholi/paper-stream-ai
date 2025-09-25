import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedSummarization } from '@/components/AI/EnhancedSummarization';
import { 
  Download, 
  ExternalLink, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2,
  ArrowLeft,
  FileText,
  Brain,
  MessageSquare,
  Bookmark,
  Share2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResearchPaper } from '@/components/Research/PaperCard';

interface ProfessionalPDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  paper: ResearchPaper;
}

export const ProfessionalPDFViewer: React.FC<ProfessionalPDFViewerProps> = ({
  isOpen,
  onClose,
  paper,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('viewer');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleDownload = () => {
    if (paper.pdfUrl) {
      const link = document.createElement('a');
      link.href = paper.pdfUrl;
      link.download = `${paper.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
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
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBackToDashboard = () => {
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setZoom(100);
      setRotation(0);
      setCurrentPage(1);
      setActiveTab('viewer');
    }
  }, [isOpen, paper.id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            className={`p-0 border-0 ${
              isFullscreen ? 'max-w-screen max-h-screen w-screen h-screen' : 'max-w-7xl h-[95vh]'
            }`}
          >
            {/* Header */}
            <DialogHeader className="px-6 py-4 border-b bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToDashboard}
                    className="gap-2 hover:bg-primary hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Button>
                  
                  <div className="border-l h-6 mx-2" />
                  
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg font-semibold truncate">
                      {paper.title}
                    </DialogTitle>
                    <div className="text-sm text-muted-foreground">
                      {paper.authors?.join(', ')} • {paper.year} • {paper.source}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === 'viewer' && paper.pdfUrl && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[50px] text-center">
                        {zoom}%
                      </span>
                      <Button variant="outline" size="sm" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      
                      <div className="border-l h-6 mx-2" />
                      
                      <Button variant="outline" size="sm" onClick={handleRotate}>
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </Button>
                    </>
                  )}
                  
                  <div className="border-l h-6 mx-2" />
                  
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleOpenExternal}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                  {/* Tab Navigation */}
                  <div className="border-b px-6">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                      <TabsTrigger value="viewer" className="gap-2">
                        <FileText className="w-4 h-4" />
                        PDF Viewer
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="gap-2">
                        <Brain className="w-4 h-4" />
                        AI Summary
                      </TabsTrigger>
                      <TabsTrigger value="analysis" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Deep Analysis
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tab Content */}
                  <TabsContent value="viewer" className="flex-1 m-0 p-0">
                    <div className="h-full flex">
                      {/* PDF Viewer */}
                      <div className="flex-1 p-6">
                        <div className="relative w-full h-full border rounded-lg overflow-hidden bg-muted shadow-inner">
                          {isLoading && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-10"
                            >
                              <div className="text-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <p className="text-sm text-muted-foreground">Loading PDF document...</p>
                              </div>
                            </motion.div>
                          )}
                          
                          {paper.pdfUrl ? (
                            <iframe
                              ref={iframeRef}
                              src={`${paper.pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=${zoom}&rotate=${rotation}`}
                              className="w-full h-full"
                              title={paper.title}
                              onLoad={() => setIsLoading(false)}
                              onError={() => setIsLoading(false)}
                              style={{
                                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                                transformOrigin: 'center center'
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center space-y-3">
                                <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
                                <p className="text-lg font-medium">PDF Not Available</p>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                  This paper doesn't have a direct PDF link. You can try searching for it on the publisher's website.
                                </p>
                                <Button variant="outline" onClick={handleOpenExternal} className="gap-2">
                                  <Search className="w-4 h-4" />
                                  Search Online
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Side Panel - Paper Info */}
                      <div className="w-80 border-l bg-muted/30 p-6 overflow-y-auto">
                        <div className="space-y-6">
                          {/* Paper Metadata */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Paper Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {paper.journal && (
                                <div>
                                  <div className="text-sm font-medium">Journal</div>
                                  <div className="text-sm text-muted-foreground">{paper.journal}</div>
                                </div>
                              )}
                              
                              {paper.doi && (
                                <div>
                                  <div className="text-sm font-medium">DOI</div>
                                  <div className="text-xs text-muted-foreground font-mono break-all">{paper.doi}</div>
                                </div>
                              )}
                              
                              {paper.citationCount && (
                                <div>
                                  <div className="text-sm font-medium">Citations</div>
                                  <div className="text-sm text-muted-foreground">{paper.citationCount.toLocaleString()}</div>
                                </div>
                              )}
                              
                              {paper.keywords && paper.keywords.length > 0 && (
                                <div>
                                  <div className="text-sm font-medium mb-2">Keywords</div>
                                  <div className="flex flex-wrap gap-1">
                                    {paper.keywords.slice(0, 8).map((keyword, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Quick Actions */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full gap-2">
                                <Bookmark className="w-4 h-4" />
                                Save to Library
                              </Button>
                              <Button variant="outline" size="sm" className="w-full gap-2">
                                <Share2 className="w-4 h-4" />
                                Share Paper
                              </Button>
                              <Button variant="outline" size="sm" className="w-full gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Add Note
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Navigation */}
                          {paper.pdfUrl && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">Navigation</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Button variant="outline" size="sm">
                                    <ChevronLeft className="w-4 h-4" />
                                  </Button>
                                  <span className="text-sm">Page {currentPage}</span>
                                  <Button variant="outline" size="sm">
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                  <Search className="w-4 h-4" />
                                  Search in PDF
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="flex-1 m-0 p-6">
                    <ScrollArea className="h-full">
                      <div className="max-w-4xl mx-auto space-y-6">
                        {/* Abstract */}
                        {paper.abstract && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Abstract
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm leading-relaxed">{paper.abstract}</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* AI Summary */}
                        {paper.summary && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Brain className="w-5 h-5 text-accent" />
                                AI-Generated Summary
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm leading-relaxed">{paper.summary}</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Critical Analysis */}
                        {paper.critique && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Critical Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm leading-relaxed">{paper.critique}</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* If no summary content */}
                        {!paper.abstract && !paper.summary && !paper.critique && (
                          <div className="text-center py-12">
                            <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Summary Available</h3>
                            <p className="text-muted-foreground mb-4">
                              AI-generated summaries are not available for this paper yet.
                            </p>
                            <Button variant="outline" className="gap-2">
                              <Brain className="w-4 h-4" />
                              Generate Summary
                            </Button>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="analysis" className="flex-1 m-0 p-6">
                    <ScrollArea className="h-full">
                      <EnhancedSummarization 
                        paperId={paper.id}
                        title={paper.title}
                        abstract={paper.abstract || ''}
                        authors={paper.authors || []}
                      />
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};