import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RealtimeSubscription {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const useRealTimeUpdates = (subscriptions: RealtimeSubscription[]) => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (subscriptions.length === 0) return;

    const channel = supabase
      .channel('realtime-updates')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        subscriptions.forEach(sub => {
          if (payload.table === sub.table && (sub.event === '*' || payload.eventType === sub.event)) {
            sub.callback(payload);
          }
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          toast({
            title: "Connection Error",
            description: "Real-time updates temporarily unavailable",
            variant: "destructive",
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [subscriptions, toast]);

  return { isConnected };
};

export const useSearchCache = () => {
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  const getCachedResult = (key: string) => {
    const result = cache.get(key);
    if (result && Date.now() - result.timestamp < 300000) { // 5 minutes
      return result.data;
    }
    return null;
  };

  const setCachedResult = (key: string, data: any) => {
    setCache(prev => new Map(prev.set(key, {
      data,
      timestamp: Date.now()
    })));
  };

  const clearCache = () => {
    setCache(new Map());
  };

  return { getCachedResult, setCachedResult, clearCache };
};