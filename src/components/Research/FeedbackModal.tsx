import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon, Heart, MessageCircle } from 'lucide-react';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/hooks/useAuth';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paperId: string;
  paperTitle: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onOpenChange,
  paperId,
  paperTitle
}) => {
  const { user } = useAuth();
  const { submitRating, getUserRating } = useRatings();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userRating = getUserRating(paperId);

  useEffect(() => {
    if (userRating) {
      setRating(userRating.rating);
      setComment(userRating.comment || '');
    } else {
      setRating(0);
      setComment('');
    }
  }, [userRating, open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    setSubmitting(true);
    try {
      await submitRating(paperId, rating, comment);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              star <= rating 
                ? 'text-yellow-400 fill-current hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Rate this paper
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <h4 className="font-medium text-sm mb-2 text-muted-foreground">
              "{paperTitle.length > 60 ? paperTitle.slice(0, 60) + '...' : paperTitle}"
            </h4>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            {renderStarRating()}
            <p className="text-xs text-center text-muted-foreground">
              {rating === 0 && "Select a rating"}
              {rating === 1 && "Poor - Significant issues"}
              {rating === 2 && "Fair - Some concerns"}
              {rating === 3 && "Good - Solid work"}
              {rating === 4 && "Very Good - High quality"}
              {rating === 5 && "Excellent - Outstanding"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Comments (optional)
            </label>
            <Textarea
              placeholder="Share your thoughts about this paper's methodology, findings, or impact..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-20 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="gap-2"
            >
              {submitting ? (
                "Submitting..."
              ) : userRating ? (
                "Update Rating"
              ) : (
                "Submit Rating"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};