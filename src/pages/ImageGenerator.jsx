import React from 'react'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/supabase'
import AuthOverlay from '@/components/AuthOverlay'
import BottomNavbar from '@/components/BottomNavbar'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ImageGallery from '@/components/ImageGallery'
import ModelSidebarMenu from '@/components/ModelSidebarMenu'
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import ProfileMenu from '@/components/ProfileMenu'
import ActionButtons from '@/components/ActionButtons'
import { modelConfigs, aspectRatios, qualityOptions } from '@/utils/imageConfigs'
import { useImageGeneratorState } from '@/hooks/useImageGeneratorState'
import { useImageHandlers } from '@/hooks/useImageHandlers'

const ImageGenerator = () => {
  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps,
    model, setModel, activeTab, setActiveTab, aspectRatio, setAspectRatio,
    useAspectRatio, setUseAspectRatio, quality, setQuality,
    modelSidebarOpen, setModelSidebarOpen, selectedImage, setSelectedImage,
    detailsDialogOpen, setDetailsDialogOpen, fullScreenViewOpen, setFullScreenViewOpen,
    fullScreenImageIndex, setFullScreenImageIndex, isGeneratingImage, setIsGeneratingImage,
    activeView, setActiveView
  } = useImageGeneratorState()

  const { session } = useSupabaseAuth()
  const { credits, updateCredits } = useUserCredits(session?.user?.id)
  const queryClient = useQueryClient()

  const { data: images, isLoading } = useQuery({
    queryKey: ['images', session?.user?.id, activeView],
    queryFn: async () => {
      if (!session?.user?.id) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return activeView === 'myImages' 
        ? data.filter(img => img.user_id === session.user.id)
        : data.filter(img => img.user_id !== session.user.id)
    },
    enabled: !!session?.user?.id,
  })

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
    queryClient,
  })

  const {
    handleGenerateImage,
    handleImageClick,
    handleFullScreenNavigate,
    handleModelChange,
    handlePromptKeyDown,
    handleRemix,
    handleDownload,
    handleDiscard,
    handleViewDetails,
  } = useImageHandlers({
    setIsGeneratingImage,
    setActiveTab,
    generateImage,
    images,
    setSelectedImage,
    setFullScreenImageIndex,
    fullScreenImageIndex,  // Add this line
    setFullScreenViewOpen,
    modelConfigs,
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
    setDetailsDialogOpen,  // Add this line
  })

  const getGeneratingImageSize = () => {
    if (useAspectRatio) {
      const [w, h] = aspectRatio.split(':').map(Number)
      const maxDimension = qualityOptions[quality]
      return w > h
        ? { width: maxDimension, height: Math.round(maxDimension * (h / w)) }
        : { width: Math.round(maxDimension * (w / h)), height: maxDimension }
    }
    return { width, height }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
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
          isGeneratingImage={isGeneratingImage}
          generatingImageSize={getGeneratingImageSize()}
          images={images}
          isLoading={isLoading}
        />
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
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
          steps={steps}
          setSteps={setSteps}
          setModelSidebarOpen={setModelSidebarOpen}
          session={session}
          credits={credits}
        />
      </div>
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} session={session} credits={credits} />
      <ModelSidebarMenu
        isOpen={modelSidebarOpen}
        onClose={() => setModelSidebarOpen(false)}
        onSelectModel={handleModelChange}
        currentModel={model}
      />
      <ImageDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        image={selectedImage}
      />
      <FullScreenImageView
        images={images || []}
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={handleFullScreenNavigate}
      />
    </div>
  )
}

export default ImageGenerator