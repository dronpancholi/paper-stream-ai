import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Search, FileText, BarChart, Users, ArrowRight } from 'lucide-react';

const DemoSlide = () => {
  return (
    <PresentationSlide id="demo-slide">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-foreground">
            Demo Flow
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how i-SMART transforms research discovery in real-time
          </p>
        </div>
        
        {/* Demo Steps */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Input */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-subtle rounded-2xl border">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <Search className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">Step 1: Input Keywords</h3>
              <p className="text-muted-foreground">Scientists enter research focus</p>
              <div className="bg-card p-3 rounded-lg font-mono text-sm border">
                Input: "Nutrition + Diabetes"
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
          
          {/* Processing */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-subtle rounded-2xl border">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20">
                <FileText className="h-8 w-8 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">Step 2: AI Processing</h3>
              <p className="text-muted-foreground">Automated scraping and analysis</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-card p-3 rounded-lg border">📄 1,000 papers found</div>
                <div className="bg-card p-3 rounded-lg border">🔄 Processing...</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
          
          {/* Results */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-subtle rounded-2xl border">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">Step 3: Smart Clustering</h3>
              <p className="text-muted-foreground">Organized insights and summaries</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-card p-3 rounded-lg border text-center">
                  <div className="font-semibold text-primary">10</div>
                  <div className="text-muted-foreground">Clusters</div>
                </div>
                <div className="bg-card p-3 rounded-lg border text-center">
                  <div className="font-semibold text-accent">95%</div>
                  <div className="text-muted-foreground">Relevance</div>
                </div>
                <div className="bg-card p-3 rounded-lg border text-center">
                  <div className="font-semibold text-primary">2 min</div>
                  <div className="text-muted-foreground">Processing</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
          
          {/* Output */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gradient-subtle rounded-2xl border">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20">
                <Users className="h-8 w-8 text-accent" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">Step 4: Expert Insights</h3>
              <p className="text-muted-foreground">Author profiles and critique generated</p>
              <div className="bg-card p-4 rounded-lg border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Top Authors Identified</span>
                  <span className="text-accent font-semibold">✓ Complete</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Critique scores, impact analysis, and recommendations ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default DemoSlide;