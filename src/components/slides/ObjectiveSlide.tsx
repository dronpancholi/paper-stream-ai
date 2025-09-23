import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Search, FileText, BarChart3, Users, ArrowRight } from 'lucide-react';

const ObjectiveSlide = () => {
  const steps = [
    {
      icon: Search,
      title: "Keywords Input",
      description: "Scientists enter research keywords",
      color: "text-primary"
    },
    {
      icon: FileText,
      title: "Web Scraping",
      description: "Automated document collection",
      color: "text-accent"
    },
    {
      icon: BarChart3,
      title: "AI Analysis",
      description: "Summarization & classification",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Author Profiling",
      description: "Expert identification & critique",
      color: "text-accent"
    }
  ];

  return (
    <PresentationSlide id="objective-slide">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-foreground">
            Our Objective
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build an AI-powered research assistant that transforms how scientists discover and analyze knowledge
          </p>
        </div>
        
        {/* Flow Diagram */}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center space-y-4 group">
                    <div className={`w-16 h-16 rounded-full bg-gradient-subtle border-2 border-border flex items-center justify-center group-hover:scale-110 transition-smooth ${step.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground max-w-24">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        
        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 bg-gradient-subtle rounded-xl border">
            <h4 className="font-semibold text-lg mb-2">Smart Summarization</h4>
            <p className="text-muted-foreground">Extract key findings from thousands of research papers</p>
          </div>
          <div className="p-6 bg-gradient-subtle rounded-xl border">
            <h4 className="font-semibold text-lg mb-2">Intelligent Grouping</h4>
            <p className="text-muted-foreground">Automatically cluster related research work</p>
          </div>
          <div className="p-6 bg-gradient-subtle rounded-xl border">
            <h4 className="font-semibold text-lg mb-2">Expert Critique</h4>
            <p className="text-muted-foreground">Generate critical analysis and author insights</p>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default ObjectiveSlide;