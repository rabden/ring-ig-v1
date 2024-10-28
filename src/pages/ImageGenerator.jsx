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
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState'
import { useImageHandlers } from '@/hooks/useImageHandlers'
import { aspectRatios } from '@/utils/imageConfigs'
import { styleConfigs } from '@/utils/styleConfigs'

const ImageGenerator = () => {
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
  const { credits, updateCredits } = useUserCredits(session?.user?.id)
  const queryClient = useQueryClient()

  const [style, setStyle] = useState('general')

  const { generateImage } = useImageGeneration({
    session,
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
    style
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
    setActiveTab,
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-2 md:p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          {session && (
            <>
              <div className="hidden md:block">
                <ProfileMenu user={session.user} credits={credits} />
              </div>
              <ActionButtons activeView={activeView} setActiveView={setActiveView} />
            </>
          )}
        </div>
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
        />
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
          setModel={setModel}
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
          nsfwEnabled={nsfwEnabled}
          setNsfwEnabled={setNsfwEnabled}
          style={style}
          setStyle={setStyle}
        />
      </div>
      <BottomNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        session={session} 
        credits={credits}
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
      />
    </div>
  )
}

export default ImageGenerator
