import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase/auth';

export const useGalleryImages = ({ activeView = 'all', page = 1, perPage = 20 }) => {
  const { user } = useSupabaseAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: ['gallery-images', activeView, page, userId],
    queryFn: async () => {
      let query = supabase
        .from('user_images')
        .select(`
          *,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .eq('is_private', false);

      if (activeView === 'inspiration') {
        if (userId) {
          query = query.neq('user_id', userId);
        }

        // First get hot AND trending images (newest first)
        const { data: hotAndTrending } = await query
          .eq('is_hot', true)
          .eq('is_trending', true)
          .order('created_at', { ascending: false });

        // Then get just hot images (newest first)
        const { data: hotOnly } = await query
          .eq('is_hot', true)
          .eq('is_trending', false)
          .order('created_at', { ascending: false });

        // Then get just trending images (newest first)
        const { data: trendingOnly } = await query
          .eq('is_hot', false)
          .eq('is_trending', true)
          .order('created_at', { ascending: false });

        // Get images from followed users (newest first)
        const { data: followedUsersImages } = await supabase
          .from('user_images')
          .select(`
            *,
            profiles:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq('is_private', false)
          .in(
            'user_id',
            supabase
              .from('follows')
              .select('following_id')
              .eq('follower_id', userId)
          )
          .order('created_at', { ascending: false });

        // Get remaining images (newest first)
        const { data: otherImages } = await query
          .eq('is_hot', false)
          .eq('is_trending', false)
          .order('created_at', { ascending: false });

        // Combine all results in the correct order
        const allImages = [
          ...(hotAndTrending || []),
          ...(hotOnly || []),
          ...(trendingOnly || []),
          ...(followedUsersImages || []),
          ...(otherImages || [])
        ];

        return {
          data: allImages,
          count: allImages.length
        };
      }

      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }

      return {
        data: data || [],
        count: count || 0
      };
    }
  });
};
