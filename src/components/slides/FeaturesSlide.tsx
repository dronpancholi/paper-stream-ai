import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { FileText, Filter, MessageSquare, User, Copy, Star } from 'lucide-react';

const FeaturesSlide = () => {
  const features = [
    {
      icon: FileText,
      title: "Summarization Engine",
      description: "Multi-format support: PDF, Word, HTML, audio/video transcripts",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      icon: Filter,
      title: "Classification Engine",
      description: "Impact factor, author ranking, sentiment, publisher analysis",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      icon: MessageSquare,
      title: "Critique Generator",
      description: "Major findings, limitations, peer-review validation",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      icon: User,
      title: "Author Profile Builder",
      description: "Domain expertise, cluster analysis, rating system",
      color: "bg-accent/10 text-accent border-accent/20"
    },
    {
      icon: Copy,
      title: "Duplicate Detection",
      description: "Advanced clustering and similarity matching",
      color: "bg-primary/10 text-primary border-primary/20"
    },
    {
      icon: Star,
      title: "Recommendation System",
      description: "Intelligent paper suggestions and purchase guidance",
      color: "bg-accent/10 text-accent border-accent/20"
    }
  ];

  return (
    <PresentationSlide id="features-slide">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-foreground">
            Core Features
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Six powerful AI modules working together to revolutionize research analysis
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className={`p-6 rounded-xl border-2 ${feature.color} hover:scale-105 transition-smooth group cursor-pointer`}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Icon className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Technical Highlights */}
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <h3 className="text-2xl font-semibold mb-6">Technical Excellence</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">AI-Powered</h4>
              <p className="text-sm text-muted-foreground">Advanced NLP models for accurate analysis</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-accent">Scalable</h4>
              <p className="text-sm text-muted-foreground">Handle thousands of documents simultaneously</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Intelligent</h4>
              <p className="text-sm text-muted-foreground">Learn from user patterns and preferences</p>
            </div>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default FeaturesSlide;