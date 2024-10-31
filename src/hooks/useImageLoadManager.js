import { useState, useCallback } from 'react';

export const useImageLoadManager = (maxTotalSize = 5) => {
  const [loadedImages, setLoadedImages] = useState(new Map());
  const [totalSize, setTotalSize] = useState(0);

  const handleImageLoad = useCallback(async (imageId, size) => {
    return new Promise((resolve) => {
      setLoadedImages(prev => {
        const newMap = new Map(prev);
        newMap.set(imageId, {
          size,
          timestamp: Date.now()
        });
        return newMap;
      });

      setTotalSize(prev => {
        const newTotal = prev + size;
        if (newTotal > maxTotalSize) {
          const images = Array.from(loadedImages.entries());
          images.sort((a, b) => a[1].timestamp - b[1].timestamp);

          let currentSize = newTotal;
          const unloadedImages = new Set();

          for (const [imgId, { size: imgSize }] of images) {
            if (currentSize <= maxTotalSize) break;
            unloadedImages.add(imgId);
            currentSize -= imgSize;
            setLoadedImages(prev => {
              const newMap = new Map(prev);
              newMap.delete(imgId);
              return newMap;
            });
          }

          resolve(unloadedImages);
          return currentSize;
        }
        resolve(new Set());
        return newTotal;
      });
    });
  }, [loadedImages, maxTotalSize]);

  return {
    handleImageLoad,
    isImageLoaded: useCallback((imageId) => loadedImages.has(imageId), [loadedImages])
  };
};