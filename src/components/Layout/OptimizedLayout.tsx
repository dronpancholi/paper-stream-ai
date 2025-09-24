import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { MobileOptimizedLayout } from './MobileOptimizedLayout';

interface OptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const OptimizedLayout = memo<OptimizedLayoutProps>(({ children, className }) => {
  return (
    <MobileOptimizedLayout className={cn("antialiased selection:bg-primary/20", className)}>
      {children}
    </MobileOptimizedLayout>
  );
});

OptimizedLayout.displayName = 'OptimizedLayout';