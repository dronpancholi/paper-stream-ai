import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Brain,
  AlertTriangle
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl text-center liquid-card">
        <CardContent className="p-12">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Brain className="w-10 h-10 text-primary" />
              <span className="text-2xl font-bold">i-SMART Research Scholar</span>
            </div>

            {/* 404 Error */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-6">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back to exploring research papers.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button asChild size="lg" className="gap-2 min-w-[200px]">
                <Link to="/search">
                  <Search className="w-5 h-5" />
                  Start Searching
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="gap-2 min-w-[200px]">
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">Or try these popular sections:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/papers">My Papers</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/bookmarks">Bookmarks</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/authors">Authors</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/clusters">Clusters</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/analysis">Analytics</Link>
                </Button>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}