import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modelConfigs } from '@/utils/modelConfigs'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { useUserCredits } from '@/hooks/useUserCredits'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'
import { deleteImageCompletely } from '@/integrations/supabase/imageUtils'
import ImageGeneratorSettings from '@/components/ImageGeneratorSettings'
import ImageGallery from '@/components/ImageGallery'
import BottomNavbar from '@/components/BottomNavbar'
import ProfileMenu from '@/components/ProfileMenu'
import ActionButtons from '@/components/ActionButtons'

const aspectRatios = {
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1024, height: 768 },
  "3:4": { width: 768, height: 1024 },
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
  "3:2": { width: 1024, height: 683 },
  "2:3": { width: 683, height: 1024 },
  "5:4": { width: 1024, height: 819 },
  "4:5": { width: 819, height: 1024 },
  "21:9": { width: 1024, height: 439 },
  "9:21": { width: 439, height: 1024 },
  "1.91:1": { width: 1024, height: 536 },
  "1:1.91": { width: 536, height: 1024 },
  "1:2": { width: 512, height: 1024 },
  "2:1": { width: 1024, height: 512 },
}

const qualityOptions = {
  "SD": 512,
  "HD": 1024,
  "HD+": 1536,
  "4K": 2048,
}

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
          {session && (
            <div className="hidden md:flex items-center space-x-2">
              <ProfileMenu user={session.user} credits={credits} />
              <ActionButtons
                activeView={activeView}
                setActiveView={setActiveView}
              />
            </div>
          )}
        </div>
        <ImageGallery
          activeView={activeView}
          userId={session?.user?.id}
          onImageClick={handleImageClick}
          onRemix={handleRemix}
          onDownload={handleDownload}
          onDiscard={handleDiscard}
          onViewDetails={handleViewDetails}
        />
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
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
    </div>
  )
}

export default ImageGenerator
