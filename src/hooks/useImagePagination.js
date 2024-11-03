import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { useImageFilter } from './useImageFilter';

const IMAGES_PER_PAGE = 20;

export const useImagePagination = (userId, activeView, nsfwEnabled, activeFilters, searchQuery, modelConfigs) => {
  const { filterImages } = useImageFilter();
  const [hasMoreImages, setHasMoreImages] = useState(true);

  const fetchImagePage = async ({ pageParam = 0 }) => {
    const from = pageParam * IMAGES_PER_PAGE;
    const to = from + IMAGES_PER_PAGE - 1;

    let query = supabase
      .from('user_images')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (activeView === 'myImages') {
      query = query.eq('user_id', userId);
    } else if (activeView === 'inspiration') {
      query = query.neq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Apply filters to the fetched data
    const filteredData = filterImages(data || [], {
      userId,
      activeView,
      nsfwEnabled,
      modelConfigs,
      activeFilters,
      searchQuery
    });

    setHasMoreImages(data?.length === IMAGES_PER_PAGE);

    return {
      images: filteredData,
      nextPage: data?.length === IMAGES_PER_PAGE ? pageParam + 1 : undefined,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['paginatedImages', userId, activeView, nsfwEnabled, activeFilters, searchQuery],
    queryFn: fetchImagePage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!userId && !!modelConfigs,
  });

  return {
    images: data?.pages.flatMap(page => page.images) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  };
};