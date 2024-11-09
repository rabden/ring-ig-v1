import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProUser = (userId) => {
  return useQuery({
    queryKey: ['proUser', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data } = await supabase
        .from('profiles')
        .select('is_pro, updated_at')
        .eq('id', userId)
        .single();
      
      return data?.is_pro || false;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false
  });
};