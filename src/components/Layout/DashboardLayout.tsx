import React, { memo } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { OptimizedLayout } from './OptimizedLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = memo<DashboardLayoutProps>(({ children }) => {
  return (
    <OptimizedLayout>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 pt-20 will-change-contents">
          <div className="transform-gpu">
            {children}
          </div>
        </main>
      </div>
    </OptimizedLayout>
  );
});

DashboardLayout.displayName = 'DashboardLayout';