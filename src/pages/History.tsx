import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  History as HistoryIcon, 
  Search, 
  Clock, 
  TrendingUp,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Trash2,
  RefreshCw
} from 'lucide-react';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchHistory = [
    {
      id: '1',
      query: 'machine learning healthcare applications',
      timestamp: '2024-01-15 14:30',
      resultsCount: 142,
      filters: { source: 'PubMed', year: '2023-2024' },
      saved: true
    },
    {
      id: '2',
      query: 'quantum computing algorithms',
      timestamp: '2024-01-15 11:15',
      resultsCount: 78,
      filters: { source: 'arXiv', minCitations: 10 },
      saved: false
    },
    {
      id: '3',
      query: 'climate change impact biodiversity',
      timestamp: '2024-01-14 16:45',
      resultsCount: 256,
      filters: { year: '2020-2024', domain: 'Environmental Science' },
      saved: true
    },
    {
      id: '4',
      query: 'neural networks deep learning',
      timestamp: '2024-01-14 09:22',
      resultsCount: 1834,
      filters: { source: 'Semantic Scholar' },
      saved: false
    },
    {
      id: '5',
      query: 'CRISPR gene editing applications',
      timestamp: '2024-01-13 13:07',
      resultsCount: 89,
      filters: { source: 'PubMed', minCitations: 50 },
      saved: true
    }
  ];

  const stats = [
    { label: 'Total Searches', value: 127, icon: Search, trend: '+12%' },
    { label: 'Papers Viewed', value: 342, icon: BarChart3, trend: '+8%' },
    { label: 'Time Saved', value: '24h', icon: Clock, trend: '+15%' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, trend: '+2%' }
  ];

  const topQueries = [
    { query: 'machine learning', count: 23 },
    { query: 'artificial intelligence', count: 18 },
    { query: 'climate change', count: 15 },
    { query: 'quantum computing', count: 12 },
    { query: 'neural networks', count: 11 }
  ];

  const filteredHistory = searchHistory.filter(item =>
    item.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <HistoryIcon className="w-8 h-8 text-primary" />
              Search History
            </h1>
            <p className="text-muted-foreground">
              Track your research journey and revisit previous searches
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export History
            </Button>
            <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                  <div className="text-right">
                    <stat.icon className="w-8 h-8 text-primary mb-2" />
                    <Badge variant="secondary" className="text-xs text-green-600">
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search History */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search your history..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium hover:text-primary cursor-pointer">
                            "{item.query}"
                          </h3>
                          {item.saved && (
                            <Badge variant="secondary" className="text-xs">Saved</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.resultsCount} results found
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(item.timestamp)}
                          </div>
                          {Object.entries(item.filters).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <RefreshCw className="w-3 h-3" />
                          Rerun
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Queries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Searched Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topQueries.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm hover:text-primary cursor-pointer">
                      {item.query}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Search className="w-4 h-4" />
                  Repeat Last Search
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Searches
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Search
                </Button>
              </CardContent>
            </Card>

            {/* Search Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Peak search time</span>
                    <span className="font-medium">2-4 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Most active day</span>
                    <span className="font-medium">Tuesday</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average results viewed</span>
                    <span className="font-medium">23 papers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Favorite source</span>
                    <span className="font-medium">arXiv</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}