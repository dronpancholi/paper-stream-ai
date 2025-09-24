import React, { useEffect } from 'react';

interface SwipePreventWrapperProps {
  children: React.ReactNode;
}

export const SwipePreventWrapper: React.FC<SwipePreventWrapperProps> = ({ children }) => {
  useEffect(() => {
    const preventSwipe = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (!element) return;
      
      const isScrollable = element.closest('[data-scrollable="true"]') || 
                          element.closest('.overflow-auto') ||
                          element.closest('.overflow-x-auto') ||
                          element.closest('.overflow-y-auto');
                          
      if (!isScrollable && e.cancelable) {
        e.preventDefault();
      }
    };

    const preventPullToRefresh = (e: TouchEvent) => {
      if (window.scrollY === 0 && e.touches[0].clientY > e.touches[0].clientX) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventSwipe, { passive: false });
    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventSwipe);
      document.removeEventListener('touchstart', preventPullToRefresh);
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-background overflow-hidden"
      style={{ 
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {children}
    </div>
  );
};