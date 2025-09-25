import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Like {
  id: string;
  user_id: string;
  paper_id: string;
  vote: 'like' | 'dislike';
  created_at: string;
  updated_at: string;
}

export interface LikeCounts {
  likes: number;
  dislikes: number;
}

export const useLikes = () => {
  const { user } = useAuth();
  const [likesData, setLikesData] = useState<Record<string, Like>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, LikeCounts>>({});
  const [loading, setLoading] = useState(true);

  const fetchLikeCounts = async (paperIds: string[]) => {
    if (paperIds.length === 0) return;

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('paper_id, vote')
        .in('paper_id', paperIds);

      if (error) throw error;

      const counts: Record<string, LikeCounts> = {};
      paperIds.forEach(id => {
        counts[id] = { likes: 0, dislikes: 0 };
      });

      data?.forEach((like: any) => {
        if (!counts[like.paper_id]) {
          counts[like.paper_id] = { likes: 0, dislikes: 0 };
        }
        if (like.vote === 'like') {
          counts[like.paper_id].likes++;
        } else if (like.vote === 'dislike') {
          counts[like.paper_id].dislikes++;
        }
      });

      setLikeCounts(prev => ({ ...prev, ...counts }));
    } catch (error) {
      console.error('Error fetching like counts:', error);
    }
  };

  const fetchUserLikes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const likes: Record<string, Like> = {};
      data?.forEach((like: any) => {
        likes[like.paper_id] = like as Like;
      });

      setLikesData(likes);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (paperId: string, vote: 'like' | 'dislike') => {
    if (!user) {
      toast.error('Please sign in to like papers');
      return;
    }

    const existingLike = likesData[paperId];
    
    try {
      if (existingLike && existingLike.vote === vote) {
        // Remove like/dislike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('paper_id', paperId);

        if (error) throw error;

        const newLikesData = { ...likesData };
        delete newLikesData[paperId];
        setLikesData(newLikesData);

        // Update counts
        setLikeCounts(prev => ({
          ...prev,
          [paperId]: {
            ...prev[paperId],
            [vote]: Math.max(0, (prev[paperId]?.[vote] || 0) - 1)
          }
        }));
      } else {
        // Add or change like/dislike
        const { data, error } = await supabase
          .from('likes')
          .upsert({
            user_id: user.id,
            paper_id: paperId,
            vote: vote,
          })
          .select()
          .single();

        if (error) throw error;

        setLikesData(prev => ({
          ...prev,
          [paperId]: data as Like
        }));

        // Update counts
        setLikeCounts(prev => {
          const currentCounts = prev[paperId] || { likes: 0, dislikes: 0 };
          const newCounts = { ...currentCounts };
          
          if (existingLike) {
            // Decrease old vote count
            newCounts[existingLike.vote] = Math.max(0, newCounts[existingLike.vote] - 1);
          }
          
          // Increase new vote count
          newCounts[vote] = newCounts[vote] + 1;
          
          return {
            ...prev,
            [paperId]: newCounts
          };
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const getUserVote = (paperId: string): 'like' | 'dislike' | null => {
    return likesData[paperId]?.vote || null;
  };

  const getPaperCounts = (paperId: string): LikeCounts => {
    return likeCounts[paperId] || { likes: 0, dislikes: 0 };
  };

  useEffect(() => {
    fetchUserLikes();
  }, [user]);

  return {
    loading,
    toggleLike,
    getUserVote,
    getPaperCounts,
    fetchLikeCounts,
  };
};