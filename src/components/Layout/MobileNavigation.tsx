import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Menu,
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
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { label: 'Search', href: '/search', icon: Search },
  { label: 'My Papers', href: '/papers', icon: BookOpen },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'History', href: '/history', icon: History },
  { label: 'Analytics', href: '/analysis', icon: BarChart3 },
  { label: 'Authors', href: '/authors', icon: Users },
  { label: 'Clusters', href: '/clusters', icon: Layers },
];

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <Link to="/" className="flex items-center gap-2" onClick={handleNavClick}>
                <Brain className="w-6 h-6 text-primary" />
                <span className="font-bold">i-SMART</span>
                <Badge variant="secondary" className="text-xs">v1.0</Badge>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-4 py-6">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleNavClick}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-glow" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* User Section */}
            <div className="border-t p-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full justify-start gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={handleNavClick}
                  className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};