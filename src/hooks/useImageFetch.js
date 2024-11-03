import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ITEMS_PER_PAGE = 20;

export const useImageFetch = ({ userId, activeView, nsfwEnabled, activeFilters, searchQuery, modelConfigs }) => {
  const fetchImages = async ({ pageParam = 0 }) => {
    if (!userId) {
      return {
        images: [],
        nextPage: null,
        totalCount: 0
      };
    }

    // First, get the total count
    const countQuery = supabase
      .from('user_images')
      .select('id', { count: 'exact', head: true });

    // Apply the same filters as the main query
    if (activeView === 'myImages') {
      countQuery.eq('user_id', activeFilters?.userId || userId);
    } else if (activeView === 'inspiration') {
      countQuery.neq('user_id', userId);
    }

    if (activeFilters?.style) {
      countQuery.eq('style', activeFilters.style);
    }
    if (activeFilters?.model) {
      countQuery.eq('model', activeFilters.model);
    }
    if (searchQuery) {
      countQuery.ilike('prompt', `%${searchQuery}%`);
    }

    const { count } = await countQuery;

    // Calculate the offset and check if it's beyond total records
    const from = pageParam * ITEMS_PER_PAGE;
    if (count && from >= count) {
      return {
        images: [],
        nextPage: null,
        totalCount: count
      };
    }

    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*');

    // Apply view filters and sorting
    if (activeView === 'myImages') {
      query = query
        .eq('user_id', activeFilters?.userId || userId)
        .order('created_at', { ascending: false });
    } else if (activeView === 'inspiration') {
      query = query
        .neq('user_id', userId)
        .order('is_hot', { ascending: false })
        .order('is_trending', { ascending: false })
        .order('created_at', { ascending: false });
    } else {
      // Default sorting by date for other views
      query = query.order('created_at', { ascending: false });
    }

    // Apply style and model filters
    if (activeFilters?.style) {
      query = query.eq('style', activeFilters.style);
    }
    if (activeFilters?.model) {
      query = query.eq('model', activeFilters.model);
    }

    // Apply search filter
    if (searchQuery) {
      query = query.ilike('prompt', `%${searchQuery}%`);
    }

    // Apply pagination after all filters
    query = query.range(from, to);

    const { data, error } = await query;
    if (error) throw error;

    // Filter NSFW content based on model category
    const filteredData = data.filter(img => {
      const modelConfig = modelConfigs?.[img.model];
      const isNsfwModel = modelConfig?.category === "NSFW";
      return nsfwEnabled ? isNsfwModel : !isNsfwModel;
    });

    const hasMore = from + filteredData.length < count;
    
    return {
      images: filteredData,
      nextPage: hasMore ? pageParam + 1 : null,
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