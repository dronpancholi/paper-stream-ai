import React, { useState, useCallback, memo, Suspense } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  TrendingUp, 
  BookOpen, 
  Users, 
  BarChart3,
  Sparkles,
  Clock,
  Star,
  Filter,
  Zap
} from 'lucide-react';
import { useOptimizedSearch } from '@/hooks/useOptimizedSearch';
import { CardSkeleton } from '@/components/LoadingStates';
import { EmptyState } from '@/components/EmptyStates';
import { PaperCard } from '@/components/Research/PaperCard';

const OptimizedDashboard = memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const { results, loading, total, search } = useOptimizedSearch();

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      search(query);
    }
  }, [search]);

  const handleQuickSearch = useCallback((topic: string) => {
    setSearchQuery(topic);
    handleSearch(topic);
  }, [handleSearch]);

  const trendingTopics = [
    'Machine Learning',
    'Climate Change',
    'Quantum Computing',
    'CRISPR Gene Editing',
    'Neural Networks',
    'Renewable Energy'
  ];

  const quickStats = [
    { label: 'Papers Available', value: '2.1M+', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Active Researchers', value: '450K+', icon: Users, color: 'text-green-600' },
    { label: 'Citations Tracked', value: '89M+', icon: BarChart3, color: 'text-purple-600' },
    { label: 'Daily Updates', value: '15K+', icon: TrendingUp, color: 'text-orange-600' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 will-change-contents">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Research Papers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Search through millions of academic papers with AI-powered insights and analysis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-glow transition-all duration-200">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Section */}
        <Card className="bg-gradient-subtle border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Powered Research Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search for research papers, topics, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button 
                onClick={() => handleSearch(searchQuery)}
                disabled={loading || !searchQuery.trim()}
                className="h-12 px-6 gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Search
              </Button>
            </div>

            {/* Trending Topics */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleQuickSearch(topic)}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search Results ({total})</TabsTrigger>
            <TabsTrigger value="recent">Recent Papers</TabsTrigger>
            <TabsTrigger value="trending">Trending Now</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Found {total} papers for "{searchQuery}"
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter Results
                  </Button>
                </div>
                <div className="grid gap-4">
                  {results.map((paper) => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <EmptyState type="search" />
            ) : (
              <EmptyState
                type="search"
                title="Start Your Research Journey"
                description="Enter a topic, author name, or research question to discover millions of academic papers."
              />
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <EmptyState
              type="history"
              title="Recent Papers Coming Soon"
              description="This feature will show your recently viewed and saved papers."
            />
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <EmptyState
              type="search"
              title="Trending Papers Coming Soon"
              description="Discover the most cited and discussed papers in your field."
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
});

OptimizedDashboard.displayName = 'OptimizedDashboard';

export default OptimizedDashboard;