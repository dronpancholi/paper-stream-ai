import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Clock, DollarSign, TrendingUp, Zap } from 'lucide-react';

const ImpactSlide = () => {
  return (
    <PresentationSlide id="impact-slide" background="subtle">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-foreground">
            Potential Impact
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming research productivity across the scientific community
          </p>
        </div>
        
        {/* Impact Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-card rounded-xl border shadow-card">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">90%</div>
              <p className="text-sm text-muted-foreground">Time Saved</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-card rounded-xl border shadow-card">
            <DollarSign className="h-12 w-12 text-accent mx-auto mb-4" />
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">$50K+</div>
              <p className="text-sm text-muted-foreground">Cost Reduction</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-card rounded-xl border shadow-card">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10x</div>
              <p className="text-sm text-muted-foreground">Faster Discovery</p>
            </div>
          </div>
          
          <div className="text-center p-6 bg-card rounded-xl border shadow-card">
            <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">1000+</div>
              <p className="text-sm text-muted-foreground">Papers/Day</p>
            </div>
          </div>
        </div>
        
        {/* Comparison Chart */}
        <div className="bg-gradient-subtle rounded-2xl p-8 border">
          <h3 className="text-2xl font-semibold text-center mb-8">Manual vs i-SMART Research</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Manual Process */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-destructive mb-4">Traditional Manual Process</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border-destructive/20 border">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">3-6 months per research cycle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border-destructive/20 border">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">100-200 papers maximum</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border-destructive/20 border">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">High human error rate</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg border-destructive/20 border">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span className="text-sm">Expensive human resources</span>
                </div>
              </div>
            </div>
            
            {/* i-SMART Process */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-accent mb-4">i-SMART Powered Process</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border-accent/20 border">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">2-3 days per research cycle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border-accent/20 border">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">1000+ papers processed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border-accent/20 border">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">AI-powered accuracy</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border-accent/20 border">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm">Minimal operational cost</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Benefits */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-6">Transformative Benefits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-card rounded-xl border">
              <h4 className="font-semibold text-lg mb-2 text-primary">Faster Discovery</h4>
              <p className="text-muted-foreground">Accelerate breakthrough research by identifying key insights instantly</p>
            </div>
            <div className="p-6 bg-card rounded-xl border">
              <h4 className="font-semibold text-lg mb-2 text-accent">Better Decisions</h4>
              <p className="text-muted-foreground">Data-driven research direction with comprehensive analysis</p>
            </div>
            <div className="p-6 bg-card rounded-xl border">
              <h4 className="font-semibold text-lg mb-2 text-primary">Cost Effective</h4>
              <p className="text-muted-foreground">Maximize R&D budget efficiency with automated processes</p>
            </div>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default ImpactSlide;