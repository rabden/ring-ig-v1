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

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const prompt = img.prompt?.toLowerCase() || '';
        if (!prompt.includes(query)) return false;
      }

      return true;
    });

    // Sort inspiration images by hot and trending status
    if (activeView === 'inspiration') {
      filteredData.sort((a, b) => {
        // Hot and trending images first
        if (a.is_hot && a.is_trending && (!b.is_hot || !b.is_trending)) return -1;
        if (b.is_hot && b.is_trending && (!a.is_hot || !a.is_trending)) return 1;
        
        // Then hot images
        if (a.is_hot && !b.is_hot) return -1;
        if (b.is_hot && !a.is_hot) return 1;
        
        // Then trending images
        if (a.is_trending && !b.is_trending) return -1;
        if (b.is_trending && !a.is_trending) return 1;
        
        // Finally sort by creation date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return filteredData;
  }, []);

  return { filterImages };
};