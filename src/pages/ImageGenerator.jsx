import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const remixId = searchParams.get('remix');
  const { session } = useSupabaseAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [negativePrompt, setNegativePrompt] = useState("");

  const {
    isImproving,
    improveCurrentPrompt
  } = usePromptImprovement(session?.user?.id);

  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const isHeaderVisible = useScrollDirection();
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);
  const { data: isPro } = useProUser(session?.user?.id);
  const { data: modelConfigs } = useModelConfigs();
  const queryClient = useQueryClient();

  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight,
    model, setModel, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex, generatingImages, setGeneratingImages,
    activeView, setActiveView, nsfwEnabled, setNsfwEnabled,
    imageCount, setImageCount
  } = useImageGeneratorState();

  // Query for remix image if remixId is present
  const { data: remixImage, isLoading: isRemixLoading } = useQuery({
    queryKey: ['remixImage', remixId],
    queryFn: async () => {
      if (!remixId) return null;
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .eq('id', remixId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!remixId,
  });

  // Apply remix settings when remixImage is loaded
  useEffect(() => {
    if (remixImage) {
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
      // Switch to input tab when remixing
      setActiveTab('input');
      // Clear the remix parameter from URL without page reload
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('remix');
      window.history.replaceState({}, '', `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`);
    }
  }, [remixImage]);

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
    imageCount,
    negativePrompt
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
        const improved = await improveCurrentPrompt(prompt, model, modelConfigs);
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
    setWidth,
    setHeight,
    setPrompt,
    setSeed,
    setRandomizeSeed,
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

  // Sync activeTab with URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#imagegenerate') {
      setActiveTab('input');
    } else if (hash === '#notifications') {
      setActiveTab('notifications');
    } else {
      setActiveTab('images');
    }
  }, [window.location.hash]);

  if (isRemixLoading) {
    return <div>Loading remix...</div>;
  }

  return (
    <ImageGeneratorContent
      user={session?.user}
      credits={credits}
      bonusCredits={bonusCredits}
      isPro={isPro}
      isGenerating={isGenerating}
      setIsGenerating={setIsGenerating}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      prompt={prompt}
      setPrompt={setPrompt}
      negativePrompt={negativePrompt}
      setNegativePrompt={setNegativePrompt}
      seed={seed}
      setSeed={setSeed}
      randomizeSeed={randomizeSeed}
      setRandomizeSeed={setRandomizeSeed}
      width={width}
      setWidth={setWidth}
      height={height}
      setHeight={setHeight}
      model={model}
      setModel={setModel}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      useAspectRatio={useAspectRatio}
      setUseAspectRatio={setUseAspectRatio}
      quality={quality}
      setQuality={setQuality}
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      detailsDialogOpen={detailsDialogOpen}
      setDetailsDialogOpen={setDetailsDialogOpen}
      fullScreenViewOpen={fullScreenViewOpen}
      setFullScreenViewOpen={setFullScreenViewOpen}
      fullScreenImageIndex={fullScreenImageIndex}
      setFullScreenImageIndex={setFullScreenImageIndex}
      generatingImages={generatingImages}
      setGeneratingImages={setGeneratingImages}
      activeView={activeView}
      setActiveView={setActiveView}
      nsfwEnabled={nsfwEnabled}
      setNsfwEnabled={setNsfwEnabled}
      imageCount={imageCount}
      setImageCount={setImageCount}
      remixImage={remixImage}
      isRemixLoading={isRemixLoading}
      isImproving={isImproving}
      improveCurrentPrompt={improveCurrentPrompt}
      modelConfigs={modelConfigs}
      updateCredits={updateCredits}
    />
  );
};

export default ImageGenerator;