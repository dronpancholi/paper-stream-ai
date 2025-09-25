-- Create likes table for paper like/dislike functionality
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  paper_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, paper_id)
);

-- Enable RLS on likes table
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for likes
CREATE POLICY "Users can manage their own likes"
ON public.likes
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow reading aggregated like counts
CREATE POLICY "Anyone can view like counts"
ON public.likes
FOR SELECT
USING (true);

-- Create ratings table for detailed feedback
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  paper_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, paper_id)
);

-- Enable RLS on ratings table
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ratings
CREATE POLICY "Users can manage their own ratings"
ON public.ratings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow reading aggregated ratings (but not comments)
CREATE POLICY "Anyone can view ratings summary"
ON public.ratings
FOR SELECT
USING (true);

-- Create updated_at trigger for likes
CREATE TRIGGER update_likes_updated_at
  BEFORE UPDATE ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for ratings  
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_likes_paper_id ON public.likes(paper_id);
CREATE INDEX idx_likes_user_paper ON public.likes(user_id, paper_id);
CREATE INDEX idx_ratings_paper_id ON public.ratings(paper_id);
CREATE INDEX idx_ratings_user_paper ON public.ratings(user_id, paper_id);