import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  History as HistoryIcon, 
  BarChart3,
  Users,
  Layers,
  FileText,
  TrendingUp,
  Globe
} from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'papers' | 'bookmarks' | 'history' | 'analysis' | 'authors' | 'clusters';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionLabel,
  onAction
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: Search,
          title: title || 'No search results found',
          description: description || 'Try adjusting your search terms or filters to find relevant papers.',
          actionLabel: actionLabel || 'Clear Filters',
          actionIcon: Search
        };
      
      case 'papers':
        return {
          icon: FileText,
          title: title || 'No papers available',
          description: description || 'Start by searching for papers in your field of interest.',
          actionLabel: actionLabel || 'Search Papers',
          actionIcon: Search
        };

      case 'bookmarks':
        return {
          icon: Bookmark,
          title: title || 'No bookmarked papers',
          description: description || 'Bookmark papers during your research to save them for later reading.',
          actionLabel: actionLabel || 'Explore Papers',
          actionIcon: Globe
        };

      case 'history':
        return {
          icon: HistoryIcon,
          title: title || 'No search history',
          description: description || 'Your search history will appear here as you explore research papers.',
          actionLabel: actionLabel || 'Start Searching',
          actionIcon: Search
        };

      case 'analysis':
        return {
          icon: BarChart3,
          title: title || 'No analysis data',
          description: description || 'Analysis will be generated based on your research activity and saved papers.',
          actionLabel: actionLabel || 'Build Your Library',
          actionIcon: TrendingUp
        };

      case 'authors':
        return {
          icon: Users,
          title: title || 'No author profiles found',
          description: description || 'Author profiles will be discovered as you explore research papers.',
          actionLabel: actionLabel || 'Find Authors',
          actionIcon: Search
        };

      case 'clusters':
        return {
          icon: Layers,
          title: title || 'No research clusters',
          description: description || 'Research clusters are automatically generated from your paper collection.',
          actionLabel: actionLabel || 'Add Papers',
          actionIcon: BookOpen
        };

      default:
        return {
          icon: FileText,
          title: title || 'No data available',
          description: description || 'Get started by exploring the platform features.',
          actionLabel: actionLabel || 'Get Started',
          actionIcon: Search
        };
    }
  };

  const content = getEmptyStateContent();
  const IconComponent = content.icon;
  const ActionIconComponent = content.actionIcon;

  return (
    <Card className="liquid-card">
      <CardContent className="p-12 text-center">
        <div className="floating">
          <IconComponent className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-60" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">
          {content.title}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          {content.description}
        </p>
        {onAction && (
          <Button 
            onClick={onAction}
            className="glass-button gap-2"
            size="lg"
          >
            <ActionIconComponent className="w-5 h-5" />
            {content.actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};