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

      let baseQuery = supabase
        .from('user_images')
        .select('*', { count: 'exact' })
        .eq('is_private', false); // Always exclude private images

      // Apply NSFW filter
      const nsfwModels = ['nsfwMaster', 'animeNsfw'];
      if (nsfwEnabled) {
        baseQuery = baseQuery.in('model', nsfwModels);
      } else {
        baseQuery = baseQuery.not('model', 'in', `(${nsfwModels.join(',')})`);
      }

      // Apply style and model filters
      if (activeFilters.style) {
        baseQuery = baseQuery.eq('style', activeFilters.style);
      }
      if (activeFilters.model) {
        baseQuery = baseQuery.eq('model', activeFilters.model);
      }

      // Apply search filter
      if (searchQuery) {
        baseQuery = baseQuery.ilike('prompt', `%${searchQuery}%`);
      }

      if (activeView === 'inspiration') {
        // 1. Get trending and hot images
        const trendingHotImages = await baseQuery
          .or('is_hot.eq.true,is_trending.eq.true')
          .neq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

        let remainingCount = ITEMS_PER_PAGE - (trendingHotImages.data?.length || 0);
        let followingImages = { data: [] };
        let regularImages = { data: [] };

        // 2. Get images from followed users if we have space and following exists
        if (remainingCount > 0 && following?.length > 0) {
          followingImages = await baseQuery
            .in('user_id', following)
            .is('is_hot', false)
            .is('is_trending', false)
            .order('created_at', { ascending: false })
            .limit(remainingCount);

          remainingCount -= (followingImages.data?.length || 0);
        }

        // 3. Get regular images if we still have space
        if (remainingCount > 0) {
          regularImages = await baseQuery
            .not('user_id', 'in', `(${[userId, ...(following || [])].join(',')})`)
            .is('is_hot', false)
            .is('is_trending', false)
            .order('created_at', { ascending: false })
            .limit(remainingCount);
        }

        const combinedData = [
          ...(trendingHotImages.data || []),
          ...(followingImages.data || []),
          ...(regularImages.data || [])
        ];

        return {
          data: combinedData.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })),
          nextPage: combinedData.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
          count: (trendingHotImages.count || 0) + (followingImages.count || 0) + (regularImages.count || 0)
        };
      } else {
        // For non-inspiration views (e.g., myImages)
        const result = await baseQuery
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

        return {
          data: result.data?.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })) || [],
          nextPage: result.data?.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
          count: result.count || 0
        };
      }
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