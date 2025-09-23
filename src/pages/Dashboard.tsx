import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Bookmark, Eye, Sparkles } from 'lucide-react';
import { SearchFilters } from '@/components/Research/SearchFilters';
import { PaperCard } from '@/components/Research/PaperCard';
import { SearchResults } from '@/components/Research/SearchResults';
import { useResearch } from '@/hooks/useResearch';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { searchResults, loading, searchPapers, filters, setFilters } = useResearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    await searchPapers(searchQuery);
  };

  const recentSearches = [
    'Machine Learning Healthcare',
    'Quantum Computing Applications', 
    'Climate Change Research',
    'Neural Networks Deep Learning'
  ];

  const featuredTopics = [
    { name: 'Artificial Intelligence', count: 1245, trend: '+12%' },
    { name: 'Biotechnology', count: 892, trend: '+8%' },
    { name: 'Renewable Energy', count: 756, trend: '+15%' },
    { name: 'Data Science', count: 634, trend: '+5%' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Accelerating Knowledge Discovery with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Search, analyze, and discover research papers across multiple databases with AI-powered insights
          </p>
        </div>

        {/* Search Section */}
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search research papers, keywords, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" className="px-8" disabled={loading}>
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Search
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setSearchQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <SearchFilters filters={filters} onChange={setFilters} />
              )}
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <SearchResults results={searchResults} loading={loading} />
        )}

        {/* Featured Topics */}
        {!searchResults && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-glow transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{topic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{topic.count}</span>
                    <Badge variant="secondary" className="text-accent">
                      {topic.trend}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">papers available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-subtle border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">AI Summarization</h3>
              <p className="text-muted-foreground">
                Get instant summaries and critiques of research papers using advanced AI
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle border-accent/20">
            <CardContent className="p-6 text-center space-y-4">
              <Eye className="w-12 h-12 text-accent mx-auto" />
              <h3 className="text-xl font-semibold">Smart Clustering</h3>
              <p className="text-muted-foreground">
                Automatically group related papers and discover research patterns
              </p>
              <Button variant="outline" className="w-full">
                Explore Clusters
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-subtle border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <Download className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Export & Share</h3>
              <p className="text-muted-foreground">
                Export research findings and share with your team in multiple formats
              </p>
              <Button variant="outline" className="w-full">
                Export Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}