import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Brain, 
  Network, 
  Calendar, 
  Download,
  Zap,
  Eye,
  Share2,
  Filter
} from 'lucide-react';

export default function Analysis() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  const trendingTopics = [
    {
      topic: 'Large Language Models',
      growth: '+145%',
      papers: 2847,
      keywords: ['GPT', 'LLM', 'Transformer', 'BERT'],
      trend: 'rising'
    },
    {
      topic: 'Quantum Machine Learning',
      growth: '+89%',
      papers: 456,
      keywords: ['Quantum', 'NISQ', 'VQE', 'QAOA'],
      trend: 'rising'
    },
    {
      topic: 'Climate AI',
      growth: '+67%',
      papers: 1234,
      keywords: ['Climate', 'Environmental', 'Sustainability'],
      trend: 'stable'
    },
    {
      topic: 'Neural Architecture Search',
      growth: '+34%',
      papers: 789,
      keywords: ['NAS', 'AutoML', 'Architecture'],
      trend: 'declining'
    }
  ];

  const citationAnalysis = [
    {
      paper: 'Attention Is All You Need',
      citations: 89543,
      monthlyGrowth: '+2.3%',
      impact: 'Very High',
      field: 'Natural Language Processing'
    },
    {
      paper: 'BERT: Pre-training Deep Bidirectional Transformers',
      citations: 67432,
      monthlyGrowth: '+1.8%',
      impact: 'Very High',
      field: 'Natural Language Processing'
    },
    {
      paper: 'ResNet: Deep Residual Learning',
      citations: 156782,
      monthlyGrowth: '+1.2%',
      impact: 'Very High',
      field: 'Computer Vision'
    }
  ];

  const collaborationNetworks = [
    {
      institution: 'Stanford University',
      collaborations: 234,
      topFields: ['AI', 'ML', 'NLP'],
      influence: 95
    },
    {
      institution: 'MIT',
      collaborations: 198,
      topFields: ['Quantum', 'Robotics', 'AI'],
      influence: 92
    },
    {
      institution: 'Google Research',
      collaborations: 156,
      topFields: ['Deep Learning', 'NLP', 'Computer Vision'],
      influence: 89
    }
  ];

  const emergingAreas = [
    {
      area: 'Neuromorphic Computing',
      papers: 245,
      growth: '+234%',
      description: 'Brain-inspired computing architectures',
      maturity: 'Emerging'
    },
    {
      area: 'Federated Learning',
      papers: 1456,
      growth: '+178%',
      description: 'Distributed machine learning without centralized data',
      maturity: 'Growing'
    },
    {
      area: 'Explainable AI',
      papers: 2134,
      growth: '+156%',
      description: 'Making AI decisions interpretable and transparent',
      maturity: 'Established'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'stable': return <BarChart3 className="w-4 h-4 text-blue-500" />;
      case 'declining': return <BarChart3 className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              Research Analysis
            </h1>
            <p className="text-muted-foreground">
              Discover trends, patterns, and insights across the research landscape
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Analysis
            </Button>
          </div>
        </div>

        {/* Time Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Analysis Timeframe:</span>
              </div>
              <div className="flex items-center gap-2">
                {['3months', '6months', '1year', '2years'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedTimeframe === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(period)}
                  >
                    {period === '3months' ? '3M' : period === '6months' ? '6M' : period === '1year' ? '1Y' : '2Y'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trending Topics</TabsTrigger>
            <TabsTrigger value="citations">Citation Analysis</TabsTrigger>
            <TabsTrigger value="networks">Collaboration Networks</TabsTrigger>
            <TabsTrigger value="emerging">Emerging Areas</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid gap-6">
              {trendingTopics.map((topic, index) => (
                <Card key={index} className="hover:shadow-glow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{topic.topic}</h3>
                          {getTrendIcon(topic.trend)}
                          <Badge 
                            variant="secondary" 
                            className={`${topic.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {topic.growth}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground">
                          {topic.papers.toLocaleString()} papers published
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {topic.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Zap className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="citations" className="space-y-6">
            <div className="space-y-6">
              {citationAnalysis.map((paper, index) => (
                <Card key={index} className="hover:shadow-card transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                          {paper.paper}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{paper.citations.toLocaleString()} citations</span>
                          <Badge variant="secondary" className="text-green-600">
                            {paper.monthlyGrowth}
                          </Badge>
                          <Badge variant="outline">{paper.field}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Impact Level:</span>
                          <Badge 
                            className={
                              paper.impact === 'Very High' ? 'bg-red-500 text-white' :
                              paper.impact === 'High' ? 'bg-orange-500 text-white' :
                              'bg-yellow-500 text-white'
                            }
                          >
                            {paper.impact}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <BarChart3 className="w-8 h-8 text-primary mb-2" />
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="networks" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborationNetworks.map((network, index) => (
                <Card key={index} className="hover:shadow-glow transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Network className="w-6 h-6 text-primary" />
                      <Badge variant="secondary">{network.influence}/100</Badge>
                    </div>
                    <CardTitle className="text-lg">{network.institution}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      {network.collaborations} active collaborations
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Top Research Areas:</div>
                      <div className="flex flex-wrap gap-1">
                        {network.topFields.map((field, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Network
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="emerging" className="space-y-6">
            <div className="space-y-6">
              {emergingAreas.map((area, index) => (
                <Card key={index} className="hover:shadow-glow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{area.area}</h3>
                          <Badge 
                            variant={
                              area.maturity === 'Emerging' ? 'default' :
                              area.maturity === 'Growing' ? 'secondary' :
                              'outline'
                            }
                          >
                            {area.maturity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{area.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{area.papers} papers</span>
                          <Badge variant="secondary" className="text-green-600">
                            {area.growth}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Explore
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
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