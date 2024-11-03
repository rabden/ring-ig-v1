import { useMemo } from 'react';

export const useImageFilter = () => {
  const filterImages = useMemo(() => (images, {
    userId,
    activeView,
    nsfwEnabled,
    modelConfigs,
    activeFilters,
    searchQuery
  }) => {
    let filteredData = images.filter(img => {
      const isNsfw = modelConfigs?.[img.model]?.category === "NSFW";
      
      // Filter by user and NSFW status
      if (activeView === 'myImages') {
        if (nsfwEnabled) {
          if (!(img.user_id === userId && isNsfw)) return false;
        } else {
          if (!(img.user_id === userId && !isNsfw)) return false;
        }
      } else if (activeView === 'inspiration') {
        if (nsfwEnabled) {
          if (!(img.user_id !== userId && isNsfw)) return false;
        } else {
          if (!(img.user_id !== userId && !isNsfw)) return false;
        }
      }

      // Filter by style and model
      if (activeFilters.style && img.style !== activeFilters.style) return false;
      if (activeFilters.model && img.model !== activeFilters.model) return false;

      // Filter by hot and trending
      if (activeFilters.hot && !img.is_hot) return false;
      if (activeFilters.trending && !img.is_trending) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const prompt = img.prompt?.toLowerCase() || '';
        if (!prompt.includes(query)) return false;
      }

      return true;
    });

    return filteredData;
  }, []);

  return { filterImages };
};