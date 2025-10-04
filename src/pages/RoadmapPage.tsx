import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Rocket, 
  Users, 
  Globe, 
  Brain,
  Smartphone,
  BookOpen,
  Languages,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const roadmapItems = [
  {
    phase: 'Phase 1 - Foundation',
    status: 'completed',
    timeline: 'Q1 2024',
    items: [
      'Multi-source research paper search (arXiv, Semantic Scholar)',
      'AI-powered query enhancement with Grok API',
      'Professional PDF viewer with in-app reading',
      'User authentication and personal libraries',
      'Liquid glass UI design system',
      'Basic analytics and collaboration networks'
    ]
  },
  {
    phase: 'Phase 2 - Enhancement',
    status: 'in-progress',
    timeline: 'Q2 2024',
    items: [
      'Advanced paper clustering and categorization',
      'Enhanced author profiles and networks',
      'Improved search filters and recommendations',
      'Citation management and export features',
      'Performance optimizations and mobile responsiveness',
      'Community feedback and rating system'
    ]
  },
  {
    phase: 'Phase 3 - Expansion',
    status: 'planned',
    timeline: 'Q3 2024',
    items: [
      'Mobile application for iOS and Android',
      'Integration with additional research databases',
      'Advanced AI summarization and critique features',
      'Collaborative research spaces and sharing',
      'Multi-language support (Hindi, Gujarati)',
      'API access for institutional integration'
    ]
  },
  {
    phase: 'Phase 4 - Innovation',
    status: 'future',
    timeline: 'Q4 2024 & Beyond',
    items: [
      'Real-time collaboration tools',
      'AI-generated research insights and trends',
      'Institutional partnerships and deployment',
      'Advanced citation analysis and impact metrics',
      'Machine learning-powered research recommendations',
      'Open-source community contributions'
    ]
  }
];

const goals = [
  {
    icon: Target,
    title: 'Vision',
    description: 'To make AI-powered research assistance accessible for every student and researcher in India and beyond.',
    color: 'text-primary'
  },
  {
    icon: Users,
    title: 'Impact',
    description: 'Empower 100,000+ students with better research tools, reducing research time by 60% on average.',
    color: 'text-accent'
  },
  {
    icon: Globe,
    title: 'Reach',
    description: 'Expand to universities across India, then globally, fostering international academic collaboration.',
    color: 'text-green-500'
  },
  {
    icon: Brain,
    title: 'Innovation',
    description: 'Pioneer new AI research methodologies and contribute to the global academic technology ecosystem.',
    color: 'text-purple-500'
  }
];

const statusConfig = {
  completed: { color: 'bg-green-500', label: 'Completed', icon: CheckCircle },
  'in-progress': { color: 'bg-yellow-500', label: 'In Progress', icon: Clock },
  planned: { color: 'bg-blue-500', label: 'Planned', icon: Calendar },
  future: { color: 'bg-gray-400', label: 'Future', icon: Rocket }
};

export default function RoadmapPage() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-gradient-hero rounded-2xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          <div className="relative z-10">
            <Rocket className="w-16 h-16 mx-auto mb-4 text-accent-glow floating" />
            <h1 className="text-4xl font-bold mb-4">i-SMART Research Scholar Roadmap</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our journey to revolutionize academic research for students worldwide
            </p>
          </div>
        </motion.div>

        {/* Vision & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Our Mission & Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full glass-button hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <goal.icon className={`w-12 h-12 ${goal.color} mx-auto mb-4`} />
                    <h3 className="text-lg font-semibold mb-2">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {goal.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Development Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Development Roadmap</h2>
          <div className="space-y-6">
            {roadmapItems.map((phase, index) => {
              const config = statusConfig[phase.status];
              const StatusIcon = config.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="shadow-card hover:shadow-glow transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                          <CardTitle className="text-xl">{phase.phase}</CardTitle>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <Badge variant="secondary">{phase.timeline}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {phase.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Future Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Upcoming Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-button hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Mobile App</h3>
                <p className="text-sm text-muted-foreground">
                  Native iOS and Android apps for research on the go
                </p>
              </CardContent>
            </Card>

            <Card className="glass-button hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Languages className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
                <p className="text-sm text-muted-foreground">
                  Support for Hindi, Gujarati, and other regional languages
                </p>
              </CardContent>
            </Card>

            <Card className="glass-button hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Citation Manager</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced citation management and bibliography generation
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-12"
        >
          <Card className="bg-gradient-subtle border-0 shadow-elegant">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Built by students, for students. Help us shape the future of academic research 
                by providing feedback and suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary text-lg px-8 py-4"
                  onClick={() => navigate('/search')}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Try the Platform
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4"
                  onClick={() => navigate('/profile')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Provide Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}