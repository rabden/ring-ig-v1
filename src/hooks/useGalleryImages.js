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
    queryFn: async ({ pageParam = { page: 0, type: 'trending' } }) => {
      if (!userId) return { data: [], nextPage: null };

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
          let images = [];
          let nextPage = null;

          // Get trending and hot images
          if (pageParam.type === 'trending') {
            const { data: trendingHotImages, error: trendingError } = await baseQuery
              .or('is_hot.eq.true,is_trending.eq.true')
              .neq('user_id', userId)
              .order('created_at', { ascending: false })
              .range(pageParam.page * ITEMS_PER_PAGE, (pageParam.page + 1) * ITEMS_PER_PAGE - 1);

            if (trendingError) throw trendingError;
            
            images = trendingHotImages || [];
            
            if (images.length === ITEMS_PER_PAGE) {
              nextPage = { page: pageParam.page + 1, type: 'trending' };
            } else if (following?.length > 0) {
              nextPage = { page: 0, type: 'following' };
            } else {
              nextPage = { page: 0, type: 'regular' };
            }
          }
          
          // Get following users' images
          else if (pageParam.type === 'following' && following?.length > 0) {
            const { data: followingImages, error: followingError } = await baseQuery
              .in('user_id', following)
              .is('is_hot', false)
              .is('is_trending', false)
              .order('created_at', { ascending: false })
              .range(pageParam.page * ITEMS_PER_PAGE, (pageParam.page + 1) * ITEMS_PER_PAGE - 1);

            if (followingError) throw followingError;
            
            images = followingImages || [];
            
            if (images.length === ITEMS_PER_PAGE) {
              nextPage = { page: pageParam.page + 1, type: 'following' };
            } else {
              nextPage = { page: 0, type: 'regular' };
            }
          }
          
          // Get regular images
          else if (pageParam.type === 'regular') {
            const { data: regularImages, error: regularError } = await baseQuery
              .not('user_id', 'in', `(${[userId, ...(following || [])].join(',')})`)
              .is('is_hot', false)
              .is('is_trending', false)
              .order('created_at', { ascending: false })
              .range(pageParam.page * ITEMS_PER_PAGE, (pageParam.page + 1) * ITEMS_PER_PAGE - 1);

            if (regularError) throw regularError;
            
            images = regularImages || [];
            
            if (images.length === ITEMS_PER_PAGE) {
              nextPage = { page: pageParam.page + 1, type: 'regular' };
            }
          }

          return {
            data: images.map(image => ({
              ...image,
              image_url: supabase.storage
                .from('user-images')
                .getPublicUrl(image.storage_path).data.publicUrl
            })),
            nextPage
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
            .range(pageParam.page * ITEMS_PER_PAGE, (pageParam.page + 1) * ITEMS_PER_PAGE - 1);

          if (error) throw error;

          return {
            data: result?.map(image => ({
              ...image,
              image_url: supabase.storage
                .from('user-images')
                .getPublicUrl(image.storage_path).data.publicUrl
            })) || [],
            nextPage: result?.length === ITEMS_PER_PAGE ? { page: pageParam.page + 1 } : undefined
          };
        } catch (error) {
          console.error('Error fetching user images:', error);
          return { data: [], nextPage: undefined };
        }
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: { page: 0, type: 'trending' }
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