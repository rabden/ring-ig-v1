import { useMemo } from 'react';

export const useImageFilter = () => {
  const filterImages = useMemo(() => (images, {
    userId,
    activeView,
    nsfwEnabled,
    modelConfigs,
    activeFilters,
    searchQuery,
    showPrivate
  }) => {
    let filteredData = images.filter(img => {
      const isNsfw = modelConfigs?.[img.model]?.category === "NSFW" || 
                    img.model === 'nsfwMaster' || 
                    img.model === 'animeNsfw';
      
      // Filter private images
      if (activeView === 'inspiration') {
        // Never show private images in inspiration
        if (img.is_private) return false;
        if (img.user_id === userId) return false;
        if (nsfwEnabled) {
          return isNsfw;
        }
        return !isNsfw;
      }
      
      // My Images view
      if (activeView === 'myImages') {
        if (img.user_id !== userId) return false;
        
        // Filter by privacy setting
        if (showPrivate) {
          // When private filter is on, show only private images
          return img.is_private;
        } else {
          // When private filter is off, show only non-private images
          return !img.is_private;
        }

        // NSFW filtering happens after privacy filtering
        if (nsfwEnabled) {
          return isNsfw;
        }
        return !isNsfw;
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

    // Sort inspiration images by hot and trending
    if (activeView === 'inspiration') {
      filteredData.sort((a, b) => {
        if (a.is_hot && a.is_trending && (!b.is_hot || !b.is_trending)) return -1;
        if (b.is_hot && b.is_trending && (!a.is_hot || !a.is_trending)) return 1;
        if (a.is_hot && !b.is_hot) return -1;
        if (b.is_hot && !a.is_hot) return 1;
        if (a.is_trending && !b.is_trending) return -1;
        if (b.is_trending && !a.is_trending) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    }

    return filteredData;
  }, []);

  return { filterImages };
};