import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Rocket, Zap, Award } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

const ConclusionSlide = () => {
  return (
    <PresentationSlide 
      id="conclusion-slide"
      className="relative text-white"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero/90" />
      
      {/* Content */}
      <div className="text-center space-y-12 relative z-10">
        <div className="space-y-6">
          <h2 className="text-6xl md:text-7xl font-bold tracking-tight">
            Redefining Research
          </h2>
          <div className="text-3xl md:text-4xl font-light text-primary-glow">
            with AI
          </div>
        </div>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          <p className="text-2xl md:text-3xl font-medium leading-relaxed">
            "i-SMART Research Scholar is not just a tool, 
            <br />
            <span className="text-accent-glow">it's a research accelerator."</span>
          </p>
          
          {/* Key Value Props */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Zap className="h-8 w-8 text-accent-glow" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-white/80">10x faster research discovery</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Award className="h-8 w-8 text-primary-glow" />
              </div>
              <h3 className="text-xl font-semibold">AI-Powered</h3>
              <p className="text-white/80">Advanced intelligence at work</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                <Rocket className="h-8 w-8 text-accent-glow" />
              </div>
              <h3 className="text-xl font-semibold">Future Ready</h3>
              <p className="text-white/80">Scalable innovation platform</p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Ready to Transform Research?</h3>
            <p className="text-white/90 leading-relaxed mb-6">
              Join us in revolutionizing how scientists discover, analyze, and advance human knowledge. 
              The future of research is here, and it's powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">
                Start Your Research Journey
              </div>
              <div className="px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-smooth">
                Schedule a Demo
              </div>
            </div>
          </div>
          
          <div className="text-white/60">
            <p>Empowering scientists worldwide • Building the future of research</p>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </PresentationSlide>
  );
};

export default ConclusionSlide;