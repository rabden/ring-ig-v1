import React, { useState } from 'react'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import { useImageGeneration } from '@/hooks/useImageGeneration'
import { useQueryClient } from '@tanstack/react-query'
import AuthOverlay from '@/components/AuthOverlay'
import BottomNavbar from '@/components/BottomNavbar'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ImageGallery from '@/components/ImageGallery'
import ModelSidebarMenu from '@/components/ModelSidebarMenu'
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import ProfileMenu from '@/components/ProfileMenu'
import SkeletonImageCard from '@/components/SkeletonImageCard'
import { modelConfigs, aspectRatios } from '@/utils/imageConfigs'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(modelConfigs.flux.defaultStep)
  const [model, setModel] = useState('flux')
  const [activeTab, setActiveTab] = useState('images')
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [useAspectRatio, setUseAspectRatio] = useState(true)
  const [quality, setQuality] = useState("HD")
  const [modelSidebarOpen, setModelSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false)
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const { session } = useSupabaseAuth()
  const { credits, updateCredits } = useUserCredits(session?.user?.id)
  const queryClient = useQueryClient()

  const { generateImage, isGenerating } = useImageGeneration({
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

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true)
    setActiveTab('images')
    await generateImage()
    setIsGeneratingImage(false)
  }

  const handleImageClick = (image, index) => {
    setSelectedImage(image)
    setFullScreenImageIndex(index)
    setFullScreenViewOpen(true)
  }

  const handleModelChange = (value) => {
    setModel(value)
    setSteps(modelConfigs[value].defaultStep)
  }

  const handlePromptKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerateImage()
    }
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
        {isGeneratingImage && (
          <div className="mb-4">
            <SkeletonImageCard width={width} height={height} />
          </div>
        )}
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
        images={[]}  // Pass an empty array or fetch images from a query
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={() => {}}  // Implement navigation logic if needed
      />
    </div>
  )
}

export default ImageGenerator