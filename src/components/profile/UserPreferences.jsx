import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Badge } from "@/components/ui/badge";

const UserPreferences = ({ userId, modelConfigs, styleConfigs }) => {
  const { data: preferences } = useQuery({
    queryKey: ['userPreferences', userId],
    queryFn: async () => {
      const { data: images } = await supabase
        .from('user_images')
        .select('model, style')
        .eq('user_id', userId);

      if (!images) return { models: {}, styles: {} };

      const models = images.reduce((acc, img) => {
        acc[img.model] = (acc[img.model] || 0) + 1;
        return acc;
      }, {});

      const styles = images.reduce((acc, img) => {
        if (img.style) {
          acc[img.style] = (acc[img.style] || 0) + 1;
        }
        return acc;
      }, {});

      return { models, styles };
    }
  });

  if (!preferences) return null;

  const topModels = Object.entries(preferences.models || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topStyles = Object.entries(preferences.styles || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Favorite Models</h3>
        <div className="flex flex-wrap gap-2">
          {topModels.map(([model, count]) => (
            <Badge key={model} variant="secondary">
              {modelConfigs?.[model]?.name || model} ({count})
            </Badge>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Preferred Styles</h3>
        <div className="flex flex-wrap gap-2">
          {topStyles.map(([style, count]) => (
            <Badge key={style} variant="secondary">
              {styleConfigs?.[style]?.name || style} ({count})
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;