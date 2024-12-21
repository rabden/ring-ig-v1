import { useState, useEffect } from 'react';
import { useModelConfigs } from './useModelConfigs';

export const useImageGeneratorState = () => {
  const { data: modelConfigs } = useModelConfigs();
  
  const [state, setState] = useState({
    prompt: '',
    seed: 0,
    randomizeSeed: true,
    width: 1024,
    height: 1024,
    model: 'turbo',
    activeTab: 'images',
    aspectRatio: '1:1',
    useAspectRatio: true,
    quality: 'HD',
    modelSidebarOpen: false,
    selectedImage: null,
    detailsDialogOpen: false,
    fullScreenViewOpen: false,
    fullScreenImageIndex: 0,
    generationQueue: [],
    currentGeneration: null,
    completedGenerations: [],
    activeView: 'myImages',
    nsfwEnabled: false,
    style: null,
    imageCount: 1,
    isPrivate: false
  });

  useEffect(() => {
    const processQueue = () => {
      if (state.currentGeneration === null && state.generationQueue.length > 0) {
        const nextGeneration = state.generationQueue[0];
        setState(prev => ({
          ...prev,
          currentGeneration: nextGeneration,
          generationQueue: prev.generationQueue.slice(1)
        }));
      }
    };

    processQueue();
  }, [state.currentGeneration, state.generationQueue]);

  const addToGenerationQueue = (generations) => {
    setState(prev => ({
      ...prev,
      generationQueue: [...prev.generationQueue, ...generations]
    }));
  };

  const completeCurrentGeneration = (completedGeneration) => {
    setState(prev => ({
      ...prev,
      currentGeneration: null,
      completedGenerations: [...prev.completedGenerations, completedGeneration]
    }));
  };

  const clearCompletedGenerations = () => {
    setState(prev => ({
      ...prev,
      completedGenerations: []
    }));
  };

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
    setActiveView: (value) => setState(prev => ({ ...prev, activeView: value })),
    setNsfwEnabled: (value) => setState(prev => ({ ...prev, nsfwEnabled: value })),
    setStyle: (value) => setState(prev => ({ ...prev, style: value })),
    setImageCount: (value) => setState(prev => ({ ...prev, imageCount: value })),
    setIsPrivate: (value) => setState(prev => ({ ...prev, isPrivate: value })),
    addToGenerationQueue,
    completeCurrentGeneration,
    clearCompletedGenerations
  };

  return {
    ...state,
    ...setters,
    allGenerations: [
      ...(state.currentGeneration ? [{ ...state.currentGeneration, status: 'generating' }] : []),
      ...state.generationQueue.map(gen => ({ ...gen, status: 'pending' })),
      ...state.completedGenerations.map(gen => ({ ...gen, status: 'completed' }))
    ]
  };
};