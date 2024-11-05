import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProUser = (userId) => {
  return useQuery({
    queryKey: ['proUser', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data } = await supabase
        .from('pro_users')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      return !!data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    initialData: false // Set initial data to false
  });
};