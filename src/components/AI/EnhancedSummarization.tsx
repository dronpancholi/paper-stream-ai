import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedSummarizationProps {
  paperId: string;
  title: string;
  abstract: string;
  authors: string[];
}

interface SummaryData {
  summary: string;
  critique: string;
  keyPoints: string[];
  methodology: string;
  limitations: string[];
  impact: string;
  recommendations: string[];
}

export const EnhancedSummarization: React.FC<EnhancedSummarizationProps> = ({
  paperId,
  title,
  abstract,
  authors,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const { toast } = useToast();

  const generateEnhancedSummary = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-summarize', {
        body: {
          paperId,
          text: `Title: ${title}\n\nAuthors: ${authors.join(', ')}\n\nAbstract: ${abstract}`,
          enhanced: true,
        },
      });

      if (error) throw error;

      const parsedSummary = parseSummaryResponse(data.summary);
      setSummaryData(parsedSummary);

      toast({
        title: "Summary Generated",
        description: "Enhanced AI analysis completed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseSummaryResponse = (response: string): SummaryData => {
    const sections = response.split('**');
    return {
      summary: extractSection(response, 'SUMMARY'),
      critique: extractSection(response, 'CRITIQUE'),
      keyPoints: extractListSection(response, 'KEY CONTRIBUTIONS'),
      methodology: extractSection(response, 'METHODOLOGY'),
      limitations: extractListSection(response, 'LIMITATIONS'),
      impact: extractSection(response, 'IMPACT'),
      recommendations: extractListSection(response, 'RECOMMENDATIONS'),
    };
  };

  const extractSection = (text: string, section: string): string => {
    const regex = new RegExp(`\\*\\*${section}:\\*\\*\\s*([^*]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractListSection = (text: string, section: string): string[] => {
    const regex = new RegExp(`\\*\\*${section}:\\*\\*\\s*([^*]+)`, 'i');
    const match = text.match(regex);
    if (!match) return [];
    
    return match[1]
      .split('•')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Enhanced Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive analysis with insights, critique, and recommendations
            </CardDescription>
          </div>
          <Button 
            onClick={generateEnhancedSummary}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? 'Analyzing...' : 'Generate Analysis'}
          </Button>
        </div>
      </CardHeader>

      {summaryData && (
        <CardContent>
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="critique">Critique</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Executive Summary</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summaryData.summary}
                </p>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Key Contributions</h5>
                  <div className="flex flex-wrap gap-2">
                    {summaryData.keyPoints.map((point, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {point}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="critique" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <h4 className="font-semibold">Methodology</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {summaryData.methodology}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <h4 className="font-semibold">Limitations</h4>
                  </div>
                  <ul className="space-y-1">
                    {summaryData.limitations.map((limitation, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <h4 className="font-semibold">Research Insights</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {summaryData.critique}
                </p>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Recommendations</h5>
                  <ul className="space-y-1">
                    {summaryData.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <h4 className="font-semibold">Impact Analysis</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {summaryData.impact}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};