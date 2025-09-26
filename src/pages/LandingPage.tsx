import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Brain, 
  Bookmark, 
  History, 
  Users, 
  BarChart3, 
  Layers, 
  Zap, 
  Shield, 
  Download,
  ArrowRight,
  Sparkles,
  Globe,
  Database,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const features = [
    {
      icon: Search,
      title: 'Multi-Source Search',
      description: 'Search across arXiv, PubMed, Semantic Scholar, IEEE, and more databases simultaneously',
      color: 'text-primary'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get instant summaries, critiques, and insights powered by advanced AI models',
      color: 'text-accent'
    },
    {
      icon: Layers,
      title: 'Smart Clustering',
      description: 'Automatically group related papers and discover research patterns and trends',
      color: 'text-purple-500'
    },
    {
      icon: Bookmark,
      title: 'Save & Organize',
      description: 'Bookmark papers, create collections, and organize your research library',
      color: 'text-yellow-500'
    },
    {
      icon: Eye,
      title: 'In-App PDF Viewer',
      description: 'Read papers directly in the platform without external redirects',
      color: 'text-green-500'
    },
    {
      icon: BarChart3,
      title: 'Research Analytics',
      description: 'Track citation trends, author networks, and research impact metrics',
      color: 'text-red-500'
    }
  ];

  const stats = [
    { label: 'Research Papers', value: '50M+', icon: Database },
    { label: 'Active Users', value: '100K+', icon: Users },
    { label: 'AI Summaries', value: '1M+', icon: Brain },
    { label: 'Citations Tracked', value: '500M+', icon: BarChart3 }
  ];

  const integrations = [
    'arXiv', 'PubMed', 'Semantic Scholar', 'IEEE Xplore', 'CrossRef', 
    'CORE', 'Springer', 'Elsevier', 'OpenAlex', 'Grok AI'
  ];

  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary-glow" />
            <span className="text-2xl font-bold">i-SMART Research Scholar</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link to="/demo">Demo</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Features
            </Button>
            <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge className="bg-white/10 text-white border-white/20 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Advanced AI
          </Badge>
          
          <h1 className="text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary-glow to-accent-glow bg-clip-text text-transparent">i-SMART</span> Research Scholar
            <br />
            <span className="text-4xl">AI-Powered Research Assistant</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Built by students of Government Polytechnic Ahmedabad. Access millions of research papers, 
            get intelligent summaries, discover collaboration networks, and accelerate your academic research with advanced AI.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-8">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              <Link to="/search">
                Start Researching
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-12 h-12 text-primary-glow mx-auto mb-4" />
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Wall */}
      <section className="bg-white text-foreground py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Everything You Need for Research Excellence</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge AI with intuitive design to transform how you discover, 
              analyze, and organize scientific knowledge.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-card hover:shadow-glow transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-gradient-subtle py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-8">Integrated with Leading Research Databases</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <Badge key={index} variant="secondary" className="text-lg px-4 py-2">
                {integration}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Ready to Transform Your Research?</h2>
            <p className="text-xl text-primary-foreground/80">
              Join thousands of researchers who are already using AI to accelerate their discoveries
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6">
                <MessageSquare className="w-5 h-5 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">i-SMART Research Scholar</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered research assistant built by students for students.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link to="/roadmap" className="block hover:text-primary">Roadmap</Link>
                <Link to="/demo" className="block hover:text-primary">Demo</Link>
                <Link to="/search" className="block hover:text-primary">Search</Link>
                <Link to="/authors" className="block hover:text-primary">Authors</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Institution</h4>
              <div className="space-y-2 text-muted-foreground">
                <div>Government Polytechnic Ahmedabad</div>
                <div>Student Project</div>
                <div>Hackathon 2024</div>
                <div>Contact Team</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link to="/privacy" className="block hover:text-primary">Privacy Policy</Link>
                <Link to="/terms" className="block hover:text-primary">Terms of Service</Link>
                <div>Open Source</div>
                <div>Academic Use</div>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 i-SMART Research Scholar. Built by students of Government Polytechnic Ahmedabad.</p>
            <p className="text-sm mt-2">Empowering student researchers with AI-powered discovery tools.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}