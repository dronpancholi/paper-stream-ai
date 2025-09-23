import React from 'react';
import PresentationSlide from '../PresentationSlide';
import { Database, Brain, Globe, Monitor, ArrowRight } from 'lucide-react';

const ArchitectureSlide = () => {
  const techStack = [
    { category: "Backend", tech: "Supabase (Free Tier)", desc: "Authentication & Storage" },
    { category: "Scraping", tech: "Python + BeautifulSoup", desc: "Web Data Collection" },
    { category: "AI/NLP", tech: "HuggingFace + LangChain", desc: "Open-source LLMs" },
    { category: "Embeddings", tech: "FAISS", desc: "Vector Similarity Search" },
    { category: "UI", tech: "Streamlit/Tauri", desc: "Desktop Interface" }
  ];

  return (
    <PresentationSlide id="architecture-slide" background="subtle">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-foreground">
            Architecture & Tech Stack
          </h2>
          <div className="w-24 h-1 bg-gradient-primary rounded-full mx-auto"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Free-tier feasible architecture designed for scalability and performance
          </p>
        </div>
        
        {/* Architecture Diagram */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            {/* Input */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Input Layer</p>
              <p className="text-sm text-muted-foreground">Keywords & Documents</p>
            </div>
            
            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
            
            {/* Processing */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20">
                <Brain className="h-8 w-8 text-accent" />
              </div>
              <p className="font-medium">AI Engine</p>
              <p className="text-sm text-muted-foreground">NLP & Analysis</p>
            </div>
            
            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
            
            {/* Storage */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <p className="font-medium">Database</p>
              <p className="text-sm text-muted-foreground">Supabase Storage</p>
            </div>
            
            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground" />
            
            {/* Output */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20">
                <Monitor className="h-8 w-8 text-accent" />
              </div>
              <p className="font-medium">UI Layer</p>
              <p className="text-sm text-muted-foreground">Desktop Interface</p>
            </div>
          </div>
        </div>
        
        {/* Tech Stack Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((item, index) => (
            <div key={index} className="p-6 bg-card rounded-xl border shadow-card">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-primary">{item.category}</h4>
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                </div>
                <h5 className="font-medium">{item.tech}</h5>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Free Tier Emphasis */}
        <div className="text-center bg-gradient-primary text-primary-foreground p-6 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-2">100% Free Tier Implementation</h3>
          <p className="opacity-90">Leveraging open-source technologies for maximum accessibility</p>
        </div>
      </div>
    </PresentationSlide>
  );
};

export default ArchitectureSlide;