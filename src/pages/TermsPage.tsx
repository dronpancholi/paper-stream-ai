import React from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
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
          <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">
            i-SMART Research Scholar - Student Academic Platform
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: January 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Academic Use Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">1. Platform Purpose</h3>
              <p className="text-muted-foreground leading-relaxed">
                i-SMART Research Scholar is an educational platform developed by students of Government Polytechnic Ahmedabad 
                to assist academic research and learning. This platform is designed for educational purposes and to support 
                student research activities.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2. Academic Use</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• This platform is intended for educational and research purposes only</li>
                <li>• Users should properly cite and reference all research papers accessed through the platform</li>
                <li>• Commercial use of the platform or its content is not permitted</li>
                <li>• All research must comply with academic integrity standards</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">3. User Responsibilities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Respect intellectual property rights of research papers and authors</li>
                <li>• Use the platform in compliance with your institution's policies</li>
                <li>• Report any technical issues or inappropriate content</li>
                <li>• Maintain the confidentiality of your account credentials</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">4. Content and Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                The platform aggregates publicly available research papers from various academic databases. 
                We do not claim ownership of the research content. All papers remain the property of their 
                respective authors and publishers. Users are responsible for respecting copyright and licensing terms.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">5. AI-Powered Features</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI summarization and analysis features are provided as educational tools to assist research. 
                These AI-generated insights should be verified and should not replace critical analysis by users. 
                AI outputs may contain errors and should be used as supplementary information only.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">6. Student Project Disclaimer</h3>
              <p className="text-muted-foreground leading-relaxed">
                This platform is a student project created for educational purposes. While we strive for accuracy 
                and reliability, the platform is provided "as is" without warranties. Users should validate all 
                information and use their academic judgment when conducting research.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">7. Privacy and Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                We collect minimal user data necessary for platform functionality. User search history and bookmarks 
                are stored to improve user experience. We do not sell user data to third parties. See our Privacy 
                Policy for detailed information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">8. Modifications and Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                As a student project, the platform may undergo frequent updates and improvements. We reserve the 
                right to modify these terms and the platform functionality. Users will be notified of significant 
                changes through the platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">9. Contact Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these terms or the platform, please contact the development team through 
                Government Polytechnic Ahmedabad. This project is supervised by faculty and follows institutional 
                guidelines for student projects.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-subtle border-0">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Built by Students, for Students</h3>
            <p className="text-muted-foreground mb-6">
              This platform represents the collaborative effort of students at Government Polytechnic Ahmedabad 
              to contribute to the academic research community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/search">
                  Start Researching
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}