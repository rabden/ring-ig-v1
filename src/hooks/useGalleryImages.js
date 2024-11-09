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
        .eq('is_private', false);

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
        try {
          // 1. Get trending and hot images
          const trendingHotQuery = baseQuery
            .or('is_hot.eq.true,is_trending.eq.true')
            .neq('user_id', userId)
            .order('created_at', { ascending: false });

          const { data: trendingHotImages, error: trendingError } = await trendingHotQuery
            .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

          if (trendingError) throw trendingError;

          // If we have enough trending/hot images, return them
          if (trendingHotImages?.length === ITEMS_PER_PAGE) {
            return {
              data: trendingHotImages.map(image => ({
                ...image,
                image_url: supabase.storage
                  .from('user-images')
                  .getPublicUrl(image.storage_path).data.publicUrl
              })),
              nextPage: pageParam + 1
            };
          }

          // 2. Get images from followed users if we need more
          let remainingCount = ITEMS_PER_PAGE - (trendingHotImages?.length || 0);
          let followingImages = [];
          
          if (remainingCount > 0 && following?.length > 0) {
            const { data: followingData } = await baseQuery
              .in('user_id', following)
              .is('is_hot', false)
              .is('is_trending', false)
              .order('created_at', { ascending: false })
              .limit(remainingCount);

            followingImages = followingData || [];
            remainingCount -= followingImages.length;
          }

          // 3. Get regular images if we still need more
          let regularImages = [];
          if (remainingCount > 0) {
            const { data: regularData } = await baseQuery
              .not('user_id', 'in', `(${[userId, ...(following || [])].join(',')})`)
              .is('is_hot', false)
              .is('is_trending', false)
              .order('created_at', { ascending: false })
              .limit(remainingCount);

            regularImages = regularData || [];
          }

          const combinedData = [
            ...(trendingHotImages || []),
            ...followingImages,
            ...regularImages
          ];

          return {
            data: combinedData.map(image => ({
              ...image,
              image_url: supabase.storage
                .from('user-images')
                .getPublicUrl(image.storage_path).data.publicUrl
            })),
            nextPage: combinedData.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined
          };

        } catch (error) {
          console.error('Error fetching inspiration images:', error);
          return { data: [], nextPage: undefined };
        }
      } else {
        // For non-inspiration views (e.g., myImages)
        try {
          const { data: result, error } = await baseQuery
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

          if (error) throw error;

          return {
            data: result?.map(image => ({
              ...image,
              image_url: supabase.storage
                .from('user-images')
                .getPublicUrl(image.storage_path).data.publicUrl
            })) || [],
            nextPage: result?.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined
          };
        } catch (error) {
          console.error('Error fetching user images:', error);
          return { data: [], nextPage: undefined };
        }
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