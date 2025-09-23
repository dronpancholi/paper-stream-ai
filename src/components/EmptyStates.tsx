import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Search, 
  BookOpen, 
  Star, 
  Clock, 
  BarChart3, 
  Users, 
  Settings,
  Plus,
  Upload
} from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action && (
            <Button 
              variant={action.variant || 'default'} 
              onClick={action.onClick}
              className="mt-4"
            >
              {action.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const SearchEmptyState = () => (
  <EmptyState
    icon={<Search className="w-8 h-8 text-muted-foreground" />}
    title="No results found"
    description="Try adjusting your search terms or filters to find what you're looking for."
    action={{
      label: "Clear Filters",
      onClick: () => window.location.reload(),
      variant: "outline"
    }}
  />
);

export const PapersEmptyState = () => (
  <EmptyState
    icon={<FileText className="w-8 h-8 text-muted-foreground" />}
    title="No papers yet"
    description="Start building your research library by searching and saving papers that interest you."
    action={{
      label: "Search Papers",
      onClick: () => window.location.href = '/dashboard'
    }}
  />
);

export const BookmarksEmptyState = () => (
  <EmptyState
    icon={<Star className="w-8 h-8 text-muted-foreground" />}
    title="No bookmarks yet"
    description="Save interesting papers and research to access them quickly later."
    action={{
      label: "Explore Papers",
      onClick: () => window.location.href = '/dashboard'
    }}
  />
);

export const HistoryEmptyState = () => (
  <EmptyState
    icon={<Clock className="w-8 h-8 text-muted-foreground" />}
    title="No search history"
    description="Your search history will appear here as you explore research papers."
  />
);

export const AnalyticsEmptyState = () => (
  <EmptyState
    icon={<BarChart3 className="w-8 h-8 text-muted-foreground" />}
    title="No data to analyze"
    description="Analytics will be available once you have saved papers and research data."
    action={{
      label: "Start Researching",
      onClick: () => window.location.href = '/dashboard'
    }}
  />
);

export const AuthorsEmptyState = () => (
  <EmptyState
    icon={<Users className="w-8 h-8 text-muted-foreground" />}
    title="No authors tracked"
    description="Follow authors and researchers to stay updated with their latest work."
    action={{
      label: "Discover Authors",
      onClick: () => window.location.href = '/dashboard'
    }}
  />
);

export const ClustersEmptyState = () => (
  <EmptyState
    icon={<FileText className="w-8 h-8 text-muted-foreground" />}
    title="No research clusters"
    description="Research clusters will appear here as you build your paper collection."
    action={{
      label: "Add Papers",
      onClick: () => window.location.href = '/dashboard'
    }}
  />
);