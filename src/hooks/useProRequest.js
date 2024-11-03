import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useProRequest = (userId) => {
  return useQuery({
    queryKey: ['proRequest', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_pro_requests')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });
};