import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityContextType {
  isSecure: boolean;
  validateSession: () => Promise<boolean>;
  enforceRateLimit: (action: string) => boolean;
  sanitizeInput: (input: string) => string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  const { toast } = useToast();
  const [rateLimits, setRateLimits] = useState<Map<string, number[]>>(new Map());

  useEffect(() => {
    checkSecurityStatus();
  }, []);

  const checkSecurityStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsSecure(!!session);
    } catch (error) {
      setIsSecure(false);
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue",
          variant: "destructive",
        });
        return false;
      }

      const tokenExpiry = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      
      if (tokenExpiry && tokenExpiry < now) {
        await supabase.auth.refreshSession();
        return true;
      }

      return true;
    } catch {
      return false;
    }
  };

  const enforceRateLimit = (action: string, limit: number = 10, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const userLimits = rateLimits.get(action) || [];
    
    const validTimestamps = userLimits.filter(timestamp => now - timestamp < windowMs);
    
    if (validTimestamps.length >= limit) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Please slow down and try again later",
        variant: "destructive",
      });
      return false;
    }

    validTimestamps.push(now);
    setRateLimits(prev => new Map(prev.set(action, validTimestamps)));
    return true;
  };

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=\s*['"]/gi, '')
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 1000);
  };

  const value: SecurityContextType = {
    isSecure,
    validateSession,
    enforceRateLimit,
    sanitizeInput,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};