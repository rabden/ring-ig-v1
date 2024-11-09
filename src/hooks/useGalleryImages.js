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
        .select('*', { count: 'exact' })
        .eq('is_private', false);

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

        // Get images from followed users first
        if (following?.length > 0) {
          const followedUsersImages = await query
            .in('user_id', following)
            .order('created_at', { ascending: false })
            .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

          if (followedUsersImages.data?.length >= ITEMS_PER_PAGE) {
            return {
              data: followedUsersImages.data,
              nextPage: pageParam + 1,
              count: followedUsersImages.count || 0
            };
          }

          // If we don't have enough images from followed users, get trending/hot images
          const remainingItems = ITEMS_PER_PAGE - (followedUsersImages.data?.length || 0);
          const trendingImages = await query
            .not('user_id', 'in', `(${following.join(',')})`)
            .or('is_hot.eq.true,is_trending.eq.true')
            .order('is_hot', { ascending: false })
            .order('is_trending', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(remainingItems);

          // Combine followed users' images with trending images
          const combinedImages = [
            ...(followedUsersImages.data || []),
            ...(trendingImages.data || [])
          ];

          if (combinedImages.length >= ITEMS_PER_PAGE) {
            return {
              data: combinedImages,
              nextPage: pageParam + 1,
              count: combinedImages.length
            };
          }

          // If we still don't have enough images, get regular images
          const remainingCount = ITEMS_PER_PAGE - combinedImages.length;
          const regularImages = await query
            .not('user_id', 'in', `(${following.join(',')})`)
            .is('is_hot', false)
            .is('is_trending', false)
            .order('created_at', { ascending: false })
            .limit(remainingCount);

          return {
            data: [
              ...combinedImages,
              ...(regularImages.data || [])
            ],
            nextPage: pageParam + 1,
            count: combinedImages.length + (regularImages.count || 0)
          };
        } else {
          // If user doesn't follow anyone, get trending/hot images first
          const trendingImages = await query
            .or('is_hot.eq.true,is_trending.eq.true')
            .order('is_hot', { ascending: false })
            .order('is_trending', { ascending: false })
            .order('created_at', { ascending: false })
            .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);

          if (trendingImages.data?.length >= ITEMS_PER_PAGE) {
            return {
              data: trendingImages.data,
              nextPage: pageParam + 1,
              count: trendingImages.count || 0
            };
          }

          // Get regular images if needed
          const remainingItems = ITEMS_PER_PAGE - (trendingImages.data?.length || 0);
          const regularImages = await query
            .is('is_hot', false)
            .is('is_trending', false)
            .order('created_at', { ascending: false })
            .limit(remainingItems);

          return {
            data: [
              ...(trendingImages.data || []),
              ...(regularImages.data || [])
            ],
            nextPage: pageParam + 1,
            count: (trendingImages.count || 0) + (regularImages.count || 0)
          };
        }
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

      const { data: images, error, count } = await query
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });
      
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