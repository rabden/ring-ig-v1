import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBeforeUnload } from './useBeforeUnload';

const GENERATION_STATUS_KEY = 'generationStatus';

export const useGenerationStatus = () => {
  const queryClient = useQueryClient();

  const { data: generatingImages = [] } = useQuery({
    queryKey: [GENERATION_STATUS_KEY],
    queryFn: () => [], // Initial empty array
    initialData: [],
    staleTime: Infinity, // Keep data fresh until explicitly invalidated
  });

  // Add beforeunload handler
  useBeforeUnload(generatingImages);

  const setGeneratingImages = (updater) => {
    const newImages = typeof updater === 'function' 
      ? updater(generatingImages)
      : updater;
    
    queryClient.setQueryData([GENERATION_STATUS_KEY], newImages);

    // If there are no more generating images, clear the status
    if (newImages.length === 0) {
      queryClient.removeQueries({ queryKey: [GENERATION_STATUS_KEY] });
    }
  };

  return {
    generatingImages,
    setGeneratingImages,
  };
};