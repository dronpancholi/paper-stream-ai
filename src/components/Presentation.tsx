import React, { useState, useEffect } from 'react';
import SlideNavigation from './SlideNavigation';
import TitleSlide from './slides/TitleSlide';
import ProblemSlide from './slides/ProblemSlide';
import ObjectiveSlide from './slides/ObjectiveSlide';
import OutcomesSlide from './slides/OutcomesSlide';
import FeaturesSlide from './slides/FeaturesSlide';
import ArchitectureSlide from './slides/ArchitectureSlide';
import DemoSlide from './slides/DemoSlide';
import ImpactSlide from './slides/ImpactSlide';
import FutureSlide from './slides/FutureSlide';
import ConclusionSlide from './slides/ConclusionSlide';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    TitleSlide,
    ProblemSlide, 
    ObjectiveSlide,
    OutcomesSlide,
    FeaturesSlide,
    ArchitectureSlide,
    DemoSlide,
    ImpactSlide,
    FutureSlide,
    ConclusionSlide
  ];

  const slideNames = [
    "Title",
    "Problem", 
    "Objective",
    "Outcomes",
    "Features",
    "Architecture",
    "Demo",
    "Impact",
    "Future",
    "Conclusion"
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && currentSlide < slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (event.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  // Smooth scroll to slide
  useEffect(() => {
    const slideElement = document.getElementById(`${slideNames[currentSlide].toLowerCase()}-slide`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSlide, slideNames]);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="relative min-h-screen">
      <CurrentSlideComponent />
      
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNavigate={setCurrentSlide}
        slideNames={slideNames}
      />
      
      {/* Keyboard Instructions */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-card/80 backdrop-blur-md border rounded-lg p-3 text-xs text-muted-foreground">
          Use ← → arrow keys to navigate
        </div>
      </div>
    </div>
  );
};

export default Presentation;