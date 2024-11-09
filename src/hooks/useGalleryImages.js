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
        .select('*', { count: 'exact' });

      // Apply privacy filter
      if (activeView === 'myImages') {
        baseQuery = baseQuery
          .eq('user_id', userId)
          .eq('is_private', showPrivate);
      } else {
        baseQuery = baseQuery
          .eq('is_private', false);
      }

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
