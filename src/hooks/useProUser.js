import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProUser = (userId) => {
  return useQuery({
    queryKey: ['proUser', userId],
    queryFn: async () => {
      if (!userId) return false;
      
      try {
        const { data, error } = await supabase
          .from('pro_users')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully
        
        if (error) {
          console.error('Error checking pro status:', error);
          return false;
        }
        
        return !!data;
      } catch (error) {
        console.error('Error in useProUser:', error);
        return false;
      }
    },
    enabled: !!userId
  });
};