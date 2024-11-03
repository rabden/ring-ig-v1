import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ITEMS_PER_PAGE = 20;
const NSFW_MODELS = ['animeNsfw', 'nsfwMaster'];

export const useSimpleImageFetch = ({ userId, activeView, nsfwEnabled, activeFilters = {} }) => {
  const fetchImages = async ({ pageParam = 0 }) => {
    if (!userId) {
      return { images: [], nextPage: null };
    }

    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*');

    // Apply NSFW filtering
    if (nsfwEnabled) {
      query = query.in('model', NSFW_MODELS);
    } else {
      query = query.not.in('model', NSFW_MODELS);
    }

    // Apply view filters
    if (activeView === 'myImages') {
      query = query.eq('user_id', activeFilters?.userId || userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
    }

    // Apply additional filters
    if (activeFilters?.style) {
      query = query.eq('style', activeFilters.style);
    }
    if (activeFilters?.model) {
      query = query.eq('model', activeFilters.model);
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