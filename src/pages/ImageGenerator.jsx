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
import { cn } from '@/lib/utils';
import ImageGeneratorContent from '@/components/ImageGeneratorContent';
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings';

const ImageGenerator = () => {
  const [searchParams] = useSearchParams();
  const remixId = searchParams.get('remix');
  const { session } = useSupabaseAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('images');
  const [isPromptBoxVisible, setIsPromptBoxVisible] = useState(true);

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
    <div className="relative min-h-screen">
      <div className="flex flex-col md:flex-row">
        {/* Main content */}
        <div className="flex-1">
          <ImageGeneratorContent
            session={session}
            credits={credits}
            bonusCredits={bonusCredits}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            generatingImages={generatingImages}
            nsfwEnabled={nsfwEnabled}
            setNsfwEnabled={setNsfwEnabled}
            showPrivate={false}
            setShowPrivate={() => {}}
            activeFilters={activeFilters}
            onFilterChange={(type, value) => setActiveFilters(prev => ({ ...prev, [type]: value }))}
            onRemoveFilter={(type) => {
              const newFilters = { ...activeFilters };
              delete newFilters[type];
              setActiveFilters(newFilters);
            }}
            onSearch={setSearchQuery}
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
            proMode={isPro}
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
              steps,
              setSteps,
              imageCount,
              setImageCount,
              isPrivate,
              setIsPrivate,
              isGenerating,
              updateCredits,
              modelConfigs,
              proMode: isPro,
              session
            }}
            onPromptBoxVisibilityChange={setIsPromptBoxVisible}
          />
        </div>

        {/* Settings sidebar - hide when prompt box is not visible */}
        <div className={cn(
          "hidden lg:block w-[300px] border-l border-border/50 bg-card",
          !isPromptBoxVisible && "hidden lg:hidden"
        )}>
          <ImageGeneratorSettings
            prompt={prompt}
            setPrompt={setPrompt}
            model={model}
            setModel={handleModelChange}
            seed={seed}
            setSeed={setSeed}
            randomizeSeed={randomizeSeed}
            setRandomizeSeed={setRandomizeSeed}
            quality={quality}
            setQuality={setQuality}
            useAspectRatio={useAspectRatio}
            setUseAspectRatio={setUseAspectRatio}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            width={width}
            setWidth={setWidth}
            height={height}
            setHeight={setHeight}
            steps={steps}
            setSteps={setSteps}
            imageCount={imageCount}
            setImageCount={setImageCount}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            isGenerating={isGenerating}
            updateCredits={updateCredits}
            modelConfigs={modelConfigs}
            proMode={isPro}
            session={session}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;