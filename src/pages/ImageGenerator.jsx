import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreVertical } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { modelConfigs } from '@/utils/modelConfigs'
import Masonry from 'react-masonry-css'
import BottomNavbar from '@/components/BottomNavbar'
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ModelSidebarMenu from '@/components/ModelSidebarMenu'
import { Skeleton } from "@/components/ui/skeleton"
import ImageDetailsDialog from '@/components/ImageDetailsDialog'
import FullScreenImageView from '@/components/FullScreenImageView'
import SignInDialog from '@/components/SignInDialog'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import AuthOverlay from '@/components/AuthOverlay'
import { useUserCredits } from '@/hooks/useUserCredits'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/supabase'
import { deleteImageFromSupabase } from '@/integrations/supabase/imageUtils'

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

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

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
  const queryClient = useQueryClient()

  useEffect(() => {
    updateDimensions()
  }, [aspectRatio, quality, useAspectRatio])

  const updateDimensions = () => {
    const maxSize = qualityOptions[quality]
    let newWidth, newHeight

    if (useAspectRatio) {
      const ratio = aspectRatios[aspectRatio]
      if (ratio.width > ratio.height) {
        newWidth = maxSize
        newHeight = Math.round((maxSize / ratio.width) * ratio.height)
      } else {
        newHeight = maxSize
        newWidth = Math.round((maxSize / ratio.height) * ratio.width)
      }
    } else {
      newWidth = Math.min(width, maxSize)
      newHeight = Math.min(height, maxSize)
    }

    setWidth(Math.floor(newWidth / 8) * 8)
    setHeight(Math.floor(newHeight / 8) * 8)
  }

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
          image_url: publicURL.publicUrl,
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
      await deleteImageFromSupabase(imageId)
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

    const metadata = {
      prompt: modifiedPrompt,
      seed: actualSeed,
      width,
      height,
      steps,
      model,
      quality,
      aspect_ratio: useAspectRatio ? aspectRatio : `${width}:${height}`,
    }

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
      // Update credits before generating the image
      await updateCredits(quality)

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

      // Upload the image to Supabase storage and save metadata
      await uploadImageMutation.mutateAsync({ imageBlob, metadata })

      toast.success(`Image generated successfully. ${creditCost} credits used.`)
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
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
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${prompt.slice(0, 20)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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
            <div className="hidden md:block">
              <ProfileMenu user={session.user} credits={credits} />
            </div>
          )}
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto"
          columnClassName="bg-clip-padding px-2"
        >
          {imagesLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="w-full h-64" />
              </div>
            ))
          ) : (
            generatedImages?.map((image, index) => (
              <div key={image.id} className="mb-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                    <img 
                      src={image.image_url} 
                      alt={image.prompt} 
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    />
                  </CardContent>
                </Card>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm truncate w-[70%] mr-2">{image.prompt}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(image.image_url, image.prompt)}>
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDiscard(image.id)}>
                        Discard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemix(image)}>
                        Remix
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(image)}>
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </Masonry>
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!session && <AuthOverlay />}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <div className="text-sm font-medium">
            Credits: {credits}
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptInput">Prompt</Label>
            <Textarea
              id="promptInput"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
              placeholder="Enter your prompt here"
              className="min-h-[100px] resize-y"
            />
          </div>
          <Button onClick={generateImage} className="w-full" disabled={!session}>
            Generate Image
          </Button>
          <div className="space-y-2">
            <Label htmlFor="modelSelect">Model</Label>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setModelSidebarOpen(true)}
            >
              {modelConfigs[model].name}
              <span className="ml-2 opacity-50">{modelConfigs[model].category}</span>
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seedInput">Seed</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="seedInput"
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value))}
                disabled={randomizeSeed}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="randomizeSeed"
                  checked={randomizeSeed}
                  onCheckedChange={setRandomizeSeed}
                />
                <Label htmlFor="randomizeSeed">Random</Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Quality</Label>
            <Tabs value={quality} onValueChange={setQuality}>
              <TabsList className="grid grid-cols-4 w-full">
                {Object.keys(qualityOptions).map((q) => (
                  <TabsTrigger key={q} value={q}>{q}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Use Aspect Ratio</Label>
              <Switch
                checked={useAspectRatio}
                onCheckedChange={setUseAspectRatio}
              />
            </div>
            {useAspectRatio && (
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(aspectRatios).map((ratio) => (
                  <Button
                    key={ratio}
                    variant={aspectRatio === ratio ? "default" : "outline"}
                    className="w-full text-xs py-1 px-2"
                    onClick={() => setAspectRatio(ratio)}
                  >
                    {ratio}
                  </Button>
                ))}
              </div>
            )}
            {!useAspectRatio && (
              <>
                <div className="space-y-2">
                  <Label>Width: {width}px</Label>
                  <Slider
                    min={256}
                    max={qualityOptions[quality]}
                    step={8}
                    value={[width]}
                    onValueChange={(value) => setWidth(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height: {height}px</Label>
                  <Slider
                    min={256}
                    max={qualityOptions[quality]}
                    step={8}
                    value={[height]}
                    onValueChange={(value) => setHeight(value[0])}
                  />
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label>Inference Steps</Label>
            <Tabs value={steps.toString()} onValueChange={(value) => setSteps(parseInt(value))}>
              <TabsList className="grid grid-cols-5 w-full">
                {modelConfigs[model].inferenceSteps.map((step) => (
                  <TabsTrigger key={step} value={step.toString()}>
                    {step}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
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
        images={generatedImages || []}
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={handleFullScreenNavigate}
      />
    </div>
  )
}

export default ImageGenerator