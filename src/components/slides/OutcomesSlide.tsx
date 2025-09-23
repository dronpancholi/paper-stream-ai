import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Upload, FileSearch, Users, TrendingUp } from 'lucide-react';
import dashboardMockup from '@/assets/dashboard-mockup.jpg';

const OutcomesSlide = () => {
  return (
    <PresentationSlide id="outcomes-slide" background="subtle">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Dashboard Mockup */}
        <div className="space-y-6">
          <div className="relative">
            <img 
              src={dashboardMockup} 
              alt="i-SMART Research Dashboard Interface" 
              className="rounded-2xl shadow-elegant border"
            />
            <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-glow">
              Live Dashboard
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-foreground">
              Expected Outcomes
            </h2>
            <div className="w-24 h-1 bg-gradient-primary rounded-full"></div>
          </div>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            A comprehensive desktop platform that empowers scientists to process research at unprecedented scale
          </p>
          
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-card border">
              <Upload className="h-8 w-8 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Upload & Input</h4>
                <p className="text-sm text-muted-foreground">Keywords, documents, and research queries</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-card border">
              <FileSearch className="h-8 w-8 text-accent mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Smart Analysis</h4>
                <p className="text-sm text-muted-foreground">Summaries, classification, duplicate removal</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-card border">
              <Users className="h-8 w-8 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Author Profiling</h4>
                <p className="text-sm text-muted-foreground">Impact factor, citations, domain expertise</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-card border">
              <TrendingUp className="h-8 w-8 text-accent mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Scalable Impact</h4>
                <p className="text-sm text-muted-foreground">From 100s monthly → 1000s daily</p>
              </div>
            </div>
          </div>
          
          {/* Impact Stats */}
          <div className="bg-gradient-primary text-primary-foreground p-6 rounded-xl">
            <h4 className="font-semibold mb-3">Productivity Impact</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">10x</div>
                <div className="text-sm opacity-90">Faster Analysis</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm opacity-90">Papers/Day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default OutcomesSlide;