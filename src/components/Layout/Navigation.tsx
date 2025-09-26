import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  History, 
  BarChart3, 
  Users, 
  Layers,
  Brain,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MobileNavigation } from './MobileNavigation';

const navigationItems = [
  { label: 'Search', href: '/search', icon: Search },
  { label: 'My Papers', href: '/papers', icon: BookOpen },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'History', href: '/history', icon: History },
  { label: 'Analytics', href: '/analysis', icon: BarChart3 },
  { label: 'Authors', href: '/authors', icon: Users },
  { label: 'Clusters', href: '/clusters', icon: Layers },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">i-SMART Research Scholar</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              v1.0
            </Badge>
          </Link>

          {/* Navigation Items - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "gap-2 glass-button",
                    isActive && "bg-primary text-primary-foreground shadow-glow"
                  )}
                >
                  <Link to={item.href}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation />

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};