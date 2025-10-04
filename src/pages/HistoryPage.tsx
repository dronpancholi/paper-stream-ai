import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/EmptyStates';
import { Search, History as HistoryIcon, Eye, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface HistoryItem {
  id: string;
  action: string;
  query?: string;
  timestamp: string;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const savedHistory = localStorage.getItem('research-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('research-history');
    setHistory([]);
    toast.success('History cleared');
  };

  if (!user) {
    return (
      <DashboardLayout>
        <EmptyState
          type="history"
          title="Sign In Required"
          description="Please sign in to view your research history."
          actionLabel="Sign In"
          onAction={() => navigate('/auth')}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Research History</h1>
            <p className="text-muted-foreground">{history.length} activities tracked</p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={clearHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <EmptyState
            type="history"
            title="No Research History"
            description="Your search and viewing history will appear here."
            actionLabel="Start Researching"
            onAction={() => navigate('/search')}
          />
        ) : (
          <Card>
            <CardContent className="p-4">
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}