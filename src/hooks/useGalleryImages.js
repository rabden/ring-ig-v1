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
    queryFn: async ({ pageParam = { page: 0 } }) => {
      if (!userId) return { data: [], nextPage: null };

      let baseQuery = supabase
        .from('user_images')
        .select('*', { count: 'exact' });

      if (activeView === 'inspiration') {
        // For inspiration view, get all public images except user's own
        baseQuery = baseQuery
          .neq('user_id', userId)
          .eq('is_private', false);

        // Apply NSFW filter
        if (!nsfwEnabled) {
          baseQuery = baseQuery.not('model', 'in', '(nsfwMaster,animeNsfw)');
        }

        const { data: allImages, error, count } = await baseQuery;
        
        if (error) throw error;
        if (!allImages) return { data: [], nextPage: null };

        // Filter NSFW images based on nsfwEnabled state
        const filteredImages = allImages.filter(img => {
          const isNsfwModel = ['nsfwMaster', 'animeNsfw'].includes(img.model);
          return nsfwEnabled ? true : !isNsfwModel;
        });

        // Separate and sort images
        const trendingHotImages = filteredImages.filter(img => img.is_trending || img.is_hot)
          .sort((a, b) => {
            if (a.is_hot && a.is_trending && (!b.is_hot || !b.is_trending)) return -1;
            if (b.is_hot && b.is_trending && (!a.is_hot || !a.is_trending)) return 1;
            if (a.is_hot && !b.is_hot) return -1;
            if (b.is_hot && !a.is_hot) return 1;
            if (a.is_trending && !b.is_trending) return -1;
            if (b.is_trending && !a.is_trending) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
          });

        const followingImages = filteredImages.filter(img => 
          following?.includes(img.user_id) && 
          !trendingHotImages.some(t => t.id === img.id)
        );

        const otherImages = filteredImages.filter(img => 
          !trendingHotImages.some(t => t.id === img.id) && 
          !followingImages.some(f => f.id === img.id)
        ).slice(0, 30);

        const sortedImages = [...trendingHotImages, ...followingImages, ...otherImages];
        
        // Apply pagination to the sorted results
        const start = pageParam.page * ITEMS_PER_PAGE;
        const paginatedImages = sortedImages.slice(start, start + ITEMS_PER_PAGE);

        return {
          data: paginatedImages.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })),
          nextPage: paginatedImages.length === ITEMS_PER_PAGE ? { page: pageParam.page + 1 } : undefined
        };
      } else {
        // For myImages view
        baseQuery = baseQuery
          .eq('user_id', userId)
          .eq('is_private', showPrivate);

        // Apply NSFW filter
        if (!nsfwEnabled) {
          baseQuery = baseQuery.not('model', 'in', '(nsfwMaster,animeNsfw)');
        }
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