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

    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*', { count: 'exact' });

    // Apply view filters
    if (activeView === 'myImages') {
      query = query.eq('user_id', userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
      // Sort by hot and trending for inspiration view
      query = query.order('is_hot', { ascending: false })
                  .order('is_trending', { ascending: false })
                  .order('created_at', { ascending: false });
    } else {
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

    const { data, error, count } = await query;
    if (error) throw error;

    // Filter NSFW content
    const filteredData = data.filter(img => {
      const isNsfw = modelConfigs?.[img.model]?.category === "NSFW";
      return nsfwEnabled ? isNsfw : !isNsfw;
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