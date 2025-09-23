import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Star, Clock, Settings, BarChart3, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Search', href: '/dashboard', icon: Search },
  { name: 'My Papers', href: '/papers', icon: BookOpen },
  { name: 'Bookmarks', href: '/bookmarks', icon: Star },
  { name: 'History', href: '/history', icon: Clock },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Authors', href: '/authors', icon: Users },
  { name: 'Clusters', href: '/clusters', icon: FileText },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const currentPath = window.location.pathname;

  return (
    <aside className="w-64 border-r bg-card/30 h-[calc(100vh-73px)] flex flex-col">
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || (item.href === '/dashboard' && currentPath === '/');
            
            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-gradient-primary text-white'
                )}
                asChild
              >
                <a href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </a>
              </Button>
            );
          })}
        </div>
      </nav>

      <nav className="px-4 py-4 border-t">
        <div className="space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start gap-3"
                asChild
              >
                <a href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </a>
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};