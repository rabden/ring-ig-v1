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
        baseQuery = baseQuery
          .neq('user_id', userId)
          .eq('is_private', false);

        if (nsfwEnabled) {
          baseQuery = baseQuery.in('model', NSFW_MODELS);
        } else {
          baseQuery = baseQuery.not('model', 'in', '(' + NSFW_MODELS.join(',') + ')');
        }

        const { data: allImages, error } = await baseQuery;
        
        if (error) throw error;
        if (!allImages) return { data: [], nextPage: null };

        const trendingHotImages = allImages.filter(img => img.is_trending || img.is_hot)
          .sort((a, b) => {
            if (a.is_hot && a.is_trending && (!b.is_hot || !b.is_trending)) return -1;
            if (b.is_hot && b.is_trending && (!a.is_hot || !a.is_trending)) return 1;
            if (a.is_hot && !b.is_hot) return -1;
            if (b.is_hot && !a.is_hot) return 1;
            if (a.is_trending && !b.is_trending) return -1;
            if (b.is_trending && !a.is_trending) return 1;
            return new Date(b.created_at) - new Date(a.created_at);
          });

        const followingImages = allImages.filter(img => 
          following?.includes(img.user_id) && 
          !trendingHotImages.some(t => t.id === img.id)
        );

        const otherImages = allImages.filter(img => 
          !trendingHotImages.some(t => t.id === img.id) && 
          !followingImages.some(f => f.id === img.id)
        ).slice(0, 30);

        const sortedImages = [...trendingHotImages, ...followingImages, ...otherImages];
        
        const start = pageParam.page * ITEMS_PER_PAGE;
        const end = Math.min(start + ITEMS_PER_PAGE, sortedImages.length);
        const paginatedImages = sortedImages.slice(start, end);

        return {
          data: paginatedImages.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })),
          nextPage: end < sortedImages.length ? { page: pageParam.page + 1 } : undefined
        };
      } else {
        // For myImages view
        baseQuery = baseQuery.eq('user_id', userId);

        // Handle private/public filter
        baseQuery = baseQuery.eq('is_private', showPrivate);

        // Handle NSFW filter
        if (nsfwEnabled) {
          baseQuery = baseQuery.in('model', NSFW_MODELS);
        } else {
          baseQuery = baseQuery.not('model', 'in', '(' + NSFW_MODELS.join(',') + ')');
        }

        // Apply additional filters
        if (activeFilters.style) {
          baseQuery = baseQuery.eq('style', activeFilters.style);
        }
        if (activeFilters.model) {
          baseQuery = baseQuery.eq('model', activeFilters.model);
        }
        if (searchQuery) {
          baseQuery = baseQuery.ilike('prompt', `%${searchQuery}%`);
        }

        // Get total count first
        const { count } = await baseQuery.count();
        
        // Calculate pagination
        const start = pageParam.page * ITEMS_PER_PAGE;
        
        // Return early if no results or beyond total count
        if (!count || start >= count) {
          return {
            data: [],
            nextPage: undefined
          };
        }

        // Fetch paginated data
        const { data: images, error } = await baseQuery
          .order('created_at', { ascending: false })
          .range(start, start + ITEMS_PER_PAGE - 1);

        if (error) throw error;

        return {
          data: images?.map(image => ({
            ...image,
            image_url: supabase.storage
              .from('user-images')
              .getPublicUrl(image.storage_path).data.publicUrl
          })) || [],
          nextPage: images?.length === ITEMS_PER_PAGE && count > start + ITEMS_PER_PAGE 
            ? { page: pageParam.page + 1 } 
            : undefined
        };
      }
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