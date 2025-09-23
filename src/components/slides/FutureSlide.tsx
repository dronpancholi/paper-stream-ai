import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Mic, Shield, Users, Brain } from 'lucide-react';

const FutureSlide = () => {
  const futureFeatures = [
    {
      icon: Mic,
      title: "Voice-Based Queries",
      description: "Multilingual voice commands for hands-free research",
      timeline: "Q2 2025",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Private Database Integration",
      description: "Secure connection to proprietary research repositories",
      timeline: "Q3 2025",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Real-Time Collaboration",
      description: "Shared workspaces for distributed research teams",
      timeline: "Q4 2025",
      color: "text-primary"
    },
    {
      icon: Brain,
      title: "Predictive Research Insights",
      description: "AI-driven predictions for emerging research topics",
      timeline: "Q1 2026",
      color: "text-accent"
    }
  ];

  return (
    <PresentationSlide id="future-slide" background="gradient">
      <div className="text-white space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold">
            Future Roadmap
          </h2>
          <div className="w-24 h-1 bg-white/30 rounded-full mx-auto"></div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Continuous innovation to keep research at the cutting edge of technology
          </p>
        </div>
        
        {/* Future Features */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {futureFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/15 transition-smooth"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 bg-white/10 rounded-lg ${feature.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded">
                        {feature.timeline}
                      </span>
                    </div>
                    <p className="text-white/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Vision Statement */}
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
          <p className="text-lg text-white/90 leading-relaxed max-w-4xl mx-auto">
            "To create an AI ecosystem where every researcher, regardless of their institution or resources, 
            has access to the world's knowledge and the tools to advance human understanding."
          </p>
        </div>
        
        {/* Next Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <h4 className="font-semibold mb-2">Phase 1</h4>
            <p className="text-sm text-white/80">MVP Development</p>
          </div>
          <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <h4 className="font-semibold mb-2">Phase 2</h4>
            <p className="text-sm text-white/80">Beta Testing</p>
          </div>
          <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <h4 className="font-semibold mb-2">Phase 3</h4>
            <p className="text-sm text-white/80">Market Launch</p>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default FutureSlide;