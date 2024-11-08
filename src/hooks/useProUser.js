import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProUser = (userId) => {
  return useQuery({
    queryKey: ['proUser', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', userId)
        .single();
      
      return data?.is_pro || false;
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // Cache for 1 minute
    cacheTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};