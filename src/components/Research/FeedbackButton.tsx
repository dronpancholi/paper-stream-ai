import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFeedback } from '@/hooks/useFeedback';

interface FeedbackButtonProps {
  paperId: string;
  title: string;
  className?: string;
}

export const FeedbackButton = ({ paperId, title, className }: FeedbackButtonProps) => {
  const { submitFeedback, getPaperFeedback } = useFeedback();
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingFeedback = getPaperFeedback(paperId);

  const handleLike = async (isLiked: boolean) => {
    setIsSubmitting(true);
    await submitFeedback(paperId, isLiked, comment || undefined);
    setIsSubmitting(false);
    setIsOpen(false);
    setComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'gap-2',
            existingFeedback && 'text-primary bg-primary/10',
            className
          )}
        >
          <Heart className={cn(
            'w-4 h-4',
            existingFeedback?.is_liked && 'fill-current text-red-500'
          )} />
          Feedback
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left">Share Your Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground line-clamp-2">
            {title}
          </div>
          
          <div className="space-y-3">
            <div className="text-sm font-medium">How do you rate this paper?</div>
            <div className="flex gap-3">
              <Button
                variant={existingFeedback?.is_liked === true ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => handleLike(true)}
                disabled={isSubmitting}
              >
                <ThumbsUp className="w-4 h-4" />
                Like
              </Button>
              <Button
                variant={existingFeedback?.is_liked === false ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => handleLike(false)}
                disabled={isSubmitting}
              >
                <ThumbsDown className="w-4 h-4" />
                Dislike
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Additional Comments (Optional)
            </div>
            <Textarea
              placeholder="Share your thoughts about this paper..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-20"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </div>
          </div>
          
          {existingFeedback && (
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="text-xs text-muted-foreground mb-1">Your previous feedback:</div>
              <div className="text-sm">
                {existingFeedback.is_liked ? '👍 Liked' : '👎 Disliked'}
                {existingFeedback.comment && (
                  <div className="mt-1 text-muted-foreground">
                    "{existingFeedback.comment}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};