import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useModelConfigs } from './useModelConfigs';

const ITEMS_PER_PAGE = 20;

export const useFilteredImageFetch = ({ 
  userId, 
  profileUserId, 
  nsfwEnabled,
  activeFilters = {} 
}) => {
  const { data: modelConfigs } = useModelConfigs();

  const fetchImages = async ({ pageParam = 0 }) => {
    if (!userId || !profileUserId) {
      return { images: [], nextPage: null };
    }

    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Start with base query
    let query = supabase.from('user_images').select('*');

    // Privacy handling
    if (userId === profileUserId) {
      // Viewing own profile - show all images
      query = query.eq('user_id', userId);
    } else {
      // Viewing other profile - only show public images
      query = query
        .eq('user_id', profileUserId)
        .eq('is_private', false);
    }

    // NSFW filtering
    const nsfwModels = ['nsfwMaster', 'animeNsfw'];
    if (nsfwEnabled) {
      query = query.in('model', nsfwModels);
    } else {
      query = query.not('model', 'in', `(${nsfwModels.join(',')})`);
    }

    // Apply style filter if present
    if (activeFilters?.style) {
      query = query.eq('style', activeFilters.style);
    }

    // Apply model filter if present
    if (activeFilters?.model) {
      query = query.eq('model', activeFilters.model);
    }

    // Apply pagination and sorting
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: images, error } = await query;
    
    if (error) {
      console.error('Error fetching images:', error);
      throw error;
    }

    // Additional client-side filtering for NSFW content using modelConfigs
    const filteredImages = images?.filter(img => {
      const isNsfw = modelConfigs?.[img.model]?.category === "NSFW";
      return nsfwEnabled ? true : !isNsfw;
    }) || [];

    const hasMore = filteredImages.length === ITEMS_PER_PAGE;

    return {
      images: filteredImages,
      nextPage: hasMore ? pageParam + 1 : null,
    };
  };

  return useInfiniteQuery({
    queryKey: ['filteredImages', userId, profileUserId, nsfwEnabled, activeFilters],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId && !!profileUserId,
  });
};