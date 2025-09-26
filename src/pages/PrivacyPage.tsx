import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Eye, Database, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center py-8 bg-gradient-subtle rounded-2xl">
          <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            i-SMART Research Scholar - Protecting Student Privacy
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Our Commitment to Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              As a student-built educational platform, we understand the importance of protecting user privacy, 
              especially in an academic context. This policy outlines how we collect, use, and protect your information 
              while using i-SMART Research Scholar.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Email address (for account creation and authentication)</li>
                  <li>• Username/display name (optional)</li>
                  <li>• Profile information (optional)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Research Activity</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Search queries and search history</li>
                  <li>• Bookmarked and saved papers</li>
                  <li>• Paper ratings and feedback</li>
                  <li>• Platform usage analytics (anonymized)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Browser type and version</li>
                  <li>• Device information (for responsive design)</li>
                  <li>• IP address (for security purposes)</li>
                  <li>• Session data and cookies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Platform Functionality</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Provide personalized research recommendations</li>
                  <li>• Save your research progress and bookmarks</li>
                  <li>• Improve search results and platform performance</li>
                  <li>• Generate analytics and insights for your research</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Educational Improvement</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Analyze usage patterns to improve platform features</li>
                  <li>• Understand student research needs and preferences</li>
                  <li>• Develop better AI algorithms for academic content</li>
                  <li>• Create aggregated statistics (no personal identification)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Security Measures</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Encrypted data transmission (HTTPS)</li>
                  <li>• Secure authentication via Supabase</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited access to user data by development team</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Storage</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Data stored on secure Supabase infrastructure</li>
                  <li>• Automated backups and disaster recovery</li>
                  <li>• Data retention policies for inactive accounts</li>
                  <li>• Compliance with educational data protection standards</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Control</h4>
                <ul className="space-y-1 text-muted-foreground text-sm">
                  <li>• Access and download your research data</li>
                  <li>• Update your profile and preferences</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Opt out of certain data collection features</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Sharing</h4>
                <p className="text-muted-foreground text-sm">
                  We do not sell or share your personal data with third parties for commercial purposes. 
                  Research paper content is sourced from public academic databases and remains the property 
                  of original authors and publishers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Project Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                i-SMART Research Scholar is a student project developed at Government Polytechnic Ahmedabad. 
                While we implement industry-standard privacy practices, users should understand this is an 
                educational project supervised by faculty. We are committed to protecting student privacy and 
                following institutional guidelines for student data projects.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                If you have questions about this privacy policy or how we handle your data, please contact us 
                through Government Polytechnic Ahmedabad. Our faculty supervisors oversee all data practices 
                and ensure compliance with educational privacy standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link to="/terms">
                    Terms of Service
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/search">
                    Start Using Platform
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}