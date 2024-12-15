import { useQuery, useQueryClient } from '@tanstack/react-query';

const GENERATION_STATUS_KEY = 'generationStatus';

export const useGenerationStatus = () => {
  const queryClient = useQueryClient();

  const { data: generatingImages = [] } = useQuery({
    queryKey: [GENERATION_STATUS_KEY],
    queryFn: () => [], // Initial empty array
    initialData: [],
    staleTime: Infinity, // Keep data fresh until explicitly invalidated
  });

  const setGeneratingImages = (updater) => {
    const newImages = typeof updater === 'function' 
      ? updater(generatingImages)
      : updater;
    
    queryClient.setQueryData([GENERATION_STATUS_KEY], newImages);
  };

  return {
    generatingImages,
    setGeneratingImages,
  };
};