import React, { useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState';
import { useProUser } from '@/hooks/useProUser';
import { useModelConfigs } from '@/hooks/useModelConfigs';
import { useImageActions } from '@/hooks/useImageActions';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Components
import ImageGallery from '@/components/ImageGallery';
import ImageDetailsDialog from '@/components/ImageDetailsDialog';
import FullScreenImageView from '@/components/FullScreenImageView';
import DesktopHeader from '@/components/header/DesktopHeader';
import MobileHeader from '@/components/header/MobileHeader';
import MobileNotificationsMenu from '@/components/MobileNotificationsMenu';
import MobileProfileMenu from '@/components/MobileProfileMenu';
import BottomNavbar from '@/components/BottomNavbar';
import ImageGeneratorPanel from '@/components/ImageGeneratorPanel';

const ImageGenerator = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const isHeaderVisible = useScrollDirection();
  const { session } = useSupabaseAuth();
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id);
  const { data: isPro } = useProUser(session?.user?.id);
  const { data: modelConfigs } = useModelConfigs();
  const [showPrivate, setShowPrivate] = useState(false);
  const queryClient = useQueryClient();

  const state = useImageGeneratorState();
  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, activeTab, setActiveTab, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    generatingImages, setGeneratingImages,
    activeView, setActiveView, nsfwEnabled, setNsfwEnabled, style, setStyle,
    imageCount, setImageCount
  } = state;

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
    style,
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
    await generateImage();
  };

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  const handleModelChange = (newModel) => {
    if ((newModel === 'turbo' || newModel === 'preLar') && quality === 'HD+') {
      setQuality('HD');
    }
    setModel(newModel);
    if (modelConfigs?.[newModel]?.category === "NSFW") {
      setStyle(null);
    }
  };

  const handleDiscard = async (image) => {
    try {
      await imageActions.handleDiscard(image);
      queryClient.invalidateQueries({ queryKey: ['userImages'] });
      setFullScreenViewOpen(false);
    } catch (error) {
      console.error('Error discarding image:', error);
      toast.error('Failed to discard image');
    }
  };

  const imageActions = useImageActions({
    setSelectedImage,
    setFullScreenViewOpen,
    setDetailsDialogOpen,
    session,
    queryClient,
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

  const settings = {
    prompt, setPrompt,
    handlePromptKeyDown,
    generateImage: handleGenerateImage,
    model, setModel: handleModelChange,
    seed, setSeed,
    randomizeSeed, setRandomizeSeed,
    quality, setQuality,
    useAspectRatio, setUseAspectRatio,
    aspectRatio, setAspectRatio,
    width, setWidth,
    height, setHeight,
    session,
    credits,
    bonusCredits,
    nsfwEnabled, setNsfwEnabled,
    style, setStyle,
    steps, setSteps,
    proMode: isPro,
    modelConfigs,
    isPrivate, setIsPrivate,
    imageCount, setImageCount
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        {session && (
          <>
            <DesktopHeader
              user={session.user}
              credits={credits}
              bonusCredits={bonusCredits}
              activeView={activeView}
              setActiveView={setActiveView}
              generatingImages={generatingImages}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              nsfwEnabled={nsfwEnabled}
              showPrivate={showPrivate}
              onTogglePrivate={() => setShowPrivate(!showPrivate)}
            />
            <MobileHeader
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={handleRemoveFilter}
              onSearch={handleSearch}
              isVisible={isHeaderVisible}
              nsfwEnabled={nsfwEnabled}
              showPrivate={showPrivate}
              onTogglePrivate={() => setShowPrivate(!showPrivate)}
              activeView={activeView}
            />
          </>
        )}

        <div className="md:mt-16 mt-12">
          <ImageGallery
            userId={session?.user?.id}
            onImageClick={imageActions.handleImageClick}
            onDownload={imageActions.handleDownload}
            onDiscard={handleDiscard}
            onViewDetails={imageActions.handleViewDetails}
            activeView={activeView}
            generatingImages={generatingImages}
            nsfwEnabled={nsfwEnabled}
            modelConfigs={modelConfigs}
            activeFilters={activeFilters}
            searchQuery={searchQuery}
            setActiveTab={setActiveTab}
            setStyle={setStyle}
            showPrivate={showPrivate}
          />
        </div>
      </div>

      <ImageGeneratorPanel
        session={session}
        activeTab={activeTab}
        settings={settings}
        handlers={{
          handlePromptKeyDown,
          handleGenerateImage,
        }}
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
        generatingImages={generatingImages}
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
        onDownload={imageActions.handleDownload}
        onDiscard={handleDiscard}
        isOwner={selectedImage?.user_id === session?.user?.id}
        setStyle={setStyle}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default ImageGenerator;
