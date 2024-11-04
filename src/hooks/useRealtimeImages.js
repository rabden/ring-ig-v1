import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeImages = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('user_images_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_images'
        },
        (payload) => {
          // Invalidate and refetch queries when data changes
          queryClient.invalidateQueries(['paginatedImages']);
          queryClient.invalidateQueries(['userImages']);
          queryClient.invalidateQueries(['singleImage']);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};