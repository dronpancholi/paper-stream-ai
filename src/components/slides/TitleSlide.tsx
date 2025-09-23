import React from 'react';
import PresentationSlide from '../PresentationSlide';
import heroBackground from '@/assets/hero-background.jpg';

const TitleSlide = () => {
  return (
    <PresentationSlide 
      id="title-slide"
      className="relative text-white"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero/80" />
      
      {/* Content */}
      <div className="text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            i-SMART
          </h1>
          <div className="text-2xl md:text-3xl font-light text-primary-glow">
            Research Scholar
          </div>
        </div>
        
        <div className="space-y-6">
          <p className="text-xl md:text-2xl font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
            Accelerating Knowledge Discovery with AI
          </p>
          
          <div className="flex justify-center items-center gap-4 text-sm text-white/70">
            <div className="w-16 h-px bg-white/30"></div>
            <span>R&D Innovation Hackathon 2025</span>
            <div className="w-16 h-px bg-white/30"></div>
          </div>
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
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

export default TitleSlide;