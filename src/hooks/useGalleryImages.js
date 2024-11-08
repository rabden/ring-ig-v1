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
      let query = supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter based on active view
      if (activeView === 'myImages' && userId) {
        query = query.eq('user_id', userId);
      }

      // Handle private images
      if (userId) {
        // If showing private images, show user's private images and all public images
        if (showPrivate) {
          query = query.or(`user_id.eq.${userId},is_private.eq.false`);
        } else {
          // If not showing private images, only show public images
          query = query.eq('is_private', false);
        }
      } else {
        // For non-logged in users, only show public images
        query = query.eq('is_private', false);
      }

      // Apply NSFW filter if needed
      if (!nsfwEnabled) {
        query = query.neq('model', 'nsfwMaster');
      }

      // Apply search filter if present
      if (searchQuery) {
        query = query.ilike('prompt', `%${searchQuery}%`);
      }

      // Apply active filters
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching images:', error);
        return [];
      }

      return data || [];
    }
  });

  return { images, isLoading };
};