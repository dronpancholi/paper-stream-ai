import React from 'react';
import { Button } from '@/components/ui/button';
import Presentation from '../components/Presentation';
import { ArrowRight, Search } from 'lucide-react';

const Index = () => {
  return (
    <div className="relative">
      <Presentation />
      
      {/* Call-to-Action Overlay */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-primary text-white px-6 py-3 rounded-full shadow-glow flex items-center gap-3">
          <Search className="w-5 h-5" />
          <span className="font-medium">Ready to start researching?</span>
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <a href="/search">
              Try Platform
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
