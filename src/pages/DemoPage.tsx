import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedPaperCard } from '@/components/Research/EnhancedPaperCard';
import { motion } from 'framer-motion';
import { 
  Search, 
  Brain, 
  Network, 
  TrendingUp,
  Zap,
  Star,
  Eye,
  BookOpen,
  Users,
  BarChart3,
  Play,
  Pause
} from 'lucide-react';

// Demo data for interactive showcase
const demoPapers = [
  {
    id: 'demo-1',
    title: 'Attention Is All You Need: Transformer Architecture for Natural Language Processing',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
    abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable.',
    source: 'arXiv',
    year: 2017,
    citationCount: 45000,
    journal: 'NIPS 2017',
    doi: '10.48550/arXiv.1706.03762',
    url: 'https://arxiv.org/abs/1706.03762',
    pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf'
  },
  {
    id: 'demo-2', 
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. BERT is designed to pre-train deep bidirectional representations from unlabeled text.',
    source: 'arXiv',
    year: 2018,
    citationCount: 38000,
    journal: 'NAACL 2019',
    doi: '10.48550/arXiv.1810.04805',
    url: 'https://arxiv.org/abs/1810.04805',
    pdfUrl: 'https://arxiv.org/pdf/1810.04805.pdf'
  },
  {
    id: 'demo-3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    authors: ['Tom B. Brown', 'Benjamin Mann', 'Nick Ryder'],
    abstract: 'We show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches.',
    source: 'arXiv', 
    year: 2020,
    citationCount: 25000,
    journal: 'NIPS 2020',
    doi: '10.48550/arXiv.2005.14165',
    url: 'https://arxiv.org/abs/2005.14165',
    pdfUrl: 'https://arxiv.org/pdf/2005.14165.pdf'
  }
];

const demoFeatures = [
  {
    icon: Brain,
    title: 'AI-Powered Search',
    description: 'Enhanced with Grok AI for intelligent query understanding and contextual results',
    demo: 'Search queries are automatically enhanced with synonyms and technical terms'
  },
  {
    icon: Network, 
    title: 'Collaboration Network',
    description: 'Interactive visualizations of author relationships and research connections',
    demo: 'Discover how researchers collaborate across institutions and topics'
  },
  {
    icon: TrendingUp,
    title: 'Emerging Areas',
    description: 'Real-time analysis of trending research topics and breakthrough discoveries',
    demo: 'Track the evolution of research areas with temporal analysis'
  },
  {
    icon: Star,
    title: 'Smart Recommendations', 
    description: 'Personalized paper suggestions based on your research interests and activity',
    demo: 'Machine learning algorithms suggest relevant papers you might have missed'
  }
];

export default function DemoPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('machine learning transformers');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    'AI enhances your search query',
    'Multiple sources searched simultaneously', 
    'Results deduplicated and ranked',
    'Papers displayed with rich metadata'
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 2000);
  };

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
              <Brain className="w-20 h-20 mx-auto mb-4 text-accent-glow floating" />
            </motion.div>
            <h1 className="text-5xl font-bold mb-4">ResearchAI Demo</h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Experience the future of research discovery with AI-powered search, intelligent analysis, and collaborative insights
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="glass-button text-lg px-8 py-4"
                asChild
              >
                <Link to="/search">
                  <Zap className="w-5 h-5 mr-2" />
                  Try Live Search
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/auth">
                  <Star className="w-5 h-5 mr-2" />
                  Sign Up Free
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Search className="w-6 h-6 text-primary" />
                Interactive Search Demo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 border-2 border-muted rounded-lg focus:border-primary outline-none text-lg"
                      placeholder="Try: 'machine learning', 'quantum computing', 'CRISPR'"
                    />
                  </div>
                </div>
                <Button 
                  onClick={startDemo}
                  disabled={isPlaying}
                  className="h-12 px-6 bg-gradient-primary"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Demo
                    </>
                  )}
                </Button>
              </div>

              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-accent/10 rounded-lg p-4 border border-accent/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                    <span className="font-medium text-accent">Demo Step {currentStep + 1}/4</span>
                  </div>
                  <p className="text-sm">{demoSteps[currentStep]}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sample Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Sample Search Results</h2>
          <div className="grid gap-6">
            {demoPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <EnhancedPaperCard paper={paper} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Powerful Research Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="h-full glass-button hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                      <p className="text-sm text-accent font-medium">{feature.demo}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-center">Platform Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">50M+</div>
                  <div className="text-sm text-muted-foreground">Research Papers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">2.5M+</div>
                  <div className="text-sm text-muted-foreground">Monthly Searches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">150K+</div>
                  <div className="text-sm text-muted-foreground">Active Researchers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">5K+</div>
                  <div className="text-sm text-muted-foreground">Institutions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center py-12"
        >
          <Card className="bg-gradient-subtle border-0 shadow-elegant">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Research?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of researchers who are discovering, analyzing, and collaborating more effectively with ResearchAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary text-lg px-8 py-4"
                  asChild
                >
                  <Link to="/auth">
                    <Star className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4"
                  asChild
                >
                  <Link to="/search">
                    <Search className="w-5 h-5 mr-2" />
                    Try Search Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}