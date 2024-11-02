import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useStyleConfigs } from '@/hooks/useStyleConfigs';
import { useRemixImage } from '@/hooks/useRemixImage';
import { useRemixEffect } from '@/hooks/useRemixEffect';
import { toast } from 'sonner';
import ImageGeneratorContent from '@/components/image-generator/ImageGeneratorContent';
import BottomNavbar from '@/components/BottomNavbar';
import ImageDetailsDialog from '@/components/ImageDetailsDialog';
import FullScreenImageView from '@/components/FullScreenImageView';
import MobileGeneratingStatus from '@/components/MobileGeneratingStatus';
import MobileNotificationsMenu from '@/components/MobileNotificationsMenu';
import MobileProfileMenu from '@/components/MobileProfileMenu';

const ImageGenerator = () => {
  const { imageId } = useParams();
  const location = useLocation();
  const isRemixRoute = location.pathname.startsWith('/remix/');
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const isHeaderVisible = useScrollDirection();
  const { session } = useSupabaseAuth();
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);
  const { data: isPro } = useProUser(session?.user?.id);
  const { data: modelConfigs } = useModelConfigs();
  const { data: styleConfigs } = useStyleConfigs();
  const queryClient = useQueryClient();

  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, activeTab, setActiveTab, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage, detailsDialogOpen, setDetailsDialogOpen,
    fullScreenViewOpen, setFullScreenViewOpen, fullScreenImageIndex, setFullScreenImageIndex,
    generatingImages, setGeneratingImages, activeView, setActiveView,
    nsfwEnabled, setNsfwEnabled, style, setStyle
  } = useImageGeneratorState();

  const { data: remixImage } = useRemixImage(imageId, isRemixRoute);

  const { generateImage } = useImageGeneration({
    session, prompt, seed, randomizeSeed, width, height, model,
    quality, useAspectRatio, aspectRatio, updateCredits,
    setGeneratingImages, style, modelConfigs, steps
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
    await generateImage();
  };

  const {
    handleImageClick, handleModelChange, handlePromptKeyDown,
    handleRemix, handleDownload, handleDiscard, handleViewDetails
  } = useImageHandlers({
    generateImage: handleGenerateImage,
    setSelectedImage, setFullScreenViewOpen, setModel, setSteps,
    setPrompt, setSeed, setRandomizeSeed, setWidth, setHeight,
    setQuality, setAspectRatio, setUseAspectRatio, setStyle,
    session, queryClient, activeView, setDetailsDialogOpen, setActiveTab
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

  useRemixEffect({
    remixImage,
    isRemixRoute,
    isPro,
    modelConfigs,
    styleConfigs,
    setPrompt,
    setSeed,
    setRandomizeSeed,
    setWidth,
    setHeight,
    setModel,
    setQuality,
    setStyle,
    setAspectRatio,
    setUseAspectRatio,
    setSteps
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <ImageGeneratorContent
        session={session}
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
        generatingImages={generatingImages}
        activeFilters={activeFilters}
        handleFilterChange={handleFilterChange}
        handleRemoveFilter={handleRemoveFilter}
        handleSearch={handleSearch}
        isHeaderVisible={isHeaderVisible}
        nsfwEnabled={nsfwEnabled}
        activeTab={activeTab}
        handleImageClick={handleImageClick}
        handleDownload={handleDownload}
        handleDiscard={handleDiscard}
        handleRemix={handleRemix}
        handleViewDetails={handleViewDetails}
        modelConfigs={modelConfigs}
        searchQuery={searchQuery}
        prompt={prompt}
        setPrompt={setPrompt}
        handlePromptKeyDown={handlePromptKeyDown}
        generateImage={handleGenerateImage}
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
        style={style}
        setStyle={setStyle}
        steps={steps}
        setSteps={setSteps}
        proMode={isPro}
      />

      <MobileNotificationsMenu activeTab={activeTab} />
      <MobileProfileMenu 
        user={session?.user}
        credits={credits}
        bonusCredits={bonusCredits}
        activeTab={activeTab}
      />

      <BottomNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        session={session} 
        credits={credits}
        bonusCredits={bonusCredits}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        image={selectedImage}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onDownload={handleDownload}
        onDiscard={handleDiscard}
        onRemix={handleRemix}
        isOwner={selectedImage?.user_id === session?.user?.id}
      />
      {generatingImages.length > 0 && (
        <MobileGeneratingStatus generatingImages={generatingImages} />
      )}
    </div>
  );
};

export default ImageGenerator;