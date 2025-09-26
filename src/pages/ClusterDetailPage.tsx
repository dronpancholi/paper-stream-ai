import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedPaperCard, SearchResult } from '@/components/Research/EnhancedPaperCard';
import { EmptyState } from '@/pages/EmptyStates';
import { 
  ArrowLeft,
  Layers, 
  Share2, 
  Download,
  Eye,
  BookOpen,
  TrendingUp,
  Network,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Cluster {
  id: string;
  cluster_name: string;
  description: string;
  keywords: string[];
  paper_ids: string[];
  created_at: string;
}

export default function ClusterDetailPage() {
  const { clusterId } = useParams<{ clusterId: string }>();
  const navigate = useNavigate();
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [papers, setPapers] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [papersLoading, setPapersLoading] = useState(false);

  useEffect(() => {
    if (clusterId) {
      fetchCluster();
      fetchClusterPapers();
    }
  }, [clusterId]);

  const fetchCluster = async () => {
    if (!clusterId) return;

    try {
      const { data, error } = await supabase
        .from('paper_clusters')
        .select('*')
        .eq('id', clusterId)
        .single();

      if (error) throw error;
      setCluster(data);
    } catch (error) {
      console.error('Error fetching cluster:', error);
      toast.error('Cluster not found');
      navigate('/clusters');
    } finally {
      setLoading(false);
    }
  };

  const fetchClusterPapers = async () => {
    if (!clusterId) return;

    try {
      setPapersLoading(true);
      const { data: clusterData, error: clusterError } = await supabase
        .from('paper_clusters')
        .select('paper_ids')
        .eq('id', clusterId)
        .single();

      if (clusterError) throw clusterError;

      if (clusterData?.paper_ids && clusterData.paper_ids.length > 0) {
        const { data, error } = await supabase
          .from('research_papers')
          .select('*')
          .in('id', clusterData.paper_ids)
          .order('publication_date', { ascending: false });

        if (error) throw error;

        const formattedPapers: SearchResult[] = (data || []).map(paper => ({
          id: paper.id,
          title: paper.title,
          authors: paper.authors || [],
          abstract: paper.abstract || '',
          source: paper.source,
          year: paper.publication_date ? new Date(paper.publication_date).getFullYear() : new Date().getFullYear(),
          citationCount: paper.citation_count || 0,
          journal: paper.journal || '',
          doi: paper.doi || '',
          url: paper.url || '',
          pdfUrl: paper.pdf_url || '',
          summary: paper.summary || '',
          critique: paper.critique || '',
          impactFactor: paper.impact_factor || undefined,
          isBookmarked: false
        }));

        setPapers(formattedPapers);
      }
    } catch (error) {
      console.error('Error fetching cluster papers:', error);
    } finally {
      setPapersLoading(false);
    }
  };

  const handleShareCluster = async () => {
    if (!cluster) return;

    const shareData = {
      title: `Research Cluster: ${cluster.cluster_name}`,
      text: cluster.description || `Cluster with ${cluster.paper_ids.length} papers`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleDownloadCluster = () => {
    if (!cluster) return;

    const csvContent = papers.map(paper => 
      `"${paper.title.replace(/"/g, '""')}","${paper.authors.join('; ')}","${paper.journal}","${paper.year}","${paper.doi}","${paper.url}"`
    ).join('\n');
    
    const headers = 'Title,Authors,Journal,Year,DOI,URL\n';
    const fullContent = headers + csvContent;
    
    const blob = new Blob([fullContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cluster.cluster_name.replace(/\s+/g, '_')}_papers.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Download started');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading cluster...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!cluster) {
    return (
      <DashboardLayout>
        <EmptyState 
          type="clusters" 
          title="Cluster not found"
          description="The requested research cluster could not be found."
          actionLabel="Browse Clusters"
          onAction={() => navigate('/clusters')}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/clusters')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clusters
        </Button>

        {/* Cluster Header */}
        <Card className="card-3d">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Layers className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle className="text-3xl">{cluster.cluster_name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {cluster.paper_ids.length} papers
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Created {new Date(cluster.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {cluster.description && (
                  <p className="text-muted-foreground max-w-3xl leading-relaxed">
                    {cluster.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShareCluster}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCluster}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {cluster.keywords.length > 0 && (
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold">Keywords & Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {cluster.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="hover:bg-primary/10 cursor-pointer">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="papers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Cluster Papers</h2>
              <Badge variant="secondary">{papers.length} papers</Badge>
            </div>

            {papersLoading ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading papers...</p>
              </div>
            ) : papers.length === 0 ? (
              <EmptyState 
                type="papers" 
                title="No papers in this cluster"
                description="This cluster doesn't contain any papers yet."
                actionLabel="Add Papers"
                onAction={() => navigate('/search')}
              />
            ) : (
              <div className="space-y-6">
                {papers.map((paper) => (
                  <EnhancedPaperCard key={paper.id} paper={paper} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Cluster Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Trend analysis for this cluster coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Related Clusters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Related cluster analysis coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Cluster Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Interactive cluster visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}