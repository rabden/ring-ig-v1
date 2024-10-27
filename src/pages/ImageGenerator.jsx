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
import { Button } from '@/components/ui/button'
import { Settings2 } from 'lucide-react'

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
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
          {session && (
            <>
              <div className="hidden md:block">
                <ProfileMenu user={session.user} credits={credits} />
              </div>
              <div className="flex items-center gap-2">
                <div className="block md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setActiveTab('input')}>
                    <Settings2 size={20} />
                  </Button>
                </div>
                <ActionButtons activeView={activeView} setActiveView={setActiveView} />
              </div>
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} session={session} credits={credits} />
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