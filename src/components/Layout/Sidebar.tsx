import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Star, Clock, Settings, BarChart3, FileText, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Search', href: '/dashboard', icon: Search },
  { name: 'My Papers', href: '/my-pages', icon: BookOpen },
  { name: 'Bookmarks', href: '/bookmarks', icon: Star },
  { name: 'History', href: '/history', icon: Clock },
  { name: 'Analytics', href: '/analysis', icon: BarChart3 },
  { name: 'Authors', href: '/authors', icon: Users },
  { name: 'Clusters', href: '/clusters', icon: FileText },
];

const bottomNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className="w-64 border-r bg-card/30 h-[calc(100vh-73px)] flex flex-col flex-shrink-0">
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href === '/dashboard' && currentPath === '/');
            
            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 text-foreground hover:text-foreground',
                  isActive && 'bg-gradient-primary text-white hover:text-white'
                )}
                asChild
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      <nav className="px-4 py-4 border-t">
        <div className="space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 text-foreground hover:text-foreground',
                  isActive && 'bg-gradient-primary text-white hover:text-white'
                )}
                asChild
              >
                <Link to={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};