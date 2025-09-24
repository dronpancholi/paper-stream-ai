import React, { Suspense, ComponentType } from 'react';
import { CardSkeleton } from '@/components/LoadingStates';

export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = (props: P) => (
    <Suspense fallback={fallback || <CardSkeleton />}>
      <Component {...props} />
    </Suspense>
  );

  LazyComponent.displayName = `LazyLoaded(${Component.displayName || Component.name})`;
  return LazyComponent;
};

export const LazyPaperCard = React.lazy(() => 
  import('@/components/Research/PaperCard').then(module => ({ default: module.PaperCard }))
);

export const LazyEnhancedPDFViewer = React.lazy(() => 
  import('@/components/Research/EnhancedPDFViewer').then(module => ({ default: module.EnhancedPDFViewer }))
);

export const LazyEnhancedSummarization = React.lazy(() => 
  import('@/components/AI/EnhancedSummarization').then(module => ({ default: module.EnhancedSummarization }))
);