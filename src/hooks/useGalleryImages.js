import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useFollows } from '@/hooks/useFollows';

const ITEMS_PER_PAGE = 20;

export const useGalleryImages = ({
  userId,
  activeView,
  nsfwEnabled,
  showPrivate,
  activeFilters = {},
  searchQuery = ''
}) => {
  const { following } = useFollows(userId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['galleryImages', userId, activeView, nsfwEnabled, showPrivate, activeFilters, searchQuery, following],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) return { data: [], nextPage: null, count: 0 };

      let query = supabase
        .from('user_images')
        .select('*', { count: 'exact' });

      // Apply privacy filter
      if (activeView === 'myImages') {
        query = query.eq('user_id', userId);
        if (showPrivate) {
          query = query.eq('is_private', true);
        } else {
          query = query.eq('is_private', false);
        }
      } else {
        query = query
          .neq('user_id', userId)
          .eq('is_private', false);
      }

      // Filter by NSFW content
      const nsfwModels = ['nsfwMaster', 'animeNsfw'];
      if (nsfwEnabled) {
        query = query.in('model', nsfwModels);
      } else {
        query = query.not('model', 'in', `(${nsfwModels.join(',')})`);
      }

      // Apply style and model filters
      if (activeFilters.style) {
        query = query.eq('style', activeFilters.style);
      }
      if (activeFilters.model) {
        query = query.eq('model', activeFilters.model);
      }

      // Apply search filter
      if (searchQuery) {
        query = query.ilike('prompt', `%${searchQuery}%`);
      }

      let result;
      if (activeView === 'inspiration' && following?.length > 0) {
        // Get images from followed users
        const followedUsersImages = await query
          .in('user_id', following)
          .order('created_at', { ascending: false })
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

        if (followedUsersImages.data?.length >= ITEMS_PER_PAGE) {
          result = followedUsersImages;
        } else {
          // Get trending/hot images excluding followed users
          const trendingImages = await query
            .not('user_id', 'in', `(${following.join(',')})`)
            .or('is_hot.eq.true,is_trending.eq.true')
            .order('created_at', { ascending: false })
            .limit(ITEMS_PER_PAGE - (followedUsersImages.data?.length || 0));

          // Get regular images if needed
          const remainingCount = ITEMS_PER_PAGE - (followedUsersImages.data?.length || 0) - (trendingImages.data?.length || 0);
          let regularImages = { data: [] };
          
          if (remainingCount > 0) {
            regularImages = await query
              .not('user_id', 'in', `(${following.join(',')})`)
              .is('is_hot', false)
              .is('is_trending', false)
              .order('created_at', { ascending: false })
              .limit(remainingCount);
          }

          result = {
            data: [
              ...(followedUsersImages.data || []),
              ...(trendingImages.data || []),
              ...(regularImages.data || [])
            ],
            count: (followedUsersImages.count || 0) + (trendingImages.count || 0) + (regularImages.count || 0)
          };
        }
      } else {
        // Default ordering for non-following cases
        result = await query
          .order('created_at', { ascending: false })
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);
      }

      // Transform the data to include public URLs
      const transformedData = result.data?.map(image => ({
        ...image,
        image_url: supabase.storage
          .from('user-images')
          .getPublicUrl(image.storage_path).data.publicUrl
      })) || [];

      return {
        data: transformedData,
        nextPage: transformedData.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
        count: result.count || 0
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: 0
  });

  const images = data?.pages?.flatMap(page => page.data) || [];

  return { 
    images, 
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};