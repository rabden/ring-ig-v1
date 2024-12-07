import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';

const BATCH_SIZE = 20;

export const useGalleryImages = ({ 
  userId = null, 
  activeView = 'latest',
  nsfwEnabled = false,
  activeFilters = {},
  searchQuery = '',
  showPrivate = false
}) => {
  const fetchImages = async ({ pageParam = 0 }) => {
    let query = supabase
      .from('user_images')
      .select('*', { count: 'exact' });

    // Filter by view type
    switch (activeView) {
      case 'my':
        query = query.eq('user_id', userId);
        break;
      case 'liked':
        const { data: likedImages } = await supabase
          .from('user_image_likes')
          .select('image_id')
          .eq('user_id', userId);
        const likedImageIds = likedImages?.map(like => like.image_id) || [];
        query = query.in('id', likedImageIds);
        break;
      case 'trending':
        query = query.eq('is_trending', true);
        break;
      case 'hot':
        query = query.eq('is_hot', true);
        break;
      default:
        break;
    }

    // Apply NSFW filter
    if (!nsfwEnabled) {
      query = query.not('model', 'in', '(nsfw_model_1,nsfw_model_2)');
    }

    // Apply privacy filter
    if (activeView !== 'my') {
      query = query.eq('is_private', false);
    } else if (showPrivate) {
      query = query.eq('is_private', true);
    }

    // Apply model filter
    if (activeFilters.model) {
      query = query.eq('model', activeFilters.model);
    }

    // Apply search query
    if (searchQuery) {
      query = query.ilike('prompt', `%${searchQuery}%`);
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(pageParam * BATCH_SIZE, (pageParam + 1) * BATCH_SIZE - 1);

    const { data: images, error, count } = await query;

    if (error) throw error;

    return {
      images,
      nextPage: images.length === BATCH_SIZE ? pageParam + 1 : undefined,
      totalCount: count
    };
  };

  return useInfiniteQuery({
    queryKey: ['galleryImages', userId, activeView, nsfwEnabled, activeFilters, searchQuery, showPrivate],
    queryFn: fetchImages,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};