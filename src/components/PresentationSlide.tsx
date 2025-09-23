import React from 'react';
import { cn } from '@/lib/utils';

interface PresentationSlideProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'gradient' | 'hero' | 'subtle';
}

const PresentationSlide = ({ 
  children, 
  className, 
  id,
  background = 'default'
}: PresentationSlideProps) => {
  const backgroundClasses = {
    default: 'bg-background',
    gradient: 'bg-gradient-primary',
    hero: 'bg-gradient-hero',
    subtle: 'bg-gradient-subtle'
  };

  return (
    <section 
      id={id}
      className={cn(
        "min-h-screen flex flex-col justify-center items-center p-8 md:p-16 relative overflow-hidden transition-smooth",
        backgroundClasses[background],
        className
      )}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        {children}
      </div>
    </section>
  );
};

export default PresentationSlide;