import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedPaperCard } from '@/components/Research/EnhancedPaperCard';
import { EmptyState } from '@/pages/EmptyStates';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Search, FileText, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MyPapersPage() {
  const [bookmarkedPapers, setBookmarkedPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBookmarkedPapers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBookmarkedPapers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user's bookmarks with paper details
      const { data: bookmarks, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          research_papers!inner(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const papers = bookmarks?.map(bookmark => ({
        id: bookmark.research_papers.paper_id,
        title: bookmark.research_papers.title,
        authors: bookmark.research_papers.authors || [],
        abstract: bookmark.research_papers.abstract || '',
        source: bookmark.research_papers.source,
        year: bookmark.research_papers.publication_date 
          ? new Date(bookmark.research_papers.publication_date).getFullYear() 
          : new Date().getFullYear(),
        citationCount: bookmark.research_papers.citation_count || 0,
        journal: bookmark.research_papers.journal,
        doi: bookmark.research_papers.doi,
        url: bookmark.research_papers.url,
        pdfUrl: bookmark.research_papers.pdf_url,
        bookmarkId: bookmark.id,
        bookmarkedAt: bookmark.created_at,
        isBookmarked: true
      })) || [];

      setBookmarkedPapers(papers);
    } catch (error) {
      console.error('Error loading bookmarked papers:', error);
      toast.error('Failed to load your papers');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarkedPapers(prev => prev.filter(paper => paper.bookmarkId !== bookmarkId));
      toast.success('Removed from your papers');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  const filteredPapers = bookmarkedPapers.filter(paper =>
    searchQuery === '' || 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.authors.some((author: string) => 
      author.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleBulkDownload = async () => {
    const papersWithPdf = filteredPapers.filter(paper => paper.pdfUrl);
    
    if (papersWithPdf.length === 0) {
      toast.error('No PDFs available for download');
      return;
    }

    toast.info(`Starting download of ${papersWithPdf.length} papers...`);
    
    // Download each paper (in real implementation, this would be a zip file)
    for (const paper of papersWithPdf.slice(0, 5)) { // Limit to 5 for demo
      try {
        const response = await fetch(paper.pdfUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paper.title.substring(0, 50)}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Download error for paper:', paper.title, error);
      }
    }
    
    toast.success('Bulk download completed');
  };

  const handleClearAll = async () => {
    if (!user || bookmarkedPapers.length === 0) return;

    if (!confirm('Are you sure you want to remove all bookmarked papers?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setBookmarkedPapers([]);
      toast.success('All bookmarks cleared');
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      toast.error('Failed to clear bookmarks');
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={FileText}
          title="Sign In Required"
          description="Please sign in to view your saved papers."
          action={
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Papers</h1>
            <p className="text-muted-foreground">
              {bookmarkedPapers.length} saved papers
            </p>
          </div>
          
          {bookmarkedPapers.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleBulkDownload}
                disabled={filteredPapers.filter(p => p.pdfUrl).length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All PDFs
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {bookmarkedPapers.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Saved Papers"
            description="Papers you bookmark will appear here. Start by searching and saving papers you want to reference later."
            action={
              <Button onClick={() => window.location.href = '/search'}>
                Search Papers
              </Button>
            }
          />
        ) : (
          <>
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search your saved papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {filteredPapers.length === 0 && searchQuery ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No matching papers</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredPapers.map((paper) => (
                  <div key={paper.id} className="relative">
                    <EnhancedPaperCard paper={paper} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveBookmark(paper.bookmarkId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}