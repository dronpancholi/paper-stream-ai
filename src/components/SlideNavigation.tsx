import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onNavigate: (slideIndex: number) => void;
  slideNames: string[];
}

const SlideNavigation = ({ 
  currentSlide, 
  totalSlides, 
  onNavigate,
  slideNames
}: SlideNavigationProps) => {
  const goToPrevious = () => {
    if (currentSlide > 0) {
      onNavigate(currentSlide - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      onNavigate(currentSlide + 1);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md border rounded-lg p-3 shadow-elegant">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={currentSlide === 0}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }, (_, i) => (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-smooth hover:scale-125",
                currentSlide === i 
                  ? "bg-primary shadow-glow" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
              title={slideNames[i]}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={currentSlide === totalSlides - 1}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SlideNavigation;