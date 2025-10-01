import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/pages/EmptyStates';
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Building,
  ExternalLink,
  Star,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

export default function AuthorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [followedAuthors, setFollowedAuthors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('author_profiles')
        .select('*')
        .order('total_citations', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuthors(data || []);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authors.filter(author =>
    author.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.affiliations.some(aff => aff.toLowerCase().includes(searchQuery.toLowerCase())) ||
    author.domains.some(domain => domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSearch = () => {
    navigate('/search');
  };

  const handleViewPapers = (authorName: string) => {
    navigate(`/search?q=${encodeURIComponent(authorName)}`);
  };

  const handleAnalytics = (authorId: string) => {
    navigate(`/analysis?author=${authorId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading authors...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (authors.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Author Profiles
              </h1>
              <p className="text-muted-foreground">
                Discover and follow leading researchers in your field
              </p>
            </div>
          </div>
          <EmptyState 
            type="authors" 
            onAction={handleSearch}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Author Profiles
            </h1>
            <p className="text-muted-foreground">
              Discover and follow leading researchers in your field
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/search')}>
              <Search className="w-4 h-4" />
              Search Papers
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="liquid-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search authors, institutions, or fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Authors List */}
        {filteredAuthors.length === 0 && searchQuery ? (
          <EmptyState 
            type="authors" 
            title="No authors found"
            description="Try adjusting your search terms to find relevant authors."
            actionLabel="Clear Search"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <div className="space-y-6">
            {filteredAuthors.map((author) => (
              <Card key={author.id} className="card-3d hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-lg bg-gradient-primary text-white">
                        {getInitials(author.author_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">
                            {author.author_name}
                          </h3>
                          {author.affiliations.length > 0 && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="w-4 h-4" />
                              <span>{author.affiliations[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Research Domains */}
                      {author.domains.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {author.domains.slice(0, 5).map((domain, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-primary/10">
                              {domain}
                            </Badge>
                          ))}
                          {author.domains.length > 5 && (
                            <Badge variant="outline">+{author.domains.length - 5} more</Badge>
                          )}
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                          <div className="font-bold text-lg text-primary">{author.h_index || 0}</div>
                          <div className="text-muted-foreground">H-Index</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                          <div className="font-bold text-lg text-primary">{author.total_citations?.toLocaleString() || 0}</div>
                          <div className="text-muted-foreground">Citations</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                          <div className="font-bold text-lg text-primary">{author.total_papers || 0}</div>
                          <div className="text-muted-foreground">Papers</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Author ID: {author.author_id}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleViewPapers(author.author_name)}
                          >
                            <BookOpen className="w-4 h-4" />
                            Search Papers
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleAnalytics(author.author_id)}
                          >
                            <TrendingUp className="w-4 h-4" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}