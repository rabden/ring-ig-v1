import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

export const useGalleryImages = ({
  userId,
  activeView,
  nsfwEnabled,
  showPrivate,
  activeFilters = {},
  searchQuery = ''
}) => {
  const { data: images, isLoading } = useQuery({
    queryKey: ['galleryImages', userId, activeView, nsfwEnabled, showPrivate, activeFilters, searchQuery],
    queryFn: async () => {
      if (!userId) return [];

      let query = supabase
        .from('user_images')
        .select('*, model_configs!inner(*)')
        .order('created_at', { ascending: false });

      // Filter by NSFW content based on model category
      if (nsfwEnabled) {
        query = query.eq('model_configs.category', 'NSFW');
      } else {
        query = query.neq('model_configs.category', 'NSFW');
      }

      // Apply view-specific filters
      if (activeView === 'myImages') {
        query = query.eq('user_id', userId);
        
        // Filter private images
        if (showPrivate) {
          query = query.eq('is_private', true);
        } else {
          query = query.eq('is_private', false);
        }
      } else if (activeView === 'inspiration') {
        query = query
          .neq('user_id', userId)
          .eq('is_private', false);
      }

      // Apply style and model filters if present
      if (activeFilters.style) {
        query = query.eq('style', activeFilters.style);
      }
      if (activeFilters.model) {
        query = query.eq('model', activeFilters.model);
      }

      // Apply search filter if present
      if (searchQuery) {
        query = query.ilike('prompt', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  return { images, isLoading };
};