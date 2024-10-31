import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useModelConfigs = () => {
  return useQuery({
    queryKey: ['modelConfigs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_configs')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Convert array to object with key as index
      return data.reduce((acc, model) => {
        acc[model.key] = {
          name: model.name,
          category: model.category,
          apiUrl: model.api_url,
          inferenceSteps: model.inference_steps,
          defaultStep: model.default_step,
          qualityLimits: model.quality_limits,
          noStyleSuffix: model.no_style_suffix,
          isPremium: model.is_premium,
          promptSuffix: model.prompt_suffix
        };
        return acc;
      }, {});
    },
  });
};