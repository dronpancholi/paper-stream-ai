import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Rating {
  id: string;
  user_id: string;
  paper_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface PaperRatingStats {
  average: number;
  count: number;
}

export const useRatings = () => {
  const { user } = useAuth();
  const [userRatings, setUserRatings] = useState<Record<string, Rating>>({});
  const [ratingStats, setRatingStats] = useState<Record<string, PaperRatingStats>>({});
  const [loading, setLoading] = useState(true);

  const fetchRatingStats = async (paperIds: string[]) => {
    if (paperIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('paper_id, rating')
        .in('paper_id', paperIds);

      if (error) throw error;

      const stats: Record<string, PaperRatingStats> = {};
      paperIds.forEach(id => {
        const paperRatings = data?.filter((r: any) => r.paper_id === id) || [];
        if (paperRatings.length > 0) {
          const average = paperRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / paperRatings.length;
          stats[id] = {
            average: Math.round(average * 10) / 10, // Round to 1 decimal
            count: paperRatings.length
          };
        } else {
          stats[id] = { average: 0, count: 0 };
        }
      });

      setRatingStats(prev => ({ ...prev, ...stats }));
    } catch (error) {
      console.error('Error fetching rating stats:', error);
    }
  };

  const fetchUserRatings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const ratings: Record<string, Rating> = {};
      data?.forEach((rating: any) => {
        ratings[rating.paper_id] = rating as Rating;
      });

      setUserRatings(ratings);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (paperId: string, rating: number, comment?: string) => {
    if (!user) {
      toast.error('Please sign in to rate papers');
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error('Rating must be between 1 and 5 stars');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          paper_id: paperId,
          rating: rating,
          comment: comment || null,
        })
        .select()
        .single();

      if (error) throw error;

      setUserRatings(prev => ({
        ...prev,
        [paperId]: data as Rating
      }));

      // Refresh rating stats for this paper
      await fetchRatingStats([paperId]);

      toast.success('Rating submitted successfully');
      return data;
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    }
  };

  const deleteRating = async (paperId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('user_id', user.id)
        .eq('paper_id', paperId);

      if (error) throw error;

      const newRatings = { ...userRatings };
      delete newRatings[paperId];
      setUserRatings(newRatings);

      // Refresh rating stats for this paper
      await fetchRatingStats([paperId]);

      toast.success('Rating deleted');
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error('Failed to delete rating');
    }
  };

  const getUserRating = (paperId: string): Rating | null => {
    return userRatings[paperId] || null;
  };

  const getPaperStats = (paperId: string): PaperRatingStats => {
    return ratingStats[paperId] || { average: 0, count: 0 };
  };

  useEffect(() => {
    fetchUserRatings();
  }, [user]);

  return {
    loading,
    submitRating,
    deleteRating,
    getUserRating,
    getPaperStats,
    fetchRatingStats,
  };
};