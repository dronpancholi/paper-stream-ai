import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyStates';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Network, 
  TrendingUp, 
  Users, 
  Eye,
  Download,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface CollaborationNode {
  id: string;
  name: string;
  papers: number;
  connections: string[];
}

interface TrendingTopic {
  keyword: string;
  count: number;
  trend: number;
  papers: string[];
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [collaborationData, setCollaborationData] = useState<CollaborationNode[]>([]);
  const [emergingAreas, setEmergingAreas] = useState<TrendingTopic[]>([]);
  const [userStats, setUserStats] = useState({
    totalBookmarks: 0,
    totalLikes: 0,
    totalRatings: 0,
    favoriteTopics: [] as string[]
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAnalytics();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Load user statistics
      const [bookmarksRes, likesRes, ratingsRes] = await Promise.all([
        supabase.from('bookmarks').select('*').eq('user_id', user!.id),
        supabase.from('likes').select('*').eq('user_id', user!.id),
        supabase.from('ratings').select('*').eq('user_id', user!.id)
      ]);

      setUserStats({
        totalBookmarks: bookmarksRes.data?.length || 0,
        totalLikes: likesRes.data?.length || 0,
        totalRatings: ratingsRes.data?.length || 0,
        favoriteTopics: []
      });

      // Simulate collaboration network (in real app, this would analyze paper co-authors)
      const mockCollaboration: CollaborationNode[] = [
        { id: '1', name: 'Dr. Sarah Chen', papers: 12, connections: ['2', '3'] },
        { id: '2', name: 'Prof. Michael Rodriguez', papers: 8, connections: ['1', '4'] },
        { id: '3', name: 'Dr. Amin Patel', papers: 15, connections: ['1', '5'] },
        { id: '4', name: 'Dr. Lisa Wang', papers: 6, connections: ['2'] },
        { id: '5', name: 'Prof. David Johnson', papers: 20, connections: ['3'] }
      ];

      // Simulate emerging areas (in real app, this would analyze trending keywords)
      const mockTrends: TrendingTopic[] = [
        { keyword: 'Large Language Models', count: 245, trend: 35, papers: [] },
        { keyword: 'Quantum Computing', count: 128, trend: 22, papers: [] },
        { keyword: 'Computer Vision', count: 167, trend: 18, papers: [] },
        { keyword: 'Reinforcement Learning', count: 94, trend: 45, papers: [] },
        { keyword: 'Federated Learning', count: 73, trend: 67, papers: [] }
      ];

      setCollaborationData(mockCollaboration);
      setEmergingAreas(mockTrends);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const downloadNetworkData = () => {
    const csvContent = collaborationData.map(node => 
      `${node.name},${node.papers},${node.connections.length}`
    ).join('\n');
    
    const blob = new Blob([`Name,Papers,Connections\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collaboration-network.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Network data downloaded');
  };

  const shareAnalytics = async () => {
    const shareText = `My Research Analytics:\n• ${userStats.totalBookmarks} bookmarked papers\n• ${userStats.totalLikes} papers liked\n• ${userStats.totalRatings} papers rated`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Research Analytics',
          text: shareText
        });
      } catch (error) {
        navigator.clipboard.writeText(shareText);
        toast.success('Analytics copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Analytics copied to clipboard');
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
          <EmptyState
            type="analytics"
            title="Sign In Required"
            description="Please sign in to view your research analytics and insights."
            actionLabel="Sign In"
            onAction={() => navigate('/auth')}
          />
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const hasData = userStats.totalBookmarks > 0 || userStats.totalLikes > 0 || userStats.totalRatings > 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Research Analytics</h1>
            <p className="text-muted-foreground">
              Insights and trends from your research activity
            </p>
          </div>
          
          {hasData && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadNetworkData}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" onClick={shareAnalytics}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          )}
        </div>

        {!hasData ? (
            <EmptyState
              type="analytics"
              title="No Analytics Data Yet"
              description="Start interacting with research papers to see analytics and insights. Bookmark, like, and rate papers to build your research profile."
              actionLabel="Start Exploring"
              onAction={() => navigate('/search')}
            />
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-button">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Bookmarked Papers</p>
                      <p className="text-2xl font-bold">{userStats.totalBookmarks}</p>
                    </div>
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-button">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Papers Liked</p>
                      <p className="text-2xl font-bold">{userStats.totalLikes}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-button">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Papers Rated</p>
                      <p className="text-2xl font-bold">{userStats.totalRatings}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-button">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Research Score</p>
                      <p className="text-2xl font-bold">
                        {Math.round((userStats.totalBookmarks + userStats.totalLikes + userStats.totalRatings) * 1.2)}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="collaboration" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="collaboration" className="flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Collaboration Network
                </TabsTrigger>
                <TabsTrigger value="emerging" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Emerging Areas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="collaboration" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="w-5 h-5" />
                      Author Collaboration Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {collaborationData.map((author) => (
                        <Card key={author.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{author.name}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p>{author.papers} papers</p>
                              <p>{author.connections.length} collaborations</p>
                            </div>
                            <Button variant="outline" size="sm" className="mt-3 w-full">
                              View Profile
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emerging" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Emerging Research Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emergingAreas.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{topic.keyword}</h3>
                            <p className="text-sm text-muted-foreground">
                              {topic.count} papers • {topic.trend}% growth
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={topic.trend > 30 ? 'default' : 'secondary'}>
                              {topic.trend > 30 ? 'Hot' : 'Trending'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Explore
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}