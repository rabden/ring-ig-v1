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
    enabled: !!userId
  });
};