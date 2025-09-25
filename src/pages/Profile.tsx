import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useFeedback } from '@/hooks/useFeedback';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Heart,
  MessageSquare,
  TrendingUp,
  Users,
  FileText,
  Star,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  Save,
  Camera,
  Settings,
  BarChart3,
  Activity,
  Eye,
  Download,
  Brain
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { feedback, loading: feedbackLoading } = useFeedback();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.user_metadata?.name || '',
    bio: '',
    institution: '',
    researchInterests: '',
  });

  // Mock data for analytics - in production, fetch from API
  const analytics = {
    totalSearches: 324,
    savedPapers: 89,
    readingTime: '47h 23m',
    topTopics: [
      { topic: 'Machine Learning', count: 45, trend: '+12%' },
      { topic: 'Neural Networks', count: 38, trend: '+8%' },
      { topic: 'Computer Vision', count: 29, trend: '+15%' },
      { topic: 'Natural Language Processing', count: 24, trend: '+5%' },
    ],
    recentActivity: [
      { action: 'Liked paper', title: 'Attention Is All You Need', date: '2 hours ago' },
      { action: 'Bookmarked', title: 'Deep Residual Learning', date: '1 day ago' },
      { action: 'Searched', title: 'quantum computing applications', date: '2 days ago' },
      { action: 'Downloaded', title: 'Transformer Networks Survey', date: '3 days ago' },
    ]
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update API call
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const likedPapers = feedback?.filter(f => f.is_liked) || [];
  const dislikedPapers = feedback?.filter(f => !f.is_liked) || [];
  const papersWithComments = feedback?.filter(f => f.comment) || [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="shadow-card border-0 bg-gradient-subtle">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-white shadow-md hover:shadow-lg"
                    variant="outline"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={profileData.displayName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about your research interests..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="gap-2">
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">
                          {profileData.displayName || user?.email?.split('@')[0]}
                        </h1>
                        <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user?.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(user?.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                      
                      {profileData.bio && (
                        <p className="text-foreground max-w-2xl">{profileData.bio}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{analytics.savedPapers} Saved Papers</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
                          <Activity className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">{analytics.readingTime} Reading Time</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium">{analytics.totalSearches} Searches</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback">My Feedback</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Research Interests */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Top Research Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics.topTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{topic.topic}</div>
                        <div className="text-sm text-muted-foreground">{topic.count} papers</div>
                      </div>
                      <Badge variant="secondary" className="text-xs text-accent">
                        {topic.trend}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-muted-foreground">: {activity.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-accent" />
                      <span className="text-sm">Liked Papers</span>
                    </div>
                    <span className="font-bold text-accent">{likedPapers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span className="text-sm">Comments Made</span>
                    </div>
                    <span className="font-bold text-primary">{papersWithComments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Papers Viewed</span>
                    </div>
                    <span className="font-bold">{analytics.totalSearches}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Liked Papers */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-accent" />
                    Liked Papers ({likedPapers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedbackLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : likedPapers.length > 0 ? (
                    <div className="space-y-3">
                      {likedPapers.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                          <div className="font-medium text-sm">Paper ID: {item.paper_id}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                          {item.comment && (
                            <div className="text-sm mt-2 p-2 bg-background rounded border">
                              "{item.comment}"
                            </div>
                          )}
                        </div>
                      ))}
                      {likedPapers.length > 5 && (
                        <Button variant="outline" size="sm" className="w-full">
                          View All ({likedPapers.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No liked papers yet</p>
                      <p className="text-sm">Start exploring research papers to build your collection!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Recent Comments ({papersWithComments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {feedbackLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : papersWithComments.length > 0 ? (
                    <div className="space-y-3">
                      {papersWithComments.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">Paper ID: {item.paper_id}</div>
                            <div className="flex items-center gap-1">
                              {item.is_liked ? (
                                <ThumbsUp className="w-3 h-3 text-accent" />
                              ) : (
                                <ThumbsDown className="w-3 h-3 text-destructive" />
                              )}
                            </div>
                          </div>
                          <div className="text-sm p-2 bg-background rounded border">
                            "{item.comment}"
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {papersWithComments.length > 5 && (
                        <Button variant="outline" size="sm" className="w-full">
                          View All Comments ({papersWithComments.length})
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No comments yet</p>
                      <p className="text-sm">Share your thoughts on research papers you read!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.totalSearches}</div>
                      <div className="text-sm text-muted-foreground">Total Searches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.savedPapers}</div>
                      <div className="text-sm text-muted-foreground">Saved Papers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{analytics.readingTime}</div>
                      <div className="text-sm text-muted-foreground">Reading Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{likedPapers.length}</div>
                      <div className="text-sm text-muted-foreground">Liked Papers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Research Topics Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Research Interest Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topTopics.map((topic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{topic.topic}</span>
                        <span className="text-muted-foreground">{topic.count} papers</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(topic.count / analytics.topTopics[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={profileData.institution}
                      onChange={(e) => setProfileData(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Your institution or organization"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="researchInterests">Research Interests</Label>
                    <Textarea
                      id="researchInterests"
                      value={profileData.researchInterests}
                      onChange={(e) => setProfileData(prev => ({ ...prev, researchInterests: e.target.value }))}
                      placeholder="Machine Learning, Computer Vision, Natural Language Processing..."
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full">Save Profile Settings</Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive updates about new papers</div>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Privacy Settings</div>
                      <div className="text-sm text-muted-foreground">Control data sharing and visibility</div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Export Data</div>
                      <div className="text-sm text-muted-foreground">Download your research data</div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
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