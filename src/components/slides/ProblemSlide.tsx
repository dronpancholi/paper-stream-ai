import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import problemIllustration from '@/assets/problem-illustration.jpg';

const ProblemSlide = () => {
  return (
    <PresentationSlide id="problem-slide" background="subtle">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-foreground">
              The Challenge
            </h2>
            <div className="w-24 h-1 bg-gradient-primary rounded-full"></div>
          </div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-xl">
              Scientists are drowning in an ocean of research papers published daily across thousands of journals.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-card border">
              <TrendingUp className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-semibold">Exponential Growth</p>
                <p className="text-sm text-muted-foreground">2.5M+ papers published annually</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-card border">
              <Clock className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-semibold">Time Constraint</p>
                <p className="text-sm text-muted-foreground">Reading 100s of papers takes months</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-card border">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-semibold">Manual Analysis</p>
                <p className="text-sm text-muted-foreground">Critical insights buried in complexity</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Illustration */}
        <div className="flex justify-center">
          <div className="relative">
            <img 
              src={problemIllustration} 
              alt="Overwhelmed researcher with stacks of papers" 
              className="rounded-2xl shadow-elegant max-w-full h-auto"
            />
            <div className="absolute -top-4 -right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
              Overwhelmed
            </div>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default ProblemSlide;