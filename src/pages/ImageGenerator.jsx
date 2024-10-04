import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modelConfigs } from '@/utils/modelConfigs'
import { aspectRatios, qualityOptions } from '@/utils/imageConfigs'
import Masonry from 'react-masonry-css'
import BottomNavbar from '@/components/BottomNavbar'
import ModelSidebarMenu from '@/components/ModelSidebarMenu'
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import AuthOverlay from '@/components/AuthOverlay'
import { useUserCredits } from '@/hooks/useUserCredits'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/supabase'
import ProfileMenu from '@/components/ProfileMenu'
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import MyImages from '@/components/MyImages'
import Inspiration from '@/components/Inspiration'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ActionButtons from '@/components/ActionButtons'

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
  const { session } = useSupabaseAuth()
  const { credits, updateCredits } = useUserCredits(session?.user?.id)
  const [isGenerating, setIsGenerating] = useState(false)
  const queryClient = useQueryClient()
  const [activeView, setActiveView] = useState('myImages')

  useEffect(() => {
    if (useAspectRatio) {
      const { width: w, height: h } = aspectRatios[aspectRatio]
      const scaleFactor = qualityOptions[quality] / Math.max(w, h)
      setWidth(Math.round(w * scaleFactor))
      setHeight(Math.round(h * scaleFactor))
    }
  }, [aspectRatio, useAspectRatio, quality])

  const { data: generatedImages, isLoading: imagesLoading } = useQuery({
    queryKey: ['userImages', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      const { data, error } = await supabase
        .from('user_images')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  const uploadImageMutation = useMutation({
    mutationFn: async ({ imageBlob, metadata }) => {
      const filePath = `${session.user.id}/${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, imageBlob)
      if (uploadError) throw uploadError

      const { data: publicURL } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath)

      const { error: insertError } = await supabase
        .from('user_images')
        .insert({
          user_id: session.user.id,
          storage_path: filePath,
          ...metadata,
        })
      if (insertError) throw insertError
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userImages', session?.user?.id])
    },
    onError: (error) => {
      console.error('Error uploading image:', error)
      toast.error('Failed to save image. Please try again.')
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId) => {
      await deleteImageCompletely(imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userImages', session?.user?.id])
      toast.success('Image deleted successfully')
    },
    onError: (error) => {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image. Please try again.')
    },
  })

  const generateImage = async () => {
    if (!session) {
      console.log('User not authenticated')
      return
    }

    if (!prompt) {
      toast.error('Please enter a prompt')
      return
    }

    const creditCost = {
      "SD": 1,
      "HD": 2,
      "HD+": 3,
      "4K": 4
    }[quality]

    if (credits < creditCost) {
      toast.error(`Insufficient credits. You need ${creditCost} credits for ${quality} quality.`)
      return
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed
    setSeed(actualSeed)

    let modifiedPrompt = prompt;

    if (modelConfigs[model].promptSuffix) {
      modifiedPrompt += modelConfigs[model].promptSuffix;
    }

    setIsGenerating(true)

    if (window.innerWidth <= 768) {
      setActiveTab('images')
    }

    const data = {
      inputs: modifiedPrompt,
      parameters: {
        seed: actualSeed,
        width,
        height,
        num_inference_steps: steps
      }
    }

    try {
      const response = await fetch(
        modelConfigs[model].apiUrl,
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      )
      const imageBlob = await response.blob()

      await updateCredits(quality)

      await uploadImageMutation.mutateAsync({ 
        imageBlob, 
        metadata: {
          prompt: modifiedPrompt,
          seed: actualSeed,
          width,
          height,
          steps,
          model,
          quality,
          aspect_ratio: useAspectRatio ? aspectRatio : `${width}:${height}`,
        }
      })

      toast.success(`Image generated successfully. ${creditCost} credits used.`)
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

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

  const handleDownload = (imageUrl, prompt) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${prompt.slice(0, 20)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        toast.error('Failed to download image. Please try again.');
      });
  };

  const handleDiscard = (id) => {
    deleteImageMutation.mutate(id)
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

  const handleViewDetails = (image) => {
    setSelectedImage(image)
    setDetailsDialogOpen(true)
  }

  const handleImageClick = (index) => {
    setFullScreenImageIndex(index)
    setFullScreenViewOpen(true)
  }

  const handleFullScreenNavigate = (direction) => {
    if (direction === 'prev' && fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1)
    } else if (direction === 'next' && fullScreenImageIndex < generatedImages.length - 1) {
      setFullScreenImageIndex(fullScreenImageIndex + 1)
    }
  }

  const SkeletonImageCard = () => (
    <div className="mb-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative" style={{ paddingTop: `${(height / width) * 100}%` }}>
          <Skeleton className="absolute inset-0 w-full h-full" />
        </CardContent>
      </Card>
      <div className="mt-2 flex items-center justify-between">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )

  const handleViewChange = (view) => {
    setActiveView(view)
    if (window.innerWidth <= 768) {
      setActiveTab('images')
    }
  }


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
          {session && (
            <div className="hidden md:flex items-center space-x-2">
              <ProfileMenu user={session.user} credits={credits} />
              <ActionButtons activeView={activeView} setActiveView={setActiveView} />
            </div>
          )}
        </div>
        {activeView === 'myImages' && (
          <MyImages
            userId={session?.user?.id}
            onImageClick={(index) => {
              setFullScreenImageIndex(index)
              setFullScreenViewOpen(true)
            }}
            onDownload={handleDownload}
            onDiscard={handleDiscard}
            onRemix={handleRemix}
            onViewDetails={handleViewDetails}
          />
        )}
        {activeView === 'inspiration' && (
          <Inspiration
            userId={session?.user?.id}
            onImageClick={(index) => {
              setFullScreenImageIndex(index)
              setFullScreenViewOpen(true)
            }}
            onDownload={handleDownload}
            onRemix={handleRemix}
            onViewDetails={handleViewDetails}
          />
        )}
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
          steps={steps}
          setSteps={setSteps}
          aspectRatios={aspectRatios}
          qualityOptions={qualityOptions}
          modelConfigs={modelConfigs}
          session={session}
          credits={credits}
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
        images={activeView === 'myImages' ? generatedImages : inspirationImages}
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={handleFullScreenNavigate}
        onDownload={handleDownload}
        onDiscard={activeView === 'myImages' ? handleDiscard : undefined}
        onRemix={handleRemix}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}

export default ImageGenerator