import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/pages/EmptyStates';
import { 
  Layers, 
  Search, 
  Filter, 
  Eye, 
  Share2, 
  Download,
  Network,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Cluster {
  id: string;
  cluster_name: string;
  description: string;
  keywords: string[];
  paper_ids: string[];
  created_at: string;
}

export default function ClustersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('paper_clusters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClusters(data || []);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClusters = clusters.filter(cluster =>
    cluster.cluster_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewCluster = (clusterName: string) => {
    navigate(`/search?q=${encodeURIComponent(clusterName)}`);
  };

  const handleShareCluster = async (cluster: Cluster) => {
    const shareData = {
      title: `Research Cluster: ${cluster.cluster_name}`,
      text: cluster.description || `Cluster with ${cluster.paper_ids.length} papers`,
      url: window.location.href + `?cluster=${cluster.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      console.log('Link copied to clipboard');
    }
  };

  const handleDownloadCluster = (cluster: Cluster) => {
    const csvContent = cluster.paper_ids.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cluster.cluster_name.replace(/\s+/g, '_')}_papers.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading clusters...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (clusters.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                Research Clusters
              </h1>
              <p className="text-muted-foreground">
                Discover research patterns and thematic groups powered by AI clustering
              </p>
            </div>
          </div>
          <EmptyState 
            type="clusters" 
            onAction={handleSearch}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="w-8 h-8 text-primary" />
              Research Clusters
            </h1>
            <p className="text-muted-foreground">
              Discover research patterns and thematic groups powered by AI clustering
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => navigate('/search')}>
              <Search className="w-4 h-4" />
              Find Papers
            </Button>
          </div>
        </div>

        <Tabs defaultValue="clusters" className="space-y-6">
          <TabsList>
            <TabsTrigger value="clusters">Research Clusters</TabsTrigger>
          </TabsList>

          <TabsContent value="clusters" className="space-y-6">
            {/* Search */}
            <Card className="liquid-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search clusters, keywords, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Advanced Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clusters */}
            {filteredClusters.length === 0 && searchQuery ? (
              <EmptyState 
                type="clusters" 
                title="No clusters found"
                description="Try adjusting your search terms to find relevant clusters."
                actionLabel="Clear Search"
                onAction={() => setSearchQuery('')}
              />
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredClusters.map((cluster) => (
                  <Card key={cluster.id} className="card-3d hover:shadow-glow transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{cluster.cluster_name}</CardTitle>
                          <Badge variant="secondary">
                            {cluster.paper_ids.length} papers
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cluster.description && (
                        <p className="text-sm text-muted-foreground">
                          {cluster.description}
                        </p>
                      )}

                      {cluster.keywords.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {cluster.keywords.slice(0, 8).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                            {cluster.keywords.length > 8 && (
                              <Badge variant="outline" className="text-xs">
                                +{cluster.keywords.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(cluster.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewCluster(cluster.cluster_name)}
                            title="Search papers in this cluster"
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShareCluster(cluster)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadCluster(cluster)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}