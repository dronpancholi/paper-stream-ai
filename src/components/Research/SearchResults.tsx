import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PaperCard, ResearchPaper } from './PaperCard';
import { Download, Filter, BarChart3, Clock, Star } from 'lucide-react';

interface SearchResultsProps {
  results: {
    papers: ResearchPaper[];
    totalCount: number;
    clusters?: Array<{ name: string; count: number; papers: ResearchPaper[] }>;
  };
  loading?: boolean;
  onSort?: (sortBy: string) => void;
  onFilter?: (filter: string) => void;
}

export const SearchResults = ({ results, loading, onSort, onFilter }: SearchResultsProps) => {
  const { papers, totalCount, clusters } = results;
  
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'citations', label: 'Citations' },
    { value: 'impact', label: 'Impact Factor' },
  ];

  const handleBookmark = (paperId: string) => {
    console.log('Bookmark paper:', paperId);
  };

  const handleSummarize = (paperId: string) => {
    console.log('Summarize paper:', paperId);
  };

  const handleDownload = (paperId: string) => {
    console.log('Download paper:', paperId);
  };

  const handleExportResults = () => {
    console.log('Export results');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Search Results</CardTitle>
              <p className="text-muted-foreground">
                Found {totalCount.toLocaleString()} papers
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select onValueChange={onSort}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExportResults} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Results */}
        <div className="lg:col-span-3 space-y-4">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onBookmark={handleBookmark}
              onSummarize={handleSummarize}
              onDownload={handleDownload}
            />
          ))}

          {papers.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No papers found</h3>
                  <p>Try adjusting your search terms or filters</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Avg. Year</span>
                </div>
                <span className="font-semibold">
                  {papers.length > 0 
                    ? Math.round(papers.reduce((sum, p) => sum + p.year, 0) / papers.length)
                    : 0
                  }
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Total Citations</span>
                </div>
                <span className="font-semibold">
                  {papers.reduce((sum, p) => sum + (p.citationCount || 0), 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Clusters */}
          {clusters && clusters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Related Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {clusters.slice(0, 5).map((cluster, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <span className="text-sm font-medium">{cluster.name}</span>
                    <Badge variant="secondary">{cluster.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Top Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(
                papers.reduce((acc, paper) => {
                  acc[paper.source] = (acc[paper.source] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm">{source}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};