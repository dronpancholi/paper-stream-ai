import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';

const NavigationWrapper: React.FC = () => {
  const location = useLocation();
  
  // Hide navigation on certain pages
  const hideNavigationRoutes = ['/auth', '/', '/terms', '/privacy'];
  const shouldHideNavigation = hideNavigationRoutes.includes(location.pathname);

  if (shouldHideNavigation) {
    return null;
  }

  return <Navigation />;
};

export { NavigationWrapper };