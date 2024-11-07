import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useImageFilter } from '@/hooks/useImageFilter';

export const useGalleryData = ({
  userId,
  activeView,
  nsfwEnabled,
  activeFilters,
  searchQuery,
  showPrivate,
  session,
  modelConfigs
}) => {
  const { filterImages } = useImageFilter();

  return useQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled, activeFilters, searchQuery, showPrivate],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error('No authenticated user');
      }

      const query = supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeView === 'myImages') {
        query.eq('user_id', userId);
      } else if (activeView === 'inspiration') {
        query.neq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching images:', error);
        throw error;
      }

      return filterImages(data, {
        userId,
        activeView,
        nsfwEnabled,
        modelConfigs,
        activeFilters,
        searchQuery,
        showPrivate
      });
    },
    enabled: !!session?.user?.id && !!modelConfigs,
    retry: 3,
    staleTime: 1000 * 60, // 1 minute
  });
};