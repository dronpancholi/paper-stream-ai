import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Building,
  ExternalLink,
  Star,
  MapPin,
  ArrowLeft
} from 'lucide-react';

export default function Authors() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const authors = [
    {
      id: '1',
      name: 'Geoffrey Hinton',
      affiliation: 'University of Toronto',
      email: 'hinton@cs.toronto.edu',
      avatar: '/api/placeholder/64/64',
      hIndex: 168,
      citationCount: 542789,
      paperCount: 297,
      fields: ['Deep Learning', 'Neural Networks', 'AI'],
      recentPapers: 12,
      collaborators: 245,
      isFollowing: true
    },
    {
      id: '2',
      name: 'Yann LeCun',
      affiliation: 'New York University',
      email: 'yann@cs.nyu.edu',
      avatar: '/api/placeholder/64/64',
      hIndex: 142,
      citationCount: 398456,
      paperCount: 234,
      fields: ['Computer Vision', 'Deep Learning', 'CNN'],
      recentPapers: 8,
      collaborators: 198,
      isFollowing: false
    },
    {
      id: '3',
      name: 'Yoshua Bengio',
      affiliation: 'University of Montreal',
      email: 'bengio@iro.umontreal.ca',
      avatar: '/api/placeholder/64/64',
      hIndex: 134,
      citationCount: 345678,
      paperCount: 289,
      fields: ['Deep Learning', 'NLP', 'Representation Learning'],
      recentPapers: 15,
      collaborators: 167,
      isFollowing: true
    },
    {
      id: '4',
      name: 'Fei-Fei Li',
      affiliation: 'Stanford University',
      email: 'feifeili@cs.stanford.edu',
      avatar: '/api/placeholder/64/64',
      hIndex: 98,
      citationCount: 234567,
      paperCount: 156,
      fields: ['Computer Vision', 'AI Ethics', 'Human-AI Interaction'],
      recentPapers: 6,
      collaborators: 134,
      isFollowing: false
    },
    {
      id: '5',
      name: 'Andrew Ng',
      affiliation: 'Stanford University',
      email: 'ang@cs.stanford.edu',
      avatar: '/api/placeholder/64/64',
      hIndex: 87,
      citationCount: 198765,
      paperCount: 134,
      fields: ['Machine Learning', 'AI Education', 'Robotics'],
      recentPapers: 4,
      collaborators: 156,
      isFollowing: true
    }
  ];

  const stats = [
    { label: 'Authors Tracked', value: '2.5K', icon: Users },
    { label: 'Total Citations', value: '45M', icon: Award },
    { label: 'Institutions', value: '500+', icon: Building },
    { label: 'Collaborations', value: '12K', icon: TrendingUp }
  ];

  const topInstitutions = [
    { name: 'Stanford University', authors: 89, papers: 2456 },
    { name: 'MIT', authors: 76, papers: 2134 },
    { name: 'University of Toronto', authors: 54, papers: 1876 },
    { name: 'Google Research', authors: 67, papers: 1654 },
    { name: 'Carnegie Mellon', authors: 43, papers: 1432 }
  ];

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.affiliation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    author.fields.some(field => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleBackToHome = () => {
    navigate(-1);
  };

  const handleViewAuthor = (authorId: string) => {
    navigate(`/authors/${authorId}`);
  };

  const handleViewPapers = (authorId: string) => {
    navigate(`/search?author=${encodeURIComponent(authorId)}`);
  };

  const handleAnalytics = (authorId: string) => {
    navigate(`/analysis?author=${encodeURIComponent(authorId)}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToHome}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Author Profiles
              </h1>
              <p className="text-muted-foreground">
                Discover and follow leading researchers in your field
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filter
            </Button>
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Following
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Authors List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search authors, institutions, or fields..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {filteredAuthors.map((author) => (
                <Card key={author.id} className="hover:shadow-glow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={author.avatar} alt={author.name} />
                        <AvatarFallback className="text-lg">
                          {getInitials(author.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 
                              className="text-xl font-semibold hover:text-primary cursor-pointer"
                              onClick={() => handleViewAuthor(author.id)}
                            >
                              {author.name}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="w-4 h-4" />
                              <span>{author.affiliation}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {author.isFollowing ? (
                              <Button variant="secondary" size="sm" className="gap-2">
                                <Star className="w-4 h-4 fill-current" />
                                Following
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="gap-2">
                                <Users className="w-4 h-4" />
                                Follow
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {author.fields.map((field, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer">
                              {field}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="text-center p-3 bg-accent/5 rounded-lg">
                            <div className="font-bold text-lg">{author.hIndex}</div>
                            <div className="text-muted-foreground">H-Index</div>
                          </div>
                          <div className="text-center p-3 bg-accent/5 rounded-lg">
                            <div className="font-bold text-lg">{author.citationCount.toLocaleString()}</div>
                            <div className="text-muted-foreground">Citations</div>
                          </div>
                          <div className="text-center p-3 bg-accent/5 rounded-lg">
                            <div className="font-bold text-lg">{author.paperCount}</div>
                            <div className="text-muted-foreground">Papers</div>
                          </div>
                          <div className="text-center p-3 bg-accent/5 rounded-lg">
                            <div className="font-bold text-lg">{author.collaborators}</div>
                            <div className="text-muted-foreground">Collaborators</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{author.recentPapers} papers in the last 6 months</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleViewPapers(author.id)}
                            >
                              <BookOpen className="w-4 h-4" />
                              View Papers
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleAnalytics(author.id)}
                            >
                              <TrendingUp className="w-4 h-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Institutions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Top Institutions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topInstitutions.map((institution, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm hover:text-primary cursor-pointer">
                        {institution.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {institution.authors} authors • {institution.papers} papers
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  My Following
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Rising Stars
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Award className="w-4 h-4" />
                  Most Cited
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BookOpen className="w-4 h-4" />
                  Recent Publications
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Authors */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested for You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {authors.slice(0, 3).map((author) => (
                  <div key={author.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="text-sm">
                        {getInitials(author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {author.fields[0]}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}