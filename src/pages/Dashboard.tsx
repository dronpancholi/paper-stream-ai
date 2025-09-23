import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useResearch } from '@/hooks/useResearch';
import { SearchResults } from '@/components/Research/SearchResults';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Star, 
  ArrowRight,
  Brain,
  Zap,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, loading, searchPapers } = useResearch();

  const handleSearch = async () => {
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
    { topic: 'Artificial Intelligence', count: 1245, trend: 'rising' },
    { topic: 'Biotechnology', count: 892, trend: 'stable' },
    { topic: 'Renewable Energy', count: 756, trend: 'rising' },
    { topic: 'Data Science', count: 634, trend: 'stable' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gradient-hero rounded-2xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Brain className="w-16 h-16 mx-auto mb-4 text-accent-glow" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Welcome to ResearchAI</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Discover, analyze, and organize research papers with the power of artificial intelligence
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="text-3xl font-bold text-accent-glow">50M+</div>
                <div className="text-white/70">Research Papers</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="text-3xl font-bold text-accent-glow">2.5M+</div>
                <div className="text-white/70">Monthly Searches</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="text-3xl font-bold text-accent-glow">150K+</div>
                <div className="text-white/70">Active Researchers</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="w-6 h-6 text-primary" />
                Intelligent Research Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search for research papers, authors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 text-lg pl-12 border-2 focus:border-primary"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-8 bg-gradient-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Search
                    </div>
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Popular searches:</span>
                {['Machine Learning', 'Quantum Computing', 'Climate Change', 'CRISPR', 'Neural Networks'].map((term) => (
                  <Badge 
                    key={term}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    onClick={() => {
                      setSearchQuery(term);
                      handleSearch();
                    }}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {searchResults && searchResults.papers && searchResults.papers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <SearchResults results={searchResults} loading={loading} />
          </motion.div>
        )}

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <a href="/analysis">
                      <TrendingUp className="w-8 h-8" />
                      <span>Research Trends</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <a href="/authors">
                      <Users className="w-8 h-8" />
                      <span>Author Network</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <a href="/clusters">
                      <Brain className="w-8 h-8" />
                      <span>Research Clusters</span>
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2 hover:bg-primary hover:text-white transition-colors"
                    asChild
                  >
                    <a href="/bookmarks">
                      <BookOpen className="w-8 h-8" />
                      <span>Saved Papers</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">{search}</span>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-sm" asChild>
                  <a href="/history" className="flex items-center gap-2">
                    View all history
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Featured Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Trending Research Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredTopics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className="p-4 bg-gradient-subtle rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSearchQuery(topic.topic);
                      handleSearch();
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{topic.topic}</h3>
                      <Badge variant={topic.trend === 'rising' ? 'default' : 'secondary'}>
                        {topic.trend}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {topic.count.toLocaleString()} papers
                    </p>
                    <div className="flex items-center text-xs text-accent">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}