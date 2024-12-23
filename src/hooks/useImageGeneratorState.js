import { useState, useEffect, useCallback } from 'react';
import { useModelConfigs } from './useModelConfigs';

const STORAGE_KEY = 'imageGeneratorState';

export const useImageGeneratorState = () => {
  const { data: modelConfigs } = useModelConfigs();
  
  // Load initial state from localStorage or use default values
  const getInitialState = () => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Get generating images from separate storage
        const generatingImages = JSON.parse(localStorage.getItem('generatingImages') || '[]');
        
        // Clean up any stale processing states on load
        const cleanedImages = generatingImages.map(img => ({
          ...img,
          // Reset processing status to pending if it was left in processing state
          status: img.status === 'processing' ? 'pending' : img.status
        }));

        return {
          ...parsedState,
          generatingImages: cleanedImages
        };
      } catch (error) {
        console.error('Error parsing saved state:', error);
        return getDefaultState();
      }
    }
    return getDefaultState();
  };

  const getDefaultState = () => ({
    prompt: '',
    seed: 0,
    randomizeSeed: true,
    width: 1024,
    height: 1024,
    model: 'flux',
    activeTab: 'images',
    aspectRatio: '1:1',
    useAspectRatio: true,
    quality: 'HD',
    modelSidebarOpen: false,
    selectedImage: null,
    detailsDialogOpen: false,
    fullScreenViewOpen: false,
    fullScreenImageIndex: 0,
    generatingImages: [],
    activeView: 'myImages',
    nsfwEnabled: false,
    style: null,
    imageCount: 1,
    isPrivate: false
  });

  const [state, setState] = useState(getInitialState);

  // Handle generating images state updates
  const setGeneratingImages = useCallback((updater) => {
    setState(prev => {
      const newImages = typeof updater === 'function' 
        ? updater(prev.generatingImages)
        : updater;

      // Save to separate storage
      localStorage.setItem('generatingImages', JSON.stringify(newImages));

      return {
        ...prev,
        generatingImages: newImages
      };
    });
  }, []);

  // Save state changes to localStorage
  useEffect(() => {
    const stateToSave = {
      ...state,
      generatingImages: undefined // Don't save generating images in main state
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);

  // Validate model and quality compatibility
  useEffect(() => {
    if (modelConfigs && state.model) {
      const modelConfig = modelConfigs[state.model];
      if (modelConfig?.qualityLimits && !modelConfig.qualityLimits.includes(state.quality)) {
        setState(prev => ({ ...prev, quality: 'HD' }));
      }
    }
  }, [modelConfigs]);

  // Create setters for each state property
  const setters = {
    setPrompt: (value) => setState(prev => ({ ...prev, prompt: value })),
    setSeed: (value) => setState(prev => ({ ...prev, seed: value })),
    setRandomizeSeed: (value) => setState(prev => ({ ...prev, randomizeSeed: value })),
    setWidth: (value) => setState(prev => ({ ...prev, width: value })),
    setHeight: (value) => setState(prev => ({ ...prev, height: value })),
    setModel: (value) => setState(prev => ({ ...prev, model: value })),
    setActiveTab: (value) => setState(prev => ({ ...prev, activeTab: value })),
    setAspectRatio: (value) => setState(prev => ({ ...prev, aspectRatio: value })),
    setUseAspectRatio: (value) => setState(prev => ({ ...prev, useAspectRatio: value })),
    setQuality: (value) => setState(prev => ({ ...prev, quality: value })),
    setModelSidebarOpen: (value) => setState(prev => ({ ...prev, modelSidebarOpen: value })),
    setSelectedImage: (value) => setState(prev => ({ ...prev, selectedImage: value })),
    setDetailsDialogOpen: (value) => setState(prev => ({ ...prev, detailsDialogOpen: value })),
    setFullScreenViewOpen: (value) => setState(prev => ({ ...prev, fullScreenViewOpen: value })),
    setFullScreenImageIndex: (value) => setState(prev => ({ ...prev, fullScreenImageIndex: value })),
    setGeneratingImages,
    setActiveView: (value) => setState(prev => ({ ...prev, activeView: value })),
    setNsfwEnabled: (value) => setState(prev => ({ ...prev, nsfwEnabled: value })),
    setStyle: (value) => setState(prev => ({ ...prev, style: value })),
    setImageCount: (value) => setState(prev => ({ ...prev, imageCount: value })),
    setIsPrivate: (value) => setState(prev => ({ ...prev, isPrivate: value }))
  };

  // Helper functions for queue management
  const getQueueState = useCallback(() => {
    const images = state.generatingImages;
    return {
      hasProcessing: images.some(img => img.status === 'processing'),
      pendingCount: images.filter(img => img.status === 'pending').length,
      processingCount: images.filter(img => img.status === 'processing').length,
      completedCount: images.filter(img => img.status === 'completed').length,
      failedCount: images.filter(img => img.status === 'failed').length,
      nextPending: images.find(img => img.status === 'pending'),
      isAllCompleted: images.length > 0 && images.every(img => img.status === 'completed')
    };
  }, [state.generatingImages]);

  return {
    ...state,
    ...setters,
    queueState: getQueueState()
  };
};