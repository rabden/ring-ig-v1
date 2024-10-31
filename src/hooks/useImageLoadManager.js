import { useState, useCallback } from 'react';

export const useImageLoadManager = (maxTotalSize = 5) => {
  const [loadedImages, setLoadedImages] = useState(new Map());
  const [totalSize, setTotalSize] = useState(0);

  const handleImageLoad = useCallback((imageId, size) => {
    setLoadedImages(prev => {
      const newMap = new Map(prev);
      newMap.set(imageId, {
        size,
        timestamp: Date.now()
      });
      return newMap;
    });
    setTotalSize(prev => prev + size);
  }, []);

  const unloadOldestImages = useCallback(() => {
    if (totalSize <= maxTotalSize) return new Set();

    const images = Array.from(loadedImages.entries());
    images.sort((a, b) => a[1].timestamp - b[1].timestamp);

    let currentSize = totalSize;
    const unloadedImages = new Set();

    for (const [imageId, { size }] of images) {
      if (currentSize <= maxTotalSize) break;
      unloadedImages.add(imageId);
      currentSize -= size;
      setLoadedImages(prev => {
        const newMap = new Map(prev);
        newMap.delete(imageId);
        return newMap;
      });
    }

    setTotalSize(currentSize);
    return unloadedImages;
  }, [loadedImages, totalSize, maxTotalSize]);

  return {
    handleImageLoad: useCallback((imageId, size) => {
      handleImageLoad(imageId, size);
      return unloadOldestImages();
    }, [handleImageLoad, unloadOldestImages]),
    isImageLoaded: useCallback((imageId) => !loadedImages.has(imageId), [loadedImages])
  };
};