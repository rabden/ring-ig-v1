import React, { useState } from 'react'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { useQueryClient } from '@tanstack/react-query'
import ImageGallery from '@/components/ImageGallery'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import BottomNavbar from '@/components/BottomNavbar'
import ModelSidebarMenu from '@/components/ModelSidebarMenu'
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import AuthOverlay from '@/components/AuthOverlay'
import ProfileMenu from '@/components/ProfileMenu'

const ImageGenerator = () => {
  const [activeTab, setActiveTab] = useState('images')
  const [modelSidebarOpen, setModelSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false)
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0)

  const { session } = useSupabaseAuth()
  const { credits, updateCredits } = useUserCredits(session?.user?.id)
  const queryClient = useQueryClient()

  const {
    prompt, setPrompt, seed, setSeed, randomizeSeed, setRandomizeSeed,
    width, setWidth, height, setHeight, steps, setSteps, model, setModel,
    quality, setQuality, useAspectRatio, setUseAspectRatio, aspectRatio, setAspectRatio,
    generateImage, isGenerating
  } = useImageGeneration({ session, updateCredits, queryClient })

  const handleModelChange = (value) => {
    setModel(value)
    setSteps(modelConfigs[value].defaultStep)
  }

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      generateImage()
    }
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setFullScreenViewOpen(true)
  }

  const handleRemix = (image) => {
    setPrompt(image.prompt)
    setSeed(image.seed)
    setRandomizeSeed(false)
    setWidth(image.width)
    setHeight(image.height)
    setSteps(image.steps)
    setModel(image.model)
    setQuality(image.quality)
    setAspectRatio(image.aspect_ratio)
    setUseAspectRatio(image.aspect_ratio in aspectRatios)
    setActiveTab('input')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
          {session && (
            <div className="hidden md:block">
              <ProfileMenu user={session.user} credits={credits} />
            </div>
          )}
        </div>
        <ImageGallery
          userId={session?.user?.id}
          onImageClick={handleImageClick}
          onRemix={handleRemix}
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
          generateImage={generateImage}
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
        images={selectedImage ? [selectedImage] : []}
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={() => {}}
      />
    </div>
  )
}

export default ImageGenerator