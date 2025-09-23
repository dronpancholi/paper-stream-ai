import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, BookmarkPlus, TrendingUp, Users, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Demo = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemo, setActiveDemo] = useState('search');

  const demoData = {
    papers: [
      {
        id: '1',
        title: 'Attention Is All You Need: Transformer Networks for Natural Language Processing',
        authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.'],
        journal: 'Neural Information Processing Systems',
        year: 2017,
        citations: 25463,
        abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms...',
        keywords: ['Transformer', 'Attention', 'Neural Networks', 'NLP'],
        pdfUrl: '#demo-pdf',
        source: 'arXiv'
      },
      {
        id: '2',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
        authors: ['Devlin, J.', 'Chang, M.W.', 'Lee, K.'],
        journal: 'NAACL-HLT',
        year: 2019,
        citations: 18742,
        abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional...',
        keywords: ['BERT', 'Bidirectional', 'Language Model', 'Transformer'],
        pdfUrl: '#demo-pdf',
        source: 'Google AI'
      },
      {
        id: '3',
        title: 'GPT-3: Language Models are Few-Shot Learners',
        authors: ['Brown, T.', 'Mann, B.', 'Ryder, N.'],
        journal: 'Neural Information Processing Systems',
        year: 2020,
        citations: 12356,
        abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training...',
        keywords: ['GPT-3', 'Few-Shot Learning', 'Large Language Models'],
        pdfUrl: '#demo-pdf',
        source: 'OpenAI'
      }
    ],
    analytics: {
      totalPapers: 50000000,
      monthlySearches: 2500000,
      activeUsers: 150000,
      savedPapers: 5000000
    }
  };

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Smart Search',
      description: 'AI-powered search across 50M+ research papers with semantic understanding'
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Analysis',
      description: 'Automated paper summarization, key insights extraction, and trend analysis'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Collaboration',
      description: 'Share research, create collections, and collaborate with your team'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Analytics',
      description: 'Track research trends, citation networks, and emerging topics'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      <div className="relative z-10">
        <nav className="p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">ResearchAI Demo</span>
            </div>
            <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
              <a href="/auth">Try Full Platform</a>
            </Button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Experience Research Discovery
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Explore how our AI-powered platform transforms academic research with intelligent search, analysis, and collaboration tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/70">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/95 backdrop-blur-md shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Interactive Search Demo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Try searching: 'transformer neural networks' or 'quantum computing'"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={() => setActiveDemo('search')}>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <Badge variant="secondary">AI/ML</Badge>
                      <Badge variant="secondary">Computer Science</Badge>
                      <Badge variant="secondary">Recent Papers</Badge>
                      <Badge variant="secondary">High Impact</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {demoData.papers.map((paper, index) => (
                      <motion.div
                        key={paper.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg leading-tight">{paper.title}</h3>
                          <Badge variant="outline">{paper.citations.toLocaleString()} citations</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-2">
                          {paper.authors.join(', ')} • {paper.journal} ({paper.year})
                        </p>
                        
                        <p className="text-sm mb-3 line-clamp-2">{paper.abstract}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {paper.keywords.map((keyword) => (
                              <Badge key={keyword} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              <BookmarkPlus className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/95 backdrop-blur-md shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Platform Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{demoData.analytics.totalPapers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Research Papers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{demoData.analytics.monthlySearches.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Monthly Searches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{demoData.analytics.activeUsers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Active Researchers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{demoData.analytics.savedPapers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Papers Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-md shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Semantic Search
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Auto Summarization
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Citation Analysis
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Trend Detection
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      Research Clustering
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Ready to get started?</h3>
                  <p className="text-sm mb-4 opacity-90">Join thousands of researchers worldwide</p>
                  <Button asChild variant="secondary" className="w-full">
                    <a href="/auth">Start Free Trial</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;