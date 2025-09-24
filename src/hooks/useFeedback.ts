import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Feedback {
  id: string;
  paper_id: string;
  is_liked: boolean;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export const useFeedback = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFeedback = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('paper_feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async (paperId: string, isLiked: boolean, comment?: string) => {
    if (!user) {
      toast.error('Please log in to submit feedback');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('paper_feedback')
        .upsert({
          user_id: user.id,
          paper_id: paperId,
          is_liked: isLiked,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      setFeedback(prev => {
        const existing = prev.find(f => f.paper_id === paperId);
        if (existing) {
          return prev.map(f => f.paper_id === paperId ? data : f);
        }
        return [data, ...prev];
      });

      toast.success('Feedback submitted successfully');
      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  const deleteFeedback = async (paperId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('paper_feedback')
        .delete()
        .eq('user_id', user.id)
        .eq('paper_id', paperId);

      if (error) throw error;

      setFeedback(prev => prev.filter(f => f.paper_id !== paperId));
      toast.success('Feedback deleted');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const getPaperFeedback = (paperId: string) => {
    return feedback.find(f => f.paper_id === paperId);
  };

  useEffect(() => {
    fetchUserFeedback();
  }, [user]);

  return {
    feedback,
    loading,
    submitFeedback,
    deleteFeedback,
    getPaperFeedback,
    refetch: fetchUserFeedback
  };
};