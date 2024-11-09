import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ITEMS_PER_PAGE = 20;

export const useGalleryImages = ({
  userId,
  activeView,
  nsfwEnabled,
  showPrivate,
  activeFilters = {},
  searchQuery = ''
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['galleryImages', userId, activeView, nsfwEnabled, showPrivate, activeFilters, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userId) return { data: [], nextPage: null, count: 0 };

      let query = supabase
        .from('user_images')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

      // Filter by NSFW content
      const nsfwModels = ['nsfwMaster', 'animeNsfw'];
      if (nsfwEnabled) {
        query = query.in('model', nsfwModels);
      } else {
        query = query.not('model', 'in', `(${nsfwModels.join(',')})`);
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

      const { data: images, error, count } = await query;
      
      if (error) throw error;

      // Transform the data to include public URLs
      const transformedData = images?.map(image => {
        const { data: { publicUrl } } = supabase.storage
          .from('user-images')
          .getPublicUrl(image.storage_path);
          
        return {
          ...image,
          image_url: publicUrl
        };
      }) || [];

      const hasMore = count ? (pageParam + 1) * ITEMS_PER_PAGE < count : false;
      return {
        data: transformedData,
        nextPage: hasMore ? pageParam + 1 : undefined,
        count: count || 0
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