import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ITEMS_PER_PAGE = 20;

export const useSimpleImageFetch = ({ userId, activeView, nsfwEnabled, activeFilters = {} }) => {
  const fetchImages = async ({ pageParam = 0 }) => {
    if (!userId) {
      return { images: [], nextPage: null };
    }

    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*')
      .eq('is_private', false); // Always exclude private images in profile popup

    // Apply view filters
    if (activeView === 'myImages') {
      query = query.eq('user_id', activeFilters?.userId || userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
    }

    // Apply NSFW filtering based on model category
    if (nsfwEnabled) {
      query = query.in('model', ['nsfwMaster', 'animeNsfw']); // Show only NSFW content when enabled
    } else {
      query = query.not('model', 'in', '(nsfwMaster,animeNsfw)'); // Exclude NSFW content when disabled
    }

    // Apply additional filters
    if (activeFilters?.style) {
      query = query.eq('style', activeFilters.style);
    }
    if (activeFilters?.model) {
      query = query.eq('model', activeFilters.model);
    }
    if (activeFilters?.userId) {
      query = query.eq('user_id', activeFilters.userId);
    }

    // Apply sorting
    if (activeView === 'inspiration') {
      query = query
        .order('is_hot', { ascending: false })
        .order('is_trending', { ascending: false })
        .order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(from, to);

    const { data: images, error } = await query;
    if (error) throw error;

    const hasMore = images?.length === ITEMS_PER_PAGE;
    
    return {
      images: images || [],
      nextPage: hasMore ? pageParam + 1 : null,
    };
  };

  return useInfiniteQuery({
    queryKey: ['simpleImages', userId, activeView, nsfwEnabled, activeFilters],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId,
  });
};