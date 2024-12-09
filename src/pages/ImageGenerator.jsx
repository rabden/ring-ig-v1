import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { usePromptImprovement } from '@/hooks/usePromptImprovement';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import ImageGeneratorContent from '@/components/ImageGeneratorContent';

const ImageGenerator = () => {
  const { imageId } = useParams();
  const location = useLocation();
  const isRemixRoute = location.pathname.startsWith('/remix/');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('images');

  const {
    isImproving,
    setIsImproving,
    improvedPrompt,
    setImprovedPrompt,
    improveCurrentPrompt
  } = usePromptImprovement();

  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const isHeaderVisible = useScrollDirection();
  const { session } = useSupabaseAuth();
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);
  const { data: isPro } = useProUser(session?.user?.id);
  const { data: modelConfigs } = useModelConfigs();
  const queryClient = useQueryClient();

  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex, generatingImages, setGeneratingImages,
    activeView, setActiveView, nsfwEnabled, setNsfwEnabled,
    imageCount, setImageCount
  } = useImageGeneratorState();

  const [showPrivate, setShowPrivate] = useState(false);

  const { generateImage } = useImageGeneration({
    session,
    prompt,
    seed,
    randomizeSeed,
    width,
    height,
    model,
    quality,
    useAspectRatio,
    aspectRatio,
    updateCredits,
    setGeneratingImages,
    modelConfigs,
    steps,
    imageCount
  });

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    if (!session) {
      toast.error('Please sign in to generate images');
      return;
    }

    setIsGenerating(true);
    try {
      let finalPrompt = prompt;
      
      if (isImproving) {
        const improved = await improveCurrentPrompt(prompt);
        if (!improved) {
          setIsGenerating(false);
          return;
        }
        finalPrompt = improved;
        setPrompt(improved);
      }

      await generateImage(isPrivate, finalPrompt);
    } catch (error) {
      toast.error('Failed to generate image');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const {
    handleImageClick,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  } = useImageHandlers({
    generateImage: handleGenerateImage,
    setSelectedImage,
    setFullScreenViewOpen,
    setModel,
    setSteps,
    setPrompt,
    setSeed,
    setRandomizeSeed,
    setWidth,
    setHeight,
    setQuality,
    setAspectRatio,
    setUseAspectRatio,
    aspectRatios: [],
    session,
    queryClient,
    activeView,
    setDetailsDialogOpen,
    setActiveView,
  });

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => ({ ...prev, [type]: value }));
  };

  const handleRemoveFilter = (type) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[type];
      return newFilters;
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const { data: remixImage } = useQuery({
    queryKey: ['remixImage', imageId],
    queryFn: async () => {
      if (!imageId) return null;
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', imageId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!imageId && isRemixRoute,
  });

  useEffect(() => {
    if (remixImage && isRemixRoute) {
      setPrompt(remixImage.prompt);
      setSeed(remixImage.seed);
      setRandomizeSeed(false);
      setWidth(remixImage.width);
      setHeight(remixImage.height);
      setModel(remixImage.model);
      setQuality(remixImage.quality);
      if (remixImage.aspect_ratio) {
        setAspectRatio(remixImage.aspect_ratio);
        setUseAspectRatio(true);
      }
    }
  }, [remixImage, isRemixRoute]);

  useEffect(() => {
    const storedImage = sessionStorage.getItem('pendingRemixImage');
    if (storedImage) {
      try {
        const remixImage = JSON.parse(storedImage);
        setPrompt(remixImage.prompt);
        setSeed(remixImage.seed);
        setRandomizeSeed(false);
        setWidth(remixImage.width);
        setHeight(remixImage.height);
        setModel(remixImage.model);
        setQuality(remixImage.quality);
        if (remixImage.aspect_ratio) {
          setAspectRatio(remixImage.aspect_ratio);
          setUseAspectRatio(true);
        }
        setActiveTab('input');
        // Clear the stored data
        sessionStorage.removeItem('pendingRemixImage');
      } catch (error) {
        console.error('Error handling remix data:', error);
        toast.error('Failed to load remix data');
      }
    }
  }, []);

  useEffect(() => {
    setActiveTab('images');
  }, []);

  return (
    <div className="relative">
      <ImageGeneratorContent
        session={session}
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        generatingImages={generatingImages}
        nsfwEnabled={nsfwEnabled}
        showPrivate={showPrivate}
        setShowPrivate={setShowPrivate}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onRemoveFilter={handleRemoveFilter}
        onSearch={handleSearch}
        isHeaderVisible={isHeaderVisible}
        handleImageClick={handleImageClick}
        handleDownload={handleDownload}
        handleDiscard={handleDiscard}
        handleRemix={handleRemix}
        handleViewDetails={handleViewDetails}
        selectedImage={selectedImage}
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        fullScreenViewOpen={fullScreenViewOpen}
        setFullScreenViewOpen={setFullScreenViewOpen}
        imageGeneratorProps={{
          prompt,
          setPrompt,
          handlePromptKeyDown,
          generateImage: handleGenerateImage,
          model,
          setModel: handleModelChange,
          seed,
          setSeed,
          randomizeSeed,
          setRandomizeSeed,
          quality,
          setQuality,
          useAspectRatio,
          setUseAspectRatio,
          aspectRatio,
          setAspectRatio,
          width,
          setWidth,
          height,
          setHeight,
          session,
          credits,
          bonusCredits,
          nsfwEnabled,
          setNsfwEnabled,
          steps,
          setSteps,
          proMode: isPro,
          modelConfigs,
          imageCount,
          setImageCount,
          isPrivate,
          setIsPrivate,
          isImproving,
          setIsImproving,
          searchQuery,
        }}
      />
    </div>
  );
};

export default ImageGenerator;