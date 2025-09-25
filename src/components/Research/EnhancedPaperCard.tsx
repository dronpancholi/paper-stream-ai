import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Eye, 
  Bookmark, 
  Share2, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  Star,
  StarIcon,
  ExternalLink,
  Calendar,
  Users,
  Building2
} from 'lucide-react';
import { useLikes } from '@/hooks/useLikes';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ProfessionalPDFViewer } from './ProfessionalPDFViewer';

export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  abstract?: string;
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

interface EnhancedPaperCardProps {
  paper: SearchResult;
  onBookmark?: (paperId: string, isBookmarked: boolean) => void;
  onView?: (paper: SearchResult) => void;
  showActions?: boolean;
  className?: string;
}

export const EnhancedPaperCard: React.FC<EnhancedPaperCardProps> = ({
  paper,
  onBookmark,
  onView,
  showActions = true,
  className = ''
}) => {
  const { user } = useAuth();
  const { toggleLike, getUserVote, getPaperCounts, fetchLikeCounts } = useLikes();
  const { submitRating, getUserRating, getPaperStats, fetchRatingStats } = useRatings();
  
  const [viewerOpen, setViewerOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(paper.isBookmarked || false);

  const userVote = getUserVote(paper.id);
  const likeCounts = getPaperCounts(paper.id);
  const userRating = getUserRating(paper.id);
  const paperStats = getPaperStats(paper.id);

  useEffect(() => {
    fetchLikeCounts([paper.id]);
    fetchRatingStats([paper.id]);
  }, [paper.id]);

  useEffect(() => {
    if (userRating) {
      setCurrentRating(userRating.rating);
      setRatingComment(userRating.comment || '');
    }
  }, [userRating]);

  const handleLike = async (vote: 'like' | 'dislike') => {
    await toggleLike(paper.id, vote);
  };

  const handleRatingSubmit = async () => {
    if (currentRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    await submitRating(paper.id, currentRating, ratingComment);
    setRatingDialogOpen(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: paper.title,
          text: `${paper.title} by ${paper.authors.join(', ')}`,
          url: window.location.href + `/papers/${paper.id}`
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      const shareUrl = window.location.href + `/papers/${paper.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDownload = async () => {
    if (paper.pdfUrl) {
      try {
        const response = await fetch(paper.pdfUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paper.title.slice(0, 50)}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Download started');
      } catch (error) {
        toast.error('Download failed - opening in new tab');
        window.open(paper.pdfUrl, '_blank');
      }
    } else {
      toast.error('PDF not available');
    }
  };

  const handleBookmark = async () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    onBookmark?.(paper.id, newBookmarked);
    toast.success(newBookmarked ? 'Paper bookmarked' : 'Bookmark removed');
  };

  const handleView = () => {
    if (paper.pdfUrl) {
      setViewerOpen(true);
    } else if (paper.url) {
      window.open(paper.url, '_blank');
    } else {
      toast.error('No viewable content available');
    }
  };

  const renderStarRating = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-4 h-4 cursor-pointer transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={interactive ? () => setCurrentRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className={`card-3d hover:shadow-glow transition-all duration-300 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <h3 
                  className="text-xl font-semibold hover:text-primary cursor-pointer leading-tight"
                  onClick={handleView}
                >
                  {paper.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{paper.authors.join(', ')}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {paper.journal && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{paper.journal}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{paper.year}</span>
                  </div>
                  <Badge variant="secondary">{paper.source}</Badge>
                </div>
              </div>
              
              {/* Citation and Impact */}
              <div className="text-right space-y-2">
                {paper.citationCount !== undefined && (
                  <Badge variant="outline" className="bg-accent/10">
                    {paper.citationCount.toLocaleString()} citations
                  </Badge>
                )}
                {paper.impactFactor && (
                  <div className="text-sm text-muted-foreground">
                    IF: {paper.impactFactor}
                  </div>
                )}
              </div>
            </div>

            {/* Abstract */}
            {paper.abstract && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {paper.abstract}
              </p>
            )}

            <Separator />

            {/* Engagement Section */}
            <div className="flex items-center justify-between">
              {/* Likes and Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={userVote === 'like' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleLike('like')}
                    className="gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{likeCounts.likes}</span>
                  </Button>
                  <Button
                    variant={userVote === 'dislike' ? 'destructive' : 'ghost'}
                    size="sm"
                    onClick={() => handleLike('dislike')}
                    className="gap-1"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{likeCounts.dislikes}</span>
                  </Button>
                </div>

                {/* Rating Display */}
                <div className="flex items-center gap-2">
                  {renderStarRating(paperStats.average)}
                  <span className="text-sm text-muted-foreground">
                    ({paperStats.count})
                  </span>
                  <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                        Rate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rate this paper</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Your Rating</label>
                          {renderStarRating(currentRating, true)}
                        </div>
                        <div>
                          <label className="text-sm font-medium">Comment (optional)</label>
                          <Textarea
                            placeholder="Share your thoughts about this paper..."
                            value={ratingComment}
                            onChange={(e) => setRatingComment(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setRatingDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleRatingSubmit}>
                            Submit Rating
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleView} className="gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  <Button 
                    variant={isBookmarked ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={handleBookmark}
                    className="gap-2"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                  {paper.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      {viewerOpen && paper.pdfUrl && (
        <ProfessionalPDFViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          paper={{
            id: paper.id,
            title: paper.title,
            authors: paper.authors,
            abstract: paper.abstract || '',
            journal: paper.journal || '',
            year: paper.year,
            source: paper.source,
            url: paper.url,
            pdfUrl: paper.pdfUrl
          }}
        />
      )}
    </>
  );
};