-- Create research discovery platform database schema

-- User profiles table for enhanced features
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  api_key_openai TEXT, -- Encrypted storage for user's OpenAI key
  api_key_together TEXT, -- Encrypted storage for Together.ai key
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Research papers table for caching and bookmarking
CREATE TABLE public.research_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id TEXT NOT NULL, -- External API paper ID (arXiv, PubMed, etc.)
  source TEXT NOT NULL, -- arXiv, pubmed, crossref, semantic_scholar, etc.
  title TEXT NOT NULL,
  authors TEXT[] DEFAULT '{}',
  abstract TEXT,
  publication_date DATE,
  journal TEXT,
  doi TEXT,
  url TEXT,
  citation_count INTEGER DEFAULT 0,
  impact_factor DECIMAL,
  keywords TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  summary TEXT, -- AI-generated summary
  critique TEXT, -- AI-generated critique
  metadata JSONB DEFAULT '{}',
  embeddings VECTOR(384), -- For semantic similarity
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(paper_id, source)
);

-- Search queries table for history and analytics
CREATE TABLE public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  query_text TEXT NOT NULL,
  filters JSONB DEFAULT '{}', -- author, year, domain, etc.
  results_count INTEGER DEFAULT 0,
  session_id TEXT, -- For guest users
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bookmarks table for saved papers
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  paper_id UUID NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, paper_id)
);

-- Paper clusters table for grouping related documents
CREATE TABLE public.paper_clusters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_name TEXT NOT NULL,
  description TEXT,
  paper_ids UUID[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Author profiles table for impact analysis
CREATE TABLE public.author_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_id TEXT, -- External author ID if available
  domains TEXT[] DEFAULT '{}',
  total_papers INTEGER DEFAULT 0,
  total_citations INTEGER DEFAULT 0,
  h_index INTEGER DEFAULT 0,
  affiliations TEXT[] DEFAULT '{}',
  profile_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(author_name)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.author_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view and edit their own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for research_papers (public read, authenticated write)
CREATE POLICY "Anyone can view research papers" 
ON public.research_papers 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert research papers" 
ON public.research_papers 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- RLS Policies for search_queries
CREATE POLICY "Users can view their own queries" 
ON public.search_queries 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert search queries" 
ON public.search_queries 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" 
ON public.bookmarks 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for clusters (public read)
CREATE POLICY "Anyone can view paper clusters" 
ON public.paper_clusters 
FOR SELECT 
USING (true);

-- RLS Policies for author profiles (public read)
CREATE POLICY "Anyone can view author profiles" 
ON public.author_profiles 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_research_papers_source ON public.research_papers(source);
CREATE INDEX idx_research_papers_title ON public.research_papers USING GIN(to_tsvector('english', title));
CREATE INDEX idx_research_papers_abstract ON public.research_papers USING GIN(to_tsvector('english', abstract));
CREATE INDEX idx_research_papers_authors ON public.research_papers USING GIN(authors);
CREATE INDEX idx_research_papers_keywords ON public.research_papers USING GIN(keywords);
CREATE INDEX idx_research_papers_date ON public.research_papers(publication_date DESC);
CREATE INDEX idx_search_queries_user ON public.search_queries(user_id);
CREATE INDEX idx_bookmarks_user ON public.bookmarks(user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_papers_updated_at
    BEFORE UPDATE ON public.research_papers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_author_profiles_updated_at
    BEFORE UPDATE ON public.author_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();