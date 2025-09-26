import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useOptimizedSearch } from '@/hooks/useOptimizedSearch';
import { EnhancedPaperCard } from '@/components/Research/EnhancedPaperCard';
import { motion } from 'framer-motion';
import { Search, Zap, Brain } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { results, loading, search } = useOptimizedSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;
    await search(query, ['arxiv', 'semantic-scholar']);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const quickSearchTerms = [
    'Machine Learning',
    'Quantum Computing', 
    'Climate Change',
    'CRISPR',
    'Neural Networks'
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-hero rounded-2xl text-white relative overflow-hidden"
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
            <h1 className="text-4xl font-bold mb-4">AI-Powered Research Discovery</h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Search millions of research papers with intelligent analysis and recommendations
            </p>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="w-6 h-6 text-primary" />
                Research Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search for research papers, authors, or topics..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-12 text-lg pl-12 border-2 focus:border-primary"
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
                {quickSearchTerms.map((term) => (
                  <Badge 
                    key={term}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {loading && (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-8 bg-muted rounded w-16"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {results.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Search Results ({results.length})</h2>
            <div className="grid gap-6">
              {results.map((paper) => (
                <EnhancedPaperCard 
                  key={paper.id} 
                  paper={paper}
                />
              ))}
            </div>
          </motion.div>
        )}

        {results.length === 0 && !loading && query && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or using different keywords
              </p>
              <Button onClick={() => setQuery('')}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}