import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Bookmark, History, Users, Layers, AlertCircle, FileText } from 'lucide-react';

type EmptyStateType = 'search' | 'papers' | 'bookmarks' | 'history' | 'analytics' | 'authors' | 'clusters';

interface EmptyStateConfig {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  secondaryDescription?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
}

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const getEmptyStateConfig = (type: EmptyStateType, navigate: ReturnType<typeof useNavigate>): EmptyStateConfig => {
  const configs: Record<EmptyStateType, EmptyStateConfig> = {
    search: {
      icon: Search,
      title: "No results found",
      description: "Try adjusting your search terms or filters to find what you're looking for.",
      action: {
        label: "Clear Filters",
        onClick: () => window.location.reload(),
        variant: "outline"
      }
    },
    papers: {
      icon: FileText,
      title: "No papers saved yet",
      description: "Start discovering and saving research papers to build your collection.",
      action: {
        label: "Search Papers",
        onClick: () => navigate('/search')
      }
    },
    bookmarks: {
      icon: Bookmark,
      title: "No bookmarks yet",
      description: "Bookmark papers you find interesting to quickly access them later.",
      action: {
        label: "Explore Papers",
        onClick: () => navigate('/search')
      }
    },
    history: {
      icon: History,
      title: "No search history",
      description: "Your search history will appear here as you explore research papers.",
      secondaryDescription: "Start searching to build your research journey."
    },
    analytics: {
      icon: AlertCircle,
      title: "Insufficient data",
      description: "We need more data to generate meaningful analytics. Keep researching!",
      action: {
        label: "Start Researching",
        onClick: () => navigate('/search')
      }
    },
    authors: {
      icon: Users,
      title: "No authors found",
      description: "Search for papers or browse our database to discover influential researchers.",
      action: {
        label: "Discover Authors",
        onClick: () => navigate('/authors')
      }
    },
    clusters: {
      icon: Layers,
      title: "No clusters available",
      description: "Research clusters help you discover related papers and emerging topics.",
      action: {
        label: "Explore Clusters",
        onClick: () => navigate('/clusters')
      }
    }
  };
  return configs[type];
};

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  title: customTitle, 
  description: customDescription,
  actionLabel: customActionLabel,
  onAction: customAction 
}) => {
  const navigate = useNavigate();
  const config = getEmptyStateConfig(type, navigate);
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {customTitle || config.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {customDescription || config.description}
              </p>
              {config.secondaryDescription && (
                <p className="text-sm text-muted-foreground italic">
                  {config.secondaryDescription}
                </p>
              )}
            </div>
            {(customAction || config.action) && (
              <Button 
                variant={config.action?.variant || 'default'} 
                onClick={customAction || config.action?.onClick}
                className="mt-4"
              >
                {customActionLabel || config.action?.label}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
