import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const ITEMS_PER_PAGE = 20;

export const useImageFetch = ({ userId, activeView, nsfwEnabled, activeFilters, searchQuery, modelConfigs }) => {
  const fetchImages = async ({ pageParam = 0 }) => {
    if (!userId) {
      return { images: [], nextPage: null, totalCount: 0 };
    }

    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Base query
    let query = supabase.from('user_images').select('*');

    // Apply view filters
    if (activeView === 'myImages') {
      query = query.eq('user_id', activeFilters?.userId || userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
    }

    // Apply NSFW filter based on model category
    if (modelConfigs) {
      const nsfwModelKeys = Object.entries(modelConfigs)
        .filter(([_, config]) => config.category === 'NSFW')
        .map(([key]) => key);

      if (nsfwEnabled) {
        query = query.in('model', nsfwModelKeys);
      } else {
        query = query.not('model', 'in', nsfwModelKeys);
      }
    }

    // Apply additional filters
    if (activeFilters?.style) {
      query = query.eq('style', activeFilters.style);
    }
    if (activeFilters?.model) {
      query = query.eq('model', activeFilters.model);
    }
    if (searchQuery) {
      query = query.ilike('prompt', `%${searchQuery}%`);
    }

    // Get total count
    const { count } = await query.count().single();

    // Apply pagination and sorting
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, error } = await query;
    if (error) throw error;

    return {
      images: data || [],
      nextPage: from + (data?.length || 0) < count ? pageParam + 1 : null,
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