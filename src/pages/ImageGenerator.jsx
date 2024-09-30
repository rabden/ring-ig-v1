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
import ProfileMenu from '@/components/ProfileMenu'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import AuthOverlay from '@/components/AuthOverlay'
import { supabase } from '@/integrations/supabase/supabase'
import { toast } from 'sonner'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000))
  const [randomizeSeed, setRandomizeSeed] = useState(true)
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [steps, setSteps] = useState(20)
  const [model, setModel] = useState('flux')
  const [quality, setQuality] = useState('SD')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [useAspectRatio, setUseAspectRatio] = useState(true)
  const [generatedImages, setGeneratedImages] = useState([])
  const [activeTab, setActiveTab] = useState('input')
  const [modelSidebarOpen, setModelSidebarOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState(0)
  const [fullScreenViewOpen, setFullScreenViewOpen] = useState(false)

  const { session } = useSupabaseAuth() || {}
  const user = session?.user
  const queryClient = useQueryClient()

  const qualityOptions = {
    SD: { size: 512, cost: 1 },
    HD: { size: 1024, cost: 2 },
    '4K': { size: 2048, cost: 3 },
    '8K': { size: 4096, cost: 4 }
  }

  const aspectRatios = {
    "1:1": { width: 1, height: 1 },
    "4:3": { width: 4, height: 3 },
    "3:2": { width: 3, height: 2 },
    "16:9": { width: 16, height: 9 },
    "2:1": { width: 2, height: 1 },
  }

  useEffect(() => {
    updateDimensions()
  }, [aspectRatio, quality, useAspectRatio])

  const updateDimensions = () => {
    const maxSize = qualityOptions[quality].size
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

  const fetchOrCreateUserCredits = async (userId) => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credit_count')
      .eq('user_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('user_credits')
        .insert({ user_id: userId, credit_count: 100 })
        .select('credit_count')
        .single()

      if (insertError) {
        console.error('Error creating user credits:', insertError)
        throw insertError
      }

      return newData.credit_count
    } else if (error) {
      console.error('Error fetching user credits:', error)
      throw error
    }

    return data.credit_count
  }

  const { data: userCredits, isLoading: isLoadingCredits, refetch: refetchCredits } = useQuery({
    queryKey: ['userCredits', user?.id],
    queryFn: () => fetchOrCreateUserCredits(user?.id),
    enabled: !!user,
  })

  const updateUserCredits = useMutation({
    mutationFn: async (newCredits) => {
      const { data, error } = await supabase
        .from('user_credits')
        .update({ credit_count: newCredits })
        .eq('user_id', user.id)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userCredits', user?.id])
    },
  })

  const generateImage = async () => {
    if (!user) {
      toast.error("Please sign in to generate images")
      return
    }

    if (!prompt) {
      toast.error('Please enter a prompt')
      return
    }

    const requiredCredits = qualityOptions[quality].cost
    if (userCredits < requiredCredits) {
      toast.error(`Insufficient credits. You need ${requiredCredits} credits for this quality.`)
      return
    }

    const actualSeed = randomizeSeed ? Math.floor(Math.random() * 1000000) : seed
    setSeed(actualSeed)

    let modifiedPrompt = prompt;

    if (modelConfigs[model].promptSuffix) {
      modifiedPrompt += modelConfigs[model].promptSuffix;
    }

    const newImage = {
      id: Date.now(),
      prompt: modifiedPrompt,
      seed: actualSeed,
      width,
      height,
      steps,
      model,
      quality,
      aspectRatio: useAspectRatio ? aspectRatio : `${width}:${height}`,
      loading: true,
    }

    setGeneratedImages(prev => [newImage, ...prev])

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
      const result = await response.blob()
      const imageUrl = URL.createObjectURL(result)

      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === newImage.id ? { ...img, loading: false, imageUrl } : img
        )
      )

      await updateUserCredits.mutateAsync(userCredits - requiredCredits)
      toast.success(`Image generated! ${requiredCredits} credits used.`)
    } catch (error) {
      console.error('Error generating image:', error)
      setGeneratedImages(prev =>
        prev.map(img =>
          img.id === newImage.id ? { ...img, loading: false, error: true } : img
        )
      )
      toast.error('Error generating image. Please try again.')
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
    setGeneratedImages(prev => prev.filter(img => img.id !== id))
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
    setAspectRatio(image.aspectRatio)
    setUseAspectRatio(image.aspectRatio in aspectRatios)
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

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 2
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      <div className={`flex-grow p-6 overflow-y-auto ${activeTab === 'images' ? 'block' : 'hidden md:block'} md:pr-[350px] pb-20 md:pb-6`}>
        <div className="flex justify-between items-center mb-6">
          {user ? <ProfileMenu user={user} credits={userCredits} /> : <SignInDialog />}
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex w-auto"
          columnClassName="bg-clip-padding px-2"
        >
          {generatedImages.map((image, index) => (
            <div key={image.id} className="mb-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0 relative" style={{ paddingTop: `${(image.height / image.width) * 100}%` }}>
                  {image.loading ? (
                    <Skeleton className="absolute inset-0" />
                  ) : image.error ? (
                    <div className="absolute inset-0 flex items-center justify-center text-destructive">
                      Error generating image
                    </div>
                  ) : (
                    <img 
                      src={image.imageUrl} 
                      alt={image.prompt} 
                      className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                      onClick={() => handleImageClick(index)}
                    />
                  )}
                </CardContent>
              </Card>
              <div className="mt-2 flex items-center justify-between">
                {image.loading ? (
                  <Skeleton className="h-4 w-[70%]" />
                ) : (
                  <p className="text-sm truncate w-[70%] mr-2">{image.prompt}</p>
                )}
                {image.loading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(image.imageUrl, image.prompt)}>
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
                )}
              </div>
            </div>
          ))}
        </Masonry>
      </div>
      <div className={`w-full md:w-[350px] bg-card text-card-foreground p-6 overflow-y-auto ${activeTab === 'input' ? 'block' : 'hidden md:block'} md:fixed md:right-0 md:top-0 md:bottom-0 max-h-[calc(100vh-56px)] md:max-h-screen relative`}>
        {!user && <AuthOverlay />}
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
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
          <Button 
            onClick={generateImage} 
            className="w-full" 
            disabled={!user || isLoadingCredits || (userCredits !== undefined && userCredits < qualityOptions[quality].cost)}
          >
            Generate Image ({qualityOptions[quality].cost} credits)
          </Button>
          {user && !isLoadingCredits && (
            <p className="text-sm text-muted-foreground">
              Available credits: {userCredits}
            </p>
          )}
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
                    max={qualityOptions[quality].size}
                    step={8}
                    value={[width]}
                    onValueChange={(value) => setWidth(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height: {height}px</Label>
                  <Slider
                    min={256}
                    max={qualityOptions[quality].size}
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
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
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
        images={generatedImages}
        currentIndex={fullScreenImageIndex}
        isOpen={fullScreenViewOpen}
        onClose={() => setFullScreenViewOpen(false)}
        onNavigate={handleFullScreenNavigate}
      />
    </div>
  )
}

export default ImageGenerator
