import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  Search, 
  Filter, 
  Zap, 
  Eye, 
  Share2, 
  Download,
  Network,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';

export default function Clusters() {
  const [searchQuery, setSearchQuery] = useState('');

  const clusters = [
    {
      id: '1',
      name: 'Transformer Architecture Evolution',
      description: 'Papers focusing on improvements and variations of the transformer architecture',
      paperCount: 89,
      keywords: ['Transformer', 'Attention', 'BERT', 'GPT', 'Architecture'],
      dominantField: 'Natural Language Processing',
      cohesion: 0.87,
      trending: true,
      lastUpdated: '2024-01-15',
      topAuthors: ['Vaswani, A.', 'Devlin, J.', 'Brown, T.'],
      citationImpact: 'Very High'
    },
    {
      id: '2',
      name: 'Quantum Machine Learning Applications',
      description: 'Research on applying quantum computing principles to machine learning tasks',
      paperCount: 34,
      keywords: ['Quantum', 'NISQ', 'VQE', 'Quantum ML', 'Hybrid Algorithms'],
      dominantField: 'Quantum Computing',
      cohesion: 0.92,
      trending: true,
      lastUpdated: '2024-01-14',
      topAuthors: ['Preskill, J.', 'Biamonte, J.', 'Rebentrost, P.'],
      citationImpact: 'High'
    },
    {
      id: '3',
      name: 'Climate Change Modeling with AI',
      description: 'AI and ML approaches for climate prediction and environmental monitoring',
      paperCount: 67,
      keywords: ['Climate', 'Environmental AI', 'Weather Prediction', 'Sustainability'],
      dominantField: 'Environmental Science',
      cohesion: 0.79,
      trending: false,
      lastUpdated: '2024-01-12',
      topAuthors: ['Hansen, J.', 'Schmidt, G.', 'Rasp, S.'],
      citationImpact: 'Medium'
    },
    {
      id: '4',
      name: 'Federated Learning Privacy',
      description: 'Privacy-preserving techniques in distributed machine learning systems',
      paperCount: 52,
      keywords: ['Federated Learning', 'Privacy', 'Differential Privacy', 'Distributed ML'],
      dominantField: 'Machine Learning',
      cohesion: 0.84,
      trending: true,
      lastUpdated: '2024-01-13',
      topAuthors: ['McMahan, B.', 'Li, T.', 'Kairouz, P.'],
      citationImpact: 'High'
    },
    {
      id: '5',
      name: 'Explainable AI in Healthcare',
      description: 'Interpretable machine learning models for medical diagnosis and treatment',
      paperCount: 76,
      keywords: ['XAI', 'Healthcare', 'Medical AI', 'Interpretability', 'Clinical'],
      dominantField: 'Medical AI',
      cohesion: 0.81,
      trending: false,
      lastUpdated: '2024-01-11',
      topAuthors: ['Rajkomar, A.', 'Topol, E.', 'Ghassemi, M.'],
      citationImpact: 'Very High'
    }
  ];

  const stats = [
    { label: 'Active Clusters', value: 156, icon: Layers },
    { label: 'Papers Clustered', value: '12.4K', icon: Network },
    { label: 'Research Themes', value: 89, icon: Brain },
    { label: 'Emerging Topics', value: 23, icon: TrendingUp }
  ];

  const methodologies = [
    {
      name: 'Semantic Clustering',
      description: 'Groups papers based on semantic similarity of abstracts and content',
      accuracy: '94%',
      papers: '8.2K'
    },
    {
      name: 'Citation Network Analysis',
      description: 'Clusters based on citation patterns and research lineage',
      accuracy: '89%',
      papers: '6.7K'
    },
    {
      name: 'Author Collaboration',
      description: 'Groups papers by author collaboration networks',
      accuracy: '87%',
      papers: '4.8K'
    },
    {
      name: 'Keyword Co-occurrence',
      description: 'Clusters based on keyword and topic co-occurrence patterns',
      accuracy: '91%',
      papers: '7.1K'
    }
  ];

  const filteredClusters = clusters.filter(cluster =>
    cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="w-8 h-8 text-primary" />
              Research Clusters
            </h1>
            <p className="text-muted-foreground">
              Discover research patterns and thematic groups powered by AI clustering
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Zap className="w-4 h-4" />
              Generate New Clusters
            </Button>
            <Button className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Insights
            </Button>
          </div>
        </div>

        {/* Stats */}
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

        <Tabs defaultValue="clusters" className="space-y-6">
          <TabsList>
            <TabsTrigger value="clusters">Research Clusters</TabsTrigger>
            <TabsTrigger value="methodologies">Clustering Methods</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="clusters" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search clusters, keywords, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Advanced Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clusters */}
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredClusters.map((cluster) => (
                <Card key={cluster.id} className="hover:shadow-glow transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{cluster.name}</CardTitle>
                          {cluster.trending && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {cluster.dominantField}
                        </Badge>
                      </div>
                      <Badge variant="secondary">
                        {cluster.paperCount} papers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {cluster.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {cluster.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Cohesion: </span>
                          <span className="font-medium">{(cluster.cohesion * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Impact: </span>
                          <Badge className={`text-xs ${getImpactColor(cluster.citationImpact)}`}>
                            {cluster.citationImpact}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Top Authors: </span>
                        <span>{cluster.topAuthors.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        Updated {cluster.lastUpdated}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4" />
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

          <TabsContent value="methodologies" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {methodologies.map((method, index) => (
                <Card key={index} className="hover:shadow-card transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5 text-primary" />
                      {method.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-accent/5 rounded-lg">
                        <div className="font-bold text-lg text-primary">{method.accuracy}</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-accent/5 rounded-lg">
                        <div className="font-bold text-lg text-primary">{method.papers}</div>
                        <div className="text-xs text-muted-foreground">Papers</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-gradient-subtle">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="font-medium mb-2">🔥 Emerging Research Area</div>
                      <p className="text-sm text-muted-foreground">
                        "Quantum-Classical Hybrid Algorithms" is showing 234% growth in publications 
                        over the last 6 months, suggesting it's becoming a major research focus.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="font-medium mb-2">🔗 Cross-Cluster Connections</div>
                      <p className="text-sm text-muted-foreground">
                        Strong collaboration patterns detected between "Transformer Architecture" 
                        and "Healthcare AI" clusters, indicating interdisciplinary research growth.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="font-medium mb-2">📈 Citation Acceleration</div>
                      <p className="text-sm text-muted-foreground">
                        Papers in the "Federated Learning Privacy" cluster are receiving 
                        citations 3x faster than the field average, indicating high impact.
                      </p>
                    </div>
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