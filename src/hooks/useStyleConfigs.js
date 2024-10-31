import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useStyleConfigs = () => {
  return useQuery({
    queryKey: ['styleConfigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('style_configs')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Convert array to object with key as index
      return data.reduce((acc, style) => {
        acc[style.key] = {
          name: style.name,
          suffix: style.suffix,
          isPremium: style.is_premium
        };
        return acc;
      }, {});
    },
  });
};