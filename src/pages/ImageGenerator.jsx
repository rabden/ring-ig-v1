import React, { useState } from 'react'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { useQueryClient } from '@tanstack/react-query'
import AuthOverlay from '@/components/AuthOverlay'
import BottomNavbar from '@/components/BottomNavbar'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ImageGallery from '@/components/ImageGallery'
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import ProfileMenu from '@/components/ProfileMenu'
import ActionButtons from '@/components/ActionButtons'
import FilterMenu from '@/components/filters/FilterMenu'
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState'
import { useImageHandlers } from '@/hooks/useImageHandlers'
import { aspectRatios } from '@/utils/imageConfigs'
import { useModelConfigs } from '@/hooks/useModelConfigs'
import MobileGeneratingStatus from '@/components/MobileGeneratingStatus'
import { useProUser } from '@/hooks/useProUser'
import SearchBar from '@/components/search/SearchBar'

const ImageGenerator = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: modelConfigs } = useModelConfigs();
  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, activeTab, setActiveTab, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex, generatingImages, setGeneratingImages,
    activeView, setActiveView, nsfwEnabled, setNsfwEnabled
  } = useImageGeneratorState()

  const { session } = useSupabaseAuth()
  const { credits, bonusCredits, updateCredits } = useUserCredits(session?.user?.id)
  const { data: isPro } = useProUser(session?.user?.id);
  const queryClient = useQueryClient()

  const [style, setStyle] = useState('general')

  const { generateImage } = useImageGeneration({
    session: { ...session, credits, bonusCredits },
    prompt,
    seed,
    randomizeSeed,
    width,
    height,
    steps,
    model,
    quality,
    useAspectRatio,
    aspectRatio,
    updateCredits,
    setGeneratingImages,
    style,
    modelConfigs
  })

  const {
    handleGenerateImage,
    handleImageClick,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  } = useImageHandlers({
    generateImage,
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
    aspectRatios,
    session,
    queryClient,
    activeView,
    setDetailsDialogOpen,
    setActiveView,
  })

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        {session && (
          <div className="hidden md:block fixed top-0 left-0 right-[350px] bg-background z-10 px-6 py-4">
            <div className="flex justify-between items-center max-w-full">
              <div className="flex items-center gap-4">
                <ProfileMenu 
                  user={session.user} 
                  credits={credits} 
                  bonusCredits={bonusCredits}
                />
                <ActionButtons 
                  activeView={activeView} 
                  setActiveView={setActiveView} 
                  generatingImages={generatingImages}
                />
                <FilterMenu
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onRemoveFilter={handleRemoveFilter}
                />
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile Header */}
        {session && (
          <div className="md:hidden fixed top-0 left-0 right-0 bg-background z-10 px-4 py-2">
            <div className="flex items-center justify-end gap-2 overflow-x-hidden">
              <div className="flex items-center gap-2 flex-nowrap">
                <FilterMenu
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onRemoveFilter={handleRemoveFilter}
                />
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        )}

        <div className="md:mt-16 mt-12">
          <ImageGallery
            userId={session?.user?.id}
            onImageClick={handleImageClick}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            onRemix={handleRemix}
            onViewDetails={handleViewDetails}
            activeView={activeView}
            generatingImages={generatingImages}
            nsfwEnabled={nsfwEnabled}
            modelConfigs={modelConfigs}
            activeFilters={activeFilters}
            searchQuery={searchQuery}
          />
        </div>
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-4 md:p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!session && (
          <div className="absolute inset-0 z-10">
            <AuthOverlay />
          </div>
        )}
        <ImageGeneratorSettings
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
          session={session}
          credits={credits}
          bonusCredits={bonusCredits}
          nsfwEnabled={nsfwEnabled}
          setNsfwEnabled={setNsfwEnabled}
          style={style}
          setStyle={setStyle}
          steps={steps}
          setSteps={setSteps}
          proMode={isPro}
          modelConfigs={modelConfigs}
        />
      </div>
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
