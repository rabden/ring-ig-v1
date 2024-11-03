import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ITEMS_PER_PAGE = 20;

export const useImageFetch = ({ userId, activeView, nsfwEnabled, activeFilters, searchQuery, modelConfigs }) => {
  const fetchImages = async ({ pageParam = 0 }) => {
    // Don't fetch if no userId
    if (!userId) {
      return {
        images: [],
        nextPage: undefined,
        totalCount: 0
      };
    }

    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply filters
    if (activeView === 'myImages') {
      query = query.eq('user_id', userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
    }

    if (activeFilters?.style) {
      query = query.eq('style', activeFilters.style);
    }
    if (activeFilters?.model) {
      query = query.eq('model', activeFilters.model);
    }
    if (searchQuery) {
      query = query.ilike('prompt', `%${searchQuery}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // Filter NSFW content
    const filteredData = data.filter(img => {
      const isNsfw = modelConfigs?.[img.model]?.category === "NSFW";
      return nsfwEnabled ? isNsfw : !isNsfw;
    });

    return {
      images: filteredData,
      nextPage: filteredData.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      totalCount: count
    };
  };

  return useInfiniteQuery({
    queryKey: ['images', userId, activeView, nsfwEnabled, activeFilters, searchQuery],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId && !!modelConfigs,
  });
};