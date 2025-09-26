import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedPaperCard, SearchResult } from '@/components/Research/EnhancedPaperCard';
import { EmptyState } from '@/pages/EmptyStates';
import { 
  ArrowLeft,
  Users, 
  Building, 
  Award, 
  TrendingUp,
  BookOpen,
  MapPin,
  ExternalLink,
  Globe,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Author {
  id: string;
  author_id: string;
  author_name: string;
  affiliations: string[];
  domains: string[];
  total_papers: number;
  total_citations: number;
  h_index: number;
  profile_data: any;
}

export default function AuthorDetailPage() {
  const { authorId } = useParams<{ authorId: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [papers, setPapers] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [papersLoading, setPapersLoading] = useState(false);

  useEffect(() => {
    if (authorId) {
      fetchAuthor();
      fetchAuthorPapers();
    }
  }, [authorId]);

  const fetchAuthor = async () => {
    if (!authorId) return;

    try {
      const { data, error } = await supabase
        .from('author_profiles')
        .select('*')
        .eq('author_id', authorId)
        .single();

      if (error) throw error;
      setAuthor(data);
    } catch (error) {
      console.error('Error fetching author:', error);
      toast.error('Author not found');
      navigate('/authors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorPapers = async () => {
    if (!authorId) return;

    try {
      setPapersLoading(true);
      const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .contains('authors', [authorId])
        .order('publication_date', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedPapers: SearchResult[] = (data || []).map(paper => ({
        id: paper.id,
        title: paper.title,
        authors: paper.authors || [],
        abstract: paper.abstract || '',
        source: paper.source,
        year: paper.publication_date ? new Date(paper.publication_date).getFullYear() : new Date().getFullYear(),
        citationCount: paper.citation_count || 0,
        journal: paper.journal || '',
        doi: paper.doi || '',
        url: paper.url || '',
        pdfUrl: paper.pdf_url || '',
        summary: paper.summary || '',
        critique: paper.critique || '',
        impactFactor: paper.impact_factor || undefined,
        isBookmarked: false
      }));

      setPapers(formattedPapers);
    } catch (error) {
      console.error('Error fetching author papers:', error);
    } finally {
      setPapersLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading author profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!author) {
    return (
      <DashboardLayout>
        <EmptyState 
          type="authors" 
          title="Author not found"
          description="The requested author profile could not be found."
          actionLabel="Browse Authors"
          onAction={() => navigate('/authors')}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/authors')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Authors
        </Button>

        {/* Author Profile */}
        <Card className="card-3d">
          <CardContent className="p-8">
            <div className="flex items-start gap-8">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {getInitials(author.author_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{author.author_name}</h1>
                  {author.affiliations.length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="w-5 h-5" />
                      <span className="text-lg">{author.affiliations[0]}</span>
                    </div>
                  )}
                </div>

                {/* Research Domains */}
                {author.domains.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Research Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {author.domains.map((domain, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/10">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">{author.h_index || 0}</div>
                    <div className="text-sm text-muted-foreground">H-Index</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">{author.total_citations?.toLocaleString() || 0}</div>
                    <div className="text-sm text-muted-foreground">Citations</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">{author.total_papers || 0}</div>
                    <div className="text-sm text-muted-foreground">Papers</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="papers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Published Papers</h2>
              <Badge variant="secondary">{papers.length} papers found</Badge>
            </div>

            {papersLoading ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading papers...</p>
              </div>
            ) : papers.length === 0 ? (
              <EmptyState 
                type="papers" 
                title="No papers found"
                description="This author doesn't have any papers in our database yet."
                actionLabel="Search Papers"
                onAction={() => navigate('/search')}
              />
            ) : (
              <div className="space-y-6">
                {papers.map((paper) => (
                  <EnhancedPaperCard key={paper.id} paper={paper} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Citation Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Citation trend analysis coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Collaboration Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Collaboration network coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}