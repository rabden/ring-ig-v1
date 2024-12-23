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
        return {
          ...parsedState,
          generatingImages: JSON.parse(localStorage.getItem('generatingImages') || '[]')
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

  const setGeneratingImages = useCallback((images) => {
    if (typeof images === 'function') {
      setState(prev => ({
        ...prev,
        generatingImages: images(prev.generatingImages)
      }));
    } else {
      setState(prev => ({
        ...prev,
        generatingImages: images
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...state,
      generatingImages: undefined // Don't save generating images in the main state
    }));
  }, [state]);

  useEffect(() => {
    localStorage.setItem('generatingImages', JSON.stringify(state.generatingImages));
  }, [state.generatingImages]);

  // Validate model and quality compatibility whenever modelConfigs changes
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

  return {
    ...state,
    ...setters
  };
};