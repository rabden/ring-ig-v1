import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const GENERATION_CACHE_KEY = 'imageGenerations';

export const usePersistentImageGeneration = (userId) => {
  const queryClient = useQueryClient();

  // Get current generating images from cache
  const { data: generatingImages = [] } = useQuery({
    queryKey: [GENERATION_CACHE_KEY, userId],
    // Initialize with empty array if no cached data
    initialData: [],
    // Keep cache for 1 hour
    staleTime: 1000 * 60 * 60,
    // Don't refetch on window focus since we manage updates manually
    refetchOnWindowFocus: false
  });

  // Update generating images in cache
  const setGeneratingImages = (newImages) => {
    queryClient.setQueryData(
      [GENERATION_CACHE_KEY, userId],
      Array.isArray(newImages) ? newImages : typeof newImages === 'function' ? newImages(generatingImages) : []
    );
  };

  // Handle tab/browser closure
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (generatingImages.length > 0) {
        // Use sendBeacon to ensure the request completes even if page closes
        navigator.sendBeacon(
          '/api/track-incomplete-generations',
          JSON.stringify({
            userId,
            generations: generatingImages
          })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [generatingImages, userId]);

  return {
    generatingImages,
    setGeneratingImages
  };
};
