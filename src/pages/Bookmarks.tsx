import React, { useState } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bookmark, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Download, 
  ExternalLink,
  Trash2,
  Tag
} from 'lucide-react';
import { PaperCard } from '@/components/Research/PaperCard';

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const bookmarkedPapers = [
    {
      id: '1',
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
      abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
      source: 'arXiv',
      year: 2017,
      citationCount: 89543,
      journal: 'Neural Information Processing Systems',
      doi: '10.5555/3295222.3295349',
      url: 'https://arxiv.org/abs/1706.03762',
      pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf',
      impactFactor: 8.3,
      isBookmarked: true,
      bookmarkedAt: '2024-01-15',
      notes: 'Foundational paper for transformer architecture. Important for understanding modern NLP.',
      tags: ['transformers', 'attention', 'nlp', 'deep-learning']
    },
    {
      id: '2',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
      authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
      abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...',
      source: 'arXiv',
      year: 2018,
      citationCount: 67432,
      journal: 'NAACL-HLT',
      doi: '10.18653/v1/N19-1423',
      url: 'https://arxiv.org/abs/1810.04805',
      pdfUrl: 'https://arxiv.org/pdf/1810.04805.pdf',
      impactFactor: 7.2,
      isBookmarked: true,
      bookmarkedAt: '2024-01-12',
      notes: 'Breakthrough in bidirectional language modeling. Key for my research project.',
      tags: ['bert', 'transformers', 'nlp', 'pretraining']
    },
    {
      id: '3',
      title: 'Deep Residual Learning for Image Recognition',
      authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren'],
      abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework...',
      source: 'arXiv',
      year: 2015,
      citationCount: 156782,
      journal: 'CVPR',
      doi: '10.1109/CVPR.2016.90',
      url: 'https://arxiv.org/abs/1512.03385',
      pdfUrl: 'https://arxiv.org/pdf/1512.03385.pdf',
      impactFactor: 9.1,
      isBookmarked: true,
      bookmarkedAt: '2024-01-10',
      notes: 'ResNet architecture - revolutionary for computer vision.',
      tags: ['resnet', 'computer-vision', 'deep-learning', 'cnn']
    }
  ];

  const allTags = [...new Set(bookmarkedPapers.flatMap(paper => paper.tags))];

  const filteredPapers = bookmarkedPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => paper.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-yellow-500" />
              Bookmarked Papers
            </h1>
            <p className="text-muted-foreground">
              {bookmarkedPapers.length} papers saved for later reading
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Bulk Actions
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search bookmarked papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Sort by Date
              </Button>
            </div>

            {/* Tag Filters */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Filter by tags:</div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-muted-foreground"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bookmarked Papers */}
        <div className="space-y-6">
          {filteredPapers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookmarks found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedTags.length > 0 
                    ? "Try adjusting your search or filters"
                    : "Start bookmarking papers to see them here"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold hover:text-primary cursor-pointer">
                          {paper.title}
                        </h3>
                        <div className="text-muted-foreground">
                          {paper.authors.join(', ')} • {paper.journal} • {paper.year}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {paper.abstract}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <Badge variant="secondary">{paper.citationCount.toLocaleString()} citations</Badge>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {paper.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Notes */}
                    {paper.notes && (
                      <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                        <div className="text-sm font-medium mb-1">Your Notes:</div>
                        <div className="text-sm text-muted-foreground">{paper.notes}</div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Bookmarked {paper.bookmarkedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          PDF
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}