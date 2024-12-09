import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useFollows } from '@/hooks/useFollows';

const ITEMS_PER_PAGE = 20;
const NSFW_MODELS = ['nsfwMaster', 'animeNsfw'];

export const useGalleryImages = ({
  userId,
  activeView,
  nsfwEnabled,
  showPrivate,
  activeFilters = {},
  searchQuery = '',
  inspirationFilter = 'top'
}) => {
  const { following } = useFollows(userId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['galleryImages', userId, activeView, nsfwEnabled, showPrivate, activeFilters, searchQuery, following, inspirationFilter],
    queryFn: async ({ pageParam = { page: 0 } }) => {
      if (!userId) return { data: [], nextPage: null };

      let baseQuery = supabase
        .from('user_images')
        .select('*', { count: 'exact' });

      // Handle MyImages view
      if (activeView === 'myImages') {
        baseQuery = baseQuery.eq('user_id', userId)
          .eq('is_private', showPrivate);

        if (nsfwEnabled) {
          baseQuery = baseQuery.in('model', NSFW_MODELS);
        } else {
          baseQuery = baseQuery.not('model', 'in', '(' + NSFW_MODELS.join(',') + ')');
        }

        if (activeFilters.style) {
          baseQuery = baseQuery.eq('style', activeFilters.style);
        }
        if (activeFilters.model) {
          baseQuery = baseQuery.eq('model', activeFilters.model);
        }

        if (searchQuery) {
          baseQuery = baseQuery.ilike('prompt', `%${searchQuery}%`);
        }

        const start = pageParam.page * ITEMS_PER_PAGE;
        const { data: result, error, count } = await baseQuery
          .order('created_at', { ascending: false })
          .range(start, start + ITEMS_PER_PAGE - 1);

        if (error) throw error;

        return {
          data: result?.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })) || [],
          nextPage: (result?.length === ITEMS_PER_PAGE && count > start + ITEMS_PER_PAGE) 
            ? { page: pageParam.page + 1 } 
            : undefined
        };
      }

      // Handle Inspiration view
      baseQuery = baseQuery
        .neq('user_id', userId)
        .eq('is_private', false);

      // Apply NSFW filter
      if (nsfwEnabled) {
        baseQuery = baseQuery.in('model', NSFW_MODELS);
      } else {
        baseQuery = baseQuery.not('model', 'in', '(' + NSFW_MODELS.join(',') + ')');
      }

      // Apply search filter
      if (searchQuery) {
        baseQuery = baseQuery.ilike('prompt', `%${searchQuery}%`);
      }

      // Apply inspiration filter
      if (inspirationFilter === 'top') {
        baseQuery = baseQuery.or('is_hot.eq.true,is_trending.eq.true');
      } else if (inspirationFilter === 'following' && following?.length > 0) {
        baseQuery = baseQuery.in('user_id', following);
      } else if (inspirationFilter === 'following') {
        return { data: [], nextPage: undefined };
      }

      // Calculate pagination
      const start = pageParam.page * ITEMS_PER_PAGE;

      // Fetch images with pagination
      const { data: result, error, count } = await baseQuery
        .order('created_at', { ascending: false })
        .range(start, start + ITEMS_PER_PAGE - 1);

      if (error) throw error;

      return {
        data: result?.map(image => ({
          ...image,
          image_url: supabase.storage
            .from('user-images')
            .getPublicUrl(image.storage_path).data.publicUrl
        })) || [],
        nextPage: (result?.length === ITEMS_PER_PAGE && count > start + ITEMS_PER_PAGE) 
          ? { page: pageParam.page + 1 } 
          : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: { page: 0 }
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