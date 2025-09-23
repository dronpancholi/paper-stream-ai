import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Download, 
  Share2, 
  Plus,
  FolderOpen,
  Eye,
  Trash2
} from 'lucide-react';

export default function MyPages() {
  const [searchQuery, setSearchQuery] = useState('');

  const collections = [
    {
      id: '1',
      name: 'Machine Learning Research',
      description: 'Papers on deep learning and neural networks',
      paperCount: 24,
      lastUpdated: '2024-01-15',
      tags: ['AI', 'Deep Learning', 'Neural Networks']
    },
    {
      id: '2', 
      name: 'Climate Science',
      description: 'Research on climate change and environmental impacts',
      paperCount: 18,
      lastUpdated: '2024-01-12',
      tags: ['Climate', 'Environment', 'Sustainability']
    },
    {
      id: '3',
      name: 'Quantum Computing',
      description: 'Latest developments in quantum algorithms',
      paperCount: 15,
      lastUpdated: '2024-01-10',
      tags: ['Quantum', 'Computing', 'Algorithms']
    }
  ];

  const recentPapers = [
    {
      id: '1',
      title: 'Attention Is All You Need',
      authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.'],
      journal: 'NIPS',
      year: 2017,
      added: '2024-01-15',
      collection: 'Machine Learning Research'
    },
    {
      id: '2',
      title: 'Deep Residual Learning for Image Recognition',
      authors: ['He, K.', 'Zhang, X.', 'Ren, S.'],
      journal: 'CVPR',
      year: 2016,
      added: '2024-01-14',
      collection: 'Machine Learning Research'
    },
    {
      id: '3',
      title: 'Climate Change and Global Warming',
      authors: ['Hansen, J.', 'Sato, M.', 'Ruedy, R.'],
      journal: 'Nature Climate Change',
      year: 2023,
      added: '2024-01-12',
      collection: 'Climate Science'
    }
  ];

  const stats = [
    { label: 'Total Papers', value: 127, icon: FileText },
    { label: 'Collections', value: 8, icon: FolderOpen },
    { label: 'Citations', value: '2.3K', icon: Quote },
    { label: 'Downloads', value: 89, icon: Download }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Research Library</h1>
            <p className="text-muted-foreground">Organize and manage your saved research papers</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Collection
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search your library..."
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
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="collections" className="space-y-6">
          <TabsList>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="papers">All Papers</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>

          <TabsContent value="collections" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-glow transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FolderOpen className="w-6 h-6 text-primary" />
                      <Badge variant="secondary">{collection.paperCount} papers</Badge>
                    </div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {collection.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Updated {collection.lastUpdated}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="papers" className="space-y-6">
            <div className="space-y-4">
              {recentPapers.map((paper) => (
                <Card key={paper.id} className="hover:shadow-card transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                          {paper.title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {paper.authors.join(', ')} • {paper.journal} • {paper.year}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="secondary">{paper.collection}</Badge>
                          <span className="text-muted-foreground">Added {paper.added}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <div className="space-y-4">
              {recentPapers.slice(0, 5).map((paper) => (
                <Card key={paper.id} className="hover:shadow-card transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                          {paper.title}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {paper.authors.join(', ')} • {paper.journal} • {paper.year}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Added {paper.added}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function Quote({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}