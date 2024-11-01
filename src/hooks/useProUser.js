import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProUser = (userId) => {
  return useQuery({
    queryKey: ['proUser', userId],
    queryFn: async () => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from('pro_users')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error checking pro status:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!userId
  });
};